"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, Send, Zap } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { useIsMobile, useReducedMotion } from "@/hooks/use-media";
import { cn } from "@/lib/utils";

type NodeId = "client" | "gateway" | "service" | "queue" | "workers" | "db";

const NODES: {
  id: NodeId;
  label: string;
  sub: string;
  purpose: string;
  details: string[];
}[] = [
  {
    id: "client",
    label: "Client",
    sub: "Browser / app",
    purpose: "Sends requests and waits for a response.",
    details: [
      "Real clients should use timeouts and retry with exponential backoff plus jitter, so a brief outage doesn't turn into a retry storm.",
      "With asynchronous processing, the client usually gets a quick acknowledgment (e.g. 202 Accepted) and checks for the result later.",
    ],
  },
  {
    id: "gateway",
    label: "API Gateway",
    sub: "Front door",
    purpose: "Single entry point: authentication, rate limiting and routing.",
    details: [
      "Terminates TLS, authenticates callers and applies throttling so one noisy client can't starve everyone else.",
      "Tradeoff: it is a shared dependency, so it needs to be highly available and kept thin.",
    ],
  },
  {
    id: "service",
    label: "Backend Service",
    sub: "Stateless API",
    purpose: "Validates the request and hands slow work off instead of doing it inline.",
    details: [
      "Stateless instances behind a load balancer scale horizontally: add instances when load rises.",
      "It enqueues work and returns immediately. Making the handler idempotent means a retried request doesn't do the job twice.",
    ],
  },
  {
    id: "queue",
    label: "Message Queue",
    sub: "Buffer",
    purpose: "Absorbs bursts so producers and consumers can run at different speeds.",
    details: [
      "Decouples the fast front end from slower processing. A spike lengthens the queue instead of dropping requests.",
      "Tradeoffs: delivery is typically at-least-once, so consumers must tolerate duplicates; ordering and dead-letter handling need explicit design.",
    ],
  },
  {
    id: "workers",
    label: "Workers",
    sub: "Async processors",
    purpose: "Pull jobs from the queue, do the slow work, and write results.",
    details: [
      "Scale out by adding consumers; autoscaling can key off queue depth (backlog) rather than CPU.",
      "Failed jobs are retried a limited number of times, then moved to a dead-letter queue for inspection.",
    ],
  },
  {
    id: "db",
    label: "Database",
    sub: "Durable state",
    purpose: "Stores results durably so the system survives restarts.",
    details: [
      "The usual bottleneck at scale: connection limits, write throughput and hot partitions all matter.",
      "Mitigations include replicas for reads, partitioning, and batching writes. Each adds consistency and operational tradeoffs.",
    ],
  },
];

type Pkt = { id: number; seg: number; t: number };
type Job = { remain: number };

const MAX_WORKERS = 6;
const BASE_WORKERS = 2;
const PROCESS_TIME = 0.9; // seconds (simulated)

