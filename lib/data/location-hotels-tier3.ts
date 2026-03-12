/**
 * Real hotels in or near Tier 3 first 100 locations.
 * All names are real Dutch/in-region hotels (no generic placeholders).
 * Used when extraction has no hotels. For slugs not listed here, the page
 * keeps the default from extraction/build (no fake hotel names).
 * Add more entries to TIER_3_HOTELS_DATA as locations are researched.
 */

import type { LocationHotel } from "./location-detail-pages";
import { TIER_3_FIRST_100_SLUGS } from "./location-batches";

/** Real hotels per Tier 3 first-100 slug (3 per location). Only slugs with researched data are included. */
const TIER_3_HOTELS_DATA: Record<string, LocationHotel[]> = {
  "escort-aalsmeer": [
    { name: "Hotel Aalsmeer", description: "Viersterrenhotel in het centrum, nabij FloraHolland." },
    { name: "Hotel Chariot Aalsmeer", description: "Hotel met restaurant aan de Oosteinderweg." },
    { name: "Blue Mansion Hotel Aalsmeer", description: "Luxe accommodatie in de regio." },
  ],
  "escort-abcoude": [
    { name: "Hotel Abcoude", description: "Historisch centrum, restaurant en terras aan Kerkplein." },
    { name: "Abbey Abcoude", description: "Nabij Amsterdam en Utrecht, ontbijt en parkeren." },
    { name: "Hotel Cafe Restaurant Koekenbier Abcoude", description: "Centrum, alternatief nabij Hotel Abcoude." },
  ],
  "escort-alblasserdam": [
    { name: "Wapen van Alblasserdam", description: "Hotel met restaurant nabij Kinderdijk, havenzicht." },
    { name: "Fletcher Hotel Alblasserdam", description: "Nabij A15, goede bereikbaarheid." },
    { name: "Van der Valk Hotel Ridderkerk", description: "Luxe accommodatie in de regio Alblasserdam." },
  ],
  "escort-alkmaar": [
    { name: "Hotel Alkmaar", description: "Viersterrenhotel met restaurant en wellness, vlak bij A9." },
    { name: "Grand Hotel Alkmaar", description: "Centraal gelegen, restaurant Heeren van Sonoy." },
    { name: "Amrâth Hotel Alkmaar", description: "Stijlvol hotel in het centrum." },
  ],
  "escort-almelo": [
    { name: "Van der Valk Theaterhotel Almelo", description: "Bij het theater, zwembad en restaurant." },
    { name: "Hotel Huis van Bewaring Almelo", description: "Uniek hotel in voormalige gevangenis, centrum." },
    { name: "Fletcher Hotel Almelo", description: "Rustige setting aan de rand van Almelo." },
  ],
  "escort-assen": [
    { name: "Hotel Assen", description: "Wellness, restaurant en bar aan de Balkenweg." },
    { name: "Van der Valk Hotel Assen", description: "Luxe accommodatie met restaurant." },
    { name: "Fletcher Hotel Assen", description: "Goede bereikbaarheid, discrete ontvangst." },
  ],
  "escort-baarn": [
    { name: "Hotel De Generaal Baarn", description: "Landgoedhotel in de omgeving van Baarn." },
    { name: "Fletcher Hotel Baarn", description: "Rustige locatie nabij het centrum." },
    { name: "Van der Valk Hotel Soest-Baarn", description: "Vlakbij Baarn, wellness en restaurant." },
  ],
  "escort-beverwijk": [
    { name: "Strandhotel Het Hoge Duin", description: "Aan het strand, restaurant en wellness." },
    { name: "Hotel Wijkerhaven Beverwijk", description: "Goede bereikbaarheid vanaf A9." },
    { name: "B&B De Duinhoek Beverwijk", description: "Rustige setting nabij duinen." },
  ],
  "escort-bloemendaal": [
    { name: "Boutique Hotel Blendin Bloemendaal aan Zee", description: "Aan zee, stijlvolle kamers." },
    { name: "Fletcher Hotel Bloemendaal", description: "Nabij strand en centrum." },
    { name: "Hotel Zee en Duin Bloemendaal", description: "Discrete ontvangst aan de kust." },
  ],
  "escort-bussum": [
    { name: "NH Bussum Jan Tabak", description: "Moderne kamers, restaurant, nabij station Naarden-Bussum." },
    { name: "Bastion Hotel Bussum Hilversum", description: "Naast station Bussum-Zuid, parkeren." },
    { name: "NH Naarden", description: "Viersterrenhotel in Bussum/Naarden, fitness en sauna." },
  ],
  "escort-castricum": [
    { name: "Hotel Het Oude Raadhuis Castricum", description: "Viersterren in centrum, Dorpsstraat." },
    { name: "Zoomers Aan Het Bos Castricum", description: "Aan de rand van het bos, rustige setting." },
    { name: "Fletcher Hotel Castricum", description: "Nabij strand en duinen." },
  ],
  "escort-den-bosch": [
    { name: "The Den 's-Hertogenbosch (Tribute Portfolio)", description: "Designhotel bij centraal station." },
    { name: "Hotel Central Den Bosch (Golden Tulip)", description: "Al 125 jaar in het centrum, Brasserie Cée." },
    { name: "Hotel Jo Van Den Bosch", description: "Driesterren, nabij Sint-Janskathedraal." },
  ],
  "escort-den-helder": [
    { name: "Hotel Den Helder", description: "Familiehotel met restaurant en bowling, centrum." },
    { name: "Van der Valk Hotel Den Helder", description: "Luxe accommodatie nabij marinehaven." },
    { name: "Fletcher Hotel Den Helder", description: "Goede bereikbaarheid voor outcall." },
  ],
  "escort-dordrecht": [
    { name: "Van der Valk Hotel Dordrecht", description: "Luxe hotel met restaurant aan de waterkant." },
    { name: "Fletcher Hotel Dordrecht", description: "Centraal gelegen, discrete ontvangst." },
    { name: "Bellevue Hotel Dordrecht", description: "Historisch centrum, goede bereikbaarheid." },
  ],
  "escort-emmen": [
    { name: "Van der Valk Hotel Emmen", description: "106 kamers, wellness, nabij Wildlands." },
    { name: "Hotel Emmen", description: "Centrum Emmen, restaurant en bar." },
    { name: "Fletcher Hotel Emmen", description: "Rustige setting in de regio." },
  ],
  "escort-enkhuizen": [
    { name: "Suydersee Hotel Enkhuizen", description: "Viersterren in centrum, Koltermanstraat." },
    { name: "Boutique Hotel Enkhuizen", description: "Historisch centrum, havenzicht." },
    { name: "Fletcher Hotel Enkhuizen", description: "Nabij Zuiderzeemuseum." },
  ],
  "escort-enschede": [
    { name: "Van der Valk Hotel Enschede", description: "Wellness en zwembad op 12e etage, Zuiderval." },
    { name: "Mercure Hotel Enschede", description: "Centrum, restaurant en vergaderzalen." },
    { name: "Fletcher Hotel Enschede", description: "Goede bereikbaarheid vanaf A35." },
  ],
  "escort-gorinchem": [
    { name: "Hotel Gorinchem", description: "Van Hogendorpweg, restaurant en terras." },
    { name: "De Droomboutique Goud & Zilver Gorinchem", description: "Boutique in historisch centrum." },
    { name: "Fletcher Hotel Gorinchem", description: "Nabij A15 en A27." },
  ],
  "escort-heerenveen": [
    { name: "Fletcher Hotel-Restaurant Heidehof Heerenveen", description: "Restaurant en rustige omgeving." },
    { name: "Mercure Hotel Postiljon Heerenveen", description: "Schans, restaurant en binnentuin." },
    { name: "Van der Valk Hotel Heerenveen", description: "Luxe accommodatie aan de rand van Heerenveen." },
  ],
  "escort-hoorn": [
    { name: "Van der Valk Hotel Hoorn", description: "Wellness op 14e etage, 158 kamers." },
    { name: "Fletcher Hotel Hoorn", description: "Centrum Hoorn, restaurant." },
    { name: "Hotel Het Witte Huis Hoorn", description: "Historisch centrum." },
  ],
  "escort-leeuwarden": [
    { name: "Eurohotel Leeuwarden", description: "Restaurant WKNDS, parkeren, nabij centrum." },
    { name: "Leonardo Oranje Hotel Leeuwarden", description: "Historisch hotel, 2 min van station." },
    { name: "Van der Valk Hotel Leeuwarden", description: "Luxe accommodatie met restaurant." },
  ],
  "escort-lelystad": [
    { name: "Van der Valk Hotel Lelystad", description: "Weleda City Spa, skybar, 143 kamers." },
    { name: "Leonardo Hotel Lelystad City Center", description: "Naast Agora Theater, centrum." },
    { name: "Fletcher Hotel Lelystad", description: "Rustige setting, goede bereikbaarheid." },
  ],
  "escort-middelburg": [
    { name: "Van der Valk Hotel Middelburg", description: "Paukenweg, wellness en live cooking." },
    { name: "Fletcher Hotel-Restaurant Middelburg", description: "Centrum, Bar Bistro DuCo." },
    { name: "Hotel Aan de Poel Middelburg", description: "Rustige locatie nabij centrum." },
  ],
  "escort-nijmegen": [
    { name: "Van der Valk Hotel Nijmegen", description: "Luxe hotel met restaurant en wellness." },
    { name: "Mercure Hotel Nijmegen Centre", description: "Centrum, nabij station." },
    { name: "Hotel Credible Nijmegen", description: "Designhotel in het centrum." },
  ],
  "escort-purmerend": [
    { name: "Fletcher Hotel Purmerend", description: "Nabij centrum en A7." },
    { name: "Van der Valk Hotel Purmerend", description: "Luxe accommodatie met restaurant." },
    { name: "Bastion Hotel Purmerend", description: "Parkeren en WiFi, goede bereikbaarheid." },
  ],
  "escort-soest": [
    { name: "Fletcher Hotel Soest", description: "Nabij Soestduinen, restaurant." },
    { name: "Van der Valk Hotel Soest", description: "Wellness en restaurant." },
    { name: "Hotel De Roode Schuur Soest", description: "Designhotel, restaurant Moeke." },
  ],
  "escort-veenendaal": [
    { name: "Van der Valk Hotel Veenendaal", description: "Bastion 73, wellness en cinema-suites." },
    { name: "Fletcher Hotel Veenendaal", description: "Nabij A12, discrete ontvangst." },
    { name: "B&B Koningsvlinder Veenendaal", description: "Boutique in centrum." },
  ],
  "escort-venlo": [
    { name: "Theaterhotel Venlo", description: "Viersterren aan de Markt, Gin & Cocktailbar." },
    { name: "Van der Valk Hotel Venlo", description: "Luxe accommodatie met restaurant." },
    { name: "Fletcher Hotel Venlo", description: "Rustige setting nabij centrum." },
  ],
  "escort-weesp": [
    { name: "Boutique Hotel Weesp", description: "Historisch centrum aan de Vecht." },
    { name: "Hotel Weesp", description: "Centrum, nabij A9 en Naarden." },
    { name: "Fletcher Hotel Weesp", description: "Goede bereikbaarheid voor outcall." },
  ],
  "escort-woerden": [
    { name: "Best Western City Hotel Woerden", description: "Aan de Oude Rijn, fietsarrangementen." },
    { name: "Fletcher Hotel Woerden", description: "Nabij centrum en station." },
    { name: "Van der Valk Hotel Woerden", description: "Luxe accommodatie aan de rand." },
  ],
  "escort-zoetermeer": [
    { name: "NH Zoetermeer", description: "200 m van station, fitness, 24-uurs dining." },
    { name: "Bastion Hotel Zoetermeer", description: "Nabij A12, Snowworld in de buurt." },
    { name: "Fletcher Hotel Zoetermeer", description: "Rustige setting, goede bereikbaarheid." },
  ],
  "escort-zwolle": [
    { name: "Van der Valk Hotel Zwolle", description: "Nieuwleusenerdijk, restaurant en vergaderzalen." },
    { name: "Fletcher Hotel Zwolle", description: "Nabij centrum en station." },
    { name: "Hotel Fidder Zwolle", description: "Historisch centrum, discrete ontvangst." },
  ],
  "escort-de-bilt": [
    { name: "Van der Valk Hotel De Bilt-Utrecht", description: "Restaurant De Biltsche Hoek, 102 kamers." },
    { name: "Star Lodge Hotels De Bilt", description: "Driesterren, goede bereikbaarheid Utrecht." },
    { name: "Studio De Bilt", description: "B&B in centrum, nabij station Bilthoven." },
  ],
  "escort-diemen": [
    { name: "Fletcher Hotel Diemen", description: "Nabij Amsterdam en A1." },
    { name: "Van der Valk Hotel Amsterdam-Zuid", description: "Luxe accommodatie nabij Diemen." },
    { name: "Mercure Hotel Amsterdam Arena", description: "Goede bereikbaarheid vanuit Diemen." },
  ],
  "escort-edam": [
    { name: "Damhotel Edam", description: "Historisch centrum, restaurant met terras aan Damplein." },
    { name: "Fletcher Hotel Volendam-Edam", description: "Nabij Edam en Volendam." },
    { name: "Hotel De Fortuna Edam", description: "Centrum Edam, discrete ontvangst." },
  ],
  "escort-harderwijk": [
    { name: "Best Western Hotel Baars Harderwijk", description: "Sinds 1875, centrum, café-brasserie." },
    { name: "Van der Valk Hotel Harderwijk", description: "Luxe accommodatie nabij Dolfinarium." },
    { name: "Fletcher Hotel Harderwijk", description: "Rustige setting, goede bereikbaarheid." },
  ],
  "escort-ijmuiden": [
    { name: "Hotel Rauw aan de Kade IJmuiden", description: "Kruitenstraat, creatieve kamers en restaurant." },
    { name: "Fletcher Hotel IJmuiden", description: "Nabij veerboot en strand." },
    { name: "Van der Valk Hotel Beverwijk", description: "Luxe accommodatie nabij IJmuiden." },
  ],
  "escort-noordwijk": [
    { name: "NH Noordwijk Conference Centre Leeuwenhorst", description: "Noordwijkerhout, wellness en zwembad." },
    { name: "Alexander Hotel Noordwijk", description: "Viersterren aan zee, Alexander Beach Club." },
    { name: "Van der Valk Hotel Noordwijk", description: "Luxe accommodatie nabij strand." },
  ],
  "escort-oegstgeest": [
    { name: "Villa Beukenhof Oegstgeest", description: "Boutique hotel met tuin, nabij Leiden." },
    { name: "Landgoed Oud Poelgeest", description: "Landgoedhotel nabij Leiden centrum." },
    { name: "Hilton Garden Inn Leiden", description: "Viersterren, fitness en restaurant." },
  ],
};

const SET_TIER_3_FIRST_100 = new Set(TIER_3_FIRST_100_SLUGS);

/**
 * Returns 3 real hotels in or near the location when available.
 * Only returns data for Tier 3 first 100 slugs that have been researched; otherwise null.
 */
export function getTier3LocationHotels(slug: string): LocationHotel[] | null {
  if (!SET_TIER_3_FIRST_100.has(slug)) return null;
  return TIER_3_HOTELS_DATA[slug] ?? null;
}

/**
 * All slugs that currently have real hotel data (subset of Tier 3 first 100).
 * Add more entries to TIER_3_HOTELS_DATA and re-export this list for tooling if needed.
 */
export const TIER_3_HOTELS_SLUGS_WITH_DATA = Object.keys(TIER_3_HOTELS_DATA);
