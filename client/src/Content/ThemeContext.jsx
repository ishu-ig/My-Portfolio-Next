"use client";

import { createContext, useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";

export const ThemeContext = createContext();

// ── Safely apply theme to both html and body using classList (non-destructive)
function applyThemeToDom(theme) {
    try {
        const root = document.documentElement;
        const body = document.body;
        const other = theme === "dark" ? "light" : "dark";

        // html element
        root.setAttribute("data-theme", theme);
        root.setAttribute("data-bs-theme", theme);
        root.classList.remove(other);
        root.classList.add(theme);

        // body element — use classList so we don't wipe Next.js body classes
        body.classList.remove(other);
        body.classList.add(theme);
    } catch (e) {
        // SSR guard
    }
}

export const ThemeProvider = ({ children }) => {
    // Initialise from localStorage immediately — avoids a useState("dark") flash
    // when the user's saved preference is "light".
    const [theme, setTheme] = useState(() => {
        if (typeof window === "undefined") return "dark";
        return localStorage.getItem("theme") || "dark";
    });

    const pathname = usePathname();

    // Persist theme to localStorage and apply to DOM whenever state changes
    useEffect(() => {
        applyThemeToDom(theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    // ── KEY FIX: Re-assert theme after EVERY route change.
    // Next.js App Router reconciles <html> and <body> attributes against
    // the static values in layout.js during soft navigation. This means
    // data-theme="dark" (hardcoded in layout.js) gets re-applied every
    // navigation, overriding any dynamic changes. We use two rAF ticks
    // so we run *after* React finishes reconciling the DOM.
    useEffect(() => {
        const stored = localStorage.getItem("theme") || "dark";

        // Tick 1 — right after paint
        const raf1 = requestAnimationFrame(() => {
            applyThemeToDom(stored);

            // Tick 2 — one more frame to catch any late React reconciliation
            const raf2 = requestAnimationFrame(() => {
                applyThemeToDom(stored);
                if (stored !== theme) {
                    setTheme(stored);
                }
            });

            return () => cancelAnimationFrame(raf2);
        });

        return () => cancelAnimationFrame(raf1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    const toggleTheme = useCallback(() => {
        setTheme((prev) => {
            const next = prev === "light" ? "dark" : "light";
            // Apply synchronously so there's no lag between click and visual change
            applyThemeToDom(next);
            localStorage.setItem("theme", next);
            return next;
        });
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
