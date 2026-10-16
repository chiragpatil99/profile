"use client";

import { useSyncExternalStore } from "react";

function useMedia(query: string, serverValue = false) {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

/** True when the user prefers reduced motion. */
export const useReducedMotion = () => useMedia("(prefers-reduced-motion: reduce)");
/** True on devices whose primary input can hover (mouse / trackpad). */
export const useCanHover = () => useMedia("(hover: hover) and (pointer: fine)");
/** True on narrow viewports. */
export const useIsMobile = () => useMedia("(max-width: 767px)");

/** False during SSR/hydration, true afterwards (without a setState-in-effect). */
export function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
