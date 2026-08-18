export interface Review {
  id: string;
  propertyId: string;
  guestName: string;
  rating: number;
  comment: string;
  date: string;
  published: boolean;
  response?: string;
  isDemo: true;
}

export const reviews: Review[] = [
  {
    id: "rev-1",
    propertyId: "prop-1",
    guestName: "Aditi R.",
    rating: 5,
    comment:
      "The Boho Nook exceeded our expectations. Beautifully designed, spotlessly clean, and the balcony views at sunrise were magical.",
    date: "2026-07-28",
    published: true,
    response: "Thank you, Aditi! We're so glad you enjoyed the lake views.",
    isDemo: true,
  },
  {
    id: "rev-2",
    propertyId: "prop-1",
    guestName: "James W.",
    rating: 5,
    comment:
      "Perfect base for exploring Udaipur. The host was incredibly responsive and the space felt like a home away from home.",
    date: "2026-06-15",
    published: true,
    isDemo: true,
  },
  {
    id: "rev-3",
    propertyId: "prop-2",
    guestName: "Sneha K.",
    rating: 5,
    comment:
      "The Italian Arch is stunning. The courtyard is peaceful and the heritage details are breathtaking.",
    date: "2026-07-10",
    published: true,
    isDemo: true,
  },
  {
    id: "rev-4",
    propertyId: "prop-3",
    guestName: "Michael T.",
    rating: 4,
    comment:
      "Spacious villa perfect for our family reunion. Kitchen was well-equipped. Would love to return.",
    date: "2026-05-22",
    published: false,
    isDemo: true,
  },
];

export function getReviewsByPropertyId(propertyId: string): Review[] {
  return reviews.filter((r) => r.propertyId === propertyId && r.published);
}
