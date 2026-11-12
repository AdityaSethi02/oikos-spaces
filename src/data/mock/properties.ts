import { listingImageSets } from "@/lib/media";

export type ListingStatus = "For Sale" | "For Rent" | "For Lease";

export type PropertyType =
  | "Apartment"
  | "Villa"
  | "Plot"
  | "Commercial"
  | "Heritage Home";

export type Amenity =
  | "Parking"
  | "Lift"
  | "Power backup"
  | "Gated community"
  | "Security"
  | "Garden"
  | "Balcony"
  | "Air conditioning"
  | "Modular kitchen"
  | "Servant room"
  | "Clubhouse"
  | "Swimming pool"
  | "Wi-Fi"
  | "Furnished";

export interface Property {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  location: string;
  locality: string;
  address: string;
  type: PropertyType;
  status: ListingStatus;
  description: string;
  about: string;
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  price: number;
  priceLabel: string;
  amenities: Amenity[];
  highlights: string[];
  featured: boolean;
  isDemo: true;
  /** Cover / card thumbnail */
  coverImage: string;
  /** Full gallery (includes cover as first item) */
  images: string[];
  galleryCount: number;
}

function withImages(urls: readonly string[]) {
  const images = [...urls];
  return {
    coverImage: images[0],
    images,
    galleryCount: images.length,
  };
}

