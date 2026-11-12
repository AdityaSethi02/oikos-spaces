import { brand } from "@/lib/brand";

export type MessageType = "text" | "image" | "document" | "system";

export type SenderRole = "buyer" | "dealer";

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: SenderRole;
  type: MessageType;
  content: string;
  fileName?: string;
  fileSize?: string;
  timestamp: string;
}

export type ConversationTag =
  | "buying_enquiry"
  | "rental_enquiry"
  | "site_visit"
  | "documents"
  | "unread";

export interface Conversation {
  id: string;
  propertyId: string;
  propertyName: string;
  propertySlug: string;
  guestName: string;
  guestEmail: string;
  lastMessage: string;
  lastMessageAt: string;
  unread: boolean;
  tags: ConversationTag[];
  messages: ChatMessage[];
  isDemo: true;
}

export const conversations: Conversation[] = [
  {
    id: "conv-1",
    propertyId: "prop-2",
    propertyName: "Haveli Courtyard",
    propertySlug: "haveli-courtyard-old-city",
    guestName: "Rahul Mehta",
    guestEmail: "rahul@example.com",
    lastMessage: "Thanks — Saturday 11 AM works for me.",
    lastMessageAt: "2026-08-17T14:32:00",
    unread: true,
    tags: ["buying_enquiry", "documents", "unread"],
    isDemo: true,
    messages: [
      {
        id: "m1",
        senderId: "system",
        senderName: "System",
        senderRole: "dealer",
        type: "system",
        content: "Enquiry started for Haveli Courtyard · For Sale",
        timestamp: "2026-08-12T10:00:00",
      },
      {
        id: "m2",
        senderId: "buyer-rahul",
        senderName: "Rahul Mehta",
        senderRole: "buyer",
        type: "text",
        content:
          "Hi — I'm interested in Haveli Courtyard near the ghats. Is the title clear, and can we schedule a site visit this weekend?",
        timestamp: "2026-08-12T10:05:00",
      },
      {
        id: "m3",
        senderId: "dealer",
        senderName: brand.hostName,
        senderRole: "dealer",
        type: "text",
        content:
          "Hello Rahul! Yes, title papers are in order. Saturday 11 AM works for a walkthrough. I can also share a brief document pack beforehand.",
        timestamp: "2026-08-12T11:30:00",
      },
      {
        id: "m4",
        senderId: "dealer",
        senderName: brand.hostName,
        senderRole: "dealer",
        type: "document",
        content: "Title summary shared",
        fileName: "Haveli_Title_Summary.pdf",
        fileSize: "840 KB",
        timestamp: "2026-08-17T14:30:00",
      },
      {
        id: "m5",
        senderId: "system",
        senderName: "System",
        senderRole: "dealer",
        type: "system",
        content: "Dealer shared a document",
        timestamp: "2026-08-17T14:30:00",
      },
      {
        id: "m6",
        senderId: "buyer-rahul",
        senderName: "Rahul Mehta",
        senderRole: "buyer",
        type: "text",
        content: "Thanks — Saturday 11 AM works for me.",
        timestamp: "2026-08-17T14:32:00",
      },
    ],
  },
  {
    id: "conv-2",
    propertyId: "prop-1",
    propertyName: "Lakeview Residency",
    propertySlug: "lakeview-residency-fatehsagar",
    guestName: "Priya Sharma",
    guestEmail: "priya@example.com",
    lastMessage: "Perfect — we'll see you Saturday at 11.",
    lastMessageAt: "2026-08-14T09:15:00",
    unread: false,
    tags: ["buying_enquiry", "site_visit"],
    isDemo: true,
    messages: [
      {
        id: "m7",
        senderId: "system",
        senderName: "System",
        senderRole: "dealer",
        type: "system",
        content: "Enquiry started for Lakeview Residency · For Sale",
        timestamp: "2026-08-10T16:00:00",
      },
      {
        id: "m8",
        senderId: "buyer-priya",
        senderName: "Priya Sharma",
        senderRole: "buyer",
        type: "text",
        content:
          "Looking for a 3 BHK near Fateh Sagar within ₹1.5 Cr. Is Lakeview Residency still available?",
        timestamp: "2026-08-10T16:02:00",
      },
      {
        id: "m9",
        senderId: "dealer",
        senderName: brand.hostName,
        senderRole: "dealer",
        type: "text",
        content:
          "Yes, Priya — it's available and ready to move. Happy to arrange a site visit this weekend.",
        timestamp: "2026-08-10T16:20:00",
      },
      {
        id: "m10",
        senderId: "buyer-priya",
        senderName: "Priya Sharma",
        senderRole: "buyer",
        type: "text",
        content: "Perfect — we'll see you Saturday at 11.",
        timestamp: "2026-08-14T09:15:00",
      },
    ],
  },
  {
    id: "conv-3",
    propertyId: "prop-7",
    propertyName: "Saheli Nagar 3 BHK",
    propertySlug: "saheli-nagar-rental-3bhk",
    guestName: "Neha Kapoor",
    guestEmail: "neha@example.com",
    lastMessage: "Is the flat available from 1st next month for a family of 4?",
    lastMessageAt: "2026-08-18T08:00:00",
    unread: true,
    tags: ["rental_enquiry", "unread"],
    isDemo: true,
    messages: [
      {
        id: "m11",
        senderId: "system",
        senderName: "System",
        senderRole: "dealer",
        type: "system",
        content: "Enquiry started for Saheli Nagar 3 BHK · For Rent",
        timestamp: "2026-08-18T08:00:00",
      },
      {
        id: "m12",
        senderId: "buyer-neha",
        senderName: "Neha Kapoor",
        senderRole: "buyer",
        type: "text",
        content: "Is the flat available from 1st next month for a family of 4?",
        timestamp: "2026-08-18T08:00:00",
      },
    ],
  },
];

export function getConversationById(id: string): Conversation | undefined {
  return conversations.find((c) => c.id === id);
}

export function getConversationByPropertyId(propertyId: string): Conversation | undefined {
  return conversations.find((c) => c.propertyId === propertyId);
}

export function getConversationByPropertySlug(slug: string): Conversation | undefined {
  return conversations.find((c) => c.propertySlug === slug);
}

