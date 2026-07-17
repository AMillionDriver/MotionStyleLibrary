import {
  dispatchCustomEvent,
  getDocument,
  getOwnedElements,
  getRelativeItem,
  isDisabled,
  makeSafeId,
  queryAll,
} from './internal/collection.js';

let accordionGroupCount = 0;

const defaultOptions = {
  collapsible: true,
  groupSelector: '[data-axo-accordion]',
  itemOpenClass: 'axo-accordion-item-open',
  multiple: false,
  panelAttribute: 'data-axo-accordion-panel',
  panelOpenClass: 'axo-accordion-panel-open',
  panelSelector: '[data-axo-accordion-panel]',
  triggerAttribute: 'data-axo-accordion-trigger',
  triggerSelector: '[data-axo-accordion-trigger]',
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

function initAccordion(root = typeof document === 'undefined' ? null : document, options = {}) {
  const documentRef = getDocument(root);
  if (!root?.addEventListener || !documentRef) return createEmptyController();

  const settings = { ...defaultOptions, ...options };

  const getParts = (group) => ({
    panels: getOwnedElements(group, settings.groupSelector, settings.panelSelector),
    triggers: getOwnedElements(group, settings.groupSelector, settings.triggerSelector),
  });

  const getIdentifier = (element, attributeName) => element?.getAttribute(attributeName) || '';

  const findPanel = (group, identifier) =>
    getParts(group).panels.find(
      (panel) => getIdentifier(panel, settings.panelAttribute) === identifier
    ) ?? null;

  const findTrigger = (group, triggerOrIdentifier) => {
    if (triggerOrIdentifier?.matches?.(settings.triggerSelector)) {
      return triggerOrIdentifier;
    }

    return (
      getParts(group).triggers.find(
        (trigger) =>
          trigger.id === triggerOrIdentifier ||
          getIdentifier(trigger, settings.triggerAttribute) === triggerOrIdentifier
      ) ?? null
    );
  };

  const resolveGroup = (groupOrIdentifier) => {
    if (groupOrIdentifier?.matches?.(settings.groupSelector)) {
      return groupOrIdentifier;
    }

    if (typeof groupOrIdentifier !== 'string') return null;
    const byId = documentRef.getElementById(groupOrIdentifier);
    if (byId?.matches?.(settings.groupSelector)) return byId;

    return null;
  };

  const isMultiple = (group) =>
    group.hasAttribute('data-axo-accordion-multiple') || settings.multiple;

  const isCollapsible = (group) =>
    group.getAttribute('data-axo-accordion-collapsible') !== 'false' && settings.collapsible;

  const setTriggerState = (group, trigger, isOpen, shouldDispatch = true) => {
    const identifier = getIdentifier(trigger, settings.triggerAttribute);
    const panel = findPanel(group, identifier);
    if (!identifier || !panel) return false;

    const item = trigger.closest('.axo-accordion-item');
    trigger.setAttribute('aria-expanded', String(isOpen));
    panel.toggleAttribute('hidden', !isOpen);
    panel.classList.toggle(settings.panelOpenClass, isOpen);
    item?.classList.toggle(settings.itemOpenClass, isOpen);

    if (shouldDispatch) {
      dispatchCustomEvent(panel, isOpen ? 'axo:accordion-open' : 'axo:accordion-close', {
        trigger,
      });
    }

    return true;
  };

  const open = (groupOrIdentifier, triggerOrIdentifier, openOptions = {}) => {
    const group = resolveGroup(groupOrIdentifier);
    if (!group) return false;

    const trigger = findTrigger(group, triggerOrIdentifier);
    if (!trigger || isDisabled(trigger)) return false;

    if (!isMultiple(group)) {
      getParts(group).triggers.forEach((otherTrigger) => {
        if (otherTrigger !== trigger && otherTrigger.getAttribute('aria-expanded') === 'true') {
          setTriggerState(group, otherTrigger, false, openOptions.dispatch !== false);
        }
      });
    }

    return setTriggerState(group, trigger, true, openOptions.dispatch !== false);
  };

  const close = (groupOrIdentifier, triggerOrIdentifier, closeOptions = {}) => {
    const group = resolveGroup(groupOrIdentifier);
    if (!group) return false;

    const trigger = findTrigger(group, triggerOrIdentifier);
    if (!trigger || trigger.getAttribute('aria-expanded') !== 'true') return false;

    const openTriggers = getParts(group).triggers.filter(
      (item) => item.getAttribute('aria-expanded') === 'true'
    );
    if (!isCollapsible(group) && openTriggers.length <= 1) return false;

    return setTriggerState(group, trigger, false, closeOptions.dispatch !== false);
  };

  const toggle = (groupOrIdentifier, triggerOrIdentifier) => {
    const group = resolveGroup(groupOrIdentifier);
    if (!group) return false;

    const trigger = findTrigger(group, triggerOrIdentifier);
    if (!trigger || isDisabled(trigger)) return false;

    return trigger.getAttribute('aria-expanded') === 'true'
      ? close(group, trigger)
      : open(group, trigger);
  };

  const initializeGroup = (group) => {
    if (!group.id) {
      accordionGroupCount += 1;
      group.setAttribute('id', `axo-accordion-${accordionGroupCount}`);
    }

    const { panels, triggers } = getParts(group);
    triggers.forEach((trigger, index) => {
      const pairedPanel = panels[index];
      const rawIdentifier =
        getIdentifier(trigger, settings.triggerAttribute) ||
        getIdentifier(pairedPanel, settings.panelAttribute) ||
        `item-${index + 1}`;
      const identifier = makeSafeId(rawIdentifier, `item-${index + 1}`);
      const matchingPanel =
        panels.find((panel) => getIdentifier(panel, settings.panelAttribute) === rawIdentifier) ??
        pairedPanel;

      trigger.setAttribute(settings.triggerAttribute, identifier);
      if (!trigger.id) {
        trigger.setAttribute('id', `${group.id}-${identifier}-trigger`);
      }

      if (!matchingPanel) {
        trigger.setAttribute('aria-disabled', 'true');
        return;
      }

      matchingPanel.setAttribute(settings.panelAttribute, identifier);
      matchingPanel.setAttribute('role', 'region');
      if (!matchingPanel.id) {
        matchingPanel.setAttribute('id', `${group.id}-${identifier}-panel`);
      }

      trigger.setAttribute('aria-controls', matchingPanel.id);
      matchingPanel.setAttribute('aria-labelledby', trigger.id);
    });

    const enabledTriggers = triggers.filter((trigger) => !isDisabled(trigger));
    const requestedOpen = enabledTriggers.filter(
      (trigger) =>
        trigger.getAttribute('aria-expanded') === 'true' ||
        trigger.closest('.axo-accordion-item')?.classList.contains(settings.itemOpenClass)
    );
    const initialOpen = isMultiple(group) ? requestedOpen : requestedOpen.slice(0, 1);

    if (initialOpen.length === 0 && !isCollapsible(group) && enabledTriggers[0]) {
      initialOpen.push(enabledTriggers[0]);
    }

    triggers.forEach((trigger) => {
      setTriggerState(group, trigger, initialOpen.includes(trigger), false);
    });
  };

  const refresh = () => {
    queryAll(root, settings.groupSelector).forEach(initializeGroup);
  };

  const handleClick = (event) => {
    const trigger = event.target?.closest?.(settings.triggerSelector);
    if (!trigger || isDisabled(trigger)) return;

    const group = trigger.closest(settings.groupSelector);
    if (!group) return;

    event.preventDefault();
    toggle(group, trigger);
  };

  const handleKeydown = (event) => {
    const trigger = event.target?.closest?.(settings.triggerSelector);
    if (!trigger || isDisabled(trigger)) return;

    const group = trigger.closest(settings.groupSelector);
    if (!group) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggle(group, trigger);
      return;
    }

    const enabledTriggers = getParts(group).triggers.filter((item) => !isDisabled(item));
    let nextTrigger = null;

    if (event.key === 'ArrowDown') {
      nextTrigger = getRelativeItem(enabledTriggers, trigger, 1);
    } else if (event.key === 'ArrowUp') {
      nextTrigger = getRelativeItem(enabledTriggers, trigger, -1);
    } else if (event.key === 'Home') {
      [nextTrigger] = enabledTriggers;
    } else if (event.key === 'End') {
      nextTrigger = enabledTriggers.at(-1);
    }

    if (!nextTrigger) return;
    event.preventDefault();
    nextTrigger.focus({ preventScroll: true });
  };

  root.addEventListener('click', handleClick);
  root.addEventListener('keydown', handleKeydown);
  refresh();

  const destroy = () => {
    root.removeEventListener('click', handleClick);
    root.removeEventListener('keydown', handleKeydown);
  };

  return { close, destroy, open, refresh, toggle };
}

export { initAccordion };
export default initAccordion;