export const properties: Property[] = [
  {
    id: "prop-1",
    slug: "lakeview-residency-fatehsagar",
    name: "Lakeview Residency",
    tagline: "3 BHK with Fateh Sagar views",
    location: "Fateh Sagar, Udaipur",
    locality: "Fateh Sagar",
    address: "Lake Shore Road, Fateh Sagar, Udaipur, Rajasthan 313001",
    type: "Apartment",
    status: "For Sale",
    description:
      "Spacious 3 BHK apartment overlooking Fateh Sagar — ideal for families seeking lake proximity and modern finishes.",
    about:
      "Lakeview Residency sits on a quiet lane off the Fateh Sagar belt. Wide balconies, a modular kitchen, and covered parking make it a strong end-user home with solid rental demand from professionals and tourists. Title is clear; RERA-ready documentation available on request (demo listing).",
    bedrooms: 3,
    bathrooms: 3,
    areaSqFt: 1850,
    price: 1_45_00_000,
    priceLabel: "₹1.45 Cr",
    amenities: [
      "Parking",
      "Lift",
      "Power backup",
      "Security",
      "Balcony",
      "Air conditioning",
      "Modular kitchen",
      "Wi-Fi",
    ],
    highlights: ["Lake view", "Covered parking", "Ready to move"],
    featured: true,
    isDemo: true,
    ...withImages(listingImageSets.lakeApartment),
  },
  {
    id: "prop-2",
    slug: "haveli-courtyard-old-city",
    name: "Haveli Courtyard",
    tagline: "Restored heritage home near the ghats",
    location: "Old City, Udaipur",
    locality: "Old City",
    address: "Gangaur Ghat Road, Old City, Udaipur, Rajasthan 313001",
    type: "Heritage Home",
    status: "For Sale",
    description:
      "A restored haveli with private courtyard — suited to boutique hospitality conversion or a character-filled family home.",
    about:
      "Haveli Courtyard blends original stone arches with careful restoration. Minutes from the ghats, it attracts buyers looking for heritage character with modern bathrooms and a private courtyard. Ideal for end-use or a small boutique stay project (demo listing).",
    bedrooms: 4,
    bathrooms: 4,
    areaSqFt: 3200,
    price: 2_85_00_000,
    priceLabel: "₹2.85 Cr",
    amenities: [
      "Parking",
      "Garden",
      "Security",
      "Air conditioning",
      "Furnished",
      "Wi-Fi",
    ],
    highlights: ["Private courtyard", "Heritage architecture", "Ghat proximity"],
    featured: true,
    isDemo: true,
    ...withImages(listingImageSets.heritage),
  },
  {
    id: "prop-3",
    slug: "badi-lake-villa",
    name: "Badi Lake Villa",
    tagline: "Independent villa with garden lawns",
    location: "Badi Lake, Udaipur",
    locality: "Badi Lake",
    address: "Badi Lake Road, Udaipur, Rajasthan 313011",
    type: "Villa",
    status: "For Sale",
    description:
      "Independent 4 BHK villa with lawns and parking — quiet lakeside living outside the old-city crush.",
    about:
      "Set along the Badi Lake corridor, this villa offers generous indoor-outdoor living, a modular kitchen, and space for extended family. Strong pick for buyers who want privacy without leaving Udaipur’s leisure belt (demo listing).",
    bedrooms: 4,
    bathrooms: 4,
    areaSqFt: 4200,
    price: 3_75_00_000,
    priceLabel: "₹3.75 Cr",
    amenities: [
      "Parking",
      "Garden",
      "Power backup",
      "Security",
      "Air conditioning",
      "Modular kitchen",
      "Servant room",
      "Swimming pool",
    ],
    highlights: ["Independent villa", "Garden lawns", "Family friendly"],
    featured: true,
    isDemo: true,
    ...withImages(listingImageSets.villa),
  },
  {
    id: "prop-4",
    slug: "sukhadia-circle-apartment",
    name: "Sukhadia Circle Heights",
    tagline: "2 BHK ready-to-move near the CBD",
    location: "Sukhadia Circle, Udaipur",
    locality: "Sukhadia Circle",
    address: "Near Sukhadia Circle, Udaipur, Rajasthan 313001",
    type: "Apartment",
    status: "For Sale",
    description:
      "Well-connected 2 BHK for professionals and small families who want city access and lower entry pricing.",
    about:
      "Sukhadia Circle Heights is a practical city apartment with lift, parking, and walkable access to markets and offices. Clean title and ready possession (demo listing).",
    bedrooms: 2,
    bathrooms: 2,
    areaSqFt: 1120,
    price: 72_00_000,
    priceLabel: "₹72 Lac",
    amenities: [
      "Parking",
      "Lift",
      "Power backup",
      "Security",
      "Balcony",
      "Modular kitchen",
    ],
    highlights: ["Ready to move", "CBD access", "Lift"],
    featured: true,
    isDemo: true,
    ...withImages(listingImageSets.cityApartment),
  },
  {
    id: "prop-5",
    slug: "hiran-magri-sector-plot",
    name: "Hiran Magri Sector Plot",
    tagline: "Residential plot in a planned sector",
    location: "Hiran Magri, Udaipur",
    locality: "Hiran Magri",
    address: "Sector 11, Hiran Magri, Udaipur, Rajasthan 313002",
    type: "Plot",
    status: "For Sale",
    description:
      "Corner residential plot with approach road access — build your home on a clear-title parcel.",
    about:
      "Located in a developed Hiran Magri sector with utilities nearby. Suitable for a duplex or villa build. Survey and title docs available for diligence (demo listing).",
    bedrooms: 0,
    bathrooms: 0,
    areaSqFt: 2400,
    price: 95_00_000,
    priceLabel: "₹95 Lac",
    amenities: ["Parking", "Gated community", "Security"],
    highlights: ["Corner plot", "Clear title", "Planned sector"],
    featured: false,
    isDemo: true,
    ...withImages(listingImageSets.plot),
  },
  {
    id: "prop-6",
    slug: "udaipur-airport-road-showroom",
    name: "Airport Road Showroom",
    tagline: "Ground-floor commercial on a high-visibility stretch",
    location: "Airport Road, Udaipur",
    locality: "Airport Road",
    address: "NH-27 Airport Road, Udaipur, Rajasthan 313001",
    type: "Commercial",
    status: "For Sale",
    description:
      "Front-facing showroom suitable for retail, auto, or brand outlets with strong arterial traffic.",
    about:
      "Airport Road inventory with shop-front visibility and parking apron. Ideal for investors seeking commercial yield or owner-occupiers expanding retail (demo listing).",
    bedrooms: 0,
    bathrooms: 2,
    areaSqFt: 1800,
    price: 1_80_00_000,
    priceLabel: "₹1.80 Cr",
    amenities: ["Parking", "Power backup", "Security"],
    highlights: ["High visibility", "Ground floor", "Parking apron"],
    featured: false,
    isDemo: true,
    ...withImages(listingImageSets.commercial),
  },
  {
    id: "prop-7",
    slug: "saheli-nagar-rental-3bhk",
    name: "Saheli Nagar 3 BHK",
    tagline: "Furnished rental near schools and markets",
    location: "Saheli Nagar, Udaipur",
    locality: "Saheli Nagar",
    address: "Saheli Nagar, Udaipur, Rajasthan 313001",
    type: "Apartment",
    status: "For Rent",
    description:
      "Bright furnished 3 BHK available for long-term lease — family-friendly neighbourhood.",
    about:
      "Semi-furnished to furnished setup with modular kitchen and reserved parking. Prefer family tenants on 11-month agreement (demo listing).",
    bedrooms: 3,
    bathrooms: 2,
    areaSqFt: 1450,
    price: 28_000,
    priceLabel: "₹28,000/mo",
    amenities: [
      "Parking",
      "Lift",
      "Security",
      "Balcony",
      "Air conditioning",
      "Modular kitchen",
      "Furnished",
      "Wi-Fi",
    ],
    highlights: ["Furnished", "Family preferred", "Reserved parking"],
    featured: true,
    isDemo: true,
    ...withImages(listingImageSets.rental),
  },
  {
    id: "prop-8",
    slug: "tech-park-office-lease",
    name: "Tech Park Office Suite",
    tagline: "Furnished office floor for lease",
    location: "Madri Industrial Area, Udaipur",
    locality: "Madri",
    address: "Near RIICO Madri, Udaipur, Rajasthan 313003",
    type: "Commercial",
    status: "For Lease",
    description:
      "Ready office suite with cabins and open work area — suitable for SMEs and back-office teams.",
    about:
      "Plug-and-play office with power backup and parking. Flexible lease terms for growing teams (demo listing).",
    bedrooms: 0,
    bathrooms: 2,
    areaSqFt: 2200,
    price: 65_000,
    priceLabel: "₹65,000/mo",
    amenities: ["Parking", "Lift", "Power backup", "Security", "Air conditioning", "Wi-Fi", "Furnished"],
    highlights: ["Ready office", "Cabins + open bay", "Power backup"],
    featured: false,
    isDemo: true,
    ...withImages(listingImageSets.office),
  },
  {
    id: "prop-9",
    slug: "pichola-view-apartment",
    name: "Pichola View Apartment",
    tagline: "Premium 3 BHK near Lake Pichola",
    location: "Lake Pichola, Udaipur",
    locality: "Lake Pichola",
    address: "Near Chandpole, Udaipur, Rajasthan 313001",
    type: "Apartment",
    status: "For Sale",
    description:
      "Premium apartment with partial lake glimpses — strong lifestyle and short-stay rental potential.",
    about:
      "A polished city home close to Pichola’s tourist and dining belt. Good for end-users and investors evaluating hospitality-adjacent yield (demo listing).",
    bedrooms: 3,
    bathrooms: 3,
    areaSqFt: 1680,
    price: 1_98_00_000,
    priceLabel: "₹1.98 Cr",
    amenities: [
      "Parking",
      "Lift",
      "Security",
      "Balcony",
      "Air conditioning",
      "Modular kitchen",
      "Clubhouse",
    ],
    highlights: ["Premium finish", "Lake belt", "Investment potential"],
    featured: true,
    isDemo: true,
    ...withImages(listingImageSets.lakePremium),
  },
  {
    id: "prop-10",
    slug: "goredi-gated-villa",
    name: "Goredi Gated Villa",
    tagline: "4 BHK in a gated community",
    location: "Goredi, Udaipur",
    locality: "Goredi",
    address: "Goredi Village Road, Udaipur, Rajasthan 313011",
    type: "Villa",
    status: "For Sale",
    description:
      "Gated-community villa with clubhouse access — space, security, and a quieter residential pocket.",
    about:
      "Part of a low-density gated layout with landscaped common areas. Suited to buyers relocating for lifestyle space outside denser city wards (demo listing).",
    bedrooms: 4,
    bathrooms: 4,
    areaSqFt: 3800,
    price: 2_45_00_000,
    priceLabel: "₹2.45 Cr",
    amenities: [
      "Parking",
      "Gated community",
      "Security",
      "Garden",
      "Clubhouse",
      "Swimming pool",
      "Power backup",
      "Modular kitchen",
    ],
    highlights: ["Gated community", "Clubhouse", "4 BHK villa"],
    featured: false,
    isDemo: true,
    ...withImages(listingImageSets.gatedVilla),
  },
];

export function getPropertyBySlug(slug: string): Property | undefined {
  return properties.find((p) => p.slug === slug);
}

export function getPropertyById(id: string): Property | undefined {
  return properties.find((p) => p.id === id);
}

export function getFeaturedProperties(): Property[] {
  return properties.filter((p) => p.featured);
}

export const localities = Array.from(
  new Set(properties.map((p) => p.locality)),
).sort();

export const allPropertyTypes: PropertyType[] = [
  "Apartment",
  "Villa",
  "Plot",
  "Commercial",
  "Heritage Home",
];

export const allListingStatuses: ListingStatus[] = [
  "For Sale",
  "For Rent",
  "For Lease",
];
