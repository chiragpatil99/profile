"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Heart, Search, Wrench } from "lucide-react";
import { about, journey } from "@/content/site";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

const icons = [Heart, Search, Wrench];

export function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-40, 80]);

  const lineRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress: lineProg } = useScroll({ target: lineRef, offset: ["start 80%", "end 60%"] });

  return (
    <Section id="about" eyebrow="01 — About" title={about.heading}>
      <div ref={ref} className="relative">
        {/* Parallax background shapes */}
        <motion.div aria-hidden style={{ y: y1 }} className="pointer-events-none absolute -right-16 -top-10 h-64 w-64 rounded-full blur-3xl" >
          <div className="h-full w-full rounded-full" style={{ background: "radial-gradient(closest-side, var(--glow-b), transparent)" }} />
        </motion.div>
        <motion.div aria-hidden style={{ y: y2 }} className="pointer-events-none absolute -left-20 top-1/2 h-72 w-72 rounded-full blur-3xl">
          <div className="h-full w-full rounded-full" style={{ background: "radial-gradient(closest-side, var(--glow-a), transparent)" }} />
        </motion.div>

        <div className="relative grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-6">
            {about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p className="text-pretty text-lg leading-relaxed text-foreground/85 sm:text-xl">{p}</p>
              </Reveal>
            ))}
          </div>

          <div className="grid gap-4">
            {about.pillars.map((p, i) => {
              const Icon = icons[i % icons.length];
              return (
                <Reveal key={p.title} delay={i * 0.1}>
                  <div className="glass rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-1">
                    <div className="mb-3 flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground/5 text-brand-cyan">
                        <Icon className="h-4 w-4" />
                      </span>
                      <h3 className="text-base font-semibold">{p.title}</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-muted">{p.body}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Engineering journey */}
        <div className="relative mt-24">
          <Reveal>
            <h3 className="mb-10 font-mono text-xs uppercase tracking-[0.2em] text-muted">Engineering journey</h3>
          </Reveal>
          <ol ref={lineRef} className="relative grid gap-8 md:grid-cols-4 md:gap-5">
            {/* Progress line: vertical on mobile, horizontal on md+ */}
            <div aria-hidden className="absolute bottom-3 left-[11px] top-3 w-px bg-border md:bottom-auto md:left-3 md:right-3 md:top-[11px] md:h-px md:w-auto">
              <motion.div
                style={{ scaleY: lineProg, transformOrigin: "top" }}
                className="h-full w-full bg-gradient-to-b from-brand-blue via-brand-violet to-brand-cyan md:hidden"
              />
              <motion.div
                style={{ scaleX: lineProg, transformOrigin: "left" }}
                className="hidden h-full w-full bg-gradient-to-r from-brand-blue via-brand-violet to-brand-cyan md:block"
              />
            </div>
            {journey.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 0.1} className="relative pl-10 md:pl-0 md:pt-10">
                <span className="absolute left-0 top-1 flex h-[23px] w-[23px] items-center justify-center rounded-full border border-border bg-background md:top-0">
                  <span className="h-2 w-2 rounded-full bg-brand-violet" />
                </span>
                <p className="font-mono text-[11px] uppercase tracking-wider text-brand-cyan">{s.label}</p>
                <h4 className="mt-1 text-lg font-semibold tracking-tight">{s.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
