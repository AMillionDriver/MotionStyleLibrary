# Axoloth IntelliSense

IntelliSense support for `@quertys/axoloth-style` utility classes.

This extension helps you write Axoloth CSS utilities faster in VS Code. It provides class completions, hover documentation, snippets, and lightweight diagnostics for `axo-*` classes.

## Features

- Completion for Axoloth utility classes in `class`, `className`, `class:list`, and CSS selectors.
- Duplicate filtering inside the same class attribute.
- Hover documentation for known `axo-*` classes.
- Snippets for common Axoloth structures like bento grids and app headers.
- Lightweight warnings for unknown `axo-*` classes in class-like contexts.

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
