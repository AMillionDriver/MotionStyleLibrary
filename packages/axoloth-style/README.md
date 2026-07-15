# Axoloth Style

CSS-first layout and motion utilities for app shells, sidebars, bento grids, and simple animation presets.

Axoloth Style is a small CSS utility package for reusable layout and animation behavior. It helps you build app shells, sidebars, bento grids, structural cards, and lightweight motion effects without depending on React, Tailwind, Motion, Vite, or any runtime JavaScript.

It is not a Tailwind replacement and it does not try to own your full visual theme. Use Axoloth Style for layout and motion, then keep colors, typography, spacing details, and brand styling in your app.

> Indonesian note: Axoloth Style dipakai untuk mempercepat format layout dan animasi, bukan untuk menggantikan styling utama project kamu.

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
import '@quertys/axoloth-style/bento.css';
import '@quertys/axoloth-style/layout.css';
import '@quertys/axoloth-style/motion.css';
import '@quertys/axoloth-style/surface.css';
```

Available package exports:

- `@quertys/axoloth-style/axoloth.css`: all Axoloth layout, surface, and motion utilities.
- `@quertys/axoloth-style/bento.css`: bento grid and card layout utilities only.
- `@quertys/axoloth-style/layout.css`: app shell, sidebar, app header, searchbar, and structural layout utilities only.
- `@quertys/axoloth-style/motion.css`: animation and hover motion utilities only.
- `@quertys/axoloth-style/surface.css`: light/dark surface and contrast utilities only.

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
  href="https://cdn.jsdelivr.net/npm/@quertys/axoloth-style@0.0.6/src/axoloth.css"
/>
```

Pinning the version is recommended so your page does not change unexpectedly.

## Layout Utilities

Layout utilities are structural helpers for common app sections. They do not ship icons or a full visual design. Bring your own icons from Lucide, Heroicons, Google Material Symbols, inline SVG, or plain HTML.

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

Grid and card classes:

- `axo-bento`: responsive bento grid container.
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
