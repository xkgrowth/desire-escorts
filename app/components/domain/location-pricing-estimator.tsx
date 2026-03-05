"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { formatEuro, formatHours } from "@/lib/data/location-pricing";

type KnownLocationEstimate = {
  city: string;
  slug: string;
  province: string;
  minPrice: number;
  minHours: number;
};

type ProvinceEstimate = {
  province: string;
  provinceMinPrice: number;
  provinceMinHours: number;
};

type DutchPlace = {
  name: string;
  province: string;
};

type EstimatorProps = {
  knownLocationEstimates: KnownLocationEstimate[];
  provinceEstimates: ProvinceEstimate[];
  dutchPlaces: DutchPlace[];
};

type SearchResult =
  | {
      kind: "exact";
      city: string;
      province: string;
      minPrice: number;
      minHours: number;
      slug: string;
    }
  | {
      kind: "province-fallback";
      city: string;
      province: string;
      minPrice: number;
      minHours: number;
    };

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function LocationPricingEstimator({
  knownLocationEstimates,
  provinceEstimates,
  dutchPlaces,
}: EstimatorProps) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [notFound, setNotFound] = useState(false);

  const provinceByNormalized = useMemo(() => {
    const map = new Map<string, ProvinceEstimate>();
    for (const item of provinceEstimates) {
      map.set(normalize(item.province), item);
    }
    return map;
  }, [provinceEstimates]);

  const knownByNormalizedCity = useMemo(() => {
    const map = new Map<string, KnownLocationEstimate>();
    for (const item of knownLocationEstimates) {
      const key = normalize(item.city);
      const existing = map.get(key);
      if (!existing) {
        map.set(key, item);
        continue;
      }
      if (item.minPrice < existing.minPrice) {
        map.set(key, item);
        continue;
      }
      if (item.minPrice === existing.minPrice && item.minHours < existing.minHours) {
        map.set(key, item);
      }
    }
    return map;
  }, [knownLocationEstimates]);

  const placeByNormalizedName = useMemo(() => {
    const map = new Map<string, DutchPlace>();
    for (const place of dutchPlaces) {
      const key = normalize(place.name);
      if (!map.has(key)) {
        map.set(key, place);
      }
    }
    return map;
  }, [dutchPlaces]);

  const suggestions = useMemo(() => {
    const normalizedQuery = normalize(query);
    if (normalizedQuery.length < 2) return [];

    const merged = new Map<string, { label: string; province: string }>();

    for (const known of knownLocationEstimates) {
      const normalizedName = normalize(known.city);
      if (!normalizedName.includes(normalizedQuery)) continue;
      const key = `${normalizedName}|${normalize(known.province)}`;
      if (!merged.has(key)) {
        merged.set(key, { label: known.city, province: known.province });
      }
      if (merged.size >= 8) break;
    }

    if (merged.size < 8) {
      for (const place of dutchPlaces) {
        const normalizedName = normalize(place.name);
        if (!normalizedName.includes(normalizedQuery)) continue;
        const key = `${normalizedName}|${normalize(place.province)}`;
        if (!merged.has(key)) {
          merged.set(key, { label: place.name, province: place.province });
        }
        if (merged.size >= 8) break;
      }
    }

    return Array.from(merged.values());
  }, [query, knownLocationEstimates, dutchPlaces]);

  function resolveEstimate(rawInput: string) {
    const normalizedInput = normalize(rawInput);
    if (!normalizedInput) return;

    const exactLocation = knownByNormalizedCity.get(normalizedInput);
    if (exactLocation) {
      setResult({
        kind: "exact",
        city: exactLocation.city,
        province: exactLocation.province,
        minPrice: exactLocation.minPrice,
        minHours: exactLocation.minHours,
        slug: exactLocation.slug,
      });
      setNotFound(false);
      return;
    }

    const place = placeByNormalizedName.get(normalizedInput);
    if (place) {
      const provinceEstimate = provinceByNormalized.get(normalize(place.province));
      if (provinceEstimate && provinceEstimate.provinceMinPrice > 0) {
        setResult({
          kind: "province-fallback",
          city: place.name,
          province: place.province,
          minPrice: provinceEstimate.provinceMinPrice,
          minHours: provinceEstimate.provinceMinHours,
        });
        setNotFound(false);
        return;
      }
    }

    setResult(null);
    setNotFound(true);
  }

  return (
    <div className="rounded-luxury border border-primary/40 bg-[#161E21] p-5 shadow-[0_0_0_1px_rgba(226,183,20,0.12)] md:p-6">
      <p className="inline-flex rounded-full border border-primary/50 bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
        Directe prijscheck
      </p>
      <h2 className="mt-3 font-heading text-2xl font-bold text-foreground">Schatting op jouw woonplaats</h2>
      <p className="mt-2 max-w-2xl text-sm text-foreground/80">
        Typ je stad of woonplaats. Je krijgt dan een richtprijs op basis van de laagste
        prijscombinatie in je provincie.
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <div className="flex flex-col gap-3 md:flex-row">
          <label className="sr-only" htmlFor="location-search">
            Zoek op woonplaats
          </label>
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/45" />
            <input
              id="location-search"
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  resolveEstimate(query);
                }
              }}
              placeholder="Bijv. Almelo, Dokkum, Valkenburg..."
              className="w-full rounded-lg border border-white/15 bg-black/20 py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-foreground/45 focus:border-primary/60 focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={() => resolveEstimate(query)}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          >
            Toon schatting
          </button>
        </div>

        {suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={`${suggestion.label}-${suggestion.province}`}
                type="button"
                onClick={() => {
                  setQuery(suggestion.label);
                  resolveEstimate(suggestion.label);
                }}
                className="rounded-full border border-white/15 px-3 py-1 text-xs text-foreground/80 hover:border-primary/50 hover:text-foreground"
              >
                {suggestion.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {result && (
        <div className="mt-4 rounded-lg border border-primary/40 bg-black/25 p-4 text-sm">
          <p className="text-foreground">
            Vanaf <span className="font-semibold text-primary">{formatEuro(result.minPrice)}</span> voor{" "}
            <span className="font-semibold">{formatHours(result.minHours)}</span>
            {" in "}
            <span className="font-semibold">{result.city}</span>.
          </p>

          {result.kind === "exact" ? (
            <p className="mt-2 text-foreground/80">
              Voor deze plaats hebben we een locatiepagina met gerichtere indicatie.{" "}
              <Link href={`/${result.slug}`} className="inline-flex items-center gap-1 text-primary hover:underline">
                Bekijk locatiepagina
                <ArrowRight className="h-4 w-4" />
              </Link>
            </p>
          ) : (
            <p className="mt-2 text-foreground/75">
              Dit is een prijsindicatie, neem contact op via de{" "}
              <Link href="/contact" className="text-primary hover:underline">
                live chat
              </Link>{" "}
              voor een uiteindelijk aanbod.
            </p>
          )}
        </div>
      )}

      {notFound && (
        <div className="mt-4 rounded-lg border border-white/10 bg-black/20 p-4 text-sm text-foreground/75">
          We konden nog geen passende woonplaatsmatch maken. Neem contact op voor een exacte prijscheck.
        </div>
      )}
    </div>
  );
}
