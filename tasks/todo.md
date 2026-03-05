# WPML Export Enablement

# Design System Refinement Pass

- [x] Update clickable surface color to `#141A1B` and wire to interactive card styles.
- [x] Replace fully rounded CTA corners in nav/small CTA contexts with luxury radius.
- [x] Reduce `GradientTitle` XL scale for H1 usage.
- [x] Switch all Live Chat CTAs to Premium (White) button variant.
- [x] Remove olive-toned backgrounds from elevated/stagger/blur/enhanced-hover design-system blocks.
- [x] Run lint diagnostics on touched files and resolve regressions.

## Review Notes (Design System Refinement Pass)

- Added `--surface-interactive` token (`#141A1B`) and new `.card-interactive` utility for clickable cards.
- Updated design-system demo blocks (Stagger, Blur Reveal, Enhanced Hover, interactive cards) to avoid olive surfaces.
- Reduced `GradientTitle` XL scale by one step across breakpoints.
- Switched all visible Live Chat CTA buttons to `premium` (white) variant in header/footer/profile/CTA sections.
- Standardized CTA corners from `rounded-full` to `rounded-luxury` in nav/hero/detail CTA contexts.

# Homepage Content Enrichment (C2 refinement)

- [x] Expand homepage with additional Dutch SEO/AEO-supporting body content blocks.
- [x] Add "Hoe werkt boeken" conversion explainer section.
- [x] Add trust/discretion context section to strengthen authority signals.
- [x] Refine location messaging to nationwide coverage (not per-city fixed escorts).
- [x] Add knowledge/continuation links for deeper internal navigation.

## Review Notes (Homepage Content Enrichment)

- Homepage moved from thin visual baseline to richer intent-supporting structure.
- Added multiple scannable sections without overloading above-the-fold.
- Messaging keeps non-exclusive brand positioning and NL-first language.
- Location block now explicitly states nationwide flexible availability.
- Follow-up refinement re-anchored profile cards directly under hero and added stronger visual split.
- Added explicit `escort amsterdam` supporting mentions on homepage without changing city-page ownership.
- Added mandatory content-source mix rule in `.cursor/rules/CONTENT_SPECIFICATIONS.mdc` for all templates.
- Added mandatory template workflow to check `data/search-console`, scraped legacy content, and strategy docs before writing any scaled template copy.

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

# Phase 4 Template Rollout

## Phase A: Content Specification Expansion

- [x] Add Escorts Overview Page specification
- [x] Add Services Overview Page specification
- [x] Add Types Overview Page specification
- [x] Add Location Overview Page specification
- [x] Add Blog Overview Page specification
- [x] Add Knowledge Centre Overview Page specification
- [x] Add Knowledge Centre Detail Page specification
- [x] Add FAQ Page (Standalone) specification
- [x] Add Contact Page specification
- [x] Add Rates Page specification
- [x] Add Legal/License Page specification

## Review Notes (Phase A)

- Expanded `CONTENT_SPECIFICATIONS.mdc` with 11 new page type specifications.
- All overview/listing pages now have defined structure: hero, grid/list, filters, CTAs.
- Utility pages (FAQ, Contact, Rates, Legal) have complete section breakdowns.
- Each spec includes target metrics, required sections, SEO requirements, and content guidelines.
- Knowledge Centre uses two-level spec (Overview + Detail) for FAQ-style article hub.

## Phase B: Component Gap Fill

- [x] Build Breadcrumbs component (`ui/breadcrumbs.tsx`)
- [x] Build FilterBar component (`domain/filter-bar.tsx`)
- [x] Build PricingTable component (`domain/pricing-table.tsx`)
- [x] Build ArticleCard component (`domain/article-card.tsx`)
- [x] Build LegalSection component (`domain/legal-section.tsx`)
- [x] Add showcases to design system page

## Review Notes (Phase B)

- **Breadcrumbs**: Full variant with schema.org markup, compact "back" variant for mobile.
- **FilterBar**: URL-based filtering with dropdowns, multi-select support, active filter pills. Compact variant uses native selects.
- **PricingTable**: Table and cards variants, PricingFeatures checklist, PaymentMethods display.
- **ArticleCard**: 4 variants (default, featured, horizontal, compact) + ArticleCategoryCard for knowledge centre.
- **LegalSection**: Full legal document system with ToC, sections, subsections, highlights, contact blocks, and related documents.

## Phase C: Template Implementation

- [x] C.1 Update global shell (header/footer with dynamic nav, breadcrumbs slot)
- [x] C.2 Implement Homepage template with optimized content
- [x] C.3 Implement Escorts Overview + Detail templates
- [ ] C.4 Implement Location, Types, Services templates (overview + detail)
- [ ] C.5 Implement Blog + Knowledge Centre templates
- [ ] C.6 Implement utility pages (FAQ, Contact, Rates, Legal)

## Review Notes (Phase C.2 + C.3)

