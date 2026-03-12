import {
  locationDetailPages as legacyLocationDetailPages,
  type LocationBlogPost,
  type LocationDetailPageData,
  type LocationFaqItem,
  type LocationHotel,
  type LocationLinkItem,
} from "./location-detail-pages";

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

const amsterdamCityHotels: LocationHotel[] = [
  { name: "Waldorf Astoria Amsterdam", description: "Luxe en discrete setting aan de Herengracht." },
  { name: "Conservatorium Hotel", description: "Exclusief hotel in Amsterdam Zuid." },
  { name: "Hotel Okura Amsterdam", description: "Vijfsterrenlocatie met ruime suites." },
  { name: "W Amsterdam", description: "Centraal gelegen hotel in de binnenstad." },
  { name: "Hyatt Regency Amsterdam", description: "Rustige luxe setting aan de rand van het centrum." },
];

const districtHotels: Record<string, LocationHotel[]> = {
  "Amsterdam Centrum": [
    { name: "Amstel Hotel", description: "Luxe vijfsterrenlocatie in hartje centrum." },
    { name: "Sofitel Legend The Grand", description: "Discreet hotel nabij de Dam." },
    { name: "Hotel TwentySeven", description: "High-end suites op loopafstand van hotspots." },
  ],
  "Amsterdam Noord": [
    { name: "DoubleTree by Hilton Amsterdam - NDSM Wharf", description: "Populaire locatie in Noord." },
    { name: "Sir Adam Hotel", description: "Designhotel bij A'DAM Toren." },
    { name: "YOTEL Amsterdam", description: "Moderne kamers en discrete setting." },
  ],
  "Amsterdam Oost": [
    { name: "Hotel V Fizeaustraat", description: "Moderne hotelsetting in Oost." },
    { name: "QO Amsterdam", description: "Luxe hotel met veel privacyopties." },
    { name: "The Manor Amsterdam", description: "Stijlvol hotel dichtbij park en centrum." },
  ],
  "Amsterdam West": [
    { name: "WestCord Fashion Hotel", description: "Rustige setting en goede bereikbaarheid." },
    { name: "Hotel De Hallen", description: "Boutique hotel in Oud-West." },
    { name: "XO Hotels Park West", description: "Praktische locatie dichtbij Sloterdijk." },
  ],
  "Amsterdam Zuid": [
    { name: "Hotel Okura Amsterdam", description: "Vijfsterrenhotel in Zuid." },
    { name: "Conservatorium Hotel", description: "Exclusieve setting bij Museumplein." },
    { name: "Hilton Amsterdam", description: "Ruime kamers en discrete ontvangst." },
  ],
};

const amsterdamCityFaqs: LocationFaqItem[] = [
  {
    question: "Hoe snel is escort service in Amsterdam beschikbaar?",
    answer: "In Amsterdam is service vaak binnen 45-90 minuten mogelijk.",
  },
  {
    question: "Wat kost een escort in Amsterdam?",
    answer: "De startprijs in Amsterdam is vanaf €160 voor 1 uur.",
  },
  {
    question: "Kan ik voorkeuren doorgeven voor mijn escort in Amsterdam?",
    answer: "Ja, je kunt vooraf voorkeuren delen zodat we gericht kunnen matchen.",
  },
  {
    question: "Zijn hotelafspraken in Amsterdam mogelijk?",
    answer: "Ja, we plannen regelmatig afspraken in hotels in Centrum, Zuid en Oost.",
  },
  {
    question: "Welke betaalmethoden zijn mogelijk in Amsterdam?",
    answer: "Betalen kan onder meer via cash, pin of creditcard.",
  },
  {
    question: "Hoe gaan jullie om met privacy en discretie?",
    answer: "We behandelen gegevens vertrouwelijk en communiceren discreet.",
  },
];

