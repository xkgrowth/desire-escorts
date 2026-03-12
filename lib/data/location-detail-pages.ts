export type LocationFaqItem = {
  question: string;
  answer: string;
};

export type LocationHotel = {
  name: string;
  description: string;
};

export type LocationLinkItem = {
  label: string;
  href: string;
};

export type LocationBlogPost = {
  title: string;
  href: string;
  dateLabel: string;
  imageUrl: string;
};

export type LocationDetailPageData = {
  slug: string;
  city: string;
  province: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  serviceTimeValue: string;
  priceFromValue: string;
  minDurationValue: string;
  speedSummary: string;
  pricingSummary: string;
  heroIntro: string;
  usps: string[];
  locationImagePrimaryUrl: string;
  locationImagePrimaryAlt: string;
  locationImageSecondaryUrl: string;
  locationImageSecondaryAlt: string;
  locationNarrative: string;
  quotePool: string[];
  hotels: LocationHotel[];
  services: LocationLinkItem[];
  nearbyLocations: LocationLinkItem[];
  blogPosts: LocationBlogPost[];
  faqs: LocationFaqItem[];
};

const defaultUsps = [
  "Alle foto's van escorts zijn echt, geen AI-profielen",
  "Al 20 jaar een legaal bedrijf met vergunning",
  "De beste escort service in Noord-Holland",
];

const defaultServices: LocationLinkItem[] = [
  { label: "Hotel Escort", href: "/hotel-escort" },
  { label: "Erotische Massage", href: "/erotische-massage" },
  { label: "Girlfriend Experience", href: "/gfe-escorts" },
  { label: "24-uurs Escort", href: "/24-uurs-escort" },
];

const defaultBlogPosts: LocationBlogPost[] = [
  {
    title: "Verrijk Je ADE Ervaring: Luxe, Discretie & De Uitgaan Escort Service",
    href: "/verrijk-je-ade-ervaring-luxe-discretie-de-uitgaan-escort-service",
    dateLabel: "oktober 2025",
    imageUrl:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Online Sekswerkers onder de Loep: Wat We Kunnen Leren van de Webcamindustrie",
    href: "/online-sekswerkers-onder-de-loep-wat-we-kunnen-leren-van-de-webcamindustrie",
    dateLabel: "september 2025",
    imageUrl:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "SAIL Amsterdam & de Nautische Roots van de Escortbranche",
    href: "/sail-amsterdam-de-nautische-roots-van-de-escortbranche",
    dateLabel: "augustus 2025",
    imageUrl:
      "https://images.unsplash.com/photo-1473973266408-ed4e2719b65c?auto=format&fit=crop&w=1200&q=80",
  },
];

const amsterdamCityFaqs: LocationFaqItem[] = [
  {
    question: "Hoe snel is escort service in Amsterdam beschikbaar?",
    answer:
      "In Amsterdam is service vaak binnen 45-90 minuten mogelijk. In piekuren adviseren we 1-2 uur vooruit te boeken voor de meeste keuze.",
  },
  {
    question: "Wat kost een escort in Amsterdam?",
    answer:
      "De startprijs in Amsterdam is vanaf €160 voor 1 uur. Voor langere afspraken of specifieke voorkeuren ontvang je vooraf een duidelijke prijsindicatie.",
  },
  {
    question: "Kan ik voorkeuren doorgeven voor mijn escort in Amsterdam?",
    answer: "Ja, je kunt vooraf voorkeuren delen zodat we je gericht kunnen matchen.",
  },
  {
    question: "Zijn hotelafspraken in Amsterdam mogelijk?",
    answer: "Ja, we plannen hotelafspraken in Centrum, Zuid, Oost en andere delen van de stad.",
  },
  {
    question: "Welke betaalmethoden zijn mogelijk in Amsterdam?",
    answer: "Betalen kan onder meer via cash, pin of creditcard, afhankelijk van de afspraak.",
  },
  {
    question: "Hoe gaan jullie om met privacy en discretie?",
    answer:
      "We behandelen gegevens vertrouwelijk en zorgen voor discrete communicatie van aanvraag tot afspraak.",
  },
];

const amsterdamCentrumHotels: LocationHotel[] = [
  { name: "Amstel Hotel", description: "Luxe vijfsterrenlocatie in het centrum." },
  { name: "Sofitel Legend The Grand", description: "Discreet hotel in hartje centrum." },
  { name: "Hotel TwentySeven", description: "High-end suites nabij Dam Square." },
];

