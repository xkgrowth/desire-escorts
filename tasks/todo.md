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

# Phase 3 Design System Kickoff

- [x] Persist approved brand color palette as project tokens in `app/globals.css` and `tailwind.config.ts`.
- [x] Store palette intent document at `assets/brand/PALETTE.md`.
- [x] Create Desire-specific design system implementation plan at `.cursor/plans/design_system_setup.plan.md`.
- [x] Create design guidelines rule file at `.cursor/rules/design_guidelines.mdc` with visual direction, typography, and component specs.
- [x] Extract and integrate new animated logo components from `logo-v0` prototype.
- [x] Create `app/components/shiny-heart.tsx` (static + animated heart icon).
- [x] Create `app/components/desire-logo.tsx` (static + animated logo variants).
- [x] Set up dynamic favicon generation via `app/icon.tsx` and `app/apple-icon.tsx`.
- [x] Export static heart SVG to `public/brand/heart.svg`.
- [x] Update `SiteHeader` to use always-animated logo.
- [x] Configure Sora + Inter fonts in layout for logo typography.

## Phase 3.1 Design System Build

- [x] Add gradient utilities to `globals.css` (ambient glow, title gradients, section dividers, button styles).
- [x] Extend `tailwind.config.ts` with design tokens (radii, shadows, fonts, transitions).
- [x] Create `lib/utils.ts` with `cn()` class merge utility.
- [x] Create `GradientTitle` typography component (gold/light variants, multiple sizes).
- [x] Create `Button` component (3D bevel primary, secondary, ghost variants).
- [x] Create `Badge` component (verified, vip, service variants).
- [x] Create `SiteHeader` layout component (desktop nav, dropdowns, mobile toggle, language switcher, CTAs).
- [x] Create `MobileMenu` component (accordion nav, mobile CTAs).
- [x] Create `SiteFooter` layout component (contact CTA section, link columns, trust signals, bottom bar).
- [x] Create `/design-system/` showcase page.
- [x] Validate build passes with all new components.

## Phase 3.2 Grid, Gradients, and Animations

- [x] Install `framer-motion` for scroll and hover animations.
- [x] Add page-level gradient CSS utilities (hero-glow, mid-glow, bottom-glow, page-gradient).
- [x] Add 12-column grid system CSS utilities (grid-container, column spans, section spacing).
- [x] Create `PageWrapper`, `Section`, `Container`, `Grid` layout components.
- [x] Create `Reveal` scroll animation component (fade, slideUp, slideLeft, slideRight, scale, blur variants).
- [x] Create `StaggerContainer` and `StaggerItem` for staggered reveal animations.
- [x] Create `HoverCardEffect` for interactive card hover states.
- [x] Update `/design-system/` page with gradient, grid, and animation showcases.
- [x] Validate build passes with animation system.

# Strategy Alignment — Amsterdam Intent Routing

- [x] Update keyword strategy to define shared homepage support + city page ownership for `escort amsterdam`.
- [x] Update content specifications with explicit city-vs-district URL hierarchy (`/escort-amsterdam/` vs `/escort-amsterdam-centrum/`).
- [x] Update migration strategy decision rules to restore dedicated city pages if currently redirected to homepage.
- [x] Update action plan batches and redirect matrix with Amsterdam intent normalization steps.
- [x] Update SEO and architecture rules to enforce intent-to-URL ownership.

## Review Notes (Strategy Alignment)

- Final mapping is now explicit across strategy docs:
  - Homepage supports `escort amsterdam` as secondary high-authority traffic capture.
  - `/escort-amsterdam/` is the canonical city-intent landing page (`200`, indexable).
  - `/escort-amsterdam-centrum/` is a district long-tail page and should not own the city head term.

# Phase 3.3 Homepage Hero Design Block

- [x] Build a reusable full-bleed homepage hero component for the design system.
- [x] Add left hero content block (badge, callout title, short description, two CTAs).
- [x] Add dynamic right-side avatar cluster driven by currently available profiles.
- [x] Implement avatar interactions (click to show mini profile card + profile CTA).
- [x] Replace fold-bottom logo strip with top-30%-profiles compact card strip.
- [x] Wire the new hero showcase into `app/design-system/page.tsx`.
- [x] Run lint checks for changed files and fix issues if introduced.

## Review Notes (Phase 3.3)

- Added `HomepageHero` in `app/components/domain/homepage-hero.tsx` as a reusable hero block.
- Hero includes left-side badge/title/description and dual CTAs (`All Escorts`, `Explore Our Services`).
- Right-side cluster now animates available avatars with staggered pop-in and subtle float motion.
- Avatar clicks reveal a mini profile card with direct profile navigation.
- Fold-bottom content now shows top 30% compact profile cards instead of logo strip.
- Added `HomepageHeroShowcase` in `app/design-system/components.tsx` and wired it in `app/design-system/page.tsx`.
- Lint diagnostics report no errors for updated files.
- Adjusted `app/design-system/animated-sections.tsx` to render content visible on SSR (`initial={false}`) to avoid blank-looking page during hydration hiccups.
- Updated hero presentation to true full-bleed and changed fold-bottom preview to cropped full `ProfileCard` tops so the next listing section is visually introduced in the first fold.
- Constrained hero content to grid system (`max-w-7xl`) while keeping background full-bleed.
- Added pulsing green dot to "X currently available" badge on right side.
- Added pulsing green availability dots to floating avatars.
- Implemented 5-second auto-rotation of highlighted profile; stops when user manually clicks an avatar.
