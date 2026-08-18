export async function generateStaticParams() {
  const { properties } = await import("@/data/mock/properties");
  return properties.map((property) => ({ id: property.id }));
}

export default function AdminPropertyIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
