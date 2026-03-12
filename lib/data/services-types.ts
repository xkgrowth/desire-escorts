/**
 * Services and Types data for the /services overview and detail pages.
 * Source: Legacy https://desire-escorts.nl/services/ + sitemap inventory
 */

export type ServiceItem = {
  slug: string;
  label: string;
  labelEn: string;
  description: string;
  descriptionEn: string;
  isFeatured?: boolean;
};

export type TypeItem = {
  slug: string;
  label: string;
  labelEn: string;
  description: string;
  descriptionEn: string;
};

export const allServices: ServiceItem[] = [
  {
    slug: "24-uurs-escort",
    label: "24 uurs Escort",
    labelEn: "24h Escort",
    description: "Langere boekingen met volledige discretie en flexibiliteit.",
    descriptionEn: "Extended bookings with full discretion and flexibility.",
  },
  {
    slug: "anale-seks",
    label: "Anale Seks",
    labelEn: "Anal Sex",
    description: "Intieme service voor wie specifieke voorkeuren heeft.",
    descriptionEn: "Intimate service for those with specific preferences.",
  },
  {
    slug: "bdsm-escorts",
    label: "BDSM Escorts",
    labelEn: "BDSM Escorts",
    description: "Ervaren escorts voor BDSM en dominante sessies.",
    descriptionEn: "Experienced escorts for BDSM and dominant sessions.",
  },
  {
    slug: "body-2-body-massage",
    label: "Body 2 Body Massage",
    labelEn: "Body 2 Body Massage",
    description: "Sensuele lichaamsmassage voor ultieme ontspanning.",
    descriptionEn: "Sensual body massage for ultimate relaxation.",
  },
  {
    slug: "bondage-escort",
    label: "Bondage Escort",
    labelEn: "Bondage Escort",
    description: "Escort met ervaring in bondage en vastbinden.",
    descriptionEn: "Escort experienced in bondage and restraint.",
  },
  {
    slug: "business-escort",
    label: "Business Escort",
    labelEn: "Business Escort",
    description: "Professioneel gezelschap voor zakelijke gelegenheden.",
    descriptionEn: "Professional companionship for business occasions.",
  },
  {
    slug: "cardate-escort",
    label: "Cardate Escort",
    labelEn: "Car Date Escort",
    description: "Discrete service voor afspraken in de auto.",
    descriptionEn: "Discreet service for appointments in the car.",
  },
  {
    slug: "dinnerdate-escort",
    label: "Dinnerdate Escort",
    labelEn: "Dinner Date Escort",
    description: "Elegant gezelschap voor een diner of avondje uit.",
    descriptionEn: "Elegant companionship for dinner or a night out.",
  },
  {
    slug: "erotische-massage",
    label: "Erotische Massage",
    labelEn: "Erotic Massage",
    description: "Ontspannende massage met een sensuele touch.",
    descriptionEn: "Relaxing massage with a sensual touch.",
  },
  {
    slug: "escort-voor-stellen",
    label: "Escort Voor Stellen",
    labelEn: "Couples Escort",
    description: "Gezelschap voor stellen die samen willen genieten.",
    descriptionEn: "Companionship for couples who want to enjoy together.",
  },
  {
    slug: "fetish-escort",
    label: "Fetish Escort",
    labelEn: "Fetish Escort",
    description: "Escorts die openstaan voor diverse fetisjen.",
    descriptionEn: "Escorts open to various fetishes.",
  },
  {
    slug: "first-time-experience",
    label: "First Time Experience",
    labelEn: "First Time Experience",
    description: "Begeleiding voor wie de eerste ervaring zoekt.",
    descriptionEn: "Guidance for those seeking their first experience.",
  },
  {
    slug: "gfe-escorts",
    label: "GFE Escorts",
    labelEn: "GFE Escorts",
    description: "Girlfriend Experience met warmte en intimiteit.",
    descriptionEn: "Girlfriend Experience with warmth and intimacy.",
  },
  {
    slug: "hotel-escort",
    label: "Hotel Escort",
    labelEn: "Hotel Escort",
    description: "Discrete escort service direct naar je hotelkamer.",
    descriptionEn: "Discreet escort service directly to your hotel room.",
    isFeatured: true,
  },
  {
    slug: "nuru-massage",
    label: "Nuru Massage",
    labelEn: "Nuru Massage",
    description: "Japanse glijmassage met speciale gel.",
    descriptionEn: "Japanese gliding massage with special gel.",
  },
  {
    slug: "orale-seks",
    label: "Orale Seks",
    labelEn: "Oral Sex",
    description: "Intieme orale service voor extra genot.",
    descriptionEn: "Intimate oral service for extra pleasure.",
  },
  {
    slug: "overnight-escort",
    label: "Overnight Escort",
    labelEn: "Overnight Escort",
    description: "Gezelschap voor de hele nacht tot de ochtend.",
    descriptionEn: "Companionship for the entire night until morning.",
  },
  {
    slug: "rollenspel-escort",
    label: "Rollenspel Escort",
    labelEn: "Role Play Escort",
    description: "Escorts voor fantasieën en rollenspellen.",
    descriptionEn: "Escorts for fantasies and role play.",
  },
  {
    slug: "sm-escort",
    label: "SM Escort",
    labelEn: "SM Escort",
    description: "Sado-masochistische sessies met ervaren escorts.",
    descriptionEn: "Sado-masochistic sessions with experienced escorts.",
  },
  {
    slug: "tantra-escort",
    label: "Tantra Escort",
    labelEn: "Tantra Escort",
    description: "Spirituele en sensuele tantra-ervaring.",
    descriptionEn: "Spiritual and sensual tantra experience.",
  },
  {
    slug: "trio-escorts",
    label: "Trio Escorts",
    labelEn: "Trio Escorts",
    description: "Twee escorts voor een onvergetelijke ervaring.",
    descriptionEn: "Two escorts for an unforgettable experience.",
  },
  {
    slug: "uitgaan-escort",
    label: "Uitgaan Escort",
    labelEn: "Going Out Escort",
    description: "Gezelschap voor clubs, feesten en evenementen.",
    descriptionEn: "Companionship for clubs, parties, and events.",
  },
  {
    slug: "voetfetish-escort",
    label: "Voetfetish Escort",
    labelEn: "Foot Fetish Escort",
    description: "Escorts voor voetfetisj en gerelateerde voorkeuren.",
    descriptionEn: "Escorts for foot fetish and related preferences.",
  },
  {
    slug: "vrijgezellenfeest-escort",
    label: "Vrijgezellenfeest Escort",
    labelEn: "Bachelor Party Escort",
    description: "Entertainment voor vrijgezellenfeesten.",
    descriptionEn: "Entertainment for bachelor parties.",
  },
];

