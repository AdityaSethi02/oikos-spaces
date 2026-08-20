"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Amenity } from "@/server/dto/domain.dto";
import { useToast } from "@/components/providers/toast-provider";
import { createPropertyAction } from "@/app/actions/property.actions";

const allAmenities: Amenity[] = [
  "Wi-Fi", "Kitchen", "Parking", "TV", "Workspace", "Balcony",
  "Air conditioning", "Hot water", "Self check-in", "Washing machine", "Garden", "Rooftop terrace",
];

const propertyTypes = ["Apartment", "Villa", "Heritage Home"] as const;

export function NewPropertyForm() {
  const { showToast } = useToast();
  const router = useRouter();
  const [selectedAmenities, setSelectedAmenities] = useState<Amenity[]>([]);
  const [saving, setSaving] = useState(false);

  return (
    <div>
      <Link href="/admin/properties" className="text-sm text-muted hover:text-foreground">
        ← Properties
      </Link>
      <h1 className="mt-4 font-serif text-2xl sm:text-3xl">Add property</h1>
      <p className="mt-1 text-sm text-muted">Create a new listing for your portfolio.</p>

      <form
        className="mt-8 space-y-8"
        action={async (formData) => {
          setSaving(true);
          selectedAmenities.forEach((amenity) => formData.append("amenities", amenity));
          const result = await createPropertyAction(formData);
          setSaving(false);
          if (result.ok) {
            showToast("Property created", "success");
            router.push(`/admin/properties/${result.id}`);
          } else {
            showToast(result.error, "error");
          }
        }}
      >
        <Card>
          <h2 className="font-serif text-lg">Basic information</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input label="Name" name="name" required />
            <Input label="Slug (optional)" name="slug" placeholder="auto-generated from name" />
            <Input label="Tagline (optional)" name="tagline" className="sm:col-span-2" />
            <Input label="Location" name="location" required />
            <Input label="Address" name="address" required className="sm:col-span-2" />
            <div>
              <label className="text-sm font-medium" htmlFor="property-type">Property type</label>
              <select id="property-type" name="type" className="search-input mt-1" defaultValue="Apartment">
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <Textarea label="Description" name="description" rows={4} required />
          </div>
        </Card>

        <Card>
          <h2 className="font-serif text-lg">Capacity</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Input label="Guests" name="guests" type="number" defaultValue="2" min={1} required />
            <Input label="Bedrooms" name="bedrooms" type="number" defaultValue="1" min={1} required />
            <Input label="Beds" name="beds" type="number" defaultValue="1" min={1} required />
            <Input label="Bathrooms" name="bathrooms" type="number" defaultValue="1" min={1} required />
          </div>
        </Card>

        <Card>
          <h2 className="font-serif text-lg">Pricing</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Input label="Base price/night (₹)" name="basePriceRupees" type="number" min={0} required />
            <Input label="Weekend price (₹)" name="weekendPriceRupees" type="number" min={0} placeholder="Same as base" />
            <Input label="Cleaning fee (₹)" name="cleaningFeeRupees" type="number" min={0} placeholder="0" />
          </div>
        </Card>

        <Card>
          <h2 className="font-serif text-lg">Amenities</h2>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {allAmenities.map((a) => (
              <label key={a} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedAmenities.includes(a)}
                  onChange={(e) => {
                    setSelectedAmenities((prev) =>
                      e.target.checked ? [...prev, a] : prev.filter((item) => item !== a),
                    );
                  }}
                />
                {a}
              </label>
            ))}
          </div>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "Creating…" : "Create property"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/properties")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
