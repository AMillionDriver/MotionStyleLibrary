import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { resolve } from 'node:path';
import { validateClassVariableRelations } from './generate-metadata.mjs';

function createFixture(relatedVariables = []) {
  return {
    classes: [
      {
        name: 'axo-reel',
        relatedVariables,
      },
    ],
    variables: [
      { name: '--axo-reel-item-width' },
      { name: '--axo-reel-gap' },
      { name: '--axo-reel-padding' },
    ],
  };
}

test('requires an explicit relatedVariables array for every class', () => {
  const fixture = createFixture();
  delete fixture.classes[0].relatedVariables;

  assert.throws(() => validateClassVariableRelations(fixture), /Missing relatedVariables array/);
});

test('rejects unknown related variables', () => {
  const fixture = createFixture(['--axo-reel-missing']);

  assert.throws(() => validateClassVariableRelations(fixture), /Unknown related variable/);
});

test('rejects duplicate related variables', () => {
  const fixture = createFixture(['--axo-reel-gap', '--axo-reel-gap']);

  assert.throws(() => validateClassVariableRelations(fixture), /Duplicate related variable/);
});

test('keeps the public axo-reel guidance contract', () => {
  const registry = JSON.parse(
    readFileSync(resolve(import.meta.dirname, '../metadata/registry.json'), 'utf8')
  );
  const reel = registry.classes.find((entry) => entry.name === 'axo-reel');

  assert.deepEqual(reel.relatedVariables, [
    '--axo-reel-item-width',
    '--axo-reel-gap',
    '--axo-reel-padding',
  ]);
  assert.doesNotThrow(() => validateClassVariableRelations(registry));
});
