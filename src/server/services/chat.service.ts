import type { ConversationMessage, MessageKind, User } from "@prisma/client";
import prisma from "@/lib/prisma";
import { ForbiddenError, NotFoundError } from "@/server/errors";
import { brand } from "@/lib/brand";
import type { ChatMessage, Conversation as ConversationDto } from "@/server/dto/domain.dto";
import { requireDatabase } from "@/server/lib/require-config";

const PAGE_SIZE = 30;

function canAccess(user: User, conversation: { guestId: string }) {
  return user.role === "ADMIN_HOST" || conversation.guestId === user.id;
}

function toChatMessage(
  message: ConversationMessage & { sender: { name: string | null; role: User["role"] } | null },
): ChatMessage {
  const isSystem = message.kind === "SYSTEM";
  const isHost = message.sender?.role === "ADMIN_HOST" || isSystem;
  return {
    id: message.id,
    senderId: message.senderUserId ?? "system",
    senderName: isSystem ? "System" : isHost ? brand.hostName : (message.sender?.name ?? "Guest"),
    senderRole: isHost ? "host" : "guest",
    type:
      message.kind === "SYSTEM"
        ? "system"
        : message.kind === "IMAGE"
          ? "image"
          : message.kind === "DOCUMENT"
            ? "document"
            : "text",
    content: message.body,
    fileName: message.attachmentName ?? undefined,
    fileSize: message.attachmentSize
      ? `${(message.attachmentSize / 1024 / 1024).toFixed(2)} MB`
      : undefined,
    timestamp: message.createdAt.toISOString(),
  };
}

function tagsForBooking(status: string, paymentMethod: string | null): ConversationDto["tags"] {
  const tags: ConversationDto["tags"] = [];
  if (status === "INQUIRY") tags.push("booking_inquiry");
  if (["RESERVED", "PAYMENT_PENDING", "CONFIRMED", "CHECKED_IN"].includes(status)) {
    tags.push("upcoming_stay");
  }
  if (paymentMethod === "DIRECT") tags.push("direct_payment");
  return tags;
}

export async function listConversationsForUser(user: User): Promise<ConversationDto[]> {
  requireDatabase();
  const rows = await prisma.conversation.findMany({
    where: user.role === "ADMIN_HOST" ? {} : { guestId: user.id },
    include: {
      guest: true,
      property: true,
      booking: true,
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { lastMessageAt: "desc" },
  });

  return rows.map((row) => {
    const last = row.messages[0];
    const lastRead = user.role === "ADMIN_HOST" ? row.hostLastReadAt : row.guestLastReadAt;
    const unread = Boolean(last && (!lastRead || last.createdAt > lastRead));
    const bookingTags = tagsForBooking(row.booking?.status ?? "INQUIRY", row.booking?.paymentMethod ?? null);
    return {
      id: row.id,
      propertyId: row.propertyId,
      propertyName: row.property.name,
      guestName: row.guest.name ?? row.guest.email,
      guestEmail: row.guest.email,
      lastMessage: last?.body ?? "",
      lastMessageAt: (last?.createdAt ?? row.lastMessageAt).toISOString(),
      unread,
      tags: [...new Set([
        ...(Array.isArray(row.tags) ? row.tags.filter((tag): tag is ConversationDto["tags"][number] => typeof tag === "string") : []),
        ...bookingTags,
        ...(unread ? (["unread"] as const) : []),
      ])] as ConversationDto["tags"],
      messages: [],
      bookingId: row.bookingId ?? undefined,
    };
  });
}

export async function getConversationForUser(user: User, conversationId: string) {
  requireDatabase();
  const row = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { guest: true, property: true, booking: true },
  });
  if (!row) throw new NotFoundError("Conversation not found");
  if (!canAccess(user, row)) throw new ForbiddenError();
  return row;
}

export async function listMessagesPage(input: {
  user: User;
  conversationId: string;
  cursor?: string;
  limit?: number;
}) {
  await getConversationForUser(input.user, input.conversationId);
  requireDatabase();
  const limit = Math.min(input.limit ?? PAGE_SIZE, 50);
  let cursorCreatedAt: Date | undefined;
  if (input.cursor) {
    const cursorMessage = await prisma.conversationMessage.findUnique({
      where: { id: input.cursor },
      select: { createdAt: true, conversationId: true },
    });
    if (cursorMessage?.conversationId === input.conversationId) {
      cursorCreatedAt = cursorMessage.createdAt;
    }
  }

  const messages = await prisma.conversationMessage.findMany({
    where: {
      conversationId: input.conversationId,
      ...(cursorCreatedAt ? { createdAt: { lt: cursorCreatedAt } } : {}),
    },
    include: { sender: true },
    orderBy: { createdAt: "desc" },
    take: limit + 1,
  });

  const hasMore = messages.length > limit;
  const page = hasMore ? messages.slice(0, limit) : messages;
  page.reverse();

  return {
    messages: page.map(toChatMessage),
    nextCursor: hasMore ? page[0]?.id : undefined,
    hasMore,
  };
}

