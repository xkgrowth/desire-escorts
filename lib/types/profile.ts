/**
 * Profile types for Strapi API responses and normalized app model.
 */

// Strapi media format
export type StrapiImageFormat = {
  url: string;
  width: number;
  height: number;
  size?: number;
};

export type StrapiImage = {
  id?: number;
  url: string;
  alternativeText?: string | null;
  width?: number;
  height?: number;
  formats?: {
    thumbnail?: StrapiImageFormat;
    small?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    large?: StrapiImageFormat;
  };
};

// Strapi relation shapes
export type StrapiService = {
  id?: number;
  name: string;
  slug: string;
};

export type StrapiLanguage = {
  id?: number;
  name: string;
  code?: string;
};

export type StrapiTag = {
  label: string;
  slug?: string;
};

export type StrapiAttribute = {
  key: string;
  value?: string;
};

export type StrapiAvailability = {
  dayOfWeek: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
  startTime?: string;
  endTime?: string;
};

export type StrapiContact = {
  phone?: string;
  whatsapp?: string;
  telegram?: string;
};

export type StrapiSeo = {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: StrapiImage;
};

// Enumeration values from Strapi schema
export type CupSize = "A cup" | "B cup" | "C cup" | "D cup" | "DD cup" | "E cup" | "F cup";
export type Postuur = "Slank" | "Normaal" | "Vol";
export type Geaardheid = "Heteroseksueel" | "Biseksueel";
export type HaarKleur = "Blond" | "Bruin" | "Donkerblond" | "Zwart";
export type OogKleur = "Blauw" | "Bruin" | "Grijs" | "Groen";

// Raw Strapi profile attributes (inside data[].attributes)
export type StrapiProfileAttributes = {
  documentId?: string;
  name: string;
  slug: string;
  shortBio?: string;
  bio?: string;
  age?: number;
  height?: number;
  cupSize?: CupSize;
  postuur?: Postuur;
  geaardheid?: Geaardheid;
  haarKleur?: HaarKleur;
  oogKleur?: OogKleur;
  verified?: boolean;
  featured?: boolean;
  isAvailable?: boolean;
  isHidden?: boolean | null;
  sortOrder?: number;
  photos?: StrapiImage[];
  services?: StrapiService[] | { data: StrapiService[] };
  languages?: StrapiLanguage[] | { data: StrapiLanguage[] };
  tags?: StrapiTag[];
  attributesList?: StrapiAttribute[];
  availability?: StrapiAvailability[];
  contact?: StrapiContact | null;
  seo?: StrapiSeo | null;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
};

// Strapi v4 response entity shape
export type StrapiProfileEntity = {
  id: number;
  attributes: StrapiProfileAttributes;
};

// Strapi API response for profile list
export type StrapiProfilesResponse = {
  data: StrapiProfileEntity[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

// Normalized profile for app consumption
export type Profile = {
  id: number;
  documentId?: string;
  name: string;
  slug: string;
  shortBio?: string;
  bio?: string;
  age?: number;
  height?: number;
  cupSize?: CupSize;
  postuur?: Postuur;
  geaardheid?: Geaardheid;
  haarKleur?: HaarKleur;
  oogKleur?: OogKleur;
  verified: boolean;
  featured: boolean;
  isAvailable: boolean;
  isHidden: boolean;
  sortOrder: number;
  photos: StrapiImage[];
  services: string[]; // normalized to slug array
  languages: string[]; // normalized to name/code array
  tags: string[]; // normalized to label array
  attributes: Record<string, string>; // normalized key-value map
  availability: StrapiAvailability[];
  contact?: StrapiContact;
  seo?: StrapiSeo;
};

// Profile card display model (subset for listings)
export type ProfileCard = Pick<
  Profile,
  | "id"
  | "name"
  | "slug"
  | "shortBio"
  | "age"
  | "height"
  | "cupSize"
  | "isAvailable"
  | "verified"
  | "services"
  | "photos"
>;
