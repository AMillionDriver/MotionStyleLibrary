# Axoloth Style

Axoloth is a CSS-first utility library for building layout structure, simple motion, semantic controls, and accessible app patterns without locking a project into a specific frontend framework.

The repository also includes optional JavaScript behaviors, a VS Code IntelliSense extension, visual/accessibility tests, and static example pages.

## Links

- Documentation: [https://amilliondriver.github.io/MotionStyleLibrary/](https://amilliondriver.github.io/MotionStyleLibrary/)
- Repository: [AMillionDriver/MotionStyleLibrary](https://github.com/AMillionDriver/MotionStyleLibrary)

## Packages

| Package                        | Current version | Purpose                                                                                                           |
| ------------------------------ | --------------- | ----------------------------------------------------------------------------------------------------------------- |
| `@quertys/axoloth-style`       | `0.6.0`         | CSS utilities for app shells, bento grids, sidebars, semantic controls, surface themes, and motion presets.       |
| `@quertys/axoloth-behavior`    | `0.5.0`         | Optional zero-dependency DOM behaviors for tabs, accordions, dropdowns, dialogs, off-canvas sidebars, and toasts. |
| `quertys.axoloth-intellisense` | `0.0.19`        | VS Code support for `axo-*`, `--axo-*`, and `data-axo-*` authoring.                                               |

## Install

```bash
npm install @quertys/axoloth-style
```

Import the full CSS entry once:

```js
import '@quertys/axoloth-style/axoloth.css';
```

Or import a focused CSS module:

```js
import '@quertys/axoloth-style/bento.css';
import '@quertys/axoloth-style/layout.css';
import '@quertys/axoloth-style/motion.css';
```

Install behavior only when interactive components need it:

```bash
npm install @quertys/axoloth-behavior
```

```js
import { initTabs } from '@quertys/axoloth-behavior/tabs';

const tabs = initTabs();
```

## Quick Example

```html
<main class="axo-page axo-theme-light">
  <section class="axo-container axo-section">
    <div class="axo-bento">
      <article class="axo-card axo-wide axo-surface axo-rise axo-lift">
        <h2>Responsive layout</h2>
        <p>Axoloth handles structure. Your app keeps control of visual identity.</p>
      </article>

      <aside class="axo-card axo-tall axo-contrast axo-pop">
        <h2>Sidebar card</h2>
        <p>Combine layout, surface, and motion utilities as needed.</p>
      </aside>
    </div>
  </section>
</main>
```

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

The generated VSIX is not published automatically. Publishing to npm and VS Code Marketplace remains manual.

## API Stability

Axoloth is still pre-1.0, but public CSS classes, CSS variables, package exports, behavior data attributes, events, and initializers are protected by metadata and contract tests.

Before changing public APIs, update the relevant registry and migration metadata:

- `packages/axoloth-style/metadata/registry.json`
- `packages/axoloth-style/metadata/deprecations.json`
- `packages/axoloth-behavior/metadata/registry.json`
- `packages/axoloth-behavior/metadata/deprecations.json`

## License

MIT
