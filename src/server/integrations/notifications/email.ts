import { env, isResendConfigured } from "@/lib/env";

export async function sendEmail(input: {
  to: string;
  subject: string;
  text: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isResendConfigured) {
    console.info("[email:log]", input.to, input.subject);
    return { ok: true };
  }

  const from = env.RESEND_FROM_EMAIL ?? "OIKOS Spaces <hello@oikosspaces.com>";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [input.to],
      subject: input.subject,
      text: input.text,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    return { ok: false, error: body.slice(0, 500) };
  }
  return { ok: true };
}
