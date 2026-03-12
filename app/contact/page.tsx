import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpenCheck,
  CircleHelp,
  Clock3,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { CTASection } from "../components/domain/cta-section";
import { FAQ } from "../components/domain/faq";
import { TemplateHeroGlass } from "../components/domain/template-hero-glass";
import { PageLayout, PageSection } from "../components/layout/page-layout";
import { WhatsAppIcon } from "../components/ui/whatsapp-icon";

const contactFaq = [
  {
    question: "Hoe snel krijg ik reactie op mijn bericht?",
    answer:
      "Via WhatsApp of telefoon reageren we meestal direct. Via e-mail krijg je doorgaans binnen enkele uren antwoord tijdens service-uren.",
  },
  {
    question: "Welke informatie moet ik meesturen voor een snelle booking?",
    answer:
      "Deel bij voorkeur je stad, gewenste tijd, duur van de afspraak en eventuele voorkeuren. Zo kunnen we sneller beschikbaarheid checken.",
  },
  {
    question: "Kan ik eerst advies krijgen voordat ik boek?",
    answer:
      "Ja. Je kunt vrijblijvend contact opnemen voor advies over beschikbaarheid, tarieven en een passende match.",
  },
];

export const metadata: Metadata = {
  title: "Contact Desire Escorts | 24/7 service vanaf €160",
  description:
    "Neem direct contact op met Desire Escorts via telefoon, WhatsApp of e-mail. Discreet, snel en persoonlijk geholpen bij vragen of een booking.",
  alternates: {
    canonical: "https://desire-escorts.nl/contact/",
    languages: {
      "nl-NL": "https://desire-escorts.nl/contact/",
      "en-US": "https://desire-escorts.nl/en/contact/",
    },
  },
};

export default function ContactPage() {
  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Desire Escorts",
    url: "https://desire-escorts.nl/contact/",
    mainEntity: {
      "@type": "Organization",
      name: "Desire Escorts",
      url: "https://desire-escorts.nl/",
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          telephone: "+31642188911",
          areaServed: "NL",
          availableLanguage: ["nl", "en"],
        },
      ],
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: contactFaq.map((faq) => ({
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <PageLayout>
        <PageSection size="sm" className="pb-0">
          <TemplateHeroGlass
            breadcrumbs={[{ label: "Contact" }]}
            title="Contact opnemen met Desire Escorts"
            description="Wil je direct boeken of heb je eerst een vraag? Neem contact op via telefoon, WhatsApp of e-mail. We reageren snel en altijd discreet."
            uspItems={[
              { icon: <Clock3 className="h-5 w-5" />, title: "Snelle reactie" },
              { icon: <ShieldCheck className="h-5 w-5" />, title: "Volledig discreet" },
              { icon: <MessageCircle className="h-5 w-5" />, title: "Persoonlijke service" },
            ]}
          />
        </PageSection>

        <PageSection size="sm" title="Direct contactmogelijkheden">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <a
              href="tel:+31642188911"
              className="rounded-luxury border border-white/10 bg-surface/35 p-6 transition-colors hover:border-primary/40"
            >
              <Phone className="mb-3 h-6 w-6 text-primary" />
              <h2 className="text-lg font-heading font-bold text-foreground">Bel direct</h2>
              <p className="mt-2 text-foreground/70">+31 6 42188911</p>
            </a>

            <a
              href="https://steadfast-art-a1f81485c3.strapiapp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-luxury border border-white/10 bg-surface/35 p-6 transition-colors hover:border-primary/40"
            >
              <WhatsAppIcon size={24} className="mb-3 text-primary" />
              <h2 className="text-lg font-heading font-bold text-foreground">WhatsApp</h2>
              <p className="mt-2 text-foreground/70">Start direct een gesprek</p>
            </a>

            <a
              href="mailto:info@desire-escorts.nl"
              className="rounded-luxury border border-white/10 bg-surface/35 p-6 transition-colors hover:border-primary/40"
            >
              <Mail className="mb-3 h-6 w-6 text-primary" />
              <h2 className="text-lg font-heading font-bold text-foreground">E-mail</h2>
              <p className="mt-2 break-all text-foreground/70">info@desire-escorts.nl</p>
            </a>
          </div>
        </PageSection>

        <PageSection size="sm" title="Eerst meer informatie nodig?">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Link
              href="/faq"
              className="rounded-luxury border border-white/10 bg-surface/30 p-6 transition-colors hover:border-primary/40"
            >
              <CircleHelp className="mb-3 h-6 w-6 text-primary" />
              <h2 className="text-lg font-heading font-bold text-foreground">Veelgestelde vragen</h2>
              <p className="mt-2 text-foreground/70">
                Bekijk snelle antwoorden over boekingen, betaling, discretie en beschikbaarheid.
              </p>
              <span className="mt-4 inline-block text-sm font-medium text-primary">Ga naar FAQ</span>
            </Link>

            <Link
              href="/kennisbank"
              className="rounded-luxury border border-white/10 bg-surface/30 p-6 transition-colors hover:border-primary/40"
            >
              <BookOpenCheck className="mb-3 h-6 w-6 text-primary" />
              <h2 className="text-lg font-heading font-bold text-foreground">Kennisbank</h2>
              <p className="mt-2 text-foreground/70">
                Lees uitgebreide uitleg en praktische artikelen per onderwerp.
              </p>
              <span className="mt-4 inline-block text-sm font-medium text-primary">Ga naar Kennisbank</span>
            </Link>
          </div>
        </PageSection>

        <PageSection size="sm">
          <FAQ eyebrow="Veelgestelde vragen" title="Over contact en booking" items={contactFaq} />
        </PageSection>

        <PageSection size="sm">
          <CTASection
            eyebrow="Direct bestellen"
            title="Start direct je aanvraag"
            description="Deel je stad, gewenste tijd en voorkeuren. We bevestigen je mogelijkheden zo snel mogelijk."
          />
        </PageSection>
      </PageLayout>
    </>
  );
}
