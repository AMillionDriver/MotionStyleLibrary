# Axoloth Style

CSS-first layout and motion utilities for bento grids and simple animation presets.

Axoloth Style is a small CSS utility package for reusable layout and animation behavior. It helps you build bento grids, structural cards, and lightweight motion effects without depending on React, Tailwind, Motion, Vite, or any runtime JavaScript.

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
<div class="axo-bento">
  <div class="axo-card axo-wide axo-rise axo-lift">
    Bento wide
  </div>

  <div class="axo-card axo-tall axo-pop axo-glow">
    Bento tall
  </div>

  <div class="axo-card axo-square axo-fade">
    Bento square
  </div>
</div>
```

Axoloth Style gives these elements structure, responsive grid behavior, transitions, and animations. It intentionally keeps visual color neutral, so add your own app classes or CSS for the final look.

## CSS Entry Points

Use the full entry when you want everything:

```js
import '@quertys/axoloth-style/axoloth.css';
```

Use smaller entries when you only need one module:

```js
import '@quertys/axoloth-style/bento.css';
import '@quertys/axoloth-style/motion.css';
```

Available package exports:

- `@quertys/axoloth-style/axoloth.css`: bento layout plus motion utilities.
- `@quertys/axoloth-style/bento.css`: bento grid and card layout utilities only.
- `@quertys/axoloth-style/motion.css`: animation and hover motion utilities only.

## Framework Setup

### Vanilla HTML

If you are testing with plain HTML and Live Server, install the package first:

```bash
npm install @quertys/axoloth-style
```

Then load the CSS file in your `<head>`:

```html
<link
  rel="stylesheet"
  href="./node_modules/@quertys/axoloth-style/src/axoloth.css"
/>
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
      <div className="axo-card axo-wide axo-rise axo-lift">
        Wide card
      </div>
      <div className="axo-card axo-tall axo-pop axo-glow">
        Tall card
      </div>
    </div>
  );
}
```

Vue, Svelte, Astro, and normal HTML templates use `class`:

```html
<div class="axo-bento">
  <div class="axo-card axo-large axo-rise axo-shimmer">
    Large card
  </div>
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
  "styles": [
    "src/styles.css",
    "node_modules/@quertys/axoloth-style/src/axoloth.css"
  ]
}
```

Then use the classes in your component templates:

```html
<section class="axo-bento">
  <article class="axo-card axo-wide axo-rise axo-lift">
    Angular bento card
  </article>
</section>
```

### CDN

For quick prototypes, you can load the published CSS from a CDN:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@quertys/axoloth-style@0.0.1/src/axoloth.css"
/>
```

Pinning the version is recommended so your page does not change unexpectedly.

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
  <article class="axo-card axo-wide">
    Wide content
  </article>

  <article class="axo-card axo-tall">
    Tall content
  </article>

  <article class="axo-card axo-large">
    Large content
  </article>
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
<button class="axo-card axo-rise axo-lift axo-glow">
  Animated action
</button>
```

Axoloth Style respects `prefers-reduced-motion: reduce` by disabling the built-in animations for users who prefer less motion.

## Customizing With CSS Variables

You can customize Axoloth Style from any parent wrapper:

```css
.dashboard-grid {
  --axo-gap: 1rem;
  --axo-row-min: 180px;
  --axo-radius: 0.75rem;
  --axo-card-padding: 1rem;
  --axo-duration: 520ms;
  --axo-delay: 80ms;
  --axo-rise-distance: 18px;
  --axo-pop-start: 0.92;
  --axo-lift-distance: -4px;
  --axo-glow-shadow: 0 18px 48px rgb(34 211 238 / 0.16);
  --axo-shimmer-duration: 1.6s;
  --axo-shimmer-color: rgb(255 255 255 / 0.16);
}
```

Then apply your wrapper:

```html
<div class="dashboard-grid axo-bento">
  <div class="axo-card axo-wide axo-rise">Custom grid</div>
</div>
```

## Styling With Your Own Theme

Because `axo-card` is intentionally neutral, you can combine it with your own CSS:

```css
.my-surface {
  background: rgb(15 23 42);
  border-color: rgb(148 163 184 / 0.18);
  color: white;
}
```

```html
<div class="axo-card axo-wide axo-rise my-surface">
  Themed by your app
</div>
```

Or combine it with Tailwind, Bootstrap, UnoCSS, plain CSS modules, Sass, or any existing design system.

## Troubleshooting

### The classes do nothing in plain HTML

The CSS is probably not loaded. In plain HTML, installing the package is not enough. Add a `<link>` tag:

```html
<link
  rel="stylesheet"
  href="./node_modules/@quertys/axoloth-style/src/axoloth.css"
/>
```

### I used `className` in HTML and it did not work

Use `className` only in React JSX. Use `class` in HTML, Vue templates, Svelte templates, Angular templates, and Astro markup.

### The card looks too plain

That is expected. Axoloth Style handles layout and motion, but it does not ship a full color theme. Add your own background, text color, border color, or use your existing style framework.

### The package works in Vite but not in Live Server

Bundlers like Vite understand package imports:

```js
import '@quertys/axoloth-style/axoloth.css';
```

Live Server serves static files directly, so use the `node_modules` path in a `<link>` tag:

```html
<link
  rel="stylesheet"
  href="./node_modules/@quertys/axoloth-style/src/axoloth.css"
/>
```

### The animation does not replay after refresh or class changes

CSS entrance animations run when the element enters the page or when the animation class is re-applied. If you need manual replay in an app, toggle the animation class or remount the element from your framework.

## Browser Support

Axoloth Style uses standard CSS grid, flexbox, transitions, custom properties, and keyframe animations. It is designed for modern browsers.

## License

MIT
