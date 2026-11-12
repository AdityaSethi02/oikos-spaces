export const brand = {
  name: "RealEstate Firm",
  tagline: "Buy · Sell · Rent",
  hostName: "Dealer Desk",
  hostTitle: "Property dealer",
  location: "Udaipur, Rajasthan, India",
  founder: {
    name: "Rajesh Mehta",
    title: "Founder & Principal Advisor",
    experienceYears: 18,
    clientsServed: 2500,
  },
  contact: {
    email: "hello@realestatefirm.in",
    phone: "+91 98765 43210",
    whatsapp: "+91 98765 43210",
    address: "Lake Palace Road, Udaipur, Rajasthan 313001",
    hours: "Open every day, 10:00 AM – 8:00 PM",
  },
  stats: {
    years: 18,
    clients: 2500,
    localities: 12,
    listings: 40,
  },
} as const;

export const navigation = {
  main: [
    { label: "Properties", href: "/properties" },
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  guest: [
    { label: "Saved", href: "/favorites" },
    { label: "Chat with dealer", href: "/messages" },
  ],
  admin: [
    { label: "Dashboard", href: "/admin" },
    { label: "Properties", href: "/admin/properties" },
    { label: "Messages", href: "/admin/messages" },
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

export function whatsappLink(message?: string) {
  const phone = brand.contact.whatsapp.replace(/\D/g, "");
  const base = `https://wa.me/${phone}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}
