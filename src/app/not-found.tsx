import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

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
        <div className="mt-8 flex gap-4">
          <Link href="/">
            <Button>Go home</Button>
          </Link>
          <Link href="/stays">
            <Button variant="outline">Browse stays</Button>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
