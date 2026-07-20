const API_COLLECTIONS = {
  class: 'classes',
  export: 'exports',
  variable: 'variables',
};

const FROZEN_PREFIXES = {
  class: 'axo-',
  dataAttribute: 'data-axo-',
  variable: '--axo-',
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

export function parseVersion(value, label = 'version') {
  const match = /^(\d+)\.(\d+)\.(\d+)(?:-[0-9A-Za-z.-]+)?$/.exec(value);
  assert(match, `Invalid ${label}: ${value}`);

  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
  };
}

export function compareVersions(leftValue, rightValue) {
  const left = typeof leftValue === 'string' ? parseVersion(leftValue) : leftValue;
  const right = typeof rightValue === 'string' ? parseVersion(rightValue) : rightValue;

  return left.major - right.major || left.minor - right.minor || left.patch - right.patch;
}

function assertUniqueNames(names, label) {
  assert(Array.isArray(names), `${label} must be an array.`);
  assert(names.length === new Set(names).size, `${label} contains duplicate names.`);
  assert(
    names.every((name) => typeof name === 'string' && name.length > 0),
    `${label} must contain non-empty strings.`
  );
}

function getCurrentNames(registry, packageData, kind) {
  if (kind === 'export') return new Set(Object.keys(packageData.exports ?? {}));
  return new Set(registry[API_COLLECTIONS[kind]].map((entry) => entry.name));
}

function getDeprecationKey(kind, name) {
  return `${kind}:${name}`;
}

function getExpectedDeprecatedPrefix(kind) {
  if (kind === 'class') return FROZEN_PREFIXES.class;
  if (kind === 'variable') return FROZEN_PREFIXES.variable;
  return './';
}

function assertFrozenPrefixes(registry) {
  assert(registry.prefixes, 'Utility registry must declare frozen public prefixes.');

  Object.entries(FROZEN_PREFIXES).forEach(([kind, prefix]) => {
    assert(registry.prefixes[kind] === prefix, `Registry ${kind} prefix must remain ${prefix}.`);
  });
}

function assertNamesUsePrefix(names, prefix, label) {
  names.forEach((name) => {
    assert(name.startsWith(prefix), `${label} must start with ${prefix}: ${name}`);
  });
}

export function createApiBaseline(registry, packageData, baselineVersion = registry.version) {
  parseVersion(baselineVersion, 'baseline version');

  return {
    schemaVersion: 1,
    name: registry.name,
    baselineVersion,
    stability: registry.stability,
    classes: registry.classes.map((entry) => entry.name).sort(),
    exports: Object.keys(packageData.exports ?? {}).sort(),
    variables: registry.variables.map((entry) => entry.name).sort(),
  };
}

