const docsScript = document.currentScript;
const docsRoot = docsScript?.dataset.docsRoot || '.';
const docsSidebar = document.querySelector('[data-docs-sidebar]');
const docsSidebarToggle = document.querySelector('#docs-sidebar-toggle');
const docsSearchInput = document.querySelector('#example-search');
let docsSidebarGroups = [];
let isSidebarExpanded = false;

const docsIconPaths = {
  alignment: '<path d="M5 7h14M5 12h10M5 17h14" />',
  bento: '<path d="M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z" />',
  card: '<path d="M5 5h14v14H5zM8 9h8M8 13h5" />',
  composition: '<path d="M4 5h7v14H4zM13 5h7v8h-7zM13 15h7v4h-7z" />',
  container: '<path d="M4 6h16v12H4zM8 6v12M16 6v12" />',
  drawer: '<path d="M4 5h16v14H4zM4 5h6v14H4zM13 9l3 3-3 3" />',
  install: '<path d="M12 3v11M8 10l4 4 4-4M5 19h14" />',
  motion: '<path d="M13 3 4 14h7l-1 7 9-12h-7z" />',
  navbar: '<path d="M4 6h16M4 12h10M4 18h16" />',
  overview: '<path d="M4 10.5 12 4l8 6.5V20h-5v-6H9v6H4z" />',
  responsive: '<path d="M7 4h10v16H7zM10 17h4M4 8h3M17 8h3" />',
  row: '<path d="M4 12h16M8 8l-4 4 4 4M16 8l4 4-4 4" />',
  sidebar: '<path d="M4 5h16v14H4zM9 5v14M6.5 8h.01M6.5 12h.01M6.5 16h.01" />',
  spacing: '<path d="M7 4v16M17 4v16M7 8h10M7 16h10" />',
  stack: '<path d="m12 4 8 4-8 4-8-4 8-4ZM4 12l8 4 8-4M4 16l8 4 8-4" />',
};

const openSidebarIcon =
  '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 5h16v14H4zM9 5v14M13 9l3 3-3 3" /></svg>';
const closeSidebarIcon =
  '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="m7 7 10 10M17 7 7 17" /></svg>';

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

function getDocsIcon(id) {
  const path = docsIconPaths[id] || '<path d="M5 5h14v14H5z" />';
  return `<svg class="docs-sidebar-icon" aria-hidden="true" viewBox="0 0 24 24">${path}</svg>`;
}

function setSidebarExpanded(expanded) {
  isSidebarExpanded = expanded;
  document.body.classList.toggle('docs-sidebar-expanded', expanded);
  docsSidebar?.classList.toggle('is-open', expanded);
  docsSidebarToggle?.setAttribute('aria-expanded', String(expanded));

  docsSidebar
    ?.querySelectorAll('[data-docs-sidebar-open]')
    .forEach((control) => control.setAttribute('aria-expanded', String(expanded)));
}

function renderDocsSidebar(groups) {
  if (!docsSidebar) return;

  const activeDocsItem = getActiveDocsItem();

  docsSidebar.innerHTML = `
    <div class="docs-sidebar-head">
      <button
        class="docs-sidebar-brand"
        type="button"
        data-docs-sidebar-open
        aria-label="Open documentation sidebar"
        aria-expanded="${isSidebarExpanded}"
        title="Open documentation sidebar"
      >
        <span class="docs-sidebar-brand-text">AX</span>
        <span class="docs-sidebar-open-icon">${openSidebarIcon}</span>
      </button>
      <button
        class="docs-sidebar-close"
        type="button"
        data-docs-sidebar-close
        aria-label="Close documentation sidebar"
        title="Close documentation sidebar"
      >
        ${closeSidebarIcon}
      </button>
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
                        aria-label="${escapeDocsHtml(item.label)}"
                        title="${escapeDocsHtml(item.label)}"
                        ${isActive ? 'aria-current="page"' : ''}
                      >
                        ${getDocsIcon(item.id)}
                        <span class="docs-sidebar-label">${escapeDocsHtml(item.label)}</span>
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

  setSidebarExpanded(isSidebarExpanded);
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
  setSidebarExpanded(!isSidebarExpanded);
});

docsSidebar?.addEventListener('click', (event) => {
  if (event.target.closest('[data-docs-sidebar-open]')) {
    setSidebarExpanded(true);
    return;
  }

  if (event.target.closest('[data-docs-sidebar-close]')) {
    setSidebarExpanded(false);
    return;
  }

  if (event.target.closest('a') && window.matchMedia('(max-width: 980px)').matches) {
    setSidebarExpanded(false);
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setSidebarExpanded(false);
  }
});

docsSearchInput?.addEventListener('input', filterDocsSidebar);
window.addEventListener('hashchange', () => {
  renderDocsSidebar(docsSidebarGroups);
  filterDocsSidebar();
});
loadDocsSidebar();
