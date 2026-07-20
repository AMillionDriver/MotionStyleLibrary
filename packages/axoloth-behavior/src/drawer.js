import initDismissibleLayer from './internal/createDismissibleLayer.js';

const defaultOptions = {
  backdropOpenClass: 'axo-drawer-backdrop-open',
  backdropSelector: '.axo-drawer-backdrop[data-axo-drawer-dismiss]',
  bodyOpenClass: 'axo-drawer-active',
  closeOnEscape: true,
  dismissAttribute: 'data-axo-drawer-dismiss',
  dismissSelector: '[data-axo-drawer-dismiss]',
  eventPrefix: 'axo:drawer',
  focus: true,
  initialFocusSelector: '[autofocus]',
  openClass: 'axo-drawer-open',
  targetAttribute: 'data-axo-drawer-id',
  targetAttributes: {
    'aria-modal': 'true',
    role: 'dialog',
  },
  targetSelector: '[data-axo-drawer-id]',
  toggleAttribute: 'data-axo-drawer-toggle',
  toggleSelector: '[data-axo-drawer-toggle]',
  trapFocus: true,
};

function initDrawer(root = typeof document === 'undefined' ? null : document, options = {}) {
  return initDismissibleLayer(root, { ...defaultOptions, ...options });
}

export { initDrawer };
export default initDrawer;
