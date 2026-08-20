import crypto from "crypto";
import { env, isMuxConfigured } from "@/lib/env";
import { finalizeMuxVideoByUploadId } from "@/server/services/media.service";

export const dynamic = "force-dynamic";

type MuxWebhookEvent = {
  type?: string;
  data?: {
    id?: string;
    upload_id?: string;
  };
};

function verifyMuxSignature(rawBody: string, signatureHeader: string | null): boolean {
  if (!env.MUX_WEBHOOK_SECRET || !signatureHeader) return false;

  const parts = Object.fromEntries(
    signatureHeader.split(",").map((part) => {
      const [key, value] = part.split("=");
      return [key, value];
    }),
  );
  const timestamp = parts.t;
  const signature = parts.v1;
  if (!timestamp || !signature) return false;

  const signedPayload = `${timestamp}.${rawBody}`;
  const expected = crypto
    .createHmac("sha256", env.MUX_WEBHOOK_SECRET)
    .update(signedPayload)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  if (!isMuxConfigured) {
    return new Response("Mux not configured", { status: 503 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("mux-signature");

  if (env.MUX_WEBHOOK_SECRET && !verifyMuxSignature(rawBody, signature)) {
    return new Response("Invalid signature", { status: 400 });
  }

  let event: MuxWebhookEvent;
  try {
    event = JSON.parse(rawBody) as MuxWebhookEvent;
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  if (event.type === "video.asset.ready" || event.type === "video.upload.asset_created") {
    const uploadId = event.data?.upload_id ?? event.data?.id;
    if (uploadId) {
      try {
        await finalizeMuxVideoByUploadId(uploadId);
      } catch (error) {
        console.error("[mux webhook]", error);
      }
    }
  }

  return new Response("OK", { status: 200 });
}
