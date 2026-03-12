/**
 * Service and Type Detail Page Data
 * 
 * Unified data structure for both /[service-slug] and /[type-slug] pages.
 * Content follows CONTENT_SPECIFICATIONS.mdc guidelines:
 * - Services: 600-1000 words
 * - Types: 500-800 words
 * 
 * Content Source Mix:
 * - 40-60% legacy high-performing content
 * - 20-30% current ranking query alignment
 * - 20-30% growth keyword opportunities
 */

export type FAQItem = {
  question: string;
  answer: string;
};

export type RelatedLink = {
  slug: string;
  label: string;
  labelEn?: string;
};

export type Step = {
  title: string;
  description: string;
};

export type ServiceTypeDetailPageData = {
  slug: string;
  pageType: "service" | "type";

  title: string;
  titleEn: string;
  metaDescription: string;
  metaDescriptionEn: string;

  heroIntro: string;
  heroIntroEn: string;
  usps: string[];
  uspsEn: string[];

  priceFrom: string;
  minDuration: string;
  responseTime: string;

  coreContentTitle: string;
  coreContentTitleEn: string;
  coreContent: string;
  coreContentEn: string;

  targetAudienceTitle?: string;
  targetAudienceTitleEn?: string;
  targetAudience?: string;
  targetAudienceEn?: string;

  steps?: Step[];
  stepsEn?: Step[];
  stepsEyebrow?: string;
  stepsEyebrowEn?: string;
  stepsTitle?: string;
  stepsTitleEn?: string;

  faqs: FAQItem[];
  faqsEn: FAQItem[];

  relatedServices: RelatedLink[];
  relatedTypes: RelatedLink[];
  relatedLocations: RelatedLink[];

  primaryImageUrl: string;
  primaryImageAlt: string;
  primaryImageAltEn: string;
  ogImageUrl?: string;

  quotePool: string[];
};

/**
 * Hotel Escort Service Page Data
 * 
 * Content Mapping:
 * - Terms reinforced: "hotel escort amsterdam", "hotel escort", "escort hotel"
 * - Legacy blocks reused: Hero USPs, discretion messaging, how-it-works flow
 * - Growth terms: "discrete hotelkamer escort", "hotel escort service nederland"
 */
