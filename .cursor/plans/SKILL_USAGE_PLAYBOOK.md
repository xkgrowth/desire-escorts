# Skill Usage Playbook — Migration Phase Execution

Generated: 2026-03-02  
Purpose: Map installed skills to migration phases and provide "when to trigger" guidance

## Installed Skills Overview

| Skill | Primary Use Case | Risk Level |
|-------|----------------|------------|
| `playwright-e2e-testing` | Route-level regression testing, parity validation | ⚠️ Critical Risk (review before use) |
| `migrate-site` | SEO migration guardrails, redirect mapping, monitoring | ✅ Safe |
| `link-checker` | Internal/external link validation, broken link fixes | ⚠️ Medium Risk |
| `vercel-observability` | Post-deploy monitoring, performance tracking, debugging | ✅ Low Risk |

---

## Phase Mapping: When to Use Each Skill

### Phase: Batch 1-5 Implementation (Current → Pre-Launch)

#### **playwright-e2e-testing** — Route Parity Validation

**When to trigger:**
- After implementing each batch (Batch 1-5)
- Before merging PRs that touch routing
- During pre-launch QA gates

**Use cases:**
1. **Route existence checks** — Verify all 781 canonical URLs resolve (no 404s)
   ```typescript
   // Example: Test NL/EN route parity
   test('all canonical URLs resolve', async ({ page }) => {
     const urls = await loadCanonicalInventory(); // 781 URLs
     for (const url of urls) {
       await page.goto(url);
       await expect(page).not.toHaveURL(/404/);
     }
   });
   ```

2. **Metadata parity validation** — Assert title/description match legacy exactly
   ```typescript
   test('metadata matches legacy for critical pages', async ({ page }) => {
     const criticalPages = [
       { url: '/', expectedTitle: '...', expectedDesc: '...' },
       { url: '/en', expectedTitle: '...', expectedDesc: '...' },
     ];
     for (const { url, expectedTitle, expectedDesc } of criticalPages) {
       await page.goto(url);
       await expect(page).toHaveTitle(expectedTitle);
       const metaDesc = await page.locator('meta[name="description"]').getAttribute('content');
       expect(metaDesc).toBe(expectedDesc);
     }
   });
   ```

3. **Language routing checks** — Verify NL (`/`) and EN (`/en/`) behavior
   ```typescript
   test('NL/EN routing parity', async ({ page }) => {
     await page.goto('/');
     await expect(page.locator('html')).toHaveAttribute('lang', 'nl');
     
     await page.goto('/en');
     await expect(page.locator('html')).toHaveAttribute('lang', 'en');
   });
   ```

4. **Strapi profile integration** — Verify profile routes load from Strapi
   ```typescript
   test('profile routes load from Strapi', async ({ page }) => {
     await page.goto('/escorts/test-profile');
     await expect(page.locator('[data-testid="profile-content"]')).toBeVisible();
     // Verify host scoping header behavior
   });
   ```

**Integration with existing artifacts:**
- Use `data/inventory/canonical-inventory.json` as test URL source
- Use `data/reconcile/gates/metadata-gate-evidence.json` for expected metadata
- Use `data/reconcile/gates/language-gate-evidence.json` for locale assertions

**Pre-launch checklist:**
- [ ] All 781 URLs return 200 (no 404s)
- [ ] Critical pages (top 50 by traffic) have exact metadata parity
- [ ] NL/EN routing works correctly
- [ ] Profile routes load from Strapi with correct host scoping

---

#### **migrate-site** — SEO Migration Guardrails

**When to trigger:**
- Before implementing redirects (currently 20 candidates in `data/reconcile/redirect-candidates.json`)
- During pre-launch SEO validation
- Post-launch monitoring (weeks 1-4)

**Use cases:**
1. **Redirect mapping validation** — Review 20 redirect candidates against best practices
   - Input: `data/reconcile/redirect-candidates.json`
   - Output: Validated redirect map with 301 type confirmation
   - Check: Avoid redirect chains, preserve authority

