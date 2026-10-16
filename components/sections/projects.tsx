"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { projects } from "@/content/site";
import type { Project } from "@/content/types";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { GithubIcon } from "@/components/ui/brand-icons";
import { ProjectVisual } from "@/components/project-visual";
import { useCanHover, useReducedMotion } from "@/hooks/use-media";
import { cn } from "@/lib/utils";

function ProjectCard({ p, index }: { p: Project; index: number }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const canHover = useCanHover();
  const reduce = useReducedMotion();
  const tilt = canHover && !reduce;

  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const light = useMotionTemplate`radial-gradient(420px circle at ${mx}% ${my}%, color-mix(in srgb, var(--violet) 22%, transparent), transparent 60%)`;

  return (
    <Reveal delay={index * 0.05}>
      <div style={{ perspective: 1200 }}>
        <motion.article
          style={tilt ? { rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" } : undefined}
          onPointerMove={(e) => {
            if (!tilt) return;
            const r = e.currentTarget.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width;
            const py = (e.clientY - r.top) / r.height;
            ry.set((px - 0.5) * 6);
            rx.set(-(py - 0.5) * 6);
            mx.set(px * 100);
            my.set(py * 100);
          }}
          onPointerLeave={() => {
            rx.set(0);
            ry.set(0);
          }}
          className="glass gradient-border group relative overflow-hidden rounded-[2rem]"
        >
          {tilt && <motion.div aria-hidden style={{ background: light }} className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />}

          <div className="relative grid gap-8 p-5 sm:p-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:p-10">
            <ProjectVisual kind={p.kind} className="aspect-[16/10] transition-transform duration-500 group-hover:scale-[1.02] lg:order-2" />

            <div className="flex flex-col lg:order-1">
              <p className="font-mono text-xs text-brand-cyan">{String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</p>
              <h3 className="mt-3 text-balance text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
                <Link href={`/projects/${p.slug}`} className="after:absolute after:inset-0 after:z-0 after:content-[''] focus-visible:after:rounded-[2rem]">
                  {p.title}
                </Link>
              </h3>
              <p className="mt-3 text-muted">{p.tagline}</p>

              <ul className="mt-5 grid grid-cols-1 gap-x-4 gap-y-1.5 text-sm text-foreground/85 sm:grid-cols-2">
                {p.highlights.map((h) => (
                  <li key={h} className="flex gap-2">
                    <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-violet" />
                    {h}
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex flex-wrap gap-2">
                {p.technologies.map((t) => (
                  <Badge key={t}>{t}</Badge>
                ))}
              </div>

              <div className="relative z-10 mt-6 flex flex-wrap items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen((o) => !o)}
                  aria-expanded={open}
                  aria-controls={panelId}
                  className="glass inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors hover:bg-foreground/10"
                >
                  Quick case study
                  <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
                </button>
                {p.links.github && (
                  <a href={p.links.github} target="_blank" rel="noopener noreferrer" aria-label={`${p.title} on GitHub (opens in a new tab)`} className="inline-flex h-11 w-11 items-center justify-center rounded-full text-muted hover:bg-foreground/5 hover:text-foreground">
                    <GithubIcon className="h-5 w-5" />
                  </a>
                )}
                {p.links.demo && (
                  <a href={p.links.demo} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1 rounded-full px-3 text-sm text-muted hover:text-foreground">
                    Live demo <ArrowUpRight className="h-4 w-4" />
                  </a>
                )}
                <span className="ml-auto hidden items-center gap-1 text-sm text-muted transition-colors group-hover:text-foreground sm:inline-flex" aria-hidden>
                  Full case study <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                id={panelId}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 overflow-hidden"
              >
                <div className="grid gap-6 border-t border-border p-5 text-sm leading-relaxed sm:p-8 md:grid-cols-3 lg:px-10">
                  <div>
                    <h4 className="mb-2 font-mono text-[11px] uppercase tracking-wider text-brand-cyan">Problem</h4>
                    <p className="text-foreground/85">{p.problem}</p>
                  </div>
                  <div>
                    <h4 className="mb-2 font-mono text-[11px] uppercase tracking-wider text-brand-cyan">Approach</h4>
                    <ul className="space-y-1.5 text-foreground/85">
                      {p.approach.slice(0, 3).map((a) => (
                        <li key={a}>• {a}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-2 font-mono text-[11px] uppercase tracking-wider text-brand-cyan">Tradeoffs</h4>
                    <ul className="space-y-1.5 text-foreground/85">
                      {p.tradeoffs.map((a) => (
                        <li key={a}>• {a}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.article>
      </div>
    </Reveal>
  );
}

export function ProjectsSection() {
  return (
    <Section
      id="projects"
      eyebrow="03 — Projects"
      title="Things I've built and studied."
      intro="Each project opens into a full case study: problem, approach, architecture, tradeoffs and results. Previews are illustrative mockups, not real screenshots or data."
    >
      <div className="space-y-8">
        {projects.map((p, i) => (
          <ProjectCard key={p.slug} p={p} index={i} />
        ))}
      </div>
    </Section>
  );
}
