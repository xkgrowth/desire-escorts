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
  { id: "algemeen", number: 1, title: "Algemene bepalingen en definities" },
  { id: "tarieven", number: 2, title: "Tarieven, betalingen en annuleringen" },
  { id: "gedrag", number: 3, title: "Gedrag en veiligheid (zero tolerance)" },
  { id: "klachten", number: 4, title: "Klachten en aansprakelijkheid" },
  { id: "slot", number: 5, title: "Slotbepalingen" },
];

export const metadata: Metadata = {
  title: "Algemene Voorwaarden Desire Escorts | Regels & Veiligheid",
  description:
    "Lees de algemene voorwaarden van Desire Escorts over boekingen, aanbetaling, outcall-service, annuleringen en zero tolerance veiligheidsregels.",
  alternates: {
    canonical: "https://desire-escorts.nl/algemene-voorwaarden/",
    languages: {
      "nl-NL": "https://desire-escorts.nl/algemene-voorwaarden/",
      "en-US": "https://desire-escorts.nl/en/terms/",
    },
  },
};

export default function TermsPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://desire-escorts.nl/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Algemene Voorwaarden",
        item: "https://desire-escorts.nl/algemene-voorwaarden/",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PageLayout breadcrumbs={[{ label: "Home", href: "/" }, { label: "Algemene Voorwaarden" }]}>
        <PageSection size="sm" className="pb-0">
          <LegalDocumentHeader
            title="Algemene Voorwaarden"
            lastUpdated="12 maart 2026"
            version="1.0"
          />
          <p className="max-w-4xl text-foreground/70">
            Deze voorwaarden zijn van toepassing op alle diensten en boekingen die via Desire
            Escorts worden aangeboden.
          </p>
        </PageSection>

        <PageSection size="sm">
          <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="h-fit lg:sticky lg:top-24">
              <LegalTableOfContents items={tocItems} />
            </aside>

            <div className="space-y-10">
              <LegalSection
                id="algemeen"
                number={1}
                title="Algemene bepalingen en definities"
                content={
                  <>
                    <p className="text-foreground/80">
                      De overeenkomst komt tot stand zodra de reserveringsaanvraag schriftelijk is
                      bevestigd en de verplichte aanbetaling is ontvangen.
                    </p>
                    <LegalSubsection
                      number="1.1"
                      title="Leeftijdsgrens en verificatie"
                      content={
                        <>
                          <p className="text-foreground/80">
                            Diensten worden uitsluitend verleend aan personen van 18 jaar of ouder.
                            Bij de eerste boeking is ID-verificatie verplicht.
                          </p>
                          <LegalHighlight type="important">
                            Zonder succesvolle verificatie wordt de boeking niet definitief.
                          </LegalHighlight>
                        </>
                      }
                    />
                    <LegalSubsection
                      number="1.2"
                      title="Dienstverlening (outcall only)"
                      content={
                        <p className="text-foreground/80">
                          Wij bieden uitsluitend outcall-diensten aan. De escort behoudt het recht
                          om een onveilige of ongeschikte locatie te weigeren.
                        </p>
                      }
                    />
                  </>
                }
              />

              <LegalSection
                id="tarieven"
                number={2}
                title="Tarieven, betalingen en annuleringen"
                content={
                  <>
                    <LegalSubsection
                      number="2.1"
                      title="Tarieven en betalingen"
                      content={
                        <>
                          <p className="text-foreground/80">
                            Tarieven worden duidelijk gecommuniceerd op profielpagina&apos;s en/of
                            tijdens de boekingsbevestiging.
                          </p>
                          <LegalList
                            items={[
                              "Een aanbetaling is vereist om de boeking te garanderen.",
                              "Restbetaling wordt bij aanvang van de afspraak voldaan.",
                              "Voor online betalingen kan een toeslag van 10% gelden.",
                            ]}
                          />
                        </>
                      }
                    />
                    <LegalSubsection
                      number="2.2"
                      title="Annuleringen"
                      content={
                        <>
                          <p className="text-foreground/80">
                            Bij annulering door de client kan de aanbetaling worden behouden ter
                            compensatie van gereserveerde tijd.
                          </p>
                          <p className="text-foreground/80">
                            Bij annulering door escort of bureau (bijv. overmacht, ziekte of
                            veiligheid) wordt de aanbetaling volledig gerestitueerd.
                          </p>
                        </>
                      }
                    />
                  </>
                }
              />

              <LegalSection
                id="gedrag"
                number={3}
                title="Gedrag en veiligheid (zero tolerance)"
                content={
                  <>
                    <p className="text-foreground/80">
                      Respect, duidelijke grenzen en wederzijdse instemming zijn altijd verplicht.
                    </p>
                    <LegalHighlight type="warning">
                      Overtredingen leiden tot onmiddellijke stopzetting van de afspraak zonder
                      restitutie.
                    </LegalHighlight>
                    <LegalList
                      items={[
                        "Weigeren van condoomgebruik.",
                        "Agressie, dwang, intimiderend of discriminerend gedrag.",
                        "Onder invloed verschijnen van drugs of extreme intoxicatie.",
                        "Foto-, video- of audio-opnames zonder expliciete toestemming.",
                      ]}
                    />
                  </>
                }
              />

              <LegalSection
                id="klachten"
                number={4}
                title="Klachten en aansprakelijkheid"
                content={
                  <>
                    <LegalSubsection
                      number="4.1"
                      title="Klachtenprocedure"
                      content={
                        <p className="text-foreground/80">
                          Klachten over de service dien je binnen 24 uur na de afspraak te melden
                          via live chat of e-mail, zodat wij deze vertrouwelijk kunnen beoordelen.
                        </p>
                      }
                    />
                    <LegalSubsection
                      number="4.2"
                      title="Aansprakelijkheid"
                      content={
                        <p className="text-foreground/80">
                          Desire Escorts treedt op als bemiddelaar en is niet aansprakelijk voor
                          directe of indirecte schade die voortvloeit uit ontmoetingen tussen client
                          en escort.
                        </p>
                      }
                    />
                  </>
                }
              />

              <LegalSection
                id="slot"
                number={5}
                title="Slotbepalingen"
                content={
                  <p className="text-foreground/80">
                    Op deze voorwaarden en overeenkomsten is Nederlands recht van toepassing.
                    Geschillen worden voorgelegd aan de bevoegde rechter in Nederland.
                  </p>
                }
              />

              <LegalContactBlock
                title="Vragen over deze voorwaarden?"
                description="Neem contact op via live chat, WhatsApp of e-mail voor uitleg over deze voorwaarden."
                email="info@desire-escorts.nl"
              />

              <RelatedLegalDocuments
                documents={[
                  { title: "Privacybeleid", href: "/privacybeleid" },
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
