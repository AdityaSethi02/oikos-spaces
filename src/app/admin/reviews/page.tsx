"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { reviews } from "@/data/mock/reviews";
import { properties } from "@/data/mock/properties";
import { StarRating } from "@/components/property/property-meta";
import { useToast } from "@/components/providers/toast-provider";

export default function AdminReviewsPage() {
  const [localReviews, setLocalReviews] = useState(reviews);
  const { showToast } = useToast();

  const togglePublish = (id: string) => {
    setLocalReviews((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, published: !r.published } : r,
      ),
    );
    showToast("Review updated (demo)", "success");
  };

  return (
    <div>
      <h1 className="font-serif text-2xl sm:text-3xl">Reviews</h1>
      <p className="mt-1 text-sm text-muted">{localReviews.length} reviews</p>

      <div className="mt-8 space-y-4">
        {localReviews.map((review) => {
          const property = properties.find((p) => p.id === review.propertyId);
          return (
            <div
              key={review.id}
              className="rounded-xl border border-border bg-surface p-5"
            >
              <div className="flex flex-wrap items-center gap-3">
                <StarRating rating={review.rating} />
                <Badge variant={review.published ? "success" : "neutral"}>
                  {review.published ? "Published" : "Unpublished"}
                </Badge>
              </div>
              <p className="mt-3 text-sm leading-relaxed">{review.comment}</p>
              <p className="mt-3 text-sm text-muted">
                — {review.guestName} · {property?.name} · {review.date}
              </p>
              {review.response && (
                <p className="mt-3 rounded-lg bg-background p-3 text-sm text-muted">
                  Response: {review.response}
                </p>
              )}
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => togglePublish(review.id)}
                >
                  {review.published ? "Unpublish" : "Publish"}
                </Button>
                <Button variant="ghost" size="sm">
                  Respond
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
