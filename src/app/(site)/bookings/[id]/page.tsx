import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const { bookings } = await import("@/data/mock/bookings");
  return bookings.map((b) => ({ id: b.id }));
}

export default async function BookingDetailRedirect({ params }: Props) {
  void (await params);
  redirect("/contact");
}
