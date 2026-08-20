import type { User } from "@prisma/client";
import prisma from "@/lib/prisma";
import { ConflictError, ForbiddenError, ValidationError } from "@/server/errors";
import { requireDatabase } from "@/server/lib/require-config";
import { hostRepository, normalizeAuthEmail } from "@/server/repositories/host.repository";

export async function listAdminHostAccounts() {
  requireDatabase();
  const hosts = await hostRepository.listAll();
  const users = await prisma.user.findMany({
    where: { email: { in: hosts.map((h) => h.email) } },
  });
  const userByEmail = new Map(users.map((u) => [u.email, u]));

  return hosts.map((host) => {
    const user = userByEmail.get(host.email);
    return {
      id: host.id,
      email: host.email,
      name: host.name ?? user?.name ?? host.email,
      isActive: host.isActive,
      userId: user?.id,
      role: user?.role ?? "GUEST",
      createdAt: host.createdAt.toISOString().slice(0, 10),
    };
  });
}

export async function addAdminHost(input: {
  actor: User;
  email: string;
  name?: string;
}) {
  requireDatabase();
  if (input.actor.role !== "ADMIN_HOST") throw new ForbiddenError();

  const email = normalizeAuthEmail(input.email);
  const existing = await hostRepository.findByEmail(email);
  if (existing?.isActive) {
    throw new ConflictError("This email is already an active admin/host");
  }

  const host = existing
    ? await hostRepository.setActive(existing.id, true)
    : await hostRepository.create({ email, name: input.name });

  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: { role: "ADMIN_HOST", name: input.name ?? user.name },
    });
  }


  return host;
}

export async function deactivateAdminHost(input: {
  actor: User;
  hostAccountId: string;
}) {
  requireDatabase();
  if (input.actor.role !== "ADMIN_HOST") throw new ForbiddenError();

  const host = await prisma.hostAccount.findUnique({ where: { id: input.hostAccountId } });
  if (!host) throw new ValidationError("Admin/host account not found");
  if (!host.isActive) return host;

  const activeCount = await hostRepository.countActive();
  if (activeCount <= 1) {
    throw new ConflictError("Cannot deactivate the last active admin/host");
  }

  const actorHost = await hostRepository.findActiveByEmail(input.actor.email);
  if (actorHost?.id === host.id && activeCount <= 1) {
    throw new ConflictError("Cannot deactivate yourself when you are the only admin");
  }

  await hostRepository.setActive(host.id, false);
  const user = await prisma.user.findUnique({ where: { email: host.email } });
  if (user) {
    await prisma.user.update({ where: { id: user.id }, data: { role: "GUEST" } });
  }


  return host;
}

export async function reactivateAdminHost(input: {
  actor: User;
  hostAccountId: string;
}) {
  requireDatabase();
  if (input.actor.role !== "ADMIN_HOST") throw new ForbiddenError();

  const host = await prisma.hostAccount.findUnique({ where: { id: input.hostAccountId } });
  if (!host) throw new ValidationError("Admin/host account not found");

  await hostRepository.setActive(host.id, true);
  const user = await prisma.user.findUnique({ where: { email: host.email } });
  if (user) {
    await prisma.user.update({ where: { id: user.id }, data: { role: "ADMIN_HOST" } });
  }


  return host;
}
