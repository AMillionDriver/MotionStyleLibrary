import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateApiContract } from './api-contract.mjs';

const packageDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));

try {
  const result = validateApiContract({
    baseline: readJson(resolve(packageDirectory, 'metadata/api-baseline.json')),
    deprecations: readJson(resolve(packageDirectory, 'metadata/deprecations.json')),
    packageData: readJson(resolve(packageDirectory, 'package.json')),
    registry: readJson(resolve(packageDirectory, 'metadata/registry.json')),
  });

  console.log(
    `API contract verified against ${result.baselineVersion}: ${result.classes} classes, ${result.variables} variables, ${result.exports} exports, ${result.aliases} deprecated aliases, and ${result.removed} removals.`
  );
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
