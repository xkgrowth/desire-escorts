---
name: Design System Setup (Desire Escorts)
overview: Establish a parity-safe, tokenized design system for Desire Escorts that modernizes visual consistency while preserving conversion-critical structure and SEO-safe template behavior across NL and EN routes.
todos:
  - id: p1-validate-inputs
    content: 1.1 Validate inputs (screenshots, brand palette, current logo/favicon usage, missing template states)
    status: completed
  - id: p1-brand-refresh-assets
    content: 1.2 Define and produce refreshed brand assets (new logo, animated logo variant, new favicon)
    status: completed
  - id: p1-template-audit
    content: 1.3 Build template inventory from migrated URL silos and map shared UI patterns
    status: completed
  - id: p1-guidelines-rule
    content: 1.4 Create design guideline rule file with tone, contrast, and component constraints
    status: completed
  - id: p2-color-tokens
    content: 2.1 Define color tokens (brand, semantic, and interactive state tokens)
    status: completed
  - id: p2-type-scale
    content: 2.2 Define typography tokens and locale-safe text rhythm for NL/EN
    status: completed
  - id: p2-spacing-depth
    content: 2.3 Define spatial and motion tokens (spacing, radii, elevation, borders, focus rings, transitions)
    status: completed
  - id: p2-grid-breakpoints
    content: 2.4 Define layout grid standards (containers, breakpoints, card-grid behavior)
    status: completed
  - id: p3-primitives
    content: 3.1 Build primitive UI components (buttons, typography, form controls, cards, badges, separators)
    status: completed
  - id: p3-layout-components
    content: 3.2 Build layout components (header, footer, mobile menu, breadcrumbs, locale toggle pattern)
    status: in_progress
  - id: p3-content-components
    content: 3.3 Build domain components (profile cards, listing controls, CTA strips, trust blocks)
    status: completed
  - id: p4-template-rollout
    content: 4.1 Execute template rollout in priority order without URL or metadata drift
    status: pending
  - id: p4-accessibility-pass
    content: 4.2 Run QA gates per batch (accessibility, responsiveness, and SEO/parity safety)
    status: pending
  - id: p5-docs-handoff
    content: 5.1 Complete documentation and handoff (token dictionary, component inventory, rollout checklist)
    status: pending
isProject: false
---

# Design System Setup Plan (Desire Escorts)

## Overview

This plan establishes a modern design system for the Next.js rebuild while respecting parity-first migration constraints.  
The target is visual consistency and maintainability, not arbitrary redesign drift.

**Project constraints considered:** NL default locale (`/`), EN under `/en/`, SEO-safe template behavior, parity-first launch governance.

---

## Inputs Already Available

- Brand assets in `public/brand/`:
  - `logo.svg` (legacy)
  - `favicon.png` (legacy)
  - `preview-image.jpg`
  - `heart.svg` (new static gold heart icon)
- Logo components in `app/components/`:
  - `desire-logo.tsx` (`DesireLogoStatic`, `DesireLogoAnimated`)
  - `shiny-heart.tsx` (`StaticHeart`, `ShinyHeart`)
- Dynamic favicon generation:
  - `app/icon.tsx` (32×32 PNG)
  - `app/apple-icon.tsx` (180×180 PNG)
- Color palette implemented in:
  - `app/globals.css`
  - `tailwind.config.ts`
  - `assets/brand/PALETTE.md`
- Typography:
  - Sora (700, 800) for headlines/logo
  - Inter for body copy
- Screenshot collection folder:
  - `assets/screenshots/`
- Animation system (framer-motion):
  - `app/components/ui/reveal.tsx` (scroll reveal animations)
  - `app/components/ui/stagger-container.tsx` (staggered animations)
  - `app/components/ui/hover-card-effect.tsx` (card hover effects)
- Layout primitives:
  - `app/components/ui/page-wrapper.tsx` (PageWrapper, Section, Container, Grid)
- Page gradient system:
  - CSS classes: `page-gradient`, `hero-glow`, `mid-glow`, `bottom-glow`, `bg-ambient-glow`
- Grid system:
  - 12-column CSS grid with responsive breakpoints
  - CSS classes: `grid-container`, `col-span-*`, `section`, `section-sm`
- Form controls:
  - `app/components/ui/input.tsx` (Input with icons, labels, error states)
  - `app/components/ui/select.tsx` (Select dropdown)
  - `app/components/ui/textarea.tsx` (Textarea)
  - `app/components/ui/checkbox.tsx` (Checkbox with custom styling)
- Card system:
  - `app/components/ui/card.tsx` (Card, CardHeader, CardContent, CardFooter)
- Domain components:
  - `app/components/domain/profile-card.tsx` (ProfileCard, ProfileCardCompact)
  - `app/components/domain/cta-section.tsx` (CTASection, CTABanner)
  - `app/components/domain/usp-bar.tsx` (USPBar, TrustBadges, StatsRow)

---

## What I Need From You

| Item | Description | Required |
| --- | --- | --- |
| Template screenshots | Desktop + mobile screenshots for key templates | Yes |
| Design intent | Confirm desired direction: premium-dark, cleaner hierarchy, reduced visual conflicts | Yes |
| New logo direction | Confirm visual direction and lockup variants for the refreshed logo | Yes |
| Logo animation direction | Confirm animation style (subtle loop, reveal, or hover-only) and usage contexts | Yes |
| Favicon direction | Confirm simplified mark for favicon and app-icon variants | Yes |
| Typography preference | Keep system font or switch to selected web font | Yes |
| Component decisions | Confirm button, card, form, and nav style directions after first pass | Yes |
| Final approval | Sign off token map and first template implementation before broad rollout | Yes |

