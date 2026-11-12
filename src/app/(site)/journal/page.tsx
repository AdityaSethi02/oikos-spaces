import Link from "next/link";
import { PropertyImage } from "@/components/media/property-image";
import { Icons } from "@/components/icons";
import { getJournalPosts } from "@/data/mock/journal";

export const metadata = { title: "Journal" };

export default function JournalPage() {
  const posts = getJournalPosts();

  return (
    <div className="section-padding">
      <div className="container-page">
        <h1 className="font-serif text-3xl sm:text-4xl">Journal</h1>
        <p className="mt-3 max-w-2xl text-muted">
          Local market notes, buyer checklists and locality spotlights — written for Udaipur
          decisions, not generic advice.
        </p>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/journal/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-shadow hover:shadow-soft"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <PropertyImage
                  src={post.image}
                  alt={post.title}
                  className="rounded-none transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs font-medium uppercase tracking-wider text-accent">
                  {post.category}
                </p>
                <h2 className="mt-2 font-serif text-xl text-foreground group-hover:text-accent">
                  {post.title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{post.excerpt}</p>
                <p className="mt-4 flex items-center gap-2 text-xs text-muted">
                  <span>
                    {new Date(post.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span aria-hidden>·</span>
                  <span>{post.readMinutes} min read</span>
                  <Icons.ArrowRight
                    className="ml-auto h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
