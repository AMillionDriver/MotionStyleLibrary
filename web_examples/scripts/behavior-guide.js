const behaviorModulePath = import.meta.url.includes('/web_examples/')
  ? '../../packages/axoloth-behavior/src/index.js'
  : '../packages/axoloth-behavior/src/index.js';

const { initAxolothBehaviors } = await import(new URL(behaviorModulePath, import.meta.url));

const demoRoot = document.querySelector('[data-behavior-demos]');
const status = document.querySelector('[data-behavior-status]');
const behaviors = initAxolothBehaviors(demoRoot);

if (status) {
  status.textContent = 'Initialized: tabs, accordion, dialog, and drawer are ready.';
  status.dataset.state = 'ready';
}

window.addEventListener('pagehide', () => behaviors.destroy(), { once: true });
