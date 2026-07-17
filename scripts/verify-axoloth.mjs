import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const npmCliPath = process.env.npm_execpath;
const npmCacheDirectory = resolve(repositoryDirectory, 'tmp/axoloth-npm-cache');
if (!npmCliPath) throw new Error('Run this verifier through npm run verify:axoloth.');
mkdirSync(npmCacheDirectory, { recursive: true });
const steps = [
  {
    name: 'Root lint',
    directory: repositoryDirectory,
    arguments: ['run', 'lint'],
  },
  {
    name: 'Root build',
    directory: repositoryDirectory,
    arguments: ['run', 'build'],
  },
  {
    name: 'Style metadata and API contract checks',
    directory: resolve(repositoryDirectory, 'packages/axoloth-style'),
    arguments: ['run', 'check'],
  },
  {
    name: 'Style package dry run',
    directory: resolve(repositoryDirectory, 'packages/axoloth-style'),
    arguments: ['pack', '--dry-run'],
  },
  {
    name: 'Behavior source and API contract checks',
    directory: resolve(repositoryDirectory, 'packages/axoloth-behavior'),
    arguments: ['run', 'check'],
  },
  {
    name: 'Behavior package dry run',
    directory: resolve(repositoryDirectory, 'packages/axoloth-behavior'),
    arguments: ['pack', '--dry-run'],
  },
  {
    name: 'Docs catalog checks',
    directory: resolve(repositoryDirectory, 'web_examples'),
    arguments: ['run', 'check'],
  },
  {
    name: 'Accessibility tests',
    directory: repositoryDirectory,
    arguments: ['run', 'test:a11y'],
  },
  {
    name: 'Visual regression tests',
    directory: repositoryDirectory,
    arguments: ['run', 'test:visual'],
  },
  {
    name: 'IntelliSense tests',
    directory: resolve(repositoryDirectory, 'packages/axoloth-intellisense'),
    arguments: ['test'],
  },
  {
    name: 'IntelliSense VSIX package',
    directory: resolve(repositoryDirectory, 'packages/axoloth-intellisense'),
    arguments: ['run', 'package'],
  },
];

for (const step of steps) {
  console.log(`\n=== ${step.name} ===`);
  const result = spawnSync(process.execPath, [npmCliPath, ...step.arguments], {
    cwd: step.directory,
    env: {
      ...process.env,
      npm_config_cache: npmCacheDirectory,
    },
    stdio: 'inherit',
  });

  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log('\nAxoloth verification completed successfully.');
