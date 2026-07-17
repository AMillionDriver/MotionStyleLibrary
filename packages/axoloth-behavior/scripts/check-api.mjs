import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateBehaviorContract } from './api-contract.mjs';
import { collectBehaviorSourceApi } from './collect-source-api.mjs';

const packageDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));

try {
  const result = validateBehaviorContract({
    baseline: readJson(resolve(packageDirectory, 'metadata/api-baseline.json')),
    deprecations: readJson(resolve(packageDirectory, 'metadata/deprecations.json')),
    packageData: readJson(resolve(packageDirectory, 'package.json')),
    registry: readJson(resolve(packageDirectory, 'metadata/registry.json')),
    sourceApi: await collectBehaviorSourceApi({ packageDirectory }),
  });

  console.log(
    `Behavior API verified against ${result.baselineVersion}: ${result.exports} exports, ${result.initializers} initializers, ${result.dataAttributes} data attributes, ${result.events} events, ${result.aliases} aliases, and ${result.removed} removals.`
  );
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
