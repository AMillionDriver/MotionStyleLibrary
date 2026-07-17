import {
  dispatchCustomEvent,
  getDocument,
  getOwnedElements,
  getRelativeItem,
  isDisabled,
  makeSafeId,
  queryAll,
} from './internal/collection.js';

let dropdownGroupCount = 0;

const defaultOptions = {
  groupOpenClass: 'axo-dropdown-open',
  groupSelector: '[data-axo-dropdown]',
  itemSelector: '[data-axo-dropdown-item], [role="menuitem"]',
  menuAttribute: 'data-axo-dropdown-menu',
  menuOpenClass: 'axo-dropdown-menu-open',
  menuSelector: '[data-axo-dropdown-menu]',
  triggerAttribute: 'data-axo-dropdown-toggle',
  triggerSelector: '[data-axo-dropdown-toggle]',
};

function createEmptyController() {
  return {
    close: () => false,
    destroy: () => {},
    open: () => false,
    refresh: () => {},
    toggle: () => false,
  };
}

function initDropdown(root = typeof document === 'undefined' ? null : document, options = {}) {
  const documentRef = getDocument(root);
  if (!root?.addEventListener || !documentRef) return createEmptyController();

  const settings = { ...defaultOptions, ...options };
  const openGroups = [];
  const triggerByGroup = new WeakMap();

  const getParts = (group) => ({
    menus: getOwnedElements(group, settings.groupSelector, settings.menuSelector),
    triggers: getOwnedElements(group, settings.groupSelector, settings.triggerSelector),
  });

  const getMenuItems = (menu) =>
    queryAll(menu, settings.itemSelector).filter(
      (item) => item.closest(settings.menuSelector) === menu && !isDisabled(item)
    );

  const resolveGroup = (groupOrIdentifier) => {
    if (groupOrIdentifier?.matches?.(settings.groupSelector)) {
      return groupOrIdentifier;
    }

    if (typeof groupOrIdentifier !== 'string') return null;
    const byId = documentRef.getElementById(groupOrIdentifier);
    if (byId?.matches?.(settings.groupSelector)) return byId;

    return null;
  };

  const getGroupControls = (group) => {
    const { menus, triggers } = getParts(group);
    return {
      menu: menus[0] ?? null,
      trigger: triggers[0] ?? null,
    };
  };

  const focusMenuItem = (menu, position = 'first') => {
    const items = getMenuItems(menu);
    const target = position === 'last' ? items.at(-1) : items[0];
    target?.focus({ preventScroll: true });
  };

  const close = (groupOrIdentifier, closeOptions = {}) => {
    const group = resolveGroup(groupOrIdentifier);
    if (!group || !group.classList.contains(settings.groupOpenClass)) {
      return false;
    }

    const { menu, trigger } = getGroupControls(group);
    if (!menu || !trigger) return false;

    group.classList.remove(settings.groupOpenClass);
    menu.classList.remove(settings.menuOpenClass);
    menu.setAttribute('aria-hidden', 'true');
    menu.setAttribute('inert', '');
    trigger.setAttribute('aria-expanded', 'false');

    const groupIndex = openGroups.indexOf(group);
    if (groupIndex >= 0) openGroups.splice(groupIndex, 1);

    const openingTrigger = triggerByGroup.get(group) ?? trigger;
    if (closeOptions.restoreFocus) {
      openingTrigger.focus({ preventScroll: true });
    }

    if (closeOptions.dispatch !== false) {
      dispatchCustomEvent(menu, 'axo:dropdown-close', {
        trigger: openingTrigger,
      });
    }

    return true;
  };

  const open = (groupOrIdentifier, openOptions = {}) => {
    const group = resolveGroup(groupOrIdentifier);
    if (!group) return false;

    const { menu, trigger } = getGroupControls(group);
    if (!menu || !trigger || isDisabled(trigger)) return false;

    [...openGroups].forEach((openGroup) => {
      if (openGroup !== group) {
        close(openGroup, { dispatch: true, restoreFocus: false });
      }
    });

    triggerByGroup.set(group, trigger);
    group.classList.add(settings.groupOpenClass);
    menu.classList.add(settings.menuOpenClass);
    menu.removeAttribute('inert');
    menu.setAttribute('aria-hidden', 'false');
    trigger.setAttribute('aria-expanded', 'true');
    if (!openGroups.includes(group)) openGroups.push(group);

    if (openOptions.focus !== false) {
      focusMenuItem(menu, openOptions.focus === 'last' ? 'last' : 'first');
    }

    if (openOptions.dispatch !== false) {
      dispatchCustomEvent(menu, 'axo:dropdown-open', { trigger });
    }

    return true;
  };

  const toggle = (groupOrIdentifier, toggleOptions = {}) => {
    const group = resolveGroup(groupOrIdentifier);
    if (!group) return false;

    return group.classList.contains(settings.groupOpenClass)
      ? close(group, { restoreFocus: true, ...toggleOptions })
      : open(group, toggleOptions);
  };

  const initializeGroup = (group) => {
    if (!group.id) {
      dropdownGroupCount += 1;
      group.setAttribute('id', `axo-dropdown-${dropdownGroupCount}`);
    }

    const { menu, trigger } = getGroupControls(group);
    if (!menu || !trigger) return;

    const rawIdentifier =
      trigger.getAttribute(settings.triggerAttribute) ||
      menu.getAttribute(settings.menuAttribute) ||
      'menu';
    const identifier = makeSafeId(rawIdentifier, 'menu');

    trigger.setAttribute(settings.triggerAttribute, identifier);
    trigger.setAttribute('aria-haspopup', 'menu');
    if (!trigger.id) trigger.setAttribute('id', `${group.id}-${identifier}-trigger`);

    menu.setAttribute(settings.menuAttribute, identifier);
    menu.setAttribute('role', 'menu');
    if (!menu.id) menu.setAttribute('id', `${group.id}-${identifier}-menu`);
    menu.setAttribute('aria-labelledby', trigger.id);
    trigger.setAttribute('aria-controls', menu.id);

    getMenuItems(menu).forEach((item) => {
      if (!item.hasAttribute('role')) item.setAttribute('role', 'menuitem');
      item.setAttribute('tabindex', '-1');
    });

    const isOpen =
      group.classList.contains(settings.groupOpenClass) ||
      menu.classList.contains(settings.menuOpenClass);
    group.classList.toggle(settings.groupOpenClass, isOpen);
    menu.classList.toggle(settings.menuOpenClass, isOpen);
    menu.removeAttribute('hidden');
    menu.toggleAttribute('inert', !isOpen);
    menu.setAttribute('aria-hidden', String(!isOpen));
    trigger.setAttribute('aria-expanded', String(isOpen));

    if (isOpen && !openGroups.includes(group)) openGroups.push(group);
  };

  const refresh = () => {
    queryAll(root, settings.groupSelector).forEach(initializeGroup);
  };

  const handleClick = (event) => {
    const trigger = event.target?.closest?.(settings.triggerSelector);
    if (trigger) {
      const group = trigger.closest(settings.groupSelector);
      if (!group || isDisabled(trigger)) return;

      event.preventDefault();
      toggle(group);
      return;
    }

    const item = event.target?.closest?.(settings.itemSelector);
    if (!item || isDisabled(item)) return;

    const menu = item.closest(settings.menuSelector);
    const group = menu?.closest(settings.groupSelector);
    if (group) close(group, { restoreFocus: true });
  };

  const handleDocumentClick = (event) => {
    [...openGroups].forEach((group) => {
      if (!group.contains(event.target)) {
        close(group, { restoreFocus: false });
      }
    });
  };

  const handleKeydown = (event) => {
    const trigger = event.target?.closest?.(settings.triggerSelector);
    if (trigger) {
      const group = trigger.closest(settings.groupSelector);
      if (!group || isDisabled(trigger)) return;

      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        open(group, { focus: event.key === 'ArrowUp' ? 'last' : 'first' });
      } else if (event.key === 'Escape') {
        event.preventDefault();
        close(group, { restoreFocus: true });
      }
      return;
    }

    const item = event.target?.closest?.(settings.itemSelector);
    if (!item) return;

    const menu = item.closest(settings.menuSelector);
    const group = menu?.closest(settings.groupSelector);
    if (!menu || !group) return;

    const items = getMenuItems(menu);
    let nextItem = null;

    if (event.key === 'ArrowDown') {
      nextItem = getRelativeItem(items, item, 1);
    } else if (event.key === 'ArrowUp') {
      nextItem = getRelativeItem(items, item, -1);
    } else if (event.key === 'Home') {
      [nextItem] = items;
    } else if (event.key === 'End') {
      nextItem = items.at(-1);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      close(group, { restoreFocus: true });
      return;
    } else if (event.key === 'Tab') {
      close(group, { restoreFocus: false });
      return;
    }

    if (!nextItem) return;
    event.preventDefault();
    nextItem.focus({ preventScroll: true });
  };

  root.addEventListener('click', handleClick);
  root.addEventListener('keydown', handleKeydown);
  documentRef.addEventListener('click', handleDocumentClick);
  refresh();

  const destroy = () => {
    root.removeEventListener('click', handleClick);
    root.removeEventListener('keydown', handleKeydown);
    documentRef.removeEventListener('click', handleDocumentClick);
    [...openGroups].forEach((group) => {
      close(group, { dispatch: false, restoreFocus: false });
    });
  };

  return { close, destroy, open, refresh, toggle };
}

export { initDropdown };
export default initDropdown;
