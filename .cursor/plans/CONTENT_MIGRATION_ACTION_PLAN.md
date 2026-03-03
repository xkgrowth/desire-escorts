# CONTENT MIGRATION ACTION PLAN

**Updated**: 2026-03-03
**Strategy**: Optimize-during-build migration
**Scope**: Phase 1 content optimization and migration execution

## Strategic Shift Summary

This plan has been updated from **parity-first** to **optimize-during-build** based on:
- Evidence of traffic decline since September 2025
- Content audit revealing bloat, poor user intent alignment, and template duplication
- SEO/GEO/AEO analysis indicating current content patterns contributing to algorithmic penalties

## Current Evidence Snapshot

- Canonical inventory: `781` URLs (`NL 392`, `EN 389`)
- URL decision manifest: `include 781`, `review 0`, `exclude 0`
- Firecrawl rendered coverage: `781/781` URLs extracted
- Strapi authority rule: profile URLs under `/escorts/*` and `/en/escorts/*` are Strapi-led
- **Content optimization status**: Specifications defined, keyword strategy complete

## Leveraging Scraped Content

### What to Extract from Legacy

| Source | Extract | Purpose |
|--------|---------|---------|
| Firecrawl renders | Unique location-specific content | Preserve genuine local info |
| Firecrawl renders | Internal link graph | Preserve high-value pathways |
| Firecrawl renders | FAQ questions | Restructure for AI/schema |
| WordPress exports | Structured metadata | Baseline for optimization |
| WordPress exports | Publishing dates | Preserve content age signals |
| Search Console | Performing keywords | Priority keyword assignment |
| Strapi | Profile data | Runtime authority source |

### What to Remove from Legacy

- Template boilerplate (generic text repeated across pages)
- Keyword-stuffed paragraphs
- Long generic industry descriptions
- Testimonials without context
- Duplicate service lists
- Content not serving user intent

## Batch Plan (Optimization Priority Order)

### Batch 1 — High-Traffic Commercial Pages

**Priority**: Highest (direct revenue impact)
**Timeline**: First

#### Pages
| NL URL | EN URL | Type | Primary Keyword |
|--------|--------|------|-----------------|
| `/` | `/en` | Homepage | escort service |
| `/escort-amsterdam` | `/en/escort-amsterdam` | City Location | escort amsterdam |
| `/escort-amsterdam-centrum` | `/en/escort-amsterdam-centrum` | District Location | escort amsterdam centrum |
| `/escort-rotterdam` | `/en/escort-rotterdam` | Location | escort rotterdam |
| `/escort-den-haag` | `/en/escort-den-haag` | Location | escort den haag |

#### Optimization Tasks
- [ ] Extract unique content from Firecrawl renders
- [ ] Apply Content Specifications templates
- [ ] Implement Keyword Strategy assignments
- [ ] Reduce word count by 60-80%
- [ ] Structure FAQs for schema markup
- [ ] Optimize metadata for CTR
- [ ] Preserve high-value internal links
- [ ] Ensure `/escort-amsterdam/` returns `200` indexable and is not redirected to homepage
- [ ] Link `/escort-amsterdam/` (city parent) and `/escort-amsterdam-centrum/` (district child) bidirectionally

#### QA Checklist
- [ ] Word count within specification (homepage <1000, locations <1500)
- [ ] Primary keyword in H1 and meta title
- [ ] Unique content section present (min 200 words)
- [ ] FAQ schema markup implemented
- [ ] Internal links to profile pages preserved
- [ ] Hreflang NL/EN correct
- [ ] Mobile rendering verified
- [ ] Core Web Vitals acceptable

---

### Batch 2 — High-Volume Attribute Pages

**Priority**: High (category-level traffic)
**Timeline**: After Batch 1

#### Pages
| NL URL | EN URL | Primary Keyword |
|--------|--------|-----------------|
| `/aziatische-escorts` | `/en/asian-escorts` | aziatische escort |
| `/blonde-escorts` | `/en/blonde-escorts` | blonde escort |
| `/milf-escort` | `/en/milf-escort` | milf escort |
| `/mature-escorts` | `/en/mature-escorts` | mature escort |
| `/busty-escorts` | `/en/busty-escorts` | busty escort |

#### Optimization Tasks
- [ ] Extract attribute-specific content
- [ ] Apply Content Specifications for attribute pages
- [ ] Create unique "Why [Attribute]" section per page
- [ ] Reduce word count to 500-800 words
- [ ] Structure FAQs with attribute-specific questions
- [ ] Cross-link to location pages with attribute

