import Link from "next/link";
import { Award, Clock3, ShieldCheck, Users } from "lucide-react";
import { getProfiles, profilesToCardProps } from "@/lib/api";
import type { ServiceTypeDetailPageData } from "@/lib/data/service-type-detail-pages";
import { ProfileCard } from "./profile-card";
import { TemplateHeroGlass } from "./template-hero-glass";
import { FAQ } from "./faq";
import { HowToSteps } from "./how-to-steps";
import { TestimonialCard } from "./testimonial-card";
import { CTASection } from "./cta-section";
import { PageLayout, PageSection } from "../layout/page-layout";
import { ScrollReveal, StaggerContainer, StaggerItem } from "../ui/scroll-reveal";
import { ResilientImage } from "../ui/resilient-image";

type ServiceTypeDetailTemplateProps = {
  data: ServiceTypeDetailPageData;
  locale?: "nl" | "en";
};

function getDailyQuote(quotes: string[]): string {
  if (quotes.length === 0) {
    return "Snel geregeld en prettig contact van begin tot eind.";
  }
  const daySeed = new Date().getDate();
  return quotes[daySeed % quotes.length];
}

export async function ServiceTypeDetailTemplate({
  data,
  locale = "nl",
}: ServiceTypeDetailTemplateProps) {
  const profiles = await getProfiles();
  const topProfiles = profiles
    .filter((profile) => profile.isAvailable)
    .slice(0, data.pageType === "type" ? 8 : 4);
  const fallbackProfiles =
    topProfiles.length > 0 ? topProfiles : profiles.slice(0, data.pageType === "type" ? 8 : 4);
  const profileCards = profilesToCardProps(fallbackProfiles);
  const quote = getDailyQuote(data.quotePool);

  const isService = data.pageType === "service";
  const isNl = locale === "nl";

  const breadcrumbParent = isService
    ? { label: isNl ? "Services" : "Services", href: "/services" }
    : { label: isNl ? "Escort Types" : "Escort Types", href: "/services" };

  const title = isNl ? data.title : data.titleEn;
  const heroIntro = isNl ? data.heroIntro : data.heroIntroEn;
  const usps = isNl ? data.usps : data.uspsEn;
  const coreContentTitle = isNl ? data.coreContentTitle : data.coreContentTitleEn;
  const coreContent = isNl ? data.coreContent : data.coreContentEn;
  const targetAudienceTitle = isNl ? data.targetAudienceTitle : data.targetAudienceTitleEn;
  const targetAudience = isNl ? data.targetAudience : data.targetAudienceEn;
  const steps = isNl ? data.steps : data.stepsEn;
  const stepsEyebrow = isNl ? data.stepsEyebrow : data.stepsEyebrowEn;
  const stepsTitle = isNl ? data.stepsTitle : data.stepsTitleEn;
  const faqs = isNl ? data.faqs : data.faqsEn;
  const primaryImageAlt = isNl ? data.primaryImageAlt : data.primaryImageAltEn;

  return (
    <PageLayout>
      {/* Hero Section */}
      <PageSection size="sm" className="pb-0">
        <ScrollReveal>
          <TemplateHeroGlass
            breadcrumbs={[breadcrumbParent, { label: isNl ? data.title : data.titleEn }]}
            title={title}
            description={heroIntro}
            titleVariant="gold"
            uspItems={[
              { icon: <ShieldCheck className="h-5 w-5" />, title: usps[0] ?? "" },
              { icon: <Award className="h-5 w-5" />, title: usps[1] ?? "" },
              { icon: <Clock3 className="h-5 w-5" />, title: usps[2] ?? "" },
            ]}
          />
        </ScrollReveal>
      </PageSection>

      {/* Core Content Block with Image */}
      <PageSection size="sm">
        <StaggerContainer className="grid gap-6 lg:grid-cols-12" staggerDelay={0.09}>
          <StaggerItem className="lg:col-span-7">
            <div className="flex h-full flex-col rounded-luxury border border-white/10 bg-surface/25 p-6">
              <p className="text-sm font-medium uppercase tracking-wider text-primary">
                {isService
                  ? isNl
                    ? "Over deze service"
                    : "About this service"
                  : isNl
                  ? "Over dit type"
                  : "About this type"}
              </p>
              <h2 className="mt-2 font-heading text-2xl font-bold text-foreground">
                {coreContentTitle}
              </h2>
              <div className="mt-4 space-y-4 text-foreground/70">
                {coreContent.split("\n\n").map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>
          </StaggerItem>
          <StaggerItem className="lg:col-span-5">
            <ResilientImage
              src={data.primaryImageUrl}
              alt={primaryImageAlt}
              wrapperClassName="h-full min-h-[320px] w-full rounded-luxury border border-white/10 lg:min-h-[400px]"
              fallbackLabel={isNl ? data.title : data.titleEn}
              muted
            />
          </StaggerItem>
        </StaggerContainer>
      </PageSection>

      {/* Escort Grid */}
      <PageSection size="sm">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground">
              {isNl
                ? isService
                  ? `Escorts voor ${data.title}`
                  : `${data.title} Profielen`
                : isService
                ? `Escorts for ${data.titleEn}`
                : `${data.titleEn} Profiles`}
            </h2>
            <p className="mt-1 text-sm text-foreground/65">
              {isNl
                ? "Bekijk beschikbare escorts en boek direct."
                : "View available escorts and book directly."}
            </p>
          </div>
          <Link href="/escorts" className="text-sm text-primary hover:underline">
            {isNl ? "Bekijk alle escorts" : "View all escorts"}
          </Link>
        </div>
        <StaggerContainer
          className={`grid gap-4 ${
            data.pageType === "type"
              ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          }`}
          staggerDelay={0.07}
        >
          {profileCards.map((profile) => (
            <StaggerItem key={profile.slug}>
              <ProfileCard {...profile} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </PageSection>

      {/* Who This Is For (Services only) */}
      {isService && targetAudience && (
        <PageSection size="sm">
          <ScrollReveal delay={0.09}>
            <div className="rounded-luxury border border-white/10 bg-surface/25 p-6">
              <h2 className="font-heading text-2xl font-bold text-foreground">
                {targetAudienceTitle}
              </h2>
              <div className="mt-4 space-y-4 text-foreground/70">
                {targetAudience.split("\n\n").map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </PageSection>
      )}

      {/* How It Works (Services only) */}
      {isService && steps && steps.length > 0 && (
        <PageSection size="sm">
          <ScrollReveal delay={0.1}>
            <HowToSteps
              eyebrow={stepsEyebrow}
              title={stepsTitle}
              steps={steps}
              variant="numbered"
            />
          </ScrollReveal>
        </PageSection>
      )}

      {/* Related Services/Types Grid */}
      <PageSection size="sm">
        <StaggerContainer className="grid gap-6 lg:grid-cols-2" staggerDelay={0.09}>
          {/* Related Services */}
          {data.relatedServices.length > 0 && (
            <StaggerItem>
              <div className="flex h-full flex-col rounded-luxury border border-white/10 bg-surface/25 p-6">
                <h3 className="font-heading text-xl font-bold text-foreground">
                  {isNl ? "Gerelateerde Services" : "Related Services"}
                </h3>
                <p className="mt-2 text-sm text-foreground/65">
                  {isNl
                    ? "Ontdek aanvullende services die goed combineren."
                    : "Discover complementary services that combine well."}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {data.relatedServices.map((service) => (
                    <li key={service.slug}>
                      <Link
                        href={`/${service.slug}`}
                        className="inline-flex rounded-luxury border border-white bg-[#161E21] px-3.5 py-2 text-sm text-foreground/80 transition-colors hover:border-primary/30 hover:text-primary"
                      >
                        {isNl ? service.label : service.labelEn ?? service.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href="/services" className="mt-auto pt-4 text-sm text-primary hover:underline">
                  {isNl ? "Bekijk alle services" : "View all services"}
                </Link>
              </div>
            </StaggerItem>
          )}

          {/* Related Types */}
          {data.relatedTypes.length > 0 && (
            <StaggerItem>
              <div className="flex h-full flex-col rounded-luxury border border-white/10 bg-surface/25 p-6">
                <h3 className="font-heading text-xl font-bold text-foreground">
                  {isNl ? "Populaire Escort Types" : "Popular Escort Types"}
                </h3>
                <p className="mt-2 text-sm text-foreground/65">
                  {isNl
                    ? "Filter op je voorkeurstype voor de perfecte match."
                    : "Filter by your preferred type for the perfect match."}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {data.relatedTypes.map((type) => (
                    <li key={type.slug}>
                      <Link
                        href={`/${type.slug}`}
                        className="inline-flex items-center gap-2 rounded-luxury border border-white bg-[#161E21] px-3.5 py-2 text-sm text-foreground/80 transition-colors hover:border-primary/30 hover:text-primary"
                      >
                        <Users className="h-4 w-4 text-primary/60" />
                        {isNl ? type.label : type.labelEn ?? type.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href="/services" className="mt-auto pt-4 text-sm text-primary hover:underline">
                  {isNl ? "Bekijk alle types" : "View all types"}
                </Link>
              </div>
            </StaggerItem>
          )}
        </StaggerContainer>
      </PageSection>

      {/* Location Links */}
      {data.relatedLocations.length > 0 && (
        <PageSection size="sm">
          <ScrollReveal delay={0.1}>
            <div className="rounded-luxury border border-white/10 bg-surface/25 p-6">
              <h3 className="font-heading text-xl font-bold text-foreground">
                {isNl ? "Beschikbaar in deze Steden" : "Available in these Cities"}
              </h3>
              <p className="mt-2 text-sm text-foreground/65">
                {isNl
                  ? `${data.title} is beschikbaar in heel Nederland. Populaire locaties:`
                  : `${data.titleEn} is available throughout the Netherlands. Popular locations:`}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {data.relatedLocations.map((location) => (
                  <li key={location.slug}>
                    <Link
                      href={`/${location.slug}`}
                      className="inline-flex rounded-luxury border border-white bg-[#161E21] px-3.5 py-2 text-sm text-foreground/80 transition-colors hover:border-primary/30 hover:text-primary"
                    >
                      {location.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/escort-in-nederland"
                className="mt-4 inline-block text-sm text-primary hover:underline"
              >
                {isNl ? "Bekijk alle locaties" : "View all locations"}
              </Link>
            </div>
          </ScrollReveal>
        </PageSection>
      )}

      {/* Testimonial */}
      {data.quotePool.length > 0 && (
        <PageSection size="sm">
          <ScrollReveal delay={0.1}>
            <div className="rounded-luxury border border-white/10 bg-surface/25 p-6">
              <h2 className="font-heading text-2xl font-bold text-foreground">
                {isNl ? "Ervaring van een Client" : "Client Experience"}
              </h2>
              <p className="mt-2 text-sm text-foreground/65">
                {isNl
                  ? "Anonieme review van een recente boeking."
                  : "Anonymous review from a recent booking."}
              </p>
              <TestimonialCard quote={quote} variant="featured" className="mt-4" />
            </div>
          </ScrollReveal>
        </PageSection>
      )}

      {/* FAQ Section */}
      <PageSection size="sm">
        <ScrollReveal delay={0.1}>
          <FAQ
            eyebrow={isNl ? `Veelgestelde vragen` : `Frequently asked questions`}
            title={isNl ? `FAQ ${data.title}` : `FAQ ${data.titleEn}`}
            items={faqs}
            variant="cards"
          />
        </ScrollReveal>
      </PageSection>

      {/* CTA Section */}
      <PageSection size="sm">
        <ScrollReveal delay={0.12}>
          <CTASection
            eyebrow={isNl ? "Iets speciaals in gedachten?" : "Something special in mind?"}
            title={isNl ? "Neem contact op voor maatwerk" : "Get in touch for custom arrangements"}
            description={
              isNl
                ? "Staat jouw wens er niet tussen? Ons team denkt graag met je mee voor een op maat gemaakte ervaring."
                : "Can't find what you're looking for? Our team is happy to help you create a custom experience."
            }
          />
        </ScrollReveal>
      </PageSection>
    </PageLayout>
  );
}
