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

export interface PropertyMediaItem {
  id: string;
  kind: "PHOTO" | "VIDEO";
  url: string;
  alt?: string;
  sortOrder: number;
  isFeatured: boolean;
  playbackId?: string;
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
  isDemo: boolean;
  galleryCount: number;
  highlights: string[];
  media?: PropertyMediaItem[];
  status?: "ACTIVE" | "INACTIVE";
  latitude?: number;
  longitude?: number;
}

export type MessageType = "text" | "image" | "document" | "system";

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "guest" | "host";
  type: MessageType;
  content: string;
  fileName?: string;
  fileSize?: string;
  timestamp: string;
}

export type ConversationTag =
  | "booking_inquiry"
  | "upcoming_stay"
  | "id_requested"
  | "direct_payment"
  | "unread";

export interface Conversation {
  id: string;
  propertyId: string;
  propertyName: string;
  guestName: string;
  guestEmail: string;
  lastMessage: string;
  lastMessageAt: string;
  unread: boolean;
  tags: ConversationTag[];
  messages: ChatMessage[];
  bookingId?: string;
}
