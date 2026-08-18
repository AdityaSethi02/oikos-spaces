import { properties } from "./properties";

export type BookingStatus =
  | "reserved"
  | "payment_pending"
  | "confirmed"
  | "checked_in"
  | "checked_out"
  | "cancelled"
  | "expired";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded" | "partially_refunded";
export type PaymentMethod = "razorpay" | "direct";

export interface Booking {
  id: string;
  propertyId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  specialRequests?: string;
  createdAt: string;
  isDemo: true;
}

export const bookings: Booking[] = [
  {
    id: "BK123456",
    propertyId: "prop-1",
    guestName: "Priya Sharma",
    guestEmail: "priya@example.com",
    guestPhone: "+91 98765 11111",
    checkIn: "2026-09-15",
    checkOut: "2026-09-18",
    guests: 2,
    amount: 16840,
    paymentMethod: "razorpay",
    paymentStatus: "paid",
    bookingStatus: "confirmed",
    createdAt: "2026-08-10",
    isDemo: true,
  },
  {
    id: "BK123457",
    propertyId: "prop-2",
    guestName: "Rahul Mehta",
    guestEmail: "rahul@example.com",
    guestPhone: "+91 98765 22222",
    checkIn: "2026-10-02",
    checkOut: "2026-10-05",
    guests: 4,
    amount: 28450,
    paymentMethod: "direct",
    paymentStatus: "pending",
    bookingStatus: "payment_pending",
    specialRequests: "Early check-in if possible",
    createdAt: "2026-08-12",
    isDemo: true,
  },
  {
    id: "BK123458",
    propertyId: "prop-3",
    guestName: "Ananya Patel",
    guestEmail: "ananya@example.com",
    guestPhone: "+91 98765 33333",
    checkIn: "2026-07-20",
    checkOut: "2026-07-25",
    guests: 6,
    amount: 72500,
    paymentMethod: "razorpay",
    paymentStatus: "paid",
    bookingStatus: "checked_out",
    createdAt: "2026-06-15",
    isDemo: true,
  },
  {
    id: "BK123459",
    propertyId: "prop-1",
    guestName: "Vikram Singh",
    guestEmail: "vikram@example.com",
    guestPhone: "+91 98765 44444",
    checkIn: "2026-06-01",
    checkOut: "2026-06-03",
    guests: 2,
    amount: 11200,
    paymentMethod: "razorpay",
    paymentStatus: "refunded",
    bookingStatus: "cancelled",
    createdAt: "2026-05-20",
    isDemo: true,
  },
  {
    id: "BK123460",
    propertyId: "prop-2",
    guestName: "Priya Sharma",
    guestEmail: "priya@example.com",
    guestPhone: "+91 98765 11111",
    checkIn: "2026-08-16",
    checkOut: "2026-08-20",
    guests: 2,
    amount: 31200,
    paymentMethod: "razorpay",
    paymentStatus: "paid",
    bookingStatus: "checked_in",
    createdAt: "2026-07-01",
    isDemo: true,
  },
  {
    id: "BK123461",
    propertyId: "prop-3",
    guestName: "Neha Kapoor",
    guestEmail: "neha@example.com",
    guestPhone: "+91 98765 55555",
    checkIn: "2026-08-01",
    checkOut: "2026-08-04",
    guests: 5,
    amount: 44800,
    paymentMethod: "razorpay",
    paymentStatus: "failed",
    bookingStatus: "expired",
    createdAt: "2026-07-20",
    isDemo: true,
  },
];

export function getBookingById(id: string): Booking | undefined {
  return bookings.find((b) => b.id === id);
}

export function getBookingsWithProperty() {
  return bookings.map((booking) => ({
    ...booking,
    property: properties.find((p) => p.id === booking.propertyId)!,
  }));
}

export function getUpcomingBookings() {
  return getBookingsWithProperty().filter(
    (b) =>
      b.bookingStatus === "confirmed" ||
      b.bookingStatus === "payment_pending" ||
      b.bookingStatus === "reserved" ||
      b.bookingStatus === "checked_in",
  );
}

export function getCompletedBookings() {
  return getBookingsWithProperty().filter(
    (b) => b.bookingStatus === "checked_out",
  );
}

export function getCancelledBookings() {
  return getBookingsWithProperty().filter(
    (b) => b.bookingStatus === "cancelled" || b.bookingStatus === "expired",
  );
}
