# Axoloth Style

CSS-first layout and motion utilities for app shells, sidebars, bento grids, semantic controls, and simple animation presets.

Axoloth Style is a small CSS utility package for reusable layout and animation behavior. It helps you build app shells, sidebars, bento grids, structural cards, semantic controls, and lightweight motion effects without depending on React, Tailwind, Motion, Vite, or any runtime JavaScript.

It is not a Tailwind replacement and it does not try to own your full visual theme. Use Axoloth Style for layout and motion, then keep colors, typography, spacing details, and brand styling in your app.

> Indonesian note: Axoloth Style dipakai untuk mempercepat format layout dan animasi, bukan untuk menggantikan styling utama project kamu.

## API Stability

Axoloth `0.6.0` validates every public class and CSS variable against the
reviewed `0.5.0` API baseline. Utilities cannot be removed silently: renames
must ship as documented aliases with machine-readable replacement and removal
versions.

- Read [MIGRATION.md](./MIGRATION.md) before upgrading across minor versions.
- Read [NAMING.md](./NAMING.md) before proposing public names.
- Run `npm run check` inside this package to verify metadata and API compatibility.

## Install

```bash
npm install @quertys/axoloth-style
```

For local package development inside this repository:

```bash
npm install ./packages/axoloth-style
```

## Quick Start

Import the full CSS entry once in your app:

```js
import '@quertys/axoloth-style/axoloth.css';
```

Then use the `axo-*` utility classes in your markup:

```html
<div class="axo-theme-dark axo-bento">
  <div class="axo-card axo-surface axo-wide axo-rise axo-lift">Bento wide</div>

  <div class="axo-card axo-contrast axo-tall axo-pop axo-glow">Bento tall</div>

  <div class="axo-card axo-surface axo-square axo-fade">Bento square</div>
</div>
```

Axoloth Style gives these elements structure, responsive grid behavior, transitions, animations, and optional surface colors. The surface utilities are intentionally minimal, so you can still use your own CSS, Tailwind, Bootstrap, or design system for the final theme.

## CSS Entry Points

Use the full entry when you want everything:

```js
import '@quertys/axoloth-style/axoloth.css';
```

Use smaller entries when you only need one module:

```js
import '@quertys/axoloth-style/accordion.css';
import '@quertys/axoloth-style/bento.css';
import '@quertys/axoloth-style/dialog.css';
import '@quertys/axoloth-style/dropdown.css';
import '@quertys/axoloth-style/layout.css';
import '@quertys/axoloth-style/motion.css';
import '@quertys/axoloth-style/semantic.css';
import '@quertys/axoloth-style/surface.css';
import '@quertys/axoloth-style/tabs.css';
import '@quertys/axoloth-style/toast.css';
```

Available package exports:

- `@quertys/axoloth-style/accordion.css`: accordion item, trigger, panel, indicator, and state utilities only.
- `@quertys/axoloth-style/axoloth.css`: all Axoloth layout, surface, and motion utilities.
- `@quertys/axoloth-style/bento.css`: bento grid and card layout utilities only.
- `@quertys/axoloth-style/dialog.css`: dialog overlay, panel, regions, sizing, and state utilities only.
- `@quertys/axoloth-style/dropdown.css`: dropdown positioning, menu, item, label, separator, and state utilities only.
- `@quertys/axoloth-style/layout.css`: app shell, sidebar, app header, searchbar, and structural layout utilities only.
- `@quertys/axoloth-style/motion.css`: animation and hover motion utilities only.
- `@quertys/axoloth-style/semantic.css`: page, container, nav, list, button, and form utilities only.
- `@quertys/axoloth-style/surface.css`: light/dark surface and contrast utilities only.
- `@quertys/axoloth-style/tabs.css`: horizontal, vertical, control, panel, and selected tab utilities only.
- `@quertys/axoloth-style/toast.css`: fixed notification regions, toast layout, content, actions, and lifecycle states only.

## Framework Setup

### Vanilla HTML

If you are testing with plain HTML and Live Server, install the package first:

```bash
npm install @quertys/axoloth-style
```

Then load the CSS file in your `<head>`:

```html
<link rel="stylesheet" href="./node_modules/@quertys/axoloth-style/src/axoloth.css" />
```

Use `class`, not `className`, in plain HTML:

```html
<div class="axo-bento">
  <div class="axo-card axo-wide axo-rise">Wide card</div>
  <div class="axo-card axo-tall axo-pop">Tall card</div>
</div>
```

### Vite, React, Vue, Svelte, Astro

Import the CSS once in your app entry file, such as `main.jsx`, `main.ts`, `main.js`, or `main.tsx`:

```js
import '@quertys/axoloth-style/axoloth.css';
```

React uses `className`:

```jsx
export function BentoPreview() {
  return (
    <div className="axo-bento">
      <div className="axo-card axo-wide axo-rise axo-lift">Wide card</div>
      <div className="axo-card axo-tall axo-pop axo-glow">Tall card</div>
    </div>
  );
}
```

Vue, Svelte, Astro, and normal HTML templates use `class`:

```html
<div class="axo-bento">
  <div class="axo-card axo-large axo-rise axo-shimmer">Large card</div>
</div>
```

### Angular

Install the package:

```bash
npm install @quertys/axoloth-style
```

Import it in `src/styles.css`:

```css
@import '@quertys/axoloth-style/axoloth.css';
```

Or register the file in `angular.json`:

```json
{
  "styles": ["src/styles.css", "node_modules/@quertys/axoloth-style/src/axoloth.css"]
}
```

Then use the classes in your component templates:

```html
<section class="axo-bento">
  <article class="axo-card axo-wide axo-rise axo-lift">Angular bento card</article>
</section>
```

### CDN

For quick prototypes, you can load the published CSS from a CDN:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@quertys/axoloth-style@0.6.0/src/axoloth.css"
/>
```

Pinning the version is recommended so your page does not change unexpectedly.

## Layout Utilities

Layout utilities are structural helpers for common app sections. They do not ship icons or a full visual design. Bring your own icons from Lucide, Heroicons, Google Material Symbols, inline SVG, or plain HTML.

### Layout Primitives

Primitives adapt to the space where they are placed, so reusable sections need fewer viewport breakpoints:

- `axo-container-query`: named inline-size query wrapper for adaptive child layouts.
- `axo-auto-grid`: auto-fitting grid controlled by `--axo-item-min`.
- `axo-switcher`: row layout when space is available, stacked layout when it is not.
- `axo-center`: centered content region with configurable width and gutter.
- `axo-cover`: full-height section that vertically centers its content group.
- `axo-reel`: horizontal scrolling row with stable item widths and snap behavior.
- `axo-scroll-snap`: reusable inline snap behavior for custom overflow containers.
- `axo-snap-start`: start alignment for children of a snap container.

Auto grid example:

```html
<section class="axo-auto-grid" style="--axo-item-min: 15rem">
  <article class="axo-card axo-surface">One</article>
  <article class="axo-card axo-surface">Two</article>
  <article class="axo-card axo-surface">Three</article>
