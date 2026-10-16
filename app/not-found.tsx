import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Nav } from "@/components/nav";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main id="main" className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
        <div aria-hidden className="grid-bg pointer-events-none absolute inset-0" />
        <p className="relative font-mono text-sm text-brand-cyan">HTTP 404</p>
        <h1 className="text-gradient relative mt-4 text-[7rem] font-semibold leading-none tracking-tighter sm:text-[10rem]">404</h1>
        <p className="relative mt-4 max-w-md text-lg text-muted">
          This request got routed to a service that doesn&apos;t exist. Even good systems return a 404 sometimes.
        </p>
        <Link href="/" className={`${buttonVariants({ variant: "primary" })} relative mt-8`}>
          <ArrowLeft className="h-4 w-4" /> Back home
        </Link>
      </main>
    </>
  );
}
