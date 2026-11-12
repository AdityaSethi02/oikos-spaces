"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ImagePlaceholder } from "@/components/media/image-placeholder";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getPropertyById, type Amenity } from "@/data/mock/properties";
import { useToast } from "@/components/providers/toast-provider";

const allAmenities: Amenity[] = [
  "Parking",
  "Lift",
  "Power backup",
  "Gated community",
  "Security",
  "Garden",
  "Balcony",
  "Air conditioning",
  "Modular kitchen",
  "Servant room",
  "Clubhouse",
  "Swimming pool",
  "Wi-Fi",
  "Furnished",
];

export default function AdminPropertyEditPage() {
  const params = useParams();
  const property = getPropertyById(params.id as string);
  const { showToast } = useToast();
  const [selectedAmenities, setSelectedAmenities] = useState(property?.amenities || []);

  if (!property) {
    return (
      <div className="text-center">
        <p>Property not found</p>
        <Link href="/admin/properties" className="mt-4 text-accent hover:underline">
          Back to properties
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/admin/properties" className="text-sm text-muted hover:text-foreground">
        ← Properties
      </Link>
      <h1 className="mt-4 font-serif text-2xl sm:text-3xl">Edit {property.name}</h1>

      <div className="mt-8 space-y-8">
        <Card>
          <h2 className="font-serif text-lg">Basic information</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input label="Name" defaultValue={property.name} />
            <Input label="Locality" defaultValue={property.locality} />
            <Input label="Location" defaultValue={property.location} />
            <Input label="Status" defaultValue={property.status} />
            <Input label="Property type" defaultValue={property.type} />
            <Input label="Address" defaultValue={property.address} className="sm:col-span-2" />
          </div>
          <div className="mt-4">
            <Textarea label="Description" defaultValue={property.about} rows={4} />
          </div>
        </Card>

        <Card>
          <h2 className="font-serif text-lg">Specs & pricing</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Input label="Bedrooms" type="number" defaultValue={String(property.bedrooms)} />
            <Input label="Bathrooms" type="number" defaultValue={String(property.bathrooms)} />
            <Input label="Area (sq.ft)" type="number" defaultValue={String(property.areaSqFt)} />
            <Input label="Price (INR)" type="number" defaultValue={String(property.price)} />
            <Input label="Price label" defaultValue={property.priceLabel} className="sm:col-span-2" />
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
          <h2 className="font-serif text-lg">Gallery</h2>
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {Array.from({ length: Math.min(property.galleryCount, 8) }).map((_, i) => (
              <ImagePlaceholder key={i} variant="gallery-sm" seed={i} className="rounded-lg" />
            ))}
          </div>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button onClick={() => showToast("Listing saved (demo).", "success")}>Save changes</Button>
          <ButtonLink href={`/properties/${property.slug}`} variant="outline">
            View public listing
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
