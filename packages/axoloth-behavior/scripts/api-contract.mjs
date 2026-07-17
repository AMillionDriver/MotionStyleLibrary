const API_COLLECTIONS = {
  dataAttribute: 'dataAttributes',
  event: 'events',
  export: 'exports',
  initializer: 'initializers',
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function parseVersion(value, label = 'version') {
  const match = /^(\d+)\.(\d+)\.(\d+)(?:-[0-9A-Za-z.-]+)?$/.exec(value);
  assert(match, `Invalid ${label}: ${value}`);
  return { major: Number(match[1]), minor: Number(match[2]), patch: Number(match[3]) };
}

function compareVersions(leftValue, rightValue) {
  const left = typeof leftValue === 'string' ? parseVersion(leftValue) : leftValue;
  const right = typeof rightValue === 'string' ? parseVersion(rightValue) : rightValue;
  return left.major - right.major || left.minor - right.minor || left.patch - right.patch;
}

function assertUniqueNames(names, label) {
  assert(Array.isArray(names), `${label} must be an array.`);
  assert(names.length === new Set(names).size, `${label} contains duplicate names.`);
  assert(
    names.every((name) => typeof name === 'string' && name),
    `${label} contains invalid names.`
  );
}

function getRegistryNames(registry, collection) {
  return registry[collection].map((entry) => entry.name);
}

function getCurrentNames({ packageData, registry }) {
  return {
    dataAttribute: new Set(getRegistryNames(registry, 'dataAttributes')),
    event: new Set(getRegistryNames(registry, 'events')),
    export: new Set(Object.keys(packageData.exports ?? {})),
    initializer: new Set(getRegistryNames(registry, 'initializers')),
  };
}

function assertSorted(names, label) {
  assert([...names].sort().join('\n') === names.join('\n'), `${label} must be sorted.`);
}

function assertExactSourceMatch(registryNames, sourceNames, label) {
  const registrySet = new Set(registryNames);
  const sourceSet = new Set(sourceNames);
  const unregistered = [...sourceSet].filter((name) => !registrySet.has(name));
  const stale = [...registrySet].filter((name) => !sourceSet.has(name));
  assert(!unregistered.length, `${label} missing from registry: ${unregistered.join(', ')}`);
  assert(!stale.length, `${label} missing from source: ${stale.join(', ')}`);
}

function assertPublicName(kind, name, label) {
  const valid =
    kind === 'dataAttribute'
      ? /^data-axo-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)
      : kind === 'event'
        ? /^axo:[a-z0-9]+(?:-[a-z0-9]+)+$/.test(name)
        : kind === 'initializer'
          ? /^init[A-Z][A-Za-z0-9]*$/.test(name)
          : name === '.' || /^\.\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name);
  assert(valid, `Invalid ${label}: ${name}`);
}

function validateRegistry({ packageData, registry, sourceApi }) {
  assert(registry.schemaVersion === 1, 'Unsupported behavior registry schema version.');
  assert(registry.name === packageData.name, 'Behavior registry name does not match package.json.');
  assert(
    registry.version === packageData.version,
    'Behavior registry version does not match package.json.'
  );

  ['initializers', 'dataAttributes', 'events'].forEach((collection) => {
    const names = getRegistryNames(registry, collection);
    assertUniqueNames(names, `Registry ${collection}`);
    registry[collection].forEach((entry) => {
      assert(
        typeof entry.description === 'string' && entry.description,
        `Missing description: ${entry.name}`
      );
    });
  });

  registry.initializers.forEach((entry) =>
    assertPublicName('initializer', entry.name, 'initializer')
  );
  registry.dataAttributes.forEach((entry) =>
    assertPublicName('dataAttribute', entry.name, 'data attribute')
  );
  registry.events.forEach((entry) => assertPublicName('event', entry.name, 'event'));

  assertExactSourceMatch(
    getRegistryNames(registry, 'initializers'),
    sourceApi.initializers,
    'Initializers'
  );
  assertExactSourceMatch(
    getRegistryNames(registry, 'dataAttributes'),
    sourceApi.dataAttributes,
    'Data attributes'
  );
  assertExactSourceMatch(getRegistryNames(registry, 'events'), sourceApi.events, 'Events');
}

