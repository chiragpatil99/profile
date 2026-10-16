"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Terminal as TerminalIcon } from "lucide-react";
import { about, education, experience, nav, projects, site, skillCategories, socials } from "@/content/site";
import { Section } from "@/components/ui/section";
import { useReducedMotion } from "@/hooks/use-media";
import { cn, scrollToId } from "@/lib/utils";

type Line = { t: string; href?: string; tone?: "muted" | "accent" | "err" | "in" };

const COMMANDS = ["help", "about", "skills", "experience", "projects", "education", "contact", "resume", "clear", "theme", "goto", "open", "whoami"] as const;
type Cmd = (typeof COMMANDS)[number];

const DESCRIPTIONS: Record<Cmd, string> = {
  help: "list available commands",
  about: "who I am",
  skills: "tools and technologies",
  experience: "where I've worked",
  projects: "things I've built",
  education: "academic background",
  contact: "ways to reach me",
  resume: "download my resume",
  clear: "clear the screen",
  theme: "toggle light / dark",
  goto: "scroll to a section, e.g. goto projects",
  open: "open a project, e.g. open 1",
  whoami: "a one-liner",
};

const BANNER: Line[] = [
  { t: `${site.name} — interactive terminal`, tone: "accent" },
  { t: "Type a command, press Tab to autocomplete, ↑/↓ for history. Try: help", tone: "muted" },
];

