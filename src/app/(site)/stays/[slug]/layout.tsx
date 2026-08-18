export async function generateStaticParams() {
  const { properties } = await import("@/data/mock/properties");
  return properties.map((property) => ({ slug: property.slug }));
}

export default function StaySlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
