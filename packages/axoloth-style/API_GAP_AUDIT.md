# Evidence-Based API Gap Audit

Audit date: 2026-07-21

Baseline: `f783cca` (`main`)

Package snapshot: `@quertys/axoloth-style@0.10.0`

## Purpose

This audit tests whether repeated CSS in Axoloth's public examples justifies expanding the
public utility API. It reviews every standalone example and composition recipe, separates
structural CSS from project identity, and applies a fixed evidence threshold:

- one independent page: keep the rule in demo CSS;
- two independent pages: record it as a candidate;
- three or more independent pages: consider a public utility;
- brand colors and decorative typography never count toward the core API.

Recurrence is necessary, not sufficient. A repeated rule is still rejected when it is a
browser reset, already covered by Axoloth, or lacks one coherent structural contract.

## Snapshot

The reviewed package exposes 176 classes and 195 custom properties across the accordion,
bento, dialog, dropdown, layout, motion, semantic, surface, tabs, and toast modules. The
corpus contains 13 independent pages: 10 examples and 3 recipes.

| Corpus page                | Kind    | Local structural CSS found                                | Audit result                                              |
| -------------------------- | ------- | --------------------------------------------------------- | --------------------------------------------------------- |
| `examples/app-shell`       | Example | Metric presentation                                       | Two-page candidate; typography stays local                |
| `examples/bento`           | Example | Demo wrapper, narrow fixture, section spacing             | Existing page/container primitives or fixture-only        |
| `examples/dashboard-cards` | Example | Metric presentation                                       | Two-page candidate; typography stays local                |
| `examples/fixed-sidebar`   | Example | Brand mark, no-wrap label, hero height, mobile visibility | Visual identity or existing utilities                     |
| `examples/landing-simple`  | Example | Centered hero and headline measure                        | Hero is covered; measure contributes evidence             |
| `examples/motion-showcase` | Example | Panel and muted colors                                    | Theme-only; excluded                                      |
| `examples/portfolio-grid`  | Example | Panel, muted copy, project tag                            | Theme/typography; excluded                                |
| `examples/pricing-table`   | Example | Price type treatment and featured border                  | Theme/typography; excluded                                |
| `examples/semantic-form`   | Example | Local heading margin reset                                | Reset pattern; no utility proposed                        |
| `examples/settings-panel`  | Example | Status pill                                               | Already covered by `axo-badge`                            |
| `recipes/editorial-split`  | Recipe  | Text measure, copy alignment, quote/rule, mobile order    | Measure contributes evidence; remainder stays local       |
| `recipes/gallery-dialog`   | Recipe  | Intro measure, gallery art, hover/focus, dialog theme     | Measure contributes evidence; remainder stays local       |
| `recipes/media-hero`       | Recipe  | Text measure, overlay/scrim, responsive focal point       | Measure contributes evidence; composition already covered |

Shared documentation-shell CSS is not counted once per recipe. Only each recipe's own
`theme.css` is evidence, which prevents one shared stylesheet from inflating recurrence.

## Evidence Matrix

| Normalized structural pattern                             | Independent pages                                                   | Count | Existing coverage                                                          | Decision                                             |
| --------------------------------------------------------- | ------------------------------------------------------------------- | ----: | -------------------------------------------------------------------------- | ---------------------------------------------------- |
| Remove the browser's default page margin                  | All 10 examples                                                     |    10 | None by design                                                             | Repeated foundation concern, not a class utility     |
| Constrain readable text without centering its box         | `landing-simple`, `editorial-split`, `gallery-dialog`, `media-hero` |     4 | Partial: `axo-center` and `axo-container` also center and size their boxes | **Consider `axo-measure`**                           |
| Vertically center content in a minimum-height hero        | `fixed-sidebar`, `landing-simple`, `media-hero`                     |     3 | `axo-cover` and `--axo-cover-height`                                       | Already covered; migrate demos instead of adding API |
| Remove intrinsic margins from isolated content            | `fixed-sidebar`, `semantic-form`, `editorial-split`                 |     3 | `axo-flow` trims direct-child block margins where a flow context exists    | No coherent cross-element contract; keep local       |
| Responsive media cropping and stable aspect ratio         | All 3 recipes                                                       |     3 | `axo-frame` and its variables                                              | Already covered                                      |
| Wrapping content/action composition                       | All 3 recipes                                                       |     3 | `axo-split`, `axo-auto-grid`, `axo-cluster`, and `axo-stack`               | Already covered                                      |
| Large metric number treatment                             | `app-shell`, `dashboard-cards`                                      |     2 | None, intentionally                                                        | Candidate only; typography is outside layout core    |
| Center one composition region on its cross axis           | `editorial-split`, `media-hero`                                     |     2 | Context-dependent use of `axo-cover` or parent alignment variables         | Candidate only; gather a third independent use       |
| Force a gallery/card child to fill available inline space | `gallery-dialog`, `media-hero`                                      |     2 | Usually supplied by `axo-frame` or its parent composition                  | Candidate only; current cases are not equivalent     |
| Demo wrapper with a constrained width and auto margins    | `bento`                                                             |     1 | `axo-page` plus `axo-container`                                            | Replace in demo when touched; no new API             |
| Fixed square brand mark with centered content             | `fixed-sidebar`                                                     |     1 | Visual identity; `axo-icon-button` is interactive-only                     | Keep demo CSS                                        |
| Sidebar label no-wrap behavior                            | `fixed-sidebar`                                                     |     1 | Specific to the hover-rail label treatment                                 | Keep demo CSS                                        |
| Mobile content reordering                                 | `editorial-split`                                                   |     1 | Recipe-specific editorial direction                                        | Keep recipe CSS                                      |
| Decorative rule and quote treatment                       | `editorial-split`                                                   |     1 | Brand/editorial styling                                                    | Excluded                                             |
| Gallery sprite, hover elevation, and dialog art treatment | `gallery-dialog`                                                    |     1 | Asset and interaction presentation                                         | Keep recipe CSS                                      |
| Hero scrim, CTA minimum width, and responsive focal point | `media-hero`                                                        |     1 | Product imagery and visual direction                                       | Keep recipe CSS                                      |

