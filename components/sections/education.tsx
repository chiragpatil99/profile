"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { GraduationCap } from "lucide-react";
import { education, exploring } from "@/content/site";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";

export function EducationSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [-8, 8]);
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <Section id="education" eyebrow="05 — Education" title="Studying how systems work.">
      <div ref={ref} className="relative">
        <Reveal>
          <div className="glass gradient-border relative overflow-hidden rounded-[2rem] p-6 sm:p-10">
            <motion.div
              aria-hidden
              style={{ rotate, y }}
              className="pointer-events-none absolute -right-10 -top-10 text-[14rem] font-semibold leading-none tracking-tighter text-foreground/[0.04] select-none sm:text-[18rem]"
            >
              VT
            </motion.div>

            <div className="relative grid gap-10 md:grid-cols-[1fr_1.2fr]">
              <div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground/5 text-brand-violet">
                  <GraduationCap className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-3xl font-semibold tracking-tight">{education.school}</h3>
                <p className="mt-2 text-foreground/85">{education.degree}</p>
                <p className="mt-1 font-mono text-xs text-muted">{education.dates}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="mb-3 font-mono text-[11px] uppercase tracking-wider text-brand-cyan">Coursework</h4>
                  <div className="flex flex-wrap gap-2">
                    {education.coursework.map((c, i) => (
                      <Badge key={`${c}-${i}`}>{c}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="mb-3 font-mono text-[11px] uppercase tracking-wider text-brand-cyan">Achievements</h4>
                  <ul className="space-y-1.5 text-sm text-foreground/85">
                    {education.achievements.map((a) => (
                      <li key={a}>• {a}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="mb-3 font-mono text-[11px] uppercase tracking-wider text-brand-cyan">Research</h4>
                  <p className="text-sm leading-relaxed text-foreground/85">{education.research}</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
        <p className="mt-3 font-mono text-[11px] text-muted">Placeholders in brackets are editable in content/site.ts.</p>
      </div>

      <div id="exploring" className="mt-20">
        <Reveal>
          <h3 className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-muted">Currently exploring</h3>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          {exploring.map((e, i) => (
            <Reveal key={e.title} delay={i * 0.08}>
              <div className="glass h-full rounded-2xl p-5">
                <div className="mb-3 flex items-center gap-2">
                  <span aria-hidden className="h-2 w-2 animate-pulse rounded-full bg-brand-cyan" />
                  <h4 className="font-semibold tracking-tight">{e.title}</h4>
                </div>
                <p className="text-sm leading-relaxed text-muted">{e.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
