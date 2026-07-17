# Axoloth Behavior Migration Policy

Axoloth Behavior keeps its package entry points, exported initializers,
declarative `data-axo-*` attributes, and documented `axo:*` events under an
executable compatibility contract.

## Public Contract

The `0.4.0` contract is captured in `metadata/api-baseline.json`:

- Package exports such as `.` and `./tabs`.
- Initializers such as `initTabs` and `initAxolothBehaviors`.
- Declarative attributes such as `data-axo-tabs`.
- Custom events such as `axo:tabs-change`.

`npm run check` compares the registry with both the baseline and the current
JavaScript source. A new source attribute, initializer, or event must be
registered, while an existing public name cannot disappear silently.

## Deprecation Lifecycle

1. Add and document the replacement API.
2. Keep the old API working as an alias.
3. Add a record to `metadata/deprecations.json` with `status: "alias"`.
4. Add a changelog entry and an exact before/after migration example.
5. Starting at `1.0.0`, retain the alias for at least one full minor release.
6. At or after `removeIn`, remove it and change the status to `"removed"`.

```json
{
  "kind": "dataAttribute",
  "name": "data-axo-old-trigger",
  "replacement": "data-axo-new-trigger",
  "deprecatedIn": "1.2.0",
  "removeIn": "1.3.0",
  "status": "alias",
  "note": "Rename the trigger attribute in markup."
}
```

Supported kinds are `export`, `initializer`, `dataAttribute`, and `event`.
Removals target minor or major releases, never patch releases.

## Release Workflow

```bash
npm run check
npm pack --dry-run
```

After explicitly reviewing a new release contract, capture it with:

```bash
npm run snapshot:api -- --force
git diff -- metadata/api-baseline.json
```

Do not refresh the baseline merely to silence a failed compatibility check.
Baseline changes are release decisions and require review.
