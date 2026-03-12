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
  { id: "gegevens", number: 1, title: "Welke gegevens verzamelen wij?" },
  { id: "doel", number: 2, title: "Doel van de gegevensverwerking" },
  { id: "delen", number: 3, title: "Delen en beveiligen van gegevens" },
  { id: "bewaartermijn", number: 4, title: "Bewaartermijnen" },
  { id: "rechten", number: 5, title: "Jouw rechten (AVG/GDPR)" },
];

export const metadata: Metadata = {
  title: "Privacybeleid Desire Escorts | AVG/GDPR en Discretie",
  description:
    "Lees hoe Desire Escorts persoonsgegevens verwerkt, beveiligt en bewaart volgens AVG/GDPR. Inclusief bewaartermijnen, rechten en gegevensdeling.",
  alternates: {
    canonical: "https://desire-escorts.nl/privacybeleid/",
    languages: {
      "nl-NL": "https://desire-escorts.nl/privacybeleid/",
      "en-US": "https://desire-escorts.nl/en/privacy-policy/",
    },
  },
};

export default function PrivacyPolicyPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://desire-escorts.nl/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Privacybeleid",
        item: "https://desire-escorts.nl/privacybeleid/",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PageLayout breadcrumbs={[{ label: "Home", href: "/" }, { label: "Privacybeleid" }]}>
        <PageSection size="sm" className="pb-0">
          <LegalDocumentHeader title="Privacybeleid" lastUpdated="12 maart 2026" version="1.0" />
          <p className="max-w-4xl text-foreground/70">
            Desire Escorts respecteert en beschermt de privacy van clienten. Discretie staat centraal
            in onze dienstverlening en wij handelen conform AVG/GDPR.
          </p>
        </PageSection>

        <PageSection size="sm">
          <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="h-fit lg:sticky lg:top-24">
              <LegalTableOfContents items={tocItems} />
            </aside>

            <div className="space-y-10">
              <LegalSection
                id="gegevens"
                number={1}
                title="Welke gegevens verzamelen wij?"
                content={
                  <>
                    <p className="text-foreground/80">
                      We verzamelen alleen gegevens die nodig zijn voor een veilige, legale en
                      professionele dienstverlening.
                    </p>
                    <LegalList
                      items={[
                        "Contactgegevens: naam (of alias), e-mailadres en telefoonnummer.",
                        "Locatiegegevens voor outcall-afspraken.",
                        "Identificatie: geldig ID voor leeftijds- en identiteitscontrole.",
                        "Financiele gegevens voor aanbetaling en administratie.",
                      ]}
                    />
                    <LegalSubsection
                      number="1.1"
                      title="Live chat en communicatie"
                      content={
                        <p className="text-foreground/80">
                          Via de live chat kunnen sessiemetadata en gespreksinhoud worden verwerkt om
                          je boeking af te handelen en afspraken vast te leggen.
                        </p>
                      }
                    />
                  </>
                }
              />

              <LegalSection
                id="doel"
                number={2}
                title="Doel van de gegevensverwerking"
                content={
                  <>
                    <p className="text-foreground/80">
                      Verwerking gebeurt op basis van uitvoering van overeenkomst, gerechtvaardigd
                      belang en wettelijke verplichtingen.
                    </p>
                    <LegalList
                      items={[
                        "Identiteitsverificatie en 18+ controle.",
                        "Planning, bevestiging en logistieke uitvoering van de afspraak.",
                        "Klantenservice, communicatie en klachtafhandeling.",
                        "Financiele administratie en fiscale bewaarplicht.",
                      ]}
                    />
                  </>
                }
              />

              <LegalSection
                id="delen"
                number={3}
                title="Delen en beveiligen van gegevens"
                content={
                  <>
                    <LegalSubsection
                      number="3.1"
                      title="Delen met derden"
                      content={
                        <>
                          <p className="text-foreground/80">
                            Escorts ontvangen uitsluitend noodzakelijke logistieke gegevens (zoals
                            alias en locatie). Volledige ID-gegevens worden niet gedeeld.
                          </p>
                          <p className="text-foreground/80">
                            Met technische verwerkers werken wij op basis van passende
                            verwerkersafspraken.
                          </p>
                        </>
                      }
                    />
                    <LegalSubsection
                      number="3.2"
                      title="Beveiliging"
                      content={
                        <>
                          <LegalList
                            items={[
                              "Opslag op beveiligde systemen binnen de EER waar mogelijk.",
                              "Toegangsbeperking op basis van noodzakelijkheid.",
                              "Aanvullende bescherming voor gevoelige identificatiegegevens.",
                            ]}
                          />
                          <LegalHighlight type="important">
                            We verwerken nooit meer persoonsgegevens dan noodzakelijk voor het doel.
                          </LegalHighlight>
                        </>
                      }
                    />
                  </>
                }
              />

              <LegalSection
                id="bewaartermijn"
                number={4}
                title="Bewaartermijnen"
                content={
                  <LegalList
                    items={[
                      "ID-gegevens: zo kort mogelijk, alleen zolang nodig voor controle en compliance.",
                      "Boekings- en transactiegegevens: conform wettelijke bewaarplicht (meestal 7 jaar).",
                      "Communicatiegegevens: periodiek opgeschoond waar mogelijk.",
                    ]}
                  />
                }
              />

              <LegalSection
                id="rechten"
                number={5}
                title="Jouw rechten (AVG/GDPR)"
                content={
                  <>
                    <LegalList
                      items={[
                        "Recht op inzage in verwerkte persoonsgegevens.",
                        "Recht op correctie van onjuiste gegevens.",
                        "Recht op verwijdering waar dit wettelijk mogelijk is.",
                        "Recht op beperking of bezwaar tegen verwerking in specifieke situaties.",
                      ]}
                    />
                    <p className="text-foreground/80">
                      Voor verzoeken kun je contact opnemen via de contactpagina of mailen naar{" "}
                      <a className="text-primary hover:underline" href="mailto:info@desire-escorts.nl">
                        info@desire-escorts.nl
                      </a>
                      .
                    </p>
                  </>
                }
              />

              <LegalContactBlock
                title="Privacyvraag of AVG-verzoek?"
                description="Stuur je verzoek met een duidelijke omschrijving zodat we je sneller kunnen helpen."
                email="info@desire-escorts.nl"
              />

              <RelatedLegalDocuments
                documents={[
                  { title: "Algemene Voorwaarden", href: "/algemene-voorwaarden" },
                  { title: "Licentie", href: "/licentie" },
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
