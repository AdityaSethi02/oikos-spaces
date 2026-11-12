import Link from "next/link";
import { Icons } from "@/components/icons";
import { brand, navigation, whatsappLink } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-footer-border bg-footer text-footer-foreground">
      <div className="container-page section-padding pb-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="font-serif text-xl text-footer-foreground">
              {brand.name}
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-footer-muted">
              {brand.tagline}. Local advice for buying, selling and renting property in Udaipur.
            </p>
            <p className="mt-4 text-sm text-footer-muted">{brand.contact.address}</p>
            <p className="mt-1 text-sm text-footer-muted">{brand.contact.hours}</p>
            <div className="mt-4 flex items-center gap-2">
              <a
                href={brand.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-footer-muted transition-colors hover:bg-footer-foreground/10 hover:text-footer-foreground"
                aria-label="Instagram"
              >
                <Icons.Instagram className="h-5 w-5" />
              </a>
              <a
                href={brand.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-footer-muted transition-colors hover:bg-footer-foreground/10 hover:text-footer-foreground"
                aria-label="Facebook"
              >
                <Icons.Facebook className="h-5 w-5" />
              </a>
              <a
                href={brand.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-footer-muted transition-colors hover:bg-footer-foreground/10 hover:text-footer-foreground"
                aria-label="YouTube"
              >
                <Icons.Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-footer-foreground">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5">
              {[...navigation.main, ...navigation.company].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-footer-muted transition-colors hover:text-footer-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-footer-foreground">
              Account
            </h3>
            <ul className="mt-4 space-y-2.5">
              {navigation.guest.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-footer-muted transition-colors hover:text-footer-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/login"
                  className="text-sm text-footer-muted transition-colors hover:text-footer-foreground"
                >
                  Sign in
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-footer-foreground">
              Contact
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-footer-muted">
              <li>
                <a href={`mailto:${brand.contact.email}`} className="hover:text-footer-foreground">
                  {brand.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${brand.contact.phone.replace(/\s/g, "")}`}
                  className="hover:text-footer-foreground"
                >
                  {brand.contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink()}
                  className="hover:text-footer-foreground"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </li>
              <li className="pt-2">{brand.contact.address}</li>
              <li>{brand.contact.hours}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-footer-border pt-8 sm:flex-row">
          <p className="text-xs text-footer-muted">
            © {new Date().getFullYear()} {brand.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {navigation.legal.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs text-footer-muted transition-colors hover:text-footer-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
