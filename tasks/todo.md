# WPML Export Enablement

# Utility Page: Hoe Het Werkt (`/escort-bestellen/`)

- [x] Create `app/escort-bestellen/page.tsx` with SEO-safe metadata, canonical, and NL/EN alternates.
- [x] Implement conversion-focused page structure (hero, process steps, trust/payment, FAQ, CTA).
- [x] Add JSON-LD for `HowTo`, `FAQPage`, and `BreadcrumbList`.
- [x] Preserve legacy intent and key internal links (`/alle-escorts`, `/contact`, `/first-time-experience`).
- [x] Add navigation exposure for the new route in header/footer link maps.
- [x] Run lint diagnostics on touched files and resolve any regressions.

## Review Notes (Hoe Het Werkt)

- Built the page on the legacy slug `/escort-bestellen/` to preserve URL continuity.
- Reused existing UI components (`TemplateHeroGlass`, `HowToSteps`, `FAQ`, `CTASection`) for consistency and lower implementation risk.
- Structured the page around a clear 6-step booking flow adapted from the legacy content with stronger clarity on discretion and payment transparency.

# FAQ Standalone Page (`/faq`)

- [x] Add dedicated FAQ route with grouped category accordions sourced from shared FAQ data.
- [x] Add FAQPage + Breadcrumb JSON-LD schema and SEO metadata (canonical + hreflang).
- [x] Add bottom contact CTA section for unanswered questions.
- [x] Reserve `faq` in root dynamic slug exclusions to avoid route collisions.
- [x] Run lint diagnostics for touched FAQ files.

## Review Notes (FAQ Standalone Page)

- Implemented `app/faq/page.tsx` as a standalone FAQ collection page aligned with the Kennisbank categories.
- Added direct links from each FAQ category block to its corresponding Kennisbank category archive.
- Appended the existing reusable contact CTA block beneath the FAQ collection for follow-up questions.

# Homepage Above-the-Fold USP Repositioning

- [x] Move 4 primary USPs into the homepage hero area, directly under CTA buttons.
- [x] Keep hero USPs compact (icon + short label) with a mobile-friendly 2x2 layout.
- [x] Remove duplicate lower USP strip to avoid repeated messaging.
- [x] Reframe the "Waarom bezoekers..." card as proof/context instead of repeating the same 4 USPs.
- [x] Run lint diagnostics on touched homepage files.

## Review Notes (Homepage Above-the-Fold USP Repositioning)

- Hero now carries the 4 trust USPs above the fold to restore immediate conversion cues.
- Lower dedicated USP section was removed to reduce repetition and improve section pacing.
- Intro right-hand proof card now supports the hero message with trust/process details.
- Lint diagnostics are clean for `app/page.tsx` and `app/components/domain/homepage-hero.tsx`.

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
  - [x] C.6.1 Implement standalone FAQ page (`/faq/`) (NL)
  - [x] C.6.2 Implement Contact page
  - [x] C.6.3 Implement Rates page (`/prijzen/`)
  - [ ] C.6.4 Implement Legal pages

## Review Notes (Contact Page)

- Implemented `app/contact/page.tsx` with hero, direct contact methods (phone/WhatsApp/email), compact contact FAQ, and final contact CTA.
- Added explicit self-service links to `/faq` and `/kennisbank` to support users who prefer finding answers before contacting.
- Added `ContactPage` and `FAQPage` JSON-LD plus canonical/hreflang metadata for technical SEO parity.

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

# Location Overview Template Parity (`/escort-in-nederland`)

- [x] Build location overview route at legacy URL `app/escort-in-nederland/page.tsx`.
- [x] Implement required sections (hero, primary city grid, grouped location links, coverage block, CTA).
- [x] Add page metadata + canonical + NL/EN alternates for parity-safe SEO.
- [x] Add ItemList JSON-LD schema for location links.
- [x] Replace `/locaties` navigation/footer/home links with `/escort-in-nederland`.
- [x] Run lint diagnostics on touched files and resolve regressions.

## Review Notes (Location Overview Template Parity)

- Implemented the first Batch C.4 location overview template on the preserved legacy slug rather than introducing a new `/locaties` route.
- Navigation and key internal links now point to `/escort-in-nederland` to keep local and production URL structure aligned.
- Content follows Location Overview spec with concise, scan-friendly blocks and clear city-page routing intent.

# Location Detail Template (Haarlem + Amstelveen)

