import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { projects, site } from "@/content/site";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { GithubIcon } from "@/components/ui/brand-icons";
import { ProjectVisual } from "@/components/project-visual";
import { Nav } from "@/components/nav";
import { CommandPalette } from "@/components/command-palette";
import { Footer } from "@/components/footer";

type Params = { slug: string };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.tagline,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: { title: `${p.title} · ${site.name}`, description: p.tagline, url: `${site.url}/projects/${p.slug}` },
  };
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Reveal>
      <section className="grid gap-4 border-t border-border py-10 md:grid-cols-[14rem_1fr] md:gap-10">
        <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-brand-cyan">{title}</h2>
        <div className="text-lg leading-relaxed text-foreground/90">{children}</div>
      </section>
    </Reveal>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((i) => (
        <li key={i} className="flex gap-3">
          <span aria-hidden className="mt-3 h-1 w-1 shrink-0 rounded-full bg-brand-violet" />
          {i}
        </li>
      ))}
    </ul>
  );
}

export default async function CaseStudy({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const idx = projects.findIndex((x) => x.slug === slug);
  if (idx === -1) notFound();
  const p = projects[idx];
  const next = projects[(idx + 1) % projects.length];

  return (
    <>
      <Nav />
      <CommandPalette />
      <main id="main" className="mx-auto max-w-5xl px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
        <Link href="/#projects" className="inline-flex min-h-11 items-center gap-2 text-sm text-muted transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> All projects
        </Link>

        <header className="mt-6">
          <p className="font-mono text-xs text-brand-cyan">Case study</p>
          <h1 className="mt-3 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">{p.title}</h1>
          <p className="mt-5 max-w-2xl text-xl text-muted">{p.tagline}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {p.technologies.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            {p.links.github ? (
              <a href={p.links.github} target="_blank" rel="noopener noreferrer" className="glass inline-flex min-h-11 items-center gap-2 rounded-full px-4">
                <GithubIcon className="h-4 w-4" /> Source
              </a>
            ) : null}
            {p.links.demo ? (
              <a href={p.links.demo} target="_blank" rel="noopener noreferrer" className="glass inline-flex min-h-11 items-center gap-2 rounded-full px-4">
                Live demo <ArrowUpRight className="h-4 w-4" />
              </a>
            ) : null}
            {!p.links.github && !p.links.demo && (
              <span className="font-mono text-xs text-muted">Links: add GitHub / demo URLs in content/site.ts</span>
            )}
          </div>
        </header>

        <Reveal className="mt-12">
          <ProjectVisual kind={p.kind} className="aspect-[16/9] w-full" />
          <p className="mt-2 text-center font-mono text-[11px] text-muted">Illustrative mockup, not a real screenshot.</p>
        </Reveal>

        <div className="mt-16">
          <Block title="Problem">
            <p>{p.problem}</p>
          </Block>
          <Block title="Engineering approach">
            <List items={p.approach} />
          </Block>
          <Block title="Architecture overview">
            <ol className="space-y-3">
              {p.architecture.map((a, i) => (
                <li key={a} className="flex items-start gap-4">
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border font-mono text-xs text-muted">{i + 1}</span>
                  {a}
                </li>
              ))}
            </ol>
          </Block>
          <Block title="Challenges & tradeoffs">
            <List items={p.tradeoffs} />
          </Block>
          <Block title="Results & impact">
            <List items={p.results} />
          </Block>
        </div>

        <Link
          href={`/projects/${next.slug}`}
          className="glass gradient-border group mt-8 flex items-center justify-between rounded-3xl p-6 sm:p-8"
        >
          <span>
            <span className="block font-mono text-xs text-muted">Next project</span>
            <span className="mt-1 block text-xl font-semibold tracking-tight sm:text-2xl">{next.title}</span>
          </span>
          <ArrowUpRight className="h-6 w-6 text-muted transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </Link>
      </main>
      <Footer />
    </>
  );
}
