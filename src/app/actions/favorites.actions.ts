"use server";

import { revalidatePath } from "next/cache";
import { actionFail } from "@/server/schemas/action-result";
import { parseActionInput } from "@/server/schemas/parse-action";
import { favoritePropertySchema } from "@/server/schemas/actions.schema";
import { requireAuthUserOrThrow } from "@/server/policies/auth.policy";
import { listFavoriteIds, toggleFavorite } from "@/server/services/favorites.service";
import { isDatabaseConfigured } from "@/lib/env";

export async function toggleFavoriteAction(propertyId: string) {
  try {
    if (!isDatabaseConfigured) {
      return { ok: true as const, favorited: false };
    }
    const user = await requireAuthUserOrThrow();
    const parsed = parseActionInput(favoritePropertySchema, { propertyId });
    const result = await toggleFavorite(user, parsed.propertyId);
    revalidatePath("/favorites");
    return { ok: true as const, favorited: result.favorited };
  } catch (error) {
    return actionFail(error);
  }
}

export async function loadFavoriteIdsAction() {
  try {
    if (!isDatabaseConfigured) {
      return { ok: true as const, ids: [] as string[] };
    }
    const user = await requireAuthUserOrThrow();
    const ids = await listFavoriteIds(user);
    return { ok: true as const, ids };
  } catch (error) {
    return actionFail(error);
  }
}
