"use client";

/**
 * SmoothScroll — wraps the app in a Lenis smooth-scroll context.
 *
 * Lenis takes over native scroll with a smoothed lerp. We honor
 * prefers-reduced-motion by skipping smooth scrolling for users who
 * have asked for less motion (Lenis still mounts but with smooth: false).
 *
 * Anchor links (hash navigation) are intercepted here so they slide
 * via Lenis instead of the browser's default jump. Per-section offsets
 * can be specified in `offsetByHash`.
 *
 * The Lenis instance is exposed via React context so other components
 * (e.g. ScrollExperience for snap-to-panel logic) can call scrollTo
 * directly.
 */

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import Lenis from "lenis";

const LenisContext = createContext<Lenis | null>(null);

export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const instance = new Lenis({
      // Snappier than the default 1.2 — feels closer to native wheel
      // while still giving Apple-style ease-out smoothing.
      duration: 0.85,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !prefersReducedMotion,
      // Touch is left native — Lenis on touch can feel laggy on iOS Safari.
      touchMultiplier: 1.6,
      wheelMultiplier: 1,
    });

    setLenis(instance);

    let rafId = 0;
    const raf = (time: number) => {
      instance.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Per-section offset map: links to sections that sit immediately
    // after a sticky/scroll-pinned section need to land PAST that
    // section's bottom edge, otherwise the user lands at the boundary
    // where the previous section's overlay is still visible.
    const offsetByHash: Record<string, number> = {
      "#social-proof": 80,
      "#faq": 80,
    };

    const onAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest<HTMLAnchorElement>('a[href^="#"], a[href^="/#"]');
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      const hash = href.replace(/^\/?/, "");
      if (!hash.startsWith("#") || hash === "#") return;
      const el = document.querySelector(hash);
      if (!el) return;
      e.preventDefault();
      const offset = offsetByHash[hash] ?? -64;

      // If the target is past the scroll experience, jump instantly
      // so the flip section doesn't flash during navigation.
      const scrollExperience = document.getElementById("hero");
      const targetTop = (el as HTMLElement).getBoundingClientRect().top + window.scrollY;
      let crossesFlip = false;

      if (scrollExperience) {
        const seRect = scrollExperience.getBoundingClientRect();
        const seTop = seRect.top + window.scrollY;
        const seBottom = seTop + seRect.height;
        const currentY = window.scrollY;
        // Crosses if the scroll path passes through the scroll experience
        crossesFlip =
          (currentY < seBottom && targetTop > seTop) ||
          (currentY > seTop && targetTop < seBottom);
      }

      if (crossesFlip) {
        window.dispatchEvent(new Event("scrollexperience:hide"));
        requestAnimationFrame(() => {
          instance.scrollTo(el as HTMLElement, {
            offset,
            immediate: true,
          });
        });
      } else {
        instance.scrollTo(el as HTMLElement, {
          offset,
          duration: 0.4,
        });
      }
    };
    document.addEventListener("click", onAnchorClick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("click", onAnchorClick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
