import { brand } from "@/lib/brand";

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

export interface Conversation {
  id: string;
  propertyId: string;
  propertyName: string;
  guestName: string;
  guestEmail: string;
  lastMessage: string;
  lastMessageAt: string;
  unread: boolean;
  tags: ("booking_inquiry" | "upcoming_stay" | "id_requested" | "direct_payment" | "unread")[];
  messages: ChatMessage[];
  isDemo: true;
}

export const conversations: Conversation[] = [
  {
    id: "conv-1",
    propertyId: "prop-2",
    propertyName: "The Italian Arch",
    guestName: "Rahul Mehta",
    guestEmail: "rahul@example.com",
    lastMessage: "I've uploaded my Aadhaar card as requested.",
    lastMessageAt: "2026-08-17T14:32:00",
    unread: true,
    tags: ["direct_payment", "id_requested", "upcoming_stay"],
    isDemo: true,
    messages: [
      {
        id: "m1",
        senderId: "system",
        senderName: "System",
        senderRole: "host",
        type: "system",
        content: "Booking inquiry created for Oct 2 – Oct 5, 2026",
        timestamp: "2026-08-12T10:00:00",
      },
      {
        id: "m2",
        senderId: "guest-rahul",
        senderName: "Rahul Mehta",
        senderRole: "guest",
        type: "text",
        content:
          "Hi! I'd like to book The Italian Arch for the first week of October. Can we arrange payment directly via UPI?",
        timestamp: "2026-08-12T10:05:00",
      },
      {
        id: "m3",
        senderId: "system",
        senderName: "System",
        senderRole: "host",
        type: "system",
        content: "Guest requested direct payment",
        timestamp: "2026-08-12T10:06:00",
      },
      {
        id: "m4",
        senderId: "host",
        senderName: brand.hostName,
        senderRole: "host",
        type: "text",
        content:
          "Hello Rahul! Yes, direct payment works perfectly. I'll hold these dates for you. Could you please share a valid government ID to complete the reservation?",
        timestamp: "2026-08-12T11:30:00",
      },
      {
        id: "m5",
        senderId: "system",
        senderName: "System",
        senderRole: "host",
        type: "system",
        content: "Host asked for government ID",
        timestamp: "2026-08-12T11:30:00",
      },
      {
        id: "m6",
        senderId: "guest-rahul",
        senderName: "Rahul Mehta",
        senderRole: "guest",
        type: "document",
        content: "Aadhaar Card uploaded",
        fileName: "Aadhaar_Card.pdf",
        fileSize: "1.2 MB",
        timestamp: "2026-08-17T14:32:00",
      },
      {
        id: "m7",
        senderId: "system",
        senderName: "System",
        senderRole: "host",
        type: "system",
        content: "Guest uploaded a document",
        timestamp: "2026-08-17T14:32:00",
      },
    ],
  },
  {
    id: "conv-2",
    propertyId: "prop-1",
    propertyName: "The Boho Nook",
    guestName: "Priya Sharma",
    guestEmail: "priya@example.com",
    lastMessage: "Thank you! Looking forward to our stay.",
    lastMessageAt: "2026-08-14T09:15:00",
    unread: false,
    tags: ["upcoming_stay"],
    isDemo: true,
    messages: [
      {
        id: "m8",
        senderId: "system",
        senderName: "System",
        senderRole: "host",
        type: "system",
        content: "Booking confirmed — #BK123456",
        timestamp: "2026-08-10T16:00:00",
      },
      {
        id: "m9",
        senderId: "host",
        senderName: brand.hostName,
        senderRole: "host",
        type: "text",
        content:
          "Welcome, Priya! Your check-in is at 2 PM on Sep 15. I'll send access details closer to your arrival.",
        timestamp: "2026-08-10T16:05:00",
      },
      {
        id: "m10",
        senderId: "guest-priya",
        senderName: "Priya Sharma",
        senderRole: "guest",
        type: "text",
        content: "Thank you! Looking forward to our stay.",
        timestamp: "2026-08-14T09:15:00",
      },
    ],
  },
  {
    id: "conv-3",
    propertyId: "prop-3",
    propertyName: "The Ivory Courtyard",
    guestName: "Neha Kapoor",
    guestEmail: "neha@example.com",
    lastMessage: "Is the villa available for Dec 24–28?",
    lastMessageAt: "2026-08-18T08:00:00",
    unread: true,
    tags: ["booking_inquiry", "unread"],
    isDemo: true,
    messages: [
      {
        id: "m11",
        senderId: "system",
        senderName: "System",
        senderRole: "host",
        type: "system",
        content: "Booking inquiry created",
        timestamp: "2026-08-18T08:00:00",
      },
      {
        id: "m12",
        senderId: "guest-neha",
        senderName: "Neha Kapoor",
        senderRole: "guest",
        type: "text",
        content: "Is the villa available for Dec 24–28? We're a family of 5.",
        timestamp: "2026-08-18T08:00:00",
      },
    ],
  },
];

export function getConversationById(id: string): Conversation | undefined {
  return conversations.find((c) => c.id === id);
}
