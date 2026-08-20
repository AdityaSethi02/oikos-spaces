import prisma from "@/lib/prisma";
import { requireDatabase } from "@/server/lib/require-config";
import { RateLimitError } from "@/server/errors";

type RateLimitInput = {
  key: string;
  limit: number;
  windowMs: number;
};

export async function enforceRateLimit(input: RateLimitInput): Promise<void> {
  requireDatabase();
  const windowStart = new Date(Date.now() - input.windowMs);
  const bucketKey = `${input.key}:${Math.floor(Date.now() / input.windowMs)}`;

  const existing = await prisma.rateLimitBucket.findUnique({
    where: { key: bucketKey },
  });

  if (!existing) {
    await prisma.rateLimitBucket.create({
      data: { key: bucketKey, count: 1, windowStart },
    });
    return;
  }

  if (existing.count >= input.limit) {
    throw new RateLimitError();
  }

  await prisma.rateLimitBucket.update({
    where: { key: bucketKey },
    data: { count: { increment: 1 } },
  });
}

export async function pruneRateLimitBuckets(): Promise<number> {
  requireDatabase();
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const result = await prisma.rateLimitBucket.deleteMany({
    where: { windowStart: { lt: cutoff } },
  });
  return result.count;
}
