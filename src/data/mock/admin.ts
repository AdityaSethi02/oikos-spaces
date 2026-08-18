export interface Experience {
  id: string;
  title: string;
  category: "Restaurant" | "Café" | "Sightseeing" | "Activity" | "Shopping";
  description: string;
  location: string;
  isDemo: true;
}

export const experiences: Experience[] = [
  {
    id: "exp-1",
    title: "Sunset at Lake Pichola",
    category: "Sightseeing",
    description: "Boat ride at golden hour with views of the City Palace and ghats.",
    location: "Lake Pichola",
    isDemo: true,
  },
  {
    id: "exp-2",
    title: "Ambrai Restaurant",
    category: "Restaurant",
    description: "Lakefront dining with Rajasthani and continental cuisine.",
    location: "Ambrai Ghat",
    isDemo: true,
  },
  {
    id: "exp-3",
    title: "Monsoon Café",
    category: "Café",
    description: "Specialty coffee and light bites in a charming old-city lane.",
    location: "Jagdish Chowk",
    isDemo: true,
  },
  {
    id: "exp-4",
    title: "City Palace Tour",
    category: "Sightseeing",
    description: "Explore the grandeur of Mewar royalty with a guided palace walk.",
    location: "City Palace",
    isDemo: true,
  },
  {
    id: "exp-5",
    title: "Pottery Workshop",
    category: "Activity",
    description: "Hands-on session with local artisans in Shilpgram.",
    location: "Shilpgram",
    isDemo: true,
  },
  {
    id: "exp-6",
    title: "Hathi Pol Bazaar",
    category: "Shopping",
    description: "Textiles, silver jewellery, and handicrafts in the old market.",
    location: "Old City",
    isDemo: true,
  },
];

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalBookings: number;
  upcomingBookingId?: string;
  isDemo: true;
}

export const guests: Guest[] = [
  {
    id: "guest-priya",
    name: "Priya Sharma",
    email: "priya@example.com",
    phone: "+91 98765 11111",
    totalBookings: 2,
    upcomingBookingId: "BK123456",
    isDemo: true,
  },
  {
    id: "guest-rahul",
    name: "Rahul Mehta",
    email: "rahul@example.com",
    phone: "+91 98765 22222",
    totalBookings: 1,
    upcomingBookingId: "BK123457",
    isDemo: true,
  },
  {
    id: "guest-ananya",
    name: "Ananya Patel",
    email: "ananya@example.com",
    phone: "+91 98765 33333",
    totalBookings: 3,
    isDemo: true,
  },
];

export function getGuestById(id: string): Guest | undefined {
  return guests.find((g) => g.id === id);
}

export interface Document {
  id: string;
  guestName: string;
  bookingId: string;
  documentType: "Government ID" | "Passport" | "Other";
  fileName: string;
  uploadedAt: string;
  status: "pending_review" | "verified" | "rejected";
  isDemo: true;
}

export const documents: Document[] = [
  {
    id: "doc-1",
    guestName: "Rahul Mehta",
    bookingId: "BK123457",
    documentType: "Government ID",
    fileName: "Aadhaar_Card.pdf",
    uploadedAt: "2026-08-17",
    status: "pending_review",
    isDemo: true,
  },
  {
    id: "doc-2",
    guestName: "Priya Sharma",
    bookingId: "BK123456",
    documentType: "Government ID",
    fileName: "Passport_Scan.jpg",
    uploadedAt: "2026-08-10",
    status: "verified",
    isDemo: true,
  },
];

export interface AdminPayment {
  id: string;
  bookingId: string;
  guestName: string;
  propertyName: string;
  amount: number;
  method: "razorpay" | "direct";
  status: "pending" | "paid" | "failed" | "refunded" | "partially_refunded";
  date: string;
  isDemo: true;
}

export const adminPayments: AdminPayment[] = [
  {
    id: "pay-1",
    bookingId: "BK123456",
    guestName: "Priya Sharma",
    propertyName: "The Boho Nook",
    amount: 16840,
    method: "razorpay",
    status: "paid",
    date: "2026-08-10",
    isDemo: true,
  },
  {
    id: "pay-2",
    bookingId: "BK123457",
    guestName: "Rahul Mehta",
    propertyName: "The Italian Arch",
    amount: 28450,
    method: "direct",
    status: "pending",
    date: "2026-08-12",
    isDemo: true,
  },
  {
    id: "pay-3",
    bookingId: "BK123458",
    guestName: "Ananya Patel",
    propertyName: "The Ivory Courtyard",
    amount: 72500,
    method: "razorpay",
    status: "paid",
    date: "2026-06-15",
    isDemo: true,
  },
  {
    id: "pay-4",
    bookingId: "BK123461",
    guestName: "Neha Kapoor",
    propertyName: "The Ivory Courtyard",
    amount: 44800,
    method: "razorpay",
    status: "failed",
    date: "2026-07-20",
    isDemo: true,
  },
];

export const adminStats = {
  todayCheckIns: 1,
  todayCheckOuts: 0,
  upcomingBookings: 4,
  occupancy: 67,
  totalRevenue: 485000,
  pendingInquiries: 2,
  pendingIdRequests: 1,
  pendingDirectPayments: 1,
  isDemo: true as const,
};

export const calendarEvents = [
  {
    id: "cal-1",
    propertyId: "prop-1",
    title: "Priya Sharma",
    type: "confirmed" as const,
    start: "2026-09-15",
    end: "2026-09-18",
  },
  {
    id: "cal-2",
    propertyId: "prop-2",
    title: "Rahul Mehta",
    type: "pending" as const,
    start: "2026-10-02",
    end: "2026-10-05",
  },
  {
    id: "cal-3",
    propertyId: "prop-3",
    title: "Maintenance",
    type: "blocked" as const,
    start: "2026-09-01",
    end: "2026-09-03",
    reason: "Maintenance",
  },
  {
    id: "cal-4",
    propertyId: "prop-2",
    title: "Priya Sharma check-in",
    type: "checkin" as const,
    start: "2026-08-16",
    end: "2026-08-16",
  },
  {
    id: "cal-5",
    propertyId: "prop-1",
    title: "Priya Sharma check-out",
    type: "checkout" as const,
    start: "2026-09-18",
    end: "2026-09-18",
  },
];