const amsterdamNoordHotels: LocationHotel[] = [
  { name: "DoubleTree by Hilton Amsterdam - NDSM Wharf", description: "Populaire locatie in Noord." },
  { name: "Sir Adam Hotel", description: "Designhotel bij A'DAM Toren, goed bereikbaar." },
  { name: "YOTEL Amsterdam", description: "Moderne kamers en discrete setting in Noord." },
];

const amsterdamOostHotels: LocationHotel[] = [
  { name: "Hotel V Fizeaustraat", description: "Moderne hotelsetting in Oost." },
  { name: "QO Amsterdam", description: "Luxe hotel met veel privacyopties in Oost." },
  { name: "The Manor Amsterdam", description: "Stijlvol hotel dichtbij park en centrum." },
];

const amsterdamWestHotels: LocationHotel[] = [
  { name: "WestCord Fashion Hotel", description: "Rustige setting en goede bereikbaarheid vanaf de ring." },
  { name: "Hotel De Hallen", description: "Boutique hotel in Oud-West met veel privacy." },
  { name: "XO Hotels Park West", description: "Praktische locatie dichtbij Sloterdijk." },
];

const amsterdamZuidHotels: LocationHotel[] = [
  { name: "Hotel Okura Amsterdam", description: "Vijfsterrenhotel in Zuid." },
  { name: "Conservatorium Hotel", description: "Exclusieve setting dichtbij Museumplein." },
  { name: "Hilton Amsterdam", description: "Ruime kamers en discrete ontvangst in Zuid." },
];

function getAmsterdamDistrictFaqs(districtLabel: string): LocationFaqItem[] {
  return [
    {
      question: "Kan ik aangeven hoe ik wil dat mijn escort eruitziet?",
      answer:
        "Ja. Je kunt vooraf voorkeuren delen, waarna we beschikbare profielen selecteren die het beste aansluiten.",
    },
    {
      question: `Hoe boek ik een escort in ${districtLabel}?`,
      answer:
        "Boeken gaat snel via live chat of WhatsApp. We stemmen voorkeuren, tijdstip en locatie direct met je af.",
    },
    {
      question: "Wat zijn de opties voor betaling?",
      answer: "Betalen kan onder meer met cash, pin of creditcard, afhankelijk van de afspraak.",
    },
    {
      question: "Is directe communicatie met de escort vooraf mogelijk?",
      answer:
        "Voor privacy en veiligheid loopt communicatie vooraf via ons team. We geven je wensen altijd zorgvuldig door.",
    },
    {
      question: "Wat als ik mijn afspraak wil verzetten of annuleren?",
      answer:
        "Neem zo snel mogelijk contact op. Dan kijken we direct naar een passende nieuwe planning of oplossing.",
    },
    {
      question: `Komt de escort rechtstreeks naar een hotel in ${districtLabel}?`,
      answer:
        "Ja, hotelafspraken zijn mogelijk. We zorgen voor discrete aankomst en duidelijke timing vooraf.",
    },
  ];
}

