"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImagePlaceholder } from "@/components/media/image-placeholder";
import { brand, whatsappLink } from "@/lib/brand";
import { useToast } from "@/components/providers/toast-provider";

export default function ContactPage() {
  const { showToast } = useToast();

  return (
    <div className="section-padding">
      <div className="container-page">
        <h1 className="font-serif text-3xl sm:text-4xl">Contact us</h1>
        <p className="mt-2 text-muted">
          Tell us what you&apos;re looking for — buy, sell, rent or lease. We respond fast.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <h2 className="font-serif text-xl">Get in touch</h2>
              <dl className="mt-6 space-y-4 text-sm">
                <div>
                  <dt className="text-muted">Email</dt>
                  <dd className="mt-1 font-medium">{brand.contact.email}</dd>
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
                  href={whatsappLink("Hi, I'd like a callback about a property.")}
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
            </Card>

            <ImagePlaceholder variant="map" seed={0} label="Office map" />
          </div>

          <Card>
            <h2 className="font-serif text-xl">Request a callback</h2>
            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                showToast("Callback request received (demo)!", "success");
              }}
            >
              <Input label="Name" placeholder="Your name" required />
              <Input label="Phone" type="tel" placeholder="+91" required />
              <Input label="Email" type="email" placeholder="you@example.com" />
              <div>
                <label className="mb-1.5 block text-sm font-medium" htmlFor="intent">
                  I want to
                </label>
                <select id="intent" className="search-input" defaultValue="buy" required>
                  <option value="buy">Buy a property</option>
                  <option value="sell">Sell a property</option>
                  <option value="rent">Rent / lease</option>
                  <option value="other">Something else</option>
                </select>
              </div>
              <Input label="Budget / expected price" placeholder="e.g. ₹1.5 Cr or ₹30,000/mo" />
              <Input label="Preferred locality" placeholder="e.g. Fateh Sagar, Old City" />
              <Textarea
                label="Message"
                placeholder="Configuration, timeline, or any specifics"
                rows={4}
              />
              <Button type="submit" fullWidth>
                Request callback
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
