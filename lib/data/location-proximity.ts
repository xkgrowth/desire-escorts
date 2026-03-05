import type { LocationLinkItem } from "./location-detail-pages";

type LocationPoint = {
  label: string;
  href: string;
  lat: number;
  lon: number;
  isCity: boolean;
};

const locationPoints: LocationPoint[] = [
  { label: "Escort Amsterdam", href: "/escort-amsterdam", lat: 52.3676, lon: 4.9041, isCity: true },
  { label: "Escort Haarlem", href: "/escort-haarlem", lat: 52.3874, lon: 4.6462, isCity: true },
  { label: "Escort Amstelveen", href: "/escort-amstelveen", lat: 52.303, lon: 4.8629, isCity: true },
  { label: "Escort Hoofddorp", href: "/escort-hoofddorp", lat: 52.3025, lon: 4.6889, isCity: false },
  { label: "Escort Schiphol", href: "/escort-schiphol", lat: 52.3086, lon: 4.7639, isCity: false },
  { label: "Escort Bloemendaal", href: "/escort-bloemendaal", lat: 52.4025, lon: 4.6229, isCity: false },
  { label: "Escort Aerdenhout", href: "/escort-aerdenhout", lat: 52.3579, lon: 4.6092, isCity: false },
  { label: "Escort Zandvoort", href: "/escort-zandvoort", lat: 52.3713, lon: 4.531, isCity: false },
  { label: "Escort Heemstede", href: "/escort-heemstede", lat: 52.3499, lon: 4.623, isCity: false },
  { label: "Escort IJmuiden", href: "/escort-ijmuiden", lat: 52.4589, lon: 4.6192, isCity: false },
  { label: "Escort Zaandam", href: "/escort-zaandam", lat: 52.442, lon: 4.8292, isCity: false },
  { label: "Escort Leiden", href: "/escort-leiden", lat: 52.1601, lon: 4.497, isCity: true },
  { label: "Escort Alkmaar", href: "/escort-alkmaar", lat: 52.6324, lon: 4.7534, isCity: true },
  { label: "Escort Den Haag", href: "/escort-den-haag", lat: 52.0705, lon: 4.3007, isCity: true },
  { label: "Escort Rotterdam", href: "/escort-rotterdam", lat: 51.9244, lon: 4.4777, isCity: true },
  { label: "Escort Utrecht", href: "/escort-utrecht", lat: 52.0907, lon: 5.1214, isCity: true },
  { label: "Escort Eindhoven", href: "/escort-eindhoven", lat: 51.4416, lon: 5.4697, isCity: true },
];

function haversineKm(from: LocationPoint, to: LocationPoint): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const dLat = toRad(to.lat - from.lat);
  const dLon = toRad(to.lon - from.lon);
  const lat1 = toRad(from.lat);
  const lat2 = toRad(to.lat);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getNearestNearbyLocations(
  currentSlug: string,
  existingNearby: LocationLinkItem[],
  limit = 6
): LocationLinkItem[] {
  const currentHref = `/${currentSlug}`;
  const currentPoint = locationPoints.find((point) => point.href === currentHref);
  if (!currentPoint) {
    return existingNearby.slice(0, limit);
  }

  const ranked = locationPoints
    .filter((point) => point.href !== currentHref)
    .map((point) => ({ point, distance: haversineKm(currentPoint, point) }))
    .sort((a, b) => a.distance - b.distance);

  const nearestCityEntry = ranked.find((entry) => entry.point.isCity);
  const selected = ranked.slice(0, limit);

  if (
    nearestCityEntry &&
    !selected.some((entry) => entry.point.href === nearestCityEntry.point.href)
  ) {
    selected[selected.length - 1] = nearestCityEntry;
    selected.sort((a, b) => a.distance - b.distance);
  }

  return selected.map((entry) => ({ label: entry.point.label, href: entry.point.href }));
}