## Public Utility Worth Considering

### `axo-measure`

Four independent pages constrain readable copy without asking the element to become a
centered container:

- `web_examples/examples/landing-simple/index.html:29` limits the hero headline;
- `web_examples/recipes/editorial-split/theme.css:21`, `:30`, and `:72` constrain headline,
  body copy, and caption measures;
- `web_examples/recipes/gallery-dialog/theme.css:9` constrains the gallery introduction;
- `web_examples/recipes/media-hero/theme.css:37` and `:46` constrain headline and copy.

The nearest current primitives are not interchangeable:

- `axo-center` sets an element's inline size, auto margins, and optional gutter;
- `axo-container` sets a broad page-container width and auto margins;
- the observed pattern only needs a maximum readable line length in the element's current
  alignment context.

A future implementation can therefore be evaluated with this minimal contract:

```css
:where(.axo-measure) {
  max-inline-size: var(--axo-measure, 65ch);
}
```

This audit does not add the class or variable. Before implementation, the contract still
needs naming review, metadata, documentation, IntelliSense coverage, and responsive tests.
No size variants are justified yet; pages already need different values and can override
one custom property.

## Repeated Patterns That Should Not Become Utilities

### Page margin reset

Every standalone example uses `body { margin: 0; }`. The evidence is strong, but a class
cannot reliably solve a browser default on `body` unless every consumer remembers to add it.
If Axoloth later wants a reset, it should be an explicit optional stylesheet entry point,
reviewed as a foundation policy rather than disguised as a utility.

### Margin-zero helpers

Three pages remove margins from unrelated elements: dialog headings, form headings, panel
copy, and a figure. A generic margin utility would move Axoloth toward an atomic spacing
framework, while a semantic utility would falsely claim these elements share one component
contract. `axo-flow` already handles the common direct-child rhythm case.

### Metric typography

`app-shell` and `dashboard-cards` both style large metric values. This reaches only the
two-page candidate threshold and primarily controls font size and weight. It remains demo
typography unless a third structurally equivalent use demonstrates layout behavior beyond
visual hierarchy.

## Existing API Migration Opportunities

These are documentation maintenance opportunities, not gaps:

- replace the custom bento demo wrapper with `axo-page` and `axo-container` when that page is
  next edited;
- express the `landing-simple` and `fixed-sidebar` hero structures with `axo-cover` and
  `--axo-cover-height`;
- replace the custom settings status pill structure with `axo-badge` while retaining its
  local colors;
- keep using `axo-frame`, `axo-flow`, `axo-cluster`, `axo-split`, `axo-auto-grid`, and
  `axo-pile` in recipes instead of extracting recipe-specific component classes into core.

Migration is not required merely to make the demos visually identical. It becomes useful
when a page is already being changed and the primitive communicates the same contract.

## Excluded Project Identity

The audit deliberately excludes repeated `.muted` colors, panel colors, accent borders,
font families, display type scales, uppercase kickers, shadows, scrims, and artwork. Their
recurrence demonstrates that examples need themes, not that Axoloth needs a theme system.
The same applies to editorial quotes, gallery sprites, pricing emphasis, and portfolio tags.

## Outcome

- One evidence-backed public utility is ready for design consideration: `axo-measure`.
- Two-page candidates remain on the watch list and are not proposed for implementation.
- Three-or-more-page patterns already covered by Axoloth should drive demo migration, not
  API expansion.
- Browser resets and project identity remain outside the utility API.
- No CSS, metadata, export, package version, or public API changed during this audit.

The next API change should start from this report's `axo-measure` evidence or from new
examples that raise a two-page candidate to at least three independent uses.
