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
|-- scripts/behavior-guide.js
|-- scripts/theme.js
|-- data/examples.json
|-- data/recipes.json
|-- data/docs-nav.json
|-- data/docs-pages.json
|-- data/utilities.json
|-- docs/
|   |-- behavior/
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
|-- recipes/
|   |-- media-hero/
|   |-- editorial-split/
|   `-- gallery-dialog/
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

The Behavior Guide loads the repository's framework-free ES module source for its live demos. The
GitHub Pages workflow copies both package sources into the deployment artifact. Public copyable
examples use pinned jsDelivr URLs for `@quertys/axoloth-style` and
`@quertys/axoloth-behavior`.

For a standalone GitHub Pages deployment, replace those links with the published
CDN version:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@quertys/axoloth-style@0.9.0/src/axoloth.css"
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

## Composition Recipes

Focused real-world compositions live under `recipes/` and are registered in
`data/recipes.json`. Pack 1 includes:

- `media-hero` - layered media, scrim, and content using pile, frame, and cover.
- `editorial-split` - intrinsic long-form copy and portrait media using split and flow.
- `gallery-dialog` - responsive auto-grid items connected to Axoloth dialog behavior.

Every recipe documents complete HTML, the Axoloth classes and variables it uses, the CSS or
content-binding logic that remains project-owned, and both mobile and desktop behavior. Recipe
theme files are intentionally thin and do not add public Axoloth utilities.

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
  "version": "0.9.0",
  "status": "ready",
  "previewUrl": "./examples/sidebar-fixed/",
  "sourceUrl": "./examples/sidebar-fixed/index.html",
  "description": "Fixed sidebar with main content offset."
}
```
