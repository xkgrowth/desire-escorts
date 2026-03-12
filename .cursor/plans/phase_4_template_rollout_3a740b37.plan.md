---
name: Phase 4 Template Rollout
overview: Execute template rollout in priority order without URL or metadata drift, applying the design system consistently across all page types while maintaining SEO parity and conversion-critical structure.
todos:
  - id: p4-global-shell
    content: 4.1 Apply design system to global shell (header/footer/nav) with NL/EN locale support
    status: pending
  - id: p4-live-chat-widget
    content: 4.2 Setup live chat widget integration (connect existing chat buttons to chat service, configure widget behavior, test on mobile/desktop)
    status: pending
  - id: p4-home-template
    content: 4.3 Apply design system to home template with optimized content structure
    status: pending
  - id: p4-listing-templates
    content: 4.4 Apply design system to listing templates (escorts overview, locations, attributes, services, types)
    status: pending
  - id: p4-profile-detail
    content: 4.5 Apply design system to profile detail template with Strapi integration
    status: pending
  - id: p4-content-pages
    content: 4.6 Apply design system to content pages (contact, pricing, services detail, blog index/post, knowledge centre)
    status: pending
  - id: p4-legal-pages
    content: 4.7 Apply design system to legal/license pages and remaining long-tail pages
    status: pending
  - id: p4-qa-gates
    content: 4.8 Run QA gates per batch (accessibility, responsiveness, SEO/parity safety, metadata validation)
    status: pending
  - id: p4-live-chat-widget-d11
    content: D.11 Setup live chat widget integration (connect existing chat buttons to chat service, configure widget behavior, test on mobile/desktop)
    status: pending
isProject: false
---

# Phase 4: Template Rollout Plan

## Overview

This plan executes the template rollout phase, applying the established design system consistently across all page types while maintaining strict SEO parity and conversion-critical structure. The rollout follows a priority order that minimizes risk and ensures consistency.

**Key constraints:**
- No URL structure changes
- No metadata drift from legacy
- Preserve high-value internal linking pathways
- Maintain NL/EN locale routing (`/` and `/en/`)
- Follow Content Specifications for page structure
- Apply design tokens consistently

---

## Phase 4.1: Global Shell (Header/Footer/Nav)

**Goal:** Establish consistent global navigation and layout foundation.

### Tasks

- Apply design system tokens to header component
- Apply design system tokens to footer component  
- Ensure mobile menu follows design system patterns
- Implement locale toggle with proper NL/EN routing
- Verify breadcrumb component styling
- Test responsive behavior across breakpoints
- Validate accessibility (keyboard navigation, ARIA labels)

### Deliverables

- Updated `app/components/layout/site-header.tsx`
- Updated `app/components/layout/footer.tsx` and `conditional-site-footer.tsx`
- Mobile menu component with design system styling
- Locale toggle component
- Breadcrumb component (if applicable)

---

## Phase 4.2: Live Chat Widget Setup

**Goal:** Integrate live chat widget functionality with existing chat buttons in header and footer.

### Context

Live chat buttons already exist in:
- `app/components/layout/site-header.tsx` (desktop header, line 95-98)
- `app/components/layout/site-footer.tsx` (footer contact section, line 54-57)

These buttons currently don't have functional chat widget integration.

### Tasks

1. **Select chat service provider**
   - Evaluate options (Intercom, Tawk.to, Crisp, custom solution)
   - Consider GDPR compliance, NL/EN language support, mobile responsiveness
   - Choose provider based on requirements and budget

2. **Install and configure chat widget**
   - Add chat service SDK/script to root layout (`app/layout.tsx`)
   - Configure widget appearance to match design system (colors, fonts, positioning)
   - Set up NL/EN language switching based on locale
   - Configure widget behavior (auto-open, position, mobile behavior)

3. **Connect existing chat buttons**
   - Update header chat button to trigger widget open
   - Update footer chat button to trigger widget open
   - Ensure buttons work on both mobile and desktop
   - Add proper accessibility attributes (aria-label, keyboard support)

4. **Mobile optimization**
   - Test widget on mobile devices
   - Ensure widget doesn't interfere with mobile navigation
   - Verify touch interactions work correctly
   - Test on iOS and Android browsers

5. **Testing and validation**
   - Test widget opening/closing behavior
   - Verify NL/EN language switching
   - Test on all major browsers (Chrome, Firefox, Safari, Edge)
   - Validate accessibility (screen reader compatibility, keyboard navigation)
   - Test widget performance (load time, no layout shift)