export const allTypes: TypeItem[] = [
  {
    slug: "aziatische-escorts",
    label: "Aziatische Escort",
    labelEn: "Asian Escort",
    description: "Elegante escorts met Aziatische achtergrond.",
    descriptionEn: "Elegant escorts with Asian background.",
  },
  {
    slug: "blonde-escort-dames",
    label: "Blonde Escort",
    labelEn: "Blonde Escort",
    description: "Aantrekkelijke blonde escorts.",
    descriptionEn: "Attractive blonde escorts.",
  },
  {
    slug: "brunette-escort-dames",
    label: "Brunette Escort",
    labelEn: "Brunette Escort",
    description: "Charmante brunette escorts.",
    descriptionEn: "Charming brunette escorts.",
  },
  {
    slug: "europese-escort",
    label: "Europese Escort",
    labelEn: "European Escort",
    description: "Escorts uit diverse Europese landen.",
    descriptionEn: "Escorts from various European countries.",
  },
  {
    slug: "gay-escort",
    label: "Gay Escort",
    labelEn: "Gay Escort",
    description: "Mannelijke escorts voor mannelijke klanten.",
    descriptionEn: "Male escorts for male clients.",
  },
  {
    slug: "goedkope-escorts",
    label: "Goedkope Escorts",
    labelEn: "Budget Escorts",
    description: "Betaalbare escorts zonder concessies.",
    descriptionEn: "Affordable escorts without compromise.",
  },
  {
    slug: "high-class-escort",
    label: "High Class Escort",
    labelEn: "High Class Escort",
    description: "Premium escorts voor veeleisende gasten.",
    descriptionEn: "Premium escorts for discerning guests.",
  },
  {
    slug: "japanse-escort",
    label: "Japanse Escort",
    labelEn: "Japanese Escort",
    description: "Verfijnde Japanse escorts.",
    descriptionEn: "Refined Japanese escorts.",
  },
  {
    slug: "jonge-escort",
    label: "Jonge Escort",
    labelEn: "Young Escort",
    description: "Jonge escorts (21+) vol energie.",
    descriptionEn: "Young escorts (21+) full of energy.",
  },
  {
    slug: "latina-escorts",
    label: "Latina Escorts",
    labelEn: "Latina Escorts",
    description: "Temperamentvolle Latijns-Amerikaanse escorts.",
    descriptionEn: "Spirited Latin American escorts.",
  },
  {
    slug: "marokkaanse-escort",
    label: "Marokkaanse Escort",
    labelEn: "Moroccan Escort",
    description: "Exotische escorts met Marokkaanse roots.",
    descriptionEn: "Exotic escorts with Moroccan roots.",
  },
  {
    slug: "mature-escort",
    label: "Mature Escort",
    labelEn: "Mature Escort",
    description: "Ervaren escorts met levenswijsheid.",
    descriptionEn: "Experienced escorts with life wisdom.",
  },
  {
    slug: "nederlandse-escort",
    label: "Nederlandse Escort",
    labelEn: "Dutch Escort",
    description: "Autochtone Nederlandse escorts.",
    descriptionEn: "Native Dutch escorts.",
  },
  {
    slug: "petite-escort",
    label: "Petite Escort",
    labelEn: "Petite Escort",
    description: "Compacte, sierlijke escorts.",
    descriptionEn: "Compact, graceful escorts.",
  },
  {
    slug: "poolse-escort",
    label: "Poolse Escort",
    labelEn: "Polish Escort",
    description: "Aantrekkelijke Poolse escorts.",
    descriptionEn: "Attractive Polish escorts.",
  },
  {
    slug: "roemeense-escort",
    label: "Roemeense Escort",
    labelEn: "Romanian Escort",
    description: "Charmante Roemeense escorts.",
    descriptionEn: "Charming Romanian escorts.",
  },
  {
    slug: "shemale-escort",
    label: "Shemale Escort",
    labelEn: "Shemale Escort",
    description: "Transgender escorts voor diverse voorkeuren.",
    descriptionEn: "Transgender escorts for diverse preferences.",
  },
  {
    slug: "striptease-escort",
    label: "Striptease Escort",
    labelEn: "Striptease Escort",
    description: "Escorts met striptease-ervaring.",
    descriptionEn: "Escorts with striptease experience.",
  },
  {
    slug: "studenten-escort",
    label: "Studenten Escort",
    labelEn: "Student Escort",
    description: "Jonge studentes als escort.",
    descriptionEn: "Young students as escorts.",
  },
  {
    slug: "turkse-escort",
    label: "Turkse Escort",
    labelEn: "Turkish Escort",
    description: "Exotische Turkse escorts.",
    descriptionEn: "Exotic Turkish escorts.",
  },
  {
    slug: "zwarte-escort",
    label: "Zwarte Escort",
    labelEn: "Black Escort",
    description: "Aantrekkelijke escorts met donkere huidskleur.",
    descriptionEn: "Attractive escorts with dark skin tone.",
  },
];

