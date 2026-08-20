import { NextRequest } from "next/server";
import { AppError } from "@/server/errors";
import { isDatabaseConfigured } from "@/lib/env";
import { getStayQuote } from "@/server/services/property.service";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(req: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  const checkIn = req.nextUrl.searchParams.get("checkIn");
  const checkOut = req.nextUrl.searchParams.get("checkOut");
  const guests = Number(req.nextUrl.searchParams.get("guests") ?? 2);

  if (!checkIn || !checkOut) {
    return Response.json({ error: "checkIn and checkOut are required" }, { status: 400 });
  }

  if (!isDatabaseConfigured) {
    return Response.json(null);
  }

  try {
    const quote = await getStayQuote({ slug, checkIn, checkOut, guests });
    return Response.json(quote);
  } catch (error) {
    if (error instanceof AppError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : "Failed to quote stay";
    return Response.json({ error: message }, { status: 400 });
  }
}
