"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import * as Dialog from "@radix-ui/react-dialog";
import { useTheme } from "next-themes";
import { Command, Menu, Moon, Sun, X } from "lucide-react";
import { nav, site } from "@/content/site";
import { cn, scrollToId } from "@/lib/utils";
import { useMounted } from "@/hooks/use-media";

export function Nav() {
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const pathname = usePathname();
  const router = useRouter();
  const onHome = pathname === "/";

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active section tracking
  useEffect(() => {
    if (!onHome) return;
    const els = nav.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.2, 0.5] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [onHome]);

  const go = (id: string) => {
    setMenu(false);
    if (onHome) {
      setTimeout(() => scrollToId(id), 50);
    } else {
      router.push(`/#${id}`);
    }
  };

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-foreground focus:px-4 focus:py-2 focus:text-background">
        Skip to content
      </a>
      <header className="fixed inset-x-0 top-3 z-50 flex justify-center px-3 sm:top-5">
        <nav
          aria-label="Primary"
          className={cn(
            "relative flex w-full max-w-4xl items-center justify-between gap-2 overflow-hidden rounded-full px-2 py-2 pl-5 transition-all duration-300",
            scrolled ? "glass shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)]" : "border border-transparent bg-transparent",
          )}
        >
          <Link href="/" className="font-mono text-sm font-semibold tracking-tight" aria-label={`${site.name} — home`}>
            {site.firstName.toLowerCase()}
            <span className="text-brand-cyan">.dev</span>
          </Link>

          <ul className="hidden items-center gap-0.5 lg:flex">
            {nav.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => go(n.id)}
                  aria-current={onHome && active === n.id ? "true" : undefined}
                  className="group relative rounded-full px-3.5 py-2 text-[13px] text-muted transition-colors hover:text-foreground aria-[current=true]:text-foreground"
                >
                  {onHome && active === n.id && (
                    <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full bg-foreground/10" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                  )}
                  {n.label}
                  <span className="absolute inset-x-3.5 bottom-1 h-px origin-left scale-x-0 bg-current transition-transform duration-300 group-hover:scale-x-100" />
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("open-palette"))}
              aria-label="Open command palette"
              className="hover-only hidden h-10 items-center gap-1.5 rounded-full px-3 font-mono text-[11px] text-muted transition-colors hover:bg-foreground/5 hover:text-foreground md:inline-flex"
            >
              <Command className="h-3.5 w-3.5" /> K
            </button>
            <button
              type="button"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              aria-label={mounted ? `Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme` : "Toggle theme"}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-muted transition-colors hover:bg-foreground/5 hover:text-foreground"
            >
              {mounted && resolvedTheme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>

            <Dialog.Root open={menu} onOpenChange={setMenu}>
              <Dialog.Trigger asChild>
                <button type="button" aria-label="Open menu" className="inline-flex h-11 w-11 items-center justify-center rounded-full text-foreground hover:bg-foreground/5 lg:hidden">
                  <Menu className="h-5 w-5" />
                </button>
              </Dialog.Trigger>
              <AnimatePresence>
                {menu && (
                  <Dialog.Portal forceMount>
                    <Dialog.Overlay asChild forceMount>
                      <motion.div className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                    </Dialog.Overlay>
                    <Dialog.Content asChild forceMount aria-describedby={undefined}>
                      <motion.div
                        className="glass fixed inset-x-3 top-3 z-[100] rounded-3xl bg-surface-strong p-5"
                        initial={{ opacity: 0, y: -16, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -16, scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 360, damping: 30 }}
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <Dialog.Title className="font-mono text-sm text-muted">Navigate</Dialog.Title>
                          <Dialog.Close className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-foreground/5" aria-label="Close menu">
                            <X className="h-5 w-5" />
                          </Dialog.Close>
                        </div>
                        <ul className="grid gap-1">
                          {nav.map((n) => (
                            <li key={n.id}>
                              <button
                                type="button"
                                onClick={() => go(n.id)}
                                className="flex min-h-12 w-full items-center justify-between rounded-2xl px-4 text-left text-xl font-medium tracking-tight hover:bg-foreground/5 active:bg-foreground/10"
                              >
                                {n.label}
                                <span className="font-mono text-xs text-muted">{String(nav.indexOf(n) + 1).padStart(2, "0")}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    </Dialog.Content>
                  </Dialog.Portal>
                )}
              </AnimatePresence>
            </Dialog.Root>
          </div>

          {/* Scroll progress */}
          <motion.div aria-hidden style={{ scaleX: progress }} className="absolute inset-x-6 bottom-0 h-px origin-left bg-gradient-to-r from-brand-blue via-brand-violet to-brand-cyan" />
        </nav>
      </header>
    </>
  );
}
