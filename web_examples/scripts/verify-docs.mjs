import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const docsDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const examples = JSON.parse(readFileSync(resolve(docsDirectory, 'data/examples.json'), 'utf8'));
const docsNav = JSON.parse(readFileSync(resolve(docsDirectory, 'data/docs-nav.json'), 'utf8'));
const docsPages = JSON.parse(readFileSync(resolve(docsDirectory, 'data/docs-pages.json'), 'utf8'));
const utilityIndex = JSON.parse(
  readFileSync(resolve(docsDirectory, 'data/utilities.json'), 'utf8')
);
const indexHtml = readFileSync(resolve(docsDirectory, 'index.html'), 'utf8');
const behaviorGuideHtml = readFileSync(resolve(docsDirectory, 'docs/behavior/index.html'), 'utf8');
const behaviorGuideScript = readFileSync(
  resolve(docsDirectory, 'scripts/behavior-guide.js'),
  'utf8'
);
const behaviorReadme = readFileSync(
  resolve(docsDirectory, '../packages/axoloth-behavior/README.md'),
  'utf8'
);
const deployWorkflow = readFileSync(
  resolve(docsDirectory, '../.github/workflows/deploy-docs-pages.yml'),
  'utf8'
);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(examples.length === 10, `Expected exactly 10 examples, found ${examples.length}.`);
assert(
  new Set(examples.map((example) => example.id)).size === examples.length,
  'Example IDs must be unique.'
);
assert(Array.isArray(docsNav.groups), 'Docs nav must expose a groups array.');
assert(Array.isArray(docsPages), 'Docs pages must be an array.');

examples.forEach((example) => {
  ['id', 'name', 'category', 'version', 'status', 'previewUrl', 'sourceUrl', 'description'].forEach(
    (field) => assert(example[field], `Example ${example.id || '<unknown>'} is missing ${field}.`)
  );
  [example.previewUrl, example.sourceUrl].forEach((url) => {
    assert(existsSync(resolve(docsDirectory, url)), `Broken example path: ${url}`);
  });
});

const docsPageIds = new Set(docsPages.map((page) => page.id));
const utilityNames = new Set(utilityIndex.utilities.map((utility) => utility.name));
assert(docsPageIds.size === docsPages.length, 'Docs page IDs must be unique.');

docsPages.forEach((page) => {
  [
    'id',
    'title',
    'category',
    'overview',
    'template',
    'classes',
    'options',
    'example',
    'preview',
  ].forEach((field) =>
    assert(page[field], `Docs page ${page.id || '<unknown>'} is missing ${field}.`)
  );
  assert(
    existsSync(resolve(docsDirectory, `docs/${page.id}/index.html`)),
    `Missing docs route: ${page.id}`
  );
  page.classes.forEach((item) => {
    assert(
      utilityNames.has(item.name),
      `Docs page ${page.id} references unknown class: ${item.name}`
    );
  });
  page.options.forEach((item) => {
    assert(
      utilityNames.has(item.name),
      `Docs page ${page.id} references unknown option: ${item.name}`
    );
  });
});

const docsNavItems = docsNav.groups.flatMap((group) =>
  group.items.map((item) => ({ ...item, group: group.title }))
);
assert(
  new Set(docsNavItems.map((item) => item.id)).size === docsNavItems.length,
  'Docs nav item IDs must be unique.'
);

