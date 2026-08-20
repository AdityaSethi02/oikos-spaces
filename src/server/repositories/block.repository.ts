import type { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

export const blockRepository = {
  listForProperty(propertyId: string) {
    return prisma.propertyBlock.findMany({
      where: { propertyId },
      orderBy: { startDate: "asc" },
    });
  },

  create(data: Prisma.PropertyBlockCreateInput) {
    return prisma.propertyBlock.create({ data });
  },

  delete(id: string) {
    return prisma.propertyBlock.delete({ where: { id } });
  },

  findById(id: string) {
    return prisma.propertyBlock.findUnique({ where: { id } });
  },
};
