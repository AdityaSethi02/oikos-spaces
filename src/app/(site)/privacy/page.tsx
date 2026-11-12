import { brand } from "@/lib/brand";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="section-padding">
      <div className="container-page max-w-3xl prose-like">
        <h1 className="font-serif text-3xl sm:text-4xl">Privacy Policy</h1>
        <p className="mt-3 text-sm text-muted">Last updated: November 2026</p>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted">
          <p>
            {brand.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) respects your privacy. This policy
            explains how we collect and use information when you use our website or contact us
            about property services in Udaipur.
          </p>
          <h2 className="font-serif text-xl text-foreground">Information we collect</h2>
          <p>
            When you request a callback, enquire on a listing, or message us, we may collect your
            name, phone number, email, preferred locality, budget notes, and the content of your
            message. We also receive standard technical data such as browser type and pages visited.
          </p>
          <h2 className="font-serif text-xl text-foreground">How we use it</h2>
          <p>
            We use your details to respond to enquiries, arrange site visits, share relevant
            listings, and improve our services. We do not sell your personal information.
          </p>
          <h2 className="font-serif text-xl text-foreground">Sharing</h2>
          <p>
            We may share information with sellers, developers, lenders or service partners only as
            needed to fulfil your request (for example, loan introductions or interior referrals),
            or when required by law.
          </p>
          <h2 className="font-serif text-xl text-foreground">Contact</h2>
          <p>
            For privacy questions, email{" "}
            <a href={`mailto:${brand.contact.email}`} className="text-accent hover:underline">
              {brand.contact.email}
            </a>{" "}
            or write to us at {brand.contact.address}.
          </p>
          <p className="text-xs">
            This page is a demo policy for the product prototype and should be reviewed by counsel
            before production use.
          </p>
        </div>
      </div>
    </div>
  );
}
