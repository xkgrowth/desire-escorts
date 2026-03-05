import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Clock3, MapPin, Navigation } from "lucide-react";
import { CTASection } from "../components/domain/cta-section";
import { LocationSearchList } from "../components/domain/location-search-list";
import { TemplateHeroGlass } from "../components/domain/template-hero-glass";
import { PageLayout, PageSection } from "../components/layout/page-layout";
import { ScrollReveal, StaggerContainer, StaggerItem } from "../components/ui/scroll-reveal";

type LocationLink = {
  name: string;
  href: string;
};

const primaryCities: Array<LocationLink & { minPrice: string; minDuration: string }> = [
  { name: "Amsterdam", href: "/escort-amsterdam", minPrice: "€160", minDuration: "1 uur" },
  { name: "Rotterdam", href: "/escort-rotterdam", minPrice: "€350", minDuration: "2 uur" },
  { name: "Den Haag", href: "/escort-den-haag", minPrice: "€350", minDuration: "2 uur" },
  { name: "Utrecht", href: "/escort-utrecht", minPrice: "€200", minDuration: "1 uur" },
  { name: "Eindhoven", href: "/escort-eindhoven", minPrice: "€540", minDuration: "3 uur" },
  { name: "Haarlem", href: "/escort-haarlem", minPrice: "€160", minDuration: "1 uur" },
];

const allLocationNames = [
  "'t Gooi", "Aalsmeer", "Abcoude", "Aerdenhout", "Akersloot", "Alblasserdam",
  "Alkmaar", "Almelo", "Almere", "Alphen aan den Rijn", "Amersfoort", "Amstelveen",
  "Amsterdam", "Amsterdam Centrum", "Amsterdam Noord", "Amsterdam Oost", "Amsterdam West",
  "Amsterdam Zuid", "Anna Paulowna", "Antwerpen", "Arnhem", "Assen", "Assendelft",
  "Avenhorn", "Baambrugge", "Baarn", "Badhoevendorp", "Barendrecht", "Beemster",
  "Bennebroek", "Bergambacht", "Bergen", "Bergschenhoek", "Berkel en Rodenrijs",
  "Beverwijk", "Bilthoven", "Blaricum", "Bleiswijk", "Bloemendaal", "Bodegraven",
  "Bovenkarspel", "Breda", "Breukelen", "Brielle", "Broek in Waterland", "Brussel",
  "Bunnik", "Bunschoten", "Bussum", "Callantsoog", "Capelle aan den IJssel", "Castricum",
  "Culemborg", "De Bilt", "De Lier", "Delfgauw", "Delft", "Den Bosch", "Den Haag",
  "Den Helder", "Diemen", "Dordrecht", "Drenthe", "Driebergen-Rijsenburg", "Duivendrecht",
  "Edam", "Eemnes", "Egmond", "Eindhoven", "Emmen", "Enkhuizen", "Enschede", "Flevoland",
  "Frankfurt", "Friesland", "Gelderland", "Gorinchem", "Gouda", "Groningen", "Grootebroek",
  "Haarlem", "Halfweg", "Harderwijk", "Harmelen", "Heemskerk", "Heemstede", "Heerenveen",
  "Heerhugowaard", "Heerlen", "Heiloo", "Hellevoetsluis", "Hillegom", "Hilversum",
  "Hoek van Holland", "Honselersdijk", "Hoofddorp", "Hoogkarspel", "Hoorn", "Houten",
  "Huizen", "IJmuiden", "IJsselstein", "Julianadorp", "Katwijk", "Koog aan de Zaan",
  "Krimpen aan den IJssel", "Kudelstaart", "Kwintsheul", "Landsmeer", "Laren", "Leerdam",
  "Leeuwarden", "Leiden", "Leiderdorp", "Leidschendam", "Lelystad", "Leusden", "Lijnden",
  "Limburg", "Limmen", "Linschoten", "Lisse", "Loosdrecht", "Lopik", "Maarssen",
  "Maartensdijk", "Maasdijk", "Maassluis", "Medemblik", "Middelburg", "Middelharnis",
  "Middenbeemster", "Mijdrecht", "Monnickendam", "Monster", "Montfoort", "Muiden",
  "Naaldwijk", "Naarden", "Nieuw-Vennep", "Nieuwegein", "Nieuwerkerk aan den IJssel",
  "Nieuwkoop", "Nijmegen", "Noord Holland", "Noordwijk", "Noordwijkerhout", "Obdam",
  "Oegstgeest", "Oosthuizen", "Oostzaan", "Opmeer", "Osdorp", "Oud-Beijerland",
  "Ouderkerk aan de Amstel", "Oudewater", "Overijssel", "Papendrecht", "Petten", "Pijnacker",
  "Poeldijk", "Poortugaal", "Purmerend", "Rhenen", "Rhoon", "Ridderkerk", "Rijswijk",
  "Roelofarendsveen", "Rotterdam", "s'Gravenzande", "Schagen", "Scheveningen", "Schiedam",
  "Schiphol", "Schipluiden", "Schoonhoven", "Schoorl", "Simonshaven", "Sliedrecht",
  "Sloterdijk", "Soest", "Spaarndam", "Spakenburg", "Spanbroek", "Spijkenisse", "Tilburg",
  "Tuitjenhorn", "Uitgeest", "Uithoorn", "Ursem", "Utrecht", "Veenendaal", "Velsen",
  "Venhuizen", "Venlo", "Vianen", "Vinkeveen", "Vlaardingen", "Vogelenzang", "Volendam",
  "Voorburg", "Voorschoten", "Wassenaar", "Wateringen", "Weesp", "Wieringerwerf", "Winkel",
  "Woerden", "Wormer", "Wormerveer", "Woudenberg", "Zaandam", "Zaandijk", "Zaanstad",
  "Zandvoort", "Zeeland", "Zeist", "Zoetermeer", "Zuid Holland", "Zuiderwoude", "Zwaag",
  "Zwanenburg", "Zwolle",
];

