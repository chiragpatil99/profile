"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDown, Download, Mail, Command } from "lucide-react";
import { site, socials } from "@/content/site";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { scrollToId } from "@/lib/utils";

// Heavy 3D scene is code-split and only loaded on the client.
const NetworkScene = dynamic(() => import("@/components/three/network-scene"), {
  ssr: false,
  loading: () => null,
});

const ease = [0.22, 1, 0.36, 1] as const;

function RotatingLine() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % site.rotatingLines.length), 3400);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="relative mt-5 min-h-[3.5rem] sm:min-h-[4rem]">
      {/* Static copy for assistive tech; the rotating copy is decorative */}
      <p className="sr-only">{site.rotatingLines.join(" ")}</p>
      <AnimatePresence mode="wait">
        <motion.p
          key={i}
          aria-hidden
          initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -18, filter: "blur(6px)" }}
          transition={{ duration: 0.55, ease }}
          className="text-gradient text-balance text-2xl font-medium tracking-tight sm:text-3xl md:text-4xl"
        >
          {site.rotatingLines[i]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

export function Hero() {
  return (
    <section id="home" aria-labelledby="hero-title" className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* Atmosphere */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-0 h-[40rem] w-[40rem] rounded-full blur-3xl" style={{ background: "radial-gradient(closest-side, var(--glow-a), transparent)" }} />
        <div className="absolute -right-40 bottom-0 h-[40rem] w-[40rem] rounded-full blur-3xl" style={{ background: "radial-gradient(closest-side, var(--glow-b), transparent)" }} />
        <div className="grid-bg absolute inset-0" />
      </div>
      <NetworkScene />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />

      <div data-hero-content className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-24 pt-32 sm:px-8">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="glass mb-8 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-xs text-muted"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-cyan opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-cyan" />
          </span>
          {site.titleLine}
        </motion.p>

        <h1 id="hero-title" className="text-balance text-6xl font-semibold leading-[0.95] tracking-tighter sm:text-7xl md:text-8xl lg:text-9xl">
          {["Hi,", "I'm", "Chirag."].map((w, i) => (
            <span key={w} className="mr-[0.25em] inline-block overflow-hidden pb-[0.1em] align-bottom">
              <motion.span
                className="inline-block"
                initial={{ y: "110%", rotate: 4 }}
                animate={{ y: 0, rotate: 0 }}
                transition={{ duration: 0.9, delay: 0.1 + i * 0.12, ease }}
              >
                {w}
              </motion.span>
            </span>
          ))}
        </h1>

        <RotatingLine />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease }}
          className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted sm:text-lg"
        >
          {site.intro}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85, ease }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <Magnetic>
            <Button onClick={() => scrollToId("projects")}>
              View Projects <ArrowDown className="h-4 w-4" />
            </Button>
          </Magnetic>
          <Magnetic>
            <Button variant="glass" asChild>
              <a href={site.resume.href} download={site.resume.fileName}>
                <Download className="h-4 w-4" /> Resume
              </a>
            </Button>
          </Magnetic>
          <Magnetic>
            <Button variant="glass" onClick={() => scrollToId("contact")}>
              <Mail className="h-4 w-4" /> Contact Me
            </Button>
          </Magnetic>
          <div className="ml-1 flex items-center gap-1">
            <Button variant="ghost" size="icon" asChild>
              <a href={socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub (opens in a new tab)">
                <GithubIcon className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in a new tab)">
                <LinkedinIcon className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </motion.div>

        <motion.button
          type="button"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          onClick={() => window.dispatchEvent(new Event("open-palette"))}
          className="hover-only mt-8 inline-flex items-center gap-2 font-mono text-xs text-muted transition-colors hover:text-foreground"
        >
          <Command className="h-3.5 w-3.5" /> Press <kbd className="rounded border border-border px-1.5 py-0.5">Ctrl/⌘ K</kbd> to jump anywhere
        </motion.button>
      </div>

      <button
        type="button"
        onClick={() => scrollToId("about")}
        aria-label="Scroll to About section"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
      >
        <span className="flex h-10 w-6 items-start justify-center rounded-full border border-border pt-2">
          <span className="h-1.5 w-1.5 rounded-full bg-foreground" style={{ animation: "scroll-dot 1.8s ease-in-out infinite" }} />
        </span>
      </button>
    </section>
  );
}
