export type PropertyType = "Apartment" | "Villa" | "Heritage Home";

export type Amenity =
  | "Wi-Fi"
  | "Kitchen"
  | "Parking"
  | "TV"
  | "Workspace"
  | "Balcony"
  | "Air conditioning"
  | "Hot water"
  | "Self check-in"
  | "Washing machine"
  | "Garden"
  | "Rooftop terrace";

export interface Bedroom {
  name: string;
  beds: string;
}

export interface Property {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  location: string;
  address: string;
  type: PropertyType;
  description: string;
  about: string;
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  pricePerNight: number;
  weekendPrice: number;
  cleaningFee: number;
  rating: number;
  reviewCount: number;
  amenities: Amenity[];
  bedroomDetails: Bedroom[];
  included: string[];
  houseRules: string[];
  cancellationPolicy: string;
  checkIn: string;
  checkOut: string;
  isDemo: true;
  galleryCount: number;
  highlights: string[];
}

export const properties: Property[] = [
  {
    id: "prop-1",
    slug: "the-boho-nook",
    name: "The Boho Nook",
    tagline: "Eclectic charm with lake-view balconies",
    location: "Udaipur, Rajasthan",
    address: "Ambamata, Udaipur, Rajasthan 313001",
    type: "Apartment",
    description:
      "A thoughtfully curated 2BHK with bohemian accents, natural light, and serene lake views.",
    about:
      "The Boho Nook is a warm, character-filled apartment designed for slow mornings and unhurried evenings. Handpicked textiles, local art, and a sun-drenched balcony make it ideal for couples or small families seeking an authentic Udaipur stay.",
    guests: 4,
    bedrooms: 2,
    beds: 3,
    bathrooms: 2,
    pricePerNight: 4500,
    weekendPrice: 5200,
    cleaningFee: 800,
    rating: 4.9,
    reviewCount: 47,
    amenities: [
      "Wi-Fi",
      "Kitchen",
      "Parking",
      "TV",
      "Workspace",
      "Balcony",
      "Air conditioning",
      "Hot water",
      "Self check-in",
      "Washing machine",
    ],
    bedroomDetails: [
      { name: "Master Bedroom", beds: "1 queen bed" },
      { name: "Guest Room", beds: "2 single beds" },
    ],
    included: [
      "Fresh linens and towels",
      "Complimentary tea and coffee",
      "Local guidebook",
      "High-speed Wi-Fi",
    ],
    houseRules: [
      "No smoking indoors",
      "Quiet hours after 10 PM",
      "No parties or events",
      "Pets not allowed",
    ],
    cancellationPolicy:
      "Free cancellation up to 7 days before check-in. 50% refund for cancellations within 7 days. Demo policy — subject to change.",
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    isDemo: true,
    galleryCount: 12,
    highlights: ["Lake view", "Self check-in", "Rooftop access"],
  },
  {
    id: "prop-2",
    slug: "the-italian-arch",
    name: "The Italian Arch",
    tagline: "Mediterranean elegance in the old city",
    location: "Udaipur, Rajasthan",
    address: "Gangaur Ghat, Udaipur, Rajasthan 313001",
    type: "Heritage Home",
    description:
      "A restored heritage space with arched doorways, terracotta tones, and courtyard calm.",
    about:
      "The Italian Arch blends Rajasthani architecture with Mediterranean warmth. Original stone arches, a private courtyard, and curated interiors create an intimate retreat steps from the ghats.",
    guests: 6,
    bedrooms: 3,
    beds: 4,
    bathrooms: 3,
    pricePerNight: 7800,
    weekendPrice: 8900,
    cleaningFee: 1200,
    rating: 4.95,
    reviewCount: 32,
    amenities: [
      "Wi-Fi",
      "Kitchen",
      "Parking",
      "TV",
      "Workspace",
      "Garden",
      "Air conditioning",
      "Hot water",
      "Self check-in",
    ],
    bedroomDetails: [
      { name: "Courtyard Suite", beds: "1 king bed" },
      { name: "Arch Room", beds: "1 queen bed" },
      { name: "Loft Bedroom", beds: "2 single beds" },
    ],
    included: [
      "Daily housekeeping",
      "Welcome basket with local treats",
      "Courtyard seating",
      "Airport pickup on request (demo)",
    ],
    houseRules: [
      "No smoking",
      "Shoes off in interior spaces",
      "Maximum 6 guests",
      "Respect quiet hours 9 PM – 8 AM",
    ],
    cancellationPolicy:
      "Free cancellation up to 14 days before check-in. Demo policy — subject to change.",
    checkIn: "3:00 PM",
    checkOut: "11:00 AM",
    isDemo: true,
    galleryCount: 18,
    highlights: ["Private courtyard", "Heritage architecture", "Ghat proximity"],
  },
  {
    id: "prop-3",
    slug: "the-ivory-courtyard",
    name: "The Ivory Courtyard",
    tagline: "Minimal luxury with a sunlit courtyard",
    location: "Udaipur, Rajasthan",
    address: "Badi Lake Road, Udaipur, Rajasthan 313011",
    type: "Villa",
    description:
      "A serene villa with ivory tones, a central courtyard, and space for families to unwind.",
    about:
      "The Ivory Courtyard is designed for guests who appreciate calm, space, and understated luxury. Floor-to-ceiling windows, a private courtyard pool (seasonal), and generous living areas make it perfect for extended stays.",
    guests: 8,
    bedrooms: 4,
    beds: 5,
    bathrooms: 4,
    pricePerNight: 12500,
    weekendPrice: 14000,
    cleaningFee: 1500,
    rating: 4.88,
    reviewCount: 28,
    amenities: [
      "Wi-Fi",
      "Kitchen",
      "Parking",
      "TV",
      "Workspace",
      "Garden",
      "Rooftop terrace",
      "Air conditioning",
      "Hot water",
      "Washing machine",
    ],
    bedroomDetails: [
      { name: "Primary Suite", beds: "1 king bed" },
      { name: "Courtyard Room", beds: "1 queen bed" },
      { name: "Twin Room", beds: "2 single beds" },
      { name: "Studio Room", beds: "1 sofa bed" },
    ],
    included: [
      "Private courtyard",
      "Fully equipped kitchen",
      "Board games and books",
      "Complimentary breakfast ingredients (demo)",
    ],
    houseRules: [
      "No events without prior approval",
      "Pool hours: 8 AM – 8 PM",
      "No smoking indoors",
      "Children welcome with supervision",
    ],
    cancellationPolicy:
      "Flexible cancellation up to 10 days before check-in. Demo policy — subject to change.",
    checkIn: "2:00 PM",
    checkOut: "10:00 AM",
    isDemo: true,
    galleryCount: 24,
    highlights: ["Private courtyard", "Family friendly", "Full kitchen"],
  },
];

export function getPropertyBySlug(slug: string): Property | undefined {
  return properties.find((p) => p.slug === slug);
}

export function getPropertyById(id: string): Property | undefined {
  return properties.find((p) => p.id === id);
}
