import type { Metadata } from "next";
import {
  LegalContactBlock,
  LegalDocumentHeader,
  LegalList,
  LegalSection,
  LegalSubsection,
  LegalTableOfContents,
  RelatedLegalDocuments,
} from "../components/domain/legal-section";
import { PageLayout, PageSection } from "../components/layout/page-layout";

const tocItems = [
  { id: "wat-zijn-cookies", number: 1, title: "Wat zijn cookies?" },
  { id: "welke-cookies", number: 2, title: "Welke cookies gebruiken wij?" },
  { id: "beheer", number: 3, title: "Cookievoorkeuren beheren" },
  { id: "derden", number: 4, title: "Cookies van derde partijen" },
  { id: "wijzigingen", number: 5, title: "Wijzigingen in dit beleid" },
];

export const metadata: Metadata = {
  title: "Cookiebeleid Desire Escorts | Cookies en Voorkeuren",
  description:
    "Lees welke cookies Desire Escorts gebruikt, waarvoor ze dienen en hoe je jouw cookievoorkeuren kunt beheren of aanpassen.",
  alternates: {
    canonical: "https://desire-escorts.nl/cookiebeleid/",
    languages: {
      "nl-NL": "https://desire-escorts.nl/cookiebeleid/",
      "en-US": "https://desire-escorts.nl/en/cookie-policy/",
    },
  },
};

export default function CookiePolicyPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://desire-escorts.nl/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Cookiebeleid",
        item: "https://desire-escorts.nl/cookiebeleid/",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PageLayout breadcrumbs={[{ label: "Home", href: "/" }, { label: "Cookiebeleid" }]}>
        <PageSection size="sm" className="pb-0">
          <LegalDocumentHeader title="Cookiebeleid" lastUpdated="12 maart 2026" version="1.0" />
          <p className="max-w-4xl text-foreground/70">
            Dit cookiebeleid legt uit welke cookies we gebruiken op de website, waarom we dat doen
            en hoe je jouw voorkeuren kunt beheren.
          </p>
        </PageSection>

        <PageSection size="sm">
          <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="h-fit lg:sticky lg:top-24">
              <LegalTableOfContents items={tocItems} />
            </aside>

            <div className="space-y-10">
              <LegalSection
                id="wat-zijn-cookies"
                number={1}
                title="Wat zijn cookies?"
                content={
                  <p className="text-foreground/80">
                    Cookies zijn kleine tekstbestanden die in je browser worden opgeslagen wanneer je
                    onze website bezoekt. Ze helpen ons om de website correct te laten werken en om
                    gebruik te analyseren.
                  </p>
                }
              />

              <LegalSection
                id="welke-cookies"
                number={2}
                title="Welke cookies gebruiken wij?"
                content={
                  <>
                    <LegalSubsection
                      number="2.1"
                      title="Noodzakelijke cookies"
                      content={
                        <LegalList
                          items={[
                            "Zorgen dat basisfuncties van de website werken.",
                            "Kunnen niet worden uitgeschakeld zonder impact op functionaliteit.",
                          ]}
                        />
                      }
                    />
                    <LegalSubsection
                      number="2.2"
                      title="Voorkeurscookies"
                      content={
                        <LegalList
                          items={[
                            "Onthouden jouw instellingen, zoals taalkeuze of cookievoorkeuren.",
                            "Verbeteren gebruiksgemak bij een volgend bezoek.",
                          ]}
                        />
                      }
                    />
                    <LegalSubsection
                      number="2.3"
                      title="Analytische cookies"
                      content={
                        <LegalList
                          items={[
                            "Meten geanonimiseerd gebruik van pagina's en interacties.",
                            "Helpen ons de website en gebruikerservaring te verbeteren.",
                          ]}
                        />
                      }
                    />
                    <LegalSubsection
                      number="2.4"
                      title="Marketingcookies (optioneel)"
                      content={
                        <LegalList
                          items={[
                            "Worden alleen geplaatst met jouw toestemming.",
                            "Kunnen worden gebruikt om relevante campagnes of advertenties te tonen.",
                          ]}
                        />
                      }
                    />
                  </>
                }
              />

              <LegalSection
                id="beheer"
                number={3}
                title="Cookievoorkeuren beheren"
                content={
                  <>
                    <p className="text-foreground/80">
                      Via onze cookiebanner kun je jouw voorkeuren instellen of aanpassen. Daarnaast
                      kun je cookies ook verwijderen of blokkeren via je browserinstellingen.
                    </p>
                    <LegalList
                      items={[
                        "Je kunt niet-noodzakelijke cookies weigeren of later intrekken.",
                        "Wijzigingen worden opgeslagen in je cookievoorkeuren.",
                        "Het uitschakelen van bepaalde cookies kan invloed hebben op functionaliteit.",
                      ]}
                    />
                  </>
                }
              />

              <LegalSection
                id="derden"
                number={4}
                title="Cookies van derde partijen"
                content={
                  <p className="text-foreground/80">
                    Sommige functionaliteiten kunnen gebruikmaken van diensten van derde partijen
                    (zoals analytics- of chattools). Op die cookies en verwerkingen zijn aanvullend
                    de privacy- en cookievoorwaarden van die partijen van toepassing.
                  </p>
                }
              />

              <LegalSection
                id="wijzigingen"
                number={5}
                title="Wijzigingen in dit beleid"
                content={
                  <p className="text-foreground/80">
                    We kunnen dit cookiebeleid periodiek bijwerken. Op deze pagina staat altijd de
                    meest recente versie met de datum van laatste wijziging.
                  </p>
                }
              />

              <LegalContactBlock
                title="Vragen over cookies?"
                description="Neem contact op als je vragen hebt over dit cookiebeleid of het wijzigen van je voorkeuren."
                email="info@desire-escorts.nl"
              />

              <RelatedLegalDocuments
                documents={[
                  { title: "Algemene Voorwaarden", href: "/algemene-voorwaarden" },
                  { title: "Privacybeleid", href: "/privacybeleid" },
                  { title: "Licentie", href: "/licentie" },
                ]}
              />
            </div>
          </div>
        </PageSection>
      </PageLayout>
    </>
  );
}
