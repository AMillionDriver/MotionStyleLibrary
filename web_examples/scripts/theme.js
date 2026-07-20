const themeToggle = document.querySelector('#theme-toggle');
const savedTheme = localStorage.getItem('axoloth-docs-theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

const themeIcons = {
  moon: `
    <svg class="docs-button-icon" aria-hidden="true" viewBox="0 0 24 24">
      <path d="M20.4 14.7A8.4 8.4 0 0 1 9.3 3.6a8.7 8.7 0 1 0 11.1 11.1Z" />
    </svg>
  `,
  sun: `
    <svg class="docs-button-icon" aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.2M12 19.8V22M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2 12h2.2M19.8 12H22M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6" />
    </svg>
  `,
};

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;

  if (!themeToggle) return;

  const nextMode = theme === 'dark' ? 'light' : 'dark';
  const label = `Switch to ${nextMode} mode`;
  themeToggle.innerHTML = theme === 'dark' ? themeIcons.sun : themeIcons.moon;
  themeToggle.setAttribute('aria-label', label);
  themeToggle.setAttribute('title', label);
}

applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

themeToggle?.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('axoloth-docs-theme', nextTheme);
  applyTheme(nextTheme);
});
