import { initAccordion } from './accordion.js';
import { initDialog } from './dialog.js';
import { initDropdown } from './dropdown.js';
import { initOffcanvas } from './offcanvas.js';
import { initTabs } from './tabs.js';
import { initToast } from './toast.js';

export { initAccordion, initDialog, initDropdown, initOffcanvas, initTabs, initToast };

export function initAxolothBehaviors(
  root = typeof document === 'undefined' ? null : document,
  options = {}
) {
  const accordion = initAccordion(root, options.accordion);
  const dialog = initDialog(root, options.dialog);
  const dropdown = initDropdown(root, options.dropdown);
  const offcanvas = initOffcanvas(root, options.offcanvas);
  const tabs = initTabs(root, options.tabs);
  const toast = initToast(root, options.toast);

  return {
    accordion,
    dialog,
    dropdown,
    offcanvas,
    tabs,
    toast,
    destroy() {
      accordion.destroy();
      dialog.destroy();
      dropdown.destroy();
      offcanvas.destroy();
      tabs.destroy();
      toast.destroy();
    },
  };
}
