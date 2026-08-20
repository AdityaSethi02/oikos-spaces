import { env, isWhatsAppConfigured } from "@/lib/env";

export async function sendWhatsApp(input: {
  to: string;
  text: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isWhatsAppConfigured) {
    console.info("[whatsapp:log]", input.to, input.text.slice(0, 120));
    return { ok: true };
  }

  const response = await fetch(
    `https://graph.facebook.com/v21.0/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.WHATSAPP_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: input.to.replace(/\D/g, ""),
        type: "text",
        text: { body: input.text },
      }),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    return { ok: false, error: body.slice(0, 500) };
  }
  return { ok: true };
}