docsNavItems.forEach((item) => {
  ['id', 'label', 'path', 'badge'].forEach((field) =>
    assert(item[field], `Docs nav item ${item.id || '<unknown>'} is missing ${field}.`)
  );

  if (item.path.startsWith('docs/')) {
    const routeId = item.path.replace(/^docs\//, '').replace(/\/$/, '');
    assert(docsPageIds.has(routeId), `Docs nav item ${item.id} has no page data.`);
    assert(existsSync(resolve(docsDirectory, item.path)), `Broken docs nav path: ${item.path}`);
  }
});

assert(
  utilityIndex.counts.total === utilityIndex.utilities.length,
  'Utility index total does not match its entries.'
);
assert(
  utilityIndex.counts.classes + utilityIndex.counts.variables === utilityIndex.counts.total,
  'Utility index class and variable counts do not match its total.'
);
assert(
  new Set(utilityIndex.utilities.map((utility) => utility.name)).size ===
    utilityIndex.utilities.length,
  'Utility index names must be unique.'
);
assert(
  utilityIndex.utilities.every(
    (utility) => utility.status === 'active' || utility.status === 'deprecated'
  ),
  'Every generated utility must expose an API status.'
);
utilityIndex.utilities
  .filter((utility) => utility.status === 'deprecated')
  .forEach((utility) => {
    assert(
      utility.deprecation?.replacement,
      `Deprecated utility ${utility.name} has no replacement.`
    );
    assert(
      utility.deprecation?.removeIn,
      `Deprecated utility ${utility.name} has no removal version.`
    );
  });
assert(indexHtml.includes('id="examples-table-body"'), 'Docs example table target is missing.');
assert(indexHtml.includes('id="utilities-table-body"'), 'Docs utility table target is missing.');
assert(indexHtml.includes('data-docs-sidebar'), 'Docs sidebar target is missing.');
assert(indexHtml.includes('scripts/docs-sidebar.js'), 'Docs sidebar script is missing.');
assert(indexHtml.includes('data-copy-code'), 'Install copy code target is missing.');
assert(indexHtml.includes('id="docs-snackbar"'), 'Docs snackbar target is missing.');
assert(indexHtml.includes('scripts/docs-copy.js'), 'Docs copy script is missing.');
assert(indexHtml.includes('id="mental-model"'), 'Docs mental model section is missing.');
assert(indexHtml.includes('id="vanilla-css-only"'), 'Vanilla CSS-only quick start is missing.');
assert(
  indexHtml.includes('id="vanilla-with-behavior"'),
  'Vanilla CSS-plus-behavior quick start is missing.'
);
assert(indexHtml.includes('id="css-entry-points"'), 'CSS entry-point guidance is missing.');
assert(
  indexHtml.includes('remove unused CSS automatically'),
  'Full-entry unused CSS behavior must be explained.'
);
assert(
  docsNavItems.some((item) => item.id === 'behavior' && item.path === 'docs/behavior/'),
  'Behavior Guide must be discoverable from the docs navigation.'
);
assert(
  indexHtml.includes('href="./docs/behavior/"'),
  'The docs quick start must link to the complete Behavior Guide.'
);

[
  'id="behavior-install"',
  'id="initialize-all"',
  'id="manual-initialization"',
  'id="behavior-tabs"',
  'id="behavior-accordion"',
  'id="behavior-dialog"',
  'id="behavior-drawer"',
  'id="behavior-cleanup"',
  'id="behavior-troubleshooting"',
].forEach((marker) =>
  assert(behaviorGuideHtml.includes(marker), `Behavior Guide is missing ${marker}.`)
);

[
  '@quertys/axoloth-behavior/tabs',
  '@quertys/axoloth-behavior/accordion',
  '@quertys/axoloth-behavior/dialog',
  '@quertys/axoloth-behavior/drawer',
].forEach((entryPoint) =>
  assert(
    behaviorGuideHtml.includes(entryPoint),
    `Behavior Guide is missing the per-component import ${entryPoint}.`
  )
);

['data-axo-tabs', 'data-axo-accordion', 'data-axo-dialog-toggle', 'data-axo-drawer-toggle'].forEach(
  (attribute) =>
    assert(
      behaviorGuideHtml.includes(attribute),
      `Behavior Guide is missing runnable markup for ${attribute}.`
    )
);

assert(
  behaviorGuideHtml.includes('npm install @quertys/axoloth-style @quertys/axoloth-behavior'),
  'Behavior Guide installation command is missing.'
);
assert(
  behaviorGuideHtml.includes('cdn.jsdelivr.net/npm/@quertys/axoloth-behavior@0.6.0/src/index.js'),
  'Behavior Guide CDN ES module setup is missing.'
);
assert(
  behaviorGuideHtml.includes('initAxolothBehaviors') && behaviorGuideHtml.includes('destroy()'),
  'Behavior Guide must show aggregate initialization and cleanup.'
);
assert(
  behaviorGuideHtml.includes('The package does not auto-initialize'),
  'Behavior Guide troubleshooting must explain explicit initialization.'
);
assert(
  behaviorGuideScript.includes('initAxolothBehaviors(demoRoot)'),
  'Behavior Guide live demos must initialize through the framework-free package API.'
);
assert(
  behaviorGuideScript.includes('behaviors.destroy()'),
  'Behavior Guide live demos must clean up their controller.'
);
assert(
  behaviorReadme.includes('CSS alone never initializes JavaScript behavior') &&
    behaviorReadme.includes('## CDN / Native ES Modules') &&
    behaviorReadme.includes('## Troubleshooting'),
  'Behavior package README is missing the style/behavior boundary or setup guidance.'
);
assert(
  deployWorkflow.includes('packages/axoloth-behavior/src/**') &&
    deployWorkflow.includes('packages/axoloth-behavior/src'),
  'GitHub Pages must deploy the behavior source used by the live guide.'
);

console.log(
  `Docs verified: ${examples.length} examples, ${docsPages.length} docs pages, and ${utilityIndex.utilities.length} generated utilities.`
);