function getRecordKey(kind, name) {
  return `${kind}:${name}`;
}

export function createBehaviorBaseline(registry, packageData, baselineVersion = registry.version) {
  parseVersion(baselineVersion, 'baseline version');
  return {
    schemaVersion: 1,
    name: registry.name,
    baselineVersion,
    stability: registry.stability,
    dataAttributes: getRegistryNames(registry, 'dataAttributes').sort(),
    events: getRegistryNames(registry, 'events').sort(),
    exports: Object.keys(packageData.exports ?? {}).sort(),
    initializers: getRegistryNames(registry, 'initializers').sort(),
  };
}

export function validateBehaviorContract({
  baseline,
  deprecations,
  packageData,
  registry,
  sourceApi,
}) {
  validateRegistry({ packageData, registry, sourceApi });
  assert(baseline.schemaVersion === 1, 'Unsupported behavior baseline schema version.');
  assert(deprecations.schemaVersion === 1, 'Unsupported behavior deprecation schema version.');
  assert(baseline.name === packageData.name, 'Behavior baseline name does not match package.json.');
  assert(
    deprecations.name === packageData.name,
    'Behavior deprecations name does not match package.json.'
  );
  assert(
    compareVersions(packageData.version, baseline.baselineVersion) >= 0,
    `Package ${packageData.version} predates behavior baseline ${baseline.baselineVersion}.`
  );

  Object.values(API_COLLECTIONS).forEach((collection) => {
    assertUniqueNames(baseline[collection], `Behavior baseline ${collection}`);
    assertSorted(baseline[collection], `Behavior baseline ${collection}`);
  });
  assert(Array.isArray(deprecations.deprecations), 'Behavior deprecations must be an array.');

  const currentNames = getCurrentNames({ packageData, registry });
  const records = new Map();

  deprecations.deprecations.forEach((record) => {
    assert(API_COLLECTIONS[record.kind], `Invalid behavior deprecation kind: ${record.kind}`);
    assertPublicName(record.kind, record.name, 'deprecated API name');
    assertPublicName(record.kind, record.replacement, 'replacement API name');
    assert(record.name !== record.replacement, `${record.name} cannot replace itself.`);
    assert(
      record.status === 'alias' || record.status === 'removed',
      `Invalid status: ${record.status}`
    );
    assert(
      typeof record.note === 'string' && record.note,
      `Missing migration note for ${record.name}.`
    );

    const key = getRecordKey(record.kind, record.name);
    assert(!records.has(key), `Duplicate behavior deprecation: ${record.name}`);
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
      const minimumRemoval = {
        major: deprecatedVersion.major,
        minor: deprecatedVersion.minor + 1,
        patch: 0,
      };
      assert(
        compareVersions(removalVersion, minimumRemoval) >= 0,
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
        `Deprecated alias ${record.name} must remain public.`
      );
    } else {
      assert(
        !currentNames[record.kind].has(record.name),
        `Removed API ${record.name} remains public.`
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
      const record = records.get(getRecordKey(kind, name));
      assert(record, `Public ${kind} removed without a deprecation record: ${name}`);
      assert(record.status === 'removed', `Missing ${kind} ${name} is not marked removed.`);
    });
  });

  return {
    baselineVersion: baseline.baselineVersion,
    dataAttributes: currentNames.dataAttribute.size,
    events: currentNames.event.size,
    exports: currentNames.export.size,
    initializers: currentNames.initializer.size,
    aliases: deprecations.deprecations.filter((record) => record.status === 'alias').length,
    removed: deprecations.deprecations.filter((record) => record.status === 'removed').length,
  };
}
