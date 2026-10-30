/**
 * useIntersectionWebGL
 * ---------------------
 * Wraps a Three.js scene initializer with IntersectionObserver so the WebGL
 * context is only created when the section enters the viewport and destroyed
 * when it leaves.  This prevents browsers from exceeding their ~8-context
 * WebGL limit when many Three.js sections exist on the same page.
 *
 * Usage:
 *   const mountRef = useIntersectionWebGL(initFn, deps, options);
 *
 *   `initFn(container)` — receives the DOM node, sets up scene, and returns
 *                          a cleanup function (same pattern as useEffect).
 *   `deps`              — dependency array forwarded to the internal useEffect
 *                          (pass [] for mount-once scenes).
 *   `options`           — IntersectionObserver options (threshold, rootMargin).
 *
 * Returns: a ref to attach to the canvas mount <div>.
 *
 * IMPORTANT: Your cleanup function should call renderer.forceContextLoss()
 * before renderer.dispose() to ensure the GPU context is fully released:
 *
 *   return () => {
 *     cancelAnimationFrame(reqId);
 *     renderer.forceContextLoss();
 *     renderer.dispose();
 *   };
 */

"use client";
import { useEffect, useRef } from "react";

export default function useIntersectionWebGL(
  initFn,
  deps = [],
  { threshold = 0.05, rootMargin = "100px 0px 100px 0px" } = {}
) {
  const mountRef = useRef(null);
  // Keep a stable ref to the latest initFn so we don't re-create the observer
  // on every render.
  const initFnRef = useRef(initFn);
  useEffect(() => {
    initFnRef.current = initFn;
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container || typeof IntersectionObserver === "undefined") return;

    let cleanup = null;
    let isVisible = false;

    const start = () => {
      if (isVisible || !mountRef.current) return;
      isVisible = true;
      cleanup = initFnRef.current(mountRef.current);
    };

    const stop = () => {
      if (!isVisible) return;
      isVisible = false;
      if (typeof cleanup === "function") {
        cleanup();
        cleanup = null;
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            start();
          } else {
            stop();
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return mountRef;
}