#### QA Checklist
- [ ] Word count 500-800 words
- [ ] Unique content section (min 150 words)
- [ ] No template filler remaining
- [ ] FAQ schema markup
- [ ] Cross-links to locations functional
- [ ] Profile grid shows correct filtered escorts

---

### Batch 3 — Remaining Location Pages

**Priority**: Medium-High (geographic coverage)
**Timeline**: After Batch 2

#### Pages (Examples)
| NL URL | EN URL | Primary Keyword |
|--------|--------|-----------------|
| `/escort-utrecht` | `/en/escort-utrecht` | escort utrecht |
| `/escort-eindhoven` | `/en/escort-eindhoven` | escort eindhoven |
| `/escort-groningen` | `/en/escort-groningen` | escort groningen |
| `/escort-breda` | `/en/escort-breda` | escort breda |
| ... (all remaining location pages) | ... | ... |

#### Optimization Tasks
- [ ] Extract location-specific content
- [ ] Create unique local content per city (neighborhoods, travel times, venue info)
- [ ] Apply Content Specifications template
- [ ] Reduce word count to 800-1200 words
- [ ] Location-specific FAQ questions

#### QA Checklist
- [ ] Unique location content present (min 200 words)
- [ ] No generic content shared across locations
- [ ] Service area specifics included
- [ ] Internal links to profiles and attribute pages

---

### Batch 4 — Profile Detail Routes (Strapi Authority)

**Priority**: Medium (Strapi-led, structural migration)
**Timeline**: After Batch 3

#### Patterns
- `/escorts/:slug`
- `/en/escorts/:slug`

#### Optimization Tasks
- [ ] Verify Strapi profile data completeness
- [ ] Apply profile page Content Specifications
- [ ] Ensure unique description per escort (not template)
- [ ] Implement Person schema markup
- [ ] Real-time availability display
- [ ] Review schema if applicable

#### QA Checklist
- [ ] Profile data renders correctly from Strapi
- [ ] Unique description present (300-500 words)
- [ ] Schema markup (Person, Review if applicable)
- [ ] Availability status accurate
- [ ] Cross-links to location and attribute pages

---

### Batch 5 — Service Pages

**Priority**: Medium
**Timeline**: Parallel with Batch 4

#### Pages
| NL URL | EN URL | Primary Keyword |
|--------|--------|-----------------|
| `/escort-service` | `/en/escort-service` | escort service |
| `/dinner-date` | `/en/dinner-date` | dinner date escort |
| `/travel-companion` | `/en/travel-companion` | travel escort |
| `/girlfriend-experience` | `/en/girlfriend-experience` | gfe escort |

#### Optimization Tasks
- [ ] Extract service-specific details
- [ ] Apply Content Specifications for service pages
- [ ] Clear pricing/duration information
- [ ] How-it-works steps
- [ ] Service-specific FAQs

#### QA Checklist
- [ ] Word count 600-1000 words
- [ ] Clear service description
- [ ] Pricing information present
- [ ] FAQ schema markup
- [ ] Internal links to relevant profiles/locations

---

### Batch 6 — Blog and Knowledge Content

**Priority**: Medium-Low
**Timeline**: After core pages

#### Scope
- All post-like informational pages
- Knowledge articles
- Blog archive

#### Optimization Tasks
- [ ] Audit existing blog content for quality
- [ ] Remove or consolidate thin posts
- [ ] Optimize remaining posts for EEAT
- [ ] Add author bylines with credentials
- [ ] Update internal linking

#### QA Checklist
- [ ] Word count 800-1500 words for informational
- [ ] Author byline present
- [ ] Article schema markup
- [ ] Internal links to services/locations

---

### Batch 7 — Technical Assets and Edge URLs

**Priority**: Low
**Timeline**: Final

#### Scope
- Technical parity assets (e.g., `locations.kml`)
- Legal pages (privacy, terms)
- Contact pages
- Utility pages

#### Tasks
- [ ] Validate technical asset accessibility
- [ ] Update legal pages for compliance
- [ ] Ensure contact information accurate

---

## Content Extraction Workflow

### Per-Page Process

```
1. READ: Firecrawl markdown for page
2. IDENTIFY: Unique content (location-specific, attribute-specific)
3. IDENTIFY: FAQ questions to preserve
4. IDENTIFY: Internal links to preserve
5. MAP: Place extracted content into Content Specification template
6. WRITE: Missing required sections (unique content, FAQs)
7. REMOVE: Template filler, generic descriptions
8. VALIDATE: Word count, keyword placement, technical SEO
9. IMPLEMENT: Build page with optimized content
10. QA: Run full checklist before deployment
```

### Extraction Script Requirements

