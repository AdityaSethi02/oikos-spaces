import { brand } from "@/lib/brand";

export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="section-padding">
      <div className="container-page max-w-3xl">
        <h1 className="font-serif text-3xl sm:text-4xl">Terms of Service</h1>
        <p className="mt-3 text-sm text-muted">Last updated: November 2026</p>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted">
          <p>
            By using the {brand.name} website and related enquiry channels, you agree to these
            terms. If you do not agree, please do not use the site.
          </p>
          <h2 className="font-serif text-xl text-foreground">Services</h2>
          <p>
            We provide real-estate advisory and brokerage-related assistance for buying, selling,
            renting and leasing property in Udaipur. Listings, prices and availability are
            indicative and may change without notice.
          </p>
          <h2 className="font-serif text-xl text-foreground">No guarantee</h2>
          <p>
            We do not guarantee that any property will meet your expectations, that a transaction
            will complete, or that financing or documentation will be approved by third parties.
            Final due diligence remains your responsibility with qualified professionals.
          </p>
          <h2 className="font-serif text-xl text-foreground">Demo content</h2>
          <p>
            Parts of this website may show sample listings and demo flows. Do not treat demo data
            as a live offer to sell or lease.
          </p>
          <h2 className="font-serif text-xl text-foreground">Contact</h2>
          <p>
            Questions about these terms:{" "}
            <a href={`mailto:${brand.contact.email}`} className="text-accent hover:underline">
              {brand.contact.email}
            </a>
            .
          </p>
          <p className="text-xs">
            This page is a demo terms document for the product prototype and should be reviewed by
            counsel before production use.
          </p>
        </div>
      </div>
    </div>
  );
}
