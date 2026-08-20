import type { User, UserRole } from "@prisma/client";
import prisma from "@/lib/prisma";

export const userRepository = {
  findByClerkId(clerkUserId: string) {
    return prisma.user.findUnique({ where: { clerkUserId } });
  },

  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  upsertFromClerk(data: {
    clerkUserId: string;
    email: string;
    name?: string | null;
    phone?: string | null;
    role?: UserRole;
  }): Promise<User> {
    return prisma.user.upsert({
      where: { clerkUserId: data.clerkUserId },
      create: {
        clerkUserId: data.clerkUserId,
        email: data.email,
        name: data.name ?? undefined,
        phone: data.phone ?? undefined,
        role: data.role ?? "GUEST",
      },
      update: {
        email: data.email,
        name: data.name ?? undefined,
        phone: data.phone ?? undefined,
        ...(data.role !== undefined ? { role: data.role } : {}),
      },
    });
  },
};
