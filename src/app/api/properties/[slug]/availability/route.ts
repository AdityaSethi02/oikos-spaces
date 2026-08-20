import { NextRequest } from "next/server";
import { AppError } from "@/server/errors";
import { addDays, formatDateOnly } from "@/server/lib/dates";
import { getPublicPropertyBySlug } from "@/server/services/property.service";
import { getUnavailableDates } from "@/server/services/availability.service";
import { propertyRepository } from "@/server/repositories/property.repository";
import { isDatabaseConfigured } from "@/lib/env";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(req: NextRequest, context: RouteContext) {
  if (!isDatabaseConfigured) {
    return Response.json({ unavailableDates: [] });
  }

  const { slug } = await context.params;
  const property = await getPublicPropertyBySlug(slug);
  if (!property) {
    return Response.json({ error: "Property not found" }, { status: 404 });
  }

  const url = req.nextUrl;
  const from = url.searchParams.get("from") ?? formatDateOnly(new Date());
  const to = url.searchParams.get("to") ?? addDays(from, 180);

  try {
    const row = await propertyRepository.findActiveBySlug(slug);
    if (!row) {
      return Response.json({ error: "Property not found" }, { status: 404 });
    }
    const unavailableDates = await getUnavailableDates(row.id, from, to);
    return Response.json({ unavailableDates });
  } catch (error) {
    if (error instanceof AppError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    return Response.json({ error: "Failed to load availability" }, { status: 500 });
  }
}
