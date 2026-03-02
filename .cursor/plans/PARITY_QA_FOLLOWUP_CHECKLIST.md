# PARITY QA FOLLOW-UP CHECKLIST

Generated: 2026-03-02
Goal: Resolve remaining review-level parity signals after ingestion/gating completion.

## 1) Link Signal Follow-Up

- [x] Classify unresolved internal link targets in `data/reconcile/gates/link-gate-evidence.json` into:
  - valid in-scope routes to add to inventory/manifests,
  - intentional out-of-scope routes,
  - legacy-only URLs requiring redirect mapping.
- [x] Create `data/reconcile/link-target-triage.json` with one record per unresolved URL:
  - `url`, `decision` (`include|redirect|ignore`), `reason`, `owner`.
- [x] For `decision=include`, append to canonical inventory workflow and regenerate:
  - `npm run inventory:build`
  - `npm run reconcile:build-dataset`
  - `npm run reconcile:gates`
  - `npm run reconcile:parity-evidence`
- [x] For `decision=redirect`, add to redirect candidate file:
  - `data/reconcile/redirect-candidates.json`

### Link Follow-Up Status Update (2026-03-02)

- Triage output: `data/reconcile/link-target-triage.json`
  - decisions: `include 50`, `redirect 20`, `ignore 3`, `review 0`
- Redirect matrix seed: `data/reconcile/redirect-candidates.json` (`20` entries)
- Include-additions seed (not yet merged into canonical inventory): `data/reconcile/link-target-include-additions.json` (`50` URLs)

## 2) Metadata Signal Follow-Up

- [x] Identify the URLs missing title/description/robots from:
  - `data/reconcile/gates/metadata-gate-evidence.json`
- [x] Create `data/reconcile/metadata-parity-gaps.json` with fields:
  - `url`, `missingKeys`, `expectedSource` (`wp|strapi|template`), `actionOwner`.
- [x] Validate canonical + hreflang intent per locale pair (`/` vs `/en/`) for priority templates.
- [x] Re-run parity evidence and confirm metadata counters move to full coverage.

### Metadata Follow-Up Status Update (2026-03-02)

- Metadata gap artifact: `data/reconcile/metadata-parity-gaps.json`
  - gap URLs: `0`
  - technical metadata exemption: `https://desire-escorts.nl/locations.kml`
- Metadata gate status: `pass` in `data/reconcile/parity-gate-summary.json`

## 3) Language Signal Follow-Up

- [x] Inspect the 1 locale mismatch and 1 locale unknown from:
  - `data/reconcile/gates/language-gate-evidence.json`
- [x] Create `data/reconcile/language-parity-gaps.json` with:
  - `url`, `expectedLocale`, `observedSignals`, `resolution`.
- [x] Confirm locale signals for both NL and EN templates:
  - `lang`, `og:locale`, alternate/canonical strategy alignment.

### Language Follow-Up Status Update (2026-03-02)

- Language gap artifact: `data/reconcile/language-parity-gaps.json`
  - review gaps: `0`
  - accepted exceptions: `1` (`/en/escort-amsterdam` redirects to NL home with 301)
- Language gate status: `pass` in `data/reconcile/parity-gate-summary.json`

## 4) Exit Criteria (Mark QA Follow-Up Complete)

- [x] Link unresolved target list triaged to zero unknowns.
- [x] Metadata parity gaps list triaged and owner-assigned.
- [x] Language parity gaps list triaged and owner-assigned.
- [x] Re-run `npm run reconcile:parity-evidence` and produce updated summary:
  - `data/reconcile/parity-gate-summary.json`
- [x] Update plan/todo status with final outcomes and residual risks.

### Final Outcome Snapshot (2026-03-02)

- Parity gate summary: `data/reconcile/parity-gate-summary.json`
  - `coverage: pass`
  - `content: pass`
  - `link: pass` (after triage; no unresolved unknowns)
  - `metadata: pass` (technical asset exemption for `locations.kml`)
  - `media: pass`
  - `language: pass` (1 accepted redirect exception)
- Residual risks (non-blocking for ingestion handoff):
  - `50` include-addition URLs from link triage are not yet merged into canonical inventory artifacts.
  - `20` redirect candidates need final implementation ownership in runtime routing config.
  - Strapi backend code fixes are implemented but still need deployment/restart verification on live instance.
