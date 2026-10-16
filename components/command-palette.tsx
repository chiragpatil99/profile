"use client";

import { useCallback, useEffect, useState } from "react";
import { Command } from "cmdk";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Compass, Copy, Download, Mail, Moon, Sun, Terminal as TerminalIcon, Workflow } from "lucide-react";
import { nav, site, socials, projects } from "@/content/site";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { scrollToId } from "@/lib/utils";

const item =
  "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground aria-selected:bg-foreground/10 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:text-muted";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-palette", onOpen);
    };
  }, []);

  const run = useCallback((fn: () => void) => {
    setOpen(false);
    // Let the dialog close (and release scroll lock) before acting.
    setTimeout(fn, 60);
  }, []);

  const go = (id: string) => run(() => {
    if (window.location.pathname !== "/") {
      router.push(`/#${id}`);
    } else {
      scrollToId(id);
    }
  });

  const copyEmail = () =>
    run(() => {
      navigator.clipboard?.writeText(socials.email).catch(() => {});
    });

  const downloadResume = () =>
    run(() => {
      const a = document.createElement("a");
      a.href = site.resume.href;
      a.download = site.resume.fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
    });

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Command palette"
      overlayClassName="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm"
      contentClassName="glass fixed left-1/2 top-[18vh] z-[100] w-[min(92vw,34rem)] -translate-x-1/2 overflow-hidden rounded-2xl bg-surface-strong shadow-2xl"
    >
      <Command.Input
        placeholder="Type a command or search…"
        className="w-full border-b border-border bg-transparent px-4 py-4 text-sm outline-none placeholder:text-muted"
      />
      <Command.List className="scrollbar-thin max-h-[50vh] overflow-y-auto p-2">
        <Command.Empty className="px-3 py-8 text-center text-sm text-muted">No results. Try “projects” or “resume”.</Command.Empty>

        <Command.Group heading="Navigate" className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted">
          {nav.map((n) => (
            <Command.Item key={n.id} value={`go ${n.label}`} onSelect={() => go(n.id)} className={item}>
              <Compass /> {n.label}
            </Command.Item>
          ))}
          <Command.Item value="go architecture playground" onSelect={() => go("playground")} className={item}>
            <Workflow /> Architecture playground
          </Command.Item>
          <Command.Item value="go terminal" onSelect={() => go("terminal")} className={item}>
            <TerminalIcon /> Interactive terminal
          </Command.Item>
        </Command.Group>

        <Command.Group heading="Projects" className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted">
          {projects.map((p) => (
            <Command.Item key={p.slug} value={`project ${p.title}`} onSelect={() => run(() => router.push(`/projects/${p.slug}`))} className={item}>
              <Compass /> {p.title}
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading="Actions" className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted">
          <Command.Item value="download resume" onSelect={downloadResume} className={item}>
            <Download /> Download resume
          </Command.Item>
          <Command.Item value="open github" onSelect={() => run(() => window.open(socials.github, "_blank", "noopener,noreferrer"))} className={item}>
            <GithubIcon /> Open GitHub
          </Command.Item>
          <Command.Item value="open linkedin" onSelect={() => run(() => window.open(socials.linkedin, "_blank", "noopener,noreferrer"))} className={item}>
            <LinkedinIcon /> Open LinkedIn
          </Command.Item>
          <Command.Item value="contact email me" onSelect={() => go("contact")} className={item}>
            <Mail /> Contact me
          </Command.Item>
          <Command.Item value="copy email address" onSelect={copyEmail} className={item}>
            <Copy /> Copy email address
          </Command.Item>
          <Command.Item value="toggle theme light dark" onSelect={() => run(() => setTheme(resolvedTheme === "dark" ? "light" : "dark"))} className={item}>
            {resolvedTheme === "dark" ? <Sun /> : <Moon />} Toggle theme
          </Command.Item>
        </Command.Group>
      </Command.List>
      <div className="flex items-center justify-between border-t border-border px-4 py-2 font-mono text-[11px] text-muted">
        <span>↑↓ navigate · ↵ select · esc close</span>
        <span>{site.firstName}</span>
      </div>
    </Command.Dialog>
  );
}