For automated extraction support:
- Parse Firecrawl markdown output
- Identify headers and content blocks
- Extract internal links
- Identify FAQ patterns (questions/answers)
- Flag template text (common across multiple pages)
- Output structured JSON for page build

---

## Field Mapping

### Legacy → Optimized

| Legacy Source | Field | Target | Transformation |
|---------------|-------|--------|---------------|
| WordPress | `title` | Meta title | Optimize per Keyword Strategy |
| WordPress | `description` | Meta description | Optimize for CTR |
| WordPress | `content` | Page body | Extract unique only, restructure |
| Firecrawl | `markdown` | Content sections | Parse and restructure |
| Firecrawl | `links` | Internal links | Preserve high-value |
| Strapi | `profile.*` | Profile pages | Direct mapping |

### Profiles (Strapi Authority)

| Strapi Field | Target |
|--------------|--------|
| `name` | H1, title |
| `description` | About section |
| `services` | Services list |
| `rates` | Pricing table |
| `availability` | Availability display |
| `images` | Gallery |
| `attributes` | Tags, filtering |

---

## Redirect Matrix

### Policy
- **Goal**: Zero URL changes
- **Exception**: Only if legacy URL cannot function in Next.js

### Current Status
- Amsterdam intent normalization required:
  - remove homepage redirect for `/escort-amsterdam/`
  - set `/escort-amsterdam/` as city-intent canonical page (`200`, indexable)
  - keep `/escort-amsterdam-centrum/` as district-specific page (not city canonical)
- Unresolved internal-link targets tracked in: `data/reconcile/gates/link-gate-evidence.json`

### If Redirect Needed
1. Document reason
2. Get SEO approval
3. Add to redirect configuration
4. Verify 301 implementation
5. Monitor for 404s post-launch

---

## QA Checklist (Universal)

### Content Quality
- [ ] Word count within page type specification
- [ ] Primary keyword in H1 (naturally)
- [ ] Unique content section present (per specification)
- [ ] No template filler remaining
- [ ] FAQs structured for schema
- [ ] CTA present and clear

### Technical SEO
- [ ] Meta title optimized (50-60 chars)
- [ ] Meta description optimized (150-160 chars, includes CTA)
- [ ] Canonical self-referencing
- [ ] Hreflang NL/EN correct
- [ ] Schema markup implemented (page-type appropriate)
- [ ] Robots: index, follow

### Internal Linking
- [ ] High-value links from legacy preserved
- [ ] Related pages linked
- [ ] No broken internal links

### Performance
- [ ] Mobile rendering verified
- [ ] Images optimized
- [ ] Core Web Vitals acceptable

### Final Sign-off
- [ ] Content reviewed
- [ ] Technical QA passed
- [ ] Approved for deployment

---

## Owners and Dependencies

### Owners

| Role | Responsibility |
|------|---------------|
| Engineering | Next.js implementation, technical SEO |
| Content/SEO | Content optimization, keyword assignment, QA |
| Backend/Strapi | Profile endpoint, data integrity |

### Dependencies

| Dependency | Status | Blocker |
|-----------|--------|---------|
| Content Specifications | Complete | No |
| Keyword Strategy | Complete | No |
| SEO Guidelines | Complete | No |
| Strapi profile endpoints | Needs verification | Potential |
| Firecrawl extractions | Complete | No |

---

## Acceptance Criteria

### Batch-Level
- All pages in batch built per Content Specifications
- Keyword assignments implemented
- QA checklist passed for all pages
- No broken internal links
- Schema markup validated

### Migration Complete
- All included URLs live with optimized content
- Metadata optimized per Keyword Strategy
- FAQ schema on all applicable pages
- Internal link graph preserved
- Hreflang correct for all bilingual pages
- Technical SEO validated
- Monitoring dashboards active

---

## Post-Launch Monitoring Plan

### Week 1
- Daily 404 monitoring
- Indexing verification (Search Console)
- Critical page position tracking

### Week 2-4
- Position change analysis for P1 keywords
- CTR comparison vs. baseline
- User behavior metrics (bounce rate, time on page)

### Month 2-3
- Full keyword performance review
- Content performance by page type
- Identify pages needing further optimization
- Document learnings for future batches

---

## Related Documentation

- Content Specifications: `.cursor/rules/CONTENT_SPECIFICATIONS.mdc`
- Keyword Strategy: `.cursor/rules/KEYWORD_STRATEGY.mdc`
- SEO Guidelines: `.cursor/rules/SEO_OPTIMIZATION_GUIDELINES.mdc`
- Migration Strategy: `.cursor/rules/CONTENT_MIGRATION_STRATEGY.mdc`
- Technical Architecture: `.cursor/rules/TECHNICAL_ARCHITECTURE.mdc`
