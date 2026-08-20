import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-stone-200/80", className)}
      aria-hidden
    />
  );
}

export function PageHeaderSkeleton({ subtitle = true }: { subtitle?: boolean }) {
  return (
    <div className="space-y-2">
      <Skeleton className="h-9 w-48 sm:w-64" />
      {subtitle && <Skeleton className="h-4 w-32" />}
    </div>
  );
}

export function AdminDashboardSkeleton() {
  return (
    <div>
      <PageHeaderSkeleton />
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <div className="mt-10 space-y-4">
        <Skeleton className="h-7 w-44" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function AdminTablePageSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div>
      <PageHeaderSkeleton />
      <Skeleton className="mt-8 h-[420px] w-full rounded-xl" />
      <div className="mt-4 space-y-3 lg:hidden">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function PropertyGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-xl border border-border bg-surface">
          <Skeleton className="aspect-[4/3] w-full rounded-none" />
          <div className="space-y-3 p-4">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PropertyCarouselSkeleton() {
  return (
    <div className="mt-8 flex gap-4 overflow-hidden">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="w-[min(100%,320px)] shrink-0 overflow-hidden rounded-xl border border-border bg-surface">
          <Skeleton className="aspect-[4/3] w-full rounded-none" />
          <div className="space-y-2 p-4">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function StaysPageSkeleton() {
  return (
    <div className="section-padding">
      <div className="container-page">
        <PageHeaderSkeleton />
        <Skeleton className="mt-8 h-14 w-full rounded-xl" />
        <div className="mt-8">
          <PropertyGridSkeleton count={3} />
        </div>
      </div>
    </div>
  );
}

export function PropertyDetailSkeleton() {
  return (
    <div className="pb-24 lg:pb-12">
      <div className="container-page py-6 space-y-4">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-10 w-2/3 max-w-lg" />
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="container-page">
        <Skeleton className="h-[420px] w-full rounded-xl" />
      </div>
      <div className="container-page mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-8">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function BookingsListSkeleton() {
  return (
    <div className="section-padding">
      <div className="container-page">
        <PageHeaderSkeleton />
        <div className="mt-8 flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-full" />
          ))}
        </div>
        <div className="mt-8 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-36 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function BookingDetailSkeleton() {
  return (
    <div className="section-padding">
      <div className="container-page max-w-4xl space-y-6">
        <Skeleton className="h-4 w-28" />
        <div className="flex gap-3">
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <Skeleton className="h-44 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-52 w-full rounded-xl" />
            <Skeleton className="h-11 w-full rounded-lg" />
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function MessagesPageSkeleton() {
  return (
    <div className="section-padding">
      <div className="container-page">
        <PageHeaderSkeleton subtitle={false} />
        <Skeleton className="mt-8 h-[calc(100vh-280px)] min-h-[400px] w-full rounded-xl" />
      </div>
    </div>
  );
}

export function AdminPropertyListSkeleton() {
  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeaderSkeleton />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
      <div className="mt-8 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function AdminPropertyEditSkeleton() {
  return (
    <div className="space-y-8">
      <PageHeaderSkeleton />
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-48 w-full rounded-xl" />
      ))}
    </div>
  );
}

export function AdminGuestDetailSkeleton() {
  return (
    <div>
      <Skeleton className="h-4 w-20" />
      <Skeleton className="mt-4 h-9 w-48" />
      <Skeleton className="mt-2 h-4 w-64" />
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-52 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function CalendarPageSkeleton() {
  return (
    <div>
      <PageHeaderSkeleton />
      <Skeleton className="mt-8 h-[560px] w-full rounded-xl" />
    </div>
  );
}

export function SettingsPageSkeleton() {
  return (
    <div>
      <PageHeaderSkeleton />
      <div className="mt-8 space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-56 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function BookingFlowSkeleton() {
  return (
    <div className="section-padding">
      <div className="container-page max-w-5xl">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-4 h-9 w-64" />
        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <Skeleton className="h-96 w-full rounded-xl" />
          <Skeleton className="h-72 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function ReviewsSectionSkeleton() {
  return (
    <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-40 w-full rounded-xl" />
      ))}
    </div>
  );
}
