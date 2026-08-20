import { listAdminReviews } from "@/server/services/review.service";
import { AdminTablePageSkeleton } from "@/components/feedback/data-skeletons";
import { AdminReviewsClient } from "./reviews-client";
import { isDatabaseConfigured } from "@/lib/env";

export const metadata = { title: "Reviews" };

export default async function AdminReviewsPage() {
  if (!isDatabaseConfigured) {
    return <AdminTablePageSkeleton />;
  }

  const reviews = await listAdminReviews();
  return <AdminReviewsClient reviews={reviews} />;
}
