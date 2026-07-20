const docsScript = document.currentScript;
const docsRoot = docsScript?.dataset.docsRoot || '.';
const docsSidebar = document.querySelector('[data-docs-sidebar]');
const docsSidebarToggle = document.querySelector('#docs-sidebar-toggle');
const docsSearchInput = document.querySelector('#example-search');
let docsSidebarGroups = [];

function normalizeDocsValue(value) {
  return String(value || '')
    .trim()
    .toLowerCase();
}

function escapeDocsHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function resolveDocsPath(path) {
  const cleanRoot = docsRoot.replace(/\/$/, '') || '.';
  const cleanPath = String(path || '').replace(/^\.\//, '');

  if (cleanPath.startsWith('#')) {
    return `${cleanRoot}/${cleanPath}`;
  }

  return `${cleanRoot}/${cleanPath}`;
}

function getActiveDocsItem() {
  const hashMap = {
    '#introduction': 'overview',
    '#install': 'install',
  };

  return hashMap[window.location.hash] || document.body.dataset.docsActive || 'overview';
}

function renderDocsSidebar(groups) {
  if (!docsSidebar) return;

  const activeDocsItem = getActiveDocsItem();

  docsSidebar.innerHTML = `
    <div class="docs-sidebar-head">
      <strong>Documentation</strong>
      <small>Focused pages for Axoloth layout, component, and utility patterns.</small>
    </div>
    ${groups
      .map(
        (group) => `
          <section class="docs-sidebar-group" data-docs-nav-group>
            <p class="docs-sidebar-title">${escapeDocsHtml(group.title)}</p>
            <ul class="docs-sidebar-list">
              ${group.items
                .map((item) => {
                  const isActive = item.id === activeDocsItem;
                  return `
                    <li data-docs-nav-item="${escapeDocsHtml(
                      `${group.title} ${item.label} ${item.badge}`
                    )}">
                      <a
                        class="docs-sidebar-link"
                        href="${escapeDocsHtml(resolveDocsPath(item.path))}"
                        ${isActive ? 'aria-current="page"' : ''}
                      >
                        <span>${escapeDocsHtml(item.label)}</span>
                        <span class="docs-sidebar-badge">${escapeDocsHtml(item.badge)}</span>
                      </a>
                    </li>
                  `;
                })
                .join('')}
            </ul>
          </section>
        `
      )
      .join('')}
    <p class="docs-sidebar-empty" hidden>No matching docs item.</p>
  `;
}

function filterDocsSidebar() {
  if (!docsSidebar || !docsSearchInput) return;

  const query = normalizeDocsValue(docsSearchInput.value);
  const items = Array.from(docsSidebar.querySelectorAll('[data-docs-nav-item]'));
  const groups = Array.from(docsSidebar.querySelectorAll('[data-docs-nav-group]'));
  const emptyState = docsSidebar.querySelector('.docs-sidebar-empty');

  items.forEach((item) => {
    const keywords = normalizeDocsValue(item.dataset.docsNavItem);
    item.toggleAttribute('hidden', Boolean(query) && !keywords.includes(query));
  });

  groups.forEach((group) => {
    const visibleItems = group.querySelectorAll('[data-docs-nav-item]:not([hidden])');
    group.toggleAttribute('hidden', visibleItems.length === 0);
  });

  if (emptyState) {
    const visibleItems = docsSidebar.querySelectorAll('[data-docs-nav-item]:not([hidden])');
    emptyState.hidden = visibleItems.length > 0;
  }
}

async function loadDocsSidebar() {
  if (!docsSidebar) return;

  try {
    const response = await fetch(resolveDocsPath('data/docs-nav.json'));
    if (!response.ok) throw new Error(`Failed to load docs nav: ${response.status}`);
    const index = await response.json();
    docsSidebarGroups = index.groups || [];
    renderDocsSidebar(docsSidebarGroups);
    filterDocsSidebar();
  } catch (error) {
    docsSidebar.innerHTML = '<p class="docs-sidebar-empty">Docs navigation failed to load.</p>';
    console.error(error);
  }
}

docsSidebarToggle?.addEventListener('click', () => {
  const isOpen = docsSidebar?.classList.toggle('is-open') || false;
  docsSidebarToggle.setAttribute('aria-expanded', String(isOpen));
});

docsSidebar?.addEventListener('click', (event) => {
  if (event.target.closest('a') && window.matchMedia('(max-width: 980px)').matches) {
    docsSidebar.classList.remove('is-open');
    docsSidebarToggle?.setAttribute('aria-expanded', 'false');
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    docsSidebar?.classList.remove('is-open');
    docsSidebarToggle?.setAttribute('aria-expanded', 'false');
  }
});

docsSearchInput?.addEventListener('input', filterDocsSidebar);
window.addEventListener('hashchange', () => {
  renderDocsSidebar(docsSidebarGroups);
  filterDocsSidebar();
});
loadDocsSidebar();
