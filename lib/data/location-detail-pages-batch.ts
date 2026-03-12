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
    locationImagePrimaryAlt: "Blonde escort met lichte ogen en zwarte lingerie liggend op bed",
    locationImageSecondaryAlt: "Blonde escort met donkere ogen en rode lingerie met handen in haar heupej",
    hotels: amsterdamCityHotels,
    faqs: amsterdamCityFaqs,
  },
  "escort-amsterdam-centrum": {
    ...legacyLocationDetailPages["escort-amsterdam-centrum"],
    heroIntro: "Discreet boeken in Amsterdam Centrum met snelle beschikbaarheid.",
    locationImagePrimaryAlt: "Blonde escort met donkere ogen en rode lingerie met handen in haar heupej",
    locationImageSecondaryAlt: "Blonde escort met donkere ogen en rode lingerie met handen in haar heupej",
    locationNarrative:
      "Amsterdam Centrum is populair voor hotelafspraken en avondboekingen rond Dam, Rembrandtplein en de grachtengordel.",
    hotels: districtHotels["Amsterdam Centrum"],
    faqs: getDistrictFaqs("Amsterdam Centrum"),
  },
  "escort-amsterdam-noord": {
    ...legacyLocationDetailPages["escort-amsterdam-noord"],
    heroIntro: "Discreet boeken in Amsterdam Noord met snelle beschikbaarheid.",
    locationImagePrimaryAlt: "Blonde escort met blauwe ogen en kleurrijke lingerie",
    locationImageSecondaryAlt: "Blonde escort met blauwe ogen en kleurrijke lingerie",
    locationNarrative:
      "Amsterdam Noord heeft veel vraag voor thuis- en hotelafspraken, vooral rondom NDSM en A'DAM-gebied.",
    hotels: districtHotels["Amsterdam Noord"],
    faqs: getDistrictFaqs("Amsterdam Noord"),
  },
  "escort-amsterdam-oost": {
    ...legacyLocationDetailPages["escort-amsterdam-oost"],
    heroIntro: "Discreet boeken in Amsterdam Oost met snelle beschikbaarheid.",
    locationImagePrimaryAlt: "brunette escort met zwarte lingerie en mooie borsten, liggend in bed",
    locationImageSecondaryAlt: "brunette escort met zwarte lingerie en mooie borsten, liggend in bed",
    locationNarrative:
      "Amsterdam Oost combineert zakelijke afspraken, hotels en avondboekingen rond Watergraafsmeer en Oostelijk Havengebied.",
    hotels: districtHotels["Amsterdam Oost"],
    faqs: getDistrictFaqs("Amsterdam Oost"),
  },
  "escort-amsterdam-west": {
    ...legacyLocationDetailPages["escort-amsterdam-west"],
    heroIntro: "Discreet boeken in Amsterdam West met snelle beschikbaarheid.",
    locationImagePrimaryAlt: "blonde escort met lichte ogen, mooie borsten en roze lingerie",
    locationImageSecondaryAlt: "blonde escort met lichte ogen, mooie borsten en roze lingerie",
    locationNarrative:
      "Amsterdam West is populair voor hotelafspraken rond De Hallen, Oud-West en Sloterdijk.",
    hotels: districtHotels["Amsterdam West"],
    faqs: getDistrictFaqs("Amsterdam West"),
  },
  "escort-amsterdam-zuid": {
    ...legacyLocationDetailPages["escort-amsterdam-zuid"],
    heroIntro: "Discreet boeken in Amsterdam Zuid met snelle beschikbaarheid.",
    locationImagePrimaryAlt: "Brunette escort met rode lippenstift, smalle taile en grijs hempje",
    locationImageSecondaryAlt: "Brunette escort met rode lippenstift, smalle taile en grijs hempje",
    locationNarrative:
      "Amsterdam Zuid heeft veel vraag vanuit Zuidas, Museumplein en hotels voor avondafspraken.",
    hotels: districtHotels["Amsterdam Zuid"],
    faqs: getDistrictFaqs("Amsterdam Zuid"),
  },
};

