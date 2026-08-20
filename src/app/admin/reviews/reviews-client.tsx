"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/property/property-meta";
import { useToast } from "@/components/providers/toast-provider";
import { moderateReviewAction } from "@/app/actions/review.actions";
import type { AdminReviewRow } from "@/server/services/review.service";

export function AdminReviewsClient({ reviews }: { reviews: AdminReviewRow[] }) {
  const { showToast } = useToast();
  const router = useRouter();
  const [respondId, setRespondId] = useState<string | null>(null);
  const [response, setResponse] = useState("");
  const selected = reviews.find((review) => review.id === respondId);

  return (
    <div>
      <h1 className="font-serif text-2xl sm:text-3xl">Reviews</h1>
      <p className="mt-1 text-sm text-muted">{reviews.length} reviews</p>

      <div className="mt-8 space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-xl border border-border bg-surface p-5">
            <div className="flex flex-wrap items-center gap-3">
              <StarRating rating={review.rating} />
              <Badge variant={review.published ? "success" : "neutral"}>
                {review.published ? "Published" : "Unpublished"}
              </Badge>
            </div>
            <p className="mt-3 text-sm leading-relaxed">{review.comment}</p>
            <p className="mt-3 text-sm text-muted">
              — {review.guestName} · {review.propertyName} · {review.date}
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
                onClick={async () => {
                  const result = await moderateReviewAction({
                    reviewId: review.id,
                    published: !review.published,
                  });
                  if (result.ok) {
                    showToast("Review updated", "success");
                    router.refresh();
                  } else {
                    showToast(result.error, "error");
                  }
                }}
              >
                {review.published ? "Unpublish" : "Publish"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setRespondId(review.id);
                  setResponse(review.response ?? "");
                }}
              >
                Respond
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!respondId} onClose={() => setRespondId(null)} title="Respond to review">
        <form
          className="space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            if (!selected) return;
            const result = await moderateReviewAction({
              reviewId: selected.id,
              response,
            });
            if (result.ok) {
              showToast("Response saved", "success");
              setRespondId(null);
              router.refresh();
            } else {
              showToast(result.error, "error");
            }
          }}
        >
          <Textarea label="Response" value={response} onChange={(e) => setResponse(e.target.value)} rows={4} />
          <Button type="submit" fullWidth>
            Save response
          </Button>
        </form>
      </Modal>
    </div>
  );
}
