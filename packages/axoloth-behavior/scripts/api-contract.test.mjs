import assert from 'node:assert/strict';
import test from 'node:test';
import { validateBehaviorContract } from './api-contract.mjs';

function createFixture(version = '0.5.0') {
  const registry = {
    schemaVersion: 1,
    name: '@quertys/axoloth-behavior',
    version,
    initializers: [
      { name: 'initNew', description: 'New initializer.' },
      { name: 'initOld', description: 'Old initializer.' },
    ],
    dataAttributes: [
      { name: 'data-axo-new', description: 'New attribute.' },
      { name: 'data-axo-old', description: 'Old attribute.' },
    ],
    events: [
      { name: 'axo:new-open', description: 'New event.' },
      { name: 'axo:old-open', description: 'Old event.' },
    ],
  };

  return {
    packageData: {
      name: '@quertys/axoloth-behavior',
      version,
      exports: { '.': './src/index.js', './new': './src/new.js' },
    },
    registry,
    sourceApi: {
      initializers: registry.initializers.map((entry) => entry.name),
      dataAttributes: registry.dataAttributes.map((entry) => entry.name),
      events: registry.events.map((entry) => entry.name),
    },
    baseline: {
      schemaVersion: 1,
      name: '@quertys/axoloth-behavior',
      baselineVersion: '0.4.0',
      dataAttributes: ['data-axo-old'],
      events: ['axo:old-open'],
      exports: ['.'],
      initializers: ['initOld'],
    },
    deprecations: {
      schemaVersion: 1,
      name: '@quertys/axoloth-behavior',
      deprecations: [],
    },
  };
}

function createRecord(overrides = {}) {
  return {
    kind: 'initializer',
    name: 'initOld',
    replacement: 'initNew',
    deprecatedIn: '0.5.0',
    removeIn: '0.6.0',
    status: 'alias',
    note: 'Use initNew.',
    ...overrides,
  };
}

function removeRegistryEntry(fixture, collection, name) {
  fixture.registry[collection] = fixture.registry[collection].filter(
    (entry) => entry.name !== name
  );
  fixture.sourceApi[collection] = fixture.sourceApi[collection].filter((entry) => entry !== name);
}

test('allows additive behavior API', () => {
  const result = validateBehaviorContract(createFixture());
  assert.equal(result.initializers, 2);
  assert.equal(result.dataAttributes, 2);
});

test('rejects source API that is absent from the registry', () => {
  const fixture = createFixture();
  fixture.sourceApi.dataAttributes.push('data-axo-unregistered');
  assert.throws(() => validateBehaviorContract(fixture), /Data attributes missing from registry/);
});

test('rejects initializer removal without a deprecation record', () => {
  const fixture = createFixture();
  removeRegistryEntry(fixture, 'initializers', 'initOld');
  assert.throws(() => validateBehaviorContract(fixture), /Public initializer removed/);
});

test('rejects package export removal without a deprecation record', () => {
  const fixture = createFixture();
  delete fixture.packageData.exports['.'];
  assert.throws(() => validateBehaviorContract(fixture), /Public export removed/);
});

test('requires deprecated aliases to remain public', () => {
  const fixture = createFixture();
  removeRegistryEntry(fixture, 'initializers', 'initOld');
  fixture.deprecations.deprecations = [createRecord()];
  assert.throws(() => validateBehaviorContract(fixture), /must remain public/);
});

test('allows recorded removal at the declared minor version', () => {
  const fixture = createFixture('0.6.0');
  removeRegistryEntry(fixture, 'initializers', 'initOld');
  fixture.deprecations.deprecations = [createRecord({ status: 'removed' })];
  const result = validateBehaviorContract(fixture);
  assert.equal(result.removed, 1);
});

test('rejects removal before the declared version', () => {
  const fixture = createFixture();
  removeRegistryEntry(fixture, 'initializers', 'initOld');
  fixture.deprecations.deprecations = [createRecord({ status: 'removed' })];
  assert.throws(() => validateBehaviorContract(fixture), /cannot be removed before/);
});

test('rejects patch-release removal', () => {
  const fixture = createFixture('0.5.1');
  fixture.deprecations.deprecations = [createRecord({ removeIn: '0.5.1' })];
  assert.throws(() => validateBehaviorContract(fixture), /not a patch release/);
});

test('enforces a full minor alias window after 1.0', () => {
  const fixture = createFixture('1.1.0');
  fixture.baseline.baselineVersion = '1.0.0';
  fixture.deprecations.deprecations = [createRecord({ deprecatedIn: '1.1.0', removeIn: '1.1.1' })];
  assert.throws(() => validateBehaviorContract(fixture), /at least one minor release/);
});
