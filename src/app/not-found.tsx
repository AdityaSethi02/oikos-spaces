import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <Header />
      <div className="flex flex-1 flex-col items-center justify-center section-padding">
        <p className="font-serif text-8xl text-accent/30">404</p>
        <h1 className="mt-4 font-serif text-3xl">Page not found</h1>
        <p className="mt-3 max-w-md text-center text-muted">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <div className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:w-auto sm:flex-row">
          <ButtonLink href="/">Go home</ButtonLink>
          <ButtonLink href="/stays" variant="outline">Browse stays</ButtonLink>
        </div>
      </div>
      <Footer />
    </>
  );
}
