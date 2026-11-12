import { brand } from "@/lib/brand";

export function PartnersStrip({
  title = "Trusted builder partners",
  subtitle = "A sample of developers and project teams we work with across Udaipur.",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="section-padding border-y border-border bg-secondary text-secondary-foreground">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl sm:text-4xl text-secondary-foreground">{title}</h2>
          <p className="mt-3 text-secondary-foreground/70">{subtitle}</p>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {brand.partners.map((name) => (
            <li
              key={name}
              className="flex min-h-20 items-center justify-center border border-secondary-foreground/20 px-3 py-4 text-center transition-transform duration-200 hover:-translate-y-0.5"
            >
              <span className="font-serif text-sm text-secondary-foreground sm:text-base">
                {name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
