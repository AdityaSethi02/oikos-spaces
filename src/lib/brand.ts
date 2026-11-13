export const brand = {
  name: "RealEstate Firm",
  tagline: "Buy · Sell · Rent in Udaipur",
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
  social: {
    instagram: "https://instagram.com/realestatefirm",
    facebook: "https://facebook.com/realestatefirm",
    youtube: "https://youtube.com/@realestatefirm",
  },
  stats: {
    years: 18,
    clients: 2500,
    localities: 12,
    listings: 40,
  },
  partners: [
    "Lakeview Builders",
    "Aravali Homes",
    "Udaipur Realty Group",
    "Meera Developers",
    "Cityscape Projects",
    "Heritage Estates",
  ],
} as const;

export const enquiryInterests = [
  { value: "buy-apartment", label: "Buying an apartment" },
  { value: "buy-villa", label: "Buying a villa / home" },
  { value: "buy-plot", label: "Buying a plot" },
  { value: "commercial", label: "Commercial property" },
  { value: "rent", label: "Renting / leasing" },
  { value: "sell", label: "Selling my property" },
  { value: "nri", label: "NRI services" },
  { value: "loans", label: "Home loans" },
  { value: "interiors", label: "Interior consultation" },
  { value: "legal", label: "Legal & documentation" },
  { value: "investment", label: "Investment / resale advice" },
  { value: "other", label: "Something else" },
] as const;

export const whyUs = [
  {
    title: "Verified & RERA-aware",
    desc: "We check title clarity and RERA registration before we recommend a property — fewer surprises at registration.",
  },
  {
    title: "Local market depth",
    desc: "Lake belt to emerging corridors — pricing, paperwork quirks, and which streets actually hold value.",
  },
  {
    title: "NRI-ready process",
    desc: "Video walkthroughs, power of attorney coordination, and clear updates across time zones.",
  },
  {
    title: "Beyond the handshake",
    desc: "Loan introductions, interior referrals, and resale timing advice when you need the next step.",
  },
] as const;

export const navigation = {
  /** Primary header + mobile menu links (same set on desktop and mobile) */
  main: [
    { label: "Properties", href: "/properties" },
    { label: "Areas", href: "/areas" },
    { label: "Services", href: "/services" },
    { label: "Journal", href: "/journal" },
    { label: "About", href: "/about" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "Contact", href: "/contact" },
  ],
  guest: [{ label: "Saved", href: "/favorites" }],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
} as const;

export function whatsappLink(message?: string) {
  const phone = brand.contact.whatsapp.replace(/\D/g, "");
  const base = `https://wa.me/${phone}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}
