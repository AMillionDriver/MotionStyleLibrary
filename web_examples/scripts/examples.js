const searchInput = document.querySelector('#example-search');
const examplesTableBody = document.querySelector('#examples-table-body');
const recipesTableBody = document.querySelector('#recipes-table-body');
const utilitiesTableBody = document.querySelector('#utilities-table-body');
const exampleCount = document.querySelector('#example-count');
const recipeCount = document.querySelector('#recipe-count');
const utilityCount = document.querySelector('#utility-count');

const catalogs = {
  examples: { items: [], status: 'loading' },
  recipes: { items: [], status: 'loading' },
  utilities: { items: [], status: 'loading' },
};

function normalize(value) {
  return String(value || '')
    .trim()
    .toLowerCase();
}

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function matchesQuery(item, query, fields) {
  if (!query) return true;

  return fields
    .map((field) => normalize(item[field]))
    .join(' ')
    .includes(query);
}

function renderExamples(query) {
  if (catalogs.examples.status === 'error') {
    examplesTableBody.innerHTML = `
      <tr>
        <td class="empty-row" colspan="4">
          Failed to load examples. Use Live Server or another static server.
        </td>
      </tr>
    `;
    exampleCount.textContent = 'Examples unavailable';
    return;
  }

  const items = catalogs.examples.items.filter((example) =>
    matchesQuery(example, query, ['name', 'category', 'version', 'status', 'description'])
  );

  if (!items.length) {
    examplesTableBody.innerHTML = `
      <tr><td class="empty-row" colspan="4">No examples found.</td></tr>
    `;
    exampleCount.textContent = '0 examples';
    return;
  }

  examplesTableBody.innerHTML = items
    .map(
      (example) => `
        <tr>
          <td>
            <strong>${escapeHtml(example.name)}</strong>
            <small>${escapeHtml(example.category)} / ${escapeHtml(example.status)}</small>
            <small>${escapeHtml(example.description)}</small>
          </td>
          <td><a class="docs-link" href="${escapeHtml(example.previewUrl)}">Open preview</a></td>
          <td><a class="docs-link" href="${escapeHtml(example.sourceUrl)}">Open source</a></td>
          <td>${escapeHtml(example.version)}</td>
        </tr>
      `
    )
    .join('');

  exampleCount.textContent = `${items.length} example${items.length === 1 ? '' : 's'}`;
}

function renderRecipes(query) {
  if (catalogs.recipes.status === 'error') {
    recipesTableBody.innerHTML = `
      <tr>
        <td class="empty-row" colspan="4">
          Failed to load composition recipes. Use Live Server or another static server.
        </td>
      </tr>
    `;
    recipeCount.textContent = 'Recipes unavailable';
    return;
  }

  const items = catalogs.recipes.items.filter((recipe) =>
    matchesQuery(recipe, query, [
      'name',
      'category',
      'version',
      'status',
      'description',
      'classes',
      'variables',
      'projectCss',
      'responsive',
    ])
  );

  if (!items.length) {
    recipesTableBody.innerHTML = `
      <tr><td class="empty-row" colspan="4">No composition recipes found.</td></tr>
    `;
    recipeCount.textContent = '0 recipes';
    return;
  }

  recipesTableBody.innerHTML = items
    .map(
      (recipe) => `
        <tr>
          <td>
            <strong>${escapeHtml(recipe.name)}</strong>
            <small>${escapeHtml(recipe.category)} / ${escapeHtml(recipe.status)}</small>
            <small>${escapeHtml(recipe.description)}</small>
          </td>
          <td><a class="docs-link" href="${escapeHtml(recipe.previewUrl)}">Open recipe</a></td>
          <td><a class="docs-link" href="${escapeHtml(recipe.sourceUrl)}">Open source</a></td>
          <td>${escapeHtml(recipe.version)}</td>
        </tr>
      `
    )
    .join('');

  recipeCount.textContent = `${items.length} recipe${items.length === 1 ? '' : 's'}`;
}

function renderUtilities(query) {
  if (catalogs.utilities.status === 'error') {
    utilitiesTableBody.innerHTML = `
      <tr>
        <td class="empty-row" colspan="4">Generated utility index is unavailable.</td>
      </tr>
    `;
    utilityCount.textContent = 'Utilities unavailable';
    return;
  }

  const items = catalogs.utilities.items.filter((utility) =>
    matchesQuery(utility, query, [
      'name',
      'kind',
      'module',
      'category',
      'description',
      'usage',
      'default',
      'valueType',
      'status',
    ])
  );

  if (!items.length) {
    utilitiesTableBody.innerHTML = `
      <tr><td class="empty-row" colspan="4">No utilities found.</td></tr>
    `;
    utilityCount.textContent = '0 utilities';
    return;
  }

  utilitiesTableBody.innerHTML = items
    .map((utility) => {
      const defaultValue = utility.default
        ? `<small>Default: <code>${escapeHtml(utility.default)}</code></small>`
        : '';
      const usage = utility.usage ? `<small>${escapeHtml(utility.usage)}</small>` : '';
      const status = utility.status === 'deprecated' ? 'deprecated' : 'active';
      const migration = utility.deprecation
        ? `<small>Use <code>${escapeHtml(utility.deprecation.replacement)}</code> before ${escapeHtml(utility.deprecation.removeIn)}.</small>`
        : '';

      return `
        <tr>
          <td><code>${escapeHtml(utility.name)}</code>${defaultValue}</td>
          <td><span class="docs-kind">${escapeHtml(utility.kind)}</span><small>${status}</small></td>
          <td>${escapeHtml(utility.module)}<small>${escapeHtml(utility.category)}</small></td>
          <td>${escapeHtml(utility.description)}${usage}${migration}</td>
        </tr>
      `;
    })
    .join('');

  utilityCount.textContent = `${items.length} utilit${items.length === 1 ? 'y' : 'ies'}`;
}

function renderCatalogs() {
  const query = normalize(searchInput.value);
  renderExamples(query);
  renderRecipes(query);
  renderUtilities(query);
}

async function loadJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to load ${url}: ${response.status}`);
  return response.json();
}

async function loadCatalogs() {
  await Promise.all([
    loadJson('./data/examples.json')
      .then((items) => {
        catalogs.examples = { items, status: 'ready' };
      })
      .catch((error) => {
        catalogs.examples.status = 'error';
        console.error(error);
      }),
    loadJson('./data/recipes.json')
      .then((items) => {
        catalogs.recipes = { items, status: 'ready' };
      })
      .catch((error) => {
        catalogs.recipes.status = 'error';
        console.error(error);
      }),
    loadJson('./data/utilities.json')
      .then((index) => {
        catalogs.utilities = { items: index.utilities, status: 'ready' };
      })
      .catch((error) => {
        catalogs.utilities.status = 'error';
        console.error(error);
      }),
  ]);

  renderCatalogs();
}

searchInput.addEventListener('input', renderCatalogs);
loadCatalogs();
