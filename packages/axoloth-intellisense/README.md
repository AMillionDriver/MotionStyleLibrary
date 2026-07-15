# Axoloth IntelliSense

IntelliSense support for `@quertys/axoloth-style` utility classes.

This extension helps you write Axoloth CSS utilities faster in VS Code. It provides class completions, hover documentation, snippets, and lightweight diagnostics for `axo-*` classes.

## Features

- Completion for Axoloth utility classes in `class`, `className`, `class:list`, and CSS selectors.
- Duplicate filtering inside the same class attribute.
- Hover documentation for known `axo-*` classes.
- Snippets for common Axoloth structures like bento grids, app headers, sidebars, fixed sidebars, and app shells.
- Lightweight warnings for unknown `axo-*` classes in class-like contexts.
- Quick fixes for unknown `axo-*` classes, including nearest-class replacement and remove-class actions.
- CSS custom data for `--axo-*` variables, so VS Code can show native CSS variable completion and hover docs.
- Value suggestions for known `--axo-*` variables, such as motion durations, layout gaps, lift distances, colors, and shadows.

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
axo-app
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

Class metadata is sourced from:

```txt
../axoloth-style/metadata/classes.json
```

Run `npm run sync:data` to copy the latest class metadata into this extension's packaged `data/classes.json`.

Variable metadata is sourced from:

```txt
../axoloth-style/metadata/variables.json
```

The sync step also generates `data/css.customData.json` for VS Code CSS Custom Data.
