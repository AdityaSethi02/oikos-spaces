import Link from "next/link";
import { getAdminPropertyById } from "@/server/services/property.service";
import { listPricingRulesForProperty } from "@/server/services/pricing-rule.service";
import { AdminPropertyEditSkeleton } from "@/components/feedback/data-skeletons";
import { PropertyEditForm } from "./property-edit-form";
import { isDatabaseConfigured } from "@/lib/env";

export const metadata = { title: "Edit property" };
export const dynamic = "force-dynamic";

export default async function AdminPropertyEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!isDatabaseConfigured) {
    return <AdminPropertyEditSkeleton />;
  }

  const { id } = await params;
  const [property, pricingRules] = await Promise.all([
    getAdminPropertyById(id),
    listPricingRulesForProperty(id).catch(() => []),
  ]);

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

  return <PropertyEditForm property={property} pricingRules={pricingRules} />;
}
