import initDismissibleLayer from './internal/createDismissibleLayer.js';

const defaultOptions = {
  backdropOpenClass: 'axo-dialog-backdrop-open',
  backdropSelector: '.axo-dialog-backdrop[data-axo-dialog-dismiss]',
  bodyOpenClass: 'axo-dialog-active',
  closeOnEscape: true,
  dismissAttribute: 'data-axo-dialog-dismiss',
  dismissSelector: '[data-axo-dialog-dismiss]',
  eventPrefix: 'axo:dialog',
  focus: true,
  initialFocusSelector: '[autofocus]',
  openClass: 'axo-dialog-open',
  targetAttribute: 'data-axo-dialog-id',
  targetAttributes: {
    'aria-modal': 'true',
    role: 'dialog',
  },
  targetSelector: '[data-axo-dialog-id]',
  toggleAttribute: 'data-axo-dialog-toggle',
  toggleSelector: '[data-axo-dialog-toggle]',
  trapFocus: true,
};

function initDialog(root = typeof document === 'undefined' ? null : document, options = {}) {
  return initDismissibleLayer(root, {
    ...defaultOptions,
    ...options,
    targetAttributes: {
      ...defaultOptions.targetAttributes,
      ...options.targetAttributes,
    },
  });
}

export { initDialog };
export default initDialog;
