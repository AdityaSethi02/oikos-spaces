import { headers } from "next/headers";
import { Webhook } from "svix";
import { env, isClerkServerConfigured } from "@/lib/env";
import {
  handleClerkUserDeleted,
} from "@/server/services/user.service";
import { syncUserSession } from "@/server/services/auth.service";

type ClerkWebhookEvent = {
  type: string;
  data: {
    id: string;
    email_addresses?: { email_address: string }[];
    first_name?: string | null;
    last_name?: string | null;
    phone_numbers?: { phone_number: string }[];
  };
};

export async function POST(req: Request) {
  if (!isClerkServerConfigured || !env.CLERK_WEBHOOK_SECRET) {
    return new Response("Webhook not configured", { status: 503 });
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.text();
  const wh = new Webhook(env.CLERK_WEBHOOK_SECRET);

  let event: ClerkWebhookEvent;
  try {
    event = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkWebhookEvent;
  } catch {
    return new Response("Invalid webhook signature", { status: 400 });
  }

  try {
    switch (event.type) {
      case "user.created":
      case "user.updated": {
        const email = event.data.email_addresses?.[0]?.email_address;
        if (!email) break;
        await syncUserSession({
          clerkUserId: event.data.id,
          email,
          name: [event.data.first_name, event.data.last_name]
            .filter(Boolean)
            .join(" ")
            .trim() || null,
          phone: event.data.phone_numbers?.[0]?.phone_number ?? null,
          source: "clerk_webhook",
        });
        break;
      }
      case "user.deleted":
        await handleClerkUserDeleted(event.data.id);
        break;
      default:
        break;
    }
  } catch (error) {
    console.error("[clerk webhook]", error);
    return new Response("Webhook handler failed", { status: 500 });
  }

  return new Response("OK", { status: 200 });
}
