import type { Metadata } from "next";
import {
  Shield,
  Clock,
  Euro,
  Users,
  CheckCircle,
  Heart,
  MapPin,
  Lock,
} from "lucide-react";
import { CTASection } from "../components/domain/cta-section";
import { FAQ } from "../components/domain/faq";
import { TemplateHeroGlass } from "../components/domain/template-hero-glass";
import { PageLayout, PageSection } from "../components/layout/page-layout";
import { GradientTitle } from "../components/ui/gradient-title";
import { JotformEmbed } from "./jotform-embed";

const workFaq = [
  {
    question: "Hoeveel kan ik verdienen als escort?",
    answer:
      "Het inkomen hangt af van je beschikbaarheid en het aantal boekingen. Onze escorts verdienen een aantrekkelijk uurtarief waarbij jij het grootste deel ontvangt. Je bepaalt zelf wanneer en hoeveel je werkt.",
  },
  {
    question: "Moet ik bepaalde diensten aanbieden?",
    answer:
      "Nee, je bepaalt zelf welke diensten je aanbiedt. Bij je aanmelding geef je aan wat jouw grenzen zijn. Deze worden gerespecteerd en duidelijk gecommuniceerd naar klanten.",
  },
  {
    question: "Hoe wordt mijn veiligheid gewaarborgd?",
    answer:
      "Veiligheid staat voorop. Je werkt alleen op veilige locaties zoals hotels of bij de klant thuis. Je kunt een afspraak altijd vroegtijdig beëindigen bij onveiligheid. Condoomgebruik is verplicht bij alle afspraken.",
  },
  {
    question: "Kan ik dit naast mijn studie of andere baan doen?",
    answer:
      "Ja, veel van onze escorts combineren dit werk met een studie of andere baan. Je bepaalt zelf je beschikbaarheid en werktijden. Flexibiliteit is een groot voordeel van werken bij ons.",
  },
  {
    question: "Blijft mijn privacy beschermd?",
    answer:
      "Absoluut. We werken volledig discreet. Je identiteit wordt beschermd en we delen nooit persoonlijke gegevens. Je kunt werken onder een werknaam.",
  },
  {
    question: "Hoe snel kan ik beginnen?",
    answer:
      "Na je aanmelding nemen we contact op voor een kennismakingsgesprek. Bij een positieve match maken we samen je profiel en kun je binnen enkele dagen je eerste boekingen ontvangen.",
  },
];

export const metadata: Metadata = {
  title: "Werken als Escort bij Desire Escorts | Legaal Bureau met Vergunning",
  description:
    "Word escort bij Desire Escorts. Ruim 20 jaar ervaring, legaal bureau met vergunning. Veilige werkomgeving, goede verdiensten en flexibele werktijden. Meld je nu aan.",
  alternates: {
    canonical: "https://desire-escorts.nl/werken-als-escort/",
    languages: {
      "nl-NL": "https://desire-escorts.nl/werken-als-escort/",
      "en-US": "https://desire-escorts.nl/en/work-as-escort/",
    },
  },
};

