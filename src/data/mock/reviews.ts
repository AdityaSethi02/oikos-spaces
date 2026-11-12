export interface Review {
  id: string;
  propertyId?: string;
  guestName: string;
  role: string;
  rating: number;
  comment: string;
  date: string;
  published: boolean;
  response?: string;
  isDemo: true;
}

/** Client testimonials for the firm (buyers, sellers, tenants). */
export const reviews: Review[] = [
  {
    id: "rev-1",
    propertyId: "prop-1",
    guestName: "Aditi Sharma",
    role: "Homebuyer · Fateh Sagar",
    rating: 5,
    comment:
      "They shortlisted three lake-belt apartments that matched our budget and walked us through paperwork without pressure. Closing felt clear and calm.",
    date: "2026-07-28",
    published: true,
    isDemo: true,
  },
  {
    id: "rev-2",
    propertyId: "prop-2",
    guestName: "James Walker",
    role: "Investor · Old City",
    rating: 5,
    comment:
      "Transparent on title, realistic on yield, and quick on site visits. Exactly what you want from a local real-estate partner in Udaipur.",
    date: "2026-06-15",
    published: true,
    isDemo: true,
  },
  {
    id: "rev-3",
    propertyId: "prop-7",
    guestName: "Sneha Kapoor",
    role: "Tenant · Saheli Nagar",
    rating: 5,
    comment:
      "Found us a furnished 3 BHK within a week and coordinated with the owner smoothly. Professional from first call to key handover.",
    date: "2026-07-10",
    published: true,
    isDemo: true,
  },
  {
    id: "rev-4",
    propertyId: "prop-3",
    guestName: "Michael Thomas",
    role: "Seller · Badi Lake",
    rating: 4,
    comment:
      "Priced our villa fairly, brought serious buyers, and handled negotiations with care. Would recommend to friends relocating.",
    date: "2026-05-22",
    published: true,
    isDemo: true,
  },
  {
    id: "rev-5",
    guestName: "Ravi Mehta",
    role: "Commercial buyer · Airport Road",
    rating: 5,
    comment:
      "Helped us secure a front-facing showroom with clear docs and a workable payment schedule. Strong commercial sense.",
    date: "2026-08-02",
    published: true,
    isDemo: true,
  },
];

export function getReviewsByPropertyId(propertyId: string): Review[] {
  return reviews.filter((r) => r.propertyId === propertyId && r.published);
}

export function getPublishedTestimonials(): Review[] {
  return reviews.filter((r) => r.published);
}
