"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ImagePlaceholder } from "@/components/media/image-placeholder";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getPropertyById, type Amenity } from "@/data/mock/properties";
import { useToast } from "@/components/providers/toast-provider";

const allAmenities: Amenity[] = [
  "Wi-Fi", "Kitchen", "Parking", "TV", "Workspace", "Balcony",
  "Air conditioning", "Hot water", "Self check-in", "Washing machine", "Garden", "Rooftop terrace",
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
            <Input label="Location" defaultValue={property.location} />
            <Input label="Address" defaultValue={property.address} className="sm:col-span-2" />
            <Input label="Property type" defaultValue={property.type} />
          </div>
          <div className="mt-4">
            <Textarea label="Description" defaultValue={property.about} rows={4} />
          </div>
        </Card>

        <Card>
          <h2 className="font-serif text-lg">Capacity</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Input label="Guests" type="number" defaultValue={String(property.guests)} />
            <Input label="Bedrooms" type="number" defaultValue={String(property.bedrooms)} />
            <Input label="Beds" type="number" defaultValue={String(property.beds)} />
            <Input label="Bathrooms" type="number" defaultValue={String(property.bathrooms)} />
          </div>
        </Card>

        <Card>
          <h2 className="font-serif text-lg">Pricing</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Input label="Base price/night" type="number" defaultValue={String(property.pricePerNight)} />
            <Input label="Weekend price" type="number" defaultValue={String(property.weekendPrice)} />
            <Input label="Seasonal price (demo)" type="number" placeholder="Optional" />
            <Input label="Cleaning fee" type="number" defaultValue={String(property.cleaningFee)} />
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
          <h2 className="font-serif text-lg">House rules</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input label="Check-in" defaultValue={property.checkIn} />
            <Input label="Check-out" defaultValue={property.checkOut} />
            <Input label="Quiet hours" defaultValue="10:00 PM – 8:00 AM" />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {["Smoking indoors", "Pets", "Parties / events"].map((rule) => (
              <label key={rule} className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded" />
                Allow {rule.toLowerCase()}
              </label>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-serif text-lg">Media</h2>
          <p className="mt-2 text-sm text-muted">Drag photos here to add (demo — files are not uploaded)</p>
          <div
            className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              showToast("Media added (demo)", "success");
            }}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <ImagePlaceholder key={i} variant="gallery-sm" />
            ))}
            <div className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-border text-sm text-muted">
              + Add photo
            </div>
            <ImagePlaceholder variant="video" className="aspect-square" label="Video" />
          </div>
        </Card>

        <Card>
          <h2 className="font-serif text-lg">Availability</h2>
          <p className="mt-2 text-sm text-muted">Use the host calendar to block dates or review occupancy.</p>
          <Link href="/admin/calendar" className="mt-4 inline-block">
            <Button variant="outline" size="sm">Open calendar</Button>
          </Link>
        </Card>

        <Card>
          <h2 className="font-serif text-lg">Cancellation policy</h2>
          <select className="search-input mt-4" defaultValue="flexible">
            <option value="flexible">Flexible (demo)</option>
            <option value="moderate">Moderate (demo)</option>
            <option value="strict">Strict (demo)</option>
          </select>
          <Textarea className="mt-4" label="Policy notes" defaultValue={property.cancellationPolicy} rows={3} />
        </Card>

        <Button
          onClick={() => showToast("Property saved (demo)", "success")}
        >
          Save changes
        </Button>
      </div>
    </div>
  );
}
