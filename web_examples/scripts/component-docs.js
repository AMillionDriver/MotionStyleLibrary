const componentDocsScript = document.currentScript;
const componentDocsRoot = componentDocsScript?.dataset.docsRoot || '.';
const componentDocsPageId = document.body.dataset.docsPage;

function resolveComponentDocsPath(path) {
  const cleanRoot = componentDocsRoot.replace(/\/$/, '') || '.';
  return `${cleanRoot}/${String(path || '').replace(/^\.\//, '')}`;
}

function escapeComponentDocsHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function setComponentDocsText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

function renderComponentDocsList(selector, items) {
  const element = document.querySelector(selector);
  if (!element) return;

  element.innerHTML = items
    .map(
      (item) => `
        <li>
          <code>${escapeComponentDocsHtml(item.name)}</code>
          <small>${escapeComponentDocsHtml(item.description)}</small>
        </li>
      `
    )
    .join('');
}

function renderComponentDocsCode(selector, lines) {
  const element = document.querySelector(selector);
  if (element) element.textContent = (lines || []).join('\n');
}

function renderComponentDocsPage(page) {
  document.title = `${page.title} - Axoloth Style Docs`;
  setComponentDocsText('#doc-category', page.category);
  setComponentDocsText('#doc-title', page.title);
  setComponentDocsText('#doc-overview', page.overview);
  setComponentDocsText('#doc-template-title', `${page.title} template`);

  renderComponentDocsCode('#doc-template-code', page.template);
  renderComponentDocsCode('#doc-example-code', page.example);
  renderComponentDocsList('#doc-classes', page.classes || []);
  renderComponentDocsList('#doc-options', page.options || []);

  const preview = document.querySelector('#doc-preview');
  if (preview) preview.innerHTML = (page.preview || []).join('\n');
}

async function loadComponentDocsPage() {
  if (!componentDocsPageId) return;

  try {
    const response = await fetch(resolveComponentDocsPath('data/docs-pages.json'));
    if (!response.ok) throw new Error(`Failed to load docs page data: ${response.status}`);

    const pages = await response.json();
    const page = pages.find((item) => item.id === componentDocsPageId);
    if (!page) throw new Error(`Unknown docs page: ${componentDocsPageId}`);

    renderComponentDocsPage(page);
  } catch (error) {
    setComponentDocsText('#doc-title', 'Documentation unavailable');
    setComponentDocsText(
      '#doc-overview',
      'This page could not load its focused documentation data. Use Live Server or another static server.'
    );
    console.error(error);
  }
}

loadComponentDocsPage();
