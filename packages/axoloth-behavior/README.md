# Axoloth Behavior

Optional zero-dependency JavaScript behaviors for `@quertys/axoloth-style`.

Axoloth Behavior keeps interactive state separate from the CSS-first package. Install it only when a layout needs tabs, accordions, dropdowns, toasts, drawers, an off-canvas sidebar, or a dialog. The package is framework-neutral and works with plain HTML, React, Vue, Svelte, Angular, or any DOM-based application.

> Axoloth Style provides layout and presentation. Axoloth Behavior attaches interaction to
> `data-axo-*` attributes. Importing the CSS alone never initializes JavaScript behavior.

Read the [Behavior Guide and live Vanilla demos](https://amilliondriver.github.io/MotionStyleLibrary/docs/behavior/)
for runnable tabs, accordion, dialog, and drawer examples.

## API Stability

Version `0.6.0` validates package exports, initializers, declarative attributes,
and custom events against the reviewed `0.4.0` baseline. Read
[MIGRATION.md](./MIGRATION.md) before changing public behavior contracts and run
`npm run check` before packaging a release.

## Install

```bash
npm install @quertys/axoloth-style @quertys/axoloth-behavior
```

## Initialize Everything

Import the Axoloth CSS once, then initialize the behavior package after the DOM is available:

```js
import '@quertys/axoloth-style/axoloth.css';
import { initAxolothBehaviors } from '@quertys/axoloth-behavior';

const axoloth = initAxolothBehaviors();

// Remove every listener when the page or application is disposed.
window.addEventListener('pagehide', () => axoloth.destroy(), { once: true });
```

`initAxolothBehaviors()` initializes every exported behavior and returns their controllers under
`accordion`, `dialog`, `drawer`, `dropdown`, `offcanvas`, `tabs`, and `toast`.

## CDN / Native ES Modules

No bundler is required. Load the CSS with a stylesheet link and import the JavaScript from an ES
module script:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@quertys/axoloth-style@0.9.0/src/axoloth.css"
/>

<script type="module">
  import { initAxolothBehaviors } from 'https://cdn.jsdelivr.net/npm/@quertys/axoloth-behavior@0.6.0/src/index.js';

  const axoloth = initAxolothBehaviors();
  window.addEventListener('pagehide', () => axoloth.destroy(), { once: true });
</script>
```

Pin both versions in production so a future release cannot change a deployed page unexpectedly.

## Initialize One Behavior

Import only the behavior used by the page when you want a smaller, explicit setup:

```js
import '@quertys/axoloth-style/axoloth.css';
import { initAccordion } from '@quertys/axoloth-behavior/accordion';
import { initDialog } from '@quertys/axoloth-behavior/dialog';
import { initDrawer } from '@quertys/axoloth-behavior/drawer';
import { initDropdown } from '@quertys/axoloth-behavior/dropdown';
import { initOffcanvas } from '@quertys/axoloth-behavior/offcanvas';
import { initTabs } from '@quertys/axoloth-behavior/tabs';
import { initToast } from '@quertys/axoloth-behavior/toast';

const accordion = initAccordion();
const dialog = initDialog();
const drawer = initDrawer();
const dropdown = initDropdown();
const offcanvas = initOffcanvas();
const tabs = initTabs();
const toast = initToast();
```

All initializers accept an optional root as their first argument and options as
their second argument. For example, configure Toast with
`initToast(document, { duration: 4500, limit: 3 })`.

Scope an initializer to one part of a page and clean it up independently:

```js
import { initTabs } from '@quertys/axoloth-behavior/tabs';

const accountSection = document.querySelector('#account-section');
const tabs = initTabs(accountSection);

// Re-scan after adding matching markup dynamically.
tabs.refresh();

// Remove listeners before replacing or unmounting the section.
tabs.destroy();
```

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

`initOffcanvas()` is the legacy-compatible sidebar drawer initializer. For new
work, prefer the clearer Drawer API below.

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

## Drawer

```html
<button
  class="axo-button"
  type="button"
  data-axo-drawer-toggle="main-drawer"
  aria-controls="main-drawer"
  aria-expanded="false"
>
  Open drawer
</button>

<aside
  id="main-drawer"
  class="axo-drawer axo-surface"
  data-axo-drawer-id="main-drawer"
  aria-label="Main navigation"
  aria-hidden="true"
>
  <button class="axo-button" type="button" data-axo-drawer-dismiss="main-drawer">Close</button>
  <a class="axo-sidebar-item axo-link" href="#dashboard">Dashboard</a>
  <a class="axo-sidebar-item axo-link" href="#settings">Settings</a>
</aside>

<div class="axo-drawer-backdrop" data-axo-drawer-dismiss="main-drawer"></div>
```

`initDrawer()` manages `axo-drawer-open`, `axo-drawer-backdrop-open`, and
`axo-drawer-active`. It traps focus while open, closes on Escape or backdrop
dismissal, restores focus to the trigger, and dispatches `axo:drawer-open` and
`axo:drawer-close` from the drawer element.

## Dismissible Controller API

Dialog, drawer, and off-canvas controllers expose the same lifecycle API:

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

## Troubleshooting

### `data-axo-*` attributes do nothing

The package intentionally does not auto-initialize. Confirm that the behavior package is imported
from a `<script type="module">` or your bundler entry and that an initializer runs after the markup
exists.

### The component is styled but not interactive

`@quertys/axoloth-style` only supplies CSS. Install or load `@quertys/axoloth-behavior`, then call
`initAxolothBehaviors()` or the matching component initializer.

### A trigger cannot find its panel

Target values must match exactly. For example, `data-axo-drawer-toggle="menu"` controls
`data-axo-drawer-id="menu"`; a tab value must match its `data-axo-tab-panel` value.

### Dynamically added markup is ignored

Call the controller's `refresh()` method after inserting new tabs, accordion items, dropdowns, or
toast regions. Dialog, drawer, and off-canvas controllers use delegated events and can discover
matching targets when they are triggered.

### An interaction fires twice

The same root was probably initialized more than once. Keep the returned controller and call
`destroy()` before initializing it again.

### Server-rendered code cannot access `document`

Run initializers only on the client after the DOM exists. Calling an initializer without a DOM
returns a safe empty controller, but your own selectors must also stay inside the client lifecycle.

The package never auto-initializes and never owns your application lifecycle. You decide when
behavior is attached, refreshed, and destroyed.

## License

MIT
