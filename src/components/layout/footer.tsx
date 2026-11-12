import Link from "next/link";
import { brand, navigation, whatsappLink } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="container-page section-padding pb-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="font-serif text-xl text-foreground">
              {brand.name}
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              {brand.tagline}. Local advice for buying, selling and renting property in Udaipur.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5">
              {navigation.main.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Account
            </h3>
            <ul className="mt-4 space-y-2.5">
              {navigation.guest.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/login"
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  Sign in
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Contact
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted">
              <li>{brand.contact.email}</li>
              <li>{brand.contact.phone}</li>
              <li>
                <a
                  href={whatsappLink()}
                  className="hover:text-foreground"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </li>
              <li>{brand.location}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} {brand.name}. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Demo UI — prices and listings are placeholders
          </p>
        </div>
      </div>
    </footer>
  );
}
