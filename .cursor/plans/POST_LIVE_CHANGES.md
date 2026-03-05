# Post-Live Changes Plan

Track improvements that are intentionally scheduled for after initial go-live.

## Status Legend

- `planned` - scoped and approved, not started
- `in-progress` - actively being implemented
- `done` - implemented and verified
- `deferred` - postponed or superseded

## Change Backlog

| ID | Change | Status | Priority | Notes |
|---|---|---|---|---|
| PLC-001 | Build province pages (NL + EN where needed) | planned | High | First post-live SEO expansion item |

---

## PLC-001 - Build Province Pages

### Goal

Create dedicated province-level landing pages to capture province-intent searches and strengthen internal linking between location hubs and city pages.

### Scope

- Add province landing page template(s) using existing location-page patterns.
- Publish priority province pages first (for example Noord-Holland, Zuid-Holland, Utrecht).
- Add internal links:
  - homepage/location hub -> province pages
  - province pages -> relevant city pages
  - city pages -> parent province page where appropriate
- Add page-level SEO elements:
  - self-referencing canonical
  - NL/EN hreflang where bilingual content is available
  - metadata optimized for province intent
  - appropriate schema (`LocalBusiness` and/or `FAQPage` as defined per template)

### Content Requirements

- Each province page must include unique province-specific content (no city template duplication).
- Include province-specific service-area context, booking logistics, and local FAQs.
- Keep wording aligned with intent ownership rules (city intent remains on city pages).

### Acceptance Criteria

- Province routes render successfully in production build.
- Metadata/canonical/hreflang validate with no critical issues.
- Internal links between hub -> province -> city are crawlable and non-broken.
- Pages pass the current content and technical SEO checklist used for template launches.

### Rollout Notes

- Start with a small batch (2-3 provinces), then expand based on Search Console performance.
- Monitor impressions, CTR, and rankings before scaling to all provinces.
