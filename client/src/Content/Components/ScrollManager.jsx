"use client";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { usePathname } from "next/navigation";

export default function ScrollManager() {
  const pathname = usePathname();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollDir, setScrollDir] = useState("down");

  useEffect(() => {
    // 1. Initialize AOS globally with bidirectional (up & down) scroll transitions
    AOS.init({
      duration: 800,
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
      once: false,    // Animates both while scrolling down and scrolling back up
      mirror: true,  // Elements animate out when scrolled past and animate back in when scrolling back
      offset: 80,
      delay: 40,
    });

    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;

      // Track progress percentage
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (currentScrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }

      // Track direction (up vs down)
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setScrollDir("down");
        document.documentElement.setAttribute("data-scroll-dir", "down");
      } else if (currentScrollY < lastScrollY) {
        setScrollDir("up");
        document.documentElement.setAttribute("data-scroll-dir", "up");
      }

      // Toggle floating scroll button visibility
      setShowScrollTop(currentScrollY > 320);

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Refresh AOS on dynamic content change
    const refreshTimer = setTimeout(() => {
      AOS.refresh();
    }, 600);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(refreshTimer);
    };
  }, [pathname]);

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* ── Top Scroll Progress Bar (Tracks Up & Down Scroll) ── */}
      <div
        className="global-scroll-progress"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: 3,
          width: `${scrollProgress}%`,
          background: "linear-gradient(90deg, #6366f1, #06b6d4, #a855f7)",
          zIndex: 99999,
          pointerEvents: "none",
          transition: "width 0.12s ease-out",
          boxShadow: "0 0 10px rgba(99, 102, 241, 0.5)",
        }}
      />

      {/* ── Smooth Scroll-To-Top Interactive Floating Pill ── */}
      <button
        type="button"
        className={`global-scroll-top-btn ${showScrollTop ? "is-visible" : ""}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
        title="Scroll to top"
      >
        <i className="bi bi-arrow-up" />
        <span className="scroll-btn-pct">{Math.round(scrollProgress)}%</span>
      </button>

      {/* ── Global Up & Down Scroll Transition Styles ── */}
      <style>{`
        /* NOTE: scroll-behavior is handled via data-scroll-behavior="smooth" on
           the <html> element in layout.js (Next.js App Router approach). Do NOT
           set scroll-behavior here — it triggers a Next.js warning and breaks
           scroll restoration on route transitions. */

        /* Silky cubic-bezier transitions for all AOS scroll animations */
        [data-aos] {
          transition-property: transform, opacity !important;
          transition-timing-function: cubic-bezier(0.25, 1, 0.5, 1) !important;
          will-change: transform, opacity;
        }

        /* Direction-aware smooth transitions */
        [data-scroll-dir="down"] [data-aos] {
          transition-duration: 0.8s !important;
        }

        [data-scroll-dir="up"] [data-aos] {
          transition-duration: 0.75s !important;
        }

        /* Global Floating Scroll-To-Top Button (positioned on bottom-left away from chatbot) */
        .global-scroll-top-btn {
          position: fixed;
          bottom: 28px;
          left: 28px;
          right: auto;
          z-index: 1040;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 99px;
          background: rgba(15, 17, 30, 0.85);
          color: #fff;
          border: 1px solid rgba(99, 102, 241, 0.35);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 8px 28px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.08);
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          opacity: 0;
          visibility: hidden;
          transform: translateY(20px) scale(0.9);
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .global-scroll-top-btn.is-visible {
          opacity: 1;
          visibility: visible;
          transform: translateY(0) scale(1);
        }

        .global-scroll-top-btn:hover {
          transform: translateY(-4px) scale(1.06);
          border-color: rgba(99, 102, 241, 0.7);
          box-shadow: 0 12px 32px rgba(99, 102, 241, 0.35);
          background: rgba(99, 102, 241, 0.2);
        }

        .global-scroll-top-btn i {
          font-size: 1rem;
          transition: transform 0.25s ease;
        }

        .global-scroll-top-btn:hover i {
          transform: translateY(-2px);
        }

        .scroll-btn-pct {
          font-family: 'DM Mono', monospace;
          font-size: 0.72rem;
          color: #a5b4fc;
        }

        @media (max-width: 576px) {
          .global-scroll-top-btn {
            bottom: 20px;
            left: 20px;
            right: auto;
            padding: 7px 12px;
          }
        }
      `}</style>
    </>
  );
}
