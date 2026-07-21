# Axoloth Style

[![npm version](https://img.shields.io/npm/v/%40quertys%2Faxoloth-style)](https://www.npmjs.com/package/@quertys/axoloth-style) [![npm weekly downloads](https://img.shields.io/npm/dw/%40quertys%2Faxoloth-style?label=weekly%20downloads)](https://www.npmjs.com/package/@quertys/axoloth-style) [![license](https://img.shields.io/npm/l/%40quertys%2Faxoloth-style)](https://github.com/AMillionDriver/MotionStyleLibrary/blob/main/LICENSE) [![GitHub stars](https://img.shields.io/github/stars/AMillionDriver/MotionStyleLibrary?style=flat)](https://github.com/AMillionDriver/MotionStyleLibrary)

Axoloth is a CSS-first utility library for building layout structure, simple motion, semantic controls, and accessible app patterns without locking a project into a specific frontend framework.

The repository also includes optional JavaScript behaviors, a VS Code IntelliSense extension, visual/accessibility tests, and static example pages.

## Links

- Documentation: [https://amilliondriver.github.io/MotionStyleLibrary/](https://amilliondriver.github.io/MotionStyleLibrary/)
- Repository: [AMillionDriver/MotionStyleLibrary](https://github.com/AMillionDriver/MotionStyleLibrary)
- VS Code Extension: [Axoloth IntelliSense](https://marketplace.visualstudio.com/items?itemName=quertys.axoloth-intellisense)

## Packages

| Package                                                                                                            | Current version | Purpose                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------ | --------------- | --------------------------------------------------------------------------------------------------------------- |
| `@quertys/axoloth-style`                                                                                           | `0.9.0`         | CSS utilities for app shells, composition primitives, bento grids, semantic controls, surfaces, and motion.     |
| `@quertys/axoloth-behavior`                                                                                        | `0.6.0`         | Optional zero-dependency DOM behaviors for tabs, accordions, dropdowns, dialogs, drawers, sidebars, and toasts. |
| [`quertys.axoloth-intellisense`](https://marketplace.visualstudio.com/items?itemName=quertys.axoloth-intellisense) | `0.0.22`        | VS Code support for `axo-*`, `--axo-*`, and `data-axo-*` authoring.                                             |

## What Axoloth Is / Is Not

Axoloth is a **pattern-level layout toolkit**. It packages recurring structures
such as app shells, sidebars, bento grids, intrinsic compositions, semantic
controls, and simple motion into reusable `axo-*` classes.

Axoloth is not an atomic CSS framework or a Tailwind replacement. It does not
offer a class for every CSS declaration, breakpoint prefixes such as `md:`, a
complete design theme, or automatic unused-CSS removal.

Axoloth owns reusable structure, responsive patterns, neutral control styling,
and optional motion. The consuming project owns brand colors, typography,
content styling, business logic, and one-off visual compositions.

## Vanilla Quick Starts

### CSS Only

Plain HTML can use Axoloth directly from a pinned CDN URL. Layout and CSS motion
do not require JavaScript:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@quertys/axoloth-style@0.9.0/src/axoloth.css"
/>

<main class="axo-page">
  <section class="axo-container axo-section">
    <div class="axo-bento">
      <article class="axo-card axo-wide axo-surface axo-rise axo-lift">
        <h1>Responsive structure</h1>
        <p>Add a local class when this card needs project-specific branding.</p>
      </article>
    </div>
  </section>
</main>
```

### CSS + Behavior

Install the optional behavior package when tabs, accordions, dropdowns, dialogs,
drawers, sidebars, or toasts need state and keyboard interaction:

```bash
npm install @quertys/axoloth-style @quertys/axoloth-behavior
```

For browser-native Vanilla JavaScript, import a pinned behavior module:

```html
<div class="axo-tabs" data-axo-tabs>
  <div class="axo-tab-list" aria-label="Sections">
    <button class="axo-tab" type="button" data-axo-tab="preview">Preview</button>
    <button class="axo-tab" type="button" data-axo-tab="source">Source</button>
  </div>
  <section class="axo-tab-panel" data-axo-tab-panel="preview">Preview panel</section>
  <section class="axo-tab-panel" data-axo-tab-panel="source">Source panel</section>
</div>

<script type="module">
  import { initTabs } from 'https://cdn.jsdelivr.net/npm/@quertys/axoloth-behavior@0.6.0/src/tabs.js';

  initTabs();
</script>
```

Behavior is never initialized by the CSS package. Import and initialize only
the components the page uses. See the
[Behavior Guide](https://amilliondriver.github.io/MotionStyleLibrary/docs/behavior/)
for installation, initialize-all and per-component patterns, cleanup,
troubleshooting, and runnable Vanilla examples.

### Bundler And Modular CSS

With Vite or another bundler, import the complete stylesheet once:

```js
import '@quertys/axoloth-style/axoloth.css';
```

The full `axoloth.css` entry imports every CSS module. It does not purge unused
selectors. Use focused entries when a page only needs part of Axoloth:

```js
import '@quertys/axoloth-style/layout.css';
import '@quertys/axoloth-style/motion.css';
```

Other focused entries include `bento.css`, `semantic.css`, `surface.css`,
`accordion.css`, `dialog.css`, `dropdown.css`, `tabs.css`, and `toast.css`. Do
not combine focused entries with `axoloth.css`, because the full entry already
includes every module.

## What Axoloth Focuses On

- Pattern-level layout utilities: app shells, headers, sidebars, bento grids, forms, tables, and responsive primitives.
- Simple CSS motion presets: fade, rise, pop, lift, glow, and shimmer.
- Neutral semantic styling: buttons, inputs, links, nav lists, alerts, empty states, progress, skeletons, and tables.
- Optional behavior hooks through `data-axo-*` attributes.
- Metadata-driven API contracts for classes, variables, behavior attributes, events, and package exports.

Axoloth is not a Tailwind replacement and does not try to own the full design theme. Use it with plain CSS, Tailwind, Bootstrap, React, Vue, Svelte, Astro, Laravel Blade, or vanilla HTML.

## Repository Layout

```txt
packages/
  axoloth-style/          CSS utility package
  axoloth-behavior/       Optional DOM behavior package
  axoloth-intellisense/   VS Code extension source and VSIX package flow
web_examples/            Static docs hub and integration examples
tests/                   Accessibility and visual regression tests
scripts/                 Repository verification scripts
src/                     React preview playground
```

## Documentation And Examples

The static docs hub lives in `web_examples/`.

It contains 10 example pages that use Axoloth utilities with thin local demo CSS:

- App shell
- Bento
- Semantic form
- Fixed sidebar
- Dashboard cards
- Pricing table
- Simple landing page
- Portfolio grid
- Settings panel
- Motion showcase

Run the docs checks:

```bash
cd web_examples
npm run check
```

## Development

Install dependencies from the repository root:

```bash
npm install
```

Run the React preview:

```bash
npm run dev
```

Build the preview:

```bash
npm run build
```

Run the full Axoloth verification suite:

```bash
npm run verify:axoloth
```

That verifier runs lint, build, style contract checks, behavior contract checks, docs checks, accessibility tests, visual tests, IntelliSense tests, and VSIX packaging.

## Releases

Release instructions live in [RELEASE.md](./RELEASE.md).

`@quertys/axoloth-style` publishes through npm Trusted Publishing after a `style-v*` tag is pushed from `main`. Behavior and VS Code extension releases remain manual unless their own publishing workflows are added.

## Package Checks

Style package:

```bash
cd packages/axoloth-style
npm run check
npm pack --dry-run
```

Behavior package:

```bash
cd packages/axoloth-behavior
npm run check
npm pack --dry-run
```

VS Code extension:

```bash
cd packages/axoloth-intellisense
npm test
npm run package
```

The generated VSIX is not published automatically. See the release checklist before publishing any package or extension.

## API Stability

Axoloth is still pre-1.0, but public CSS classes, CSS variables, package exports, behavior data attributes, events, and initializers are protected by metadata and contract tests.

Before changing public APIs, update the relevant registry and migration metadata:

- `packages/axoloth-style/metadata/registry.json`
- `packages/axoloth-style/metadata/deprecations.json`
- `packages/axoloth-behavior/metadata/registry.json`
- `packages/axoloth-behavior/metadata/deprecations.json`

## License

MIT
