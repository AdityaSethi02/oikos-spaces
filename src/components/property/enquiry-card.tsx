"use client";

import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { brand, whatsappLink } from "@/lib/brand";
import type { Property } from "@/data/mock/properties";
import { getDealerChatHref } from "@/data/mock/conversations";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/providers/toast-provider";

interface EnquiryCardProps {
  property: Property;
  sticky?: boolean;
  className?: string;
}

export function EnquiryCard({ property, sticky = true, className }: EnquiryCardProps) {
  const { showToast } = useToast();
  const [visitOpen, setVisitOpen] = useState(false);
  const chatHref = getDealerChatHref(property.id, property.slug);
  const wa = whatsappLink(
    `Hi, I'm interested in ${property.name} (${property.priceLabel}) at ${property.location}. Please share more details.`,
  );

  return (
    <Card className={cn(sticky && "lg:sticky lg:top-24", className)}>
      <div>
        <p className="text-sm text-muted">{property.status}</p>
        <p className="mt-1 font-serif text-3xl text-foreground">{property.priceLabel}</p>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-muted">Type</dt>
          <dd className="mt-0.5 font-medium">{property.type}</dd>
        </div>
        <div>
          <dt className="text-muted">Locality</dt>
          <dd className="mt-0.5 font-medium">{property.locality}</dd>
        </div>
        {property.bedrooms > 0 && (
          <div>
            <dt className="text-muted">Configuration</dt>
            <dd className="mt-0.5 font-medium">{property.bedrooms} BHK</dd>
          </div>
        )}
        <div>
          <dt className="text-muted">Area</dt>
          <dd className="mt-0.5 font-medium">
            {property.areaSqFt.toLocaleString("en-IN")} sq.ft
          </dd>
        </div>
      </dl>

      <div className="mt-6 space-y-3">
        <ButtonLink href={wa} variant="primary" fullWidth target="_blank" rel="noopener noreferrer">
          WhatsApp an advisor
        </ButtonLink>
        <ButtonLink href={chatHref} variant="outline" fullWidth>
          Message dealer
        </ButtonLink>
        <Button
          variant="ghost"
          fullWidth
          onClick={() => setVisitOpen((v) => !v)}
        >
          Schedule a site visit
        </Button>
      </div>

      {visitOpen && (
        <form
          className="mt-4 space-y-3 border-t border-border pt-4"
          onSubmit={(e) => {
            e.preventDefault();
            showToast("Site visit request sent (demo).", "success");
            setVisitOpen(false);
          }}
        >
          <input
            type="date"
            required
            className="search-input"
            aria-label="Preferred visit date"
          />
          <input
            type="tel"
            required
            placeholder="Your phone"
            className="search-input"
            aria-label="Phone"
          />
          <Button type="submit" fullWidth size="sm">
            Request visit
          </Button>
        </form>
      )}

      <p className="mt-4 text-center text-xs text-muted">
        Usually replies within an hour · {brand.contact.hours}
      </p>
    </Card>
  );
}

export function MobileEnquiryBar({ property }: { property: Property }) {
  const chatHref = getDealerChatHref(property.id, property.slug);
  const wa = whatsappLink(
    `Hi, I'm interested in ${property.name} (${property.priceLabel}).`,
  );

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 p-3 backdrop-blur-sm lg:hidden">
      <div className="container-page flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-muted">{property.status}</p>
          <p className="font-serif text-lg text-foreground">{property.priceLabel}</p>
        </div>
        <ButtonLink href={chatHref} variant="outline" size="sm" className="shrink-0">
          Message
        </ButtonLink>
        <ButtonLink
          href={wa}
          size="sm"
          className="shrink-0"
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp
        </ButtonLink>
      </div>
    </div>
  );
}