2. **Pre-launch SEO checklist** — Cross-reference against migration skill's Phase 3 checklist
   - [ ] New site crawlable (no staging robots.txt)
   - [ ] Redirect rules implemented and tested
   - [ ] XML sitemap ready (new URLs)
   - [ ] Canonical tags point to new URLs
   - [ ] Internal links updated
   - [ ] Hreflang tags updated (NL/EN)

3. **Post-launch monitoring plan** — Use skill's Phase 4 schedule
   - Week 1 (daily): Check Search Console crawl errors, verify redirects
   - Weeks 2-4 (weekly): Compare traffic to baseline, check indexation
   - Months 2-3 (monthly): Traffic recovery validation

4. **Rollback criteria definition** — Use skill's Phase 5 guidance
   - Rollback if: traffic drops > 50% for 7+ days
   - Rollback if: > 20% redirects broken
   - Document rollback steps before launch

**Integration with existing artifacts:**
- `data/reconcile/redirect-candidates.json` → validate against skill's redirect mapping rules
- `data/reconcile/parity-gate-summary.json` → use as pre-migration baseline
- Traffic baseline: capture from Search Console before launch

---

#### **link-checker** — Internal Link Validation

**When to trigger:**
- After each batch implementation (verify internal links work)
- Pre-launch comprehensive link audit
- Post-launch broken link monitoring

**Use cases:**
1. **Internal link validation** — Verify all internal links resolve to migrated routes
   - Extract links from migrated pages
   - Validate against canonical inventory (781 URLs)
   - Flag broken internal links before launch

2. **External link health** — Check external references aren't broken
   - Validate external links from migrated content
   - Upgrade HTTP → HTTPS where possible
   - Flag broken external links for manual review

3. **Link graph preservation** — Ensure internal linking structure matches legacy
   - Compare link graph from Firecrawl (`data/firecrawl/**/links.json`)
   - Verify key commercial pathways preserved
   - Document any intentional link changes

**Note:** This skill is Webflow-focused but can be adapted for Next.js:
- Use Playwright to extract links from rendered pages
- Validate against canonical inventory
- Fix broken links in Next.js source files or CMS

**Integration with existing artifacts:**
- `data/firecrawl/**/links.json` → legacy link graph reference
- `data/reconcile/gates/link-gate-evidence.json` → known link targets
- `data/reconcile/link-target-triage.json` → triaged link decisions

---

#### **vercel-observability** — Post-Deploy Monitoring

**When to trigger:**
- Immediately after Vercel deployment (preview + production)
- During launch week (daily monitoring)
- Ongoing performance tracking

**Use cases:**
1. **Web Analytics setup** — Track traffic patterns post-launch
   - Enable Vercel Analytics
   - Compare to pre-migration baseline
   - Monitor NL vs EN traffic distribution

2. **Speed Insights** — Core Web Vitals tracking
   - Measure LCP, FID, CLS on critical pages
   - Ensure parity or improvement vs legacy
   - Track performance regressions

3. **Logs and tracing** — Debug production issues
   - Monitor 404/500 errors (catch broken routes)
   - Trace slow requests (identify performance bottlenecks)
   - Debug Strapi API integration issues

4. **Alerts configuration** — Set up operational thresholds
   - Alert on error rate spikes
   - Alert on response time degradation
   - Alert on crawl error increases

**Integration with existing artifacts:**
- Monitor 404s against canonical inventory (should be zero)
- Track Strapi API call performance (profile routes)
- Compare Core Web Vitals to legacy baseline

---

## Skill Usage Workflow by Migration Phase

### Phase: Batch Implementation (Current)

**After each batch:**
1. ✅ **playwright-e2e-testing** — Run route parity tests for batch URLs
2. ✅ **link-checker** (adapted) — Validate internal links in batch pages
3. ✅ **migrate-site** — Review batch against SEO checklist

**Before PR merge:**
- Playwright tests pass for batch routes
- No broken internal links introduced
- Metadata parity verified for batch pages

---

### Phase: Pre-Launch QA (Before Production)