// Batch 2: overrides merged with build-from-extraction so Rotterdam, Den Haag, Utrecht match Amsterdam quality.
// Hotels: no fixed limit — use all relevant options (Amsterdam/Haarlem style).
const rotterdamHotels: LocationHotel[] = [
  { name: "Mainport Hotel", description: "Luxe aan de Maas met discrete ontvangst, populair voor zakelijke en avondafspraken." },
  { name: "SS Rotterdam", description: "Iconisch schip-hotel aan de Maas met unieke setting voor afspraken." },
  { name: "nhow Rotterdam", description: "Designhotel op Kop van Zuid met goede bereikbaarheid en ruime kamers." },
  { name: "Hilton Rotterdam", description: "Centraal aan de Coolsingel, veel gebruikt voor hotelafspraken in het centrum." },
  { name: "Bilderberg Engels", description: "Stijlvol hotel nabij het centrum met discrete en rustige setting." },
  { name: "Hotel Pincoffs", description: "Boutique hotel op Kop van Zuid aan het water, geschikt voor private ontmoetingen." },
];

const denHaagHotels: LocationHotel[] = [
  { name: "Kurhaus Hotel", description: "Klassieke setting aan het strand van Scheveningen, veel vraag voor avondafspraken." },
  { name: "Carlton Ambassador", description: "Centraal in Den Haag met discrete ontvangst en goede bereikbaarheid." },
  { name: "Steigenberger Kurhaus", description: "Luxe hotel in Scheveningen, populair voor hotel- en dinnerdate-afspraken." },
  { name: "Hotel Des Indes", description: "Historisch luxehotel in het centrum met rustige, discrete sfeer." },
  { name: "NH Den Haag", description: "Centraal gelegen, geschikt voor snelle inplanning van afspraken." },
];

const utrechtHotels: LocationHotel[] = [
  { name: "Grand Hotel Karel V", description: "Luxe en discrete setting in het centrum, populair voor exclusieve afspraken." },
  { name: "Mary K Hotel", description: "Boutique hotel nabij de Dom met intieme en stijlvolle kamers." },
  { name: "NH Centre Utrecht", description: "Centraal gelegen voor afspraken, goede bereikbaarheid." },
  { name: "Hotel Mitland", description: "Rustige setting aan de rand van het centrum met discrete ontvangst." },
  { name: "BUNK Hotel Utrecht", description: "Moderne locatie nabij het centrum, geschikt voor avondafspraken." },
];

const rotterdamFaqs: LocationFaqItem[] = [
  { question: "Hoe snel is escort service in Rotterdam beschikbaar?", answer: "In Rotterdam is service vaak binnen 45–90 minuten mogelijk." },
  { question: "Wat kost een escort in Rotterdam?", answer: "De startprijs in Rotterdam is vanaf €160 voor 1 uur." },
  { question: "Zijn hotelafspraken in Rotterdam mogelijk?", answer: "Ja, we plannen regelmatig afspraken in hotels in het centrum en aan de Maas." },
  { question: "Welke betaalmethoden zijn mogelijk?", answer: "Betalen kan onder meer via cash, pin of creditcard." },
  { question: "Hoe gaan jullie om met privacy?", answer: "We behandelen gegevens vertrouwelijk en communiceren discreet." },
];

const denHaagFaqs: LocationFaqItem[] = [
  { question: "Hoe snel is escort service in Den Haag beschikbaar?", answer: "In Den Haag is service vaak binnen 45–90 minuten mogelijk." },
  { question: "Wat kost een escort in Den Haag?", answer: "De startprijs in Den Haag is vanaf €160 voor 1 uur." },
  { question: "Zijn hotelafspraken in Den Haag mogelijk?", answer: "Ja, onder meer in Scheveningen en het centrum." },
  { question: "Welke betaalmethoden zijn mogelijk?", answer: "Betalen kan onder meer via cash, pin of creditcard." },
  { question: "Hoe gaan jullie om met privacy?", answer: "We behandelen gegevens vertrouwelijk en communiceren discreet." },
];