export default function WerkenAlsEscortPage() {
  const jobPostingSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: "Escort",
    description:
      "Word escort bij Desire Escorts. Aantrekkelijk inkomen, flexibele werktijden en een veilige werkomgeving bij een legaal bureau met vergunning.",
    datePosted: "2024-01-01",
    validThrough: "2025-12-31",
    employmentType: "CONTRACTOR",
    hiringOrganization: {
      "@type": "Organization",
      name: "Desire Escorts",
      sameAs: "https://desire-escorts.nl",
      logo: "https://desire-escorts.nl/brand/logo.svg",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressCountry: "NL",
        addressRegion: "Nederland",
      },
    },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: "EUR",
      value: {
        "@type": "QuantitativeValue",
        minValue: 160,
        unitText: "HOUR",
      },
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: workFaq.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const benefits = [
    {
      icon: <Euro className="h-6 w-6" />,
      title: "Aantrekkelijk inkomen",
      description:
        "Verdien een goed inkomen met tarieven vanaf €160 per uur. Jij ontvangt het grootste deel.",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Flexibele werktijden",
      description:
        "Bepaal zelf wanneer je werkt. Ideaal naast je studie of andere werkzaamheden.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Veilige werkomgeving",
      description:
        "Werk alleen op veilige locaties. Jouw grenzen worden altijd gerespecteerd.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Professionele begeleiding",
      description:
        "Ruim 20 jaar ervaring. We begeleiden je bij elke stap en staan altijd voor je klaar.",
    },
  ];

  const requirements = [
    "Minimaal 21 jaar oud",
    "Je bent comfortabel met intieme contacten",
    "Verzorgd uiterlijk en representatief",
    "Betrouwbaar en discreet",
    "Beschikbaar voor minimaal enkele afspraken per week",
    "In bezit van een geldig legitimatiebewijs",
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <PageLayout>
        <PageSection size="sm" className="pb-0">
          <TemplateHeroGlass
            breadcrumbs={[{ label: "Werken als Escort" }]}
            title="Werken als Escort bij Desire Escorts"
            description="Ben je op zoek naar een betrouwbare en veilige werkplek in de escortbranche? Sluit je aan bij Desire Escorts, een legaal bureau met ruim 20 jaar ervaring. Ontdek hoe jij kunt groeien in een respectvolle omgeving."
            uspItems={[
              { icon: <Shield className="h-5 w-5" />, title: "Legaal bureau met vergunning" },
              { icon: <Clock className="h-5 w-5" />, title: "20+ jaar ervaring" },
              { icon: <Lock className="h-5 w-5" />, title: "Discreet & veilig" },
            ]}
          />
        </PageSection>

        <PageSection size="sm" title="Waarom werken bij Desire Escorts?">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-luxury border border-white/10 bg-surface/35 p-6"
              >
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-heading font-bold text-foreground">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-foreground/70">{benefit.description}</p>
              </div>
            ))}
          </div>
        </PageSection>

        <PageSection size="sm">
          <div className="rounded-luxury border border-white/10 bg-surface/30 p-6 md:p-10">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <span className="mb-2 block text-sm font-medium uppercase tracking-wider text-primary">
                  Jouw veiligheid voorop
                </span>
                <GradientTitle as="h2" size="lg" className="mb-4">
                  Veiligheid & Respect
                </GradientTitle>
                <p className="mb-4 text-foreground/70">
                  Bij ons werk je alleen op veilige locaties, zoals hotels of bij
                  de klant thuis. Jij bepaalt je grenzen en mag een afspraak
                  altijd vroegtijdig beëindigen bij onveiligheid of ongewenste
                  eisen.
                </p>
                <p className="text-foreground/70">
                  We maken een profiel aan waarin jouw diensten duidelijk staan
                  vermeld, zodat klanten weten wat ze kunnen verwachten.
                  Condoomgebruik is verplicht bij alle afspraken — dit beschermt
                  zowel jou als de klant.
                </p>
              </div>
              <div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-foreground/75">
                      Werk alleen op vooraf gescreende, veilige locaties
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-foreground/75">
                      Jouw grenzen worden altijd gerespecteerd en gecommuniceerd
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-foreground/75">
                      24/7 ondersteuning van ons ervaren team
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-foreground/75">
                      Verplicht condoomgebruik voor ieders bescherming
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-foreground/75">
                      Volledige discretie — werk onder een werknaam
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </PageSection>

        <PageSection size="sm" title="Wat vragen wij?">
          <div className="rounded-luxury border border-white/10 bg-surface/35 p-6 md:p-8">
            <div className="grid gap-4 md:grid-cols-2">
              {requirements.map((requirement) => (
                <div key={requirement} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <span className="text-foreground/80">{requirement}</span>
                </div>
              ))}
            </div>
          </div>
        </PageSection>

        <PageSection size="sm" title="Werkgebied">
          <div className="rounded-luxury border border-white/10 bg-surface/35 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-foreground">
                  Actief in heel Nederland
                </h3>
                <p className="mt-2 text-foreground/70">
                  We werken landelijk met focus op de Randstad en grote steden
                  zoals Amsterdam, Rotterdam, Den Haag en Utrecht. Ook in andere
                  regio&apos;s zijn we actief. Je geeft zelf aan in welk gebied
                  je beschikbaar bent.
                </p>
              </div>
            </div>
          </div>
        </PageSection>

        <PageSection
          size="sm"
          title="Interesse? Meld je aan!"
        >
          <div className="rounded-luxury border border-white/10 bg-surface/35 p-4 md:p-6">
            <div className="mb-6 text-center">
              <p className="text-foreground/70">
                Vul onderstaand formulier in en we nemen zo snel mogelijk contact
                met je op voor een vrijblijvend kennismakingsgesprek.
              </p>
            </div>
            <JotformEmbed />
          </div>
        </PageSection>

        <PageSection size="sm">
          <FAQ
            eyebrow="Veelgestelde vragen"
            title="Vragen over werken als escort"
            items={workFaq}
          />
        </PageSection>

        <PageSection size="sm">
          <CTASection
            eyebrow="Vragen?"
            title="Neem contact met ons op"
            description="Heb je vragen over werken bij Desire Escorts? Neem vrijblijvend contact op. We helpen je graag verder."
          />
        </PageSection>
      </PageLayout>
    </>
  );
}
