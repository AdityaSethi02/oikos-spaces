import { ImagePlaceholder } from "@/components/media/image-placeholder";
import { experiences } from "@/data/mock/admin";
import { brand } from "@/lib/brand";

export const metadata = { title: "Experiences" };

const categoryColors: Record<string, string> = {
  Restaurant: "bg-amber-50 text-amber-800",
  "Café": "bg-orange-50 text-orange-800",
  Sightseeing: "bg-blue-50 text-blue-800",
  Activity: "bg-green-50 text-green-800",
  Shopping: "bg-purple-50 text-purple-800",
};

export default function ExperiencesPage() {
  return (
    <div className="section-padding">
      <div className="container-page">
        <h1 className="font-serif text-3xl sm:text-4xl">Local experiences</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Curated recommendations for dining, sightseeing, and activities around{" "}
          {brand.location.split(",")[0]}. Demo content — more coming soon.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {experiences.map((exp) => (
            <article
              key={exp.id}
              className="group overflow-hidden rounded-xl border border-border bg-surface transition-shadow hover:shadow-soft"
            >
              <ImagePlaceholder
                variant="lifestyle"
                className="rounded-none rounded-t-xl transition-transform group-hover:scale-[1.02]"
              />
              <div className="p-5">
                <span
                  className={`inline-block rounded-md px-2 py-0.5 text-xs font-medium ${
                    categoryColors[exp.category] || "bg-stone-100 text-muted"
                  }`}
                >
                  {exp.category}
                </span>
                <h2 className="mt-3 font-serif text-lg">{exp.title}</h2>
                <p className="mt-2 text-sm text-muted">{exp.description}</p>
                <p className="mt-3 text-xs text-muted-foreground">{exp.location}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
