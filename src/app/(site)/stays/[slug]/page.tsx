import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { properties } = await import("@/data/mock/properties");
  return properties.map((p) => ({ slug: p.slug }));
}

export default async function StaySlugRedirect({ params }: Props) {
  const { slug } = await params;
  redirect(`/properties/${slug}`);
}
