"use client";

import { ThemeProvider } from "next-themes";
import { MotionConfig } from "motion/react";
import * as Tooltip from "@radix-ui/react-tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      {/* reducedMotion="user" makes every Motion animation respect prefers-reduced-motion */}
      <MotionConfig reducedMotion="user">
        <Tooltip.Provider delayDuration={150}>{children}</Tooltip.Provider>
      </MotionConfig>
    </ThemeProvider>
  );
}