- [x] Build reusable location detail template component with hero, high-priority contact box, top profiles, FAQ, hotels, quote, crosslinks, and blog section.
- [x] Build city data model for location pages and populate `escort-haarlem` and `escort-amstelveen`.
- [x] Use scraped legacy facts for speed/price/hotels/FAQ and trim to concise, intent-focused content blocks.
- [x] Add production-parity routes at `app/escort-haarlem/page.tsx` and `app/escort-amstelveen/page.tsx`.
- [x] Add per-page metadata with canonical and locale alternates.
- [x] Run lint diagnostics on touched files and resolve regressions.

## Review Notes (Location Detail Template)

- Template follows location-page section order while avoiding long filler blocks from legacy.
- Hero title format is standardized to `Escort Service in [city]` and speed/pricing is surfaced in the opening summary.
- Contact box is placed high with Live Chat + WhatsApp only, matching current page patterns.
- Top profile block is driven by Strapi sort priority (`getProfiles()` ordering + availability).

# Template Scroll/Load Animation Rollout

- [x] Add scroll reveal wrappers to homepage sections and key card grids.
- [x] Add reveal/stagger animations to escorts overview (hero, listing, CTA, FAQ).
- [x] Add reveal/stagger animations to escort detail (hero, related profiles, FAQ, CTA).
- [x] Add reveal/stagger animations to location overview (`/escort-in-nederland`).
- [x] Add reveal/stagger animations to reusable location detail template (hero + all major content blocks).
- [x] Validate touched files with linter diagnostics.

## Review Notes (Template Scroll/Load Animation Rollout)

- Reused existing `ScrollReveal`, `StaggerContainer`, and `StaggerItem` primitives for consistency with design-system patterns.
- Animations are now present on all currently built templates plus the in-progress location detail template component, so new city pages inherit motion automatically.
- Grid/list-heavy sections use staggered reveal while structural blocks (hero/CTA/FAQ/content cards) use single reveal wrappers.
- Refined the top contact-right panel to metric labels (`Servicetijd`, `Prijs vanaf`, `Minimale afname`) with highlighted values.
- Switched blog section to visual cards with images and removed redundant bottom CTA block.
- Added support for two location image slots per city and wired both image placements in the template.
- Expanded location FAQ datasets to include more legacy questions while keeping concise answers.
- Added `desire-escorts.nl` as an allowed Next.js image domain for scraped location assets.

# Global Glow Orbs Layer (Second Pass)

- [x] Create reusable `GlowOrbs` background component with subtle gold radial orbs.
- [x] Add top-left and bottom-right anchor orbs plus alternating middle orbs.
- [x] Integrate `GlowOrbs` in root layout behind all page content with safe z-index layering.

# Rates Page + Pricing Dataset

- [x] Parse legacy `prijzen` Firecrawl markdown into structured province/city pricing data.
- [x] Parse location-page topline pricing statements into slug-level estimate dataset.
- [x] Add shared pricing data module for reuse in rates and location templates.
- [x] Implement `app/prijzen/page.tsx` with province summary, city tables, payment and cancellation notes, FAQ, and CTA.
- [x] Validate touched files with lint diagnostics and resolve regressions.

## Review Notes (Rates Page + Pricing Dataset)

- Legacy pricing content is centralized in `lib/data/location-pricing.ts` for a single source of truth.
- Dataset now includes province-level pricing tables and slug-level location estimates for 250 scraped location slugs.
- New rates page uses the dataset directly, so extending location pages can reuse the same estimate mapping (`getLocationPricingEstimateBySlug`).
- `/tarieven` now redirects to `/prijzen` to preserve live URL parity and avoid internal route drift.
- Added `lib/data/province-pricing.ts` to guarantee all 12 provinces are rendered on `/prijzen`, with fallback rows from existing location pages where legacy province tables were missing.

# Location Search Estimator (No API)

- [x] Validate CBS dataset structure (`WoonplaatsenCodes.csv` + `Observations.csv`) for woonplaats -> provincie mapping.
- [x] Add local parser/cache (`lib/data/nl-places.ts`) to load Dutch places from the dataset directory without API calls.
- [x] Build `/prijzen` location search estimator that resolves exact city matches to location-page pricing and falls back to province-level lowest combo.
- [x] Surface result UX with suggestion chips and clear fallback messaging for towns without location pages.

## Review Notes (Location Search Estimator)

- Uses local CBS files only (no external API), with optional directory override via `CBS_WOONPLAATSEN_DATASET_DIR`.
- Exact matches return city-level estimate + location page link when available.
- Unknown-to-site places still return estimate via their province minimum combo, preserving conversion intent.

# Blog + Author Template Rollout

