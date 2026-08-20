"use client";

import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { brand } from "@/lib/brand";
import { useToast } from "@/components/providers/toast-provider";
import { saveHostSettingsAction, saveIcalImportAction } from "@/app/actions/settings.actions";

const placeholderSections = [
  { id: "profile", title: "Profile", fields: ["Name", "Email", "Phone"] },
  { id: "business", title: "Business information", fields: ["Business name", "Address", "GST number"] },
  { id: "booking", title: "Booking settings", fields: ["Minimum stay", "Advance booking window", "Auto-confirm"] },
  { id: "cancellation", title: "Cancellation policy", fields: ["Default policy"] },
  { id: "payment", title: "Payment settings", fields: ["Razorpay keys (placeholder)"] },
  { id: "security", title: "Security", fields: ["Two-factor auth", "Session management"] },
  { id: "access", title: "Admin access", fields: ["Invite admin email", "Role"] },
];

type HostSettings = {
  emailNotifications: boolean;
  whatsappAlerts: boolean;
  bookingReminders: boolean;
  whatsappNumber: string | null;
  directPaymentInstructions: string | null;
};

type CalendarSettings = {
  googleConfigured: boolean;
  properties: Array<{
    id: string;
    name: string;
    slug: string;
    exportUrl: string | null;
    importUrl: string | null;
    googleConnected: boolean;
    lastSyncedAt: string | null;
    lastError: string | null;
  }>;
};

export function AdminSettingsClient({
  hostSettings,
  calendar,
}: {
  hostSettings: HostSettings;
  calendar: CalendarSettings;
}) {
  const { showToast } = useToast();
  const router = useRouter();

  return (
    <div>
      <h1 className="font-serif text-2xl sm:text-3xl">Settings</h1>
      <p className="mt-1 text-sm text-muted">Manage your account and business preferences</p>

      <form
        className="mt-8 space-y-6"
        action={async (formData) => {
          const result = await saveHostSettingsAction(formData);
          if (result.ok) {
            showToast("Settings saved", "success");
            router.refresh();
          } else {
            showToast(result.error, "error");
          }
        }}
      >
        <Card>
          <h2 className="font-serif text-lg">Notification preferences</h2>
          <div className="mt-4 space-y-4">
            <label className="flex items-center gap-3 text-sm">
              <input type="checkbox" name="emailNotifications" defaultChecked={hostSettings.emailNotifications} className="rounded" />
              Email notifications
            </label>
            <label className="flex items-center gap-3 text-sm">
              <input type="checkbox" name="whatsappAlerts" defaultChecked={hostSettings.whatsappAlerts} className="rounded" />
              WhatsApp alerts
            </label>
            <label className="flex items-center gap-3 text-sm">
              <input type="checkbox" name="bookingReminders" defaultChecked={hostSettings.bookingReminders} className="rounded" />
              Booking reminders
            </label>
          </div>
        </Card>

        <Card>
          <h2 className="font-serif text-lg">WhatsApp / Email</h2>
          <div className="mt-4 space-y-4">
            <Input label="WhatsApp number" name="whatsappNumber" defaultValue={hostSettings.whatsappNumber ?? ""} placeholder="Host WhatsApp number" />
          </div>
        </Card>

        <Card>
          <h2 className="font-serif text-lg">Payment settings</h2>
          <div className="mt-4 space-y-4">
            <Textarea
              label="Direct payment instructions"
              name="directPaymentInstructions"
              defaultValue={hostSettings.directPaymentInstructions ?? ""}
              rows={3}
            />
          </div>
        </Card>

        <Button type="submit">Save notification and payment settings</Button>
      </form>

      <div className="mt-8 space-y-6">
        <Card>
          <h2 className="font-serif text-lg">Calendar integrations</h2>
          <p className="mt-2 text-sm text-muted">
            Export an iCal feed per property, import an external iCal URL, or connect Google Calendar.
            External events never overwrite confirmed bookings.
          </p>
          <div className="mt-6 space-y-6">
            {calendar.properties.length === 0 && (
              <p className="text-sm text-muted">Add properties in the database to enable calendar sync.</p>
            )}
            {calendar.properties.map((property) => (
              <div key={property.id} className="rounded-lg border border-border p-4">
                <p className="font-medium">{property.name}</p>
                <p className="mt-2 break-all text-xs text-muted">Export: {property.exportUrl}</p>
                {property.lastError && (
                  <p className="mt-2 text-sm text-error">{property.lastError}</p>
                )}
                <form
                  className="mt-4 space-y-3"
                  action={async (formData) => {
                    formData.set("propertyId", property.id);
                    const result = await saveIcalImportAction(formData);
                    if (result.ok) {
                      showToast("iCal import saved", "success");
                      router.refresh();
                    } else {
                      showToast(result.error, "error");
                    }
                  }}
                >
                  <Input
                    label="iCal import URL"
                    name="importUrl"
                    defaultValue={property.importUrl ?? ""}
                    placeholder="https://…"
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button type="submit" size="sm" variant="outline">
                      Save import URL
                    </Button>
                    {calendar.googleConfigured ? (
                      <ButtonLinkGoogle propertyId={property.id} connected={property.googleConnected} />
                    ) : (
                      <Button type="button" size="sm" variant="ghost" disabled>
                        Google Calendar (add credentials)
                      </Button>
                    )}
                  </div>
                </form>
              </div>
            ))}
          </div>
        </Card>

        {placeholderSections.map((section) => (
          <Card key={section.id}>
            <h2 className="font-serif text-lg">{section.title}</h2>
            <div className="mt-4 space-y-4">
              {section.fields.map((field) => (
                <div key={field}>
                  {field.includes("policy") ? (
                    <Textarea label={field} placeholder={`Enter ${field.toLowerCase()}…`} rows={3} />
                  ) : field.includes("auth") || field.includes("Auto") ? (
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
                              ? "Configured via environment variables"
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
      </div>
    </div>
  );
}

function ButtonLinkGoogle({ propertyId, connected }: { propertyId: string; connected: boolean }) {
  return (
    <a
      href={`/api/integrations/google/start?propertyId=${propertyId}`}
      className="inline-flex min-h-11 items-center rounded-lg border border-border px-3 text-sm"
    >
      {connected ? "Reconnect Google Calendar" : "Connect Google Calendar"}
    </a>
  );
}
