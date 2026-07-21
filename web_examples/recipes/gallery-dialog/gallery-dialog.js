const galleryRoot = document.querySelector('[data-gallery-dialog-recipe]');
const galleryStatus = document.querySelector('[data-gallery-status]');
const dialogTitle = document.querySelector('[data-gallery-dialog-title]');
const dialogDescription = document.querySelector('[data-gallery-dialog-description]');
const dialogArtwork = document.querySelector('[data-gallery-dialog-art]');

let dialogController = null;

function syncDialogContent(trigger) {
  if (!trigger || !dialogTitle || !dialogDescription || !dialogArtwork) return;

  const title = trigger.dataset.galleryTitle || 'Untitled object';
  const description = trigger.dataset.galleryDescription || '';
  const position = trigger.dataset.galleryPosition || '0% 0%';

  dialogTitle.textContent = title;
  dialogDescription.textContent = description;
  dialogArtwork.style.setProperty('--recipe-art-position', position);
  dialogArtwork.setAttribute('aria-label', title);
}

galleryRoot?.querySelectorAll('[data-gallery-title]').forEach((trigger) => {
  trigger.addEventListener('click', () => syncDialogContent(trigger));
});

async function initializeGalleryDialog() {
  if (!galleryRoot) return;

  const sourcePath = import.meta.url.includes('/web_examples/')
    ? '../../../packages/axoloth-behavior/src/dialog.js'
    : '../../packages/axoloth-behavior/src/dialog.js';
  const { initDialog } = await import(new URL(sourcePath, import.meta.url));

  dialogController = initDialog(galleryRoot);
  if (galleryStatus) galleryStatus.textContent = 'Dialog behavior initialized.';
}

initializeGalleryDialog().catch((error) => {
  if (galleryStatus) galleryStatus.textContent = 'Dialog behavior failed to initialize.';
  console.error(error);
});

window.addEventListener(
  'pagehide',
  () => {
    dialogController?.destroy();
  },
  { once: true }
);
