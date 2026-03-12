export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqCategory = {
  slug: string;
  name: string;
  faqs: FaqItem[];
};

const FAQ_DATA: FaqCategory[] = [
  {
    slug: "boeken-reserveringen",
    name: "Boekingen & Reserveringen",
    faqs: [
      {
        question: "Kan ik een boeking last-minute annuleren of wijzigen?",
        answer:
          "Wijzigingen zijn mogelijk, maar last-minute annuleringen door jou leiden tot het verlies van de aanbetaling. Dit is ter compensatie van de gereserveerde tijd.",
      },
      {
        question: "Hoe plaats ik mijn eerste, discrete boeking?",
        answer:
          "Een boeking begint met een discrete chat via onze widget. Je deelt de datum, duur en jouw locatie. Na verificatie en de aanbetaling is de afspraak bevestigd.",
      },
      {
        question: "Wat is de minimale leeftijd om een escort te boeken?",
        answer:
          "De minimale leeftijd is strikt 18 jaar. Wij houden ons aan de Nederlandse wet en eisen ID-verificatie bij elke eerste boeking om dit te garanderen.",
      },
      {
        question: "Moet ik mij legitimeren om te boeken?",
        answer:
          "Ja, dit is verplicht. Wij controleren jouw ID strikt op leeftijd (minimaal 18 jaar) en voor de veiligheid van onze escorts. Jouw volledige ID-gegevens worden nooit gedeeld met de escort.",
      },
      {
        question: "Wat gebeurt er als ik moet annuleren?",
        answer:
          "Voor annuleringen vragen we je om ons zo snel mogelijk te informeren. Voor annuleringen binnen 24 uur voor de afspraak kan een annuleringsvergoeding van toepassing zijn.",
      },
      {
        question: "Moet ik direct een aanbetaling doen om mijn boeking vast te leggen?",
        answer:
          "Nee, een kleine aanbetaling is niet vereist om de afspraak te garanderen.",
      },
      {
        question: "Zijn alle boekingen en mijn identiteit anoniem?",
        answer:
          "Absoluut. Discretie is onze hoogste prioriteit. Alle communicatie en gegevens zijn beveiligd.",
      },
    ],
  },
  {
    slug: "prijzen-betaling",
    name: "Prijzen & Betaling",
    faqs: [
      {
        question: "Is het toegestaan om de Escort cadeaus te geven?",
        answer:
          "Cadeaus zijn optioneel en worden als een vriendelijk gebaar gewaardeerd. De Escort is echter niet verplicht deze aan te nemen. Dit staat los van de betaling of fooi.",
      },
      {
        question: "Kan ik tijdens de afspraak van gedachten veranderen over de duur?",
        answer:
          "Ja, verlenging is vaak mogelijk, mits de Escort geen vervolgafspraak heeft. Dit moet direct met de Escort worden besproken. De extra tijd wordt contant afgerekend tegen het geldende uurtarief.",
      },
      {
        question: "Wordt fooi (tipping) verwacht?",
        answer:
          "Nee, fooi geven is absoluut niet verplicht. Het is een optioneel gebaar dat alleen gewaardeerd wordt als je een uitzonderlijke ervaring hebt gehad.",
      },
      {
        question: "Moet ik de volledige betaling vooraf voldoen?",
        answer:
          "Nee, er is een verplichte aanbetaling nodig om de boeking te bevestigen. De restbetaling voldoe je contant en passend aan de Escort bij aanvang van de afspraak.",
      },
      {
        question: "Wat is het tarief van de escort en is de prijs all-in?",
        answer:
          "Onze tarieven variëren afhankelijk van de locatie: €160 voor Amsterdam, Schiphol, Haarlem en Hoofddorp. €180 voor Zandvoort en Heemskerk. €200 voor Leiden, Utrecht en Vianen. €350 (2 uur) voor Rotterdam, Den Haag en Delft. €480 (3 uur) voor Eindhoven. €1.200 (6 uur) voor Maastricht.",
      },
    ],
  },
  {
    slug: "services-ervaring",
    name: "Services & Ervaring",
    faqs: [
      {
        question: "Mag ik contact houden met de escort na afloop van de boeking?",
        answer:
          "Nee, persoonlijk contact na de boeking is niet toegestaan. Alle communicatie verloopt uitsluitend via de officiële kanalen van het bureau om de discretie en professionele grenzen te waarborgen.",
      },
      {
        question:
          "Wat moet ik doen als ik de sfeer tijdens de afspraak plotseling niet prettig vind?",
        answer:
          "Je mag de afspraak altijd stopzetten als je je ongemakkelijk voelt. Bespreek dit discreet met de escort. Mocht er een geschil ontstaan over de reden, neem dan direct contact op met het bureau.",
      },
      {
        question: "Moet ik over persoonlijke onderwerpen praten als ik dat niet wil?",
        answer:
          "Nee. Eén van de belangrijkste regels van etiquette is respect voor privacy. Je bent niet verplicht om persoonlijke, financiële of zakelijke details te delen. De focus ligt op jouw comfort en de beleving.",
      },
      {
        question: "Is er een verschil in de Girlfriend Experience per escort?",
        answer:
          "Absoluut. GFE is een persoonlijke beleving, dus de exacte invulling is afhankelijk van de escort en haar persoonlijkheid. De basisbeginselen van discretie en respect blijven uiteraard altijd gelijk.",
      },
      {
        question: "Kan ik specifieke wensen of fantasieën op voorhand bespreken?",
        answer:
          "Ja, dat is sterk aanbevolen. Bespreek alle wensen of fantasieën discreet vooraf via de chat. De escort kan dan bepalen of dit binnen haar grenzen en de Algemene Voorwaarden valt.",
      },
    ],
  },
  {
    slug: "discretie-veiligheid",
    name: "Discretie & Veiligheid",
    faqs: [
      {
        question: "Wat als ik de Escort herken (of zij mij)?",
        answer:
          "Gezien de noodzaak tot discretie, zal de Escort altijd professioneel handelen. De afspraak kan alleen plaatsvinden als beide partijen zich comfortabel voelen en de privacyregels volledig worden gerespecteerd.",
      },
      {
        question: "Wat gebeurt er als de Escort mijn locatie (hotel) weigert?",
        answer:
          "Dit gebeurt zelden. De Escort behoudt echter het recht om de locatie te weigeren indien deze als onveilig of ongeschikt wordt ervaren, conform onze Algemene Voorwaarden. Wij zullen dan proberen snel een alternatieve, veilige locatie te regelen.",
      },
      {
        question: "Wat moet ik doen als ik een klacht of geschil heb?",
        answer:
          "Neem binnen 24 uur discreet contact op met het Bureau via de live chat. Wij behandelen klachten vertrouwelijk en onpartijdig conform onze voorwaarden.",
      },
      {
        question: "Worden alle escorts legaal en gescreend?",
        answer:
          "Ja, al onze escorts werken legaal als onafhankelijke professionals en zijn gescreend om de veiligheid en betrouwbaarheid te garanderen.",
      },
      {
        question: "Wat zijn de absolute grenzen en wat is verboden?",
        answer:
          "Wij hanteren een Zero Tolerance beleid. Absolute no-go's zijn: onveilige seks (zonder condoom), drugsgebruik en het maken van opnames zonder toestemming.",
      },
      {
        question: "Hoe garanderen jullie mijn absolute discretie en anonimiteit?",
        answer:
          "Wij werken met versleutelde servers, verwijderen ID-gegevens direct na verificatie en delen logistieke data uitsluitend op basis van 'need-to-know'. De escort kent jouw volledige identiteit niet.",
      },
    ],
  },
  {
    slug: "locatie-beschikbaarheid",
    name: "Locatie & Beschikbaarheid",
    faqs: [
      {
        question: "Hoe laat moet ik de Escort precies verwachten?",
        answer:
          "Wij streven naar stiptheid. Door verkeer of externe factoren kan er een lichte vertraging zijn (max. 15 minuten). De Escort zal dit altijd discreet via de chat laten weten. Jouw boekingstijd begint pas op het moment van aankomst.",
      },
      {
        question: "Worden er extra kosten gerekend voor lange afstanden?",
        answer:
          "Voor locaties buiten onze standaard werkregio's wordt een kleine, vooraf gecommuniceerde toeslag berekend. Binnen de standaardregio's zijn de reiskosten inbegrepen.",
      },
      {
        question: "Hoe boek ik een escort in mijn hotelkamer?",
        answer:
          "Je boekt de kamer onder je eigen naam en geeft ons het hotel en kamernummer door in de chat. De escort komt discreet direct naar je kamer.",
      },
      {
        question: "Bieden jullie Incall-services aan?",
        answer:
          "Nee, Desire Escorts is een Outcall-Only bureau. De escort komt altijd naar jou toe, op een door jou gekozen, discrete locatie (thuis, hotel of kantoor).",
      },
    ],
  },
];

export function getFaqsByCategory(categorySlug: string): FaqItem[] {
  const category = FAQ_DATA.find((item) => item.slug === categorySlug);
  return category?.faqs ?? [];
}

export function getFaqCategoryName(categorySlug: string): string | null {
  const category = FAQ_DATA.find((item) => item.slug === categorySlug);
  return category?.name ?? null;
}

export function getAllFaqCategories(): FaqCategory[] {
  return FAQ_DATA;
}
