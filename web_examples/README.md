# Axoloth Style Docs Hub

Static documentation and live example hub for Axoloth Style.

## Structure

```txt
web_examples/
|-- index.html
|-- styles/docs.css
|-- scripts/examples.js
|-- scripts/docs-sidebar.js
|-- scripts/component-docs.js
|-- scripts/theme.js
|-- data/examples.json
|-- data/docs-nav.json
|-- data/docs-pages.json
|-- data/utilities.json
|-- docs/
|   |-- sidebar/
|   |-- container/
|   |-- stack/
|   `-- motion/
|-- examples/
|   |-- app-shell/
|   |-- bento/
|   |-- semantic-form/
|   |-- fixed-sidebar/
|   |-- dashboard-cards/
|   |-- pricing-table/
|   |-- landing-simple/
|   |-- portfolio-grid/
|   |-- settings-panel/
|   `-- motion-showcase/
`-- assets/
```

## Local Preview

Use Live Server or any static server from `web_examples/`.

The root page and focused docs pages load JSON from `data/`, so opening the HTML
file by double-click may fail because browsers can block local JSON fetches.

## CSS Source

Local development uses the repository CSS:

```html
<link rel="stylesheet" href="../packages/axoloth-style/src/axoloth.css" />
```

Example pages use:

```html
<link rel="stylesheet" href="../../../packages/axoloth-style/src/axoloth.css" />
```

Focused docs pages use:

```html
<link rel="stylesheet" href="../../../packages/axoloth-style/src/axoloth.css" />
```

For a standalone GitHub Pages deployment, replace those links with the published
CDN version:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@quertys/axoloth-style@0.6.0/src/axoloth.css"
/>
```

Use the npm version that is already published.

`data/utilities.json` is generated from the canonical package registry. Update
`packages/axoloth-style/metadata/registry.json`, then run:

```bash
cd packages/axoloth-style
npm run generate
```

Every generated utility also carries an `active` or `deprecated` API status.
Deprecated entries include their supported replacement and earliest removal
version, sourced from `metadata/deprecations.json`.

## Add A New Docs Page

1. Add the sidebar entry to `data/docs-nav.json`.
2. Add the focused page content to `data/docs-pages.json`.
3. Create `docs/<id>/index.html` using the existing docs page shell.

Each docs route should focus on one item only: overview, basic template,
available classes, CSS variable options, code example, and live preview.

## Visual Regression

The visual matrix covers app shell, sidebar, Bento, forms, motion, and the docs
hub at 320, 375, 768, 1024, and 1440 pixels.

```bash
npm run test:visual
npm run test:visual:update
```

Use the update command only after reviewing an intentional layout change. The
same comparison runs in GitHub Actions on changes to Axoloth packages, examples,
or visual tests.

## Accessibility Audit

The docs hub and every example are scanned at mobile and desktop sizes with Axe
through Playwright. The automated gate checks detectable WCAG 2.0 and 2.1 A/AA
violations, browser errors, and horizontal document overflow:

```bash
npm run test:a11y
```

Automated checks cannot replace keyboard, screen reader, zoom, contrast, and
content reviews. Treat this command as the repeatable first layer of the audit.

## Add A New Example

1. Create a folder inside `examples/`, for example `examples/sidebar-fixed/`.
2. Add `index.html` inside that folder.
3. Add one object to `data/examples.json`.

```json
{
  "id": "sidebar-fixed",
  "name": "Fixed Sidebar",
  "category": "Layout",
  "version": "0.6.0",
  "status": "ready",
  "previewUrl": "./examples/sidebar-fixed/",
  "sourceUrl": "./examples/sidebar-fixed/index.html",
  "description": "Fixed sidebar with main content offset."
}
```