6. **Documentation**
   - Document chat service configuration
   - Add environment variables if needed (API keys, widget IDs)
   - Update component documentation with chat widget usage

### Deliverables

- Chat widget integrated in root layout
- Updated header component with functional chat button
- Updated footer component with functional chat button
- Chat widget configuration documented
- Environment variables documented (if applicable)
- Mobile and desktop testing completed

### Considerations

- **Privacy/GDPR:** Ensure chat service is GDPR compliant, cookie consent integration if needed
- **Performance:** Chat widget should not impact Core Web Vitals (LCP, INP, CLS)
- **Accessibility:** Widget must be keyboard accessible and screen reader compatible
- **Locale support:** Widget should respect NL/EN locale and display appropriate language
- **Mobile UX:** Widget should be easily accessible on mobile without blocking content

---

## Phase 4.3: Home Template

**Goal:** Apply design system to homepage with optimized content structure per Content Specifications.

### Tasks

- Apply design tokens to hero section
- Implement escort preview grid with design system cards
- Style "Why Choose Us" section with design system components
- Apply design system to service areas quick links
- Structure FAQ section with design system accordion/cards
- Apply design system to footer CTA
- Ensure content follows Content Specifications (600-900 words, intent-first structure)
- Validate metadata optimization per Keyword Strategy

### Deliverables

- Updated `app/page.tsx` with design system
- Content optimized per Content Specifications
- Metadata optimized per Keyword Strategy
- All sections using design system components

---

## Phase 4.4: Listing Templates

**Goal:** Apply design system consistently across all listing page types.

### Templates to Update

1. Escorts Overview (`/alle-escorts/`, `/en/escorts/`)
2. Location Pages (`/escort-[city]/`, `/en/escort-[city]/`)
3. Attribute/Type Pages (`/aziatische-escorts/`, `/blonde-escorts/`, etc.)
4. Services Overview (`/diensten/`, `/en/services/`)
5. Types Overview (`/escort-types/`, `/en/escort-types/`)
6. Location Overview (`/locaties/`, `/en/locations/`)

### Tasks

- Apply design system to filter/sort controls
- Style escort grid with design system profile cards
- Apply design system to pagination
- Style location-specific content blocks
- Apply design system to FAQ sections
- Ensure unique content per page per Content Specifications
- Validate internal linking structure

### Deliverables

- All listing templates updated with design system
- Consistent card/grid styling across templates
- Filter controls styled with design system
- Unique content sections per Content Specifications

---

## Phase 4.5: Profile Detail Template

**Goal:** Apply design system to escort profile pages with Strapi integration.

### Tasks

- Apply design system to profile hero section
- Style photo gallery with design system components
- Apply design system to profile description sections
- Style services/rates tables with design system
- Apply design system to availability calendar/status
- Style reviews section (if applicable)
- Ensure Strapi data integration works correctly
- Validate schema markup (Person, Review)

### Deliverables

- Updated profile detail template with design system
- Strapi integration verified
- Schema markup implemented
- All profile sections styled consistently

---

## Phase 4.6: Content Pages

**Goal:** Apply design system to informational and service pages.

### Templates to Update

1. Contact Page (`/contact/`, `/en/contact/`)
2. Rates Page (`/prijzen/`, `/en/rates/`)
3. Service Detail Pages (dinner-date, travel-companion, etc.)
4. Blog Index (`/blog/`, `/en/blog/`)
5. Blog Post (`/blog/[slug]/`, `/en/blog/[slug]/`)
6. Knowledge Centre Overview (`/kennisbank/`, `/en/knowledge-centre/`)
7. Knowledge Centre Detail (`/kennisbank/[category]/[slug]/`)
8. FAQ Page (`/faq/`, `/en/faq/`)

### Tasks

- Apply design system to contact form
- Style pricing tables with design system
- Apply design system to blog post layout
- Style FAQ accordion with design system
- Apply design system to knowledge centre navigation
- Ensure content follows Content Specifications
- Validate metadata per Keyword Strategy

### Deliverables

- All content page templates updated
- Forms styled with design system
- Blog layout consistent with design system
- FAQ sections using design system accordion

---

## Phase 4.7: Legal/License Pages

**Goal:** Apply design system to legal and compliance pages.

### Templates to Update

1. Terms & Conditions (`/algemene-voorwaarden/`, `/en/terms/`)
2. Privacy Policy (`/privacybeleid/`, `/en/privacy/`)
3. License Page (`/licentie/`, `/en/license/`)
4. Cookie Policy (`/cookiebeleid/`, `/en/cookies/`)