- Homepage copy now blends Search Console opportunity terms with legacy intent blocks and updated brand constraints.
- Clickable tile styling is standardized to elevated interactive treatment for consistency across sections.
- Added `app/escorts/page.tsx` as Escorts Overview template with hero, filter bar, listing grid, FAQ, and CTA.
- Added `app/escort/[slug]/page.tsx` as Escort Detail template with profile hero, attributes/services, related profiles, FAQ, and CTA.

## Review Notes (Phase C.1 - Global Shell)

- Created `lib/navigation.ts` as single source of truth for all navigation config.
- Updated `SiteHeader`: active state detection via `usePathname()`, improved accessibility with ARIA attributes.
- Updated `SiteFooter`: dynamic year, shared nav config, bilingual support.
- Created `PageLayout`, `PageHero`, `PageSection` components for consistent page structure.
- Added `generateBreadcrumbsFromPath` helper for automatic breadcrumb generation.
- Language toggle now uses actual route-based locale switching.

# Escorts Filter Mechanic Rebuild

- [x] Add hydration-safe filter context with localStorage persistence.
- [x] Implement pure filtering engine + option/count derivation utilities.
- [x] Build desktop `FilterPanel` + mobile `MobileFilterModal` with shared behavior.
- [x] Integrate filter flow into `/escorts` overview with live filtered count.
- [x] Add unit tests for filter logic and integration test for dynamic count updates.
- [x] Run lint/tests and fix any regressions.

## Review Notes (Escorts Filter Mechanic Rebuild)

- Implemented new filter architecture under `src/` with `FilterProvider`, pure filter engine, and facet-aware dynamic counts.
- Replaced `/escorts` list rendering with client `OverviewContent` integration so counts and gallery update live without URL hydration drift.
- Added shared filter controls used by both desktop panel and mobile modal to keep behavior consistent.
- Added test setup with Vitest + Testing Library.
- Added filter unit tests and a hook-level integration test validating live count updates after filter interaction.

## Review Notes (Filter Design Alignment)

- Updated filter controls to match design interaction model: dual-range sliders for age, height, and cup size.
- Replaced multi-select checkbox groups with single-select dropdowns (`All` + options) for build type, services, hair color, and eye color.
- Added design-aligned "Refine your search" labeling and reset button placement in shared controls so desktop/mobile remain behavior-identical.
- Preserved existing filtering data flow and dynamic count recalculation from active dataset.

# Glass Template Hero (Design System)

- [x] Create reusable compact non-home hero component with layered glass card effect.
- [x] Include required content slots: breadcrumbs, title, short description, compact horizontal USP row.
- [x] Add design-system showcase block for visual QA and spacing validation.
- [x] Extend USP bar horizontal mode to support start alignment for hero usage.
- [x] Run lint diagnostics on updated files and resolve any issues.

# Global Ambient Gradient System (Sitewide)

- [x] Add fixed global ambient layer for top and bottom glows.
- [x] Re-enable and redesign page-level ambient layer for 33% left and 66% right glows.
- [x] Tune color/opacity tokens to match design inspiration while preserving readability.
- [x] Run lint diagnostics on touched files and resolve regressions.
- [x] Removed all gradient implementations per user request — will revisit with different approach.

## Review Notes (Global Ambient Gradient System)

- Multiple iterations attempted (fixed viewport layer, content-anchored layer, simplified ellipse gradients).
- Removed all gradient implementations — ambient color tokens retained in CSS for future use.
- Layout reverted to simple structure without ambient wrapper layers.
- Header styling reverted to original opacity/blur values.

# Strapi Language Backfill (Profiles)

- [x] Inspect historical product-attributes CSV and extract `talen` row mapping by profile slug.
- [x] Validate mapping coverage against current 55 Strapi profiles.
- [x] Apply bulk language relation updates to all Strapi profiles using writable token.
- [x] Verify all profiles have populated `languages` relation post-update.

## Review Notes (Strapi Language Backfill)

- CSV mapping covered 53/55 current profile slugs directly; `miki` and `lunnie` were not present in CSV and were set to `Engels` fallback.
- Bulk update was performed against Strapi documentId endpoint (`/api/profiles/{documentId}`), which this instance requires for writes.
- Final verification confirms 55/55 profiles now have populated `languages`.

# Escort Detail Strapi + ProfileHero Alignment

- [x] Replace `/escort/[slug]` mock data lookup with Strapi `getProfileBySlug`.
- [x] Replace legacy detail hero markup with `ProfileHero` component.
- [x] Map Strapi profile fields (photos/bio/attributes/services/languages/contact) to `ProfileHero` props.
- [x] Replace related profiles from mock data with Strapi `getProfiles` mapping.
- [x] Run lint diagnostics on updated route file.

## Review Notes (Escort Detail Strapi + ProfileHero Alignment)

- Detail route now fetches profile and related cards from Strapi via `lib/api`.
- Route now renders `ProfileHero`, so `/escort/brianna` uses the same design-system hero component as requested.
- Added value normalization for display labels (services/languages) and Strapi enum mapping for posture.
