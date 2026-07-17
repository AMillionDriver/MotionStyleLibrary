import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateArtifacts } from '../../axoloth-style/scripts/generate-metadata.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const classesSource = resolve(__dirname, '../../axoloth-style/metadata/classes.json');
const classesTarget = resolve(__dirname, '../data/classes.json');
const variablesSource = resolve(__dirname, '../../axoloth-style/metadata/variables.json');
const variablesTarget = resolve(__dirname, '../data/variables.json');
const behaviorRegistrySource = resolve(__dirname, '../../axoloth-behavior/metadata/registry.json');
const behaviorRegistryTarget = resolve(__dirname, '../data/behavior.registry.json');
const behaviorDeprecationsSource = resolve(
  __dirname,
  '../../axoloth-behavior/metadata/deprecations.json'
);
const behaviorDeprecationsTarget = resolve(__dirname, '../data/behavior.deprecations.json');
const customDataTarget = resolve(__dirname, '../data/css.customData.json');

generateArtifacts({ quiet: true });

mkdirSync(dirname(classesTarget), { recursive: true });
copyFileSync(classesSource, classesTarget);
copyFileSync(variablesSource, variablesTarget);
copyFileSync(behaviorRegistrySource, behaviorRegistryTarget);
copyFileSync(behaviorDeprecationsSource, behaviorDeprecationsTarget);

const variablesData = JSON.parse(readFileSync(variablesSource, 'utf8'));
const customData = {
  version: 1.1,
  properties: variablesData.variables.map((variable) => ({
    name: variable.name,
    description: [
      variable.status === 'deprecated'
        ? `DEPRECATED: use ${variable.deprecation.replacement}. Earliest removal: ${variable.deprecation.removeIn}.`
        : undefined,
      variable.description,
      `Default: ${variable.default}`,
      variable.valueType ? `Value type: ${variable.valueType}` : undefined,
      `Module: ${variable.module}`,
    ]
      .filter(Boolean)
      .join('\n\n'),
    values: variable.valueSuggestions?.map((suggestion) => ({
      name: suggestion.value,
      description: suggestion.description,
    })),
  })),
};

writeFileSync(customDataTarget, `${JSON.stringify(customData, null, 2)}\n`);

console.log(`Synced ${classesSource} -> ${classesTarget}`);
console.log(`Synced ${variablesSource} -> ${variablesTarget}`);
console.log(`Synced ${behaviorRegistrySource} -> ${behaviorRegistryTarget}`);
console.log(`Synced ${behaviorDeprecationsSource} -> ${behaviorDeprecationsTarget}`);
console.log(`Generated ${customDataTarget}`);
