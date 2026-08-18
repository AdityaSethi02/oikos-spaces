export const brand = {
  name: "OIKOS SPACES",
  tagline: "Boutique Stays, Personally Hosted",
  hostName: "Host Team",
  hostTitle: "Your host",
  location: "Udaipur, Rajasthan, India",
  contact: {
    email: "hello@oikosspaces.com",
    phone: "+91 98765 43210",
    whatsapp: "+91 98765 43210",
    address: "Udaipur, Rajasthan 313001",
  },
} as const;

export const navigation = {
  main: [
    { label: "Stays", href: "/stays" },
    { label: "About Us", href: "/about" },
    { label: "Experiences", href: "/experiences" },
    { label: "Contact", href: "/contact" },
  ],
  guest: [
    { label: "My Bookings", href: "/bookings" },
    { label: "Messages", href: "/messages" },
    { label: "Favorites", href: "/favorites" },
  ],
  admin: [
    { label: "Dashboard", href: "/admin" },
    { label: "Calendar", href: "/admin/calendar" },
    { label: "Bookings", href: "/admin/bookings" },
    { label: "Properties", href: "/admin/properties" },
    { label: "Messages", href: "/admin/messages" },
    { label: "Guests", href: "/admin/guests" },
    { label: "Documents", href: "/admin/documents" },
    { label: "Payments", href: "/admin/payments" },
    { label: "Reviews", href: "/admin/reviews" },
    { label: "Settings", href: "/admin/settings" },
  ],
} as const;

export const colors = {
  background: "#FDFCF9",
  surface: "#FFFFFF",
  foreground: "#1C1917",
  muted: "#78716C",
  border: "#E7E5E4",
  accent: "#A67C52",
  accentLight: "#F5EDE4",
  success: "#15803D",
  warning: "#B45309",
  error: "#B91C1C",
  info: "#1D4ED8",
} as const;
