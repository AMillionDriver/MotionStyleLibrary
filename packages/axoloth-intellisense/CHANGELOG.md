# Changelog

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
