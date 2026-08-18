"use client";

import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { BookingSummary } from "@/components/booking/booking-summary";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getPropertyBySlug } from "@/data/mock/properties";
import { useToast } from "@/components/providers/toast-provider";
import { brand } from "@/lib/brand";
import { Icons } from "@/components/icons";

export default function ContactHostContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  const slug = params.slug as string;
  const property = getPropertyBySlug(slug);

  const checkIn = searchParams.get("checkIn") || "2026-09-15";
  const checkOut = searchParams.get("checkOut") || "2026-09-18";
  const guests = Number(searchParams.get("guests") || 2);

  if (!property) {
    return (
      <div className="container-page section-padding">
        <p className="text-muted">This stay could not be found.</p>
        <Link href="/stays" className="mt-4 inline-block text-accent hover:underline">
          Browse stays
        </Link>
      </div>
    );
  }

  const handleSend = () => {
    showToast("Inquiry sent! Opening chat…", "success");
    router.push("/messages/conv-1");
  };

  return (
    <div className="section-padding">
      <div className="container-page max-w-4xl">
        <Link href={`/stays/${slug}`} className="text-sm text-muted hover:text-foreground">
          ← Back to property
        </Link>

        <h1 className="mt-4 font-serif text-3xl">Contact your host</h1>
        <p className="mt-2 text-muted">
          Have a question before booking, or prefer to arrange payment directly?
        </p>

        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-warning">
          This is an inquiry — not a confirmed booking. Your host will respond to discuss
          availability and payment options.
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <h2 className="font-serif text-lg">Your inquiry</h2>
              <Textarea
                className="mt-4"
                label="Message"
                defaultValue={`Hi! I'm interested in booking ${property.name} from ${checkIn} to ${checkOut} for ${guests} guests. I'd like to discuss direct payment options.`}
                rows={6}
              />
              <Button fullWidth className="mt-4" onClick={handleSend}>
                Send inquiry
              </Button>
            </Card>

            <Card>
              <h2 className="font-serif text-lg">Your host</h2>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-light text-accent">
                  <Icons.User className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium">{brand.hostName}</p>
                  <p className="text-sm text-muted">{brand.hostTitle} · Typically responds within 2 hrs</p>
                </div>
              </div>
            </Card>
          </div>

          <BookingSummary
            property={property}
            checkIn={checkIn}
            checkOut={checkOut}
            guests={guests}
          />
        </div>
      </div>
    </div>
  );
}
