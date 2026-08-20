import prisma from "@/lib/prisma";

export function normalizeAuthEmail(email: string): string {
  return email.trim().toLowerCase();
}

export const hostRepository = {
  findActiveByEmail(email: string) {
    return prisma.hostAccount.findFirst({
      where: {
        email: normalizeAuthEmail(email),
        isActive: true,
      },
    });
  },

  findByEmail(email: string) {
    return prisma.hostAccount.findUnique({
      where: { email: normalizeAuthEmail(email) },
    });
  },

  listActive() {
    return prisma.hostAccount.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
    });
  },

  listAll() {
    return prisma.hostAccount.findMany({
      orderBy: { createdAt: "asc" },
    });
  },

  countActive() {
    return prisma.hostAccount.count({ where: { isActive: true } });
  },

  create(input: { email: string; name?: string }) {
    return prisma.hostAccount.create({
      data: {
        email: normalizeAuthEmail(input.email),
        name: input.name,
        isActive: true,
      },
    });
  },

  setActive(id: string, isActive: boolean) {
    return prisma.hostAccount.update({
      where: { id },
      data: { isActive },
    });
  },
};
