# CONTENT MIGRATION ACTION PLAN

Generated: 2026-03-02
Scope: Phase 1 parity-first migration execution handoff

## Current Evidence Snapshot

- Canonical inventory: `781` URLs (`NL 392`, `EN 389`)
- URL decision manifest: `include 781`, `review 0`, `exclude 0`
- Firecrawl rendered coverage: `781/781` URLs extracted
- Strapi authority rule: profile URLs under `/escorts/*` and `/en/escorts/*` are Strapi-led

## Batch Plan (Route-by-Route)

### Batch 1 — Core Template Routes (highest business impact)

- Home, contact, service hubs, listing pages, legal pages
- Representative patterns:
  - `/`, `/en`
  - `/contact`, `/en/contact`
  - `/alle-escorts`, `/en/escorts`
  - `/blog`, `/en/blog`

### Batch 2 — Profile Detail Routes (Strapi authority, URL parity)

- All profile detail pages:
  - `/escorts/:slug`
  - `/en/escorts/:slug`
- Enforce host-based site scoping (`x-forwarded-host`) parity behavior.

### Batch 3 — Blog Posts and Knowledge Content

- All post-like informational pages and knowledge routes captured in inventory.
- Include both indexed and deep internal-link content discovered during full render extraction.

### Batch 4 — Location and Long-Tail Landing Pages

- City/location and service modifier landing pages.
- Preserve URL and metadata intent exactly for Phase 1 parity.

### Batch 5 — Technical Assets and Edge URLs

- Include technical parity assets (for example `locations.kml`) as reachable endpoints.
- Validate behavior as static asset/route response parity, not page-template parity.

## Component/Template Mapping by Page Type

- **Core pages** -> Next.js static/ISR templates from WordPress source fields + Firecrawl rendered checks.
- **Profile listing/detail** -> Next.js templates backed by Strapi profile APIs (`/api/profiles`, `/api/profiles/:id`).
- **Blog/knowledge** -> Next.js content templates keyed by canonical URL, with metadata parity checks.
- **Technical assets** -> file/route-level parity handling outside normal content templates.

## Field Mapping (WordPress/Firecrawl -> Next.js/Strapi)

- **Profiles**
  - Runtime source: Strapi only (authoritative).
  - WordPress product/profile-like references: fallback comparison only.
  - URL intent remains legacy path parity.
- **Pages/Posts**
  - Primary source: WordPress API exports (`data/wordpress/**`).
  - Parity validation source: Firecrawl rendered markdown + metadata.
- **Links/Media**
  - Firecrawl links/images used for retention and broken-reference checks.

## Redirect Matrix (Only If Required)

- Current target: no planned broad URL changes.
- Redirect candidates should only be created if:
  - legacy slug cannot be represented in Next.js route structure, or
  - legacy URL intentionally retired after explicit approval.
- Current unresolved internal-link targets are tracked in:
  - `data/reconcile/gates/link-gate-evidence.json`

## QA Checklist Per Batch

- **Content parity**
  - Heading/body parity against rendered extraction for sampled URLs.
- **Links parity**
  - Internal links resolve to included canonical targets.
- **Metadata parity**
  - Title, description, robots, canonical/hreflang behavior align with legacy intent.
- **Language parity**
  - NL (`/`) and EN (`/en/`) mapping preserved.
- **Media parity**
  - No broken critical media for migrated pages.
- **Routing parity**
  - URL reaches intended template/data source without unexpected redirect chain.

## Owners, Effort, Dependencies, Acceptance

- **Owner (Engineering)**: Next.js migration implementation
- **Owner (Content/SEO QA)**: parity verification and signoff
- **Owner (Backend/Strapi)**: profile endpoint behavior and deployment

- **Dependencies**
  - Strapi backend fixes deployed for:
    - `/api/profiles/health` read-only behavior
    - `/api/profiles/filters` invalid field query path
  - Existing ingestion artifacts retained as source-of-truth evidence.

- **Effort estimate**
  - Batch 1: Medium
  - Batch 2: Medium-High
  - Batch 3: High
  - Batch 4: High
  - Batch 5: Low

- **Acceptance criteria**
  - `include/review/exclude` manifest remains fully resolved with no open review URLs.
  - URL parity retained for all included routes.
  - Profile routes are served from Strapi data with expected host scoping.
  - Metadata/link/media/language gates have explicit pass/review outcomes and remediation notes.
  - Handoff artifacts remain reproducible from scripted pipeline in this repo.
