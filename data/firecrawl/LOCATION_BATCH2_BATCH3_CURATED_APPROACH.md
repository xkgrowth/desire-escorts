# Curated content approach: Batch 2 & Batch 3 location pages

## Why curated (not template-only)

Batch 1 (Amsterdam, Haarlem, Amstelveen + Amsterdam districts) was hand-curated against:
- **KEYWORD_STRATEGY.mdc** (primary + secondary keywords per page)
- **CONTENT_SPECIFICATIONS.mdc** (intent-first, unique per page, no template filler)
- **Google Search Console** (ranking queries, CTR, positions)

Batch 2 and Batch 3 overrides were initially filled with one repeated pattern (same hero, same narrative structure with city/hotel names swapped). That produces thin, samey content and is unlikely to perform well for SEO. This doc defines how we do **hand-curated** hero and "Wat je kunt verwachten" (locationNarrative) for Batch 2 and Batch 3 so they match the quality bar of Amsterdam/Haarlem.

## Workflow per city

1. **GSC check**  
   Use `data/search-console/General_Queries.csv` for the city (e.g. "escort rotterdam", "escort service rotterdam"). Note position, CTR, and any supporting queries ([city] escort, escorts [city], etc.).

2. **Keyword strategy**  
   Primary = escort [city]. Secondary = escort service [city], [city] escort. Weave these in naturally; do not stuff.

3. **Unique angle**  
   Choose a lead for the narrative that fits the city:
   - **Demand-led:** "X heeft doorlopend vraag vanuit..." (Amsterdam style)
   - **Booking-pattern-led:** "X is populair voor avondboekingen... vroeg boeken geeft de meeste keuze" (Haarlem style)
   - **Area-led:** Start with specific areas/neighbourhoods, then booking
   - **Hotel/client-led:** Start with hotelafspraken or zakelijke gasten, then areas

4. **Hero variety**  
   Vary the hero intro so not every page opens with the same sentence:
   - Question: "Wil je snel en discreet een escort in X boeken? We combineren..."
   - Benefit-led: "Escort service in X: snelle beschikbaarheid, geverifieerde profielen en heldere prijsafspraken vooraf."
   - Direct: "Boek een escort in X snel en discreet. Geverifieerde profielen en duidelijke afspraken."
   Keep primary keyword and CTA intent; change structure and emphasis.

5. **Narrative variety**  
   - Different opening sentence per city (demand vs. pattern vs. area vs. hotel).
   - City-specific areas/landmarks (not generic "centrum en nabij het station" only).
   - Vary how we mention last-minute/vooraf boeken (sometimes one sentence, sometimes integrated).
   - Vary closing (which services we combine: dinner date, GFE, massage, privé-ontmoeting — pick what fits).

6. **Copy mapping**  
   In code or in this doc, note per city: which GSC/strategy terms were reinforced, and what angle was used.

## Balance: speed vs quality

- **Batch 2 + Batch 3 (15 cities):** Hand-curated hero + narrative. Slower, higher quality, aligned with strategy and GSC.
- **Batch 4+ (remaining 195+):** Script/extraction as first pass; optional light post-processing (shorter generic intro, meta template, trim FAQ length). We can later add more curated batches if needed.

## Reference: Amsterdam vs Haarlem (narrative difference)

- **Amsterdam:** "Amsterdam heeft doorlopend vraag vanuit centrumhotels, de Zuidas en internationale bezoekers. Afspraken in Centrum, Zuid, Oost, West en Noord zijn meestal snel in te plannen wanneer je 1-2 uur vooraf boekt. Voor last-minute aanvragen stemmen we direct beschikbaarheid, locatie en voorkeuren met je af via live chat of WhatsApp. Hotelafspraken in en rond de binnenstad combineren we vaak met services zoals dinner date, GFE en ontspannende massage."
- **Haarlem:** "Haarlem is populair voor avondboekingen, hotelafspraken en dates in of rond het centrum. De vraag zit vaak in de avonduren en het weekend, waardoor vroeg boeken de meeste keuze geeft. Voor afspraken in Haarlem-Zuid, het centrum en richting Bloemendaal plannen we doorgaans het snelst. Hotelafspraken worden vaak gecombineerd met services zoals dinner date of een rustige privé-ontmoeting."

So: different opening (demand vs. pattern), different structure (districts vs. areas + timing), different closing (dinner/GFE/massage vs. dinner/privé).

---

## Copy mapping (Batch 2 & 3 applied)

**Batch 2**
- **Rotterdam:** Benefit-led hero; narrative demand-led, “Rotterdam escort” reinforced. GSC: escort rotterdam, rotterdam escort.
- **Den Haag:** Question hero, “escort service Den Haag”; narrative shortened, pattern + Scheveningen/strand. GSC: escort den haag, escort service den haag.
- **Utrecht:** Direct CTA hero; narrative area-led (Dom, station), “Utrecht escort”. GSC: escort utrecht, utrecht escort.
- **Eindhoven:** Question hero, “Escort in Eindhoven”; narrative demand (Stratumseind, station) + “escort service Eindhoven”. GSC: escort eindhoven.
- **Groningen:** Demand-led hero; narrative pattern-led, “Groningen escorts”. GSC: escort groningen, groningen escort.

**Batch 3**
- **Breda:** Direct hero, “escort service Breda”; narrative area-led (Grote Markt, Chassé). GSC: escort breda.
- **Tilburg:** Benefit hero; narrative pattern (avond/weekend) + Spoorzone. GSC: escort tilburg.
- **Almere:** Question hero; narrative area (Stad, Haven) + last-minute. GSC: escort almere.
- **Arnhem:** Question hero; narrative demand (Veluwe, Velperplein, zakelijke gasten). GSC: escort arnhem.
- **Leiden:** Benefit hero, “45–90 min”; narrative pattern + grachten/Burcht. GSC: escort leiden.
- **Delft:** Question hero; narrative compact, Markt + station. GSC: escort delft.
- **Gouda:** Direct hero; narrative pattern (avond/weekend) + Markt. GSC: escort gouda.
- **Amersfoort:** Benefit hero; narrative area (toren, Eemhaven). GSC: escort amersfoort (growth).
- **Zaandam:** Demand-led hero; narrative “Escort Zaandam”, Inverdan. GSC: escort zaandam (strong pos).
- **Hilversum:** Direct hero, Mediapark; narrative pattern + Mediapark. GSC: escort hilversum.
