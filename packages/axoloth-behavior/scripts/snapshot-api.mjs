import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createBehaviorBaseline } from './api-contract.mjs';

const packageDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const packageData = JSON.parse(readFileSync(resolve(packageDirectory, 'package.json'), 'utf8'));
const registry = JSON.parse(
  readFileSync(resolve(packageDirectory, 'metadata/registry.json'), 'utf8')
);
const target = resolve(packageDirectory, 'metadata/api-baseline.json');

if (existsSync(target) && !process.argv.includes('--force')) {
  throw new Error('Behavior API baseline exists. Review the release, then rerun with --force.');
}

const baseline = createBehaviorBaseline(registry, packageData, packageData.version);
writeFileSync(target, `${JSON.stringify(baseline, null, 2)}\n`);
console.log(
  `Captured behavior baseline ${baseline.baselineVersion}: ${baseline.exports.length} exports, ${baseline.initializers.length} initializers, ${baseline.dataAttributes.length} attributes, and ${baseline.events.length} events.`
);
