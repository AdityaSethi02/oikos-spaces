import { LoadingSkeleton } from "@/components/feedback/empty-state";

export function PageLoading({ label = "Loading" }: { label?: string }) {
  return (
    <div className="container-page section-padding" aria-busy="true" aria-label={label}>
      <LoadingSkeleton className="h-8 w-48" />
      <LoadingSkeleton className="mt-4 h-4 w-72" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <LoadingSkeleton className="h-40" />
        <LoadingSkeleton className="h-40" />
      </div>
    </div>
  );
}
