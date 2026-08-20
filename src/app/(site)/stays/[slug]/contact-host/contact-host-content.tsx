"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { BookingSummary } from "@/components/booking/booking-summary";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Property } from "@/server/dto/domain.dto";
import type { QuoteDto } from "@/server/dto/public.dto";
import { useToast } from "@/components/providers/toast-provider";
import { brand } from "@/lib/brand";
import { Icons } from "@/components/icons";
import { createInquiryAction } from "@/app/actions/booking.actions";

export default function ContactHostContent({
  property,
  quote,
}: {
  property: Property;
  quote: QuoteDto | null;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  const slug = property.slug;

  const checkIn = searchParams.get("checkIn") || "2026-09-15";
  const checkOut = searchParams.get("checkOut") || "2026-09-18";
  const guests = Number(searchParams.get("guests") || 2);
  const [message, setMessage] = useState(
    `Hi! I'm interested in booking ${property.name} from ${checkIn} to ${checkOut} for ${guests} guests. I'd like to discuss direct payment options.`,
  );
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    const result = await createInquiryAction({
      slug,
      checkIn,
      checkOut,
      guests,
      message,
    });
    setLoading(false);
    if (!result.ok) {
      showToast(result.error, "error");
      if (result.code === "UNAUTHORIZED") {
        router.push(
          `/sign-in?next=${encodeURIComponent(`/stays/${slug}/contact-host?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`)}`,
        );
      }
      return;
    }
    showToast("Inquiry sent", "success");
    router.push(`/messages/${result.conversationId}`);
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
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
              />
              <Button fullWidth className="mt-4" onClick={handleSend} disabled={loading}>
                {loading ? "Sending…" : "Send inquiry"}
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
            quote={quote}
          />
        </div>
      </div>
    </div>
  );
}
