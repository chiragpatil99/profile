import type { ProjectKind } from "@/content/types";

/**
 * Custom, code-drawn preview mockups. Purely illustrative: no real data or metrics.
 * Replace with real screenshots by adding `image` support (see README → "Replace project images").
 */
export function ProjectVisual({ kind, className }: { kind: ProjectKind; className?: string }) {
  return (
    <div className={className} role="img" aria-label={`Illustrative ${kind === "streaming" ? "analytics dashboard" : kind === "vision" ? "computer vision pipeline" : "infrastructure graph"} mockup`}>
      {kind === "streaming" && <Streaming />}
      {kind === "vision" && <Vision />}
      {kind === "infra" && <Infra />}
    </div>
  );
}

const frame = "relative h-full w-full overflow-hidden rounded-2xl border border-border bg-surface-strong/80 p-4";

function Dots() {
  return (
    <div className="mb-3 flex gap-1.5">
      <span className="h-2 w-2 rounded-full bg-rose-400/70" />
      <span className="h-2 w-2 rounded-full bg-amber-400/70" />
      <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
    </div>
  );
}

function Streaming() {
  const bars = [38, 52, 44, 66, 58, 78, 62, 90, 72, 84, 70, 96];
  return (
    <div className={frame}>
      <Dots />
      <div className="grid h-[calc(100%-1.25rem)] grid-cols-3 gap-3">
        <div className="col-span-2 flex flex-col rounded-xl border border-border bg-foreground/[0.03] p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[10px] text-muted">events · live</span>
            <span className="flex items-center gap-1 font-mono text-[10px] text-brand-cyan">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-cyan" /> streaming
            </span>
          </div>
          <div className="flex flex-1 items-end gap-1.5">
            {bars.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-gradient-to-t from-brand-blue/30 to-brand-violet"
                style={{ height: `${h}%`, animation: `float-y ${2.4 + (i % 4) * 0.4}s ease-in-out ${i * 0.1}s infinite` }}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="rounded-xl border border-border bg-foreground/[0.03] p-3">
            <p className="font-mono text-[10px] text-muted">price signal</p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
              <div className="h-full w-2/3 rounded-full bg-brand-cyan" />
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
              <div className="h-full w-1/3 rounded-full bg-brand-violet" />
            </div>
          </div>
          <div className="flex-1 space-y-1.5 rounded-xl border border-border bg-foreground/[0.03] p-3">
            {["view", "cart", "buy", "view"].map((e, i) => (
              <div key={i} className="flex items-center justify-between font-mono text-[10px] text-muted">
                <span>{e}</span>
                <span className="h-1 w-6 rounded bg-foreground/15" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Vision() {
  return (
    <div className={frame}>
      <Dots />
      <svg viewBox="0 0 320 200" className="h-[calc(100%-1.25rem)] w-full" aria-hidden>
        <defs>
          <linearGradient id="pv-sky" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--blue)" stopOpacity="0.25" />
            <stop offset="1" stopColor="var(--violet)" stopOpacity="0.25" />
          </linearGradient>
        </defs>
        <rect width="320" height="200" rx="10" fill="url(#pv-sky)" />
        {/* scene objects */}
        <path d="M30 170 L100 80 L160 170 Z" fill="var(--foreground)" opacity="0.1" />
        <circle cx="236" cy="62" r="26" fill="var(--foreground)" opacity="0.1" />
        <rect x="190" y="110" width="90" height="60" rx="8" fill="var(--foreground)" opacity="0.12" />
        {/* segmentation mask */}
        <path d="M190 118 q0 -8 8 -8 h74 q8 0 8 8 v44 q0 8 -8 8 h-74 q-8 0 -8 -8 Z" fill="var(--cyan)" opacity="0.35" />
        {/* detection boxes */}
        <g fill="none" strokeWidth="1.5" strokeDasharray="4 3">
          <rect x="184" y="104" width="102" height="72" rx="4" stroke="var(--cyan)" />
          <rect x="208" y="34" width="56" height="56" rx="4" stroke="var(--violet)" />
          <rect x="22" y="72" width="146" height="104" rx="4" stroke="var(--blue)" />
        </g>
        <g fontFamily="monospace" fontSize="8" fill="var(--foreground)">
          <text x="186" y="100">prompt: “box”</text>
          <text x="210" y="30">prompt: “sun”</text>
          <text x="24" y="68">prompt: “peak”</text>
        </g>
      </svg>
    </div>
  );
}

function Infra() {
  const nodes = [
    [40, 100], [120, 40], [120, 160], [210, 100], [290, 50], [290, 150],
  ] as const;
  const edges = [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [3, 5]] as const;
  return (
    <div className={frame}>
      <Dots />
      <svg viewBox="0 0 330 200" className="h-[calc(100%-1.25rem)] w-full" aria-hidden>
        {edges.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]}
            stroke="var(--violet)" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.7"
            style={{ animation: "dash-flow 1.2s linear infinite" }}
          />
        ))}
        {nodes.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="16" fill="var(--surface-strong)" stroke="var(--border)" />
            <circle cx={x} cy={y} r="5" fill={i % 3 === 0 ? "var(--cyan)" : i % 3 === 1 ? "var(--blue)" : "var(--violet)"} />
          </g>
        ))}
      </svg>
    </div>
  );
}
