"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { brand } from "@/lib/brand";
import { useToast } from "@/components/providers/toast-provider";
import { submitContactAction } from "@/app/actions/contact.actions";

export default function ContactPage() {
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="section-padding">
      <div className="container-page">
        <h1 className="font-serif text-3xl sm:text-4xl">Contact us</h1>
        <p className="mt-2 text-muted">
          We&apos;d love to hear from you. Reach out for bookings, questions, or collaborations.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <Card>
            <h2 className="font-serif text-xl">Get in touch</h2>
            <dl className="mt-6 space-y-4 text-sm">
              <div>
                <dt className="text-muted">Email</dt>
                <dd className="mt-1 font-medium">{brand.contact.email}</dd>
              </div>
              <div>
                <dt className="text-muted">Phone</dt>
                <dd className="mt-1 font-medium">{brand.contact.phone}</dd>
              </div>
              <div>
                <dt className="text-muted">WhatsApp</dt>
                <dd className="mt-1">
                  <a
                    href={`https://wa.me/${brand.contact.whatsapp.replace(/\D/g, "")}`}
                    className="font-medium text-accent hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Message on WhatsApp
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-muted">Location</dt>
                <dd className="mt-1 font-medium">{brand.contact.address}</dd>
              </div>
            </dl>
          </Card>

          <Card>
            <h2 className="font-serif text-xl">Send a message</h2>
            <form
              className="mt-6 space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                setSubmitting(true);
                const formData = new FormData(e.currentTarget);
                const result = await submitContactAction(formData);
                setSubmitting(false);
                if (result.ok) {
                  showToast("Message sent. We'll get back to you soon.", "success");
                  e.currentTarget.reset();
                } else {
                  showToast(result.error, "error");
                }
              }}
            >
              <Input label="Name" name="name" placeholder="Your name" required />
              <Input label="Email" name="email" type="email" placeholder="you@example.com" required />
              <Input label="Phone" name="phone" type="tel" placeholder="+91" />
              <Textarea label="Message" name="message" placeholder="How can we help?" required rows={5} />
              <Button type="submit" fullWidth disabled={submitting}>
                {submitting ? "Sending…" : "Send message"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