export async function sendMessage(input: {
  user: User;
  conversationId: string;
  body: string;
  kind?: MessageKind;
  attachment?: {
    key: string;
    name: string;
    mime: string;
    size: number;
  };
}) {
  const conversation = await getConversationForUser(input.user, input.conversationId);
  requireDatabase();
  const kind =
    input.kind ??
    (input.attachment?.mime.startsWith("image/") ? "IMAGE" : input.attachment ? "DOCUMENT" : "TEXT");

  const message = await prisma.conversationMessage.create({
    data: {
      conversationId: conversation.id,
      senderUserId: input.user.id,
      kind,
      body: input.body,
      attachmentKey: input.attachment?.key,
      attachmentName: input.attachment?.name,
      attachmentMime: input.attachment?.mime,
      attachmentSize: input.attachment?.size,
    },
    include: { sender: true },
  });

  await prisma.conversation.update({
    where: { id: conversation.id },
    data: { lastMessageAt: message.createdAt },
  });

  return toChatMessage(message);
}

export async function markConversationRead(user: User, conversationId: string) {
  const conversation = await getConversationForUser(user, conversationId);
  requireDatabase();
  await prisma.conversation.update({
    where: { id: conversation.id },
    data:
      user.role === "ADMIN_HOST"
        ? { hostLastReadAt: new Date() }
        : { guestLastReadAt: new Date() },
  });
}

export async function ensureConversationForBooking(bookingId: string) {
  requireDatabase();
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { conversation: true, property: true },
  });
  if (!booking) return null;
  if (booking.conversation) return booking.conversation;

  return prisma.conversation.create({
    data: {
      propertyId: booking.propertyId,
      bookingId: booking.id,
      guestId: booking.guestId,
      tags: tagsForBooking(booking.status, booking.paymentMethod),
    },
  });
}

export async function postSystemMessage(bookingId: string, body: string) {
  requireDatabase();
  const conversation = await ensureConversationForBooking(bookingId);
  if (!conversation) return null;

  const message = await prisma.conversationMessage.create({
    data: {
      conversationId: conversation.id,
      kind: "SYSTEM",
      body,
    },
    include: { sender: true },
  });

  await prisma.conversation.update({
    where: { id: conversation.id },
    data: { lastMessageAt: message.createdAt },
  });

  return toChatMessage(message);
}

export async function requestGuestId(user: User, conversationId: string) {
  if (user.role !== "ADMIN_HOST") throw new ForbiddenError();
  const conversation = await getConversationForUser(user, conversationId);
  requireDatabase();
  const tags = Array.isArray(conversation.tags)
    ? conversation.tags.filter((tag): tag is string => typeof tag === "string")
    : [];
  await prisma.conversation.update({
    where: { id: conversation.id },
    data: { tags: [...new Set([...tags, "id_requested"])] },
  });
  if (conversation.bookingId) {
    await postSystemMessage(conversation.bookingId, "Host requested a valid government ID.");
    return;
  }
  await prisma.conversationMessage.create({
    data: {
      conversationId: conversation.id,
      kind: "SYSTEM",
      body: "Host requested a valid government ID.",
    },
  });
}

export async function sendBookingInfo(user: User, conversationId: string) {
  if (user.role !== "ADMIN_HOST") throw new ForbiddenError();
  const conversation = await getConversationForUser(user, conversationId);
  let text = "Please see the booking details in your account.";
  if (conversation.bookingId) {
    const booking = await prisma.booking.findUnique({ where: { id: conversation.bookingId } });
    if (booking) {
      text = `Booking ${booking.bookingReference}: ${booking.checkInDate.toISOString().slice(0, 10)} – ${booking.checkOutDate.toISOString().slice(0, 10)} for ${booking.numberOfGuests} guests.`;
    }
  }
  return sendMessage({ user, conversationId, body: text });
}

export async function getLinkedBookingReference(user: User, conversationId: string) {
  const conversation = await getConversationForUser(user, conversationId);
  if (!conversation.bookingId) return undefined;
  const booking = await prisma.booking.findUnique({
    where: { id: conversation.bookingId },
    select: { bookingReference: true },
  });
  return booking?.bookingReference;
}