export function validateApiContract({ baseline, deprecations, packageData, registry }) {
  assert(baseline.schemaVersion === 1, 'Unsupported API baseline schema version.');
  assert(deprecations.schemaVersion === 1, 'Unsupported deprecation schema version.');
  assert(
    baseline.name === packageData.name,
    'API baseline package name does not match package.json.'
  );
  assert(
    deprecations.name === packageData.name,
    'Deprecation registry package name does not match package.json.'
  );
  assert(
    registry.name === packageData.name,
    'Utility registry package name does not match package.json.'
  );
  assert(
    registry.version === packageData.version,
    'Utility registry version does not match package.json.'
  );
  assert(
    compareVersions(packageData.version, baseline.baselineVersion) >= 0,
    `Package ${packageData.version} predates API baseline ${baseline.baselineVersion}.`
  );
  assertFrozenPrefixes(registry);

  assertUniqueNames(baseline.classes, 'API baseline classes');
  assertUniqueNames(baseline.exports, 'API baseline exports');
  assertUniqueNames(baseline.variables, 'API baseline variables');
  assertNamesUsePrefix(baseline.classes, FROZEN_PREFIXES.class, 'API baseline class');
  assertNamesUsePrefix(baseline.variables, FROZEN_PREFIXES.variable, 'API baseline variable');
  assertNamesUsePrefix(
    registry.classes.map((entry) => entry.name),
    FROZEN_PREFIXES.class,
    'Public class'
  );
  assertNamesUsePrefix(
    registry.variables.map((entry) => entry.name),
    FROZEN_PREFIXES.variable,
    'Public variable'
  );
  assert(
    [...baseline.classes].sort().join('\n') === baseline.classes.join('\n'),
    'API baseline classes must be sorted.'
  );
  assert(
    [...baseline.exports].sort().join('\n') === baseline.exports.join('\n'),
    'API baseline exports must be sorted.'
  );
  assert(
    [...baseline.variables].sort().join('\n') === baseline.variables.join('\n'),
    'API baseline variables must be sorted.'
  );
  assert(Array.isArray(deprecations.deprecations), 'Deprecations must be an array.');

  const currentNames = {
    class: getCurrentNames(registry, packageData, 'class'),
    export: getCurrentNames(registry, packageData, 'export'),
    variable: getCurrentNames(registry, packageData, 'variable'),
  };
  const records = new Map();

  deprecations.deprecations.forEach((record) => {
    assert(API_COLLECTIONS[record.kind], `Invalid deprecation kind: ${record.kind}`);
    const expectedPrefix = getExpectedDeprecatedPrefix(record.kind);
    assert(record.name?.startsWith(expectedPrefix), `Invalid deprecated name: ${record.name}`);
    assert(
      record.replacement?.startsWith(expectedPrefix),
      `Invalid replacement for ${record.name}: ${record.replacement}`
    );
    assert(record.name !== record.replacement, `${record.name} cannot replace itself.`);
    assert(
      record.status === 'alias' || record.status === 'removed',
      `Invalid deprecation status for ${record.name}: ${record.status}`
    );
    assert(
      typeof record.note === 'string' && record.note,
      `Missing migration note for ${record.name}.`
    );

    const key = getDeprecationKey(record.kind, record.name);
    assert(!records.has(key), `Duplicate deprecation record: ${record.name}`);
    records.set(key, record);

    const deprecatedVersion = parseVersion(record.deprecatedIn, `${record.name} deprecatedIn`);
    const removalVersion = parseVersion(record.removeIn, `${record.name} removeIn`);
    assert(
      compareVersions(removalVersion, deprecatedVersion) > 0,
      `${record.name} removeIn must be later than deprecatedIn.`
    );
    assert(
      compareVersions(packageData.version, record.deprecatedIn) >= 0,
      `${record.name} cannot be deprecated in future version ${record.deprecatedIn}.`
    );
    assert(
      currentNames[record.kind].has(record.replacement),
      `Replacement ${record.replacement} for ${record.name} is not public.`
    );

    if (deprecatedVersion.major >= 1) {
      const minimumRemovalVersion = {
        major: deprecatedVersion.major,
        minor: deprecatedVersion.minor + 1,
        patch: 0,
      };
      assert(
        compareVersions(removalVersion, minimumRemovalVersion) >= 0,
        `${record.name} must remain as an alias for at least one minor release.`
      );
    }

    assert(
      removalVersion.patch === 0,
      `${record.name} removal must target a minor or major release, not a patch release.`
    );

    if (record.status === 'alias') {
      assert(
        currentNames[record.kind].has(record.name),
        `Deprecated alias ${record.name} must remain public until it is marked removed.`
      );
    } else {
      assert(
        !currentNames[record.kind].has(record.name),
        `Removed API ${record.name} must not remain in the utility registry.`
      );
      assert(
        compareVersions(packageData.version, record.removeIn) >= 0,
        `${record.name} cannot be removed before ${record.removeIn}.`
      );
    }
  });

  Object.entries(API_COLLECTIONS).forEach(([kind, collection]) => {
    baseline[collection].forEach((name) => {
      if (currentNames[kind].has(name)) return;

      const record = records.get(getDeprecationKey(kind, name));
      assert(record, `Public ${kind} removed without a deprecation record: ${name}`);
      assert(record.status === 'removed', `Missing ${kind} ${name} is not marked removed.`);
    });
  });

  return {
    baselineVersion: baseline.baselineVersion,
    classes: currentNames.class.size,
    exports: currentNames.export.size,
    variables: currentNames.variable.size,
    aliases: deprecations.deprecations.filter((record) => record.status === 'alias').length,
    removed: deprecations.deprecations.filter((record) => record.status === 'removed').length,
  };
}

export function decorateRegistry(registry, deprecations) {
  const records = new Map(
    deprecations.deprecations
      .filter((record) => record.status === 'alias')
      .map((record) => [getDeprecationKey(record.kind, record.name), record])
  );

  const decorate = (entry, kind) => {
    const record = records.get(getDeprecationKey(kind, entry.name));

    if (!record) return { ...entry, status: 'active' };

    return {
      ...entry,
      status: 'deprecated',
      deprecation: {
        replacement: record.replacement,
        deprecatedIn: record.deprecatedIn,
        removeIn: record.removeIn,
        note: record.note,
      },
    };
  };

  return {
    ...registry,
    classes: registry.classes.map((entry) => decorate(entry, 'class')),
    variables: registry.variables.map((entry) => decorate(entry, 'variable')),
  };
}
