# Axoloth Migration Policy

This document defines how Axoloth changes public CSS classes, custom properties,
entry points, and behavior-facing state names as the package approaches `1.0.0`.

## Public Contract

The public API includes:

- Classes listed in `metadata/registry.json`.
- CSS custom properties listed in `metadata/registry.json`.
- CSS and metadata entry points declared in `package.json#exports`.
- Documented `data-axo-*` attributes and behavior-controlled state classes.

The `0.5.0` public class names, variable names, and package exports are captured
in `metadata/api-baseline.json`. Additive API is allowed, but a baseline name or
entry point cannot disappear without a valid record in
`metadata/deprecations.json`.

## Deprecation Lifecycle

1. Add the replacement utility to CSS and `metadata/registry.json`.
2. Keep the old utility as a working alias.
3. Add a deprecation record with `status: "alias"`.
4. Add release notes and a concrete migration example.
5. Starting at `1.0.0`, keep the alias for at least one complete minor release.
6. At or after `removeIn`, remove the alias and change its record to
   `status: "removed"`.

```json
{
  "kind": "class",
  "name": "axo-old-name",
  "replacement": "axo-new-name",
  "deprecatedIn": "1.2.0",
  "removeIn": "1.3.0",
  "status": "alias",
  "note": "Replace axo-old-name with axo-new-name."
}
```

`kind` may be `class`, `variable`, or `export`. Export records use package
subpaths such as `./layout.css` for both `name` and `replacement`.

Generated metadata marks aliases as deprecated. Axoloth IntelliSense then
strikes through their completion entries and shows the replacement in hover
documentation.

## Release Workflow

Edit the canonical registry and deprecation records, then run:

```bash
npm run generate
npm run check
```

Before a release that intentionally establishes a new reviewed baseline:

```bash
npm run snapshot:api -- --force
git diff -- metadata/api-baseline.json
```

Never refresh the baseline merely to make a removal check pass. A changed
baseline is a release decision and must be reviewed alongside the changelog and
migration notes.

## Version Policy

- Before `1.0.0`, breaking changes require a deprecation record, changelog entry,
  and migration note, but the compatibility window may follow the next planned
  minor release.
- Starting at `1.0.0`, existing public names remain aliases for at least one full
  minor release before removal.
- Patch releases do not remove public API.
- Additive classes, variables, and entry points are backward compatible.

## Consumer Checklist

1. Read `CHANGELOG.md` before upgrading across minor versions.
2. Search for deprecated names reported by Axoloth IntelliSense.
3. Replace each alias with the documented replacement.
4. Run layout, accessibility, and visual checks in the consuming project.
5. Remove local compatibility overrides once migration is complete.
