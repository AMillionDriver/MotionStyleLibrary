import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { resolve } from 'node:path';
import { createRelatedVariablesMarkdown, resolveRelatedVariables } from '../classVariableGuidance';

interface ClassEntry {
  name: string;
  usage: string;
  relatedVariables: string[];
}

interface VariableEntry {
  name: string;
  default: string;
  description: string;
}

const classesData = JSON.parse(
  readFileSync(resolve(process.cwd(), 'data/classes.json'), 'utf8')
) as {
  classes: ClassEntry[];
};
const variablesData = JSON.parse(
  readFileSync(resolve(process.cwd(), 'data/variables.json'), 'utf8')
) as { variables: VariableEntry[] };
const variableMap = new Map(variablesData.variables.map((entry) => [entry.name, entry]));

test('every class exposes explicit usage and resolvable related variables', () => {
  for (const entry of classesData.classes) {
    assert.ok(entry.usage, `Missing usage for ${entry.name}`);
    assert.ok(Array.isArray(entry.relatedVariables), `Missing relatedVariables for ${entry.name}`);
    assert.equal(
      resolveRelatedVariables(entry, variableMap).length,
      entry.relatedVariables.length,
      `Unresolved related variable for ${entry.name}`
    );
  }
});

test('axo-reel exposes its ordered customization contract', () => {
  const reel = classesData.classes.find((entry) => entry.name === 'axo-reel');
  assert.ok(reel);
  assert.deepEqual(reel.relatedVariables, [
    '--axo-reel-item-width',
    '--axo-reel-gap',
    '--axo-reel-padding',
  ]);
});

test('related-variable markdown includes names, defaults, descriptions, and override guidance', () => {
  const reel = classesData.classes.find((entry) => entry.name === 'axo-reel');
  assert.ok(reel);

  const markdown = createRelatedVariablesMarkdown(reel, variableMap);
  assert.match(markdown, /\*\*Related variables\*\*/);
  assert.match(markdown, /Override these variables on `\.axo-reel` or a containing scope\./);
  assert.match(markdown, /\.axo-reel \{/);

  for (const variableName of reel.relatedVariables) {
    const variable = variableMap.get(variableName);
    assert.ok(variable);
    assert.ok(markdown.includes(`\`${variable.name}\``));
    assert.ok(markdown.includes(`\`${variable.default}\``));
    assert.ok(markdown.includes(variable.description));
  }
});

test('classes without related variables do not render an empty section', () => {
  const entry = classesData.classes.find((candidate) => !candidate.relatedVariables.length);
  assert.ok(entry);
  assert.equal(createRelatedVariablesMarkdown(entry, variableMap), '');
});
