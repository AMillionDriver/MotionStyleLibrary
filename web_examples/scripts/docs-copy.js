const copyBlocks = Array.from(document.querySelectorAll('[data-copy-code]'));
const snackbar = document.querySelector('#docs-snackbar');
const copiedTimers = new WeakMap();

function getCopyText(block) {
  return block.querySelector('code')?.textContent.trim() || '';
}

function setCopyStatus(block, status) {
  const statusElement = block.querySelector('.copy-code-status');
  if (statusElement) statusElement.textContent = status;
}

function showSnackbar(message) {
  if (!snackbar) return;

  snackbar.textContent = message;
  snackbar.classList.add('is-visible');
  window.clearTimeout(showSnackbar.timer);
  showSnackbar.timer = window.setTimeout(() => {
    snackbar.classList.remove('is-visible');
  }, 2200);
}

async function copyWithFallback(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.append(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
}

async function copyCodeBlock(block) {
  const text = getCopyText(block);
  if (!text) return;

  await copyWithFallback(text);

  block.classList.add('is-copied');
  setCopyStatus(block, 'Copied');
  showSnackbar('Copied to clipboard');

  window.clearTimeout(copiedTimers.get(block));
  copiedTimers.set(
    block,
    window.setTimeout(() => {
      block.classList.remove('is-copied');
      setCopyStatus(block, 'Copy');
    }, 1800)
  );
}

copyBlocks.forEach((block) => {
  block.addEventListener('click', () => {
    copyCodeBlock(block).catch((error) => {
      showSnackbar('Copy failed');
      console.error(error);
    });
  });

  block.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    copyCodeBlock(block).catch((error) => {
      showSnackbar('Copy failed');
      console.error(error);
    });
  });
});
