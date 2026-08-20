"use client";

import Link from "next/link";
import { useState } from "react";
import { PropertyMediaManager } from "@/components/admin/property-media-manager";
import { PricingRulesClient } from "@/app/admin/properties/[id]/pricing-rules-client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Amenity } from "@/server/dto/domain.dto";
import type { AdminPropertyDto } from "@/server/dto/public.dto";
import { parseHouseRulesMeta } from "@/lib/house-rules";
import { useToast } from "@/components/providers/toast-provider";
import { updatePropertyAction } from "@/app/actions/property.actions";
import type { PricingRuleRow } from "@/app/admin/properties/[id]/pricing-rules-client";

const allAmenities: Amenity[] = [
  "Wi-Fi", "Kitchen", "Parking", "TV", "Workspace", "Balcony",
  "Air conditioning", "Hot water", "Self check-in", "Washing machine", "Garden", "Rooftop terrace",
];

export function PropertyEditForm({
  property,
  pricingRules,
}: {
  property: AdminPropertyDto;
  pricingRules: PricingRuleRow[];
}) {
  const { showToast } = useToast();
  const [selectedAmenities, setSelectedAmenities] = useState(property.amenities);
  const [saving, setSaving] = useState(false);
  const rulesMeta = parseHouseRulesMeta(property.houseRules);

  return (
    <div>
      <Link href="/admin/properties" className="text-sm text-muted hover:text-foreground">
        ← Properties
      </Link>
      <h1 className="mt-4 font-serif text-2xl sm:text-3xl">Edit {property.name}</h1>

      <form
        className="mt-8 space-y-8"
        action={async (formData) => {
          setSaving(true);
          selectedAmenities.forEach((amenity) => formData.append("amenities", amenity));
          const result = await updatePropertyAction(formData);
          setSaving(false);
          if (result.ok) showToast("Property saved", "success");
          else showToast(result.error, "error");
        }}
      >
        <input type="hidden" name="id" value={property.id} />
        <Card>
          <h2 className="font-serif text-lg">Basic information</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input label="Name" name="name" defaultValue={property.name} />
            <Input label="Location" name="location" defaultValue={property.location} />
            <Input label="Address" name="address" defaultValue={property.address} className="sm:col-span-2" />
            <Input label="Property type" name="type" defaultValue={property.type} />
          </div>
          <div className="mt-4">
            <Textarea label="Description" name="about" defaultValue={property.about} rows={4} />
          </div>
        </Card>

        <Card>
          <h2 className="font-serif text-lg">Location coordinates</h2>
          <p className="mt-1 text-sm text-muted">
            Used for the map on the public property page. Find coordinates in Google Maps (right-click → copy).
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input
              label="Latitude"
              name="latitude"
              type="number"
              step="any"
              defaultValue={property.latitude != null ? String(property.latitude) : ""}
              placeholder="24.5854"
            />
            <Input
              label="Longitude"
              name="longitude"
              type="number"
              step="any"
              defaultValue={property.longitude != null ? String(property.longitude) : ""}
              placeholder="73.7125"
            />
          </div>
        </Card>

        <Card>
          <h2 className="font-serif text-lg">Capacity</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Input label="Guests" name="guests" type="number" defaultValue={String(property.guests)} />
            <Input label="Bedrooms" name="bedrooms" type="number" defaultValue={String(property.bedrooms)} />
            <Input label="Beds" name="beds" type="number" defaultValue={String(property.beds)} />
            <Input label="Bathrooms" name="bathrooms" type="number" defaultValue={String(property.bathrooms)} />
          </div>
        </Card>

        <Card>
          <h2 className="font-serif text-lg">Pricing</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Input label="Base price/night" name="basePriceRupees" type="number" defaultValue={String(property.pricePerNight)} />
            <Input label="Weekend price" name="weekendPriceRupees" type="number" defaultValue={String(property.weekendPrice)} />
            <Input label="Cleaning fee" name="cleaningFeeRupees" type="number" defaultValue={String(property.cleaningFee)} />
          </div>
        </Card>

        <PricingRulesClient propertyId={property.id} rules={pricingRules} />

        <Card>
          <h2 className="font-serif text-lg">Amenities</h2>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {allAmenities.map((a) => (
              <label key={a} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedAmenities.includes(a)}
                  onChange={() =>
                    setSelectedAmenities((prev) =>
                      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
                    )
                  }
                  className="rounded"
                />
                {a}
              </label>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-serif text-lg">House rules</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input label="Check-in" name="checkInTime" defaultValue={property.checkIn} />
            <Input label="Check-out" name="checkOutTime" defaultValue={property.checkOut} />
            <Input label="Quiet hours" name="quietHours" defaultValue={rulesMeta.quietHours} className="sm:col-span-2" />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="allowSmoking" defaultChecked={rulesMeta.allowSmoking} className="rounded" />
              Allow smoking indoors
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="allowPets" defaultChecked={rulesMeta.allowPets} className="rounded" />
              Allow pets
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="allowParties" defaultChecked={rulesMeta.allowParties} className="rounded" />
              Allow parties / events
            </label>
          </div>
          <div className="mt-4">
            <Textarea
              label="Additional rules (one per line)"
              name="customHouseRules"
              defaultValue={rulesMeta.customRules}
              rows={3}
            />
          </div>
        </Card>

        <Card>
          <h2 className="font-serif text-lg">Guest access (private)</h2>
          <p className="mt-1 text-sm text-muted">
            Shown to guests only after booking is confirmed.
          </p>
          <div className="mt-4 space-y-4">
            <Textarea
              label="Arrival instructions"
              name="arrivalInstructions"
              defaultValue={property.arrivalInstructions ?? ""}
              rows={3}
            />
            <Textarea
              label="Access instructions (door code, keys, etc.)"
              name="accessInstructions"
              defaultValue={property.accessInstructions ?? ""}
              rows={3}
            />
            <Textarea
              label="Parking instructions"
              name="parkingInstructions"
              defaultValue={property.parkingInstructions ?? ""}
              rows={2}
            />
            <Input
              label="Host contact phone"
              name="contactPhone"
              defaultValue={property.contactPhone ?? ""}
              placeholder="+91"
            />
          </div>
        </Card>

        <Card>
          <h2 className="font-serif text-lg">Media</h2>
          <PropertyMediaManager propertyId={property.id} media={property.media} />
        </Card>

        <Card>
          <h2 className="font-serif text-lg">Availability</h2>
          <p className="mt-2 text-sm text-muted">Use the host calendar to block dates or review occupancy.</p>
          <ButtonLink href="/admin/calendar" variant="outline" size="sm" className="mt-4">
            Open calendar
          </ButtonLink>
        </Card>

        <Card>
          <h2 className="font-serif text-lg">Cancellation policy</h2>
          <Textarea className="mt-4" label="Policy text" name="cancellationPolicyText" defaultValue={property.cancellationPolicy} rows={4} />
        </Card>

        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </div>
  );
}
