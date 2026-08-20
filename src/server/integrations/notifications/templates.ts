export type NotificationTemplate =
  | "BOOKING_CONFIRMED"
  | "PAYMENT_RECEIVED"
  | "INQUIRY_RECEIVED"
  | "CONTACT_INQUIRY"
  | "CHECKIN_REMINDER"
  | "CHECKOUT_REMINDER"
  | "REVIEW_REQUEST";

export type TemplatePayload = {
  guestName?: string;
  propertyName?: string;
  bookingReference?: string;
  checkIn?: string;
  checkOut?: string;
  message?: string;
  name?: string;
  email?: string;
  phone?: string;
};

export function renderNotification(
  template: NotificationTemplate,
  payload: TemplatePayload,
): { subject: string; text: string } {
  const guest = payload.guestName ?? "there";
  const stay = payload.propertyName ?? "your stay";
  const ref = payload.bookingReference ? ` (#${payload.bookingReference})` : "";
  const dates =
    payload.checkIn && payload.checkOut ? ` ${payload.checkIn} to ${payload.checkOut}` : "";

  switch (template) {
    case "BOOKING_CONFIRMED":
      return {
        subject: `Booking confirmed${ref} — ${stay}`,
        text: `Hi ${guest},\n\nYour booking at ${stay}${ref} is confirmed for${dates}.\n\nWe look forward to hosting you.\n\nOIKOS SPACES`,
      };
    case "PAYMENT_RECEIVED":
      return {
        subject: `Payment received${ref}`,
        text: `Hi ${guest},\n\nWe have received payment for ${stay}${ref}. Your dates${dates} are held.\n\nOIKOS SPACES`,
      };
    case "INQUIRY_RECEIVED":
      return {
        subject: `New inquiry for ${stay}`,
        text: `A guest${payload.guestName ? ` (${payload.guestName})` : ""} sent an inquiry for ${stay}${dates}.\n\n${payload.message ?? ""}\n\nOpen the host dashboard to reply.`,
      };
    case "CHECKIN_REMINDER":
      return {
        subject: `Check-in tomorrow at ${stay}`,
        text: `Hi ${guest},\n\nThis is a reminder that check-in for ${stay}${ref} is tomorrow${dates ? ` (${payload.checkIn})` : ""}.\n\nOIKOS SPACES`,
      };
    case "CHECKOUT_REMINDER":
      return {
        subject: `Check-out reminder — ${stay}`,
        text: `Hi ${guest},\n\nCheck-out for ${stay}${ref} is coming up${payload.checkOut ? ` on ${payload.checkOut}` : ""}.\n\nOIKOS SPACES`,
      };
    case "REVIEW_REQUEST":
      return {
        subject: `How was your stay at ${stay}?`,
        text: `Hi ${guest},\n\nThank you for staying with us. We would love a short review of ${stay}${ref}.\n\nOIKOS SPACES`,
      };
    case "CONTACT_INQUIRY":
      return {
        subject: `Website contact from ${payload.name ?? "a visitor"}`,
        text: `New contact form submission:\n\nName: ${payload.name ?? ""}\nEmail: ${payload.email ?? ""}\nPhone: ${payload.phone ?? ""}\n\n${payload.message ?? ""}`,
      };
  }
}
