import type { Amenity, Property, PropertyType } from "@/server/dto/domain.dto";

export type PublicPropertyDto = Property;

export type AdminPropertyDto = PublicPropertyDto & {
  arrivalInstructions?: string;
  accessInstructions?: string;
  parkingInstructions?: string;
  contactPhone?: string;
};

export type PublicReviewDto = {
  id: string;
  propertyId: string;
  guestName: string;
  rating: number;
  comment: string;
  date: string;
  response?: string;
};

export type PropertyTypeLabel = PropertyType;
export type AmenityName = Amenity;

export type PricingLineItem = {
  code: "NIGHTLY" | "WEEKEND" | "CLEANING" | "SERVICE" | "TAX";
  label: string;
  amountPaise: number;
};

export type PricingSnapshot = {
  currency: "INR";
  nights: number;
  checkIn: string;
  checkOut: string;
  guests: number;
  lineItems: PricingLineItem[];
  accommodationPaise: number;
  cleaningFeePaise: number;
  serviceFeePaise: number;
  taxPaise: number;
  totalPaise: number;
  quotedAt: string;
};

export type QuoteDto = {
  nights: number;
  accommodationRupees: number;
  cleaningFeeRupees: number;
  serviceFeeRupees: number;
  taxRupees: number;
  totalRupees: number;
  averageNightlyRupees: number;
  snapshot: PricingSnapshot;
};

export type UiBookingStatus =
  | "inquiry"
  | "reserved"
  | "payment_pending"
  | "confirmed"
  | "checked_in"
  | "checked_out"
  | "cancelled"
  | "expired";

export type UiPaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded"
  | "partially_refunded";

export type GuestBookingDto = {
  id: string;
  propertyId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  amount: number;
  paymentMethod: "razorpay" | "direct";
  paymentStatus: UiPaymentStatus;
  bookingStatus: UiBookingStatus;
  specialRequests?: string;
  createdAt: string;
  reservationExpiresAt?: string;
  conversationId?: string;
  canReview?: boolean;
  hasReview?: boolean;
  accessInstructions?: string;
  arrivalInstructions?: string;
  parkingInstructions?: string;
  property: PublicPropertyDto;
  quote: QuoteDto;
};
