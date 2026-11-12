import Link from "next/link";
import { notFound } from "next/navigation";
import { PropertyImage } from "@/components/media/property-image";
import { ButtonLink } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { getJournalPostBySlug, getJournalPosts, journalPosts } from "@/data/mock/journal";

export function generateStaticParams() {
  return journalPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getJournalPostBySlug(slug);
  return { title: post ? `${post.title} | Journal` : "Journal" };
}

export default async function JournalPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getJournalPostBySlug(slug);
  if (!post) notFound();

  const related = getJournalPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  return (
    <article>
      <div className="section-padding pb-0">
        <div className="container-page max-w-3xl">
          <Link
            href="/journal"
            className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
          >
            <Icons.ArrowLeft className="h-4 w-4" aria-hidden />
            Journal
          </Link>
          <p className="mt-6 text-xs font-medium uppercase tracking-wider text-accent">
            {post.category}
          </p>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl text-balance">{post.title}</h1>
          <p className="mt-4 text-sm text-muted">
            {new Date(post.date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}{" "}
            · {post.readMinutes} min read
          </p>
        </div>
      </div>

      <div className="container-page mt-8 max-w-3xl">
        <div className="aspect-[16/9] overflow-hidden rounded-xl">
          <PropertyImage src={post.image} alt={post.title} className="rounded-xl" priority />
        </div>
      </div>

      <div className="section-padding pt-10">
        <div className="container-page max-w-3xl space-y-5">
          {post.body.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="leading-relaxed text-muted">
              {paragraph}
            </p>
          ))}
          <div className="pt-6">
            <ButtonLink href="/contact">Talk to an advisor</ButtonLink>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section-padding bg-surface">
          <div className="container-page max-w-3xl">
            <h2 className="font-serif text-2xl">More from the journal</h2>
            <ul className="mt-6 space-y-4">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/journal/${item.slug}`}
                    className="group flex items-start justify-between gap-4 border-t border-border pt-4"
                  >
                    <div>
                      <p className="font-medium text-foreground group-hover:text-accent">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm text-muted">{item.excerpt}</p>
                    </div>
                    <Icons.ArrowRight
                      className="mt-1 h-4 w-4 shrink-0 text-muted"
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </article>
  );
}