</section>
```

Switcher and reel example:

```html
<section class="axo-switcher">
  <article class="axo-card axo-surface">Primary</article>
  <aside class="axo-card axo-surface">Secondary</aside>
</section>

<section class="axo-reel" aria-label="Featured items" tabindex="0">
  <article class="axo-card axo-surface">Item one</article>
  <article class="axo-card axo-surface">Item two</article>
  <article class="axo-card axo-surface">Item three</article>
</section>
```

### Header and Appbar

Use `axo-header` with `axo-header-grid` to create a four-slot app header:

```html
<header class="axo-header axo-header-grid axo-h-appbar axo-surface">
  <div class="axo-header-left">
    <a href="/">AX</a>
  </div>

  <div class="axo-header-center">
    <label class="axo-searchbar">
      <span aria-hidden="true">Search</span>
      <input aria-label="Search" placeholder="Search..." />
    </label>
  </div>

  <nav class="axo-header-nav">
    <a href="#home">Home</a>
    <a href="#work">Work</a>
    <a href="#about">About</a>
  </nav>

  <div class="axo-header-right">
    <button class="axo-icon-button" type="button" aria-label="Open menu">Menu</button>
  </div>
</header>
```

Header classes:

- `axo-header`: base appbar container.
- `axo-header-grid`: grid layout with `left`, `center`, `nav`, and `right` slots.
- `axo-header-flex`: simple flex header alternative.
- `axo-header-left`: left slot, usually logo or brand icon.
- `axo-header-center`: center slot, usually search or primary control.
- `axo-header-nav`: navigation slot; hidden on mobile by default.
- `axo-header-right`: right slot, usually actions or menu button.
- `axo-h-appbar`: appbar height preset.
- `axo-sticky-top`: sticky top helper.

Small structural helpers:

- `axo-searchbar`: inline search layout for icon/text plus input.
- `axo-icon-button`: square icon button sizing and alignment.
- `axo-hide-mobile`: hide an element below `768px`.
- `axo-show-mobile`: show an element below `768px`.

React example with your own icon components:

```jsx
import { Menu, Search } from 'lucide-react';
import '@quertys/axoloth-style/axoloth.css';