const utrechtFaqs: LocationFaqItem[] = [
  { question: "Hoe snel is escort service in Utrecht beschikbaar?", answer: "In Utrecht is service vaak binnen 45–90 minuten mogelijk." },
  { question: "Wat kost een escort in Utrecht?", answer: "De startprijs in Utrecht is vanaf €160 voor 1 uur." },
  { question: "Zijn hotelafspraken in Utrecht mogelijk?", answer: "Ja, we plannen regelmatig afspraken in hotels rond het centrum." },
  { question: "Welke betaalmethoden zijn mogelijk?", answer: "Betalen kan onder meer via cash, pin of creditcard." },
  { question: "Hoe gaan jullie om met privacy?", answer: "We behandelen gegevens vertrouwelijk en communiceren discreet." },
];

const eindhovenHotels: LocationHotel[] = [
  { name: "Pullman Eindhoven Cocagne", description: "Centraal aan het Stadhuisplein met discrete ontvangst en goede bereikbaarheid." },
  { name: "Van der Valk Hotel Eindhoven", description: "Ruime kamers en rustige setting, populair voor hotelafspraken." },
  { name: "NH Collection Eindhoven", description: "Moderne locatie nabij het centrum, geschikt voor avondafspraken." },
  { name: "Hotel Mariënhage", description: "Stijlvol hotel in het centrum met discrete sfeer." },
  { name: "Inntel Hotels Art Eindhoven", description: "Designhotel dichtbij het station, goede optie voor zakelijke gasten." },
];

const groningenHotels: LocationHotel[] = [
  { name: "Martini Hotel", description: "Centraal aan de Grote Markt met discrete en stijlvolle setting." },
  { name: "NH Hotel Groningen", description: "Nabij het centrum, geschikt voor snelle inplanning van afspraken." },
  { name: "Hotel Prinsenhof", description: "Rustige locatie met goede privacy voor private ontmoetingen." },
  { name: "Hotel Corps de Garde", description: "Boutique hotel in het centrum, populair voor avondafspraken." },
  { name: "Student Hotel Groningen", description: "Moderne setting nabij het centrum met discrete ontvangst." },
];

const eindhovenFaqs: LocationFaqItem[] = [
  { question: "Hoe snel is escort service in Eindhoven beschikbaar?", answer: "In Eindhoven is service vaak binnen 45–90 minuten mogelijk." },
  { question: "Wat kost een escort in Eindhoven?", answer: "De startprijs in Eindhoven is vanaf €160 voor 1 uur." },
  { question: "Zijn hotelafspraken in Eindhoven mogelijk?", answer: "Ja, we plannen regelmatig afspraken in hotels in het centrum en rond het station." },
  { question: "Welke betaalmethoden zijn mogelijk?", answer: "Betalen kan onder meer via cash, pin of creditcard." },
  { question: "Hoe gaan jullie om met privacy?", answer: "We behandelen gegevens vertrouwelijk en communiceren discreet." },
];

const groningenFaqs: LocationFaqItem[] = [
  { question: "Hoe snel is escort service in Groningen beschikbaar?", answer: "In Groningen is service vaak binnen 45–90 minuten mogelijk." },
  { question: "Wat kost een escort in Groningen?", answer: "De startprijs in Groningen is vanaf €160 voor 1 uur." },
  { question: "Zijn hotelafspraken in Groningen mogelijk?", answer: "Ja, we plannen regelmatig afspraken in hotels rond de Grote Markt en het centrum." },
  { question: "Welke betaalmethoden zijn mogelijk?", answer: "Betalen kan onder meer via cash, pin of creditcard." },
  { question: "Hoe gaan jullie om met privacy?", answer: "We behandelen gegevens vertrouwelijk en communiceren discreet." },
];

export type LocationDetailPageOverrides = Partial<LocationDetailPageData>;

