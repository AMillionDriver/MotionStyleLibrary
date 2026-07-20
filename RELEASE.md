# Release Checklist

This repository uses protected branches and package-specific release flows. Release work should go through pull requests before tagging.

## Axoloth Style

`@quertys/axoloth-style` is published through npm Trusted Publishing with GitHub Actions.

Trusted Publisher settings on npm:

- Organization or user: `AMillionDriver`
- Repository: `MotionStyleLibrary`
- Workflow filename: `publish-style.yml`
- Environment name: empty
- Allowed action: `Allow npm publish`

Before publishing:

1. Update `packages/axoloth-style/package.json` to the next npm version.
2. Update `packages/axoloth-style/CHANGELOG.md`.
3. Keep generated metadata current:

   ```bash
   npm --prefix packages/axoloth-style run generate
   ```

4. Run checks:

   ```bash
   npm run verify:axoloth
   ```

5. Merge the release PR into `main`.
6. Tag the release from updated `main`:

   ```bash
   git switch main
   git pull origin main
   git tag style-v0.9.0
   git push origin style-v0.9.0
   ```

The `style-v*` tag starts `.github/workflows/publish-style.yml`, verifies the style package, previews package contents, and publishes to npm.

Do not use `npm publish --access public` manually for `@quertys/axoloth-style` once the Trusted Publisher connection is active.

## Axoloth Behavior

`@quertys/axoloth-behavior` still uses manual npm publishing unless a separate Trusted Publisher workflow is added.

Before publishing manually:

```bash
npm --prefix packages/axoloth-behavior run check
npm --prefix packages/axoloth-behavior pack --dry-run
```

## Axoloth IntelliSense

The VS Code extension is packaged locally and published manually to the Marketplace.

Before publishing:

```bash
npm --prefix packages/axoloth-intellisense test
npm --prefix packages/axoloth-intellisense run package
```

Upload the generated `.vsix` or publish through the Marketplace CLI if configured.