function getDistrictFaqs(districtLabel: string): LocationFaqItem[] {
  return [
    {
      question: "Kan ik aangeven hoe ik wil dat mijn escort eruitziet?",
      answer: "Ja, je kunt vooraf voorkeuren delen en we matchen daarop.",
    },
    {
      question: `Hoe boek ik een escort in ${districtLabel}?`,
      answer: "Boeken gaat snel via live chat of WhatsApp.",
    },
    {
      question: "Wat zijn de opties voor betaling?",
      answer: "Betalen kan onder meer met cash, pin of creditcard.",
    },
    {
      question: "Is directe communicatie met de escort vooraf mogelijk?",
      answer: "Voor privacy loopt communicatie vooraf via ons team.",
    },
    {
      question: "Wat als ik mijn afspraak wil verzetten of annuleren?",
      answer: "Neem zo snel mogelijk contact op; we zoeken direct een oplossing.",
    },
    {
      question: `Komt de escort rechtstreeks naar een hotel in ${districtLabel}?`,
      answer: "Ja, hotelafspraken zijn mogelijk met discrete aankomst.",
    },
  ];
}

export const locationDetailPagesBatch: Record<string, LocationDetailPageData> = {
  "escort-haarlem": legacyLocationDetailPages["escort-haarlem"],
  "escort-amstelveen": legacyLocationDetailPages["escort-amstelveen"],
  "escort-amsterdam": {
    ...legacyLocationDetailPages["escort-amsterdam"],
    hotels: amsterdamCityHotels,
    faqs: amsterdamCityFaqs,
  },
  "escort-amsterdam-centrum": {
    ...legacyLocationDetailPages["escort-amsterdam-centrum"],
    heroIntro: "Discreet boeken in Amsterdam Centrum met snelle beschikbaarheid.",
    locationNarrative:
      "Amsterdam Centrum is populair voor hotelafspraken en avondboekingen rond Dam, Rembrandtplein en de grachtengordel.",
    hotels: districtHotels["Amsterdam Centrum"],
    faqs: getDistrictFaqs("Amsterdam Centrum"),
  },
  "escort-amsterdam-noord": {
    ...legacyLocationDetailPages["escort-amsterdam-noord"],
    heroIntro: "Discreet boeken in Amsterdam Noord met snelle beschikbaarheid.",
    locationNarrative:
      "Amsterdam Noord heeft veel vraag voor thuis- en hotelafspraken, vooral rondom NDSM en A'DAM-gebied.",
    hotels: districtHotels["Amsterdam Noord"],
    faqs: getDistrictFaqs("Amsterdam Noord"),
  },
  "escort-amsterdam-oost": {
    ...legacyLocationDetailPages["escort-amsterdam-oost"],
    heroIntro: "Discreet boeken in Amsterdam Oost met snelle beschikbaarheid.",
    locationNarrative:
      "Amsterdam Oost combineert zakelijke afspraken, hotels en avondboekingen rond Watergraafsmeer en Oostelijk Havengebied.",
    hotels: districtHotels["Amsterdam Oost"],
    faqs: getDistrictFaqs("Amsterdam Oost"),
  },
  "escort-amsterdam-west": {
    ...legacyLocationDetailPages["escort-amsterdam-west"],
    heroIntro: "Discreet boeken in Amsterdam West met snelle beschikbaarheid.",
    locationNarrative:
      "Amsterdam West is populair voor hotelafspraken rond De Hallen, Oud-West en Sloterdijk.",
    hotels: districtHotels["Amsterdam West"],
    faqs: getDistrictFaqs("Amsterdam West"),
  },
  "escort-amsterdam-zuid": {
    ...legacyLocationDetailPages["escort-amsterdam-zuid"],
    heroIntro: "Discreet boeken in Amsterdam Zuid met snelle beschikbaarheid.",
    locationNarrative:
      "Amsterdam Zuid heeft veel vraag vanuit Zuidas, Museumplein en hotels voor avondafspraken.",
    hotels: districtHotels["Amsterdam Zuid"],
    faqs: getDistrictFaqs("Amsterdam Zuid"),
  },
};
