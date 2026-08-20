import { createClient } from "@supabase/supabase-js";
import { env, isRealtimeConfigured } from "@/lib/env";

function getServiceClient() {
  if (!isRealtimeConfigured || !env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

export async function broadcastConversationMessage(
  conversationId: string,
  payload: unknown,
) {
  const client = getServiceClient();
  if (!client) return;
  await client.channel(`conversation:${conversationId}`).send({
    type: "broadcast",
    event: "message",
    payload,
  });
}
