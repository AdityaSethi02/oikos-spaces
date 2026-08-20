import type { User } from "@prisma/client";
import prisma from "@/lib/prisma";
import { requireDatabase } from "@/server/lib/require-config";
import { NotFoundError } from "@/server/errors";
import { listPublicProperties } from "@/server/services/property.service";

export async function listFavoriteProperties(user: User) {
  requireDatabase();
  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    select: { propertyId: true },
  });
  const ids = new Set(favorites.map((f) => f.propertyId));
  const properties = await listPublicProperties();
  return properties.filter((p) => ids.has(p.id));
}

export async function listFavoriteIds(user: User): Promise<string[]> {
  requireDatabase();
  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    select: { propertyId: true },
  });
  return favorites.map((f) => f.propertyId);
}

export async function toggleFavorite(user: User, propertyId: string) {
  requireDatabase();
  const property = await prisma.property.findFirst({
    where: { id: propertyId, status: "ACTIVE", deletedAt: null },
  });
  if (!property) throw new NotFoundError("Property not found");

  const existing = await prisma.favorite.findUnique({
    where: { userId_propertyId: { userId: user.id, propertyId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return { favorited: false };
  }

  await prisma.favorite.create({ data: { userId: user.id, propertyId } });
  return { favorited: true };
}
