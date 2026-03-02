# WPML Export Enablement

- [x] Add `--lang` support to WordPress export script.
- [x] Add WPML language probes to healthcheck script.
- [x] Add npm aliases for NL and EN exports.
- [x] Run healthcheck and export NL/EN datasets.
- [x] Verify EN URL coverage in exported files.
- [x] Add one-command all-locales export orchestration.
- [x] Run all-locales export command and verify combined manifest.
- [x] Add sitemap-vs-export validator script and npm command.
- [x] Run sitemap validator and review report output.

## Review Notes

- Initial export pulled default-language data only.
- WPML language parameter support is now probed via healthcheck.
- EN and NL exports are now split into dedicated folders under `data/wordpress/`.
- Combined manifest now generated at `data/wordpress/export-manifest.json`.
- Initial validator run found sitemap/export drift that should be triaged (NL missing 56, EN missing 57).

# Phase 1 Ingestion Connectivity

- [x] Add Strapi env contract keys to `.env.example`.
- [x] Add local Strapi runtime keys to `.env.local` (token intentionally left blank for secure injection).
- [x] Add Strapi read-only healthcheck script for `/api/profiles/health` and `/api/profiles?pagination[pageSize]=1`.
- [x] Include scoped host-header checks for `desire-escorts.nl` and `www.desire-escorts.nl`.
- [x] Add npm commands for Strapi and combined ingestion health checks.
- [x] Run `npm run strapi:healthcheck` with secure token present and record results.

## Review Notes (Phase 1)

- Strapi checks use bearer token auth and enforce `x-forwarded-host` on every request.
- Script fails fast with actionable errors for missing env, token scope, or endpoint access.
- Verification run passed for both `desire-escorts.nl` and `www.desire-escorts.nl` host scopes.
- Combined ingestion check (`wp:healthcheck` + `strapi:healthcheck`) passed end-to-end.

# Phase 2 Hybrid URL Inventory

- [x] Add `.firecrawl/` to `.gitignore`.
- [x] Add hybrid inventory builder script and npm command.
- [x] Run sitemap discovery + Firecrawl map union build.
- [x] Generate canonical inventory, review queue, and summary artifacts.
- [ ] Start Firecrawl rendered extraction for prioritized template batches.

## Review Notes (Phase 2)

- New command `npm run inventory:build` generates inventory artifacts under `data/inventory/`.
- Latest run produced 781 canonical URLs (NL 392, EN 389) from sitemap+Firecrawl union.
- Review queue narrowed to 2 Firecrawl-only URLs requiring classification.
