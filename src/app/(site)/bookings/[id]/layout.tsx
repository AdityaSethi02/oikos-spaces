export async function generateStaticParams() {
  const { bookings } = await import("@/data/mock/bookings");
  return bookings.map((booking) => ({ id: booking.id }));
}

export default function BookingIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
