import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata = { title: "Experiences" };

export default function ExperiencesPage() {
  return (
    <div className="section-padding">
      <div className="container-page max-w-2xl">
        <h1 className="font-serif text-3xl sm:text-4xl">Experiences</h1>
        <p className="mt-4 text-muted">
          Curated local experiences for our guests are coming soon. For now, message us when you book a stay and we&apos;ll help arrange activities in Udaipur.
        </p>
        <Card className="mt-8">
          <h2 className="font-serif text-xl">Stay first</h2>
          <p className="mt-2 text-sm text-muted">
            Browse our properties and reserve your dates. Our team can recommend dining, heritage walks, and lake experiences during your stay.
          </p>
          <ButtonLink href="/stays" className="mt-6">
            Browse stays
          </ButtonLink>
        </Card>
        <p className="mt-6 text-sm">
          <Link href="/contact" className="text-accent hover:underline">Contact us</Link> for bespoke arrangements.
        </p>
      </div>
    </div>
  );
}