export const batchOverrides: Record<string, LocationDetailPageOverrides> = {
  "escort-rotterdam": {
    heroIntro:
      "Wil je snel en discreet een escort in Rotterdam boeken? We combineren snelle beschikbaarheid met geverifieerde profielen en heldere prijsafspraken vooraf.",
    locationNarrative:
      "Rotterdam heeft doorlopend vraag vanuit het centrum, Kop van Zuid en zakelijke gasten in hotels aan de Maas. Afspraken in Centrum, Kralingen, Delfshaven en rond de Erasmusbrug zijn meestal snel in te plannen wanneer je 1–2 uur vooraf boekt. Voor last-minute aanvragen stemmen we beschikbaarheid, locatie en voorkeuren met je af via live chat of WhatsApp. Hotelafspraken in Mainport, nhow of SS Rotterdam combineren we vaak met dinner date of GFE.",
    hotels: rotterdamHotels,
    faqs: rotterdamFaqs,
    locationImageSecondaryUrl: "https://desire-escorts.nl/wp-content/uploads/home-featured-3-scaled.jpg.avif",
    locationImageSecondaryAlt: "Escort in elegante setting",
  },
  "escort-den-haag": {
    heroIntro:
      "Wil je snel en discreet een escort in Den Haag boeken? We combineren snelle beschikbaarheid met geverifieerde profielen en heldere prijsafspraken vooraf.",
    locationNarrative:
      "Den Haag is populair voor avondboekingen, hotelafspraken in het centrum en in Scheveningen. De vraag zit vaak in de avonduren en het weekend; vroeg boeken geeft de meeste keuze. Voor afspraken bij het Kurhaus, in het centrum en richting het strand plannen we doorgaans het snelst. Hotelafspraken worden vaak gecombineerd met dinner date of een rustige privé-ontmoeting.",
    hotels: denHaagHotels,
    faqs: denHaagFaqs,
  },
  "escort-utrecht": {
    heroIntro:
      "Wil je snel en discreet een escort in Utrecht boeken? We combineren snelle beschikbaarheid met geverifieerde profielen en heldere prijsafspraken vooraf.",
    locationNarrative:
      "Utrecht heeft veel vraag vanuit het centrum, rond de Dom en zakelijke gasten in hotels. Afspraken in het centrum en nabij het station zijn meestal snel in te plannen wanneer je 1–2 uur vooraf boekt. Voor last-minute stemmen we beschikbaarheid en voorkeuren met je af via live chat of WhatsApp. Hotelafspraken in Karel V, Mary K of NH Centre combineren we vaak met dinner date of ontspannende massage.",
    hotels: utrechtHotels,
    faqs: utrechtFaqs,
  },
  "escort-eindhoven": {
    heroIntro:
      "Wil je snel en discreet een escort in Eindhoven boeken? We combineren snelle beschikbaarheid met geverifieerde profielen en heldere prijsafspraken vooraf.",
    locationNarrative:
      "Eindhoven heeft veel vraag vanuit het centrum, rond het station en zakelijke gasten in hotels. Afspraken in het centrum en nabij Stratumseind zijn meestal snel in te plannen wanneer je 1–2 uur vooraf boekt. Voor last-minute stemmen we beschikbaarheid en voorkeuren met je af via live chat of WhatsApp. Hotelafspraken in Pullman, Van der Valk of NH Collection combineren we vaak met dinner date of ontspannende massage.",
    hotels: eindhovenHotels,
    faqs: eindhovenFaqs,
  },
  "escort-groningen": {
    heroIntro:
      "Wil je snel en discreet een escort in Groningen boeken? We combineren snelle beschikbaarheid met geverifieerde profielen en heldere prijsafspraken vooraf.",
    locationNarrative:
      "Groningen is populair voor avondboekingen, hotelafspraken rond de Grote Markt en in het centrum. De vraag zit vaak in de avonduren en het weekend; vroeg boeken geeft de meeste keuze. Voor afspraken bij het Martini Hotel, in het centrum en nabij het station plannen we doorgaans het snelst. Hotelafspraken worden vaak gecombineerd met dinner date of een rustige privé-ontmoeting.",
    hotels: groningenHotels,
    faqs: groningenFaqs,
  },
};
