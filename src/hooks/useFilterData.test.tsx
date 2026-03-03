import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import type { Profile } from "@/lib/types/profile";
import { FilterProvider } from "@/src/contexts/FilterContext";
import { useFilterData } from "@/src/hooks/useFilterData";

function buildProfile(overrides: Partial<Profile>): Profile {
  return {
    id: overrides.id ?? 1,
    name: overrides.name ?? "Test Profile",
    slug: overrides.slug ?? `profile-${overrides.id ?? 1}`,
    verified: true,
    featured: false,
    isAvailable: true,
    isHidden: false,
    sortOrder: 1,
    photos: [],
    services: overrides.services ?? [],
    languages: [],
    tags: [],
    attributes: {},
    availability: [],
    age: overrides.age,
    height: overrides.height,
    cupSize: overrides.cupSize,
    postuur: overrides.postuur,
    haarKleur: overrides.haarKleur,
    oogKleur: overrides.oogKleur,
    geaardheid: overrides.geaardheid,
  };
}

function HookHarness({ profiles }: { profiles: Profile[] }) {
  const data = useFilterData(profiles);
  const serviceCountMap = Object.fromEntries(
    data.options.services.map((option) => [option.value, option.count])
  );

  return (
    <div>
      <button onClick={() => data.toggleValue("hairColors", "Blond")} type="button">
        Toggle Blond
      </button>
      <p data-testid="filtered-count">{data.filteredCount}</p>
      <p data-testid="service-gfe">{serviceCountMap.gfe ?? 0}</p>
      <p data-testid="service-dinner-date">{serviceCountMap["dinner-date"] ?? 0}</p>
    </div>
  );
}

describe("useFilterData integration", () => {
  it("updates filtered count and option counts when filters change", async () => {
    const user = userEvent.setup();
    const profiles = [
      buildProfile({ id: 1, slug: "a", services: ["gfe"], haarKleur: "Blond" }),
      buildProfile({ id: 2, slug: "b", services: ["dinner-date"], haarKleur: "Bruin" }),
      buildProfile({ id: 3, slug: "c", services: ["dinner-date"], haarKleur: "Blond" }),
    ];

    render(
      <FilterProvider storageKey="test-filter-storage">
        <HookHarness profiles={profiles} />
      </FilterProvider>
    );

    expect(screen.getByTestId("filtered-count")).toHaveTextContent("3");
    expect(screen.getByTestId("service-gfe")).toHaveTextContent("1");
    expect(screen.getByTestId("service-dinner-date")).toHaveTextContent("2");

    await user.click(screen.getByRole("button", { name: /toggle blond/i }));

    expect(screen.getByTestId("filtered-count")).toHaveTextContent("2");
    expect(screen.getByTestId("service-gfe")).toHaveTextContent("1");
    expect(screen.getByTestId("service-dinner-date")).toHaveTextContent("1");
  });
});
