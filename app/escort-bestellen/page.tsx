import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  BadgeEuro,
  CheckCircle2,
  Clock3,
  CreditCard,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { CTASection } from "../components/domain/cta-section";
import { FAQ } from "../components/domain/faq";
import { HowToSteps } from "../components/domain/how-to-steps";
import { TemplateHeroGlass } from "../components/domain/template-hero-glass";
import { PageLayout, PageSection } from "../components/layout/page-layout";
import { PaymentIcons } from "../components/ui/payment-icons";
import { ScrollReveal } from "../components/ui/scroll-reveal";

const bookingSteps = [
  {
    title: "Kies jouw escort of service",
    description:
      "Bekijk beschikbare profielen en kies wat past bij je voorkeur: type escort, service en gewenste sfeer van de afspraak.",
  },
  {
    title: "Bepaal waar en wanneer",
    description:
      "Geef je stad, locatie en gewenste tijd door. We stemmen beschikbaarheid direct af en plannen een discreet tijdslot.",
  },
  {
    title: "Bevestig je aanvraag",
    description:
      "Neem contact op via live chat, WhatsApp of telefoon. Je krijgt snel duidelijkheid over mogelijkheden en totaalprijs vooraf.",
  },
  {
    title: "Discreet ontvangst op locatie",
    description:
      "Na bevestiging komt de escort op het afgesproken moment naar jouw locatie. Altijd met focus op privacy en rust.",
  },
  {
    title: "Betalen op een manier die bij je past",
    description:
      "Je rekent vooraf de service af via een passende betaalmethode. We bieden meerdere veilige en praktische opties.",
  },
  {
    title: "Ontspan en geniet",
    description:
      "Als alles geregeld is, kun je volledig ontspannen. Wij zorgen dat het traject van aanvraag tot afspraak duidelijk en professioneel blijft.",
  },
];

const bookingFaq = [
  {
    question: "Hoe snel kan ik een escort afspraak plannen?",
    answer:
      "In veel gevallen kan dit op korte termijn. Deel je locatie en gewenste tijd via chat of telefoon, dan checken we direct wat beschikbaar is.",
  },
  {
    question: "Moet ik vooraf betalen?",
    answer:
      "De betaling wordt vooraf aan de afspraak afgestemd. Je ontvangt vooraf duidelijkheid over het totaalbedrag en de betaalopties.",
  },
  {
    question: "Is mijn aanvraag discreet?",
    answer:
      "Ja. Discretie staat centraal in onze werkwijze. We communiceren direct, professioneel en delen alleen informatie die nodig is voor je booking.",
  },
  {
    question: "Wat als dit mijn eerste keer is?",
    answer:
      "Geen probleem. We begeleiden je stap voor stap en adviseren welke service en planning het beste passen bij je wensen.",
  },
];

const relatedLinks = [
  { label: "Bekijk alle escorts", href: "/alle-escorts" },
  { label: "Bekijk tarieven", href: "/prijzen" },
  { label: "Lees de FAQ", href: "/faq" },
  { label: "Eerste keer escort boeken", href: "/first-time-experience" },
];

export const metadata: Metadata = {
  title: "Hoe Werkt Escort Bestellen? | Vanaf EUR160 | Desire Escorts",
  description:
    "Leer stap voor stap hoe escort bestellen werkt bij Desire Escorts. Duidelijke procedure, snelle bevestiging, discrete service en meerdere betaalopties.",
  alternates: {
    canonical: "https://desire-escorts.nl/escort-bestellen/",
    languages: {
      "nl-NL": "https://desire-escorts.nl/escort-bestellen/",
      "en-US": "https://desire-escorts.nl/en/order-an-escort/",
    },
  },
};

