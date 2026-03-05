import Link from "next/link";
import { Award, Clock3, MessageCircle, ShieldCheck } from "lucide-react";
import { getProfiles, profilesToCardProps } from "@/lib/api";
import type { LocationDetailPageData } from "@/lib/data/location-detail-pages";
import { getNearestNearbyLocations } from "@/lib/data/location-proximity";
import { Button } from "../ui/button";
import { WhatsAppIcon } from "../ui/whatsapp-icon";
import { ProfileCard } from "./profile-card";
import { TemplateHeroGlass } from "./template-hero-glass";
import { FAQ } from "./faq";
import { TestimonialCard } from "./testimonial-card";
import { ArticleCard } from "./article-card";
import { PageLayout, PageSection } from "../layout/page-layout";
import { ScrollReveal, StaggerContainer, StaggerItem } from "../ui/scroll-reveal";
import { ResilientImage } from "../ui/resilient-image";

type LocationDetailTemplateProps = {
  data: LocationDetailPageData;
};

function getDailyQuote(quotes: string[]): string {
  if (quotes.length === 0) {
    return "Snel geregeld en prettig contact van begin tot eind.";
  }
  const daySeed = new Date().getDate();
  return quotes[daySeed % quotes.length];
}

export async function LocationDetailTemplate({ data }: LocationDetailTemplateProps) {
  const profiles = await getProfiles();
  const topProfiles = profiles
    .filter((profile) => profile.isAvailable)
    .slice(0, 4);
  const fallbackProfiles = topProfiles.length > 0 ? topProfiles : profiles.slice(0, 4);
  const profileCards = profilesToCardProps(fallbackProfiles);
  const quote = getDailyQuote(data.quotePool);
  const nearbyLocations = getNearestNearbyLocations(data.slug, data.nearbyLocations, 6);

  return (
    <PageLayout>
      <PageSection size="sm" className="pb-0">
        <ScrollReveal>
          <TemplateHeroGlass
            breadcrumbs={[
              { label: "Escort in Nederland", href: "/escort-in-nederland" },
              { label: data.city },
            ]}
            title={data.title}
            description={data.heroIntro}
            titleVariant="gold"
            uspItems={[
              { icon: <ShieldCheck className="h-5 w-5" />, title: data.usps[0] ?? "" },
              { icon: <Award className="h-5 w-5" />, title: data.usps[1] ?? "" },
              { icon: <Clock3 className="h-5 w-5" />, title: data.usps[2] ?? "" },
            ]}
          />
        </ScrollReveal>
      </PageSection>

      <PageSection size="sm" className="pt-4 md:pt-6 lg:pt-8">
        <ScrollReveal delay={0.05}>
          <div className="grid gap-6 rounded-luxury border border-white/10 bg-surface/35 p-5 md:grid-cols-2 md:p-6">
          <div>
            <p className="text-sm uppercase tracking-wide text-primary">Direct contact</p>
            <p className="mt-2 text-foreground/70">
              Voor snelle beschikbaarheid in {data.city} kun je direct via live chat of WhatsApp boeken.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Button variant="ghost" size="md" className="gap-2 text-white sm:w-auto">
                <MessageCircle className="h-5 w-5" />
                Live Chat
              </Button>
              <a
                href="https://steadfast-art-a1f81485c3.strapiapp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="sm:w-auto"
              >
                <Button variant="whatsapp" size="md" className="w-full gap-2 sm:w-auto">
                  <WhatsAppIcon size={20} />
                  WhatsApp
                </Button>
              </a>
            </div>
          </div>

          <div className="flex h-full items-center rounded-luxury border border-white/10 bg-surface/45 p-4 md:p-5">
            <div className="grid w-full grid-cols-3 gap-3 text-center md:gap-4">
              <div className="flex min-h-[88px] flex-col items-center justify-center">
                <p className="text-xs uppercase tracking-wide text-foreground/60">Prijs vanaf</p>
                <p className="mt-1 font-heading text-2xl font-bold text-primary">{data.priceFromValue}</p>
              </div>
              <div className="flex min-h-[88px] flex-col items-center justify-center">
                <p className="text-xs uppercase tracking-wide text-foreground/60">Afname</p>
                <p className="mt-1 font-heading text-2xl font-bold text-primary">{data.minDurationValue}</p>
              </div>
              <div className="flex min-h-[88px] flex-col items-center justify-center">
                <p className="text-xs uppercase tracking-wide text-foreground/60">Servicetijd</p>
                <p className="mt-1 font-heading text-2xl font-bold text-primary">{data.serviceTimeValue}</p>
              </div>
            </div>
          </div>
          </div>
        </ScrollReveal>
      </PageSection>

      <PageSection size="sm">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Top profielen in {data.city}
            </h2>
          </div>
          <Link href="/escorts" className="text-sm text-primary hover:underline">
            Bekijk alle escorts
          </Link>
        </div>
        <StaggerContainer className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4" staggerDelay={0.07}>
          {profileCards.map((profile) => (
            <StaggerItem key={profile.slug}>
              <ProfileCard {...profile} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </PageSection>

      <PageSection size="sm">
        <StaggerContainer className="grid gap-6 lg:grid-cols-12" staggerDelay={0.09}>
          <StaggerItem className="lg:col-span-6">
            <div className="flex h-full flex-col rounded-luxury border border-white/10 bg-surface/25 p-6">
              <p className="text-sm font-medium uppercase tracking-wider text-primary">
                {data.city} · {data.province}
              </p>
              <h2 className="mt-2 font-heading text-2xl font-bold text-foreground">
                Wat je kunt verwachten in {data.city}
              </h2>
              <p className="mt-4 text-foreground/70">{data.locationNarrative}</p>
              <ResilientImage
                src={data.locationImagePrimaryUrl}
                alt={data.locationImagePrimaryAlt}
                wrapperClassName="mt-5 min-h-[260px] w-full flex-1 rounded-luxury border border-white/10"
                imageClassName="object-top"
                fallbackLabel={`Sfeerbeeld ${data.city}`}
                muted
              />
            </div>
          </StaggerItem>
          <StaggerItem className="lg:col-span-6">
            <div className="rounded-luxury border border-white/10 bg-surface/25 p-6">
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Hotels in en rond {data.city}
              </h2>
              <p className="mt-2 text-sm text-foreground/65">
                Populaire hotels voor discrete afspraken en comfortabele ontvangst in {data.city}.
              </p>
              <ul className="mt-5 space-y-3">
                {data.hotels.map((hotel) => (
                  <li key={hotel.name} className="rounded-luxury border border-white/10 bg-surface/35 p-3">
                    <p className="font-semibold text-foreground">{hotel.name}</p>
                    <p className="mt-1 text-sm text-foreground/70">{hotel.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </PageSection>

      <PageSection size="sm">
        <ScrollReveal delay={0.09}>
          <div className="rounded-luxury border border-white/10 bg-surface/25 p-6">
            <h2 className="font-heading text-2xl font-bold text-foreground">Ervaring van een client</h2>
            <p className="mt-2 text-sm text-foreground/65">Anonieme review van een recente boeking.</p>
            <TestimonialCard quote={quote} variant="featured" className="mt-4" />
          </div>
        </ScrollReveal>
      </PageSection>

      <PageSection size="sm">
        <StaggerContainer className="grid gap-6 lg:grid-cols-12" staggerDelay={0.09}>
          <StaggerItem className="lg:col-span-6">
            <div className="flex h-full flex-col rounded-luxury border border-white/10 bg-surface/25 p-6">
              <h3 className="font-heading text-xl font-bold text-foreground">
                Populaire services in {data.city}
              </h3>
              <p className="mt-2 text-sm text-foreground/65">
                Kies direct een service die het beste past bij jouw afspraak.
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {data.services.map((service) => (
                  <li key={service.href}>
                    <Link
                      href={service.href}
                      className="inline-flex rounded-luxury border border-white bg-[#161E21] px-3.5 py-2 text-sm text-foreground/80 transition-colors hover:border-primary/30 hover:text-primary"
                    >
                      {service.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/diensten" className="mt-auto pt-4 text-sm text-primary hover:underline">
                Bekijk alle services
              </Link>
            </div>
          </StaggerItem>
          <StaggerItem className="lg:col-span-6">
            <div className="flex h-full flex-col rounded-luxury border border-white/10 bg-surface/25 p-6">
              <h3 className="font-heading text-xl font-bold text-foreground">
                Locaties in de buurt
              </h3>
              <p className="mt-2 text-sm text-foreground/65">
                Verken omliggende steden als je daar sneller wilt boeken.
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {nearbyLocations.map((location) => (
                  <li key={location.href}>
                    <Link
                      href={location.href}
                      className="inline-flex rounded-luxury border border-white bg-[#161E21] px-3.5 py-2 text-sm text-foreground/80 transition-colors hover:border-primary/30 hover:text-primary"
                    >
                      {location.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/escort-in-nederland"
                className="mt-auto pt-4 text-sm text-primary hover:underline"
              >
                Bekijk alle locaties
              </Link>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </PageSection>

      <PageSection size="sm">
        <ScrollReveal delay={0.1}>
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <FAQ
                eyebrow={`Veelgestelde vragen ${data.city}`}
                title={`FAQ escort service ${data.city}`}
                items={data.faqs}
                variant="cards"
              />
            </div>
            <div className="lg:col-span-4">
              <ResilientImage
                src={data.locationImageSecondaryUrl}
                alt={data.locationImageSecondaryAlt}
                wrapperClassName="h-full min-h-[320px] w-full rounded-luxury border border-white/10 lg:min-h-[460px]"
                fallbackLabel={`Hotels ${data.city}`}
                muted
              />
            </div>
          </div>
        </ScrollReveal>
      </PageSection>

      <PageSection size="sm">
        <ScrollReveal delay={0.12}>
          <div className="rounded-luxury border border-white/10 bg-surface/25 p-6">
            <h2 className="font-heading text-2xl font-bold text-foreground">Blog en nieuws</h2>
            <p className="mt-2 text-foreground/65">
              Lees relevante updates en inzichten rondom escort services.
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {data.blogPosts.map((post) => (
                <ArticleCard
                  key={post.href}
                  title={post.title}
                  slug={post.href}
                  href={post.href}
                  imageUrl={post.imageUrl}
                  publishedAt={post.dateLabel}
                  variant="default"
                />
              ))}
            </div>
          </div>
        </ScrollReveal>
      </PageSection>
    </PageLayout>
  );
}

