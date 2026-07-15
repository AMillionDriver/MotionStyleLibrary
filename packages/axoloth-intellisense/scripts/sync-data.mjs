import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const classesSource = resolve(__dirname, '../../axoloth-style/metadata/classes.json');
const classesTarget = resolve(__dirname, '../data/classes.json');
const variablesSource = resolve(__dirname, '../../axoloth-style/metadata/variables.json');
const variablesTarget = resolve(__dirname, '../data/variables.json');
const customDataTarget = resolve(__dirname, '../data/css.customData.json');

mkdirSync(dirname(classesTarget), { recursive: true });
copyFileSync(classesSource, classesTarget);
copyFileSync(variablesSource, variablesTarget);

const variablesData = JSON.parse(readFileSync(variablesSource, 'utf8'));
const customData = {
  version: 1.1,
  properties: variablesData.variables.map((variable) => ({
    name: variable.name,
    description: [
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
console.log(`Generated ${customDataTarget}`);
