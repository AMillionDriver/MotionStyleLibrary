# Axoloth Behavior

Optional zero-dependency JavaScript behaviors for `@quertys/axoloth-style`.

Axoloth Behavior keeps interactive state separate from the CSS-first package. Install it only when a layout needs tabs, accordions, dropdowns, toasts, an off-canvas sidebar, or a dialog. The package is framework-neutral and works with plain HTML, React, Vue, Svelte, Angular, or any DOM-based application.

## API Stability

Version `0.5.0` validates package exports, initializers, declarative attributes,
and custom events against the reviewed `0.4.0` baseline. Read
[MIGRATION.md](./MIGRATION.md) before changing public behavior contracts and run
`npm run check` before packaging a release.

## Install

```bash
npm install @quertys/axoloth-style @quertys/axoloth-behavior
```

Import the Axoloth CSS once, then initialize only the behavior you use:

```js
import '@quertys/axoloth-style/axoloth.css';
import { initAccordion } from '@quertys/axoloth-behavior/accordion';
import { initDialog } from '@quertys/axoloth-behavior/dialog';
import { initDropdown } from '@quertys/axoloth-behavior/dropdown';
import { initOffcanvas } from '@quertys/axoloth-behavior/offcanvas';
import { initTabs } from '@quertys/axoloth-behavior/tabs';
import { initToast } from '@quertys/axoloth-behavior/toast';

const accordion = initAccordion();
const dialog = initDialog();
const dropdown = initDropdown();
const offcanvas = initOffcanvas();
const tabs = initTabs();
const toast = initToast();
```

All initializers accept an optional root as their first argument and options as
their second argument. For example, configure Toast with
`initToast(document, { duration: 4500, limit: 3 })`.

## Tabs

```html
<div id="account-tabs" class="axo-tabs" data-axo-tabs>
  <div class="axo-tab-list" aria-label="Account sections">
    <button class="axo-tab" type="button" data-axo-tab="profile" aria-selected="true">
      Profile
    </button>
    <button class="axo-tab" type="button" data-axo-tab="security">Security</button>
  </div>

  <section class="axo-tab-panel" data-axo-tab-panel="profile">Profile content</section>
  <section class="axo-tab-panel" data-axo-tab-panel="security">Security content</section>
</div>
```

`initTabs()` creates the tab, tablist, and tabpanel relationships, keeps one panel visible, and supports Arrow keys, Home, and End. Activation is automatic by default. Add `data-axo-tabs-activation="manual"` when Arrow keys should move focus without switching panels until Enter or Space is pressed.

```js
tabs.activate('account-tabs', 'security', { focus: true });
tabs.refresh();
tabs.destroy();
```

## Accordion

```html
<div id="faq" class="axo-accordion" data-axo-accordion>
  <section class="axo-accordion-item axo-surface">
    <h3>
      <button
        class="axo-accordion-trigger"
        type="button"
        data-axo-accordion-trigger="install"
        aria-expanded="true"
      >
        How do I install Axoloth?
        <span class="axo-accordion-indicator" aria-hidden="true">+</span>
      </button>
    </h3>
    <div class="axo-accordion-panel" data-axo-accordion-panel="install">
      Install both packages with npm.
    </div>
  </section>
</div>
```

Accordion triggers support Arrow Up, Arrow Down, Home, and End focus navigation. Groups allow one open item by default. Add `data-axo-accordion-multiple` to allow several open panels, or `data-axo-accordion-collapsible="false"` to require one panel to remain open.

```js
accordion.open('faq', 'install');
accordion.close('faq', 'install');
accordion.toggle('faq', 'install');
accordion.refresh();
accordion.destroy();
```

## Dropdown

```html
<div id="actions-dropdown" class="axo-dropdown axo-dropdown-end" data-axo-dropdown>
  <button class="axo-button axo-dropdown-trigger" type="button" data-axo-dropdown-toggle="actions">
    Actions
  </button>

  <div class="axo-dropdown-menu axo-surface" data-axo-dropdown-menu="actions" hidden>
    <button class="axo-dropdown-item" type="button" data-axo-dropdown-item>Duplicate</button>
    <button class="axo-dropdown-item" type="button" data-axo-dropdown-item>Archive</button>
  </div>
</div>
```

`initDropdown()` synchronizes the menu button ARIA state, closes other menus, dismisses on outside click, and supports Arrow Up, Arrow Down, Home, End, Escape, and Tab. Selecting an item closes the menu and returns focus to its trigger.

