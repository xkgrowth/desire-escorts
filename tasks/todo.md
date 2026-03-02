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
- [x] Start Firecrawl rendered extraction for prioritized template batches (core pilot).
- [x] Expand rendered extraction from pilot batch to broader prioritized groups.
- [x] Build normalized reconciliation dataset keyed by canonical URL with provenance fields.
- [x] Run Strapi coverage audit for profile data across scoped hosts.
- [x] Build first include/review/exclude gate manifest.
- [x] Triage remaining review URLs to final include/exclude/redirect decisions.
- [x] Generate parity evidence artifacts (link/metadata/media/language) and refresh gate summary.
- [x] Create build-phase handoff action plan artifact.
- [x] Execute parity QA follow-up checklist for link/metadata/language review signals.
- [x] Complete link-target triage and generate redirect/include-addition artifacts.
- [x] Complete metadata parity gap analysis and clear metadata gate to pass.
- [x] Complete language parity gap analysis and clear language gate to pass (with accepted redirect exception).

## Review Notes (Phase 2)

- New command `npm run inventory:build` generates inventory artifacts under `data/inventory/`.
- Latest run produced 781 canonical URLs (NL 392, EN 389) from sitemap+Firecrawl union.
- Review queue narrowed to 2 Firecrawl-only URLs requiring classification.
- Core rendered extraction pilot completed with 12/12 successes and output manifests in `data/firecrawl/`.
- Full Firecrawl rendered extraction completed with inventory coverage report at `data/firecrawl/coverage-report.json` (`781/781` URLs covered).
- Reconciliation dataset now marks profile routes as Strapi-primary authority with URL parity intent.
- Strapi audit report generated with host-consistent profile counts and known endpoint caveats (`/health` 403 with read-only token, `/filters` 400 invalid key).
- Gate artifacts generated in `data/reconcile/` with current decisions: include `781`, review `0`, exclude `0`.
- Manual include overrides are tracked in `data/reconcile/manual-decision-overrides.json`.
- Parity evidence artifacts are generated under `data/reconcile/gates/`.
- Build handoff plan created at `.cursor/plans/CONTENT_MIGRATION_ACTION_PLAN.md`.
- Follow-up checklist created at `.cursor/plans/PARITY_QA_FOLLOWUP_CHECKLIST.md`.
- Link triage artifacts generated: `data/reconcile/link-target-triage.json`, `data/reconcile/redirect-candidates.json`, `data/reconcile/link-target-include-additions.json`.
- Metadata gap artifact generated: `data/reconcile/metadata-parity-gaps.json` (0 page-metadata gaps; `locations.kml` exempted as technical asset).
- Language gap artifact generated: `data/reconcile/language-parity-gaps.json` (0 review gaps, 1 accepted redirect exception).
- Residual follow-up: merge 50 include-additions into canonical inventory and implement 20 redirect candidates in runtime routing config.

## Deferred Backend Fixes (Logged)

- [x] Strapi `/api/profiles/health` route auth behavior fix implemented in `escorts/backend` (`auth: false` on health route).
- [x] Strapi `/api/profiles/filters` `Invalid key nationality` fix implemented in `escorts/backend` controller query.
- [ ] Deploy/restart Strapi backend and verify fixes on live endpoint via `npm run strapi:audit:coverage`.
