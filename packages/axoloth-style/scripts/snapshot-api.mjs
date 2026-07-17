import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApiBaseline } from './api-contract.mjs';

const packageDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const packageData = JSON.parse(readFileSync(resolve(packageDirectory, 'package.json'), 'utf8'));
const registry = JSON.parse(
  readFileSync(resolve(packageDirectory, 'metadata/registry.json'), 'utf8')
);
const target = resolve(packageDirectory, 'metadata/api-baseline.json');
const force = process.argv.includes('--force');

if (existsSync(target) && !force) {
  throw new Error('API baseline already exists. Review the release, then rerun with --force.');
}

const baseline = createApiBaseline(registry, packageData, packageData.version);
writeFileSync(target, `${JSON.stringify(baseline, null, 2)}\n`);
console.log(
  `Captured API baseline ${baseline.baselineVersion}: ${baseline.classes.length} classes, ${baseline.variables.length} variables, and ${baseline.exports.length} exports.`
);
