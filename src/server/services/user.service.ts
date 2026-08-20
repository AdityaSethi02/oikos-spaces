import { userRepository } from "@/server/repositories/user.repository";

export async function handleClerkUserDeleted(clerkUserId: string) {
  const user = await userRepository.findByClerkId(clerkUserId);
  if (!user) return;

}
