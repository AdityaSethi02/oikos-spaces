import {
  listAvailablePublicProperties,
  listPublicProperties,
} from "@/server/services/property.service";
import { StaysPageSkeleton } from "@/components/feedback/data-skeletons";
import { StaysBrowser } from "./stays-browser";
import { isDatabaseConfigured } from "@/lib/env";

export const metadata = { title: "Stays" };

export default async function StaysPage({
  searchParams,
}: {
  searchParams: Promise<{ checkIn?: string; checkOut?: string; guests?: string }>;
}) {
  if (!isDatabaseConfigured) {
    return <StaysPageSkeleton />;
  }

  const params = await searchParams;
  const properties = await listPublicProperties();
  const hasDateFilter = Boolean(params.checkIn && params.checkOut);
  const available = hasDateFilter
    ? await listAvailablePublicProperties({
        checkIn: params.checkIn!,
        checkOut: params.checkOut!,
      })
    : properties;

  return (
    <StaysBrowser
      properties={properties}
      availableIds={available.map((property) => property.id)}
      hasDateFilter={hasDateFilter}
    />
  );
}
