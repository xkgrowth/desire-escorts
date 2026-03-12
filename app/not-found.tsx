import Link from "next/link";
import { ArrowRight, Home, MapPin, Search } from "lucide-react";
import { Container, PageWrapper, Section } from "./components/ui/page-wrapper";
import { GradientTitle } from "./components/ui/gradient-title";

const quickLinks = [
  {
    href: "/alle-escorts",
    label: "Bekijk alle escorts",
    icon: Search,
  },
  {
    href: "/escort-in-nederland",
    label: "Bekijk locaties in Nederland",
    icon: MapPin,
  },
];

export default function NotFound() {
  return (
    <PageWrapper withGradient>
      <Section size="lg" className="flex min-h-[70vh] items-center">
        <Container size="lg">
          <div className="relative overflow-hidden rounded-luxury border border-white/10 bg-surface/35 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.35)] sm:p-10">
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl"
              aria-hidden="true"
            />

            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary/90">
              Fout 404
            </p>

            <GradientTitle as="h1" size="xl" className="mb-4 max-w-3xl">
              Deze pagina bestaat niet (meer)
            </GradientTitle>

            <p className="max-w-2xl text-base leading-relaxed text-foreground/75 md:text-lg">
              De URL die je bezocht is niet gevonden. Mogelijk is de pagina verplaatst of de link
              is niet compleet. Gebruik een van de opties hieronder om snel verder te gaan.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-luxury bg-primary px-6 py-3 font-heading text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
              >
                <Home className="h-4 w-4" />
                Naar de homepage
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-luxury border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-foreground transition hover:border-primary/60 hover:text-primary"
              >
                Hulp nodig? Neem contact op
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {quickLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="group flex items-center justify-between rounded-luxury border border-white/10 bg-surface/45 px-4 py-3 transition hover:border-primary/50 hover:bg-surface/60"
                >
                  <span className="flex items-center gap-2 text-sm font-medium text-foreground/85">
                    <Icon className="h-4 w-4 text-primary" />
                    {label}
                  </span>
                  <ArrowRight className="h-4 w-4 text-foreground/50 transition group-hover:translate-x-1 group-hover:text-primary" />
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </PageWrapper>
  );
}
