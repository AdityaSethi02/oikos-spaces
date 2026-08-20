import { listPublicProperties } from "@/server/services/property.service";

export async function GET() {
  const properties = await listPublicProperties();
  return Response.json({ properties });
}
