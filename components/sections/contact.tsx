"use client";

import { useState } from "react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import { Check, Copy, Download, Loader2, Mail, Send } from "lucide-react";
import { site, socials } from "@/content/site";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { Reveal, SplitText } from "@/components/ui/reveal";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { cn } from "@/lib/utils";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "unconfigured" }
  | { kind: "error"; message: string };

type Fields = { name: string; email: string; message: string; company: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(f: Fields) {
  const e: Partial<Record<keyof Fields, string>> = {};
  if (f.name.trim().length < 2) e.name = "Please enter your name.";
  if (!EMAIL_RE.test(f.email.trim())) e.email = "Please enter a valid email address.";
  if (f.message.trim().length < 10) e.message = "Please write at least 10 characters.";
  return e;
}

export function Contact() {
  const [copied, setCopied] = useState(false);
  const [fields, setFields] = useState<Fields>({ name: "", email: "", message: "", company: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const glow = useMotionTemplate`radial-gradient(500px circle at ${mx}% ${my}%, var(--glow-b), transparent 65%)`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(socials.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the address is also visible and selectable on the page.
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate(fields);
    setErrors(v);
    if (Object.keys(v).length) return;
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      if (res.ok) {
        setStatus({ kind: "sent" });
        setFields({ name: "", email: "", message: "", company: "" });
      } else if (res.status === 501) {
        setStatus({ kind: "unconfigured" });
      } else if (res.status === 422) {
        const data = await res.json().catch(() => null);
        setErrors(data?.fields ?? {});
        setStatus({ kind: "idle" });
      } else {
        setStatus({ kind: "error", message: "Your message could not be delivered. Please try again or email me directly." });
      }
    } catch {
      setStatus({ kind: "error", message: "Network error: your message was not sent. Please try again or email me directly." });
    }
  };

  const mailto = `mailto:${socials.email}?subject=${encodeURIComponent(`Hello from ${fields.name || "your portfolio"}`)}&body=${encodeURIComponent(fields.message)}`;

  const inputCls = (bad?: string) =>
    cn(
      "w-full rounded-xl border bg-foreground/[0.04] px-4 py-3 text-base outline-none transition-colors placeholder:text-muted/70 focus:border-brand-violet",
      bad ? "border-rose-400" : "border-border",
    );

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative mx-auto w-full max-w-6xl px-5 py-24 sm:px-8 md:py-32"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 100);
        my.set(((e.clientY - r.top) / r.height) * 100);
      }}
    >
      <motion.div aria-hidden style={{ background: glow }} className="pointer-events-none absolute inset-0" />
      <div aria-hidden className="absolute left-5 right-5 top-0 h-px bg-gradient-to-r from-transparent via-brand-violet/60 to-transparent sm:left-8 sm:right-8" />

      <div className="relative grid gap-14 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <Reveal>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-brand-cyan">06 — Contact</p>
          </Reveal>
          <h2 id="contact-title" className="text-balance text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl">
            <SplitText text="Let's build something extraordinary." />
          </h2>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted">
              I&apos;m always interested in challenging engineering problems, ambitious teams, and opportunities to build impactful software.
            </p>
          </Reveal>

          <Reveal delay={0.15} className="mt-8 flex flex-wrap items-center gap-3">
            <Magnetic>
              <Button asChild>
                <a href={`mailto:${socials.email}`}>
                  <Mail className="h-4 w-4" /> {socials.email}
                </a>
              </Button>
            </Magnetic>
            <Magnetic>
              <Button variant="glass" onClick={copy} aria-live="polite">
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy email"}
              </Button>
            </Magnetic>
          </Reveal>

          <Reveal delay={0.2} className="mt-3 flex flex-wrap items-center gap-3">
            <Button variant="glass" asChild>
              <a href={site.resume.href} download={site.resume.fileName}>
                <Download className="h-4 w-4" /> Resume
              </a>
            </Button>
            <Button variant="glass" asChild>
              <a href={socials.github} target="_blank" rel="noopener noreferrer">
                <GithubIcon className="h-4 w-4" /> GitHub<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </Button>
            <Button variant="glass" asChild>
              <a href={socials.linkedin} target="_blank" rel="noopener noreferrer">
                <LinkedinIcon className="h-4 w-4" /> LinkedIn<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </Button>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <form onSubmit={submit} noValidate className="glass rounded-3xl p-6 sm:p-8" aria-labelledby="form-title">
            <h3 id="form-title" className="mb-5 text-lg font-semibold tracking-tight">
              Send a message
            </h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="c-name" className="mb-1.5 block text-sm text-muted">Name</label>
                <input id="c-name" name="name" autoComplete="name" value={fields.name} onChange={(e) => setFields({ ...fields, name: e.target.value })} aria-invalid={!!errors.name} aria-describedby={errors.name ? "c-name-err" : undefined} className={inputCls(errors.name)} />
                {errors.name && <p id="c-name-err" role="alert" className="mt-1 text-sm text-rose-500 dark:text-rose-300">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="c-email" className="mb-1.5 block text-sm text-muted">Email</label>
                <input id="c-email" name="email" type="email" autoComplete="email" value={fields.email} onChange={(e) => setFields({ ...fields, email: e.target.value })} aria-invalid={!!errors.email} aria-describedby={errors.email ? "c-email-err" : undefined} className={inputCls(errors.email)} />
                {errors.email && <p id="c-email-err" role="alert" className="mt-1 text-sm text-rose-500 dark:text-rose-300">{errors.email}</p>}
              </div>
              {/* Honeypot (hidden from people and assistive tech) */}
              <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label htmlFor="c-company">Company</label>
                <input id="c-company" name="company" tabIndex={-1} autoComplete="off" value={fields.company} onChange={(e) => setFields({ ...fields, company: e.target.value })} />
              </div>
              <div>
                <label htmlFor="c-message" className="mb-1.5 block text-sm text-muted">Message</label>
                <textarea id="c-message" name="message" rows={5} value={fields.message} onChange={(e) => setFields({ ...fields, message: e.target.value })} aria-invalid={!!errors.message} aria-describedby={errors.message ? "c-message-err" : undefined} className={cn(inputCls(errors.message), "resize-y")} />
                {errors.message && <p id="c-message-err" role="alert" className="mt-1 text-sm text-rose-500 dark:text-rose-300">{errors.message}</p>}
              </div>
            </div>

            <Button type="submit" disabled={status.kind === "sending"} className="mt-6 w-full">
              {status.kind === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {status.kind === "sending" ? "Sending…" : "Send message"}
            </Button>

            <div aria-live="polite" className="mt-4 text-sm">
              {status.kind === "sent" && <p className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-emerald-700 dark:text-emerald-300">Message delivered. Thank you, I&apos;ll get back to you soon.</p>}
              {status.kind === "error" && <p role="alert" className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-rose-700 dark:text-rose-300">{status.message}</p>}
              {status.kind === "unconfigured" && (
                <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-amber-800 dark:text-amber-200">
                  <p>This form isn&apos;t connected to an email service yet, so nothing was sent.</p>
                  <a href={mailto} className="mt-2 inline-flex min-h-11 items-center font-medium underline underline-offset-4">Open in your email app instead</a>
                </div>
              )}
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
