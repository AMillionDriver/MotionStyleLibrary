import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const docsDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const examples = JSON.parse(readFileSync(resolve(docsDirectory, 'data/examples.json'), 'utf8'));
const utilityIndex = JSON.parse(
  readFileSync(resolve(docsDirectory, 'data/utilities.json'), 'utf8')
);
const indexHtml = readFileSync(resolve(docsDirectory, 'index.html'), 'utf8');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(examples.length === 10, `Expected exactly 10 examples, found ${examples.length}.`);
assert(
  new Set(examples.map((example) => example.id)).size === examples.length,
  'Example IDs must be unique.'
);

examples.forEach((example) => {
  ['id', 'name', 'category', 'version', 'status', 'previewUrl', 'sourceUrl', 'description'].forEach(
    (field) => assert(example[field], `Example ${example.id || '<unknown>'} is missing ${field}.`)
  );
  [example.previewUrl, example.sourceUrl].forEach((url) => {
    assert(existsSync(resolve(docsDirectory, url)), `Broken example path: ${url}`);
  });
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

console.log(
  `Docs verified: ${examples.length} examples and ${utilityIndex.utilities.length} generated utilities.`
);
