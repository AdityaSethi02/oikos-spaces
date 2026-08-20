import { env } from "@/lib/env";

export function assertCronAuthorized(req: Request): Response | null {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${secret}`) {
      return new Response("Unauthorized", { status: 401 });
    }
    return null;
  }
  if (env.NODE_ENV === "production") {
    return new Response("Cron secret not configured", { status: 503 });
  }
  return null;
}