export const hotelEscortPageData: ServiceTypeDetailPageData = {
  slug: "hotel-escort",
  pageType: "service",

  title: "Hotel Escort Service Amsterdam",
  titleEn: "Hotel Escort Service Amsterdam",

  metaDescription:
    "Discrete hotel escort service in Amsterdam en heel Nederland. ✓ Binnen 90 min ✓ Vanaf €160 ✓ Direct naar je kamer. Bel of WhatsApp 24/7.",
  metaDescriptionEn:
    "Discreet hotel escort service in Amsterdam and all of Netherlands. ✓ Within 90 min ✓ From €160 ✓ Direct to your room. Call or WhatsApp 24/7.",

  heroIntro:
    "Op zoek naar een escort bij je hotel? Desire Escorts biedt discrete hotel escort service in Amsterdam en heel Nederland. Onze escorts komen direct naar jouw hotelkamer — zonder melding bij de receptie.",
  heroIntroEn:
    "Looking for an escort at your hotel? Desire Escorts offers discreet hotel escort service in Amsterdam and throughout the Netherlands. Our escorts come directly to your hotel room — without checking in at reception.",

  usps: [
    "Discreet naar jouw kamer",
    "Vanaf €160 per uur",
    "Binnen 90 minuten",
  ],
  uspsEn: [
    "Discreetly to your room",
    "From €160 per hour",
    "Within 90 minutes",
  ],

  priceFrom: "€160",
  minDuration: "1 uur",
  responseTime: "90 min",

  coreContentTitle: "Wat Maakt Onze Hotel Escort Service Uniek?",
  coreContentTitleEn: "What Makes Our Hotel Escort Service Unique?",

  coreContent: `Bij Desire Escorts staat discretie voorop. Onze escorts verschijnen netjes gekleed op jouw hotelkamer zonder zich te melden bij de receptie. In de meeste hotels hebben zij toegang via keycards of toegangscodes, zodat jouw privacy volledig gewaarborgd blijft.

Of je nu verblijft in een vijfsterrenhotel in Amsterdam Centrum, een zakenhotel bij Schiphol, of elders in Nederland — wij regelen gezelschap dat past bij jouw verblijf. Onze dames zijn geselecteerd op discretie, uitstraling en professionaliteit.

Populaire hotels waar wij regelmatig komen zijn onder andere het Waldorf Astoria, Conservatorium Hotel, W Hotel, en diverse Marriott en Hilton locaties. Maar ook in kleinere boetiekhotels en resorts zijn wij welkom.`,

  coreContentEn: `At Desire Escorts, discretion comes first. Our escorts arrive well-dressed at your hotel room without checking in at reception. At most hotels, they have access via key cards or access codes, ensuring your privacy is fully protected.

Whether you're staying at a five-star hotel in Amsterdam Center, a business hotel near Schiphol, or elsewhere in the Netherlands — we arrange companionship that fits your stay. Our ladies are selected for discretion, appearance, and professionalism.

Popular hotels where we regularly visit include the Waldorf Astoria, Conservatorium Hotel, W Hotel, and various Marriott and Hilton locations. But we are also welcome at smaller boutique hotels and resorts.`,

  targetAudienceTitle: "Voor Wie Is Hotel Escort?",
  targetAudienceTitleEn: "Who Is Hotel Escort For?",

  targetAudience: `Onze hotel escort service is ideaal voor zakenreizigers die na een lange dag ontspanning zoeken, toeristen die Amsterdam of andere Nederlandse steden bezoeken, en gasten die de luxe van gezelschap op hun kamer waarderen zonder de deur uit te hoeven.

Of je nu een rustige avond wilt of gezelschap voor een langer verblijf — wij stemmen de ervaring af op jouw wensen.`,

  targetAudienceEn: `Our hotel escort service is ideal for business travelers seeking relaxation after a long day, tourists visiting Amsterdam or other Dutch cities, and guests who appreciate the luxury of companionship in their room without having to go out.

Whether you want a quiet evening or companionship for a longer stay — we tailor the experience to your wishes.`,

  stepsEyebrow: "Zo werkt het",
  stepsEyebrowEn: "How it works",
  stepsTitle: "Hotel Escort Boeken in 4 Stappen",
  stepsTitleEn: "Book Hotel Escort in 4 Steps",

  steps: [
    {
      title: "Neem contact op",
      description:
        "Bel, WhatsApp of chat met ons team. Geef je voorkeuren door: type escort, tijdstip en duur.",
    },
    {
      title: "Deel je hotelgegevens",
      description:
        "Geef je hotelnaam, adres en kamernummer door. Dit blijft strikt vertrouwelijk.",
    },
    {
      title: "Bevestiging ontvangen",
      description:
        "Je ontvangt een bevestiging met de geschatte aankomsttijd. Gemiddeld binnen 90 minuten.",
    },
    {
      title: "Ontvang je escort",
      description:
        "Je escort arriveert discreet. Betaling vindt plaats bij aankomst, contant of pin.",
    },
  ],

  stepsEn: [
    {
      title: "Get in touch",
      description:
        "Call, WhatsApp or chat with our team. Share your preferences: escort type, time and duration.",
    },
    {
      title: "Share hotel details",
      description:
        "Provide your hotel name, address and room number. This remains strictly confidential.",
    },
    {
      title: "Receive confirmation",
      description:
        "You'll receive confirmation with estimated arrival time. Average within 90 minutes.",
    },
    {
      title: "Receive your escort",
      description:
        "Your escort arrives discreetly. Payment takes place upon arrival, cash or card.",
    },
  ],

  faqs: [
    {
      question: "Wat zijn de kosten voor een hotel escort?",
      answer:
        "Onze prijzen beginnen vanaf €160 per uur. Dit is inclusief standaard service en discrete bezorging naar je hotelkamer. Tarieven kunnen variëren per escort en locatie.",
    },
    {
      question: "Hoe snel kan een escort bij mijn hotel zijn?",
      answer:
        "In Amsterdam en omgeving gemiddeld binnen 60-90 minuten. Voor locaties buiten de Randstad kan dit iets langer duren. Bij spoed doen we ons best om sneller te regelen.",
    },
    {
      question: "Komen de escorts discreet aan?",
      answer:
        "Ja, onze escorts melden zich niet bij de receptie. Zij komen direct naar je kamer via lift of trap, vaak met toegang tot keycards. Je privacy is gegarandeerd.",
    },
    {
      question: "Welke hotels bedienen jullie?",
      answer:
        "We leveren in heel Nederland bij vrijwel alle hotels — van vijfsterrenhotels tot boetiekhotels en zakelijke accommodaties. Ook Schiphol Airport hotels bedienen we regelmatig.",
    },
    {
      question: "Kan ik de duur van het bezoek verlengen?",
      answer:
        "Ja, verlengen is mogelijk indien de escort beschikbaar is. Geef dit aan tijdens het bezoek, zodat we de planning kunnen aanpassen.",
    },
  ],

  faqsEn: [
    {
      question: "What are the costs for a hotel escort?",
      answer:
        "Our prices start from €160 per hour. This includes standard service and discreet delivery to your hotel room. Rates may vary per escort and location.",
    },
    {
      question: "How quickly can an escort arrive at my hotel?",
      answer:
        "In Amsterdam and surrounding areas, average within 60-90 minutes. Locations outside the Randstad may take slightly longer. For urgent requests, we do our best to arrange faster.",
    },
    {
      question: "Do the escorts arrive discreetly?",
      answer:
        "Yes, our escorts do not check in at reception. They come directly to your room via elevator or stairs, often with access to key cards. Your privacy is guaranteed.",
    },
    {
      question: "Which hotels do you serve?",
      answer:
        "We deliver throughout the Netherlands at virtually all hotels — from five-star hotels to boutique hotels and business accommodations. We also regularly serve Schiphol Airport hotels.",
    },
    {
      question: "Can I extend the duration of the visit?",
      answer:
        "Yes, extension is possible if the escort is available. Indicate this during the visit so we can adjust the planning.",
    },
  ],

  relatedServices: [
    { slug: "overnight-escort", label: "Overnight Escort", labelEn: "Overnight Escort" },
    { slug: "gfe-escorts", label: "Girlfriend Experience", labelEn: "Girlfriend Experience" },
    { slug: "erotische-massage", label: "Erotische Massage", labelEn: "Erotic Massage" },
    { slug: "dinnerdate-escort", label: "Dinner Date", labelEn: "Dinner Date" },
    { slug: "trio-escorts", label: "Duo Escort", labelEn: "Duo Escort" },
    { slug: "business-escort", label: "Business Escort", labelEn: "Business Escort" },
  ],

  relatedTypes: [
    { slug: "blonde-escort-dames", label: "Blonde Escort", labelEn: "Blonde Escort" },
    { slug: "brunette-escort-dames", label: "Brunette Escort", labelEn: "Brunette Escort" },
    { slug: "aziatische-escorts", label: "Aziatische Escort", labelEn: "Asian Escort" },
    { slug: "high-class-escort", label: "High Class Escort", labelEn: "High Class Escort" },
  ],

  relatedLocations: [
    { slug: "escort-amsterdam", label: "Amsterdam" },
    { slug: "escort-amsterdam-centrum", label: "Amsterdam Centrum" },
    { slug: "escort-schiphol", label: "Schiphol" },
    { slug: "escort-rotterdam", label: "Rotterdam" },
    { slug: "escort-den-haag", label: "Den Haag" },
    { slug: "escort-utrecht", label: "Utrecht" },
  ],

  primaryImageUrl:
    "https://desire-escorts.nl/wp-content/uploads/hotel-escort-service.jpg",
  primaryImageAlt: "Hotel escort service Amsterdam - discrete escort service naar je hotelkamer",
  primaryImageAltEn: "Hotel escort service Amsterdam - discreet escort service to your hotel room",

  ogImageUrl:
    "https://desire-escorts.nl/wp-content/uploads/featured-image-158.jpg",

  quotePool: [
    "Alles verliep precies zoals afgesproken. Discrete aankomst, geen gedoe.",
    "Perfect geregeld voor mijn verblijf in Amsterdam. Aanrader!",
    "Snelle service en de escort was precies zoals beschreven.",
    "Heel professioneel en discreet. Komt zeker terug.",
  ],
};

