"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { brand } from "@/lib/brand";
import { useToast } from "@/components/providers/toast-provider";

const sections = [
  { id: "profile", title: "Profile", fields: ["Name", "Email", "Phone"] },
  { id: "business", title: "Business information", fields: ["Business name", "Address", "GST number"] },
  { id: "notifications", title: "Notification preferences", fields: ["Email notifications", "WhatsApp alerts", "Booking reminders"] },
  { id: "booking", title: "Booking settings", fields: ["Minimum stay", "Advance booking window", "Auto-confirm"] },
  { id: "cancellation", title: "Cancellation policy", fields: ["Default policy", "Refund rules"] },
  { id: "payment", title: "Payment settings", fields: ["Razorpay keys (placeholder)", "Direct payment instructions"] },
  { id: "calendar", title: "Calendar integrations", fields: ["iCal sync", "Google Calendar"] },
  { id: "messaging", title: "WhatsApp / Email", fields: ["WhatsApp number", "SMTP settings"] },
  { id: "security", title: "Security", fields: ["Two-factor auth", "Session management"] },
  { id: "access", title: "Admin access", fields: ["Invite admin email", "Role"] },
];

export default function AdminSettingsPage() {
  const { showToast } = useToast();

  return (
    <div>
      <h1 className="font-serif text-2xl sm:text-3xl">Settings</h1>
      <p className="mt-1 text-sm text-muted">Manage your account and business preferences</p>

      <div className="mt-8 space-y-6">
        {sections.map((section) => (
          <Card key={section.id}>
            <h2 className="font-serif text-lg">{section.title}</h2>
            <div className="mt-4 space-y-4">
              {section.fields.map((field) => (
                <div key={field}>
                  {field.includes("policy") || field.includes("instructions") ? (
                    <Textarea label={field} placeholder={`Enter ${field.toLowerCase()}…`} rows={3} />
                  ) : field.includes("notifications") || field.includes("auth") || field.includes("Auto") ? (
                    <label className="flex items-center gap-3 text-sm">
                      <input type="checkbox" defaultChecked className="rounded" />
                      {field}
                    </label>
                  ) : (
                    <Input
                      label={field}
                      placeholder={`Enter ${field.toLowerCase()}…`}
                      defaultValue={
                        field === "Business name"
                          ? brand.name
                          : field === "Email"
                            ? brand.contact.email
                            : field === "Razorpay keys (placeholder)"
                              ? "Configured later — not stored in this demo"
                              : field === "Role"
                                ? "Host / admin"
                                : undefined
                      }
                      disabled={field.includes("Razorpay")}
                    />
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))}

        <Button onClick={() => showToast("Settings saved (demo)", "success")}>
          Save all settings
        </Button>
      </div>
    </div>
  );
}
