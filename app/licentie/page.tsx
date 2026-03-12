import type { Metadata } from "next";
import {
  LegalContactBlock,
  LegalDocumentHeader,
  LegalHighlight,
  LegalList,
  LegalSection,
  LegalSubsection,
  LegalTableOfContents,
  RelatedLegalDocuments,
} from "../components/domain/legal-section";
import { PageLayout, PageSection } from "../components/layout/page-layout";

const tocItems = [
  { id: "vergunning", number: 1, title: "Vergunning en registraties" },
  { id: "keurmerk", number: 2, title: "Keurmerk en kwaliteitsborging" },
  { id: "wetgeving", number: 3, title: "Toepasselijke wet- en regelgeving" },
  { id: "waarom", number: 4, title: "Waarom dit belangrijk is voor jou" },
];

export const metadata: Metadata = {
  title: "Licentie Desire Escorts | Vergunning & Betrouwbaarheid",
  description:
    "Bekijk informatie over de licentie en kwaliteitsstandaarden van Desire Escorts, inclusief vergunningsnummer, compliance en betrouwbare dienstverlening.",
  alternates: {
    canonical: "https://desire-escorts.nl/licentie/",
    languages: {
      "nl-NL": "https://desire-escorts.nl/licentie/",
      "en-US": "https://desire-escorts.nl/en/license/",
    },
  },
};

export default function LicensePage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://desire-escorts.nl/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Licentie",
        item: "https://desire-escorts.nl/licentie/",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PageLayout breadcrumbs={[{ label: "Home", href: "/" }, { label: "Licentie" }]}>
        <PageSection size="sm" className="pb-0">
          <LegalDocumentHeader title="Licentie en Betrouwbaarheid" lastUpdated="12 maart 2026" />
          <p className="max-w-4xl text-foreground/70">
            Transparantie en compliance zijn belangrijk binnen onze dienstverlening. Op deze pagina
            vind je de belangrijkste informatie over vergunningen, toezicht en kwaliteitsborging.
          </p>
        </PageSection>

        <PageSection size="sm">
          <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="h-fit lg:sticky lg:top-24">
              <LegalTableOfContents items={tocItems} />
            </aside>

            <div className="space-y-10">
              <LegalSection
                id="vergunning"
                number={1}
                title="Vergunning en registraties"
                content={
                  <>
                    <p className="text-foreground/80">
                      Desire Escorts opereert op basis van een officiele vergunning voor escort-
                      dienstverlening.
                    </p>
                    <LegalList
                      items={[
                        "Vermeld licentienummer: D18.000305.",
                        "Dienstverlening met focus op wettelijke naleving en veiligheid.",
                        "Controle op leeftijdsgrens (18+) en identiteitsverificatie bij eerste boeking.",
                      ]}
                    />
                    <LegalHighlight type="important">
                      Deze pagina is bedoeld als transparantie-overzicht en vervangt geen juridisch
                      advies van bevoegde instanties.
                    </LegalHighlight>
                  </>
                }
              />

              <LegalSection
                id="keurmerk"
                number={2}
                title="Keurmerk en kwaliteitsborging"
                content={
                  <>
                    <p className="text-foreground/80">
                      Naast vergunningen hechten wij waarde aan aantoonbare kwaliteitsstandaarden,
                      heldere communicatie en discrete afhandeling.
                    </p>
                    <LegalSubsection
                      number="2.1"
                      title="Wat dit in de praktijk betekent"
                      content={
                        <LegalList
                          items={[
                            "Duidelijke afspraken over tarieven, boeking en annulering.",
                            "Respectvolle omgang, veiligheidsprotocollen en zero tolerance beleid.",
                            "Privacy-bescherming van clientgegevens volgens AVG/GDPR.",
                          ]}
                        />
                      }
                    />
                  </>
                }
              />

              <LegalSection
                id="wetgeving"
                number={3}
                title="Toepasselijke wet- en regelgeving"
                content={
                  <>
                    <p className="text-foreground/80">
                      Nederlandse regels vereisen dat escortbureaus voldoen aan lokale en nationale
                      kaders voor legale bedrijfsvoering, veiligheid en administratie.
                    </p>
                    <LegalList
                      items={[
                        "Naleving van relevante gemeentelijke vergunningseisen.",
                        "Naleving van 18+ controle en identiteitsverificatie.",
                        "Naleving van fiscale en administratieve verplichtingen.",
                      ]}
                    />
                  </>
                }
              />

              <LegalSection
                id="waarom"
                number={4}
                title="Waarom dit belangrijk is voor jou"
                content={
                  <LegalList
                    items={[
                      "Meer duidelijkheid over betrouwbaarheid en werkwijze.",
                      "Beter inzicht in veiligheid, privacy en wettelijke randvoorwaarden.",
                      "Een professionele basis voor een discrete dienstverlening.",
                    ]}
                  />
                }
              />

              <LegalContactBlock
                title="Vraag over onze licentie?"
                description="Neem contact op als je aanvullende vragen hebt over vergunningen, compliance of werkwijze."
                email="info@desire-escorts.nl"
              />

              <RelatedLegalDocuments
                documents={[
                  { title: "Algemene Voorwaarden", href: "/algemene-voorwaarden" },
                  { title: "Privacybeleid", href: "/privacybeleid" },
                  { title: "Cookiebeleid", href: "/cookiebeleid" },
                ]}
              />
            </div>
          </div>
        </PageSection>
      </PageLayout>
    </>
  );
}
