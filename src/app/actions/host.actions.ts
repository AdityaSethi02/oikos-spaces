"use server";

import { revalidatePath } from "next/cache";
import { actionFail, type ActionResult } from "@/server/schemas/action-result";
import { parseActionInput } from "@/server/schemas/parse-action";
import { addAdminHostSchema, hostAccountIdSchema } from "@/server/schemas/actions.schema";
import { requireAdminHost } from "@/server/policies/auth.policy";
import {
  addAdminHost,
  deactivateAdminHost,
  listAdminHostAccounts,
  reactivateAdminHost,
} from "@/server/services/host-management.service";
import { enforceRateLimit } from "@/server/lib/rate-limit";

export async function addAdminHostAction(input: {
  email: string;
  name?: string;
}): Promise<ActionResult> {
  try {
    const actor = await requireAdminHost();
    const parsed = parseActionInput(addAdminHostSchema, input);
    await enforceRateLimit({ key: `admin:invite:${actor.id}`, limit: 10, windowMs: 60 * 60_000 });
    await addAdminHost({ actor, email: parsed.email, name: parsed.name });
    revalidatePath("/admin/users");
    return { ok: true };
  } catch (error) {
    return actionFail(error);
  }
}

export async function deactivateAdminHostAction(hostAccountId: string): Promise<ActionResult> {
  try {
    const actor = await requireAdminHost();
    const parsed = parseActionInput(hostAccountIdSchema, { hostAccountId });
    await deactivateAdminHost({ actor, hostAccountId: parsed.hostAccountId });
    revalidatePath("/admin/users");
    return { ok: true };
  } catch (error) {
    return actionFail(error);
  }
}

export async function reactivateAdminHostAction(hostAccountId: string): Promise<ActionResult> {
  try {
    const actor = await requireAdminHost();
    const parsed = parseActionInput(hostAccountIdSchema, { hostAccountId });
    await reactivateAdminHost({ actor, hostAccountId: parsed.hostAccountId });
    revalidatePath("/admin/users");
    return { ok: true };
  } catch (error) {
    return actionFail(error);
  }
}

export async function listAdminHostsAction() {
  try {
    await requireAdminHost();
    const hosts = await listAdminHostAccounts();
    return { ok: true as const, hosts };
  } catch (error) {
    return actionFail(error);
  }
}
