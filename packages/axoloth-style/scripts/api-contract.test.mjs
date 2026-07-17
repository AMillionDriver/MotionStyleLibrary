import assert from 'node:assert/strict';
import test from 'node:test';
import { decorateRegistry, validateApiContract } from './api-contract.mjs';

function createFixture(version = '0.6.0') {
  return {
    packageData: {
      name: '@quertys/axoloth-style',
      version,
      exports: {
        './axoloth.css': './src/axoloth.css',
        './layout.css': './src/layout.css',
      },
    },
    registry: {
      name: '@quertys/axoloth-style',
      version,
      classes: [{ name: 'axo-old' }, { name: 'axo-new' }],
      variables: [{ name: '--axo-gap' }],
    },
    baseline: {
      schemaVersion: 1,
      name: '@quertys/axoloth-style',
      baselineVersion: '0.5.0',
      classes: ['axo-old'],
      exports: ['./axoloth.css'],
      variables: ['--axo-gap'],
    },
    deprecations: {
      schemaVersion: 1,
      name: '@quertys/axoloth-style',
      deprecations: [],
    },
  };
}

function createRecord(overrides = {}) {
  return {
    kind: 'class',
    name: 'axo-old',
    replacement: 'axo-new',
    deprecatedIn: '0.6.0',
    removeIn: '0.7.0',
    status: 'alias',
    note: 'Use axo-new.',
    ...overrides,
  };
}

test('allows additive API changes', () => {
  const fixture = createFixture();
  const result = validateApiContract(fixture);

  assert.equal(result.classes, 2);
  assert.equal(result.aliases, 0);
});

test('rejects removal without a deprecation record', () => {
  const fixture = createFixture();
  fixture.registry.classes = [{ name: 'axo-new' }];

  assert.throws(() => validateApiContract(fixture), /removed without a deprecation record/);
});

test('rejects removal of a package export', () => {
  const fixture = createFixture();
  delete fixture.packageData.exports['./axoloth.css'];

  assert.throws(() => validateApiContract(fixture), /Public export removed/);
});

test('requires a deprecated alias to remain public', () => {
  const fixture = createFixture();
  fixture.registry.classes = [{ name: 'axo-new' }];
  fixture.deprecations.deprecations = [createRecord()];

  assert.throws(() => validateApiContract(fixture), /must remain public/);
});

test('allows a recorded removal at its removal version', () => {
  const fixture = createFixture('0.7.0');
  fixture.registry.classes = [{ name: 'axo-new' }];
  fixture.deprecations.deprecations = [createRecord({ status: 'removed' })];

  const result = validateApiContract(fixture);
  assert.equal(result.removed, 1);
});

test('rejects a removal before its declared version', () => {
  const fixture = createFixture();
  fixture.registry.classes = [{ name: 'axo-new' }];
  fixture.deprecations.deprecations = [createRecord({ status: 'removed' })];

  assert.throws(() => validateApiContract(fixture), /cannot be removed before/);
});

test('rejects patch-release removals', () => {
  const fixture = createFixture('0.6.1');
  fixture.deprecations.deprecations = [createRecord({ removeIn: '0.6.1' })];

  assert.throws(() => validateApiContract(fixture), /not a patch release/);
});

test('enforces a full minor alias window after 1.0', () => {
  const fixture = createFixture('1.1.0');
  fixture.baseline.baselineVersion = '1.0.0';
  fixture.deprecations.deprecations = [createRecord({ deprecatedIn: '1.1.0', removeIn: '1.1.1' })];

  assert.throws(() => validateApiContract(fixture), /at least one minor release/);
});

test('decorates active and deprecated metadata for downstream tools', () => {
  const fixture = createFixture();
  fixture.deprecations.deprecations = [createRecord()];

  const decorated = decorateRegistry(fixture.registry, fixture.deprecations);
  assert.equal(decorated.classes[0].status, 'deprecated');
  assert.equal(decorated.classes[0].deprecation.replacement, 'axo-new');
  assert.equal(decorated.classes[1].status, 'active');
  assert.equal(decorated.variables[0].status, 'active');
});
