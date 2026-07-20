# Changelog

## Unreleased

- Froze the public naming prefix on `axo-*`, `--axo-*`, and `data-axo-*`.
- Added API contract validation for frozen class and CSS variable prefixes.

## 0.6.0

- Added repeatable Axe and Playwright accessibility audits for every public example at mobile and desktop sizes.
- Added accessibility checks to the consolidated Axoloth verification command and GitHub Actions quality gate.
- Captured the `0.5.0` public class and custom property baseline.
- Protected published CSS and metadata entry points in the API baseline.
- Added executable API compatibility and deprecation validation with unit tests.
- Added machine-readable deprecation metadata and generated active/deprecated status.
- Added a migration policy, reviewed baseline workflow, and public metadata exports.
- Added deprecated completion and hover support to Axoloth IntelliSense.

## 0.5.0

- Added `metadata/registry.json` as the canonical utility registry.
- Added deterministic metadata generation and drift validation.
- Added a generated utility search index for documentation tooling.
- Added a generated class reference to the package README.
- Added a public naming and future deprecation policy.
- Added visual regression coverage for six representative pages at five viewport widths.
- Documented two previously unregistered fixed-sidebar offset variables.

## 0.4.0

- Added Dropdown and Toast layout, state, positioning, and motion utilities.
- Added synchronized class and CSS variable metadata for both behaviors.