export function TerminalSection() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const reduced = useReducedMotion();

  const [lines, setLines] = useState<Line[]>(BANNER);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const print = useCallback(
    (out: Line[]) => {
      if (reduced) {
        setLines((l) => [...l, ...out]);
        return;
      }
      out.forEach((line, i) => {
        const id = window.setTimeout(() => setLines((l) => [...l, line]), i * 35);
        timers.current.push(id);
      });
    },
    [reduced],
  );

  const run = useCallback(
    (raw: string) => {
      const text = raw.trim();
      setLines((l) => [...l, { t: `$ ${raw}`, tone: "in" }]);
      if (!text) return;
      setHistory((h) => [text, ...h].slice(0, 50));
      setHIdx(-1);

      const [name, ...args] = text.split(/\s+/);
      const cmd = name.toLowerCase() as Cmd;

      switch (cmd) {
        case "help":
          return print([
            { t: "Available commands:", tone: "accent" },
            ...COMMANDS.map((c) => ({ t: `  ${c.padEnd(11)} ${DESCRIPTIONS[c]}` })),
          ]);
        case "about":
          return print([...about.paragraphs.map((p) => ({ t: p })), { t: site.titleLine, tone: "muted" as const }]);
        case "whoami":
          return print([{ t: `${site.name}: ${site.title}. ${site.rotatingLines[0]}` }]);
        case "skills":
          return print(skillCategories.map((c) => ({ t: `${c.label.padEnd(24)} ${c.skills.map((s) => s.name).join(", ")}` })));
        case "experience":
          return print(
            experience.flatMap((e) => [
              { t: `${e.company} — ${e.role}`, tone: "accent" as const },
              { t: `  ${e.dates}`, tone: "muted" as const },
              { t: `  ${e.summary}` },
            ]),
          );
        case "projects":
          return print([
            ...projects.map((p, i) => ({ t: `  [${i + 1}] ${p.title}` })),
            { t: "Run `open <number>` to read a case study.", tone: "muted" as const },
          ]);
        case "education":
          return print([
            { t: `${education.school} — ${education.degree}`, tone: "accent" },
            { t: `  ${education.dates}`, tone: "muted" },
          ]);
        case "contact":
          return print([
            { t: `Email     ${socials.email}`, href: `mailto:${socials.email}` },
            { t: `GitHub    ${socials.github}`, href: socials.github },
            { t: `LinkedIn  ${socials.linkedin}`, href: socials.linkedin },
          ]);
        case "resume": {
          const a = document.createElement("a");
          a.href = site.resume.href;
          a.download = site.resume.fileName;
          document.body.appendChild(a);
          a.click();
          a.remove();
          return print([{ t: `Downloading ${site.resume.fileName}…`, tone: "muted" }]);
        }
        case "clear":
          timers.current.forEach(clearTimeout);
          timers.current = [];
          return setLines([]);
        case "theme": {
          const next = resolvedTheme === "dark" ? "light" : "dark";
          setTheme(next);
          return print([{ t: `Theme set to ${next}.`, tone: "muted" }]);
        }
        case "goto": {
          const target = args[0]?.toLowerCase();
          const ids = [...nav.map((n) => n.id), "playground", "terminal"];
          if (!target || !ids.includes(target)) {
            return print([{ t: `Usage: goto <${ids.join("|")}>`, tone: "err" }]);
          }
          scrollToId(target);
          return print([{ t: `Scrolling to ${target}…`, tone: "muted" }]);
        }
        case "open": {
          const n = Number(args[0]);
          const p = Number.isInteger(n) ? projects[n - 1] : projects.find((x) => x.slug === args[0]);
          if (!p) return print([{ t: `Usage: open <1-${projects.length}>. Run \`projects\` to see the list.`, tone: "err" }]);
          print([{ t: `Opening “${p.title}”…`, tone: "muted" }]);
          setTimeout(() => router.push(`/projects/${p.slug}`), 400);
          return;
        }
        default: {
          const near = COMMANDS.find((c) => c.startsWith(name.toLowerCase().slice(0, 2)));
          return print([
            {
              t: `command not found: ${name}. ${near ? `Did you mean \`${near}\`? ` : ""}Type \`help\` to see what's available.`,
              tone: "err",
            },
          ]);
        }
      }
    },
    [print, resolvedTheme, router, setTheme],
  );

  const suggestions = input.trim() && !input.includes(" ") ? COMMANDS.filter((c) => c.startsWith(input.trim().toLowerCase()) && c !== input.trim().toLowerCase()) : [];

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      run(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const n = Math.min(hIdx + 1, history.length - 1);
      if (history[n] !== undefined) {
        setHIdx(n);
        setInput(history[n]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const n = hIdx - 1;
      setHIdx(Math.max(n, -1));
      setInput(n >= 0 ? history[n] : "");
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (suggestions.length >= 1) setInput(suggestions[0] + (suggestions[0] === "goto" || suggestions[0] === "open" ? " " : ""));
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      run("clear");
      setInput("");
    }
  };

  return (
    <Section
      id="terminal"
      eyebrow="Interactive — Terminal"
      title="Prefer a command line?"
      intro="A working terminal for exploring this portfolio. Click a command below or type one. Try help."
    >
      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Terminal commands">
        {COMMANDS.filter((c) => c !== "goto" && c !== "open").map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => {
              run(c);
              inputRef.current?.focus({ preventScroll: true });
            }}
            className="min-h-11 rounded-full border border-border bg-foreground/[0.03] px-4 font-mono text-xs text-muted transition-colors hover:bg-foreground/10 hover:text-foreground"
          >
            {c}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-[#0a0c12] text-[#d7dcec] shadow-2xl">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-rose-400/80" />
          <span className="h-3 w-3 rounded-full bg-amber-400/80" />
          <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
          <span className="ml-3 flex items-center gap-1.5 font-mono text-xs text-white/50">
            <TerminalIcon className="h-3.5 w-3.5" /> chirag@portfolio: ~
          </span>
        </div>

        <div
          ref={scrollRef}
          onClick={() => inputRef.current?.focus({ preventScroll: true })}
          className="scrollbar-thin h-[22rem] cursor-text overflow-y-auto p-4 font-mono text-[13px] leading-relaxed sm:h-[26rem] sm:p-5"
          role="log"
          aria-live="polite"
          aria-label="Terminal output"
        >
          {lines.map((l, i) => {
            const cls = cn(
              "whitespace-pre-wrap break-words",
              l.tone === "in" && "text-white",
              l.tone === "muted" && "text-white/50",
              l.tone === "accent" && "text-cyan-300",
              l.tone === "err" && "text-rose-300",
            );
            return l.href ? (
              <div key={i} className={cls}>
                <a href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="underline decoration-white/30 underline-offset-4 hover:decoration-cyan-300">
                  {l.t}
                </a>
              </div>
            ) : (
              <div key={i} className={cls}>
                {l.t}
              </div>
            );
          })}

          <div className="mt-1 flex items-center gap-2">
            <label htmlFor="term-input" className="shrink-0 text-emerald-300">
              $
            </label>
            <input
              id="term-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="send"
              aria-label="Terminal input. Type a command and press Enter."
              placeholder="type a command…"
              className="min-w-0 flex-1 bg-transparent text-white caret-cyan-300 outline-none placeholder:text-white/30"
              style={{ fontSize: 16 }}
            />
          </div>
        </div>

        <div className="flex min-h-12 flex-wrap items-center gap-2 border-t border-white/10 px-4 py-2 font-mono text-[11px] text-white/50">
          {suggestions.length ? (
            <>
              <span>Tab →</span>
              {suggestions.map((s) => (
                <button key={s} type="button" onClick={() => { setInput(s + (s === "goto" || s === "open" ? " " : "")); inputRef.current?.focus({ preventScroll: true }); }} className="rounded-md bg-white/10 px-2 py-1 text-white/80 hover:bg-white/20">
                  {s}
                </button>
              ))}
            </>
          ) : (
            <span>↑/↓ history · Tab autocomplete · Ctrl+L clear</span>
          )}
        </div>
      </div>
    </Section>
  );
}
