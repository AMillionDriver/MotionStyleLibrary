import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { decorateRegistry, validateApiContract } from './api-contract.mjs';

const scriptPath = fileURLToPath(import.meta.url);
const scriptDirectory = dirname(scriptPath);
const packageDirectory = resolve(scriptDirectory, '..');
const repositoryDirectory = resolve(packageDirectory, '../..');

const paths = {
  package: resolve(packageDirectory, 'package.json'),
  registry: resolve(packageDirectory, 'metadata/registry.json'),
  apiBaseline: resolve(packageDirectory, 'metadata/api-baseline.json'),
  deprecations: resolve(packageDirectory, 'metadata/deprecations.json'),
  classes: resolve(packageDirectory, 'metadata/classes.json'),
  variables: resolve(packageDirectory, 'metadata/variables.json'),
  utilityIndex: resolve(packageDirectory, 'metadata/utility-index.json'),
  readme: resolve(packageDirectory, 'README.md'),
  docsUtilityIndex: resolve(repositoryDirectory, 'web_examples/data/utilities.json'),
  cssDirectory: resolve(packageDirectory, 'src'),
};

const readJson = (filePath) => JSON.parse(readFileSync(filePath, 'utf8'));
const serializeJson = (value) => `${JSON.stringify(value, null, 2)}\n`;
const normalizeLineEndings = (value) => value?.replaceAll('\r\n', '\n');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertUnique(items, label) {
  const seen = new Set();
  items.forEach((item) => {
    assert(!seen.has(item.name), `Duplicate ${label}: ${item.name}`);
    seen.add(item.name);
  });
}

function validateRegistry(registry, packageData) {
  assert(registry.schemaVersion === 1, 'Unsupported registry schema version.');
  assert(registry.name === packageData.name, 'Registry package name does not match package.json.');
  assert(registry.version === packageData.version, 'Registry version does not match package.json.');
  assert(registry.prefixes?.class === 'axo-', 'Public class prefix must remain axo-.');
  assert(registry.prefixes?.variable === '--axo-', 'Public variable prefix must remain --axo-.');
  assert(
    registry.prefixes?.dataAttribute === 'data-axo-',
    'Behavior attribute prefix must remain data-axo-.'
  );
  assert(Array.isArray(registry.classes), 'Registry classes must be an array.');
  assert(Array.isArray(registry.variables), 'Registry variables must be an array.');
  assertUnique(registry.classes, 'class');
  assertUnique(registry.variables, 'variable');

  const modules = new Set(registry.modules);
  registry.classes.forEach((utility) => {
    assert(
      /^axo-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(utility.name),
      `Invalid class name: ${utility.name}`
    );
    assert(modules.has(utility.module), `Unknown module for ${utility.name}: ${utility.module}`);
    assert(
      typeof utility.category === 'string' && utility.category,
      `Missing category for ${utility.name}`
    );
    assert(
      typeof utility.description === 'string' && utility.description,
      `Missing description for ${utility.name}`
    );
  });

  registry.variables.forEach((utility) => {
    assert(
      /^--axo-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(utility.name),
      `Invalid variable name: ${utility.name}`
    );
    assert(modules.has(utility.module), `Unknown module for ${utility.name}: ${utility.module}`);
    assert(
      typeof utility.category === 'string' && utility.category,
      `Missing category for ${utility.name}`
    );
    assert(
      typeof utility.description === 'string' && utility.description,
      `Missing description for ${utility.name}`
    );
    assert(typeof utility.default === 'string', `Missing default value for ${utility.name}`);

    const suggestionValues = utility.valueSuggestions?.map((item) => item.value) ?? [];
    assert(
      suggestionValues.length === new Set(suggestionValues).size,
      `Duplicate value suggestion for ${utility.name}`
    );
  });

  registry.modules.forEach((moduleName) => {
    assert(
      existsSync(resolve(paths.cssDirectory, `${moduleName}.css`)),
      `Registry module has no CSS entry: ${moduleName}`
    );
  });

  const cssSource = readdirSync(paths.cssDirectory)
    .filter((fileName) => fileName.endsWith('.css'))
    .map((fileName) => readFileSync(resolve(paths.cssDirectory, fileName), 'utf8'))
    .join('\n');
  const registeredClasses = new Set(registry.classes.map((utility) => utility.name));
  const registeredVariables = new Set(registry.variables.map((utility) => utility.name));
  const cssClasses = new Set(
    [...cssSource.matchAll(/\.(axo-[a-z0-9]+(?:-[a-z0-9]+)*)/g)].map((match) => match[1])
  );
  const cssVariables = new Set(
    [...cssSource.matchAll(/--axo-[a-z0-9]+(?:-[a-z0-9]+)*/g)].map((match) => match[0])
  );

  const missingClasses = [...cssClasses].filter((name) => !registeredClasses.has(name));
  const missingVariables = [...cssVariables].filter((name) => !registeredVariables.has(name));
  assert(!missingClasses.length, `CSS classes missing from registry: ${missingClasses.join(', ')}`);
  assert(
    !missingVariables.length,
    `CSS variables missing from registry: ${missingVariables.join(', ')}`
  );
}

