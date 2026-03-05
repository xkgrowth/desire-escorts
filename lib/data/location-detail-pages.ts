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
    locationImagePrimaryAlt: "Escort service in Haarlem",
    locationImageSecondaryUrl:
      "https://desire-escorts.nl/wp-content/uploads/escort-haarlem-hotels-1-scaled.jpg",
    locationImageSecondaryAlt: "Hotels in en rond Haarlem",
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
      { label: "Hotel Escort", href: "/diensten/hotel-escorts" },
      { label: "Erotische Massage", href: "/diensten/erotische-massage" },
      { label: "Girlfriend Experience", href: "/diensten/gfe-escorts" },
      { label: "Dinner Date", href: "/diensten/dinner-date" },
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
    locationImagePrimaryAlt: "Escort service in Amstelveen",
    locationImageSecondaryUrl:
      "https://desire-escorts.nl/wp-content/uploads/escort-amstelveel-hotels-scaled.jpg",
    locationImageSecondaryAlt: "Hotels in en rond Amstelveen",
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
        name: "Adagio Amsterdam City South",
        description:
          "Stijlvolle aparthotel-optie voor langere en meer ontspannen afspraken.",
      },
    ],
    services: [
      { label: "Hotel Escort", href: "/diensten/hotel-escorts" },
      { label: "Erotische Massage", href: "/diensten/erotische-massage" },
      { label: "Girlfriend Experience", href: "/diensten/gfe-escorts" },
      { label: "24-uurs Escort", href: "/diensten/24-uurs-escort" },
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
};