export function AppHeader() {
  return (
    <header className="axo-header axo-header-grid axo-h-appbar axo-surface">
      <div className="axo-header-left">AX</div>

      <div className="axo-header-center">
        <label className="axo-searchbar">
          <Search size={18} aria-hidden="true" />
          <input aria-label="Search" placeholder="Search..." />
        </label>
      </div>

      <nav className="axo-header-nav">
        <a href="#home">Home</a>
        <a href="#work">Work</a>
      </nav>

      <div className="axo-header-right">
        <button className="axo-icon-button" type="button" aria-label="Open menu">
          <Menu size={20} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
```

### Sidebar and App Shell

Use `axo-shell` with `axo-sidebar` and `axo-sidebar-main` for a CSS-only app layout:

```html
<div class="axo-shell axo-theme-dark">
  <aside class="axo-sidebar axo-sidebar-left axo-surface">
    <a class="axo-sidebar-item" href="#dashboard">Dashboard</a>
    <a class="axo-sidebar-item" href="#cards">Cards</a>
    <a class="axo-sidebar-item" href="#settings">Settings</a>
  </aside>

  <main class="axo-sidebar-main">
    <section class="axo-card axo-surface">Main content</section>
  </main>
</div>
```

Sidebar classes:

- `axo-shell`: flexible app shell wrapper.
- `axo-sidebar`: base sidebar container.
- `axo-sidebar-left`: places the sidebar before the main content.
- `axo-sidebar-right`: places the sidebar after the main content.
- `axo-sidebar-rail`: compact sidebar width.
- `axo-sidebar-hover`: expands a rail sidebar on hover or focus within.
- `axo-sidebar-item`: aligned sidebar menu item for links or buttons.
- `axo-sidebar-main`: main content area.
- `axo-sidebar-sticky`: sticky sidebar helper.
- `axo-sidebar-fixed`: fixed viewport sidebar.
- `axo-sidebar-fixed-left`: pin a fixed sidebar to the left edge.
- `axo-sidebar-fixed-right`: pin a fixed sidebar to the right edge.
- `axo-sidebar-main-offset-left`: offset main content for a fixed left sidebar.
- `axo-sidebar-main-offset-right`: offset main content for a fixed right sidebar.
- `axo-sidebar-main-offset-rail-left`: offset main content for a fixed left rail sidebar.
- `axo-sidebar-main-offset-rail-right`: offset main content for a fixed right rail sidebar.
- `axo-sidebar-offcanvas`: fixed viewport drawer hidden beyond the left edge.
- `axo-sidebar-offcanvas-right`: moves the drawer to the right edge.
- `axo-sidebar-backdrop`: fixed dismiss layer behind an open drawer.

### Optional Off-Canvas Behavior

Axoloth Style provides the CSS foundation. Install the zero-dependency behavior package when you also need state, Escape handling, focus trapping, focus return, and body scroll locking:

```bash
npm install @quertys/axoloth-style @quertys/axoloth-behavior
```

```js
import '@quertys/axoloth-style/axoloth.css';
import { initOffcanvas } from '@quertys/axoloth-behavior/offcanvas';

const offcanvas = initOffcanvas();
```

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
  <a class="axo-sidebar-item axo-link" href="#dashboard">Dashboard</a>
  <a class="axo-sidebar-item axo-link" href="#settings">Settings</a>
</aside>

<div class="axo-sidebar-backdrop" data-axo-dismiss="main-sidebar" aria-hidden="true"></div>
```

The behavior package never auto-runs. Framework apps can call `destroy()` from their cleanup lifecycle, while plain HTML can initialize it once after the markup is available.

### Dialog and Modal

Combine the CSS dialog foundation with the optional behavior package when a workflow needs focus trapping, Escape dismissal, focus return, ARIA synchronization, and scroll locking:

```js
import '@quertys/axoloth-style/axoloth.css';
import { initDialog } from '@quertys/axoloth-behavior/dialog';

const dialog = initDialog();
```

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
    <div class="axo-dialog-body">Dialog content</div>
    <footer class="axo-dialog-footer">
      <button class="axo-button" type="button" data-axo-dialog-dismiss="confirm-dialog">
        Cancel
      </button>
      <button class="axo-button" type="button">Confirm</button>
    </footer>
  </section>
</div>
```

Use `axo-dialog-sm`, `axo-dialog-lg`, or `axo-dialog-full` on `axo-dialog-panel` to change its preferred width. Axoloth Behavior automatically adds `role="dialog"` and `aria-modal="true"` when those attributes are not already present.

### Tabs

Use `axo-tabs`, `axo-tab-list`, `axo-tab`, and `axo-tab-panel` for tabbed content. The optional behavior package creates the ARIA relationships and keyboard navigation:

```html
<div id="account-tabs" class="axo-tabs" data-axo-tabs>
  <div class="axo-tab-list" aria-label="Account sections">
    <button class="axo-tab" type="button" data-axo-tab="profile" aria-selected="true">
      Profile
    </button>
    <button class="axo-tab" type="button" data-axo-tab="security">Security</button>
  </div>

  <section class="axo-tab-panel axo-card axo-surface" data-axo-tab-panel="profile">
    Profile content
  </section>
  <section class="axo-tab-panel axo-card axo-surface" data-axo-tab-panel="security">
    Security content
  </section>
</div>
```

```js
import { initTabs } from '@quertys/axoloth-behavior/tabs';

const tabs = initTabs();
```

Add `axo-tabs-vertical` to place the tab list beside the panel on wide screens. It returns to a horizontal scrolling list on small screens.

### Accordion

Use a native button for every `axo-accordion-trigger`. Axoloth Behavior manages expanded state, panels, single or multiple mode, and keyboard focus:

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
      Install both packages through npm.
    </div>
  </section>
</div>
```

```js
import { initAccordion } from '@quertys/axoloth-behavior/accordion';

const accordion = initAccordion();
```

### Dropdown

Dropdown markup stays declarative while the optional behavior package handles focus, keyboard navigation, outside clicks, and ARIA state:

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

```js
import { initDropdown } from '@quertys/axoloth-behavior/dropdown';

const dropdown = initDropdown();
```

Use `axo-dropdown-end` to align the menu to the inline end edge or `axo-dropdown-up` to place it above the trigger.

### Toast

Toast regions provide fixed, responsive notification positioning. Axoloth Behavior creates safe text nodes, manages timers, pauses while users interact, and removes dismissed notifications:

```html
<div
  id="notifications"
  class="axo-toast-region axo-toast-region-top-end"
  data-axo-toast-region
  aria-label="Notifications"
></div>
```

```js
import { initToast } from '@quertys/axoloth-behavior/toast';

const toast = initToast();

toast.show({
  region: 'notifications',
  title: 'Layout saved',
  message: 'Your dashboard arrangement is ready.',
  duration: 5000,
});
```

Available region positions are `axo-toast-region-top-start`, `axo-toast-region-top-end`, `axo-toast-region-bottom-start`, and `axo-toast-region-bottom-end`.

Hover-expand rail example:

```html
<div class="axo-shell axo-theme-dark">
  <aside class="axo-sidebar axo-sidebar-left axo-sidebar-rail axo-sidebar-hover axo-surface">
    <a class="axo-sidebar-item" href="#dashboard">Dashboard</a>
    <a class="axo-sidebar-item" href="#cards">Cards</a>
    <a class="axo-sidebar-item" href="#settings">Settings</a>
  </aside>

  <main class="axo-sidebar-main">Content</main>
</div>
```

Fixed sidebar example:

```html
<aside
  class="axo-sidebar axo-sidebar-fixed axo-sidebar-fixed-left axo-sidebar-rail axo-sidebar-hover axo-surface"
>
  <a class="axo-sidebar-item" href="#dashboard">Dashboard</a>
  <a class="axo-sidebar-item" href="#cards">Cards</a>
  <a class="axo-sidebar-item" href="#settings">Settings</a>
</aside>

<main class="axo-sidebar-main axo-sidebar-main-offset-rail-left">
  <section class="axo-card axo-surface">Main content</section>
</main>
```

Use `axo-app` when you want a larger grid app shell with sidebar, header, main, and footer areas:

```html
<div class="axo-app axo-theme-dark">
  <aside class="axo-app-sidebar axo-sidebar axo-surface">
    <a class="axo-sidebar-item" href="#dashboard">Dashboard</a>
    <a class="axo-sidebar-item" href="#cards">Cards</a>
  </aside>

  <header class="axo-app-header axo-header axo-header-grid axo-surface">Header</header>
  <main class="axo-app-main">Main content</main>
  <footer class="axo-app-footer axo-surface">Footer</footer>
</div>
```

App shell classes:

- `axo-app`: grid wrapper for sidebar, header, main, and footer.
- `axo-app-sidebar`: sidebar area inside `axo-app`.
- `axo-app-sidebar-right`: moves the app sidebar area to the right.
- `axo-app-header`: header area inside `axo-app`.
- `axo-app-main`: main content area inside `axo-app`.
- `axo-app-footer`: footer area inside `axo-app`.

React example:

```jsx
import '@quertys/axoloth-style/axoloth.css';

export function SidebarShell() {
  return (
    <div className="axo-shell axo-theme-dark">
      <aside className="axo-sidebar axo-sidebar-left axo-sidebar-rail axo-sidebar-hover axo-surface">
        <a className="axo-sidebar-item" href="#dashboard">
          Dashboard
        </a>
        <a className="axo-sidebar-item" href="#cards">
          Cards
        </a>
        <a className="axo-sidebar-item" href="#settings">
          Settings
        </a>
      </aside>

      <main className="axo-sidebar-main">
        <section className="axo-card axo-surface">Main content</section>
      </main>
    </div>
  );
}
```

## Bento Utilities

`axo-bento` creates a responsive grid:

- Mobile: 1 column.
- Tablet: 2 columns.
- Desktop: 4 columns.

The default mode responds to viewport width for backwards compatibility. For a Bento inside a dashboard panel, modal, or embedded widget, use the container-aware mode:

```html
<div class="axo-container-query">
  <section class="axo-bento axo-container-responsive">
    <article class="axo-card axo-surface axo-wide">Wide when its container allows it</article>
    <article class="axo-card axo-surface axo-square">Square</article>
  </section>
</div>
```

`axo-container-query` must be on a separate parent because CSS container queries read an ancestor container, not the element itself. The adaptive Bento uses one column below `40rem`, two columns from `40rem`, and four columns from `64rem`, based on wrapper width.

Grid and card classes:

- `axo-bento`: responsive bento grid container.
- `axo-container-responsive`: opt-in modifier that responds to an `axo-container-query` parent.
- `axo-card`: neutral card structure with radius, border, padding, and transitions.
- `axo-square`: normal 1 by 1 card.
- `axo-wide`: spans 2 columns on tablet and desktop.
- `axo-tall`: spans 2 rows on tablet and desktop.
- `axo-large`: spans 2 columns and 2 rows on tablet and desktop.
- `axo-stack`: vertical flex stack for card content.
- `axo-row`: horizontal flex row for compact content.

Example:

```html
<div class="axo-bento">
  <article class="axo-card axo-wide">Wide content</article>

  <article class="axo-card axo-tall">Tall content</article>

  <article class="axo-card axo-large">Large content</article>
</div>
```

## Motion Utilities

Entrance animations:

- `axo-fade`: fades the element in.
- `axo-rise`: fades and moves the element upward into place.
- `axo-pop`: fades and scales the element into place.

Hover and ambient effects:

- `axo-lift`: moves the element upward on hover.
- `axo-glow`: adds a soft hover shadow.
- `axo-shimmer`: adds a looping shimmer overlay.

Example:

```html
<button class="axo-card axo-rise axo-lift axo-glow">Animated action</button>
```

Axoloth Style respects `prefers-reduced-motion: reduce` by disabling the built-in animations for users who prefer less motion.

## Semantic Utilities

Semantic utilities make plain HTML controls and structure look usable without custom CSS. They stay neutral and inherit color from the current surface or your own styles.

Page and layout helpers:

- `axo-page`: top-level page wrapper with padding and viewport height.
- `axo-container`: centered content container.
- `axo-section`: vertical section spacing.
- `axo-cluster`: wrapping inline group for nav items, tags, and actions.
- `axo-list-reset`: removes default list markers, margin, and padding.

Navigation and links:

- `axo-nav`: structural nav container.
- `axo-nav-list`: semantic list reset plus row/wrap layout.
- `axo-link`: neutral link with inherited color and focus-visible ring.

Controls and forms:

- `axo-button`: neutral button or action link structure.
- `axo-button-block`: full-width button.
- `axo-form`: vertical form layout.
- `axo-form-grid`: responsive form grid.
- `axo-field`: field wrapper.
- `axo-label`: label text helper.
- `axo-input`: input, select, or textarea structure.
- `axo-help`: muted field instructions.
- `axo-error`: validation error message.
- `axo-required`: visual required marker; still use the native `required` attribute.
- `axo-invalid`: invalid input border and ring; pair it with `aria-invalid="true"`.
- `axo-checkbox`: layout for a native checkbox and label text.
- `axo-radio`: layout for a native radio and label text.
- `axo-switch`: switch treatment for a native checkbox.

Status and data helpers:

- `axo-badge` and `axo-badge-dot`: compact metadata or status labels.
- `axo-alert` and `axo-alert-title`: neutral notices that inherit project colors.
- `axo-empty` / `axo-empty-state`: centered empty-state composition.
- `axo-table-wrap`: horizontal overflow safety for data tables.
- `axo-table`: structural table styling.
- `axo-table-compact`: compact table density.
- `axo-table-sticky`: sticky table header cells.
- `axo-progress` and `axo-progress-bar`: determinate progress layout.
- `axo-progress-indeterminate`: progress state for unknown completion.
- `axo-skeleton`: reduced-motion-safe loading placeholder.
- `axo-skeleton-text` and `axo-skeleton-circle`: common skeleton shapes.
- `axo-divider`: neutral section divider.

Accessibility helpers:

- `axo-visually-hidden`: keeps text available to assistive technology while hiding it visually.
- `axo-skip-link`: keyboard skip link that becomes visible on focus.

Example:

```html
<main class="axo-page axo-theme-light">
  <section class="axo-container axo-section">
    <nav class="axo-nav" aria-label="Primary">
      <ul class="axo-nav-list">
        <li><a class="axo-link" href="#intro">Intro</a></li>
        <li><a class="axo-link" href="#cards">Cards</a></li>
      </ul>
    </nav>

    <form class="axo-form axo-card axo-surface">
      <label class="axo-field">
        <span class="axo-label">Name</span>
        <input class="axo-input" name="name" />
      </label>

      <button class="axo-button" type="submit">Send</button>
    </form>
  </section>
</main>
```

Data UI example:

```html
<div class="axo-alert axo-surface" role="status">
  <strong class="axo-alert-title">Sync complete</strong>
  <p>All layout examples are ready.</p>
</div>

<div class="axo-table-wrap axo-surface">
  <table class="axo-table axo-table-sticky">
    <thead>
      <tr>
        <th scope="col">Example</th>
        <th scope="col">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Dashboard</td>
        <td>
          <span class="axo-badge"><span class="axo-badge-dot"></span>Ready</span>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

Validation and native choice controls:

```html
<label class="axo-field">
  <span class="axo-label axo-required">Email</span>
  <input
    class="axo-input axo-invalid"
    type="email"
    aria-invalid="true"
    aria-describedby="email-error"
    required
  />
  <small class="axo-error" id="email-error">Enter a valid email address.</small>
</label>

<label class="axo-checkbox">
  <input type="checkbox" />
  <span>Send layout updates</span>
</label>

<label class="axo-switch">
  <input type="checkbox" checked />
  <span>Enable compact mode</span>
</label>
```

Progress and loading states:

```html
<div
  class="axo-progress"
  role="progressbar"
  aria-label="Upload progress"
  aria-valuemin="0"
  aria-valuemax="100"
  aria-valuenow="72"
  style="--axo-progress-value: 72%"
>
  <span class="axo-progress-bar"></span>
</div>

<div class="axo-stack" aria-hidden="true">
  <span class="axo-skeleton axo-skeleton-circle"></span>
  <span class="axo-skeleton axo-skeleton-text"></span>
</div>
```

Keyboard skip-link pattern:

```html
<a class="axo-skip-link" href="#main-content">Skip to main content</a>
<main id="main-content" tabindex="-1">...</main>
```

## Surface Utilities

Surface utilities are small optional color helpers for cards. They make test layouts visible faster without turning Axoloth Style into a full theme framework.

Theme markers:

- `axo-theme-light`: tells Axoloth Style that the parent area is light.
- `axo-theme-dark`: tells Axoloth Style that the parent area is dark.

Surface classes:

- `axo-surface`: normal surface for the current theme.
- `axo-contrast`: inverted surface for the current theme.

Dark theme example:

```html
<section class="axo-theme-dark axo-bento">
  <article class="axo-card axo-surface">Soft dark card with light text</article>

  <article class="axo-card axo-contrast">White contrast card with dark text</article>
</section>
```

Light theme example:

```html
<section class="axo-theme-light axo-bento">
  <article class="axo-card axo-surface">Soft light card with dark text</article>

  <article class="axo-card axo-contrast">Dark contrast card with light text</article>
</section>
```

Pure CSS cannot reliably read any random parent background color and automatically invert from it. The stable approach is to put `axo-theme-dark` or `axo-theme-light` on the parent, then use `axo-surface` or `axo-contrast` on the card.

## Customizing With CSS Variables

You can customize Axoloth Style from any parent wrapper:

```css
.dashboard-grid {
  --axo-gap: 1rem;
  --axo-row-min: 180px;
  --axo-radius: 0.75rem;
  --axo-card-padding: 1rem;
  --axo-header-height: 4rem;
  --axo-header-gap: 0.75rem;
  --axo-header-center-width: 28rem;
  --axo-searchbar-width: 28rem;
  --axo-searchbar-height: 2.5rem;
  --axo-icon-button-size: 2.5rem;
  --axo-sidebar-width: 16rem;
  --axo-sidebar-rail-width: 4.5rem;
  --axo-sidebar-gap: 0.75rem;
  --axo-sidebar-padding: 1rem;
  --axo-sidebar-transition: 220ms ease;
  --axo-sidebar-z: 20;
  --axo-sidebar-fixed-top: 0;
  --axo-sidebar-fixed-bottom: 0;
  --axo-offcanvas-width: 18rem;
  --axo-offcanvas-max-width: calc(100vw - 2rem);
  --axo-offcanvas-inset-top: 0;
  --axo-offcanvas-inset-bottom: 0;
  --axo-offcanvas-duration: 220ms;
  --axo-offcanvas-easing: ease;
  --axo-offcanvas-z: 50;
  --axo-offcanvas-backdrop: rgb(2 6 23 / 0.55);
  --axo-dialog-inset: 1rem;
  --axo-dialog-width: 32rem;
  --axo-dialog-padding: 1.25rem;
  --axo-dialog-gap: 1rem;
  --axo-dialog-radius: 0.5rem;
  --axo-dialog-border: 1px solid currentColor;
  --axo-dialog-backdrop: rgb(2 6 23 / 0.58);
  --axo-dialog-duration: 180ms;
  --axo-dialog-easing: ease-out;
  --axo-dialog-enter-distance: 0.75rem;
  --axo-dialog-enter-scale: 0.98;
  --axo-dialog-z: 60;
  --axo-tabs-gap: 1rem;
  --axo-tab-list-gap: 0.25rem;
  --axo-tab-min-height: 2.75rem;
  --axo-tab-padding-inline: 1rem;
  --axo-tab-indicator-size: 2px;
  --axo-tab-indicator-color: currentColor;
  --axo-tab-panel-padding: 0;
  --axo-tab-vertical-width: 14rem;
  --axo-accordion-gap: 0.75rem;
  --axo-accordion-border: 1px solid currentColor;
  --axo-accordion-radius: 0.5rem;
  --axo-accordion-trigger-min-height: 3rem;
  --axo-accordion-trigger-padding: 0.75rem 1rem;
  --axo-accordion-panel-padding: 0 1rem 1rem;
  --axo-accordion-transition: 180ms ease;
  --axo-dropdown-gap: 0.375rem;
  --axo-dropdown-min-width: 12rem;
  --axo-dropdown-max-height: 20rem;
  --axo-dropdown-padding: 0.375rem;
  --axo-dropdown-radius: 0.5rem;
  --axo-dropdown-border: 1px solid currentColor;
  --axo-dropdown-shadow: 0 18px 48px rgb(15 23 42 / 0.16);
  --axo-dropdown-z: 40;
  --axo-dropdown-duration: 160ms;
  --axo-dropdown-item-min-height: 2.5rem;
  --axo-dropdown-item-padding: 0.5rem 0.75rem;
  --axo-toast-region-gap: 0.75rem;
  --axo-toast-region-inset: 1rem;
  --axo-toast-width: 24rem;
  --axo-toast-padding: 1rem;
  --axo-toast-gap: 0.75rem;
  --axo-toast-radius: 0.5rem;
  --axo-toast-border: 1px solid currentColor;
  --axo-toast-shadow: 0 18px 48px rgb(15 23 42 / 0.16);
  --axo-toast-z: 80;
  --axo-toast-duration: 180ms;
  --axo-toast-distance: 0.75rem;
  --axo-app-gap: 0;
  --axo-app-header-height: 4rem;
  --axo-app-footer-height: auto;
  --axo-app-padding: 1rem;
  --axo-grid-gap: 1rem;
  --axo-item-min: 16rem;
  --axo-switcher-gap: 1rem;
  --axo-switcher-threshold: 40rem;
  --axo-center-width: 40rem;
  --axo-center-gutter: 0;
  --axo-cover-height: 100dvh;
  --axo-cover-padding: 1rem;
  --axo-reel-gap: 1rem;
  --axo-reel-padding: 0;
  --axo-reel-item-width: 18rem;
  --axo-page-padding: 1rem;
  --axo-container-width: 72rem;
  --axo-section-gap: 2rem;
  --axo-control-height: 2.5rem;
  --axo-control-padding-inline: 1rem;
  --axo-control-gap: 0.75rem;
  --axo-focus-ring: 2px solid currentColor;
  --axo-error-color: rgb(180 35 24);
  --axo-state-gap: 0.625rem;
  --axo-control-accent: currentColor;
  --axo-check-size: 1.125rem;
  --axo-switch-width: 2.75rem;
  --axo-switch-height: 1.5rem;
  --axo-switch-padding: 0.125rem;
  --axo-switch-thumb-size: 1rem;
  --axo-switch-duration: 220ms;
  --axo-progress-size: 0.625rem;
  --axo-progress-radius: 999px;
  --axo-progress-value: 72%;
  --axo-progress-duration: 480ms;
  --axo-progress-indeterminate-duration: 1.2s;
  --axo-skeleton-height: 1rem;
  --axo-skeleton-radius: 0.5rem;
  --axo-skeleton-duration: 1.4s;
  --axo-divider-size: 1px;
  --axo-divider-gap: 1rem;
  --axo-divider-opacity: 0.16;
  --axo-duration: 520ms;
  --axo-delay: 80ms;
  --axo-rise-distance: 18px;
  --axo-pop-start: 0.92;
  --axo-lift-distance: -4px;
  --axo-glow-shadow: 0 18px 48px rgb(34 211 238 / 0.16);
  --axo-shimmer-duration: 1.6s;
  --axo-shimmer-color: rgb(255 255 255 / 0.16);
  --axo-surface-bg: rgb(15 23 42 / 0.72);
  --axo-surface-color: rgb(248 250 252);
  --axo-surface-border: rgb(255 255 255 / 0.12);
  --axo-contrast-bg: rgb(248 250 252);
  --axo-contrast-color: rgb(15 23 42);
  --axo-contrast-border: rgb(255 255 255 / 0.72);
}
```

Then apply your wrapper:

```html
<div class="dashboard-grid axo-bento">
  <div class="axo-card axo-wide axo-rise">Custom grid</div>
</div>
```

## Styling With Your Own Theme

Because `axo-card` is intentionally structural, you can combine it with `axo-surface`, `axo-contrast`, or your own CSS:

```css
.my-surface {
  background: rgb(15 23 42);
  border-color: rgb(148 163 184 / 0.18);
  color: white;
}
```

```html
<div class="axo-card axo-surface axo-wide axo-rise my-surface">Themed by your app</div>
```

Or combine it with Tailwind, Bootstrap, UnoCSS, plain CSS modules, Sass, or any existing design system.

## Generated Utility Reference

<!-- AXOLOTH-REGISTRY:START -->

_Generated from `metadata/registry.json`. Run `npm run generate` after changing the registry._

Registry 0.6.0: **161 classes**, **168 CSS variables**, and **10 modules**.

### Class Registry

| Class                                | Module    | Category      | Status | Description                                                                                        |
| ------------------------------------ | --------- | ------------- | ------ | -------------------------------------------------------------------------------------------------- |
| `axo-bento`                          | bento     | layout        | Active | Responsive bento grid container with mobile, tablet, and desktop columns.                          |
| `axo-container-responsive`           | bento     | responsive    | Active | Makes axo-bento respond to an axo-container-query parent instead of the viewport.                  |
| `axo-card`                           | bento     | layout        | Active | Neutral structural card base with radius, border, padding, and transitions.                        |
| `axo-square`                         | bento     | layout        | Active | One-by-one bento item span.                                                                        |
| `axo-wide`                           | bento     | layout        | Active | Bento item that spans two columns on tablet and desktop.                                           |
| `axo-tall`                           | bento     | layout        | Active | Bento item that spans two rows on tablet and desktop.                                              |
| `axo-large`                          | bento     | layout        | Active | Bento item that spans two columns and two rows on tablet and desktop.                              |
| `axo-stack`                          | bento     | layout        | Active | Vertical flex stack for card content.                                                              |
| `axo-row`                            | bento     | layout        | Active | Horizontal flex row for compact inline content.                                                    |
| `axo-header`                         | layout    | layout        | Active | Base appbar/header container.                                                                      |
| `axo-header-grid`                    | layout    | layout        | Active | Four-slot header grid for left, center, nav, and right areas.                                      |
| `axo-header-flex`                    | layout    | layout        | Active | Simple flex header alternative.                                                                    |
| `axo-header-left`                    | layout    | layout        | Active | Left header slot, usually for logo or brand icon.                                                  |
| `axo-header-center`                  | layout    | layout        | Active | Center header slot, usually for search or primary controls.                                        |
| `axo-header-nav`                     | layout    | layout        | Active | Header navigation slot that hides on mobile by default.                                            |
| `axo-header-right`                   | layout    | layout        | Active | Right header slot, usually for actions or a menu button.                                           |
| `axo-searchbar`                      | layout    | layout        | Active | Inline search layout for icon/text plus input.                                                     |
| `axo-icon-button`                    | layout    | layout        | Active | Square icon button sizing and alignment.                                                           |
| `axo-h-appbar`                       | layout    | layout        | Active | Appbar height preset.                                                                              |
| `axo-sticky-top`                     | layout    | layout        | Active | Sticky top positioning helper.                                                                     |
| `axo-hide-mobile`                    | layout    | layout        | Active | Hide an element below 768px.                                                                       |
| `axo-show-mobile`                    | layout    | layout        | Active | Show an element below 768px.                                                                       |
| `axo-shell`                          | layout    | layout        | Active | Flexible app shell wrapper for sidebar and main content layouts.                                   |
| `axo-sidebar`                        | layout    | layout        | Active | Base sidebar container with column layout, width, padding, overflow, and transitions.              |
| `axo-sidebar-left`                   | layout    | layout        | Active | Places a sidebar before the main content inside axo-shell.                                         |
| `axo-sidebar-right`                  | layout    | layout        | Active | Places a sidebar after the main content inside axo-shell.                                          |
| `axo-sidebar-rail`                   | layout    | layout        | Active | Uses the compact rail width for a sidebar.                                                         |
| `axo-sidebar-hover`                  | layout    | layout        | Active | Expands a rail sidebar on hover or keyboard focus within.                                          |
| `axo-sidebar-item`                   | layout    | layout        | Active | Aligned sidebar menu item for links, buttons, and compact actions.                                 |
| `axo-sidebar-main`                   | layout    | layout        | Active | Main content region that fills the remaining space in axo-shell.                                   |
| `axo-sidebar-sticky`                 | layout    | layout        | Active | Makes a sidebar stick within the viewport while the main content scrolls.                          |
| `axo-sidebar-fixed`                  | layout    | layout        | Active | Fixes a sidebar to the viewport instead of the normal document flow.                               |
| `axo-sidebar-fixed-left`             | layout    | layout        | Active | Pins a fixed sidebar to the left edge of the viewport.                                             |
| `axo-sidebar-fixed-right`            | layout    | layout        | Active | Pins a fixed sidebar to the right edge of the viewport.                                            |
| `axo-sidebar-offcanvas`              | layout    | behavior      | Active | Viewport drawer foundation hidden beyond the left edge until opened.                               |
| `axo-sidebar-offcanvas-right`        | layout    | behavior      | Active | Moves an off-canvas sidebar to the right viewport edge.                                            |
| `axo-sidebar-open`                   | layout    | state         | Active | Open state applied to an off-canvas sidebar by Axoloth Behavior.                                   |
| `axo-sidebar-backdrop`               | layout    | behavior      | Active | Fixed dismiss layer behind an off-canvas sidebar.                                                  |
| `axo-sidebar-backdrop-open`          | layout    | state         | Active | Visible backdrop state applied by Axoloth Behavior.                                                |
| `axo-offcanvas-active`               | layout    | state         | Active | Body state that locks document scrolling while a drawer is open.                                   |
| `axo-dialog`                         | dialog    | behavior      | Active | Fixed viewport layer that centers an accessible dialog panel.                                      |
| `axo-dialog-open`                    | dialog    | state         | Active | Visible dialog state applied by Axoloth Behavior.                                                  |
| `axo-dialog-backdrop`                | dialog    | behavior      | Active | Full viewport dismiss layer behind a dialog panel.                                                 |
| `axo-dialog-backdrop-open`           | dialog    | state         | Active | Visible dialog backdrop state applied by Axoloth Behavior.                                         |
| `axo-dialog-panel`                   | dialog    | layout        | Active | Scrollable, width-constrained content panel inside axo-dialog.                                     |
| `axo-dialog-header`                  | dialog    | layout        | Active | Dialog heading row with space for a title and close action.                                        |
| `axo-dialog-body`                    | dialog    | layout        | Active | Main content region inside a dialog panel.                                                         |
| `axo-dialog-footer`                  | dialog    | layout        | Active | Wrapping action row aligned to the end of a dialog panel.                                          |
| `axo-dialog-sm`                      | dialog    | sizing        | Active | Sets a compact dialog panel width.                                                                 |
| `axo-dialog-lg`                      | dialog    | sizing        | Active | Sets a wide dialog panel width.                                                                    |
| `axo-dialog-full`                    | dialog    | sizing        | Active | Expands a dialog panel to the available viewport width.                                            |
| `axo-dialog-active`                  | dialog    | state         | Active | Body state that locks document scrolling while a dialog is open.                                   |
| `axo-tabs`                           | tabs      | behavior      | Active | Layout boundary for an accessible tabbed interface.                                                |
| `axo-tabs-vertical`                  | tabs      | layout        | Active | Places the tab list beside its active panel on wide containers.                                    |
| `axo-tab-list`                       | tabs      | layout        | Active | Scrollable row or column containing Axoloth tab controls.                                          |
| `axo-tab`                            | tabs      | control       | Active | Neutral tab control with selected and focus-visible states.                                        |
| `axo-tab-active`                     | tabs      | state         | Active | Selected tab state managed by Axoloth Behavior.                                                    |
| `axo-tab-panel`                      | tabs      | layout        | Active | Content region controlled by an Axoloth tab.                                                       |
| `axo-tab-panel-active`               | tabs      | state         | Active | Visible tab panel state managed by Axoloth Behavior.                                               |
| `axo-accordion`                      | accordion | behavior      | Active | Layout boundary for an accessible accordion group.                                                 |
| `axo-accordion-item`                 | accordion | layout        | Active | Structural wrapper for one accordion trigger and panel.                                            |
| `axo-accordion-item-open`            | accordion | state         | Active | Expanded accordion item state managed by Axoloth Behavior.                                         |
| `axo-accordion-trigger`              | accordion | control       | Active | Full-width disclosure button for an accordion item.                                                |
| `axo-accordion-indicator`            | accordion | control       | Active | Fixed-size indicator that rotates while an item is expanded.                                       |
| `axo-accordion-panel`                | accordion | layout        | Active | Collapsible content region controlled by an accordion trigger.                                     |
| `axo-accordion-panel-open`           | accordion | state         | Active | Visible accordion panel state managed by Axoloth Behavior.                                         |
| `axo-dropdown`                       | dropdown  | behavior      | Active | Positioning boundary for an accessible dropdown menu.                                              |
| `axo-dropdown-open`                  | dropdown  | state         | Active | Open dropdown group state managed by Axoloth Behavior.                                             |
| `axo-dropdown-trigger`               | dropdown  | control       | Active | Inline trigger alignment for a dropdown menu button.                                               |
| `axo-dropdown-menu`                  | dropdown  | layout        | Active | Absolutely positioned menu surface below a dropdown trigger.                                       |
| `axo-dropdown-menu-open`             | dropdown  | state         | Active | Visible menu state managed by Axoloth Behavior.                                                    |
| `axo-dropdown-item`                  | dropdown  | control       | Active | Full-width action or link inside a dropdown menu.                                                  |
| `axo-dropdown-label`                 | dropdown  | layout        | Active | Non-interactive group label inside a dropdown menu.                                                |
| `axo-dropdown-separator`             | dropdown  | layout        | Active | Subtle separator between groups of dropdown actions.                                               |
| `axo-dropdown-end`                   | dropdown  | position      | Active | Aligns a dropdown menu to the trigger's inline end edge.                                           |
| `axo-dropdown-up`                    | dropdown  | position      | Active | Places a dropdown menu above its trigger.                                                          |
| `axo-toast-region`                   | toast     | behavior      | Active | Fixed live region that stacks Axoloth toast notifications.                                         |
| `axo-toast-region-top-start`         | toast     | position      | Active | Positions a toast region at the viewport top-start corner.                                         |
| `axo-toast-region-top-end`           | toast     | position      | Active | Positions a toast region at the viewport top-end corner.                                           |
| `axo-toast-region-bottom-start`      | toast     | position      | Active | Positions a toast region at the viewport bottom-start corner.                                      |
| `axo-toast-region-bottom-end`        | toast     | position      | Active | Positions a toast region at the viewport bottom-end corner.                                        |
| `axo-toast`                          | toast     | behavior      | Active | Responsive notification layout inside a toast region.                                              |
| `axo-toast-open`                     | toast     | state         | Active | Visible toast state managed by Axoloth Behavior.                                                   |
| `axo-toast-closing`                  | toast     | state         | Active | Dismiss transition state managed by Axoloth Behavior.                                              |
| `axo-toast-content`                  | toast     | layout        | Active | Flexible text content column inside a toast.                                                       |
| `axo-toast-title`                    | toast     | content       | Active | Short emphasized toast heading.                                                                    |
| `axo-toast-message`                  | toast     | content       | Active | Wrapping notification message inside a toast.                                                      |
| `axo-toast-actions`                  | toast     | layout        | Active | Inline action group inside a toast.                                                                |
| `axo-toast-dismiss`                  | toast     | control       | Active | Compact toast dismissal control.                                                                   |
| `axo-sidebar-main-offset-left`       | layout    | layout        | Active | Offsets main content by the expanded left sidebar width.                                           |
| `axo-sidebar-main-offset-right`      | layout    | layout        | Active | Offsets main content by the expanded right sidebar width.                                          |
| `axo-sidebar-main-offset-rail-left`  | layout    | layout        | Active | Offsets main content by the compact left sidebar rail width.                                       |
| `axo-sidebar-main-offset-rail-right` | layout    | layout        | Active | Offsets main content by the compact right sidebar rail width.                                      |
| `axo-app`                            | layout    | layout        | Active | Grid app shell for sidebar, header, main, and footer regions.                                      |
| `axo-app-sidebar`                    | layout    | layout        | Active | Sidebar grid area inside axo-app.                                                                  |
| `axo-app-sidebar-right`              | layout    | layout        | Active | Moves the axo-app sidebar area to the right side.                                                  |
| `axo-app-header`                     | layout    | layout        | Active | Header grid area inside axo-app.                                                                   |
| `axo-app-main`                       | layout    | layout        | Active | Scrollable main content grid area inside axo-app.                                                  |
| `axo-app-footer`                     | layout    | layout        | Active | Footer grid area inside axo-app.                                                                   |
| `axo-container-query`                | layout    | responsive    | Active | Named inline-size query container for adaptive Axoloth child layouts.                              |
| `axo-auto-grid`                      | layout    | primitive     | Active | Auto-fitting grid that creates columns from available space without media queries.                 |
| `axo-switcher`                       | layout    | primitive     | Active | Container-aware flex layout that switches between rows and stacked items.                          |
| `axo-center`                         | layout    | primitive     | Active | Horizontally centered content region with a configurable maximum width and gutter.                 |
| `axo-cover`                          | layout    | primitive     | Active | Full-height flex section that vertically centers its content group.                                |
| `axo-reel`                           | layout    | primitive     | Active | Horizontal scrolling row with stable item widths and scroll snapping.                              |
| `axo-scroll-snap`                    | layout    | behavior      | Active | Adds mandatory inline scroll snapping to a custom overflow container.                              |
| `axo-snap-start`                     | layout    | behavior      | Active | Aligns an item to the start edge of a scroll-snap container.                                       |
| `axo-page`                           | semantic  | layout        | Active | Page wrapper with full-width sizing, minimum viewport height, and page padding.                    |
| `axo-container`                      | semantic  | layout        | Active | Centered content container with configurable max width.                                            |
| `axo-section`                        | semantic  | layout        | Active | Vertical section spacing helper.                                                                   |
| `axo-cluster`                        | semantic  | layout        | Active | Wrapping inline group for nav items, tags, and action rows.                                        |
| `axo-list-reset`                     | semantic  | layout        | Active | Removes list margin, padding, and markers from ul or ol elements.                                  |
| `axo-nav`                            | semantic  | layout        | Active | Structural navigation container.                                                                   |
| `axo-nav-list`                       | semantic  | layout        | Active | Reset and row layout for semantic nav lists.                                                       |
| `axo-link`                           | semantic  | surface       | Active | Neutral link reset with inherited color, hover transition, and focus-visible ring.                 |
| `axo-button`                         | semantic  | surface       | Active | Neutral button structure with sizing, border, alignment, hover, and focus-visible ring.            |
| `axo-button-block`                   | semantic  | layout        | Active | Makes an axo-button fill the available inline size.                                                |
| `axo-field`                          | semantic  | layout        | Active | Vertical form field wrapper.                                                                       |
| `axo-label`                          | semantic  | layout        | Active | Label text layout helper for forms.                                                                |
| `axo-input`                          | semantic  | surface       | Active | Neutral input, select, or textarea structure with border, padding, sizing, and focus-visible ring. |
| `axo-form`                           | semantic  | layout        | Active | Vertical form layout with consistent control gaps.                                                 |
| `axo-form-grid`                      | semantic  | layout        | Active | Responsive form grid: one column on mobile and two columns on wider screens.                       |
| `axo-badge`                          | semantic  | status        | Active | Compact inline status or metadata label with neutral structure.                                    |
| `axo-badge-dot`                      | semantic  | status        | Active | Current-color status dot sized for axo-badge.                                                      |
| `axo-alert`                          | semantic  | status        | Active | Neutral alert or notice container with structured spacing and border.                              |
| `axo-alert-title`                    | semantic  | status        | Active | Strong title treatment for an Axoloth alert.                                                       |
| `axo-empty`                          | semantic  | state         | Active | Centered empty-state layout for icon, title, description, and actions.                             |
| `axo-empty-state`                    | semantic  | state         | Active | Descriptive alias for the centered axo-empty layout.                                               |
| `axo-empty-icon`                     | semantic  | state         | Active | Centered circular icon slot for an empty state.                                                    |
| `axo-empty-title`                    | semantic  | state         | Active | Title typography for an empty state.                                                               |
| `axo-empty-description`              | semantic  | state         | Active | Readable muted description for an empty state.                                                     |
| `axo-table-wrap`                     | semantic  | data          | Active | Responsive table wrapper with horizontal overflow safety.                                          |
| `axo-table`                          | semantic  | data          | Active | Neutral full-width data table with consistent cell structure.                                      |
| `axo-table-compact`                  | semantic  | data          | Active | Compact cell-density preset for axo-table.                                                         |
| `axo-table-sticky`                   | semantic  | data          | Active | Keeps table header cells visible inside a scrolling table wrapper.                                 |
| `axo-visually-hidden`                | semantic  | accessibility | Active | Visually hides content while keeping it available to assistive technology.                         |
| `axo-skip-link`                      | semantic  | accessibility | Active | Keyboard skip link that becomes visible when focused.                                              |
| `axo-divider`                        | semantic  | layout        | Active | Neutral full-width divider with configurable thickness, spacing, and opacity.                      |
| `axo-progress`                       | semantic  | state         | Active | Accessible progress track wrapper for a child axo-progress-bar.                                    |
| `axo-progress-bar`                   | semantic  | state         | Active | Progress fill controlled by --axo-progress-value.                                                  |
| `axo-progress-indeterminate`         | semantic  | state         | Active | Looping indeterminate state for axo-progress with reduced-motion support.                          |
| `axo-skeleton`                       | semantic  | state         | Active | Neutral loading placeholder with a reduced-motion-safe pulse.                                      |
| `axo-skeleton-text`                  | semantic  | state         | Active | Text-line width preset for axo-skeleton.                                                           |
| `axo-skeleton-circle`                | semantic  | state         | Active | Circular avatar-style preset for axo-skeleton.                                                     |
| `axo-help`                           | semantic  | form          | Active | Muted helper text for a form field.                                                                |
| `axo-error`                          | semantic  | form          | Active | Readable validation error text with configurable error color.                                      |
| `axo-required`                       | semantic  | form          | Active | Adds a visual required marker after label text.                                                    |
| `axo-invalid`                        | semantic  | form          | Active | Validation border and ring for an invalid axo-input.                                               |
| `axo-checkbox`                       | semantic  | form          | Active | Aligned label layout for a native checkbox and its text.                                           |
| `axo-radio`                          | semantic  | form          | Active | Aligned label layout for a native radio and its text.                                              |
| `axo-switch`                         | semantic  | form          | Active | Accessible switch layout built from a native checkbox.                                             |
| `axo-fade`                           | motion    | motion        | Active | Fade-in entrance animation.                                                                        |
| `axo-rise`                           | motion    | motion        | Active | Fade and move upward into place.                                                                   |
| `axo-pop`                            | motion    | motion        | Active | Fade and scale into place.                                                                         |
| `axo-lift`                           | motion    | motion        | Active | Lift upward on hover.                                                                              |
| `axo-glow`                           | motion    | motion        | Active | Soft hover glow shadow.                                                                            |
| `axo-shimmer`                        | motion    | motion        | Active | Looping shimmer overlay.                                                                           |
| `axo-theme-light`                    | surface   | surface       | Active | Light theme marker for Axoloth surface variables.                                                  |
| `axo-theme-dark`                     | surface   | surface       | Active | Dark theme marker for Axoloth surface variables.                                                   |
| `axo-surface`                        | surface   | surface       | Active | Normal surface for the current theme marker.                                                       |
| `axo-contrast`                       | surface   | surface       | Active | Inverted contrast surface for the current theme marker.                                            |

<!-- AXOLOTH-REGISTRY:END -->

## Troubleshooting

### The classes do nothing in plain HTML

The CSS is probably not loaded. In plain HTML, installing the package is not enough. Add a `<link>` tag:

```html
<link rel="stylesheet" href="./node_modules/@quertys/axoloth-style/src/axoloth.css" />
```

### I used `className` in HTML and it did not work

Use `className` only in React JSX. Use `class` in HTML, Vue templates, Svelte templates, Angular templates, and Astro markup.

### The card looks too plain

Add `axo-surface` or `axo-contrast` for quick visible surfaces:

```html
<div class="axo-theme-dark">
  <div class="axo-card axo-surface">Visible dark surface</div>
</div>
```

If you need full brand styling, add your own background, text color, border color, or use your existing style framework.

### The package works in Vite but not in Live Server

Bundlers like Vite understand package imports:

```js
import '@quertys/axoloth-style/axoloth.css';
```

Live Server serves static files directly, so use the `node_modules` path in a `<link>` tag:

```html
<link rel="stylesheet" href="./node_modules/@quertys/axoloth-style/src/axoloth.css" />
```

### The animation does not replay after refresh or class changes

CSS entrance animations run when the element enters the page or when the animation class is re-applied. If you need manual replay in an app, toggle the animation class or remount the element from your framework.

## Browser Support

Axoloth Style uses standard CSS grid, flexbox, transitions, custom properties, and keyframe animations. It is designed for modern browsers.

## License

MIT
