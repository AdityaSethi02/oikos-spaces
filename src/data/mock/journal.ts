import { unsplash } from "@/lib/media";

export interface JournalPost {
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  date: string;
  readMinutes: number;
  category: string;
  image: string;
}

export const journalPosts: JournalPost[] = [
  {
    slug: "udaipur-real-estate-outlook-2026",
    title: "Udaipur's real estate outlook for 2026",
    excerpt:
      "Where end-user demand is holding, which corridors are heating up, and what first-time buyers should watch before booking.",
    body: [
      "Udaipur's market remains driven more by end-users and lifestyle buyers than pure speculation. Lake-belt apartments and well-documented villas continue to see steady enquiry, while newer gated pockets attract families trading space for amenity living.",
      "For 2026, expect pricing discipline: overpriced resale stock sits longer, while clean-title homes priced near comparable sales move. Buyers should compare not just asking price, but registration readiness and builder track record.",
      "If you are shortlisting, start with locality fit (schools, commute, noise), then paperwork. Our advisors can walk you through both without rushing a token.",
    ],
    date: "2026-09-12",
    readMinutes: 4,
    category: "Market",
    image: unsplash("photo-1560518883-ce09059eeffa", 1200, 700),
  },
  {
    slug: "first-time-buyer-checklist-udaipur",
    title: "A first-time buyer's checklist for Udaipur",
    excerpt:
      "Budget, locality, site visits, and documents — a practical sequence so you do not skip the steps that matter.",
    body: [
      "Lock a realistic all-in budget (price + registration + interiors buffer) before you fall for a view. Then shortlist two or three localities that match your daily life, not just Instagram photos.",
      "On every visit, check water pressure, parking, society rules, and noise at different times of day. Ask for RERA details (where applicable), title chain summary, and pending dues in writing.",
      "Only after that should you talk token and timelines. We help first-time buyers run this checklist so negotiations start from clarity, not urgency.",
    ],
    date: "2026-08-28",
    readMinutes: 5,
    category: "Guides",
    image: unsplash("photo-1560448204-e02f11c3d0e2", 1200, 700),
  },
  {
    slug: "why-fateh-sagar-stays-in-demand",
    title: "Area spotlight: why Fateh Sagar stays in demand",
    excerpt:
      "Promenade living, rental depth, and limited lake-adjacent stock — what keeps this belt on every shortlist.",
    body: [
      "Fateh Sagar combines lifestyle and liquidity: evening walks, restaurants nearby, and consistent tenant interest from professionals who want lake-adjacent addresses.",
      "Inventory is tighter than outer corridors, so pricing can feel premium — but well-kept apartments with clear parking and society hygiene still find buyers quickly.",
      "Compare floor, facing, and society maintenance carefully; two buildings on the same road can feel very different after sundown.",
    ],
    date: "2026-08-10",
    readMinutes: 3,
    category: "Areas",
    image: unsplash("photo-1477587458883-47145ed94245", 1200, 700),
  },
  {
    slug: "nri-buying-property-in-udaipur",
    title: "A practical guide for NRIs buying in Udaipur",
    excerpt:
      "Remote due diligence, power of attorney, and what to verify before you send a token from abroad.",
    body: [
      "NRI buyers usually need three things: trusted local eyes, clean documentation, and a clear payment path. Video walkthroughs and recorded measurements help when you cannot fly in for every visit.",
      "Power of attorney should be drafted carefully for the exact acts you authorise — inspection, negotiation, registration support. Repatriation and banking rules vary; involve your CA early.",
      "We coordinate remote visits, shortlists, and paperwork handoffs so you are not depending on screenshots alone.",
    ],
    date: "2026-07-18",
    readMinutes: 6,
    category: "NRI",
    image: unsplash("photo-1486406146926-c627a92ad1ab", 1200, 700),
  },
  {
    slug: "understanding-rera-rajasthan-buyers",
    title: "Understanding RERA: what Rajasthan buyers should check",
    excerpt:
      "Registration status, project details, and red flags — the public checks worth doing before you book.",
    body: [
      "RERA registration is one of the most useful public signals for under-construction and many project sales. Confirm the registration number, promoter details, and what the project actually covers.",
      "RERA is not a substitute for title diligence on resale homes, but it helps you avoid opaque launches and mismatched promises.",
      "Ask us for a plain-language read of what is registered versus what the brochure claims — especially on possession timelines and common areas.",
    ],
    date: "2026-07-02",
    readMinutes: 4,
    category: "Legal",
    image: unsplash("photo-1450101499163-c8848c66ca85", 1200, 700),
  },
  {
    slug: "renting-vs-buying-udaipur",
    title: "Renting vs buying in Udaipur: running the numbers",
    excerpt:
      "The math looks different on the lake belt than in Hiran Magri — how to decide without guesswork.",
    body: [
      "Compare total monthly ownership cost (EMI or opportunity cost + maintenance + tax) against rent for a similar home in the same locality. Add a buffer for interiors if you buy.",
      "If you may relocate within three years, renting often wins. If you want stability and can hold five-plus years in a liquid pocket, buying can make sense — especially when resale demand is proven.",
      "We help clients run a simple locality-specific comparison so the decision is numbers-first, not FOMO-first.",
    ],
    date: "2026-06-20",
    readMinutes: 5,
    category: "Guides",
    image: unsplash("photo-1560184897-ae75f418493e", 1200, 700),
  },
];

export function getJournalPostBySlug(slug: string): JournalPost | undefined {
  return journalPosts.find((p) => p.slug === slug);
}

export function getJournalPosts(): JournalPost[] {
  return [...journalPosts].sort((a, b) => b.date.localeCompare(a.date));
}
