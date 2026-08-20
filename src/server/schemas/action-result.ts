import { AppError } from "@/server/errors";

export type ActionResult<T = { ok: true }> =
  | ({ ok: true } & T)
  | { ok: false; error: string; code?: string };

export function actionFail(error: unknown): ActionResult<never> {
  if (error instanceof AppError) {
    return { ok: false, error: error.message, code: error.code };
  }
  console.error(error);
  return { ok: false, error: "Something went wrong" };
}
