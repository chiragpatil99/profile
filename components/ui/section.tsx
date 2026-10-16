import { cn } from "@/lib/utils";
import { Reveal, SplitText } from "./reveal";

export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  className,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("relative mx-auto w-full max-w-6xl px-5 py-24 sm:px-8 md:py-32", className)}>
      <Divider />
      <Reveal>
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-brand-cyan">{eyebrow}</p>
      </Reveal>
      <h2 id={`${id}-title`} className="max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
        <SplitText text={title} />
      </h2>
      {intro && (
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted">{intro}</p>
        </Reveal>
      )}
      <div className="mt-14">{children}</div>
    </section>
  );
}

/** Animated gradient divider between sections. */
function Divider() {
  return (
    <div aria-hidden className="absolute left-5 right-5 top-0 h-px overflow-hidden sm:left-8 sm:right-8">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-violet/60 to-transparent" />
    </div>
  );
}
