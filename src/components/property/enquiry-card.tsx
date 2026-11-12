"use client";

import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { brand, whatsappLink } from "@/lib/brand";
import type { Property } from "@/data/mock/properties";
import { getDealerChatHref } from "@/data/mock/conversations";
import { cn } from "@/lib/utils";

interface EnquiryCardProps {
  property: Property;
  sticky?: boolean;
  className?: string;
}

export function EnquiryCard({ property, sticky = true, className }: EnquiryCardProps) {
  const chatHref = getDealerChatHref(property.id, property.slug);
  const wa = whatsappLink(
    `Hi, I'm interested in ${property.name} (${property.priceLabel}) at ${property.location}. Please share more details.`,
  );

  return (
    <Card className={cn(sticky && "lg:sticky lg:top-24", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted">{property.status}</p>
          <p className="mt-1 font-serif text-2xl text-foreground">{property.priceLabel}</p>
        </div>
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
        <ButtonLink href={chatHref} variant="primary" fullWidth>
          Message dealer
        </ButtonLink>
        <ButtonLink href={wa} variant="outline" fullWidth target="_blank" rel="noopener noreferrer">
          WhatsApp
        </ButtonLink>
        <ButtonLink href={`tel:${brand.contact.phone.replace(/\s/g, "")}`} variant="ghost" fullWidth>
          Call {brand.contact.phone}
        </ButtonLink>
      </div>

      <p className="mt-4 text-center text-xs text-muted">
        Chat with our advisors about this listing
      </p>
    </Card>
  );
}

export function MobileEnquiryBar({ property }: { property: Property }) {
  const chatHref = getDealerChatHref(property.id, property.slug);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 p-3 backdrop-blur-sm lg:hidden">
      <div className="container-page flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm text-muted">{property.status}</p>
          <p className="font-semibold text-foreground">{property.priceLabel}</p>
        </div>
        <ButtonLink href={chatHref} size="sm" className="shrink-0">
          Message
        </ButtonLink>
      </div>
    </div>
  );
}
