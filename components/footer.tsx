import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-6xl border-t border-border px-5 py-10 sm:px-8">
      <div className="flex flex-col items-start justify-between gap-3 text-sm text-muted sm:flex-row sm:items-center">
        <p>© {new Date().getFullYear()} {site.name}. Built with Next.js, Motion, GSAP and React Three Fiber.</p>
        <p className="font-mono text-xs">Opinions are my own. Not affiliated with any employer.</p>
      </div>
    </footer>
  );
}