export const locationDetailPages: Record<string, LocationDetailPageData> = {
  "escort-haarlem": {
    slug: "escort-haarlem",
    city: "Haarlem",
    province: "Noord-Holland",
    title: "Escort Service in Haarlem",
    metaTitle: "Escort Service in Haarlem | Vanaf €160 | Desire Escorts",
    metaDescription:
      "Escort Service in Haarlem met echte profielen en discrete service. Binnen 60 minuten mogelijk en vanaf €160 voor 1 uur. Bekijk beschikbare escorts.",
    serviceTimeValue: "60 min",
    priceFromValue: "€160",
    minDurationValue: "1 uur",
    speedSummary: "Binnen 60 minuten in Haarlem mogelijk",
    pricingSummary: "Vanaf €160 voor minimaal 1 uur",
    heroIntro:
      "Wil je snel en discreet een escort in Haarlem boeken? We combineren snelle beschikbaarheid met geverifieerde profielen en heldere prijsafspraken vooraf.",
    usps: [
      "Alle foto's van escorts zijn echt, geen AI-profielen",
      "Al 20 jaar een legaal bedrijf met vergunning",
      "De beste escort service in Noord-Holland",
    ],
    locationImagePrimaryUrl:
      "https://desire-escorts.nl/wp-content/uploads/escort-haarlem-hotels-scaled.jpg",
    locationImagePrimaryAlt: "escort met zwarte lingerie aan, kijken in de camera",
    locationImageSecondaryUrl:
      "https://desire-escorts.nl/wp-content/uploads/escort-haarlem-hotels-1-scaled.jpg",
    locationImageSecondaryAlt: "escort-haarlem-hotels",
    locationNarrative:
      "Haarlem is populair voor avondboekingen, hotelafspraken en dates in of rond het centrum. De vraag zit vaak in de avonduren en het weekend, waardoor vroeg boeken de meeste keuze geeft. Voor afspraken in Haarlem-Zuid, het centrum en richting Bloemendaal plannen we doorgaans het snelst. Hotelafspraken worden vaak gecombineerd met services zoals dinner date of een rustige privé-ontmoeting.",
    quotePool: [
      "Snel geregeld, duidelijke communicatie en precies de sfeer die ik zocht.",
      "Binnen korte tijd een perfecte match en alles liep discreet en soepel.",
      "Prettig contact en een professionele aanpak van begin tot eind.",
    ],
    hotels: [
      {
        name: "Amrath Grand Hotel Frans Hals",
        description:
          "Centraal in Haarlem met een rustige, discrete setting voor een comfortabele afspraak.",
      },
      {
        name: "Carlton Square Hotel",
        description:
          "Dicht bij het Frederikspark met een toegankelijke locatie en ontspannen sfeer.",
      },
      {
        name: "Hotel Raecks",
        description:
          "Stijlvol en gastvrij hotel in het centrum, geschikt voor een discrete en comfortabele ontmoeting.",
      },
      {
        name: "Boutiquehotel Staats",
        description:
          "Stijlvolle kamers en een intieme setting die goed past bij een private ontmoeting.",
      },
      {
        name: "Van der Valk Hotel Haarlem",
        description:
          "Ruime kamers en goede bereikbaarheid voor gasten uit Haarlem en omgeving.",
      },
    ],
    services: [
      { label: "Hotel Escort", href: "/hotel-escort" },
      { label: "Erotische Massage", href: "/erotische-massage" },
      { label: "Girlfriend Experience", href: "/gfe-escorts" },
      { label: "Dinner Date", href: "/dinnerdate-escort" },
    ],
    nearbyLocations: [
      { label: "Escort Bloemendaal", href: "/escort-bloemendaal" },
      { label: "Escort Zandvoort", href: "/escort-zandvoort" },
      { label: "Escort Aerdenhout", href: "/escort-aerdenhout" },
      { label: "Escort Amsterdam", href: "/escort-amsterdam" },
    ],
    blogPosts: [
      {
        title: "Verrijk Je ADE Ervaring: Luxe, Discretie & De Uitgaan Escort Service",
        href: "/verrijk-je-ade-ervaring-luxe-discretie-de-uitgaan-escort-service",
        dateLabel: "oktober 2025",
        imageUrl:
          "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80",
      },
      {
        title: "Online Sekswerkers onder de Loep: Wat We Kunnen Leren van de Webcamindustrie",
        href: "/online-sekswerkers-onder-de-loep-wat-we-kunnen-leren-van-de-webcamindustrie",
        dateLabel: "september 2025",
        imageUrl:
          "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80",
      },
      {
        title: "SAIL Amsterdam & de Nautische Roots van de Escortbranche",
        href: "/sail-amsterdam-de-nautische-roots-van-de-escortbranche",
        dateLabel: "augustus 2025",
        imageUrl:
          "https://images.unsplash.com/photo-1473973266408-ed4e2719b65c?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    faqs: [
      {
        question: "Hoe snel kunnen jullie service leveren in Haarlem?",
        answer:
          "In Haarlem kunnen we vaak binnen 60 minuten service leveren. Tijdens piekuren adviseren we iets eerder te boeken voor maximale keuze.",
      },
      {
        question: "Wat kost een escort service in Haarlem?",
        answer:
          "In Haarlem start de prijs vanaf €160 voor 1 uur. Voor langere afspraken of specifieke wensen stemmen we de prijs vooraf transparant met je af.",
      },
      {
        question: "Zijn de foto's van de escorts echt?",
        answer:
          "Ja, we werken met echte profielfoto's en geen AI-beelden. Zo weet je vooraf beter wat je kunt verwachten.",
      },
      {
        question: "Hoe boek ik snel een escort in Haarlem?",
        answer:
          "Boeken gaat het snelst via live chat of WhatsApp. Deel je voorkeuren, locatie en tijdstip, dan koppelen we je direct aan een passende match.",
      },
      {
        question: "Welke betaalmethoden zijn mogelijk in Haarlem?",
        answer:
          "Je kunt betalen via onder meer cash, pin of creditcard. Tijdens het boeken geven we direct aan wat in jouw situatie mogelijk is.",
      },
      {
        question: "Kan ik een hotelafspraak in Haarlem boeken?",
        answer:
          "Ja, hotelafspraken in en rond Haarlem zijn mogelijk. We stemmen locatie, timing en service vooraf af zodat alles soepel verloopt.",
      },
      {
        question: "Bieden jullie ook erotische massage in Haarlem?",
        answer:
          "Ja, erotische massage is beschikbaar in Haarlem en omgeving. We stemmen vooraf af welke service het beste past bij jouw wensen.",
      },
      {
        question: "Hoe gaan jullie om met privacy?",
        answer:
          "Privacy staat centraal in onze werkwijze. Gegevens worden vertrouwelijk behandeld en communicatie verloopt discreet van aanvraag tot afspraak.",
      },
      {
        question: "Wat als ik mijn afspraak wil verzetten of annuleren?",
        answer:
          "Laat wijzigingen zo vroeg mogelijk weten. Dan kunnen we flexibel met je meedenken en de planning daarop aanpassen.",
      },
      {
        question: "Is direct contact met de escort vooraf mogelijk?",
        answer:
          "Voor privacy en veiligheid loopt communicatie vooraf via ons team. We zorgen dat al jouw voorkeuren duidelijk worden doorgegeven.",
      },
      {
        question: "Is Desire Escorts een legaal escortbureau?",
        answer:
          "Ja, Desire Escorts werkt als legaal bureau met vergunning. We hanteren een professionele en transparante werkwijze.",
      },
    ],
  },
  "escort-amstelveen": {
    slug: "escort-amstelveen",
    city: "Amstelveen",
    province: "Noord-Holland",
    title: "Escort Service in Amstelveen",
    metaTitle: "Escort Service in Amstelveen | Vanaf €160 | Desire Escorts",
    metaDescription:
      "Escort Service in Amstelveen met geverifieerde profielen. Service vaak binnen 1 uur en vanaf €160 voor 1 uur. Boek discreet via live chat of WhatsApp.",
    serviceTimeValue: "60 min",
    priceFromValue: "€160",
    minDurationValue: "1 uur",
    speedSummary: "Vaak binnen 1 uur service in Amstelveen",
    pricingSummary: "Vanaf €160 voor minimaal 1 uur",
    heroIntro:
      "Zoek je een betrouwbare escort service in Amstelveen? We leveren snelle, discrete service met duidelijke intake en geverifieerde profielen.",
    usps: [
      "Alle foto's van escorts zijn echt, geen AI-profielen",
      "Al 20 jaar een legaal bedrijf met vergunning",
      "De beste escort service in Noord-Holland",
    ],
    locationImagePrimaryUrl:
      "https://desire-escorts.nl/wp-content/uploads/escort-dames-in-amstelveen-scaled.webp",
    locationImagePrimaryAlt: "Blonde escort met blauwe ogen en rode lingerie in bad met rozenblaadjes",
    locationImageSecondaryUrl:
      "https://desire-escorts.nl/wp-content/uploads/escort-amstelveel-hotels-scaled.jpg",
    locationImageSecondaryAlt: "escort-amstelveel-hotels",
    locationNarrative:
      "Amstelveen is een sterke locatie voor zowel thuisafspraken als hotelbookings. Door de ligging nabij Amsterdam en zakelijke routes is er vraag overdag en in de vroege avond. Voor afspraken rond Amsterdamse Bos, Stadshart en omliggende wijken kunnen we meestal flexibel plannen. Bij last-minute aanvragen is snelle afstemming via live chat of WhatsApp het meest effectief.",
    quotePool: [
      "Binnen korte tijd geregeld en professioneel begeleid van aanvraag tot afspraak.",
      "Discreet contact, duidelijke verwachtingen en een fijne match.",
      "Heel soepel boekingsproces en precies de service die ik zocht.",
    ],
    hotels: [
      {
        name: "Grand Hotel Amstelveen",
        description:
          "Ruime kamers en een rustige setting voor een ontspannen en discrete ontmoeting.",
      },
      {
        name: "Hotel Station Amstelveen",
        description:
          "Kleinschalig en centraal, geschikt voor compacte en comfortabele afspraken.",
      },
      {
        name: "Cityden The Garden Amsterdam South",
        description:
          "Moderne suites met extra privacy en goede bereikbaarheid in de regio.",
      },
      {
        name: "ibis budget Amsterdam City South",
        description:
          "Praktische en comfortabele hoteloptie met snelle toegang tot Amstelveen en Amsterdam-Zuid.",
      },
      {
        name: "Adagio Amsterdam City South",
        description:
          "Stijlvolle aparthotel-optie voor langere en meer ontspannen afspraken.",
      },
    ],
    services: [
      { label: "Hotel Escort", href: "/hotel-escort" },
      { label: "Erotische Massage", href: "/erotische-massage" },
      { label: "Girlfriend Experience", href: "/gfe-escorts" },
      { label: "24-uurs Escort", href: "/24-uurs-escort" },
    ],
    nearbyLocations: [
      { label: "Escort Amsterdam", href: "/escort-amsterdam" },
      { label: "Escort Haarlem", href: "/escort-haarlem" },
      { label: "Escort Schiphol", href: "/escort-schiphol" },
      { label: "Escort Hoofddorp", href: "/escort-hoofddorp" },
    ],
    blogPosts: [
      {
        title: "Verrijk Je ADE Ervaring: Luxe, Discretie & De Uitgaan Escort Service",
        href: "/verrijk-je-ade-ervaring-luxe-discretie-de-uitgaan-escort-service",
        dateLabel: "oktober 2025",
        imageUrl:
          "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80",
      },
      {
        title: "Online Sekswerkers onder de Loep: Wat We Kunnen Leren van de Webcamindustrie",
        href: "/online-sekswerkers-onder-de-loep-wat-we-kunnen-leren-van-de-webcamindustrie",
        dateLabel: "september 2025",
        imageUrl:
          "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80",
      },
      {
        title: "SAIL Amsterdam & de Nautische Roots van de Escortbranche",
        href: "/sail-amsterdam-de-nautische-roots-van-de-escortbranche",
        dateLabel: "augustus 2025",
        imageUrl:
          "https://images.unsplash.com/photo-1473973266408-ed4e2719b65c?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    faqs: [
      {
        question: "Hoe snel kunnen jullie service leveren in Amstelveen?",
        answer:
          "In Amstelveen is service vaak binnen 1 uur mogelijk. Voor de meeste zekerheid adviseren we om 1-2 uur vooruit te boeken.",
      },
      {
        question: "Wat is de startprijs in Amstelveen?",
        answer:
          "De startprijs in Amstelveen is vanaf €160 voor 1 uur. Bij langere afspraken of specifieke wensen ontvang je vooraf een duidelijke prijsindicatie.",
      },
      {
        question: "Kan ik vooraf aangeven hoe mijn escort eruitziet?",
        answer:
          "Ja, je kunt voorkeuren vooraf delen. Op basis daarvan selecteren we de best passende beschikbare profielen.",
      },
      {
        question: "Zijn jullie actief voor hotelafspraken in Amstelveen?",
        answer:
          "Ja, we verzorgen ook hotelafspraken in en rondom Amstelveen. We plannen op basis van jouw locatie en gewenste tijd.",
      },
      {
        question: "Hoe boek ik het snelst een escort in Amstelveen?",
        answer:
          "De snelste route is live chat of WhatsApp. Daarmee kunnen we direct beschikbaarheid, voorkeuren en timing met je afstemmen.",
      },
      {
        question: "Hoe gaan jullie om met privacy en discretie?",
        answer:
          "Privacy is standaard onderdeel van onze werkwijze. We behandelen gegevens vertrouwelijk en communiceren discreet gedurende het hele proces.",
      },
      {
        question: "Welke betaalmethoden zijn mogelijk in Amstelveen?",
        answer:
          "Betalen kan via meerdere methoden, waaronder cash, pin en creditcard. Tijdens het boeken stemmen we af wat voor jouw afspraak mogelijk is.",
      },
      {
        question: "Wat als ik mijn afspraak wil verzetten?",
        answer:
          "Als je planning wijzigt, neem dan zo snel mogelijk contact op. Dan kijken we direct naar een passende nieuwe planning.",
      },
      {
        question: "Bieden jullie ook massage services in Amstelveen?",
        answer:
          "Ja, naast reguliere escortservices bieden we ook massagegerichte services. We helpen je kiezen op basis van jouw voorkeuren.",
      },
    ],
  },
  "escort-amsterdam": {
    slug: "escort-amsterdam",
    city: "Amsterdam",
    province: "Noord-Holland",
    title: "Escort Service in Amsterdam",
    metaTitle: "Escort Service Amsterdam | Discreet & Snel | Desire Escorts",
    metaDescription:
      "Escort Service in Amsterdam met geverifieerde profielen, snelle beschikbaarheid en discrete service. Vaak binnen 45-90 minuten mogelijk, vanaf €160.",
    serviceTimeValue: "45-90 min",
    priceFromValue: "€160",
    minDurationValue: "1 uur",
    speedSummary: "Vaak binnen 45-90 minuten service in Amsterdam",
    pricingSummary: "Vanaf €160 voor minimaal 1 uur",
    heroIntro:
      "Wil je snel en discreet een escort in Amsterdam boeken? We combineren snelle beschikbaarheid met geverifieerde profielen en duidelijke prijsafspraken vooraf.",
    usps: defaultUsps,
    locationImagePrimaryUrl: "https://desire-escorts.nl/wp-content/uploads/escort-dames-in-amsterdam.webp-scaled.webp",
    locationImagePrimaryAlt: "Blonde escort met lichte ogen en zwarte lingerie liggend op bed",
    locationImageSecondaryUrl: "https://desire-escorts.nl/wp-content/uploads/escort-dames-in-amsterdam-centrum-scaled.jpg",
    locationImageSecondaryAlt: "Blonde escort met donkere ogen en rode lingerie met handen in haar heupej",
    locationNarrative:
      "Amsterdam heeft doorlopend vraag vanuit centrumhotels, de Zuidas en internationale bezoekers. Afspraken in Centrum, Zuid, Oost, West en Noord zijn meestal snel in te plannen wanneer je 1-2 uur vooraf boekt. Voor last-minute aanvragen stemmen we direct beschikbaarheid, locatie en voorkeuren met je af via live chat of WhatsApp. Hotelafspraken in en rond de binnenstad combineren we vaak met services zoals dinner date, GFE en ontspannende massage.",
    quotePool: [
      "Direct geholpen, heldere communicatie en precies de match die ik zocht.",
      "Professionele aanpak van aanvraag tot afspraak, erg discreet verlopen.",
      "Snel geregeld in Amsterdam en duidelijke afspraken vooraf.",
    ],
    hotels: [
      {
        name: "Waldorf Astoria Amsterdam",
        description: "Luxe en discrete setting aan de Herengracht, populair voor high-end hotelafspraken.",
      },
      {
        name: "Conservatorium Hotel",
        description: "Exclusief hotel in Amsterdam Zuid met uitstekende privacy en service.",
      },
      {
        name: "Hotel Okura Amsterdam",
        description: "Vijfsterrenlocatie met ruime suites, geliefd voor langere en comfortabele afspraken.",
      },
      {
        name: "W Amsterdam",
        description: "Centraal gelegen hotel met goede bereikbaarheid voor avondafspraken in de binnenstad.",
      },
      {
        name: "Hyatt Regency Amsterdam",
        description: "Rustige luxe setting aan de rand van het centrum, ideaal voor discrete ontmoetingen.",
      },
    ],
    services: defaultServices,
    nearbyLocations: [
      { label: "Escort Amsterdam Centrum", href: "/escort-amsterdam-centrum" },
      { label: "Escort Amsterdam Zuid", href: "/escort-amsterdam-zuid" },
      { label: "Escort Amstelveen", href: "/escort-amstelveen" },
      { label: "Escort Haarlem", href: "/escort-haarlem" },
    ],
    blogPosts: defaultBlogPosts,
    faqs: [
      {
        question: "Hoe snel is escort service in Amsterdam beschikbaar?",
        answer:
          "In Amsterdam is service vaak binnen 45-90 minuten mogelijk. In piekuren adviseren we 1-2 uur vooruit te boeken voor de meeste keuze.",
      },
      {
        question: "Wat kost een escort in Amsterdam?",
        answer:
          "De startprijs in Amsterdam is vanaf €160 voor 1 uur. Voor langere afspraken of specifieke voorkeuren ontvang je vooraf een duidelijke prijsindicatie.",
      },
      {
        question: "Kan ik voorkeuren doorgeven voor mijn escort in Amsterdam?",
        answer:
          "Ja, je kunt vooraf voorkeuren delen zoals uitstraling, ervaring en type afspraak. Op basis daarvan matchen we je met beschikbare profielen.",
      },
      {
        question: "Zijn hotelafspraken in Amsterdam mogelijk?",
        answer:
          "Ja, we plannen regelmatig afspraken in hotels in Centrum, Zuid en Oost. We stemmen timing en aankomst vooraf discreet met je af.",
      },
      {
        question: "Welke betaalmethoden zijn mogelijk in Amsterdam?",
        answer:
          "Betalen kan via meerdere methoden, waaronder cash, pin en creditcard. Tijdens de intake bevestigen we direct welke opties voor jouw afspraak gelden.",
      },
      {
        question: "Hoe gaan jullie om met privacy en discretie?",
        answer:
          "Privacy staat centraal in onze werkwijze. We behandelen gegevens vertrouwelijk en zorgen voor discrete communicatie van aanvraag tot afspraak.",
      },
    ],
  },
  "escort-amsterdam-centrum": { slug: "escort-amsterdam-centrum", city: "Amsterdam Centrum", province: "Noord-Holland", title: "Escort Service in Amsterdam Centrum", metaTitle: "Escort Service Amsterdam Centrum", metaDescription: "Escort Service in Amsterdam Centrum.", serviceTimeValue: "45-75 min", priceFromValue: "€160", minDurationValue: "1 uur", speedSummary: "Snelle service", pricingSummary: "Vanaf €160", heroIntro: "Escort service in Amsterdam Centrum.", usps: defaultUsps, locationImagePrimaryUrl: "https://desire-escorts.nl/wp-content/uploads/escort-dames-in-amsterdam-centrum-scaled.jpg", locationImagePrimaryAlt: "Escort in Amsterdam Centrum", locationImageSecondaryUrl: "https://desire-escorts.nl/wp-content/uploads/escort-dames-in-amsterdam-centrum-scaled.jpg", locationImageSecondaryAlt: "Escort in Amsterdam Centrum", locationNarrative: "Amsterdam Centrum is populair voor hotel- en avondafspraken.", quotePool: ["Snelle service."], hotels: [{ name: "Amstel Hotel", description: "Luxe vijfsterrenlocatie in het centrum voor discrete hotelafspraken." }], services: defaultServices, nearbyLocations: [{ label: "Escort Amsterdam", href: "/escort-amsterdam" }, { label: "Escort Amsterdam Zuid", href: "/escort-amsterdam-zuid" }], blogPosts: defaultBlogPosts, faqs: [{ question: "Hoe snel is escort service in Amsterdam Centrum beschikbaar?", answer: "Vaak binnen 45-75 minuten. Voor weekendavonden adviseren we 1-2 uur vooraf te boeken." }] },
  "escort-amsterdam-noord": { slug: "escort-amsterdam-noord", city: "Amsterdam Noord", province: "Noord-Holland", title: "Escort Service in Amsterdam Noord", metaTitle: "Escort Service Amsterdam Noord", metaDescription: "Escort Service in Amsterdam Noord.", serviceTimeValue: "45-75 min", priceFromValue: "€160", minDurationValue: "1 uur", speedSummary: "Snelle service", pricingSummary: "Vanaf €160", heroIntro: "Escort service in Amsterdam Noord.", usps: defaultUsps, locationImagePrimaryUrl: "https://desire-escorts.nl/wp-content/uploads/escort-dames-in-amsterdam-noord-scaled.jpg", locationImagePrimaryAlt: "Escort in Amsterdam Noord", locationImageSecondaryUrl: "https://desire-escorts.nl/wp-content/uploads/escort-dames-in-amsterdam-noord-scaled.jpg", locationImageSecondaryAlt: "Escort in Amsterdam Noord", locationNarrative: "Amsterdam Noord is populair voor thuisafspraken, hotels en last-minute boekingen.", quotePool: ["Prettig en discreet geregeld."], hotels: [{ name: "DoubleTree by Hilton Amsterdam - NDSM Wharf", description: "Populaire locatie in Noord met goede privacy en snelle bereikbaarheid." }], services: defaultServices, nearbyLocations: [{ label: "Escort Amsterdam", href: "/escort-amsterdam" }, { label: "Escort Amsterdam West", href: "/escort-amsterdam-west" }], blogPosts: defaultBlogPosts, faqs: [{ question: "Is hotel escort in Amsterdam Noord mogelijk?", answer: "Ja, we leveren regelmatig aan hotels in Noord met discrete aankomst en vertrek." }] },
  "escort-amsterdam-oost": { slug: "escort-amsterdam-oost", city: "Amsterdam Oost", province: "Noord-Holland", title: "Escort Service in Amsterdam Oost", metaTitle: "Escort Service Amsterdam Oost", metaDescription: "Escort Service in Amsterdam Oost.", serviceTimeValue: "45-75 min", priceFromValue: "€160", minDurationValue: "1 uur", speedSummary: "Snelle service", pricingSummary: "Vanaf €160", heroIntro: "Escort service in Amsterdam Oost.", usps: defaultUsps, locationImagePrimaryUrl: "https://desire-escorts.nl/wp-content/uploads/escort-amsterdam-oost-scaled.jpg", locationImagePrimaryAlt: "Escort in Amsterdam Oost", locationImageSecondaryUrl: "https://desire-escorts.nl/wp-content/uploads/escort-amsterdam-oost-scaled.jpg", locationImageSecondaryAlt: "Escort in Amsterdam Oost", locationNarrative: "Amsterdam Oost combineert zakelijke afspraken, hotels en avondboekingen rondom Oostelijk havengebied en Watergraafsmeer.", quotePool: ["Snel en professioneel geholpen."], hotels: [{ name: "Hotel V Fizeaustraat", description: "Moderne hotelsetting in Oost, vaak gekozen voor discrete afspraken." }], services: defaultServices, nearbyLocations: [{ label: "Escort Amsterdam", href: "/escort-amsterdam" }, { label: "Escort Amsterdam Zuid", href: "/escort-amsterdam-zuid" }], blogPosts: defaultBlogPosts, faqs: [{ question: "Komt de escort naar hotels in Amsterdam Oost?", answer: "Ja, hotelafspraken in Amsterdam Oost zijn mogelijk met vooraf afgestemde aankomsttijd." }] },
  "escort-amsterdam-west": { slug: "escort-amsterdam-west", city: "Amsterdam West", province: "Noord-Holland", title: "Escort Service in Amsterdam West", metaTitle: "Escort Service Amsterdam West", metaDescription: "Escort Service in Amsterdam West.", serviceTimeValue: "45-75 min", priceFromValue: "€160", minDurationValue: "1 uur", speedSummary: "Snelle service", pricingSummary: "Vanaf €160", heroIntro: "Escort service in Amsterdam West.", usps: defaultUsps, locationImagePrimaryUrl: "https://desire-escorts.nl/wp-content/uploads/escort-amsterdam-west-scaled.jpg", locationImagePrimaryAlt: "Escort in Amsterdam West", locationImageSecondaryUrl: "https://desire-escorts.nl/wp-content/uploads/escort-amsterdam-west-scaled.jpg", locationImageSecondaryAlt: "Escort in Amsterdam West", locationNarrative: "Amsterdam West is populair voor hotelafspraken rond De Hallen, Sloterdijk en de ring A10.", quotePool: ["Duidelijke communicatie en goede match."], hotels: [{ name: "WestCord Fashion Hotel", description: "Hotel in West met rustige setting en goede bereikbaarheid vanaf de ring." }], services: defaultServices, nearbyLocations: [{ label: "Escort Amsterdam", href: "/escort-amsterdam" }, { label: "Escort Amsterdam Noord", href: "/escort-amsterdam-noord" }], blogPosts: defaultBlogPosts, faqs: [{ question: "Is last-minute escort in Amsterdam West mogelijk?", answer: "Ja, vaak kunnen we binnen 45-75 minuten service leveren in Amsterdam West." }] },
  "escort-amsterdam-zuid": { slug: "escort-amsterdam-zuid", city: "Amsterdam Zuid", province: "Noord-Holland", title: "Escort Service in Amsterdam Zuid", metaTitle: "Escort Service Amsterdam Zuid", metaDescription: "Escort Service in Amsterdam Zuid.", serviceTimeValue: "45-75 min", priceFromValue: "€160", minDurationValue: "1 uur", speedSummary: "Snelle service", pricingSummary: "Vanaf €160", heroIntro: "Escort service in Amsterdam Zuid.", usps: defaultUsps, locationImagePrimaryUrl: "https://desire-escorts.nl/wp-content/uploads/escort-amsterdam-zuid.jpg", locationImagePrimaryAlt: "Escort in Amsterdam Zuid", locationImageSecondaryUrl: "https://desire-escorts.nl/wp-content/uploads/escort-amsterdam-zuid.jpg", locationImageSecondaryAlt: "Escort in Amsterdam Zuid", locationNarrative: "Amsterdam Zuid heeft veel vraag vanuit Zuidas, museumbuurt en hotelafspraken in de avond.", quotePool: ["Professioneel en discreet."], hotels: [{ name: "Hotel Okura Amsterdam", description: "Vijfsterrenhotel in Zuid met veel vraag voor discrete avondafspraken." }], services: defaultServices, nearbyLocations: [{ label: "Escort Amsterdam", href: "/escort-amsterdam" }, { label: "Escort Amstelveen", href: "/escort-amstelveen" }], blogPosts: defaultBlogPosts, faqs: [{ question: "Zijn afspraken rond Zuidas mogelijk?", answer: "Ja, we leveren regelmatig service in en rond Zuidas en hotels in Amsterdam Zuid." }] },
};

