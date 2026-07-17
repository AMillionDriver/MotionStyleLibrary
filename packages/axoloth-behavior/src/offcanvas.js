import initDismissibleLayer from './internal/createDismissibleLayer.js';

const defaultOptions = {
  backdropOpenClass: 'axo-sidebar-backdrop-open',
  backdropSelector: '.axo-sidebar-backdrop[data-axo-dismiss]',
  bodyOpenClass: 'axo-offcanvas-active',
  closeOnEscape: true,
  dismissAttribute: 'data-axo-dismiss',
  dismissSelector: '[data-axo-dismiss]',
  eventPrefix: 'axo:offcanvas',
  focus: true,
  initialFocusSelector: '[autofocus]',
  openClass: 'axo-sidebar-open',
  targetAttribute: 'data-axo-id',
  targetSelector: '[data-axo-id]',
  toggleAttribute: 'data-axo-toggle',
  toggleSelector: '[data-axo-toggle]',
  trapFocus: true,
};

function initOffcanvas(root = typeof document === 'undefined' ? null : document, options = {}) {
  return initDismissibleLayer(root, { ...defaultOptions, ...options });
}

export { initOffcanvas };
export default initOffcanvas;