---

## Phase 1: Foundations and Audit

**Goal:** Lock visual direction and prevent scope drift before component build.

### Step 1.1: Validate Inputs

- Verify screenshot set for:
  - Home
  - Listing pages
  - Profile detail
  - Blog index + post
  - Contact
  - Pricing
  - Services hub
  - Legal/license
- Confirm no missing template states (mobile menu, sticky actions, footer variants).

### Step 1.2: Brand Asset Refresh (Logo + Animation + Favicon)

- Design a refreshed logo system:
  - primary horizontal lockup
  - compact mark/icon variant
  - monochrome variants for dark/light surfaces
- Define and produce logo animation:
  - short intro/reveal version for hero/loading contexts
  - optional subtle loop/hover micro-animation for brand moments
  - export as web-safe formats (SVG/CSS or Lottie/WebM as appropriate)
- Design and export new favicon set:
  - `favicon.ico`
  - PNG sizes for app icons/social consistency where needed
- Map usage rules in brand documentation (where static vs animated logo is allowed).

### Step 1.3: Template and Pattern Inventory

- Convert URL/content silos into template groups.
- Identify shared UI patterns:
  - Header/footer/navigation
  - Card systems
  - CTA blocks
  - Trust/assurance modules
  - Content-rich editorial sections
- Define where visual modernization is allowed vs parity-sensitive.

### Step 1.4: Design Rule Baseline

- Create `.cursor/rules/design_guidelines.mdc` containing:
  - color usage rules
  - contrast/accessibility thresholds
  - spacing and hierarchy principles
  - do/don't examples for consistency

---

## Phase 2: Token System

**Goal:** Finalize reusable tokens before component implementation.

### Step 2.1: Color Tokens

- Keep brand palette fixed:
  - `#F2DE9B`, `#F7D063`, `#161E21`, `#161E21`, `#F5F4F3`
- Extend semantic tokens:
  - `background`, `foreground`, `surface`, `muted`, `border`, `ring`
  - interactive states (`hover`, `active`, `disabled`)
  - status tokens (`success`, `warning`, `error`, `info`) if needed

### Step 2.2: Typography Tokens

- Define heading/body scale optimized for NL and EN content lengths.
- Define weights, tracking, and line-height rules for dense content pages.

### Step 2.3: Spatial and Motion Tokens

- Define spacing scale usage rules.
- Define radius and shadow system.
- Define transition timings and motion constraints (subtle, premium, non-distracting).

### Step 2.4: Layout Grid Standards

- Set responsive container widths and section spacing.
- Document breakpoints and card-grid behavior for profile-heavy pages.

---

## Phase 3: Component System

**Goal:** Build reusable components to remove design conflicts across templates.

### Step 3.1: Primitive UI Components

- Buttons, typography primitives, form controls, badges, cards, separators.
- Include required states (hover/focus/disabled/error/loading).

### Step 3.2: Layout Components

- Header, footer, mobile menu, breadcrumbs, locale toggle pattern.
- Ensure consistency for NL/EN route behavior and internal linking UX.

### Step 3.3: Domain Components

- Profile card variants (list/grid/featured).
- Listing page filter/sort controls (if applicable).
- CTA and trust blocks used across commercial pages.

---

## Phase 4: Template Rollout

**Goal:** Apply system to templates with low risk and high consistency.

### Step 4.1: Rollout Order

1. Global shell (header/footer/nav)
2. Home template
3. Listing templates
4. Profile detail
5. Contact/pricing/services
6. Blog index and post
7. Legal/license and remaining long-tail pages

### Step 4.2: QA Gates Per Batch

- Visual consistency against token rules
- Mobile responsiveness and interaction states
- Accessibility contrast/focus checks
- No metadata/canonical/hreflang behavior regressions
- No URL structure drift

---

## Phase 5: Documentation and Handoff

**Goal:** Make design decisions repeatable and enforceable.

### Step 5.1: Documentation and Handoff Deliverables

- Publish token dictionary and usage matrix.
- Publish component inventory with ownership and status.
- Add implementation checklist for future template migrations.
- Capture deferred enhancements as post-launch backlog.

---

## Deliverables

- Refreshed brand assets:
  - new `logo.svg` (+ optional compact logo/mark)
  - animated logo asset(s) and usage guidance
  - new `favicon.ico` and icon variants
- `app/globals.css` tokenized foundation
- `tailwind.config.ts` semantic color mapping
- `.cursor/rules/design_guidelines.mdc`
- `.cursor/plans/DESIGN_SYSTEM_COMPONENT_INVENTORY.md`
- Reusable component library under `app/components/`
- Updated templates in phased rollout

---

## Risks and Mitigations

- **Risk:** Over-redesign breaks parity expectations  
  **Mitigation:** Enforce template-level parity constraints and staged approvals.

- **Risk:** Dark palette causes contrast/readability issues  
  **Mitigation:** WCAG contrast checks and explicit foreground/surface token rules.

- **Risk:** Inconsistent component usage across pages  
  **Mitigation:** Component inventory + documented usage rules + PR checklist.

