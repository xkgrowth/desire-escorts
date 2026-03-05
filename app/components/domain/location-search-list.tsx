"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "../ui/input";

type LocationItem = {
  name: string;
  href: string;
};

type LocationSearchListProps = {
  locations: LocationItem[];
};

export function LocationSearchList({ locations }: LocationSearchListProps) {
  const [query, setQuery] = useState("");

  const filteredLocations = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return locations;
    return locations.filter((location) => location.name.toLowerCase().includes(value));
  }, [locations, query]);

  return (
    <div className="rounded-luxury border border-white/10 bg-surface/25 p-5 md:p-6">
      <div className="mb-4">
        <Input
          id="location-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Zoek op stad of regio..."
          leftIcon={<Search className="h-4 w-4" />}
          aria-label="Zoek locatie"
        />
      </div>

      <ul className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredLocations.map((location) => (
          <li key={location.href}>
            <Link
              href={location.href}
              className="text-sm text-foreground/70 transition-colors hover:text-primary"
            >
              {location.name}
            </Link>
          </li>
        ))}
      </ul>

      {filteredLocations.length === 0 && (
        <p className="mt-4 text-sm text-foreground/60">
          Geen locaties gevonden. Probeer een andere zoekterm.
        </p>
      )}

      <div className="mt-6 border-t border-white/10 pt-4">
        <p className="font-heading text-base font-bold text-foreground">
          Staat jouw plaats er niet bij? Geen zorgen!
        </p>
        <p className="mt-2 text-sm text-foreground/65">
          Desire Escorts is niet alleen gebonden aan deze plaats of regio alleen,
          maar verzorgt ook service in andere steden en gemeentes.
        </p>
      </div>
    </div>
  );
}