/**
 * Aziatische Escorts Type Page Data
 * 
 * Content Mapping:
 * - Terms reinforced: "aziatische escort", "asian escort amsterdam"
 * - Legacy blocks reused: Type description, elegance messaging
 * - Growth terms: "japanse escort", "thaise escort"
 */
export const aziatischeEscortsPageData: ServiceTypeDetailPageData = {
  slug: "aziatische-escorts",
  pageType: "type",

  title: "Aziatische Escorts",
  titleEn: "Asian Escorts",

  metaDescription:
    "Aziatische escorts bij Desire Escorts. Elegante dames met Aziatische achtergrond. ✓ Japans ✓ Thais ✓ Chinees. Vanaf €160, 24/7 beschikbaar.",
  metaDescriptionEn:
    "Asian escorts at Desire Escorts. Elegant ladies with Asian background. ✓ Japanese ✓ Thai ✓ Chinese. From €160, available 24/7.",

  heroIntro:
    "Op zoek naar een Aziatische escort? Ontdek onze selectie elegante escorts met Aziatische achtergrond. Van Japanse subtiliteit tot Thaise warmte — diverse achtergronden voor verschillende voorkeuren.",
  heroIntroEn:
    "Looking for an Asian escort? Discover our selection of elegant escorts with Asian backgrounds. From Japanese subtlety to Thai warmth — diverse backgrounds for different preferences.",

  usps: [
    "Diverse achtergronden",
    "Vanaf €160 per uur",
    "24/7 beschikbaar",
  ],
  uspsEn: [
    "Diverse backgrounds",
    "From €160 per hour",
    "Available 24/7",
  ],

  priceFrom: "€160",
  minDuration: "1 uur",
  responseTime: "90 min",

  coreContentTitle: "Wat Maakt Onze Aziatische Escorts Bijzonder?",
  coreContentTitleEn: "What Makes Our Asian Escorts Special?",

  coreContent: `Onze Aziatische escorts combineren elegantie met warmte en zijn populair bij internationale zakenreizigers en gasten die verfijnd gezelschap zoeken. Elke escort heeft haar eigen unieke achtergrond en persoonlijkheid.

Van Japanse verfijning en aandacht voor detail tot Thaise hartelijkheid en gastvrijheid — onze Aziatische escorts bieden een diverse range aan persoonlijkheden en stijlen. Veel van onze dames spreken meerdere talen, waaronder Nederlands en Engels.

Of je nu op zoek bent naar een rustige avond of gezelschap voor een zakelijk diner, onze Aziatische escorts passen zich moeiteloos aan verschillende situaties aan.`,

  coreContentEn: `Our Asian escorts combine elegance with warmth and are popular among international business travelers and guests seeking refined companionship. Each escort has her own unique background and personality.

From Japanese refinement and attention to detail to Thai hospitality and warmth — our Asian escorts offer a diverse range of personalities and styles. Many of our ladies speak multiple languages, including Dutch and English.

Whether you're looking for a quiet evening or companionship for a business dinner, our Asian escorts adapt effortlessly to different situations.`,

  faqs: [
    {
      question: "Welke nationaliteiten hebben de Aziatische escorts?",
      answer:
        "Onze Aziatische escorts komen uit diverse landen, waaronder Japan, Thailand, China, Korea, Vietnam en de Filipijnen. Elk profiel vermeldt de achtergrond.",
    },
    {
      question: "Spreken de Aziatische escorts Nederlands?",
      answer:
        "Veel van onze Aziatische escorts spreken Nederlands, Engels of beide. Bekijk het profiel voor taalvaardigheden, of vraag ons team om een match op basis van taalvoorkeur.",
    },
    {
      question: "Kan ik een Aziatische escort boeken voor een diner?",
      answer:
        "Ja, onze Aziatische escorts zijn beschikbaar voor dinner dates en sociale gelegenheden. Zij zijn gewend aan diverse settings en passen zich elegant aan.",
    },
  ],

  faqsEn: [
    {
      question: "What nationalities do the Asian escorts have?",
      answer:
        "Our Asian escorts come from various countries, including Japan, Thailand, China, Korea, Vietnam and the Philippines. Each profile mentions the background.",
    },
    {
      question: "Do the Asian escorts speak Dutch?",
      answer:
        "Many of our Asian escorts speak Dutch, English or both. Check the profile for language skills, or ask our team for a match based on language preference.",
    },
    {
      question: "Can I book an Asian escort for dinner?",
      answer:
        "Yes, our Asian escorts are available for dinner dates and social occasions. They are used to various settings and adapt elegantly.",
    },
  ],

  relatedServices: [
    { slug: "hotel-escort", label: "Hotel Escort", labelEn: "Hotel Escort" },
    { slug: "dinnerdate-escort", label: "Dinner Date", labelEn: "Dinner Date" },
    { slug: "gfe-escorts", label: "Girlfriend Experience", labelEn: "Girlfriend Experience" },
    { slug: "erotische-massage", label: "Erotische Massage", labelEn: "Erotic Massage" },
  ],

  relatedTypes: [
    { slug: "japanse-escort", label: "Japanse Escort", labelEn: "Japanese Escort" },
    { slug: "blonde-escort-dames", label: "Blonde Escort", labelEn: "Blonde Escort" },
    { slug: "brunette-escort-dames", label: "Brunette Escort", labelEn: "Brunette Escort" },
    { slug: "petite-escort", label: "Petite Escort", labelEn: "Petite Escort" },
  ],

  relatedLocations: [
    { slug: "escort-amsterdam", label: "Amsterdam" },
    { slug: "escort-rotterdam", label: "Rotterdam" },
    { slug: "escort-den-haag", label: "Den Haag" },
    { slug: "escort-utrecht", label: "Utrecht" },
  ],

  primaryImageUrl:
    "https://desire-escorts.nl/wp-content/uploads/aziatische-escort.jpg",
  primaryImageAlt: "Aziatische escort - elegante dame met Aziatische achtergrond",
  primaryImageAltEn: "Asian escort - elegant lady with Asian background",

  ogImageUrl:
    "https://desire-escorts.nl/wp-content/uploads/featured-image-158.jpg",

  quotePool: [
    "Heel elegante dame, precies wat ik zocht.",
    "Vriendelijk, warm en attent. Echt een fijne avond gehad.",
    "Perfecte match voor een zakelijk diner. Zeer tevreden.",
  ],
};

export function getServiceTypePageBySlug(
  slug: string
): ServiceTypeDetailPageData | undefined {
  const allPages: ServiceTypeDetailPageData[] = [
    hotelEscortPageData,
    aziatischeEscortsPageData,
  ];
  return allPages.find((page) => page.slug === slug);
}

export const allServiceTypeDetailPages: ServiceTypeDetailPageData[] = [
  hotelEscortPageData,
  aziatischeEscortsPageData,
];