export default function EscortBestellenPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://desire-escorts.nl/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Hoe Het Werkt",
        item: "https://desire-escorts.nl/escort-bestellen/",
      },
    ],
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Hoe werkt een escort bestellen?",
    description:
      "Stappenplan voor het discreet boeken van een escort bij Desire Escorts.",
    totalTime: "PT15M",
    supply: [
      {
        "@type": "HowToSupply",
        name: "Voorkeuren (escort, locatie, tijd)",
      },
    ],
    step: bookingSteps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.description,
      url: "https://desire-escorts.nl/escort-bestellen/",
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: bookingFaq.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <PageLayout>
        <PageSection size="sm" className="pb-0">
          <ScrollReveal>
            <TemplateHeroGlass
              breadcrumbs={[{ label: "Hoe Het Werkt" }]}
              title="Hoe werkt een escort bestellen?"
              description="Van eerste keuze tot bevestiging: op deze pagina zie je precies hoe het bookingproces verloopt. Snel, duidelijk en altijd discreet."
              uspItems={[
                { icon: <Clock3 className="h-5 w-5" />, title: "Snelle bevestiging" },
                { icon: <ShieldCheck className="h-5 w-5" />, title: "Volledig discreet" },
                { icon: <BadgeEuro className="h-5 w-5" />, title: "Vanaf EUR160" },
              ]}
            />
          </ScrollReveal>
        </PageSection>

        <PageSection size="sm">
          <ScrollReveal delay={0.06}>
            <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
                  Alles wat je moet weten voor een soepele booking
                </h2>
                <p className="mt-4 text-foreground/70">
                  We houden het proces bewust eenvoudig. Jij kiest de escort en
                  service, wij begeleiden de planning en bevestiging. Zo weet je
                  vooraf precies waar je aan toe bent.
                </p>
                <p className="mt-3 text-foreground/70">
                  Heb je vragen over beschikbaarheid, locatie of verwachtingen?
                  Dan helpen we je direct verder via live chat, WhatsApp of
                  telefoon.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/alle-escorts"
                    className="inline-flex items-center gap-2 rounded-luxury bg-primary px-6 py-3 font-heading font-bold text-background transition-colors hover:bg-primary/90"
                  >
                    Bekijk alle escorts
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-luxury border border-white/20 px-6 py-3 font-heading font-bold text-foreground/80 transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    Neem contact op
                  </Link>
                </div>
              </div>

              <div className="relative aspect-[4/3] overflow-hidden rounded-luxury border border-white/10">
                <Image
                  src="https://desire-escorts.nl/wp-content/uploads/escort-bestellen-960x691.webp"
                  alt="Brunette escort in witte lingerie en rode lippenstift aan de telefoon"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </ScrollReveal>
        </PageSection>

        <PageSection size="sm">
          <ScrollReveal delay={0.08}>
            <HowToSteps
              eyebrow="Stap voor stap"
              title="In 6 stappen jouw afspraak geregeld"
              steps={bookingSteps}
              variant="timeline"
            />
          </ScrollReveal>
        </PageSection>

        <PageSection size="sm">
          <ScrollReveal delay={0.1}>
            <div className="rounded-luxury border border-white/10 bg-surface/35 p-6 md:p-8">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-primary" />
                <h2 className="font-heading text-2xl font-bold text-foreground">
                  Betaalmethoden en discretie
                </h2>
              </div>
              <p className="mt-3 max-w-3xl text-foreground/70">
                Vooraf stemmen we helder af hoe de betaling verloopt. Je kiest
                een methode die voor jou prettig is, zodat alles soepel en zonder
                verrassingen verloopt.
              </p>
              <PaymentIcons className="mt-5" iconSize="lg" />
              <ul className="mt-6 grid gap-3 text-foreground/75 md:grid-cols-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  Vooraf duidelijkheid over totaalprijs en planning.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  Discrete communicatie via beveiligde kanalen.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  Geen onduidelijkheid over duur en locatievoorwaarden.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  Persoonlijke begeleiding, ook als het je eerste keer is.
                </li>
              </ul>
            </div>
          </ScrollReveal>
        </PageSection>

        <PageSection size="sm">
          <ScrollReveal delay={0.12}>
            <div className="rounded-luxury border border-primary/25 bg-primary/5 p-6 md:p-8">
              <div className="flex items-center gap-2 text-primary">
                <MessageCircle className="h-5 w-5" />
                <span className="text-sm font-medium uppercase tracking-wider">
                  Eerste keer escort boeken?
                </span>
              </div>
              <h2 className="mt-3 font-heading text-2xl font-bold text-foreground md:text-3xl">
                Lees eerst de First Time Experience gids
              </h2>
              <p className="mt-3 max-w-3xl text-foreground/70">
                Ben je nieuw met escort services? In onze gids vind je praktische
                uitleg over voorbereiding, etiquette en wat je tijdens de afspraak
                kunt verwachten.
              </p>
              <Link
                href="/first-time-experience"
                className="mt-5 inline-flex items-center rounded-luxury border border-primary/35 px-5 py-2.5 font-medium text-primary transition-colors hover:border-primary/60 hover:bg-primary/10"
              >
                Naar First Time Experience
              </Link>
            </div>
          </ScrollReveal>
        </PageSection>

        <PageSection size="sm">
          <ScrollReveal delay={0.14}>
            <div className="mb-8">
              <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
                Handige vervolgstappen
              </h2>
              <p className="mt-2 text-foreground/70">
                Ga direct door naar de pagina die je nu nodig hebt.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {relatedLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-luxury border border-white/10 bg-surface/30 p-4 font-medium text-foreground/80 transition-colors hover:border-primary/40 hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </ScrollReveal>
        </PageSection>

        <PageSection size="sm">
          <ScrollReveal delay={0.16}>
            <FAQ
              eyebrow="Veelgestelde vragen"
              title="Over het bookingproces"
              items={bookingFaq}
            />
          </ScrollReveal>
        </PageSection>

        <PageSection size="sm">
          <ScrollReveal delay={0.18}>
            <CTASection
              eyebrow="Escort bestellen"
              title="Start vandaag nog je aanvraag"
              description="Deel je voorkeuren, tijd en locatie. We helpen je direct met een passende en discrete booking."
            />
          </ScrollReveal>
        </PageSection>
      </PageLayout>
    </>
  );
}