**Comprehensive validation:**
1. ✅ **playwright-e2e-testing** — Full 781 URL regression suite
2. ✅ **link-checker** (adapted) — Complete internal/external link audit
3. ✅ **migrate-site** — Final SEO checklist validation
4. ✅ **vercel-observability** — Enable analytics/insights on preview deployment

**Pre-launch gates:**
- [ ] All 781 URLs return 200
- [ ] Critical pages have exact metadata parity
- [ ] All internal links resolve correctly
- [ ] Redirect map validated (20 candidates)
- [ ] Analytics/insights enabled on preview
- [ ] Rollback plan documented

---

### Phase: Launch Week (Days 1-7)

**Daily monitoring:**
1. ✅ **vercel-observability** — Check logs for 404/500 errors
2. ✅ **migrate-site** — Daily Search Console crawl error review
3. ✅ **playwright-e2e-testing** — Spot-check critical routes

**Launch day checklist:**
- [ ] Deploy redirects (20 candidates)
- [ ] Submit new sitemap to Search Console
- [ ] Force-crawl key pages
- [ ] Monitor server errors in real-time

---

### Phase: Post-Launch Stabilization (Weeks 2-4)

**Weekly checks:**
1. ✅ **migrate-site** — Traffic comparison vs baseline
2. ✅ **vercel-observability** — Performance trends (Speed Insights)
3. ✅ **link-checker** (adapted) — Broken link monitoring

**Monthly checks (Months 2-3):**
1. ✅ **migrate-site** — Full recovery validation
2. ✅ **vercel-observability** — Long-term performance trends

---

## Skill Integration with Existing Scripts

### Playwright + Inventory Scripts

```bash
# Generate test suite from canonical inventory
npm run inventory:build  # Creates canonical-inventory.json
# Use playwright-e2e-testing to test all URLs from inventory
```

### Link Checker + Reconciliation Artifacts

```bash
# Use link triage decisions for validation
cat data/reconcile/link-target-triage.json
# Use link-checker to verify all include/redirect decisions are correct
```

### Migrate Site + Parity Gates

```bash
# Use parity gate summary as pre-migration baseline
cat data/reconcile/parity-gate-summary.json
# Use migrate-site skill to validate against SEO best practices
```

---

## Risk Mitigation

### playwright-e2e-testing (Critical Risk)

**Before first use:**
1. Review skill contents: `~/.agents/skills/playwright-e2e-testing/SKILL.md`
2. Understand what the skill does (E2E testing framework)
3. Start with small test suites before full 781 URL runs

**Safe usage pattern:**
- Use for route existence checks (low risk)
- Use for metadata assertions (read-only)
- Avoid complex interactions until skill reviewed

### link-checker (Medium Risk)

**Note:** Skill is Webflow-focused but adaptable
- Use Playwright to extract links from Next.js pages
- Validate against canonical inventory
- Manual fixes in Next.js source files

---

## Quick Reference: Skill Triggers

| Task | Skill | When |
|------|-------|------|
| Test route exists | `playwright-e2e-testing` | After batch implementation |
| Validate metadata | `playwright-e2e-testing` | Pre-launch QA |
| Check internal links | `link-checker` (adapted) | After batch, pre-launch |
| Review redirects | `migrate-site` | Before implementing redirects |
| Monitor errors | `vercel-observability` | Post-deploy, launch week |
| Track performance | `vercel-observability` | Ongoing |
| SEO checklist | `migrate-site` | Pre-launch, post-launch |

---

## Next Steps

1. **Review playwright-e2e-testing skill** (Critical Risk) before first use
2. **Create Playwright test suite** using canonical inventory as URL source
3. **Validate redirect candidates** using migrate-site skill guidance
4. **Set up Vercel observability** on preview deployment before production
5. **Adapt link-checker workflow** for Next.js (use Playwright extraction)

---

## Questions or Issues?

- Skill not working as expected? Check skill's SKILL.md file
- Need to uninstall? `npx skills remove <skill-name> -g`
- Want to add more skills? Use `npx skills find <query>`