### Tasks

- Apply design system to legal page layout
- Style table of contents (if applicable)
- Ensure readability with design system typography
- Apply design system to breadcrumbs
- Maintain legal content accuracy

### Deliverables

- All legal pages updated with design system
- Consistent typography and spacing
- Proper breadcrumb navigation

---

## Phase 4.8: QA Gates Per Batch

**Goal:** Validate each batch meets quality standards before proceeding.

### QA Checklist Per Batch

#### Visual Consistency
- [ ] All components use design system tokens
- [ ] No hardcoded colors or spacing values
- [ ] Consistent typography scale
- [ ] Consistent card/grid styling

#### Responsiveness
- [ ] Mobile viewport tested (320px, 375px, 414px)
- [ ] Tablet viewport tested (768px, 1024px)
- [ ] Desktop viewport tested (1280px, 1920px)
- [ ] No horizontal scrolling
- [ ] Touch targets adequate size (min 44x44px)
- [ ] Mobile menu works correctly

#### Accessibility
- [ ] WCAG 2.2 AA contrast ratios met
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Screen reader tested (VoiceOver, NVDA)
- [ ] Focus indicators visible
- [ ] ARIA labels where needed
- [ ] Alt text on images

#### SEO/Parity Safety
- [ ] No URL structure changes
- [ ] Metadata matches legacy (or optimized per Keyword Strategy)
- [ ] Canonical URLs correct (self-referencing)
- [ ] Hreflang correct (NL/EN alternates)
- [ ] Schema markup implemented and valid
- [ ] Internal links preserved (high-value pathways)
- [ ] No accidental noindex on valuable pages

#### Performance
- [ ] Core Web Vitals acceptable (LCP <2.5s, INP <200ms, CLS <0.1)
- [ ] Images optimized (WebP, proper sizing)
- [ ] No layout shift on load
- [ ] Third-party scripts don't block rendering

#### Content Quality
- [ ] Content follows Content Specifications
- [ ] Word counts within specified limits
- [ ] Unique content sections present (no template filler)
- [ ] FAQs structured for schema markup
- [ ] Primary keyword in H1 naturally
- [ ] Internal links included appropriately

### Validation Tools

- Lighthouse (performance, accessibility, SEO)
- WAVE accessibility checker
- Schema.org validator
- Google Search Console (URL inspection)
- Manual browser testing (Chrome, Firefox, Safari, Edge)
- Mobile device testing (iOS, Android)

---

## Rollout Order Summary

1. **Global Shell** (Header/Footer/Nav) - Foundation for all pages
2. **Live Chat Widget** - Global integration after shell is ready
3. **Home Template** - Highest traffic page, establishes patterns
4. **Listing Templates** - Core conversion pages
5. **Profile Detail** - Individual escort pages
6. **Content Pages** - Informational and service pages
7. **Legal Pages** - Compliance pages
8. **QA Gates** - Continuous validation throughout

---

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Design system drift across templates | Enforce token usage, component inventory, PR checklist |
| SEO regressions from visual changes | Continuous metadata validation, URL structure checks |
| Performance degradation | Monitor Core Web Vitals, optimize images, defer non-critical scripts |
| Accessibility issues | Automated testing, manual screen reader testing |
| Chat widget performance impact | Lazy load widget, monitor Core Web Vitals, test on slow connections |
| Mobile UX issues | Device testing, touch target validation, mobile-first approach |

---

## Success Criteria

- [ ] All templates use design system consistently
- [ ] No URL structure changes
- [ ] Metadata optimized or preserved per Keyword Strategy
- [ ] Live chat widget functional on all pages
- [ ] All pages pass QA gates (accessibility, responsiveness, SEO)
- [ ] Core Web Vitals meet targets
- [ ] Content follows Content Specifications
- [ ] Internal linking structure preserved
- [ ] NL/EN locale routing works correctly

---

## Related Documentation

- Design System Setup Plan: `.cursor/plans/design_system_setup.plan.md`
- Content Specifications: `.cursor/rules/CONTENT_SPECIFICATIONS.mdc`
- Keyword Strategy: `.cursor/rules/KEYWORD_STRATEGY.mdc`
- SEO Guidelines: `.cursor/rules/SEO_OPTIMIZATION_GUIDELINES.mdc`
- Technical Architecture: `.cursor/rules/TECHNICAL_ARCHITECTURE.mdc`
