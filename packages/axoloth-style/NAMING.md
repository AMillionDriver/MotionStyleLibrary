# Axoloth Public Naming Policy

This policy keeps Axoloth utilities predictable as the package approaches a
stable API. Public names are recorded in `metadata/registry.json` before they
are released.

## Prefixes

- CSS classes use `axo-`.
- CSS custom properties use `--axo-`.
- Behavior attributes use `data-axo-`.
- JavaScript initializers use `init<Component>`.

The shorter `ax-` prefix and numbered names such as `axo-bento-01` are not part
of the public API.

## Class Names

Use semantic nouns for primitives and recipes:

```txt
axo-stack
axo-bento
axo-sidebar
axo-toast
```

Use a component or primitive prefix for modifiers and states:

```txt
axo-sidebar-fixed
axo-dropdown-end
axo-toast-open
```

Names describe structure or behavior, not a brand color or a project-specific
visual style. Avoid arbitrary-value class names, framework names, and version
numbers.

## CSS Variables

Use `--axo-<component>-<token>` for component values and a short shared name
only when several modules intentionally consume the same token:

```txt
--axo-sidebar-width
--axo-toast-duration
--axo-gap
--axo-radius
```

Variables should provide a fallback in CSS so adopting Axoloth never requires
a global theme file.

## Behavior Contracts

The element that owns a behavior uses `data-axo-<component>`. Controls and
owned regions add a descriptive suffix:

```txt
data-axo-dropdown
data-axo-dropdown-toggle
data-axo-dropdown-menu
```

Behavior state classes use the component name and state, such as
`axo-dropdown-open`. State classes are controlled by the behavior package and
remain documented because themes may target them.

## Changes And Deprecation

The executable policy and release workflow live in `MIGRATION.md`. The API
baseline and deprecation records are validated by `npm run check`.

- Before `1.0.0`, renames require a changelog entry and a migration note.
- Starting at `1.0.0`, a public name must remain as an alias for at least one
  minor release before removal.
- Removed names stay in a deprecation record with their replacement and final
  supported version.
- Generated files must never be edited directly. Change the registry, CSS, or
  generator source and run `npm run generate`.