```js
dropdown.open('actions-dropdown', { focus: 'first' });
dropdown.close('actions-dropdown', { restoreFocus: true });
dropdown.toggle('actions-dropdown');
dropdown.refresh();
dropdown.destroy();
```

## Toast

Add one live region to the document, then create safe text notifications through the controller:

```html
<div
  id="notifications"
  class="axo-toast-region axo-toast-region-top-end"
  data-axo-toast-region
  aria-label="Notifications"
></div>
```

```js
const notification = toast.show({
  region: 'notifications',
  title: 'Layout saved',
  message: 'Your dashboard arrangement is ready.',
  duration: 5000,
  action: {
    label: 'Undo',
    onClick() {
      console.log('Undo requested');
    },
  },
});

toast.dismiss(notification);
toast.clear('notifications');
toast.refresh();
toast.destroy();
```

Toast timers pause while the pointer or keyboard focus is inside the notification. Set `duration: 0` for a persistent toast, `priority: "assertive"` for an alert, or `dismissible: false` when dismissal is controlled entirely by an action. The controller limits each region to four active toasts by default.

## Dialog and Modal

```html
<button
  class="axo-button"
  type="button"
  data-axo-dialog-toggle="confirm-dialog"
  aria-controls="confirm-dialog"
  aria-expanded="false"
>
  Open dialog
</button>

<div
  id="confirm-dialog"
  class="axo-dialog"
  data-axo-dialog-id="confirm-dialog"
  aria-labelledby="confirm-dialog-title"
  aria-hidden="true"
>
  <div
    class="axo-dialog-backdrop"
    data-axo-dialog-dismiss="confirm-dialog"
    aria-hidden="true"
  ></div>

  <section class="axo-dialog-panel axo-surface">
    <header class="axo-dialog-header">
      <h2 id="confirm-dialog-title">Confirm action</h2>
      <button class="axo-button" type="button" data-axo-dialog-dismiss="confirm-dialog">
        Close
      </button>
    </header>

    <div class="axo-dialog-body">This layer traps focus until it is dismissed.</div>

    <footer class="axo-dialog-footer">
      <button class="axo-button" type="button" data-axo-dialog-dismiss="confirm-dialog">
        Cancel
      </button>
      <button class="axo-button" type="button">Confirm</button>
    </footer>
  </section>
</div>
```

`initDialog()` automatically handles:

- `role="dialog"`, `aria-modal`, `aria-hidden`, and trigger `aria-expanded` state.
- Escape, backdrop, and dismiss controls.
- Initial focus, Tab and Shift+Tab focus wrapping, and focus return.
- Body scroll locking while a dialog is open.
- Nested layer ordering so only the top Axoloth layer handles Escape and Tab.

Use `autofocus` on a control when it should receive initial focus. Otherwise the first focusable control is used.

## Off-Canvas Sidebar

```html
<button
  class="axo-button"
  type="button"
  data-axo-toggle="main-sidebar"
  aria-controls="main-sidebar"
  aria-expanded="false"
>
  Open menu
</button>

<aside
  id="main-sidebar"
  class="axo-sidebar axo-sidebar-offcanvas axo-surface"
  data-axo-id="main-sidebar"
  role="dialog"
  aria-modal="true"
  aria-label="Main navigation"
  aria-hidden="true"
>
  <button class="axo-button" type="button" data-axo-dismiss="main-sidebar">Close</button>
  <a class="axo-sidebar-item" href="#dashboard">Dashboard</a>
  <a class="axo-sidebar-item" href="#settings">Settings</a>
</aside>

<div class="axo-sidebar-backdrop" data-axo-dismiss="main-sidebar"></div>
```

## Dismissible Controller API

Dialog and off-canvas controllers expose the same lifecycle API:

```js
const controller = initDialog();

controller.open('confirm-dialog');
controller.close('confirm-dialog');
controller.toggle('confirm-dialog');
controller.destroy();
```

Opening and closing dispatch bubbling custom events from the controlled layer:

```js
dialogElement.addEventListener('axo:dialog-open', (event) => {
  console.log(event.detail.trigger);
});

dialogElement.addEventListener('axo:dialog-close', () => {
  console.log('Dialog closed');
});
```

Off-canvas controllers dispatch `axo:offcanvas-open` and `axo:offcanvas-close`.

## Initialize All Available Behaviors

```js
import { initAxolothBehaviors } from '@quertys/axoloth-behavior';

const axoloth = initAxolothBehaviors();

// Remove all listeners during app cleanup.
axoloth.destroy();
```

The package does not auto-initialize and does not run during server-side rendering. You keep control over when behavior is attached and destroyed.

## License

MIT
