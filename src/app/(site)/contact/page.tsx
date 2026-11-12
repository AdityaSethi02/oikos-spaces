"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { PropertyImage } from "@/components/media/property-image";
import { Icons } from "@/components/icons";
import { brand, enquiryInterests, whatsappLink } from "@/lib/brand";
import { brandImages } from "@/lib/media";
import { useToast } from "@/components/providers/toast-provider";

export default function ContactPage() {
  const { showToast } = useToast();
  const [interest, setInterest] = useState<string>(enquiryInterests[0].value);

  return (
    <div className="section-padding">
      <div className="container-page">
        <h1 className="font-serif text-3xl sm:text-4xl">Book a consultation</h1>
        <p className="mt-2 text-muted">
          Tell us what you&apos;re looking for — buy, sell, rent, NRI support or documentation help.
          We respond fast.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <h2 className="font-serif text-xl">Visit & reach us</h2>
              <dl className="mt-6 space-y-4 text-sm">
                <div>
                  <dt className="text-muted">Email</dt>
                  <dd className="mt-1 font-medium">
                    <a href={`mailto:${brand.contact.email}`} className="hover:text-accent">
                      {brand.contact.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">Phone</dt>
                  <dd className="mt-1 font-medium">
                    <a
                      href={`tel:${brand.contact.phone.replace(/\s/g, "")}`}
                      className="hover:text-accent"
                    >
                      {brand.contact.phone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">WhatsApp</dt>
                  <dd className="mt-1">
                    <a
                      href={whatsappLink()}
                      className="font-medium text-accent hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Message on WhatsApp
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">Office</dt>
                  <dd className="mt-1 font-medium">{brand.contact.address}</dd>
                </div>
                <div>
                  <dt className="text-muted">Hours</dt>
                  <dd className="mt-1 font-medium">{brand.contact.hours}</dd>
                </div>
              </dl>
              <div className="mt-6 flex flex-wrap gap-2">
                <ButtonLink
                  href={whatsappLink("Hi, I'd like a consultation about a property.")}
                  size="sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </ButtonLink>
                <ButtonLink
                  href={`tel:${brand.contact.phone.replace(/\s/g, "")}`}
                  variant="outline"
                  size="sm"
                >
                  Call now
                </ButtonLink>
              </div>
              <div className="mt-6 flex items-center gap-2 border-t border-border pt-5">
                <a
                  href={brand.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-muted hover:bg-background hover:text-foreground"
                  aria-label="Instagram"
                >
                  <Icons.Instagram className="h-5 w-5" />
                </a>
                <a
                  href={brand.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-muted hover:bg-background hover:text-foreground"
                  aria-label="Facebook"
                >
                  <Icons.Facebook className="h-5 w-5" />
                </a>
                <a
                  href={brand.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-muted hover:bg-background hover:text-foreground"
                  aria-label="YouTube"
                >
                  <Icons.Youtube className="h-5 w-5" />
                </a>
              </div>
            </Card>

            <div className="aspect-[16/9] overflow-hidden rounded-xl">
              <PropertyImage src={brandImages.map} alt="Office location map" className="rounded-xl" />
            </div>
          </div>

          <Card>
            <h2 className="font-serif text-xl">Request a callback</h2>
            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                showToast("Consultation request received (demo)!", "success");
              }}
            >
              <Input label="Name" placeholder="Your name" required />
              <Input label="Phone" type="tel" placeholder="+91" required />
              <Input label="Email" type="email" placeholder="you@example.com" />
              <div>
                <p className="mb-1.5 text-sm font-medium">I&apos;m interested in</p>
                <Select
                  aria-label="I'm interested in"
                  name="interest"
                  required
                  value={interest}
                  onChange={setInterest}
                  options={enquiryInterests.map((item) => ({
                    value: item.value,
                    label: item.label,
                  }))}
                />
              </div>
              <Input label="Budget / expected price" placeholder="e.g. ₹1.5 Cr or ₹30,000/mo" />
              <Input label="Preferred locality" placeholder="e.g. Fateh Sagar, Old City" />
              <Textarea
                label="Message"
                placeholder="Configuration, timeline, or any specifics"
                rows={4}
              />
              <Button type="submit" fullWidth>
                Book consultation
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