- [x] Create reusable WordPress blog data layer (normalize content, dates, images, read time).
- [x] Implement `/blog` overview page using normalized posts.
- [x] Implement blog detail template on legacy root slug with author/date/read-time/sidebar.
- [x] Implement `/author/julian-van-dijk/` author page and connect byline links.
- [x] Run lint diagnostics on all touched files and fix regressions.

## Review Notes (Blog + Author Template Rollout)

- Added `lib/data/blog-posts.ts` to normalize NL WordPress post exports into reusable blog objects with decoded titles, read time, first-image extraction, and author mapping.
- Implemented `/blog` overview in `app/blog/page.tsx` with featured post + article grid using existing `ArticleCard` component variants.
- Implemented root-level blog detail route in `app/[slug]/page.tsx` with strict blog-slug lookup, byline metadata, and a sticky sidebar for navigating to other posts.
- Implemented `/author/julian-van-dijk/` in `app/author/[slug]/page.tsx` with author bio and a list of authored posts.
- Added scoped migrated-post styling in `app/globals.css` (`.blog-post-content`) so WordPress HTML renders clearly while preserving internal links and inline images.
- Lint diagnostics pass cleanly; full production build currently fails due an existing unrelated type issue in `lib/api/normalize.ts`.

# Service/Type Detail Scaling Pass

- [x] Make profile-card logic resilient (filter first, fallback second, no hard failure on Strapi outage).
- [x] Scale `anale-seks` content pattern to all service/type detail pages via shared extraction (SEO title, benefits, pricing, trust signals).
- [x] Ensure fallback profile title becomes generic when no specific matches exist.
- [x] Validate key detail pages (`/anale-seks`, `/trio-escorts`, `/shemale-escort`, `/goedkope-escorts`, `/studenten-escort`, `/bdsm-escorts`) locally.

# Knowledge Centre Templates (C.5.3 + C.5.4)

- [x] Build normalized BetterDocs data layer from `data/wordpress/knowledge-centre`.
- [x] Implement `/kennisbank/` overview page with grouped categories and doc links.
- [x] Implement `/kennisbank/[category]/[slug]/` detail template with breadcrumb, article body, and related links.
- [x] Ensure canonical URLs and route slugs match exported legacy structure.
- [x] Remove D.2 from phase rollout plan list and mark C.5.3/C.5.4 complete after validation.
- [x] Run lint diagnostics on touched files and resolve regressions.

## Review Notes (Knowledge Centre Templates)

- Added `lib/data/knowledge-centre.ts` to parse BetterDocs CSV exports directly, normalize category/article records, and generate deterministic route paths.
- Implemented Knowledge Centre overview route at `app/kennisbank/page.tsx` with category-based article grouping and direct question links.
- Implemented dynamic detail route at `app/kennisbank/[category]/[slug]/page.tsx` with breadcrumb JSON-LD, article rendering, TOC anchors, and related links.
- Updated phase rollout plan to remove D.2 and mark C.5.3/C.5.4 complete.
- Lint passes with no warnings/errors after the implementation.

# Knowledge Centre Category Template

- [x] Build category route template at `/kennisbank/[category]/` for curated per-category docs.
- [x] Restore category canonical path usage in knowledge data mapping and breadcrumb links.
- [x] Add metadata + schema for category archives.
- [x] Run lint diagnostics on touched files and resolve regressions.

## Review Notes (Knowledge Centre Category Template)

- Added `app/kennisbank/[category]/page.tsx` to render dedicated category archive pages (e.g. `/kennisbank/discretie-veiligheid/`) with curated article cards.
- Left column now surfaces all categories with active-state highlighting and per-category document counts.
- Category page includes page metadata and `ItemList` JSON-LD for discoverability.
- Restored `categoryPath` mapping in `lib/data/knowledge-centre.ts` to real archive paths for consistent breadcrumb/category linking.

# Knowledge Detail UX Refinements

- [x] Align detail-page sidebar behavior with category-page style while supporting nested article lists.
- [x] Keep current category expanded by default and allow opening other categories inline.
- [x] Add smooth-scroll TOC interaction for section links on detail pages.
- [x] Validate touched files with lint diagnostics.

## Review Notes (Knowledge Detail UX Refinements)

- Added `KnowledgeCategorySidebar` client component to power expandable category navigation with nested docs and active doc highlighting on detail pages.
- Added `KnowledgeToc` client component to replace jump links with smooth animated scrolling.
- Added heading scroll offset (`scroll-margin-top`) in `app/globals.css` so smooth TOC scroll lands below sticky UI.
