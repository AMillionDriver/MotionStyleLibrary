const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const layerStacks = new WeakMap();

function createEmptyController() {
  return {
    close: () => false,
    destroy: () => {},
    open: () => false,
    toggle: () => false,
  };
}

function getDocument(root) {
  if (!root) return null;
  if (root.nodeType === 9) return root;
  return root.ownerDocument ?? null;
}

function queryAll(root, selector) {
  if (!root?.querySelectorAll || !selector) return [];

  const matches = root.matches?.(selector) ? [root] : [];
  return [...matches, ...root.querySelectorAll(selector)];
}

function getLayerStack(documentRef) {
  if (!layerStacks.has(documentRef)) layerStacks.set(documentRef, []);
  return layerStacks.get(documentRef);
}

function pushLayer(documentRef, target) {
  const stack = getLayerStack(documentRef);
  const currentIndex = stack.indexOf(target);
  if (currentIndex >= 0) stack.splice(currentIndex, 1);
  stack.push(target);
}

function removeLayer(documentRef, target) {
  const stack = getLayerStack(documentRef);
  const currentIndex = stack.indexOf(target);
  if (currentIndex >= 0) stack.splice(currentIndex, 1);
}

function isTopLayer(documentRef, target) {
  return getLayerStack(documentRef).at(-1) === target;
}

function isVisible(element, documentRef) {
  const style = documentRef.defaultView?.getComputedStyle(element);
  return style?.display !== 'none' && style?.visibility !== 'hidden';
}

function getFocusableElements(target, documentRef) {
  return queryAll(target, FOCUSABLE_SELECTOR).filter(
    (element) => element.getAttribute('aria-hidden') !== 'true' && isVisible(element, documentRef)
  );
}

function dispatchStateEvent(target, eventPrefix, state, trigger) {
  const EventConstructor = target.ownerDocument?.defaultView?.CustomEvent;
  if (!EventConstructor) return;

  target.dispatchEvent(
    new EventConstructor(`${eventPrefix}-${state}`, {
      bubbles: true,
      detail: { trigger },
    })
  );
}

