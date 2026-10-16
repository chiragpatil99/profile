"use client";

import { useId, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll } from "motion/react";
import { ChevronDown, Cloud } from "lucide-react";
import { experience } from "@/content/site";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

const accentText = { blue: "text-brand-blue", violet: "text-brand-violet", cyan: "text-brand-cyan" } as const;

function Card({ item, defaultOpen }: { item: (typeof experience)[number]; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  return (
    <div className="glass gradient-border rounded-3xl transition-colors duration-300 hover:bg-foreground/[0.06]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-start gap-4 rounded-3xl p-6 text-left sm:p-8"
      >
        <span className={cn("mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-foreground/5", accentText[item.accent])}>
          <Cloud className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xl font-semibold tracking-tight sm:text-2xl">{item.company}</span>
          <span className="mt-1 block text-sm text-foreground/80">{item.role}</span>
          <span className="mt-0.5 block font-mono text-xs text-muted">
            {item.dates}
            {item.location ? ` · ${item.location}` : ""}
          </span>
        </span>
        <ChevronDown className={cn("mt-2 h-5 w-5 shrink-0 text-muted transition-transform duration-300", open && "rotate-180")} />
      </button>

      <p className="-mt-2 px-6 pb-6 text-sm leading-relaxed text-muted sm:px-8 sm:pl-[5.75rem]">{item.summary}</p>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="grid gap-8 border-t border-border px-6 py-6 sm:px-8 md:grid-cols-2">
              <div>
                <h4 className="mb-3 font-mono text-[11px] uppercase tracking-wider text-brand-cyan">Responsibilities</h4>
                <ul className="space-y-2.5 text-sm leading-relaxed text-foreground/85">
                  {item.responsibilities.map((r) => (
                    <li key={r} className="flex gap-2.5">
                      <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-violet" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="mb-3 font-mono text-[11px] uppercase tracking-wider text-brand-cyan">Impact</h4>
                <ul className="space-y-2.5 text-sm leading-relaxed text-foreground/85">
                  {item.achievements.map((r) => (
                    <li key={r} className="flex gap-2.5">
                      <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-violet" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap gap-2 px-6 pb-6 sm:px-8 sm:pb-8">
        {item.technologies.map((t) => (
          <Badge key={t}>{t}</Badge>
        ))}
      </div>
    </div>
  );
}

export function ExperienceSection() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });

  return (
    <Section
      id="experience"
      eyebrow="02 — Experience"
      title="Where I've been shipping."
      intro="Production backend and reliability work. Dates, titles and metrics below are placeholders until you edit content/site.ts."
    >
      <ol ref={ref} className="relative space-y-8 pl-8 sm:pl-12">
        <div aria-hidden className="absolute bottom-0 left-[7px] top-0 w-px bg-border sm:left-[15px]">
          <motion.div style={{ scaleY: scrollYProgress, transformOrigin: "top" }} className="h-full w-full bg-gradient-to-b from-brand-blue via-brand-violet to-brand-cyan" />
        </div>
        {experience.map((e, i) => (
          <Reveal as="li" key={e.id} className="relative">
            <span aria-hidden className="absolute -left-[2.35rem] top-9 flex h-4 w-4 items-center justify-center rounded-full border border-border bg-background sm:-left-[3.35rem]">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan" />
            </span>
            <Card item={e} defaultOpen={i === 0} />
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
