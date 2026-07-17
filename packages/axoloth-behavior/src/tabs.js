import {
  dispatchCustomEvent,
  getDocument,
  getOwnedElements,
  getRelativeItem,
  isDisabled,
  makeSafeId,
  queryAll,
} from './internal/collection.js';

let tabsGroupCount = 0;

const defaultOptions = {
  activation: 'automatic',
  activePanelClass: 'axo-tab-panel-active',
  activeTabClass: 'axo-tab-active',
  groupSelector: '[data-axo-tabs]',
  panelAttribute: 'data-axo-tab-panel',
  panelSelector: '[data-axo-tab-panel]',
  tabAttribute: 'data-axo-tab',
  tabListSelector: '.axo-tab-list',
  tabSelector: '[data-axo-tab]',
};

function createEmptyController() {
  return {
    activate: () => false,
    destroy: () => {},
    refresh: () => {},
  };
}

function initTabs(root = typeof document === 'undefined' ? null : document, options = {}) {
  const documentRef = getDocument(root);
  if (!root?.addEventListener || !documentRef) return createEmptyController();

  const settings = { ...defaultOptions, ...options };

  const getParts = (group) => ({
    panels: getOwnedElements(group, settings.groupSelector, settings.panelSelector),
    tabs: getOwnedElements(group, settings.groupSelector, settings.tabSelector),
  });

  const getIdentifier = (element, attributeName) => element?.getAttribute(attributeName) || '';

  const findPanel = (group, identifier) =>
    getParts(group).panels.find(
      (panel) => getIdentifier(panel, settings.panelAttribute) === identifier
    ) ?? null;

  const findTab = (group, tabOrIdentifier) => {
    if (tabOrIdentifier?.matches?.(settings.tabSelector)) {
      return tabOrIdentifier;
    }

    return (
      getParts(group).tabs.find(
        (tab) =>
          tab.id === tabOrIdentifier ||
          getIdentifier(tab, settings.tabAttribute) === tabOrIdentifier
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

  const setState = (group, activeTab, stateOptions = {}) => {
    if (!activeTab || isDisabled(activeTab)) return false;

    const identifier = getIdentifier(activeTab, settings.tabAttribute);
    const activePanel = findPanel(group, identifier);
    if (!identifier || !activePanel) return false;

    const { panels, tabs } = getParts(group);
    const previousTab = tabs.find((tab) => tab.getAttribute('aria-selected') === 'true');

    tabs.forEach((tab) => {
      const isActive = tab === activeTab;
      tab.classList.toggle(settings.activeTabClass, isActive);
      tab.setAttribute('aria-selected', String(isActive));
      tab.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    panels.forEach((panel) => {
      const isActive = panel === activePanel;
      panel.classList.toggle(settings.activePanelClass, isActive);
      panel.toggleAttribute('hidden', !isActive);
    });

    if (stateOptions.focus) activeTab.focus({ preventScroll: true });

    if (stateOptions.dispatch !== false && previousTab !== activeTab) {
      dispatchCustomEvent(group, 'axo:tabs-change', {
        activeTab,
        previousTab: previousTab ?? null,
      });
    }

    return true;
  };

  const initializeGroup = (group) => {
    if (!group.id) {
      tabsGroupCount += 1;
      group.setAttribute('id', `axo-tabs-${tabsGroupCount}`);
    }

    const tabList = getOwnedElements(group, settings.groupSelector, settings.tabListSelector)[0];
    if (tabList) {
      tabList.setAttribute('role', 'tablist');
      if (
        !tabList.hasAttribute('aria-orientation') &&
        group.classList.contains('axo-tabs-vertical')
      ) {
        tabList.setAttribute('aria-orientation', 'vertical');
      }
    }

    const { panels, tabs } = getParts(group);
    tabs.forEach((tab, index) => {
      const pairedPanel = panels[index];
      const rawIdentifier =
        getIdentifier(tab, settings.tabAttribute) ||
        getIdentifier(pairedPanel, settings.panelAttribute) ||
        `tab-${index + 1}`;
      const identifier = makeSafeId(rawIdentifier, `tab-${index + 1}`);
      const matchingPanel =
        panels.find((panel) => getIdentifier(panel, settings.panelAttribute) === rawIdentifier) ??
        pairedPanel;

      tab.setAttribute(settings.tabAttribute, identifier);
      tab.setAttribute('role', 'tab');
      if (!tab.id) tab.setAttribute('id', `${group.id}-${identifier}-tab`);

      if (!matchingPanel) {
        tab.setAttribute('aria-disabled', 'true');
        tab.setAttribute('tabindex', '-1');
        return;
      }

      matchingPanel.setAttribute(settings.panelAttribute, identifier);
      matchingPanel.setAttribute('role', 'tabpanel');
      if (!matchingPanel.id) {
        matchingPanel.setAttribute('id', `${group.id}-${identifier}-panel`);
      }

      tab.setAttribute('aria-controls', matchingPanel.id);
      matchingPanel.setAttribute('aria-labelledby', tab.id);
      matchingPanel.setAttribute('tabindex', '0');
    });

    const enabledTabs = tabs.filter(
      (tab) => !isDisabled(tab) && findPanel(group, getIdentifier(tab, settings.tabAttribute))
    );
    const activeTab =
      enabledTabs.find(
        (tab) =>
          tab.getAttribute('aria-selected') === 'true' ||
          tab.classList.contains(settings.activeTabClass)
      ) ?? enabledTabs[0];

    if (activeTab) setState(group, activeTab, { dispatch: false });
  };

  const refresh = () => {
    queryAll(root, settings.groupSelector).forEach(initializeGroup);
  };

  const activate = (groupOrIdentifier, tabOrIdentifier, activateOptions = {}) => {
    const group = resolveGroup(groupOrIdentifier);
    if (!group) return false;

    const tab = findTab(group, tabOrIdentifier);
    return setState(group, tab, activateOptions);
  };

  const handleClick = (event) => {
    const tab = event.target?.closest?.(settings.tabSelector);
    if (!tab || isDisabled(tab)) return;

    const group = tab.closest(settings.groupSelector);
    if (!group) return;

    event.preventDefault();
    setState(group, tab, { focus: true });
  };

  const handleKeydown = (event) => {
    const tab = event.target?.closest?.(settings.tabSelector);
    if (!tab || isDisabled(tab)) return;

    const group = tab.closest(settings.groupSelector);
    if (!group) return;

    const tabList = tab.closest(settings.tabListSelector);
    const orientation = tabList?.getAttribute('aria-orientation') || 'horizontal';
    const enabledTabs = getParts(group).tabs.filter((item) => !isDisabled(item));
    let nextTab = null;

    if (
      (orientation === 'horizontal' && event.key === 'ArrowRight') ||
      (orientation === 'vertical' && event.key === 'ArrowDown')
    ) {
      nextTab = getRelativeItem(enabledTabs, tab, 1);
    } else if (
      (orientation === 'horizontal' && event.key === 'ArrowLeft') ||
      (orientation === 'vertical' && event.key === 'ArrowUp')
    ) {
      nextTab = getRelativeItem(enabledTabs, tab, -1);
    } else if (event.key === 'Home') {
      [nextTab] = enabledTabs;
    } else if (event.key === 'End') {
      nextTab = enabledTabs.at(-1);
    }

    if (nextTab) {
      event.preventDefault();
      enabledTabs.forEach((item) => item.setAttribute('tabindex', '-1'));
      nextTab.setAttribute('tabindex', '0');
      nextTab.focus({ preventScroll: true });

      const activation = group.getAttribute('data-axo-tabs-activation') || settings.activation;
      if (activation !== 'manual') setState(group, nextTab);
      return;
    }

    if (
      (event.key === 'Enter' || event.key === ' ') &&
      (group.getAttribute('data-axo-tabs-activation') || settings.activation) === 'manual'
    ) {
      event.preventDefault();
      setState(group, tab);
    }
  };

  root.addEventListener('click', handleClick);
  root.addEventListener('keydown', handleKeydown);
  refresh();

  const destroy = () => {
    root.removeEventListener('click', handleClick);
    root.removeEventListener('keydown', handleKeydown);
  };

  return { activate, destroy, refresh };
}

export { initTabs };
export default initTabs;
