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

function getOwnedElements(group, groupSelector, itemSelector) {
  return queryAll(group, itemSelector).filter(
    (element) => element.closest(groupSelector) === group
  );
}

function isDisabled(element) {
  return element.matches?.(':disabled') || element.getAttribute('aria-disabled') === 'true';
}

function dispatchCustomEvent(target, name, detail) {
  const EventConstructor = target.ownerDocument?.defaultView?.CustomEvent;
  if (!EventConstructor) return;

  target.dispatchEvent(
    new EventConstructor(name, {
      bubbles: true,
      detail,
    })
  );
}

function makeSafeId(value, fallback) {
  const safeValue = String(value ?? '')
    .trim()
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return safeValue || fallback;
}

function getRelativeItem(items, current, offset) {
  if (items.length === 0) return null;

  const currentIndex = Math.max(0, items.indexOf(current));
  const nextIndex = (currentIndex + offset + items.length) % items.length;
  return items[nextIndex];
}

export {
  dispatchCustomEvent,
  getDocument,
  getOwnedElements,
  getRelativeItem,
  isDisabled,
  makeSafeId,
  queryAll,
};
