"use client";

import { ProfileCard } from "@/app/components/domain/profile-card";
import { Button } from "@/app/components/ui/button";
import { profileToCardProps } from "@/lib/api";
import type { Profile } from "@/lib/types/profile";
import { FilterPanel } from "@/src/components/filters/FilterPanel";
import { MobileFilterModal } from "@/src/components/filters/MobileFilterModal";
import { FilterProvider } from "@/src/contexts/FilterContext";
import { useFilterData } from "@/src/hooks/useFilterData";

function OverviewContentInner({ profiles }: { profiles: Profile[] }) {
  const data = useFilterData(profiles);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-foreground/70" data-testid="filtered-count">
          {data.filteredCount} van {data.totalCount} escorts getoond
        </p>
        <div className="flex items-center gap-2">
          <MobileFilterModal data={data} />
          {data.hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={data.clearFilters}>
              Reset filters
            </Button>
          )}
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[300px_1fr]">
        <FilterPanel data={data} />

        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-4">
          {data.filteredProfiles.map((profile) => (
            <ProfileCard key={profile.id} {...profileToCardProps(profile)} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function OverviewContent({ profiles }: { profiles: Profile[] }) {
  return (
    <FilterProvider>
      <OverviewContentInner profiles={profiles} />
    </FilterProvider>
  );
}
