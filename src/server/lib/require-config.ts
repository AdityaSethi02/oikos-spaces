import { env, isClerkServerConfigured, isDatabaseConfigured } from "@/lib/env";
import { ServiceUnavailableError, UnauthorizedError } from "@/server/errors";

export function requireDatabase(): void {
  if (!isDatabaseConfigured) {
    throw new ServiceUnavailableError("Database is not configured");
  }
}

export function requireClerkInProduction(): void {
  if (env.NODE_ENV === "production" && !isClerkServerConfigured) {
    throw new ServiceUnavailableError("Authentication is not configured");
  }
}

export function requireAuthConfigured(): void {
  if (!isClerkServerConfigured) {
    throw new UnauthorizedError("Authentication is not configured");
  }
}
