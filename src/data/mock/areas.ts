import { unsplash } from "@/lib/media";
import { properties } from "@/data/mock/properties";

export interface Area {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  highlights: string[];
  image: string;
}

export const areas: Area[] = [
  {
    slug: "fateh-sagar",
    name: "Fateh Sagar",
    tagline: "Lake-belt living with strong end-user demand",
    description:
      "Quiet lanes off the Fateh Sagar promenade — apartments and homes that suit families who want water views, evening walks, and reliable rental interest from professionals.",
    highlights: ["Lake proximity", "Evening promenade", "Strong rental demand"],
    image: unsplash("photo-1477587458883-47145ed94245", 1200, 800),
  },
  {
    slug: "old-city",
    name: "Old City",
    tagline: "Heritage character with investment upside",
    description:
      "Havelis, restored homes, and boutique stock around the old city fabric. Ideal for buyers who want character — with careful title and structural checks.",
    highlights: ["Heritage homes", "Walkable lanes", "Boutique inventory"],
    image: unsplash("photo-1600585154340-be6161a56a0c", 1200, 800),
  },
  {
    slug: "badi-lake",
    name: "Badi Lake",
    tagline: "Villas and quiet weekends outside the rush",
    description:
      "Larger plots and villas with breathing room. Popular with relocating families and sellers who want privacy without losing Udaipur access.",
    highlights: ["Villa plots", "Quiet roads", "Weekend lifestyle"],
    image: unsplash("photo-1613490493576-7fde63acd811", 1200, 800),
  },
  {
    slug: "sukhadia-circle",
    name: "Sukhadia Circle",
    tagline: "Central convenience for daily city life",
    description:
      "A practical mid-city pocket — schools, markets, and apartments that work for first-time buyers and long-stay tenants.",
    highlights: ["Central access", "Daily conveniences", "First-time buyers"],
    image: unsplash("photo-1545324418-cc1a3fa10c00", 1200, 800),
  },
  {
    slug: "hiran-magri",
    name: "Hiran Magri",
    tagline: "Established residential corridors",
    description:
      "Planned sectors with apartments and plots that balance price and connectivity. Good for buyers comparing value versus the lake belt.",
    highlights: ["Planned sectors", "Value pricing", "Family housing"],
    image: unsplash("photo-1512917774080-9991f1c4c750", 1200, 800),
  },
  {
    slug: "airport-road",
    name: "Airport Road",
    tagline: "Commercial frontage and showroom demand",
    description:
      "High-visibility commercial stretches for showrooms, offices, and investment assets tied to traffic and visibility.",
    highlights: ["Showroom frontage", "Office demand", "High visibility"],
    image: unsplash("photo-1486406146926-c627a92ad1ab", 1200, 800),
  },
  {
    slug: "saheli-nagar",
    name: "Saheli Nagar",
    tagline: "Furnished rentals and professional tenants",
    description:
      "A rental-friendly pocket where owners find reliable tenants and renters find ready-to-move apartments.",
    highlights: ["Furnished stock", "Tenant demand", "Quick lease cycles"],
    image: unsplash("photo-1560185007-cde436f6a4d0", 1200, 800),
  },
  {
    slug: "madri",
    name: "Madri",
    tagline: "Industrial edge with plot and workspace options",
    description:
      "Plots and practical commercial spaces near industrial activity — for buyers thinking operations, not just address prestige.",
    highlights: ["Industrial access", "Plot inventory", "Practical pricing"],
    image: unsplash("photo-1500382017468-9049fed747ef", 1200, 800),
  },
  {
    slug: "lake-pichola",
    name: "Lake Pichola",
    tagline: "Premium lake-facing addresses",
    description:
      "Scarcer, higher-ticket homes and apartments where views and tourism adjacency drive both lifestyle and long-term value.",
    highlights: ["Premium views", "Scarce inventory", "Lifestyle buyers"],
    image: unsplash("photo-1600047509358-9dc75507daeb", 1200, 800),
  },
  {
    slug: "goredi",
    name: "Goredi",
    tagline: "Gated communities on the city's edge",
    description:
      "Newer gated projects with clubhouse living — suited to buyers who want amenities and space outside denser lake-belt streets.",
    highlights: ["Gated projects", "Amenities", "Newer inventory"],
    image: unsplash("photo-1605276374104-dee2a0ed3cd6", 1200, 800),
  },
];

export function getAreaBySlug(slug: string): Area | undefined {
  return areas.find((a) => a.slug === slug);
}

export function getListingCountForArea(name: string): number {
  return properties.filter((p) => p.locality === name).length;
}

export function getPropertiesForArea(name: string) {
  return properties.filter((p) => p.locality === name);
}