function createUtilityIndex(registry) {
  const utilities = [
    ...registry.classes.map((utility) => ({
      kind: 'class',
      ...utility,
    })),
    ...registry.variables.map((utility) => ({
      kind: 'variable',
      ...utility,
    })),
  ].sort((left, right) => left.name.localeCompare(right.name));

  return {
    schemaVersion: 1,
    name: registry.name,
    version: registry.version,
    counts: {
      classes: registry.classes.length,
      variables: registry.variables.length,
      total: utilities.length,
    },
    utilities,
  };
}

const escapeMarkdown = (value) => String(value).replaceAll('|', '\\|').replaceAll('\n', ' ');

function createReadmeReference(registry) {
  const rows = registry.classes.map((utility) => {
    const status =
      utility.status === 'deprecated'
        ? `Deprecated in ${utility.deprecation.deprecatedIn}; use \`${utility.deprecation.replacement}\``
        : 'Active';

    return `| \`${escapeMarkdown(utility.name)}\` | ${escapeMarkdown(utility.module)} | ${escapeMarkdown(utility.category)} | ${escapeMarkdown(status)} | ${escapeMarkdown(utility.description)} |`;
  });

  return [
    '<!-- AXOLOTH-REGISTRY:START -->',
    '<!-- prettier-ignore-start -->',
    '',
    '_Generated from `metadata/registry.json`. Run `npm run generate` after changing the registry._',
    '',
    `Registry ${registry.version}: **${registry.classes.length} classes**, **${registry.variables.length} CSS variables**, and **${registry.modules.length} modules**.`,
    '',
    '### Class Registry',
    '',
    '| Class | Module | Category | Status | Description |',
    '| --- | --- | --- | --- | --- |',
    ...rows,
    '',
    '<!-- prettier-ignore-end -->',
    '<!-- AXOLOTH-REGISTRY:END -->',
  ].join('\n');
}

function replaceGeneratedReadmeSection(readme, generatedReference) {
  const startMarker = '<!-- AXOLOTH-REGISTRY:START -->';
  const endMarker = '<!-- AXOLOTH-REGISTRY:END -->';
  const startIndex = readme.indexOf(startMarker);
  const endIndex = readme.indexOf(endMarker);
  assert(
    startIndex >= 0 && endIndex > startIndex,
    'README registry markers are missing or invalid.'
  );

  return `${readme.slice(0, startIndex)}${generatedReference}${readme.slice(endIndex + endMarker.length)}`;
}

function writeOrCheck(filePath, content, check, driftedFiles) {
  const currentContent = existsSync(filePath) ? readFileSync(filePath, 'utf8') : null;
  if (normalizeLineEndings(currentContent) === normalizeLineEndings(content)) return;

  if (check) {
    driftedFiles.push(filePath);
    return;
  }

  writeFileSync(filePath, content);
}

export function generateArtifacts({ check = false, quiet = false } = {}) {
  const packageData = readJson(paths.package);
  const registry = readJson(paths.registry);
  const apiBaseline = readJson(paths.apiBaseline);
  const deprecations = readJson(paths.deprecations);
  validateRegistry(registry, packageData);
  validateApiContract({ baseline: apiBaseline, deprecations, packageData, registry });
  const decoratedRegistry = decorateRegistry(registry, deprecations);

  const classMetadata = {
    name: registry.name,
    version: registry.version,
    prefix: registry.prefixes.class,
    classes: decoratedRegistry.classes,
  };
  const variableMetadata = {
    name: registry.name,
    version: registry.version,
    prefix: registry.prefixes.variable,
    variables: decoratedRegistry.variables,
  };
  const utilityIndex = createUtilityIndex(decoratedRegistry);
  const generatedReference = createReadmeReference(decoratedRegistry);
  const readme = replaceGeneratedReadmeSection(
    readFileSync(paths.readme, 'utf8'),
    generatedReference
  );
  const driftedFiles = [];

  writeOrCheck(paths.classes, serializeJson(classMetadata), check, driftedFiles);
  writeOrCheck(paths.variables, serializeJson(variableMetadata), check, driftedFiles);
  writeOrCheck(paths.utilityIndex, serializeJson(utilityIndex), check, driftedFiles);
  writeOrCheck(paths.docsUtilityIndex, serializeJson(utilityIndex), check, driftedFiles);
  writeOrCheck(paths.readme, readme, check, driftedFiles);

  if (driftedFiles.length) {
    throw new Error(
      `Generated metadata is stale:\n${driftedFiles.map((filePath) => `- ${filePath}`).join('\n')}\nRun npm run generate.`
    );
  }

  if (!quiet) {
    const action = check ? 'Verified' : 'Generated';
    console.log(
      `${action} ${registry.classes.length} classes, ${registry.variables.length} variables, and ${utilityIndex.counts.total} search entries.`
    );
  }

  return utilityIndex.counts;
}

if (process.argv[1] && resolve(process.argv[1]) === scriptPath) {
  try {
    generateArtifacts({ check: process.argv.includes('--check') });
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