export function Playground() {
  const mobile = useIsMobile();
  const reduced = useReducedMotion();

  const [high, setHigh] = useState(false);
  const [autoscale, setAutoscale] = useState(true);
  const [running, setRunning] = useState(true);
  const [selected, setSelected] = useState<NodeId | null>("queue");
  const [hovered, setHovered] = useState<NodeId | null>(null);
  const [visible, setVisible] = useState(false);

  const [snap, setSnap] = useState({ packets: [] as Pkt[], queue: 0, busy: 0, workers: BASE_WORKERS, sent: 0, done: 0 });

  const cfg = useRef({ high, autoscale });
  useEffect(() => {
    cfg.current = { high, autoscale };
  }, [high, autoscale]);

  const sim = useRef({
    packets: [] as Pkt[],
    jobs: [] as Job[],
    queue: 0,
    busy: 0,
    workers: BASE_WORKERS,
    sent: 0,
    done: 0,
    nextId: 1,
    spawnAcc: 0,
    scaleAcc: 0,
    calmAcc: 0,
  });

  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const spawn = useCallback(() => {
    const s = sim.current;
    s.packets.push({ id: s.nextId++, seg: 0, t: 0 });
    s.sent++;
  }, []);

  // Simulation loop
  useEffect(() => {
    if (!visible || !running) return;
    let raf = 0;
    let last = performance.now();
    let render = 0;

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      const s = sim.current;
      const { high: isHigh, autoscale: auto } = cfg.current;

      // 1. spawn requests (auto traffic disabled for reduced-motion users; they can press "Send")
      if (!reduced) {
        s.spawnAcc += dt;
        const interval = isHigh ? 0.18 : 1.1;
        while (s.spawnAcc >= interval) {
          s.spawnAcc -= interval;
          spawn();
        }
      }

      // 2. advance packets
      const speeds = [1.8, 1.8, 1.8, 2.4, 1.8];
      const remaining: Pkt[] = [];
      for (const p of s.packets) {
        p.t += dt * speeds[p.seg];
        if (p.t < 1) {
          remaining.push(p);
          continue;
        }
        if (p.seg < 2) remaining.push({ id: p.id, seg: p.seg + 1, t: 0 }); // client→gw→svc→queue
        else if (p.seg === 2) s.queue++; // enqueued
        else if (p.seg === 3) s.jobs.push({ remain: PROCESS_TIME }); // worker picked it up
        else if (p.seg === 4) s.done++; // written to DB
      }
      s.packets = remaining;

      // 3. dispatch from queue to free workers
      while (s.busy < s.workers && s.queue > 0) {
        s.queue--;
        s.busy++;
        s.packets.push({ id: s.nextId++, seg: 3, t: 0 });
      }

      // 4. process jobs
      const stillRunning: Job[] = [];
      for (const j of s.jobs) {
        j.remain -= dt;
        if (j.remain <= 0) {
          s.busy = Math.max(0, s.busy - 1);
          s.packets.push({ id: s.nextId++, seg: 4, t: 0 });
        } else stillRunning.push(j);
      }
      s.jobs = stillRunning;

      // 5. simplified autoscaling driven by backlog
      s.scaleAcc += dt;
      if (s.scaleAcc > 0.8) {
        s.scaleAcc = 0;
        if (auto) {
          if (s.queue > 5 && s.workers < MAX_WORKERS) s.workers++;
          if (s.queue === 0 && s.busy < s.workers - 1) s.calmAcc += 0.8;
          else s.calmAcc = 0;
          if (s.calmAcc > 3 && s.workers > BASE_WORKERS) {
            s.workers--;
            s.calmAcc = 0;
          }
        } else if (s.workers !== BASE_WORKERS) {
          s.workers += s.workers > BASE_WORKERS ? -1 : 1;
        }
      }

      // 6. publish a snapshot ~30 fps
      render += dt;
      if (render > 1 / 30) {
        render = 0;
        setSnap({ packets: [...s.packets], queue: s.queue, busy: s.busy, workers: s.workers, sent: s.sent, done: s.done });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, running, reduced, spawn]);

  const reset = () => {
    const s = sim.current;
    Object.assign(s, { packets: [], jobs: [], queue: 0, busy: 0, workers: BASE_WORKERS, sent: 0, done: 0, spawnAcc: 0, scaleAcc: 0, calmAcc: 0 });
    setSnap({ packets: [], queue: 0, busy: 0, workers: BASE_WORKERS, sent: 0, done: 0 });
  };

  // Geometry
  const W = mobile ? 340 : 1000;
  const H = mobile ? 780 : 250;
  const nw = mobile ? 210 : 122;
  const nh = mobile ? 78 : 86;
  const pos = (i: number) => (mobile ? { x: W / 2, y: 62 + i * 131 } : { x: 90 + i * 164, y: H / 2 });

  const active = NODES.find((n) => n.id === (hovered ?? selected)) ?? null;

  return (
    <Section
      id="playground"
      eyebrow="Signature — Architecture playground"
      title="Watch a request travel through a system."
      intro="A simplified asynchronous architecture. Hover or tap a component to learn what it does, then flip to high traffic and watch the queue absorb the burst."
    >
      <div ref={wrapRef} className="glass rounded-[2rem] p-4 sm:p-8">
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <div role="group" aria-label="Traffic level" className="glass inline-flex rounded-full p-1">
            {[false, true].map((v) => (
              <button
                key={String(v)}
                type="button"
                aria-pressed={high === v}
                onClick={() => setHigh(v)}
                className={cn("min-h-10 rounded-full px-4 text-sm transition-colors", high === v ? "bg-foreground text-background" : "text-muted hover:text-foreground")}
              >
                {v ? "High traffic" : "Normal traffic"}
              </button>
            ))}
          </div>
          <label className="glass inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-4 text-sm">
            <input type="checkbox" checked={autoscale} onChange={(e) => setAutoscale(e.target.checked)} className="h-4 w-4 accent-[var(--violet)]" />
            Autoscale workers
          </label>
          <Button variant="glass" size="sm" onClick={() => setRunning((r) => !r)} aria-pressed={!running}>
            {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />} {running ? "Pause" : "Resume"}
          </Button>
          <Button variant="glass" size="sm" onClick={spawn}>
            <Send className="h-4 w-4" /> Send request
          </Button>
          <Button variant="ghost" size="sm" onClick={reset}>
            Reset
          </Button>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 font-mono text-[11px] text-amber-600 dark:text-amber-300">
            <Zap className="h-3 w-3" /> Simulated demo · not production metrics
          </span>
        </div>
        {reduced && <p className="mb-3 font-mono text-xs text-muted">Reduced motion is on: traffic isn&apos;t sent automatically. Use “Send request”.</p>}

        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="group" aria-label="Interactive architecture diagram: Client, API Gateway, Backend Service, Message Queue, Workers, Database">
          {NODES.slice(0, -1).map((_, i) => {
            const a = pos(i);
            const b = pos(i + 1);
            return (
              <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--border)" strokeWidth="2" strokeDasharray="6 6" style={{ animation: running ? "dash-flow 1.4s linear infinite" : undefined }} />
            );
          })}

          {NODES.map((n, i) => {
            const { x, y } = pos(i);
            const isActive = active?.id === n.id;
            return (
              <g
                key={n.id}
                role="button"
                tabIndex={0}
                aria-pressed={selected === n.id}
                aria-label={`${n.label}: ${n.purpose}`}
                className="cursor-pointer outline-none [&:focus-visible>rect]:stroke-[var(--blue)] [&:focus-visible>rect]:stroke-[3]"
                onMouseEnter={() => setHovered(n.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(n.id)}
                onBlur={() => setHovered(null)}
                onClick={() => setSelected(n.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelected(n.id);
                  }
                }}
              >
                <rect
                  x={x - nw / 2}
                  y={y - nh / 2}
                  width={nw}
                  height={nh}
                  rx="18"
                  fill="var(--surface-strong)"
                  stroke={isActive ? "var(--violet)" : "var(--border)"}
                  strokeWidth={isActive ? 2 : 1}
                />
                <text x={x} y={y - 6} textAnchor="middle" fontSize={mobile ? 17 : 15} fontWeight="600" fill="var(--foreground)">
                  {n.label}
                </text>
                <text x={x} y={y + 14} textAnchor="middle" fontSize="11" fill="var(--muted)" fontFamily="var(--font-mono)">
                  {n.id === "queue" ? `depth: ${snap.queue}` : n.id === "workers" ? `${snap.busy}/${snap.workers} busy` : n.sub}
                </text>
                {n.id === "workers" &&
                  Array.from({ length: MAX_WORKERS }).map((_, k) => (
                    <circle
                      key={k}
                      cx={x - 5 * (MAX_WORKERS - 1) + k * 10}
                      cy={y + nh / 2 - 12}
                      r="3"
                      fill={k < snap.busy ? "var(--cyan)" : k < snap.workers ? "var(--violet)" : "var(--border)"}
                    />
                  ))}
                {n.id === "queue" &&
                  Array.from({ length: 10 }).map((_, k) => (
                    <rect
                      key={k}
                      x={x - 5 * 10 + k * 10 + 1}
                      y={y + nh / 2 - 15}
                      width="8"
                      height="6"
                      rx="1.5"
                      fill={k < snap.queue ? "var(--violet)" : "var(--border)"}
                    />
                  ))}
              </g>
            );
          })}

          {/* Packets */}
          {snap.packets.map((p) => {
            const a = pos(p.seg);
            const b = pos(p.seg + 1);
            const x = a.x + (b.x - a.x) * p.t;
            const y = a.y + (b.y - a.y) * p.t;
            return <circle key={p.id} cx={x} cy={y} r="6" fill={p.seg >= 3 ? "var(--cyan)" : "var(--blue)"} style={{ filter: "drop-shadow(0 0 6px var(--violet))" }} />;
          })}
        </svg>

        <dl className="mt-4 grid grid-cols-2 gap-3 font-mono text-xs sm:grid-cols-4">
          {[
            ["Requests sent", snap.sent],
            ["Completed", snap.done],
            ["Queue depth", snap.queue],
            ["Workers", `${snap.workers} / ${MAX_WORKERS}`],
          ].map(([k, v]) => (
            <div key={k as string} className="rounded-xl border border-border bg-foreground/[0.03] px-3 py-2.5">
              <dt className="text-muted">{k}</dt>
              <dd className="mt-0.5 text-lg text-foreground">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-5 min-h-[9rem] rounded-2xl border border-border bg-foreground/[0.03] p-5" aria-live="polite">
          {active ? (
            <>
              <p className="font-mono text-[11px] uppercase tracking-wider text-brand-cyan">{active.label}</p>
              <p className="mt-1 text-base font-medium">{active.purpose}</p>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
                {active.details.map((d) => (
                  <li key={d}>• {d}</li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-sm text-muted">Select a component to see technical details.</p>
          )}
        </div>
        <p className="mt-3 text-xs text-muted">
          Why it matters: in high traffic the queue grows while workers catch up. Turn autoscaling off to see the backlog build. All numbers here are produced by a small in-browser simulation for teaching, not measured from a real system.
        </p>
      </div>
    </Section>
  );
}
