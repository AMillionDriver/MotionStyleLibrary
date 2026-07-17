import { dispatchCustomEvent, getDocument, queryAll } from './internal/collection.js';

let toastCount = 0;

const defaultOptions = {
  closingClass: 'axo-toast-closing',
  duration: 5000,
  limit: 4,
  openClass: 'axo-toast-open',
  regionSelector: '[data-axo-toast-region]',
  removeDelay: 220,
  toastSelector: '[data-axo-toast]',
};

function createEmptyController() {
  return {
    clear: () => 0,
    destroy: () => {},
    dismiss: () => false,
    refresh: () => {},
    show: () => null,
  };
}

function initToast(root = typeof document === 'undefined' ? null : document, options = {}) {
  const documentRef = getDocument(root);
  if (!documentRef?.body) return createEmptyController();

  const settings = { ...defaultOptions, ...options };
  const activeToasts = new Set();
  const createdRegions = new Set();
  const createdToasts = new Set();
  const removalTimers = new Map();
  const timerRecords = new Map();
  const windowRef = documentRef.defaultView;

  const initializeRegion = (region) => {
    region.classList.add('axo-toast-region');
    if (!region.hasAttribute('role')) region.setAttribute('role', 'region');
    if (!region.hasAttribute('aria-label')) {
      region.setAttribute('aria-label', 'Notifications');
    }
    if (!region.hasAttribute('aria-live')) region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'false');
    region.setAttribute('aria-relevant', 'additions text');
    return region;
  };

  const resolveRegion = (regionOrIdentifier) => {
    if (regionOrIdentifier?.matches?.(settings.regionSelector)) {
      return initializeRegion(regionOrIdentifier);
    }

    if (typeof regionOrIdentifier === 'string') {
      const byId = documentRef.getElementById(regionOrIdentifier);
      if (byId?.matches?.(settings.regionSelector)) {
        return initializeRegion(byId);
      }
    }

    const existingRegion = queryAll(root ?? documentRef, settings.regionSelector)[0];
    if (existingRegion) return initializeRegion(existingRegion);

    const region = documentRef.createElement('div');
    region.className = 'axo-toast-region axo-toast-region-top-end';
    region.setAttribute('data-axo-toast-region', '');
    documentRef.body.append(region);
    createdRegions.add(region);
    return initializeRegion(region);
  };

  const resolveToast = (toastOrIdentifier) => {
    if (toastOrIdentifier?.matches?.(settings.toastSelector)) {
      return toastOrIdentifier;
    }

    if (typeof toastOrIdentifier !== 'string') return null;
    const byId = documentRef.getElementById(toastOrIdentifier);
    return byId?.matches?.(settings.toastSelector) ? byId : null;
  };

  const clearTimer = (toast) => {
    const record = timerRecords.get(toast);
    if (record?.timeoutId) windowRef?.clearTimeout(record.timeoutId);
    timerRecords.delete(toast);
  };

  const dismiss = (toastOrIdentifier, dismissOptions = {}) => {
    const toast = resolveToast(toastOrIdentifier);
    if (!toast || toast.classList.contains(settings.closingClass)) return false;

    clearTimer(toast);
    toast.classList.remove(settings.openClass);
    toast.classList.add(settings.closingClass);
    dispatchCustomEvent(toast, 'axo:toast-dismiss', {
      reason: dismissOptions.reason ?? 'programmatic',
    });

    const removeToast = () => {
      activeToasts.delete(toast);
      createdToasts.delete(toast);
      removalTimers.delete(toast);
      toast.remove();
    };

    if (dismissOptions.immediate || !windowRef) {
      removeToast();
    } else {
      const timeoutId = windowRef.setTimeout(removeToast, settings.removeDelay);
      removalTimers.set(toast, timeoutId);
    }

    return true;
  };

  const startTimer = (toast, duration) => {
    clearTimer(toast);
    if (!windowRef || duration <= 0) return;

    const record = {
      remaining: duration,
      startedAt: Date.now(),
      timeoutId: windowRef.setTimeout(() => {
        dismiss(toast, { reason: 'timeout' });
      }, duration),
    };
    timerRecords.set(toast, record);
  };

  const pauseTimer = (toast) => {
    const record = timerRecords.get(toast);
    if (!record?.timeoutId) return;

    windowRef?.clearTimeout(record.timeoutId);
    record.remaining = Math.max(0, record.remaining - (Date.now() - record.startedAt));
    record.timeoutId = 0;
  };

  const resumeTimer = (toast) => {
    const record = timerRecords.get(toast);
    if (!record || record.timeoutId || record.remaining <= 0) return;
    startTimer(toast, record.remaining);
  };

  const initializeToast = (toast) => {
    const region = toast.closest(settings.regionSelector);
    if (region) initializeRegion(region);

    toast.classList.add('axo-toast');
    toast.classList.remove(settings.closingClass);
    toast.classList.add(settings.openClass);
    toast.setAttribute(
      'role',
      toast.getAttribute('data-axo-toast-priority') === 'assertive' ? 'alert' : 'status'
    );
    toast.setAttribute('aria-atomic', 'true');
    activeToasts.add(toast);

    const hasDeclaredDuration = toast.hasAttribute('data-axo-toast-duration');
    const declaredDuration = Number(toast.getAttribute('data-axo-toast-duration'));
    const duration =
      hasDeclaredDuration && Number.isFinite(declaredDuration) && declaredDuration >= 0
        ? declaredDuration
        : settings.duration;
    startTimer(toast, duration);
    return toast;
  };

  const show = (showOptions = {}) => {
    const region = resolveRegion(showOptions.region);
    const regionToasts = [...activeToasts].filter(
      (toast) => toast.closest(settings.regionSelector) === region
    );

    if (settings.limit > 0) {
      while (regionToasts.length >= settings.limit) {
        const oldestToast = regionToasts.shift();
        if (oldestToast) {
          dismiss(oldestToast, { immediate: true, reason: 'limit' });
        }
      }
    }

    toastCount += 1;
    const toast = documentRef.createElement('article');
    toast.id = showOptions.id || `axo-toast-${toastCount}`;
    toast.className = `axo-toast axo-surface${showOptions.className ? ` ${showOptions.className}` : ''}`;
    toast.setAttribute('data-axo-toast', '');
    toast.setAttribute('role', showOptions.priority === 'assertive' ? 'alert' : 'status');
    toast.setAttribute('aria-atomic', 'true');
    if (showOptions.tone) toast.setAttribute('data-axo-toast-tone', showOptions.tone);

    const content = documentRef.createElement('div');
    content.className = 'axo-toast-content';

    if (showOptions.title) {
      const title = documentRef.createElement('strong');
      title.className = 'axo-toast-title';
      title.textContent = String(showOptions.title);
      content.append(title);
    }

    if (showOptions.message) {
      const message = documentRef.createElement('div');
      message.className = 'axo-toast-message';
      message.textContent = String(showOptions.message);
      content.append(message);
    }

    toast.append(content);

    if (showOptions.action?.label) {
      const actions = documentRef.createElement('div');
      actions.className = 'axo-toast-actions';
      const actionButton = documentRef.createElement('button');
      actionButton.className = 'axo-button';
      actionButton.type = 'button';
      actionButton.textContent = String(showOptions.action.label);
      actionButton.addEventListener('click', (event) => {
        showOptions.action.onClick?.(event, toast);
        if (showOptions.action.dismiss !== false) {
          dismiss(toast, { reason: 'action' });
        }
      });
      actions.append(actionButton);
      toast.append(actions);
    }

    if (showOptions.dismissible !== false) {
      const dismissButton = documentRef.createElement('button');
      dismissButton.className = 'axo-button axo-toast-dismiss';
      dismissButton.type = 'button';
      dismissButton.setAttribute('data-axo-toast-dismiss', '');
      dismissButton.setAttribute('aria-label', showOptions.dismissLabel || 'Dismiss notification');
      dismissButton.textContent = showOptions.dismissText || 'Close';
      toast.append(dismissButton);
    }

    region.append(toast);
    createdToasts.add(toast);
    activeToasts.add(toast);

    const reveal = () => toast.classList.add(settings.openClass);
    if (windowRef?.requestAnimationFrame) {
      windowRef.requestAnimationFrame(reveal);
    } else {
      reveal();
    }

    const duration = showOptions.duration ?? settings.duration;
    toast.setAttribute('data-axo-toast-duration', String(duration));
    startTimer(toast, duration);
    dispatchCustomEvent(toast, 'axo:toast-show', { region });
    return toast;
  };

  const clear = (regionOrIdentifier) => {
    const region = regionOrIdentifier ? resolveRegion(regionOrIdentifier) : null;
    const targets = [...activeToasts].filter(
      (toast) => !region || toast.closest(settings.regionSelector) === region
    );
    targets.forEach((toast) => dismiss(toast, { reason: 'clear' }));
    return targets.length;
  };

  const refresh = () => {
    queryAll(root ?? documentRef, settings.regionSelector).forEach(initializeRegion);
    queryAll(root ?? documentRef, settings.toastSelector).forEach((toast) => {
      if (!activeToasts.has(toast)) initializeToast(toast);
    });
  };

  const handleClick = (event) => {
    const dismissControl = event.target?.closest?.('[data-axo-toast-dismiss]');
    const toast = dismissControl?.closest?.(settings.toastSelector);
    if (toast) dismiss(toast, { reason: 'dismiss' });
  };

  const handlePause = (event) => {
    const toast = event.target?.closest?.(settings.toastSelector);
    if (toast) pauseTimer(toast);
  };

  const handleResume = (event) => {
    const toast = event.target?.closest?.(settings.toastSelector);
    if (!toast || toast.contains(event.relatedTarget)) return;
    resumeTimer(toast);
  };

  documentRef.addEventListener('click', handleClick);
  documentRef.addEventListener('pointerover', handlePause);
  documentRef.addEventListener('pointerout', handleResume);
  documentRef.addEventListener('focusin', handlePause);
  documentRef.addEventListener('focusout', handleResume);
  refresh();

  const destroy = () => {
    documentRef.removeEventListener('click', handleClick);
    documentRef.removeEventListener('pointerover', handlePause);
    documentRef.removeEventListener('pointerout', handleResume);
    documentRef.removeEventListener('focusin', handlePause);
    documentRef.removeEventListener('focusout', handleResume);

    timerRecords.forEach((record) => windowRef?.clearTimeout(record.timeoutId));
    removalTimers.forEach((timeoutId) => windowRef?.clearTimeout(timeoutId));
    timerRecords.clear();
    removalTimers.clear();
    createdToasts.forEach((toast) => toast.remove());
    createdRegions.forEach((region) => region.remove());
    activeToasts.clear();
  };

  return { clear, destroy, dismiss, refresh, show };
}

export { initToast };
export default initToast;