function initDismissibleLayer(
  root = typeof document === 'undefined' ? null : document,
  options = {}
) {
  const documentRef = getDocument(root);
  if (!root?.addEventListener || !documentRef) return createEmptyController();

  const settings = {
    backdropOpenClass: '',
    backdropSelector: '',
    bodyOpenClass: '',
    closeOnEscape: true,
    dismissAttribute: '',
    dismissSelector: '',
    eventPrefix: 'axo:layer',
    focus: true,
    initialFocusSelector: '[autofocus]',
    openClass: '',
    targetAttribute: '',
    targetAttributes: {},
    targetSelector: '',
    toggleAttribute: '',
    toggleSelector: '',
    trapFocus: true,
    ...options,
  };

  const openTargets = [];
  const triggerByTarget = new WeakMap();
  const addedTabIndex = new WeakSet();
  let focusFrame = 0;

  const getTargetIdentifier = (target) =>
    target?.getAttribute(settings.targetAttribute) || target?.id || '';

  const getControlIdentifier = (control, attributeName, useAriaControls = false) =>
    control?.getAttribute(attributeName) ||
    (useAriaControls ? control?.getAttribute('aria-controls') : '') ||
    '';

  const findByIdentifier = (identifier) => {
    if (!identifier) return null;

    const byId = documentRef.getElementById(identifier);
    if (byId && (root === documentRef || root === byId || root.contains?.(byId))) {
      return byId;
    }

    return (
      queryAll(root, settings.targetSelector).find(
        (element) => element.getAttribute(settings.targetAttribute) === identifier
      ) ?? null
    );
  };

  const getTarget = (targetOrIdentifier) => {
    if (typeof targetOrIdentifier === 'string') {
      return findByIdentifier(targetOrIdentifier);
    }

    return targetOrIdentifier?.classList ? targetOrIdentifier : null;
  };

  const applyTargetAttributes = (target) => {
    Object.entries(settings.targetAttributes).forEach(([name, value]) => {
      if (!target.hasAttribute(name)) target.setAttribute(name, value);
    });
  };

  const ensureTargetCanFocus = (target) => {
    if (target.hasAttribute('tabindex')) return;
    target.setAttribute('tabindex', '-1');
    addedTabIndex.add(target);
  };

  const setTriggerState = (identifier, isOpen) => {
    queryAll(root, settings.toggleSelector).forEach((trigger) => {
      if (getControlIdentifier(trigger, settings.toggleAttribute, true) !== identifier) {
        return;
      }

      trigger.setAttribute('aria-controls', identifier);
      trigger.setAttribute('aria-expanded', String(isOpen));
    });
  };

  const setBackdropState = (identifier, isOpen) => {
    queryAll(root, settings.backdropSelector).forEach((backdrop) => {
      if (getControlIdentifier(backdrop, settings.dismissAttribute) !== identifier) {
        return;
      }

      backdrop.classList.toggle(settings.backdropOpenClass, isOpen);
      backdrop.setAttribute('aria-hidden', 'true');
    });
  };

  const syncBodyState = () => {
    if (!settings.bodyOpenClass) return;
    documentRef.body?.classList.toggle(settings.bodyOpenClass, openTargets.length > 0);
  };

  const scheduleFocus = (element) => {
    const windowRef = documentRef.defaultView;
    if (!windowRef?.requestAnimationFrame) {
      element.focus?.({ preventScroll: true });
      return;
    }

    windowRef.cancelAnimationFrame(focusFrame);
    focusFrame = windowRef.requestAnimationFrame(() => {
      element.focus?.({ preventScroll: true });
    });
  };

  const focusTarget = (target) => {
    if (!settings.focus) return;

    const preferredFocus = settings.initialFocusSelector
      ? target.querySelector(settings.initialFocusSelector)
      : null;
    const nextFocus =
      (preferredFocus && isVisible(preferredFocus, documentRef) ? preferredFocus : null) ??
      getFocusableElements(target, documentRef)[0] ??
      target;

    scheduleFocus(nextFocus);
  };

  const close = (targetOrIdentifier, closeOptions = {}) => {
    const target = getTarget(targetOrIdentifier);
    if (!target || !target.classList.contains(settings.openClass)) return false;

    const identifier = getTargetIdentifier(target);
    target.classList.remove(settings.openClass);
    target.setAttribute('aria-hidden', 'true');

    const targetIndex = openTargets.indexOf(target);
    if (targetIndex >= 0) openTargets.splice(targetIndex, 1);
    removeLayer(documentRef, target);

    setTriggerState(identifier, false);
    setBackdropState(identifier, false);
    syncBodyState();

    const trigger = triggerByTarget.get(target);
    if (closeOptions.restoreFocus !== false && trigger?.isConnected) {
      scheduleFocus(trigger);
    }

    dispatchStateEvent(target, settings.eventPrefix, 'close', trigger ?? null);
    return true;
  };

  const open = (targetOrIdentifier, trigger = null) => {
    const target = getTarget(targetOrIdentifier);
    if (!target) return false;

    const identifier = getTargetIdentifier(target);
    if (!identifier) return false;

    if (target.classList.contains(settings.openClass)) {
      if (trigger) triggerByTarget.set(target, trigger);
      pushLayer(documentRef, target);
      return true;
    }

    [...openTargets].forEach((openTarget) => {
      if (openTarget !== target) close(openTarget, { restoreFocus: false });
    });

    if (!target.id) target.id = identifier;
    applyTargetAttributes(target);
    ensureTargetCanFocus(target);
    if (trigger) triggerByTarget.set(target, trigger);

    target.classList.add(settings.openClass);
    target.setAttribute('aria-hidden', 'false');
    openTargets.push(target);
    pushLayer(documentRef, target);

    setTriggerState(identifier, true);
    setBackdropState(identifier, true);
    syncBodyState();
    focusTarget(target);
    dispatchStateEvent(target, settings.eventPrefix, 'open', trigger);
    return true;
  };

  const toggle = (targetOrIdentifier, trigger = null) => {
    const target = getTarget(targetOrIdentifier);
    if (!target) return false;

    return target.classList.contains(settings.openClass) ? close(target) : open(target, trigger);
  };

  const handleClick = (event) => {
    const toggleControl = event.target?.closest?.(settings.toggleSelector);
    if (toggleControl) {
      event.preventDefault();
      toggle(getControlIdentifier(toggleControl, settings.toggleAttribute, true), toggleControl);
      return;
    }

    const dismissControl = event.target?.closest?.(settings.dismissSelector);
    if (!dismissControl) return;

    event.preventDefault();
    close(getControlIdentifier(dismissControl, settings.dismissAttribute));
  };

  const handleKeydown = (event) => {
    if (event.defaultPrevented) return;

    const activeTarget = openTargets.at(-1);
    if (!activeTarget || !isTopLayer(documentRef, activeTarget)) return;

    if (event.key === 'Escape' && settings.closeOnEscape) {
      event.preventDefault();
      close(activeTarget);
      return;
    }

    if (event.key !== 'Tab' || !settings.trapFocus) return;

    const focusable = getFocusableElements(activeTarget, documentRef);
    if (focusable.length === 0) {
      event.preventDefault();
      activeTarget.focus?.({ preventScroll: true });
      return;
    }

    const first = focusable[0];
    const last = focusable.at(-1);
    const { activeElement } = documentRef;
    const focusIsOutside = !activeTarget.contains(activeElement);

    if (event.shiftKey && (activeElement === first || focusIsOutside)) {
      event.preventDefault();
      last.focus?.({ preventScroll: true });
    } else if (!event.shiftKey && (activeElement === last || focusIsOutside)) {
      event.preventDefault();
      first.focus?.({ preventScroll: true });
    }
  };

  root.addEventListener('click', handleClick);
  documentRef.addEventListener('keydown', handleKeydown);

  queryAll(root, settings.targetSelector).forEach((target) => {
    const identifier = getTargetIdentifier(target);
    if (!identifier) return;

    applyTargetAttributes(target);
    const isOpen = target.classList.contains(settings.openClass);
    target.setAttribute('aria-hidden', String(!isOpen));
    setTriggerState(identifier, isOpen);
    setBackdropState(identifier, isOpen);

    if (isOpen) {
      ensureTargetCanFocus(target);
      openTargets.push(target);
      pushLayer(documentRef, target);
    }
  });
  syncBodyState();

  const destroy = () => {
    root.removeEventListener('click', handleClick);
    documentRef.removeEventListener('keydown', handleKeydown);
    documentRef.defaultView?.cancelAnimationFrame(focusFrame);

    [...openTargets].forEach((target) => {
      close(target, { restoreFocus: false });
    });

    queryAll(root, settings.targetSelector).forEach((target) => {
      removeLayer(documentRef, target);
      if (addedTabIndex.has(target)) target.removeAttribute('tabindex');
    });

    if (settings.bodyOpenClass) {
      documentRef.body?.classList.remove(settings.bodyOpenClass);
    }
  };

  return { close, destroy, open, toggle };
}

export default initDismissibleLayer;