export const featuredService = allServices.find((s) => s.isFeatured) ?? allServices[0];

export function getServiceBySlug(slug: string): ServiceItem | undefined {
  return allServices.find((s) => s.slug === slug);
}

export function getTypeBySlug(slug: string): TypeItem | undefined {
  return allTypes.find((t) => t.slug === slug);
}

export const servicesFaq = [
  {
    question: "Wat is het verschil tussen een escort date en een dinner date?",
    answer:
      "Een standaard escort date is gericht op privé-gezelschap, terwijl een dinner date begint met een etentje in een restaurant voordat jullie samen verdergaan. Beide opties zijn discreet en op maat.",
  },
  {
    question: "Kan ik meerdere services combineren?",
    answer:
      "Ja, veel services zijn combineerbaar. Bespreek je wensen vooraf met ons team, dan stemmen we de juiste escort en tijdsduur af.",
  },
  {
    question: "Hoe weet ik welk type escort bij mij past?",
    answer:
      "Bekijk de profielen en filter op type, of neem contact op. Ons team helpt je graag bij het vinden van een match die past bij jouw voorkeuren.",
  },
  {
    question: "Zijn alle services beschikbaar bij elke escort?",
    answer:
      "Niet elke escort biedt alle services aan. Controleer het profiel of vraag vooraf welke services beschikbaar zijn bij jouw voorkeur.",
  },
];
