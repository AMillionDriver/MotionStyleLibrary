# Axoloth Style Docs Hub

Static documentation and live example hub for Axoloth Style.

## Structure

```txt
web_examples/
├── index.html
├── styles/docs.css
├── scripts/examples.js
├── scripts/theme.js
├── data/examples.json
├── examples/
│   ├── app-shell/
│   ├── bento/
│   └── semantic-form/
└── assets/
```

## Local Preview

Use Live Server or any static server from `web_examples/`.

The root page loads data from `data/examples.json`, so opening the HTML file by
double-click may fail because browsers can block local JSON fetches.

## CSS Source

Local development uses the repository CSS:

```html
<link rel="stylesheet" href="../packages/axoloth-style/src/axoloth.css" />
```

For a standalone GitHub Pages deployment, replace that with the published CDN
version:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@quertys/axoloth-style@0.0.8/src/axoloth.css"
/>
```

Use the npm version that is already published.

## Add A New Example

1. Create a folder inside `examples/`, for example `examples/sidebar-fixed/`.
2. Add `index.html` inside that folder.
3. Add one object to `data/examples.json`.

```json
{
  "id": "sidebar-fixed",
  "name": "Fixed Sidebar",
  "category": "Layout",
  "version": "0.0.8",
  "status": "ready",
  "previewUrl": "./examples/sidebar-fixed/",
  "sourceUrl": "./examples/sidebar-fixed/index.html",
  "description": "Fixed sidebar with main content offset."
}
```
