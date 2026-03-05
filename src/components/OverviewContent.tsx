"use client";

import { ProfileCard } from "@/app/components/domain/profile-card";
import { profileToCardProps } from "@/lib/api";
import type { Profile } from "@/lib/types/profile";
import { FilterPanel } from "@/src/components/filters/FilterPanel";
import { MobileFilterModal } from "@/src/components/filters/MobileFilterModal";
import { FilterProvider } from "@/src/contexts/FilterContext";
import { useFilterData } from "@/src/hooks/useFilterData";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/app/components/ui/scroll-reveal";

function OverviewContentInner({ profiles }: { profiles: Profile[] }) {
  const data = useFilterData(profiles);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-end gap-3">
        <div className="flex items-center gap-2">
          <MobileFilterModal data={data} />
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[240px_1fr]">
        <ScrollReveal animation="fade-right" duration={0.45}>
          <FilterPanel data={data} />
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-2 gap-6 md:grid-cols-3" staggerDelay={0.05}>
          {data.filteredProfiles.map((profile) => (
            <StaggerItem key={profile.id} animation="fade-up">
              <ProfileCard {...profileToCardProps(profile)} />
            </StaggerItem>
          ))}
        </StaggerContainer>
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