const locationSlugOverrides: Record<string, string> = {
  "'t Gooi": "t-gooi",
  "s'Gravenzande": "s-gravenzande",
};

const allLocations: LocationLink[] = allLocationNames.map((name) => ({
  name,
  href: `/escort-${
    locationSlugOverrides[name] ||
    name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/['’]/g, "")
      .replace(/\./g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
  }`,
}));

export const metadata: Metadata = {
  title: "Escort Locaties Nederland | Service in heel Nederland",
  description:
    "Bekijk alle escort locaties in Nederland. Van Amsterdam en Rotterdam tot regionale steden: discrete service, snelle responstijd en landelijke dekking.",
  alternates: {
    canonical: "https://desire-escorts.nl/escort-in-nederland",
    languages: {
      "nl-NL": "https://desire-escorts.nl/escort-in-nederland",
      "en-US": "https://desire-escorts.nl/en/escort-in-the-netherlands",
    },
  },
};

export default function EscortInNederlandPage() {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Escort locaties in Nederland",
    numberOfItems: allLocations.length,
    itemListElement: allLocations.map((location, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Place",
        name: location.name,
        url: `https://desire-escorts.nl${location.href}`,
      },
    })),
  };

  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <PageSection size="sm" className="pb-0">
        <ScrollReveal>
          <TemplateHeroGlass
            breadcrumbs={[{ label: "Escort in Nederland" }]}
            title="Escort In Nederland"
            description="Vind direct de juiste stad of regio voor jouw aanvraag. We zijn actief in heel Nederland met snelle, discrete outcall service en heldere communicatie vooraf."
            uspItems={[
              { icon: <MapPin className="h-5 w-5" />, title: "Landelijke dekking" },
              { icon: <Clock3 className="h-5 w-5" />, title: "Snelle responstijd" },
              { icon: <Building2 className="h-5 w-5" />, title: "Vanaf €160" },
            ]}
          />
        </ScrollReveal>
      </PageSection>

      <PageSection size="sm" className="pt-4 md:pt-6 lg:pt-8">
        <ScrollReveal delay={0.05}>
        <div className="mb-8 rounded-luxury border border-white/10 bg-surface/35 p-6 md:p-8">
          <h2 className="font-heading text-2xl font-bold text-foreground">
            Populaire steden
          </h2>
          <p className="mt-3 max-w-3xl text-foreground/70">
            Minima hieronder zijn gebaseerd op de actuele tarievenpagina. Definitieve prijs en
            minimale afname hangen af van beschikbaarheid, timing en de gekozen escort.
          </p>

          <StaggerContainer className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.07}>
            {primaryCities.map((city) => (
              <StaggerItem key={city.href}>
                <Link
                  href={city.href}
                  className="card-interactive block h-full rounded-luxury p-5 transition-shadow hover:shadow-glow"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-heading text-lg font-bold text-foreground">{city.name}</p>
                      <p className="mt-1 text-sm text-foreground/60">
                        Vanaf {city.minPrice} · Min. afname {city.minDuration}
                      </p>
                    </div>
                    <Navigation className="mt-1 h-5 w-5 text-primary" />
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
        </ScrollReveal>
      </PageSection>

      <PageSection size="sm">
        <ScrollReveal delay={0.08}>
          <div className="mb-6">
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Alle locaties
            </h2>
            <p className="mt-2 text-foreground/65">
              Een compleet overzicht van de locaties die we bedienen, in lijn met de legacy
              locatiepagina. Staat jouw plaats er niet tussen? Neem contact op voor maatwerk.
            </p>
          </div>

          <LocationSearchList locations={allLocations} />
        </ScrollReveal>
      </PageSection>

      <PageSection size="sm">
        <ScrollReveal delay={0.1}>
          <div className="rounded-luxury border border-white/10 bg-surface/35 p-6 md:p-8">
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Dekking en planning
            </h2>
            <p className="mt-3 text-foreground/70">
              Outcall service is beschikbaar door heel Nederland. In de regio Amsterdam kunnen we
              in veel gevallen binnen 1 uur service leveren. Buiten Amsterdam plannen we op basis
              van afstand, beschikbaarheid en het gewenste tijdstip.
            </p>
            <p className="mt-3 text-foreground/70">
              Voor extra snelle selectie kun je direct naar{" "}
              <Link href="/escorts" className="text-primary hover:underline">
                alle escorts
              </Link>{" "}
              gaan of een aanvraag starten via live chat.
            </p>
          </div>
        </ScrollReveal>
      </PageSection>

      <PageSection size="sm">
        <ScrollReveal delay={0.12}>
          <CTASection
            eyebrow="Staat jouw plaats er niet bij?"
            title="Vraag direct beschikbaarheid op"
            description="Noem je locatie en gewenste tijdstip, dan koppelen we je aan de best beschikbare match."
          />
        </ScrollReveal>
      </PageSection>
    </PageLayout>
  );
}
