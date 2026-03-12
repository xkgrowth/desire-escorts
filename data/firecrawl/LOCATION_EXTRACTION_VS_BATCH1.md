# Location Content: Batch 1 vs Extraction Script

## Why Batch 1 Before the Script?

**Order of operations, not strategy.** The sequence was:

1. **Template and data shape had to exist first.** Building Batch 1 (Amsterdam + districts) by hand defined `LocationDetailPageData`, validated the location-detail template, and proved the design (hero, FAQs, hotels, narrative, images).
2. **Quality bar was set by hand.** Batch 1 was written to match CONTENT_SPECIFICATIONS and KEYWORD_STRATEGY. That gave a clear target for “good”: direct tone, short answers, real hotels, location-specific narratives, CTR-style meta.
3. **The script was built to fill the same shape at scale.** Once the shape and quality bar existed, the extraction script could be designed to parse Firecrawl JSON into that shape. So the script came second because it *depends* on the shape and, ideally, should aim at the same quality bar.

So: Batch 1 first was **practical** (template + data contract), not a deliberate “bespoke-only Tier 1” plan. The question is whether we *should* treat Tier 1 (and maybe Tier 2) as bespoke and use the script only for the long tail.

---

## How Batch 1 Differs From Script Output

| Aspect | Batch 1 (Amsterdam + districts) | Script output (e.g. Aalsmeer, Alkmaar) |
|--------|----------------------------------|----------------------------------------|
| **Tone** | Direct, conversion-focused: “Wil je snel en discreet een escort in Amsterdam boeken?” | Legacy marketing: “Wil jij de beste escort van X? Desire Escorts helpt graag!” — template opener repeated across cities |
| **FAQs** | Short (1–2 sentences), location-specific questions, “je/jullie”, no “escort girl” | Long answers, “escort girl” and “u” mixed in, same Q set with city name swapped (template) |
| **FAQ questions** | Clean: “Hoe snel is escort service in Amsterdam beschikbaar?” | Often include “### ” prefix; same questions everywhere |
| **Hotels** | Real names + one short line each (e.g. Waldorf Astoria, Conservatorium, Okura) | Often `null` (script didn’t find a hotel section) or missing |
| **Narrative** | Specific geography: Dam, Rembrandtplein, grachtengordel, NDSM, Zuidas, Museumplein, De Hallen, Sloterdijk | Generic “betaalbare prijzen, ervaren escortbureaus…” plus markdown links `[prijzen](url)` |
| **Meta title** | CTR-style: “Escort Service Amsterdam \| Discreet & Snel \| Desire Escorts” | Legacy: “Escort Dames in Alkmaar” |
| **Meta description** | Includes numbers and CTA: “Vaak binnen 45-90 minuten mogelijk, vanaf €160.” | “Wil jij de beste escort van X? Desire Escorts helpt graag!” |
| **Content strategy** | Aligned with optimize-during-build: trim filler, unique per page | Effectively parity with legacy: extract what’s there (including filler) |

So: **Batch 1 is optimized; the script is “extract legacy as-is”.** The migration strategy says to *reduce* legacy template text and optimize for intent; the script currently preserves that template text.

---

## Recommendation

**Use a hybrid:**

1. **Tier 1 (and optionally Tier 2) = bespoke or script + light rewrite**  
   For Amsterdam, Rotterdam, Den Haag, Utrecht, Eindhoven, Groningen (and maybe Breda, Tilburg, Almere, Arnhem), keep or create hand-optimized content so it matches Batch 1: short FAQs, real hotels, location-specific narrative, CTR meta. Either maintain them in the batch/static data or run the script and then overwrite those slugs with curated content.

2. **Tier 3 (bulk) = script + optional post-processing**  
   For the remaining ~195 locations, the script is fine as a **first pass** so every slug has *some* content and no blank pages. Optionally add a post-process (or a second script) that:
   - Trims obvious template openers (“Wil jij de beste escort van X? Desire Escorts helpt graag!”) and replaces with a short, direct intro.
   - Shortens FAQ answers (e.g. first sentence only, or cap length).
   - Applies a meta template from KEYWORD_STRATEGY (title/description pattern).
   - Strips markdown from narrative (e.g. `[prijzen](url)` → “prijzen” or link handled in template).

So: **we don’t recommend relying on the script alone for Tier 1.** We *do* recommend using the script for volume, and either improving it (see below) or adding a post-step so Tier 3 output moves closer to the Batch 1 standard over time.

---

## Script Improvements (to Move Closer to Batch 1)

If you want the script to produce “good enough” content without hand-curation for every page:

1. **Strip markdown from narrative and hero**  
   Remove `[text](url)` and similar so the template doesn’t render raw markdown; optionally replace with plain “text” or a single internal link.

2. **Normalise FAQs**  
   - Strip leading `### ` (and other `#` prefixes) from question text.  
   - Shorten answers (e.g. first sentence, or max 200 chars) to match Batch 1 length.  
   - Optionally replace “escort girl” with “escort” and “u” with “je” for consistency.

3. **Meta from KEYWORD_STRATEGY**  
   Don’t use legacy H1/first paragraph as meta. Use a pattern, e.g.:  
   - Title: `Escort Service [City] | Desire Escorts` (or with “Discreet & Snel” for Tier 1).  
   - Description: include “Vanaf €X”, “binnen X min” or “snelle beschikbaarheid”, and a short CTA.

4. **Hero intro fallback**  
   If the first paragraph is the generic “Wil jij de beste escort van X? Desire Escorts helpt graag!”, replace it with a short generic: “Escort service in [City] met snelle beschikbaarheid en discrete afhandeling. Boek via live chat of WhatsApp.”

5. **Hotel extraction**  
   Improve detection of hotel sections (e.g. headings containing “Hotel”, “accommodatie”, “overnachten”, or list items with “Hotel” in the name) so more pages get real hotel lists instead of `null`. If none found, keep `null` and let the data layer use a single default line (as now).

**Update (implemented):** The extraction script now applies 1–4 and 5. Re-run with `npm run location:extract-content` to regenerate `location-extracted-content.json` with: markdown stripped from narrative/hero, generic hero replaced by CTA, FAQs shortened and normalised (escort girl → escort, u/uw → je/jouw), meta from KEYWORD_STRATEGY template, and broader hotel detection (section heading or list items containing “Hotel” or known chain names). Many legacy pages still have no structured hotel list in the scraped markdown, so `hotels` may remain null; the data layer fallback is used in that case.
