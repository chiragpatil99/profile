"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { skillCategories } from "@/content/site";
import { Section } from "@/components/ui/section";
import { Tip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const accent: Record<string, string> = {
  blue: "var(--blue)",
  violet: "var(--violet)",
  cyan: "var(--cyan)",
  emerald: "#34d399",
  amber: "#fbbf24",
  rose: "#fb7185",
};

export function Skills() {
  const [filter, setFilter] = useState<string>("all");
  const [picked, setPicked] = useState<{ name: string; description: string; cat: string; color: string } | null>(null);

  const visible = skillCategories.filter((c) => filter === "all" || c.id === filter);

  return (
    <Section
      id="skills"
      eyebrow="04 — Skills"
      title="The tools I reach for."
      intro="Grouped by how I use them. Hover, focus or tap a node for context on where it shows up in my work. No made-up proficiency bars here."
    >
      <div role="group" aria-label="Filter skills by category" className="mb-8 flex flex-wrap gap-2">
        {[{ id: "all", label: "All" }, ...skillCategories].map((c) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={filter === c.id}
            onClick={() => {
              setFilter(c.id);
              setPicked(null);
            }}
            className={cn(
              "min-h-11 rounded-full border px-4 text-sm transition-colors",
              filter === c.id ? "border-transparent bg-foreground text-background" : "border-border text-muted hover:text-foreground",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <motion.div layout className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((cat) => (
            <motion.div
              key={cat.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="glass rounded-3xl p-6"
            >
              <div className="mb-5 flex items-center gap-3">
                <span aria-hidden className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-40" style={{ background: accent[cat.accent] }} />
                  <span className="relative inline-flex h-3 w-3 rounded-full" style={{ background: accent[cat.accent] }} />
                </span>
                <h3 className="text-lg font-semibold tracking-tight">{cat.label}</h3>
              </div>

              <ul className="relative space-y-2 pl-6">
                {/* spine */}
                <span aria-hidden className="absolute bottom-4 left-[5px] top-2 w-px" style={{ background: `linear-gradient(${accent[cat.accent]}, transparent)`, opacity: 0.5 }} />
                {cat.skills.map((s) => {
                  const isPicked = picked?.name === s.name;
                  return (
                    <li key={s.name} className="relative">
                      {/* branch */}
                      <span aria-hidden className="absolute -left-[19px] top-1/2 h-px w-4 -translate-y-1/2" style={{ background: accent[cat.accent], opacity: 0.5 }} />
                      <Tip content={s.description}>
                        <button
                          type="button"
                          aria-pressed={isPicked}
                          onClick={() => setPicked(isPicked ? null : { ...s, cat: cat.label, color: accent[cat.accent] })}
                          className={cn(
                            "group inline-flex min-h-11 items-center gap-2 rounded-xl border px-3.5 text-sm transition-all hover:-translate-y-0.5",
                            isPicked ? "border-transparent bg-foreground/10" : "border-border bg-foreground/[0.03] hover:bg-foreground/[0.08]",
                          )}
                          style={isPicked ? { boxShadow: `0 0 0 1px ${accent[cat.accent]}` } : undefined}
                        >
                          <span aria-hidden className="h-1.5 w-1.5 rounded-full transition-transform group-hover:scale-150" style={{ background: accent[cat.accent] }} />
                          {s.name}
                        </button>
                      </Tip>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <div aria-live="polite" className="mt-6 min-h-[4.5rem] rounded-2xl border border-border bg-foreground/[0.03] p-5 text-sm">
        {picked ? (
          <>
            <p className="font-mono text-[11px] uppercase tracking-wider" style={{ color: picked.color }}>
              {picked.cat}
            </p>
            <p className="mt-1 text-base font-medium">{picked.name}</p>
            <p className="mt-1 text-muted">{picked.description}</p>
          </>
        ) : (
          <p className="text-muted">Tap or click any skill to read how I use it.</p>
        )}
      </div>
    </Section>
  );
}
