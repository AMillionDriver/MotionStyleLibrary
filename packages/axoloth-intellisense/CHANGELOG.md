# Changelog

## 0.0.21

- Added synchronized class and variable metadata for Composition Primitives V1.
- Added HTML and JSX snippets for intrinsic split and sidebar-layout patterns.

## 0.0.20

- Added synced class and variable metadata for first-class Drawer utilities.
- Added `data-axo-drawer-*` behavior attribute completions and hover documentation.
- Added HTML and JSX snippets for the Drawer API.

## 0.0.19

- Added `data-axo-*` behavior attribute completions inside HTML-like opening tags.
- Added hover documentation for behavior data attributes, custom events, and initializer functions.
- Synchronized Axoloth Behavior registry and deprecation metadata into the extension data set.

## 0.0.18

- Added strike-through completion tags for deprecated Axoloth classes and variables.
- Added replacement, deprecation version, and earliest removal details to hover documentation.
- Synchronized active/deprecated status from the Axoloth Style API contract metadata.

## 0.0.17

- Switched metadata sync to the canonical Axoloth Style utility registry and generator.
- Added the two fixed-sidebar main-offset variables discovered by registry drift validation.
- Synchronized `161` classes and `168` CSS variables from Axoloth Style `0.5.0`.

## 0.0.16

- Added IntelliSense metadata for Dropdown menus, Toast regions, content, actions, positions, and lifecycle states.
- Added synced value suggestions for Dropdown and Toast sizing, spacing, motion, borders, shadows, and stacking variables.
- Added accessible HTML and JSX snippets for `initDropdown` and `initToast` markup.

## 0.0.15

- Added IntelliSense metadata for Tabs and Accordion structure, controls, panels, and state utilities.
- Added synced value suggestions for tab sizing, indicators, accordion spacing, borders, and motion.
- Added accessible HTML and JSX snippets for `initTabs` and `initAccordion` markup.

## 0.0.14

- Added IntelliSense metadata for dialog layers, panels, regions, sizing, and state utilities.
- Added synced value suggestions for dialog sizing, spacing, motion, backdrop, border, and stacking variables.
- Added accessible HTML and JSX dialog snippets for `@quertys/axoloth-behavior`.

## 0.0.13

- Added IntelliSense metadata for off-canvas sidebar, backdrop, and open-state utilities.
- Added synced value suggestions for off-canvas sizing, motion, insets, backdrop, and stacking variables.
- Added accessible HTML and JSX off-canvas sidebar snippets for `@quertys/axoloth-behavior`.

## 0.0.12

- Added IntelliSense metadata for progress, skeleton, divider, and accessibility utilities.
- Added form validation, checkbox, radio, and switch class documentation.
- Added accessible HTML and JSX snippets for progress, loading, validation, choices, and skip links.

## 0.0.11

- Added IntelliSense metadata for container-aware Bento and layout primitives.
- Added snippets for container-responsive Bento, auto grids, switchers, covers, and reels.
- Added value suggestions for grid, switcher, center, cover, and reel variables.

## 0.0.10

- Added IntelliSense metadata for badge, alert, empty-state, and table utilities.
- Added HTML and JSX snippets for alerts, empty states, and responsive tables.
- Added synced value suggestions for status and data utility variables.

## 0.0.9

- Added IntelliSense metadata for Axoloth semantic utilities.
- Added snippets for semantic pages, nav lists, forms, and form grids.
- Added synced CSS variable suggestions for page, container, section, control, and focus-ring variables.

## 0.0.8

- Added IntelliSense metadata for fixed sidebar and app shell utilities.
- Added snippets for app shells, fixed sidebars, and fixed hover rail sidebars.
- Added synced CSS variable suggestions for app shell spacing, header/footer height, padding, and fixed sidebar insets.

## 0.0.7

- Added IntelliSense metadata for Axoloth sidebar utilities.
- Added snippets for static sidebar shells and hover-expand sidebar rails.
- Added synced CSS variable suggestions for sidebar width, rail width, spacing, transition, and z-index.

## 0.0.6

- Added value suggestions for known `--axo-*` CSS variables.
- Added value metadata sync from `@quertys/axoloth-style`.
- Added CSS Custom Data values for native CSS completions where supported.
- Added tests for Axoloth CSS variable value contexts.

## 0.0.5

- Improved `--axo-*` variable completion trigger reliability.
- Prioritized Axoloth variable suggestions above built-in CSS pseudo-element suggestions.
- Added variable completion triggers for `a`, `x`, and `o` after the initial dash trigger.

## 0.0.4

- Added fallback completion provider for `--axo-*` variables.
- Added hover support for `--axo-*` variables outside native CSS Custom Data contexts.

## 0.0.3

- Added VS Code CSS Custom Data for known `--axo-*` variables.
- Added synced variable metadata from `@quertys/axoloth-style`.
- Added native CSS variable completion and hover documentation support.

## 0.0.2

- Added Quick Fix actions for unknown `axo-*` classes.
- Added nearest-class replacement for likely typos like `axo-bentoo` -> `axo-bento`.
- Added remove-class Quick Fix for unknown Axoloth classes.

## 0.0.1

- Initial Axoloth IntelliSense extension.
- Added completions for `axo-*` classes.
- Added duplicate class filtering.
- Added hover documentation.
- Added snippets for bento and header layouts.
- Added lightweight unknown-class diagnostics.
