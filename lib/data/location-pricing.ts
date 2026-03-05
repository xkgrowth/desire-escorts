export type ProvincePricingRow = {
  city: string;
  slug: string;
  minPrice: number;
  minHours: number;
};

export type ProvincePricingGroup = {
  province: string;
  provinceMinPrice: number;
  rows: ProvincePricingRow[];
};

export type LocationPricingEstimate = {
  city: string;
  slug: string;
  minPrice: number;
  minHours: number;
  source: "location-page-topline" | "prijzen-table";
};

export const provincePricingGroups: ProvincePricingGroup[] = [
  {
    "province": "Noord Holland",
    "provinceMinPrice": 160,
    "rows": [
      {
        "city": "Amsterdam",
        "slug": "escort-amsterdam",
        "minPrice": 160,
        "minHours": 1
      },
      {
        "city": "Haarlem",
        "slug": "escort-haarlem",
        "minPrice": 160,
        "minHours": 1
      },
      {
        "city": "Alkmaar",
        "slug": "escort-alkmaar",
        "minPrice": 210,
        "minHours": 1
      },
      {
        "city": "Hilversum",
        "slug": "escort-hilversum",
        "minPrice": 200,
        "minHours": 1
      },
      {
        "city": "Zaandam",
        "slug": "escort-zaandam",
        "minPrice": 160,
        "minHours": 1
      },
      {
        "city": "Hoofddorp",
        "slug": "escort-hoofddorp",
        "minPrice": 160,
        "minHours": 1
      },
      {
        "city": "Purmerend",
        "slug": "escort-purmerend",
        "minPrice": 180,
        "minHours": 1
      },
      {
        "city": "Amstelveen",
        "slug": "escort-amstelveen",
        "minPrice": 160,
        "minHours": 1
      },
      {
        "city": "Bussum",
        "slug": "escort-bussum",
        "minPrice": 180,
        "minHours": 1
      },
      {
        "city": "Beverwijk",
        "slug": "escort-beverwijk",
        "minPrice": 180,
        "minHours": 1
      },
      {
        "city": "Zandvoort",
        "slug": "escort-zandvoort",
        "minPrice": 200,
        "minHours": 1
      },
      {
        "city": "Den Helder",
        "slug": "escort-den-helder",
        "minPrice": 540,
        "minHours": 3
      },
      {
        "city": "Volendam",
        "slug": "escort-volendam",
        "minPrice": 180,
        "minHours": 1
      },
      {
        "city": "Heemskerk",
        "slug": "escort-heemskerk",
        "minPrice": 180,
        "minHours": 1
      },
      {
        "city": "Huizen",
        "slug": "escort-huizen",
        "minPrice": 200,
        "minHours": 1
      }
    ]
  },
  {
    "province": "Zuid Holland",
    "provinceMinPrice": 200,
    "rows": [
      {
        "city": "Rotterdam",
        "slug": "escort-rotterdam",
        "minPrice": 350,
        "minHours": 2
      },
      {
        "city": "Den Haag",
        "slug": "escort-den-haag",
        "minPrice": 350,
        "minHours": 2
      },
      {
        "city": "Leiden",
        "slug": "escort-leiden",
        "minPrice": 200,
        "minHours": 1
      },
      {
        "city": "Dordrecht",
        "slug": "escort-dordrecht",
        "minPrice": 350,
        "minHours": 2
      },
      {
        "city": "Zoetermeer",
        "slug": "escort-zoetermeer",
        "minPrice": 350,
        "minHours": 2
      },
      {
        "city": "Delft",
        "slug": "escort-delft",
        "minPrice": 350,
        "minHours": 2
      },
      {
        "city": "Alphen aan den Rijn",
        "slug": "escort-alphen-aan-den-rijn",
        "minPrice": 200,
        "minHours": 1
      },
      {
        "city": "Schiedam",
        "slug": "escort-schiedam",
        "minPrice": 350,
        "minHours": 2
      },
      {
        "city": "Gouda",
        "slug": "escort-gouda",
        "minPrice": 350,
        "minHours": 2
      },
      {
        "city": "Spijkenisse",
        "slug": "escort-spijkenisse",
        "minPrice": 350,
        "minHours": 2
      },
      {
        "city": "Vlaardingen",
        "slug": "escort-vlaardingen",
        "minPrice": 350,
        "minHours": 2
      },
      {
        "city": "Gorinchem",
        "slug": "escort-gorinchem",
        "minPrice": 360,
        "minHours": 2
      },
      {
        "city": "Rijswijk",
        "slug": "escort-rijswijk",
        "minPrice": 350,
        "minHours": 2
      },
      {
        "city": "Leidschendam",
        "slug": "escort-leidschendam",
        "minPrice": 350,
        "minHours": 2
      }
    ]
  },
  {
    "province": "Flevoland",
    "provinceMinPrice": 200,
    "rows": [
      {
        "city": "Lelystad",
        "slug": "escort-lelystad",
        "minPrice": 350,
        "minHours": 2
      },
      {
        "city": "Almere",
        "slug": "escort-almere",
        "minPrice": 200,
        "minHours": 1
      },
      {
        "city": "Dronten",
        "slug": "escort-dronten",
        "minPrice": 350,
        "minHours": 2
      },
      {
        "city": "Emmeloord",
        "slug": "escort-emmeloord",
        "minPrice": 350,
        "minHours": 2
      },
      {
        "city": "Urk",
        "slug": "escort-urk",
        "minPrice": 350,
        "minHours": 2
      },
      {
        "city": "Zeewolde",
        "slug": "escort-zeewolde",
        "minPrice": 350,
        "minHours": 2
      },
      {
        "city": "Biddinghuizen",
        "slug": "escort-biddinghuizen",
        "minPrice": 350,
        "minHours": 2
      },
      {
        "city": "Swifterbant",
        "slug": "escort-swifterbant",
        "minPrice": 350,
        "minHours": 2
      },
      {
        "city": "Tollebeek",
        "slug": "escort-tollebeek",
        "minPrice": 360,
        "minHours": 2
      },
      {
        "city": "Nagele",
        "slug": "escort-nagele",
        "minPrice": 360,
        "minHours": 2
      }
    ]
  },
  {
    "province": "Utrecht",
    "provinceMinPrice": 200,
    "rows": [
      {
        "city": "Utrecht",
        "slug": "escort-utrecht",
        "minPrice": 200,
        "minHours": 1
      },
      {
        "city": "Amersfoort",
        "slug": "escort-amersfoort",
        "minPrice": 350,
        "minHours": 2
      },
      {
        "city": "Veenendaal",
        "slug": "escort-veenendaal",
        "minPrice": 360,
        "minHours": 2
      },
      {
        "city": "Zeist",
        "slug": "escort-zeist",
        "minPrice": 350,
        "minHours": 2
      },
      {
        "city": "Nieuwegein",
        "slug": "escort-nieuwegein",
        "minPrice": 200,
        "minHours": 1
      },
      {
        "city": "Soest",
        "slug": "escort-soest",
        "minPrice": 350,
        "minHours": 2
      },
      {
        "city": "Houten",
        "slug": "escort-houten",
        "minPrice": 350,
        "minHours": 2
      },
      {
        "city": "IJsselstein",
        "slug": "escort-ijsselstein",
        "minPrice": 200,
        "minHours": 1
      },
      {
        "city": "Woerden",
        "slug": "escort-woerden",
        "minPrice": 220,
        "minHours": 1
      },
      {
        "city": "Leusden",
        "slug": "escort-leusden",
        "minPrice": 350,
        "minHours": 2
      }
    ]
  },
  {
    "province": "Gelderland",
    "provinceMinPrice": 320,
    "rows": [
      {
        "city": "Arnhem",
        "slug": "escort-arnhem",
        "minPrice": 560,
        "minHours": 3
      },
      {
        "city": "Nijmegen",
        "slug": "escort-nijmegen",
        "minPrice": 600,
        "minHours": 3
      },
      {
        "city": "Apeldoorn",
        "slug": "escort-apeldoorn",
        "minPrice": 560,
        "minHours": 3
      },
      {
        "city": "Ede",
        "slug": "escort-ede",
        "minPrice": 600,
        "minHours": 3
      },
      {
        "city": "Doetinchem",
        "slug": "escort-doetinchem",
        "minPrice": 800,
        "minHours": 4
      },
      {
        "city": "Barneveld",
        "slug": "escort-barneveld",
        "minPrice": 540,
        "minHours": 3
      },
      {
        "city": "Zutphen",
        "slug": "escort-zutphen",
        "minPrice": 600,
        "minHours": 3
      },
      {
        "city": "Harderwijk",
        "slug": "escort-harderwijk",
        "minPrice": 360,
        "minHours": 2
      },
      {
        "city": "Tiel",
        "slug": "escort-tiel",
        "minPrice": 360,
        "minHours": 2
      },
      {
        "city": "Wijchen",
        "slug": "escort-wijchen",
        "minPrice": 720,
        "minHours": 4
      }
    ]
  },
  {
    "province": "Noord-Brabant",
    "provinceMinPrice": 350,
    "rows": [
      {
        "city": "Eindhoven",
        "slug": "escort-eindhoven",
        "minPrice": 540,
        "minHours": 3
      },
      {
        "city": "Tilburg",
        "slug": "escort-tilburg",
        "minPrice": 540,
        "minHours": 3
      },
      {
        "city": "Breda",
        "slug": "escort-breda",
        "minPrice": 540,
        "minHours": 3
      },
      {
        "city": "s-Hertogenbosch",
        "slug": "escort-s-hertogenbosch",
        "minPrice": 540,
        "minHours": 3
      },
      {
        "city": "Helmond",
        "slug": "escort-helmond",
        "minPrice": 540,
        "minHours": 3
      },
      {
        "city": "Oss",
        "slug": "escort-oss",
        "minPrice": 540,
        "minHours": 3
      },
      {
        "city": "Roosendaal",
        "slug": "escort-roosendaal",
        "minPrice": 540,
        "minHours": 3
      },
      {
        "city": "Bergen op Zoom",
        "slug": "escort-bergen-op-zoom",
        "minPrice": 540,
        "minHours": 3
      },
      {
        "city": "Veghel",
        "slug": "escort-veghel",
        "minPrice": 540,
        "minHours": 3
      },
      {
        "city": "Waalwijk",
        "slug": "escort-waalwijk",
        "minPrice": 540,
        "minHours": 3
      }
    ]
  },
  {
    "province": "Overijssel",
    "provinceMinPrice": 600,
    "rows": [
      {
        "city": "Zwolle",
        "slug": "escort-zwolle",
        "minPrice": 600,
        "minHours": 3
      },
      {
        "city": "Enschede",
        "slug": "escort-enschede",
        "minPrice": 800,
        "minHours": 4
      },
      {
        "city": "Deventer",
        "slug": "escort-deventer",
        "minPrice": 800,
        "minHours": 4
      },
      {
        "city": "Hengelo",
        "slug": "escort-hengelo",
        "minPrice": 1000,
        "minHours": 5
      },
      {
        "city": "Almelo",
        "slug": "escort-almelo",
        "minPrice": 1000,
        "minHours": 5
      },
      {
        "city": "Hardenberg",
        "slug": "escort-hardenberg",
        "minPrice": 1000,
        "minHours": 5
      },
      {
        "city": "Kampen",
        "slug": "escort-kampen",
        "minPrice": 720,
        "minHours": 4
      },
      {
        "city": "Oldenzaal",
        "slug": "escort-oldenzaal",
        "minPrice": 1200,
        "minHours": 6
      },
      {
        "city": "Raalte",
        "slug": "escort-raalte",
        "minPrice": 1000,
        "minHours": 5
      },
      {
        "city": "Rijssen",
        "slug": "escort-rijssen",
        "minPrice": 800,
        "minHours": 4
      }
    ]
  }
];

