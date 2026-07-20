# Axoloth IntelliSense

IntelliSense support for `@quertys/axoloth-style` utility classes and `@quertys/axoloth-behavior` declarative attributes.

This extension helps you write Axoloth CSS utilities and behavior markup faster in VS Code. It provides class completions, behavior attribute completions, hover documentation, snippets, and lightweight diagnostics for `axo-*` classes.

Deprecated utilities remain discoverable during their compatibility window, but
their completions are struck through and hover documentation shows the supported
replacement and earliest removal version.

## Features

- Completion for Axoloth utility classes in `class`, `className`, `class:list`, and CSS selectors.
- Completion for known `data-axo-*` behavior attributes inside HTML-like opening tags.
- Duplicate filtering inside the same class attribute.
- Hover documentation for known `axo-*` classes, `--axo-*` variables, `data-axo-*` attributes, `axo:*` events, and `init*` behavior initializers.
- Snippets for common Axoloth structures like container-aware grids, drawers, off-canvas sidebars, dialogs, tabs, accordions, dropdowns, toast regions, forms, validation states, loading states, alerts, and data tables.
- Lightweight warnings for unknown `axo-*` classes in class-like contexts.
- Quick fixes for unknown `axo-*` classes, including nearest-class replacement and remove-class actions.
- CSS custom data for `--axo-*` variables, so VS Code can show native CSS variable completion and hover docs.
- Value suggestions for known `--axo-*` variables, such as motion durations, layout gaps, lift distances, colors, and shadows.
- Deprecation-aware completion and hover details synchronized from the Axoloth Style API contract.
- Behavior metadata synchronized from the Axoloth Behavior registry and deprecation contract.

## Supported Languages

- HTML
- CSS
- React JSX / TSX
- Vue
- Svelte
- Astro

## Usage

Type inside a class attribute:

```html
<div class="axo-"></div>
```

Or in React:

```jsx
<div className="axo-"></div>
```

The extension only starts suggesting when the current token begins with `axo` or `axo-`, so normal classes like `axis-card` do not get noisy Axoloth suggestions.

Unknown Axoloth classes show a warning. Use VS Code Quick Fix from the lightbulb, context menu, or keyboard shortcut to replace a typo like `axo-bentoo` with the nearest known class such as `axo-bento`.

In CSS files, type an Axoloth variable:

```css
.card {
  --axo-gap: 1rem;
}
```

VS Code's native CSS service provides completion and hover documentation for known `--axo-*` variables. Axoloth IntelliSense also adds a fallback provider, so `--axo-` suggestions can appear even when you type the variable token directly or inside selector helpers such as `:where(...)`.

When the cursor is after a known Axoloth variable, the extension suggests common values while still allowing any valid CSS value:

```css
.card {
  --axo-lift-distance: -4px;
  --axo-delay: 120ms;
}
```

Use snippets for larger layout blocks:

```txt
axo-bento
axo-header
axo-sidebar
axo-sidebar-hover
axo-sidebar-fixed
axo-sidebar-fixed-rail
axo-drawer
axo-sidebar-offcanvas
axo-dialog
axo-tabs
axo-accordion
axo-dropdown
axo-toast-region
axo-app
axo-page
axo-nav
axo-form
axo-form-grid
axo-alert
axo-empty
axo-table
axo-bento-container
axo-header-container
axo-form-container
axo-app-container
axo-auto-grid
axo-switcher
axo-cover
axo-reel
axo-split
axo-sidebar-layout
axo-progress
axo-skeleton
axo-validation-form
axo-choice-controls
axo-skip-link
```

When building interactive markup, type a behavior attribute inside an opening tag:

```html
<button class="axo-button" data-axo-></button>
```

The extension suggests known attributes such as `data-axo-drawer-toggle`, `data-axo-toggle`, `data-axo-dialog-toggle`, `data-axo-tab`, and `data-axo-toast-region`. It filters duplicate `data-axo-*` attributes already used on the same tag.

Hover known behavior APIs to see their registry documentation:

```js
import { initDialog } from '@quertys/axoloth-behavior/dialog';

dialogElement.addEventListener('axo:dialog-open', () => {});
```

## Development

```bash
npm install
npm run compile
npm test
```

Open this folder in VS Code and press `F5` to launch an Extension Development Host.

## Packaging

```bash
npm run package
```

This creates a `.vsix` file that can be uploaded manually to the VS Code Marketplace publisher page for `quertys`.

## Data Source

The canonical utility source is:

```txt
../axoloth-style/metadata/registry.json
```

Behavior completions and hovers are synchronized from:

```txt
../axoloth-behavior/metadata/registry.json
../axoloth-behavior/metadata/deprecations.json
```

Run `npm run sync:data` to generate the latest Axoloth Style metadata, copy the class and variable projections into this extension, and rebuild CSS Custom Data.

Generated projections are stored at:

```txt
../axoloth-style/metadata/classes.json
../axoloth-style/metadata/variables.json
```

The sync step also generates `data/css.customData.json` for VS Code CSS Custom Data. Edit the registry instead of these generated projections.