export const locationPricingEstimates: LocationPricingEstimate[] = [
  {
    "city": "Aalsmeer",
    "slug": "escort-aalsmeer",
    "minPrice": 160,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Abcoude",
    "slug": "escort-abcoude",
    "minPrice": 200,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Aerdenhout",
    "slug": "escort-aerdenhout",
    "minPrice": 160,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Akersloot",
    "slug": "escort-akersloot",
    "minPrice": 180,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Alblasserdam",
    "slug": "escort-alblasserdam",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Alkmaar",
    "slug": "escort-alkmaar",
    "minPrice": 210,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Almelo",
    "slug": "escort-almelo",
    "minPrice": 1000,
    "minHours": 5,
    "source": "location-page-topline"
  },
  {
    "city": "Almere",
    "slug": "escort-almere",
    "minPrice": 200,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Alphen aan den Rijn",
    "slug": "escort-alphen-aan-den-rijn",
    "minPrice": 200,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Amersfoort",
    "slug": "escort-amersfoort",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Amstelveen",
    "slug": "escort-amstelveen",
    "minPrice": 160,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Amsterdam",
    "slug": "escort-amsterdam",
    "minPrice": 160,
    "minHours": 1,
    "source": "prijzen-table"
  },
  {
    "city": "Amsterdam Centrum",
    "slug": "escort-amsterdam-centrum",
    "minPrice": 160,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Amsterdam Noord",
    "slug": "escort-amsterdam-noord",
    "minPrice": 160,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Amsterdam Oost",
    "slug": "escort-amsterdam-oost",
    "minPrice": 160,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Amsterdam West",
    "slug": "escort-amsterdam-west",
    "minPrice": 160,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Amsterdam Zuid",
    "slug": "escort-amsterdam-zuid",
    "minPrice": 160,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Anna Paulowna",
    "slug": "escort-anna-paulowna",
    "minPrice": 250,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Antwerpen",
    "slug": "escort-antwerpen",
    "minPrice": 800,
    "minHours": 4,
    "source": "location-page-topline"
  },
  {
    "city": "Apeldoorn",
    "slug": "escort-apeldoorn",
    "minPrice": 560,
    "minHours": 3,
    "source": "prijzen-table"
  },
  {
    "city": "Arnhem",
    "slug": "escort-arnhem",
    "minPrice": 540,
    "minHours": 3,
    "source": "location-page-topline"
  },
  {
    "city": "Assen",
    "slug": "escort-assen",
    "minPrice": 800,
    "minHours": 3,
    "source": "location-page-topline"
  },
  {
    "city": "Assendelft",
    "slug": "escort-assendelft",
    "minPrice": 160,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Avenhorn",
    "slug": "escort-avenhorn",
    "minPrice": 180,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Baambrugge",
    "slug": "escort-baambrugge",
    "minPrice": 180,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Baarn",
    "slug": "escort-baarn",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Badhoevendorp",
    "slug": "escort-badhoevendorp",
    "minPrice": 160,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Barendrecht",
    "slug": "escort-barendrecht",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Barneveld",
    "slug": "escort-barneveld",
    "minPrice": 540,
    "minHours": 3,
    "source": "prijzen-table"
  },
  {
    "city": "Beemster",
    "slug": "escort-beemster",
    "minPrice": 180,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Bennebroek",
    "slug": "escort-bennebroek",
    "minPrice": 180,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Bergambacht",
    "slug": "escort-bergambacht",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Bergen",
    "slug": "escort-bergen",
    "minPrice": 200,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Bergen op Zoom",
    "slug": "escort-bergen-op-zoom",
    "minPrice": 540,
    "minHours": 3,
    "source": "prijzen-table"
  },
  {
    "city": "Bergschenhoek",
    "slug": "escort-bergschenhoek",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Berkel en Rodenrijs",
    "slug": "escort-berkel-en-rodenrijs",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Beverwijk",
    "slug": "escort-beverwijk",
    "minPrice": 180,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Biddinghuizen",
    "slug": "escort-biddinghuizen",
    "minPrice": 350,
    "minHours": 2,
    "source": "prijzen-table"
  },
  {
    "city": "Bilthoven",
    "slug": "escort-bilthoven",
    "minPrice": 200,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Blaricum",
    "slug": "escort-blaricum",
    "minPrice": 180,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Bleiswijk",
    "slug": "escort-bleiswijk",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Bloemendaal",
    "slug": "escort-bloemendaal",
    "minPrice": 200,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Bodegraven",
    "slug": "escort-bodegraven",
    "minPrice": 200,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Bovenkarspel",
    "slug": "escort-bovenkarspel",
    "minPrice": 220,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Breda",
    "slug": "escort-breda",
    "minPrice": 540,
    "minHours": 3,
    "source": "location-page-topline"
  },
  {
    "city": "Breukelen",
    "slug": "escort-breukelen",
    "minPrice": 200,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Brielle",
    "slug": "escort-brielle",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Broek in Waterland",
    "slug": "escort-broek-in-waterland",
    "minPrice": 180,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Brussel",
    "slug": "escort-brussel",
    "minPrice": 1000,
    "minHours": 6,
    "source": "location-page-topline"
  },
  {
    "city": "Bunnik",
    "slug": "escort-bunnik",
    "minPrice": 200,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Bunschoten",
    "slug": "escort-bunschoten",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Bussum",
    "slug": "escort-bussum",
    "minPrice": 180,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Callantsoog",
    "slug": "escort-callantsoog",
    "minPrice": 250,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Capelle aan den IJssel",
    "slug": "escort-capelle-aan-den-ijssel",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Castricum",
    "slug": "escort-castricum",
    "minPrice": 180,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Culemborg",
    "slug": "escort-culemborg",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "De Bilt",
    "slug": "escort-de-bilt",
    "minPrice": 200,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "De Lier",
    "slug": "escort-de-lier",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Delfgauw",
    "slug": "escort-delfgauw",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Delft",
    "slug": "escort-delft",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Den Bosch",
    "slug": "escort-den-bosch",
    "minPrice": 450,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Den Haag",
    "slug": "escort-den-haag",
    "minPrice": 200,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Den Helder",
    "slug": "escort-den-helder",
    "minPrice": 360,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Deventer",
    "slug": "escort-deventer",
    "minPrice": 800,
    "minHours": 4,
    "source": "prijzen-table"
  },
  {
    "city": "Diemen",
    "slug": "escort-diemen",
    "minPrice": 160,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Doetinchem",
    "slug": "escort-doetinchem",
    "minPrice": 800,
    "minHours": 4,
    "source": "prijzen-table"
  },
  {
    "city": "Dordrecht",
    "slug": "escort-dordrecht",
    "minPrice": 350,
    "minHours": 2,
    "source": "prijzen-table"
  },
  {
    "city": "Drenthe",
    "slug": "escort-drenthe",
    "minPrice": 600,
    "minHours": 3,
    "source": "location-page-topline"
  },
  {
    "city": "Driebergen-Rijsenburg",
    "slug": "escort-driebergen-rijsenburg",
    "minPrice": 200,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Dronten",
    "slug": "escort-dronten",
    "minPrice": 350,
    "minHours": 2,
    "source": "prijzen-table"
  },
  {
    "city": "Duivendrecht",
    "slug": "escort-duivendrecht",
    "minPrice": 160,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Edam",
    "slug": "escort-edam",
    "minPrice": 180,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Ede",
    "slug": "escort-ede",
    "minPrice": 600,
    "minHours": 3,
    "source": "prijzen-table"
  },
  {
    "city": "Eemnes",
    "slug": "escort-eemnes",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Egmond",
    "slug": "escort-egmond",
    "minPrice": 180,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Eindhoven",
    "slug": "escort-eindhoven",
    "minPrice": 800,
    "minHours": 4,
    "source": "location-page-topline"
  },
  {
    "city": "Emmeloord",
    "slug": "escort-emmeloord",
    "minPrice": 350,
    "minHours": 2,
    "source": "prijzen-table"
  },
  {
    "city": "Emmen",
    "slug": "escort-emmen",
    "minPrice": 600,
    "minHours": 3,
    "source": "location-page-topline"
  },
  {
    "city": "Enkhuizen",
    "slug": "escort-enkhuizen",
    "minPrice": 180,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Enschede",
    "slug": "escort-enschede",
    "minPrice": 800,
    "minHours": 4,
    "source": "location-page-topline"
  },
  {
    "city": "Flevoland",
    "slug": "escort-flevoland",
    "minPrice": 200,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Frankfurt",
    "slug": "escort-frankfurt",
    "minPrice": 1500,
    "minHours": 8,
    "source": "location-page-topline"
  },
  {
    "city": "Friesland",
    "slug": "escort-friesland",
    "minPrice": 800,
    "minHours": 4,
    "source": "location-page-topline"
  },
  {
    "city": "Gelderland",
    "slug": "escort-gelderland",
    "minPrice": 360,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Gorinchem",
    "slug": "escort-gorinchem",
    "minPrice": 360,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Gouda",
    "slug": "escort-gouda",
    "minPrice": 200,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Groningen",
    "slug": "escort-groningen",
    "minPrice": 1000,
    "minHours": 5,
    "source": "location-page-topline"
  },
  {
    "city": "Grootebroek",
    "slug": "escort-grootebroek",
    "minPrice": 220,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Haarlem",
    "slug": "escort-haarlem",
    "minPrice": 160,
    "minHours": 1,
    "source": "prijzen-table"
  },
  {
    "city": "Halfweg",
    "slug": "escort-halfweg",
    "minPrice": 160,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Hardenberg",
    "slug": "escort-hardenberg",
    "minPrice": 1000,
    "minHours": 5,
    "source": "prijzen-table"
  },
  {
    "city": "Harderwijk",
    "slug": "escort-harderwijk",
    "minPrice": 360,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Harmelen",
    "slug": "escort-harmelen",
    "minPrice": 200,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Heemskerk",
    "slug": "escort-heemskerk",
    "minPrice": 180,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Heemstede",
    "slug": "escort-heemstede",
    "minPrice": 160,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Heerenveen",
    "slug": "escort-heerenveen",
    "minPrice": 800,
    "minHours": 4,
    "source": "location-page-topline"
  },
  {
    "city": "Heerhugowaard",
    "slug": "escort-heerhugowaard",
    "minPrice": 180,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Heerlen",
    "slug": "escort-heerlen",
    "minPrice": 1000,
    "minHours": 5,
    "source": "location-page-topline"
  },
  {
    "city": "Heiloo",
    "slug": "escort-heiloo",
    "minPrice": 180,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Hellevoetsluis",
    "slug": "escort-hellevoetsluis",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Helmond",
    "slug": "escort-helmond",
    "minPrice": 540,
    "minHours": 3,
    "source": "prijzen-table"
  },
  {
    "city": "Hengelo",
    "slug": "escort-hengelo",
    "minPrice": 1000,
    "minHours": 5,
    "source": "prijzen-table"
  },
  {
    "city": "Hillegom",
    "slug": "escort-hillegom",
    "minPrice": 200,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Hilversum",
    "slug": "escort-hilversum",
    "minPrice": 200,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Hoek van Holland",
    "slug": "escort-hoek-van-holland",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Honselersdijk",
    "slug": "escort-honselersdijk",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Hoofddorp",
    "slug": "escort-hoofddorp",
    "minPrice": 160,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Hoogkarspel",
    "slug": "escort-hoogkarspel",
    "minPrice": 220,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Hoorn",
    "slug": "escort-hoorn",
    "minPrice": 180,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Houten",
    "slug": "escort-houten",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Huizen",
    "slug": "escort-huizen",
    "minPrice": 200,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "IJmuiden",
    "slug": "escort-ijmuiden",
    "minPrice": 180,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "IJsselstein",
    "slug": "escort-ijsselstein",
    "minPrice": 200,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Julianadorp",
    "slug": "escort-julianadorp",
    "minPrice": 250,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Kampen",
    "slug": "escort-kampen",
    "minPrice": 720,
    "minHours": 4,
    "source": "prijzen-table"
  },
  {
    "city": "Koog aan de Zaan",
    "slug": "escort-koog-aan-de-zaan",
    "minPrice": 160,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Krimpen aan den IJssel",
    "slug": "escort-krimpen-aan-den-ijssel",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Kudelstaart",
    "slug": "escort-kudelstaart",
    "minPrice": 180,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Kwintsheul",
    "slug": "escort-kwintsheul",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Landsmeer",
    "slug": "escort-landsmeer",
    "minPrice": 160,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Laren",
    "slug": "escort-laren",
    "minPrice": 180,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Leerdam",
    "slug": "escort-leerdam",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Leeuwarden",
    "slug": "escort-leeuwarden",
    "minPrice": 800,
    "minHours": 4,
    "source": "location-page-topline"
  },
  {
    "city": "Leiden",
    "slug": "escort-leiden",
    "minPrice": 200,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Leiderdorp",
    "slug": "escort-leiderdorp",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Leidschendam",
    "slug": "escort-leidschendam",
    "minPrice": 200,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Lelystad",
    "slug": "escort-lelystad",
    "minPrice": 200,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Leusden",
    "slug": "escort-leusden",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Lijnden",
    "slug": "escort-lijnden",
    "minPrice": 160,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Limburg",
    "slug": "escort-limburg",
    "minPrice": 1000,
    "minHours": 5,
    "source": "location-page-topline"
  },
  {
    "city": "Limmen",
    "slug": "escort-limmen",
    "minPrice": 180,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Linschoten",
    "slug": "escort-linschoten",
    "minPrice": 250,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Lisse",
    "slug": "escort-lisse",
    "minPrice": 200,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Loosdrecht",
    "slug": "escort-loosdrecht",
    "minPrice": 200,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Lopik",
    "slug": "escort-lopik",
    "minPrice": 200,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Maarssen",
    "slug": "escort-maarssen",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Maartensdijk",
    "slug": "escort-maartensdijk",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Maasdijk",
    "slug": "escort-maasdijk",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Maassluis",
    "slug": "escort-maassluis",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Medemblik",
    "slug": "escort-medemblik",
    "minPrice": 180,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Middelburg",
    "slug": "escort-middelburg",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Middelharnis",
    "slug": "escort-middelharnis",
    "minPrice": 400,
    "minHours": 3,
    "source": "location-page-topline"
  },
  {
    "city": "Middenbeemster",
    "slug": "escort-middenbeemster",
    "minPrice": 180,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Mijdrecht",
    "slug": "escort-mijdrecht",
    "minPrice": 200,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Monnickendam",
    "slug": "escort-monnickendam",
    "minPrice": 180,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Monster",
    "slug": "escort-monster",
    "minPrice": 200,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Montfoort",
    "slug": "escort-montfoort",
    "minPrice": 250,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Muiden",
    "slug": "escort-muiden",
    "minPrice": 160,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Naaldwijk",
    "slug": "escort-naaldwijk",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Naarden",
    "slug": "escort-naarden",
    "minPrice": 180,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Nagele",
    "slug": "escort-nagele",
    "minPrice": 360,
    "minHours": 2,
    "source": "prijzen-table"
  },
  {
    "city": "Nieuw-Vennep",
    "slug": "escort-nieuw-vennep",
    "minPrice": 160,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Nieuwegein",
    "slug": "escort-nieuwegein",
    "minPrice": 200,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Nieuwerkerk aan den IJssel",
    "slug": "escort-nieuwerkerk-aan-den-ijssel",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Nieuwkoop",
    "slug": "escort-nieuwkoop",
    "minPrice": 250,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Nijmegen",
    "slug": "escort-nijmegen",
    "minPrice": 600,
    "minHours": 3,
    "source": "location-page-topline"
  },
  {
    "city": "Noord Holland",
    "slug": "escort-noord-holland",
    "minPrice": 160,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Noordwijk",
    "slug": "escort-noordwijk",
    "minPrice": 200,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Noordwijkerhout",
    "slug": "escort-noordwijkerhout",
    "minPrice": 200,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Obdam",
    "slug": "escort-obdam",
    "minPrice": 180,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Oegstgeest",
    "slug": "escort-oegstgeest",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Oldenzaal",
    "slug": "escort-oldenzaal",
    "minPrice": 1200,
    "minHours": 6,
    "source": "prijzen-table"
  },
  {
    "city": "Oosthuizen",
    "slug": "escort-oosthuizen",
    "minPrice": 180,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Oostzaan",
    "slug": "escort-oostzaan",
    "minPrice": 160,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Opmeer",
    "slug": "escort-opmeer",
    "minPrice": 220,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Osdorp",
    "slug": "escort-osdorp",
    "minPrice": 160,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Oss",
    "slug": "escort-oss",
    "minPrice": 540,
    "minHours": 3,
    "source": "prijzen-table"
  },
  {
    "city": "Oud-Beijerland",
    "slug": "escort-oud-beijerland",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Ouderkerk aan de Amstel",
    "slug": "escort-ouderkerk-aan-de-amstel",
    "minPrice": 160,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Oudewater",
    "slug": "escort-oudewater",
    "minPrice": 200,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Overijssel",
    "slug": "escort-overijssel",
    "minPrice": 600,
    "minHours": 3,
    "source": "location-page-topline"
  },
  {
    "city": "Papendrecht",
    "slug": "escort-papendrecht",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Petten",
    "slug": "escort-petten",
    "minPrice": 250,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Pijnacker",
    "slug": "escort-pijnacker",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Poeldijk",
    "slug": "escort-poeldijk",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Poortugaal",
    "slug": "escort-poortugaal",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Purmerend",
    "slug": "escort-purmerend",
    "minPrice": 180,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Raalte",
    "slug": "escort-raalte",
    "minPrice": 1000,
    "minHours": 5,
    "source": "prijzen-table"
  },
  {
    "city": "Rhenen",
    "slug": "escort-rhenen",
    "minPrice": 200,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Rhoon",
    "slug": "escort-rhoon",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Ridderkerk",
    "slug": "escort-ridderkerk",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Rijssen",
    "slug": "escort-rijssen",
    "minPrice": 800,
    "minHours": 4,
    "source": "prijzen-table"
  },
  {
    "city": "Rijswijk",
    "slug": "escort-rijswijk",
    "minPrice": 200,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Roelofarendsveen",
    "slug": "escort-roelofarendsveen",
    "minPrice": 250,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Roosendaal",
    "slug": "escort-roosendaal",
    "minPrice": 540,
    "minHours": 3,
    "source": "prijzen-table"
  },
  {
    "city": "Rotterdam",
    "slug": "escort-rotterdam",
    "minPrice": 350,
    "minHours": 2,
    "source": "prijzen-table"
  },
  {
    "city": "s-Gravenzande",
    "slug": "escort-s-gravenzande",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "s-Hertogenbosch",
    "slug": "escort-s-hertogenbosch",
    "minPrice": 540,
    "minHours": 3,
    "source": "prijzen-table"
  },
  {
    "city": "Schagen",
    "slug": "escort-schagen",
    "minPrice": 250,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Scheveningen",
    "slug": "escort-scheveningen",
    "minPrice": 200,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Schiedam",
    "slug": "escort-schiedam",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Schipluiden",
    "slug": "escort-schipluiden",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Schoonhoven",
    "slug": "escort-schoonhoven",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Schoorl",
    "slug": "escort-schoorl",
    "minPrice": 200,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Zuid Holland",
    "slug": "escort-service-zuid-holland",
    "minPrice": 200,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Simonshaven",
    "slug": "escort-simonshaven",
    "minPrice": 200,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Sliedrecht",
    "slug": "escort-sliedrecht",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Sloterdijk",
    "slug": "escort-sloterdijk",
    "minPrice": 160,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Soest",
    "slug": "escort-soest",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Spaarndam",
    "slug": "escort-spaarndam",
    "minPrice": 160,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Spakenburg",
    "slug": "escort-spakenburg",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Spanbroek",
    "slug": "escort-spanbroek",
    "minPrice": 220,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Spijkenisse",
    "slug": "escort-spijkenisse",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Swifterbant",
    "slug": "escort-swifterbant",
    "minPrice": 350,
    "minHours": 2,
    "source": "prijzen-table"
  },
  {
    "city": "t Gooi",
    "slug": "escort-t-gooi",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Tiel",
    "slug": "escort-tiel",
    "minPrice": 360,
    "minHours": 2,
    "source": "prijzen-table"
  },
  {
    "city": "Tilburg",
    "slug": "escort-tilburg",
    "minPrice": 540,
    "minHours": 3,
    "source": "location-page-topline"
  },
  {
    "city": "Tollebeek",
    "slug": "escort-tollebeek",
    "minPrice": 360,
    "minHours": 2,
    "source": "prijzen-table"
  },
  {
    "city": "Tuitjenhorn",
    "slug": "escort-tuitjenhorn",
    "minPrice": 220,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Uitgeest",
    "slug": "escort-uitgeest",
    "minPrice": 180,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Uithoorn",
    "slug": "escort-uithoorn",
    "minPrice": 160,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Urk",
    "slug": "escort-urk",
    "minPrice": 350,
    "minHours": 2,
    "source": "prijzen-table"
  },
  {
    "city": "Ursem",
    "slug": "escort-ursem",
    "minPrice": 180,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Utrecht",
    "slug": "escort-utrecht",
    "minPrice": 200,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Veenendaal",
    "slug": "escort-veenendaal",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Veghel",
    "slug": "escort-veghel",
    "minPrice": 540,
    "minHours": 3,
    "source": "prijzen-table"
  },
  {
    "city": "Velsen",
    "slug": "escort-velsen",
    "minPrice": 180,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Venhuizen",
    "slug": "escort-venhuizen",
    "minPrice": 220,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Venlo",
    "slug": "escort-venlo",
    "minPrice": 600,
    "minHours": 3,
    "source": "location-page-topline"
  },
  {
    "city": "Vianen",
    "slug": "escort-vianen",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Vinkeveen",
    "slug": "escort-vinkeveen",
    "minPrice": 200,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Vlaardingen",
    "slug": "escort-vlaardingen",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Vogelenzang",
    "slug": "escort-vogelenzang",
    "minPrice": 180,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Volendam",
    "slug": "escort-volendam",
    "minPrice": 180,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Voorburg",
    "slug": "escort-voorburg",
    "minPrice": 200,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Voorschoten",
    "slug": "escort-voorschoten",
    "minPrice": 200,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Waalwijk",
    "slug": "escort-waalwijk",
    "minPrice": 540,
    "minHours": 3,
    "source": "prijzen-table"
  },
  {
    "city": "Wassenaar",
    "slug": "escort-wassenaar",
    "minPrice": 200,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Wateringen",
    "slug": "escort-wateringen",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Weesp",
    "slug": "escort-weesp",
    "minPrice": 160,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Wieringerwerf",
    "slug": "escort-wieringerwerf",
    "minPrice": 250,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Wijchen",
    "slug": "escort-wijchen",
    "minPrice": 720,
    "minHours": 4,
    "source": "prijzen-table"
  },
  {
    "city": "Winkel",
    "slug": "escort-winkel",
    "minPrice": 250,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Woerden",
    "slug": "escort-woerden",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Wormer",
    "slug": "escort-wormer",
    "minPrice": 160,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Wormerveer",
    "slug": "escort-wormerveer",
    "minPrice": 160,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Woudenberg",
    "slug": "escort-woudenberg",
    "minPrice": 200,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Zaandam",
    "slug": "escort-zaandam",
    "minPrice": 160,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Zaandijk",
    "slug": "escort-zaandijk",
    "minPrice": 160,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Zaanstad",
    "slug": "escort-zaanstad",
    "minPrice": 160,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Zandvoort",
    "slug": "escort-zandvoort",
    "minPrice": 200,
    "minHours": 1,
    "source": "prijzen-table"
  },
  {
    "city": "Zeeland",
    "slug": "escort-zeeland",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Zeewolde",
    "slug": "escort-zeewolde",
    "minPrice": 350,
    "minHours": 2,
    "source": "prijzen-table"
  },
  {
    "city": "Zeist",
    "slug": "escort-zeist",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Zoetermeer",
    "slug": "escort-zoetermeer",
    "minPrice": 350,
    "minHours": 2,
    "source": "location-page-topline"
  },
  {
    "city": "Zuiderwoude",
    "slug": "escort-zuiderwoude",
    "minPrice": 180,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Zutphen",
    "slug": "escort-zutphen",
    "minPrice": 600,
    "minHours": 3,
    "source": "prijzen-table"
  },
  {
    "city": "Zwaag",
    "slug": "escort-zwaag",
    "minPrice": 180,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Zwanenburg",
    "slug": "escort-zwanenburg",
    "minPrice": 160,
    "minHours": 1,
    "source": "location-page-topline"
  },
  {
    "city": "Zwolle",
    "slug": "escort-zwolle",
    "minPrice": 600,
    "minHours": 3,
    "source": "location-page-topline"
  }
];

const locationEstimateMap = new Map(locationPricingEstimates.map((item) => [item.slug, item]));

export function getLocationPricingEstimateBySlug(slug: string): LocationPricingEstimate | null {
  return locationEstimateMap.get(slug) ?? null;
}

export function formatEuro(amount: number): string {
  return `€${new Intl.NumberFormat("nl-NL").format(amount)}`;
}

export function formatHours(hours: number): string {
  return `${hours} uur`;
}
