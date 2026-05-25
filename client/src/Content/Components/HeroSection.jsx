"use client";
import React, { useEffect, useState, useContext } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { ThemeContext } from "../ThemeContext";

const words = ["Developer", "Coder", "Graphic Designer", "UI/UX Designer"];

export default function HeroSection() {
    const { theme } = useContext(ThemeContext);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [text, setText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        AOS.init({ duration: 900, once: false });
    }, []);

    // Typing effect
    useEffect(() => {
        const typingSpeed = isDeleting ? 50 : 100;
        let timeout;
        if (!isDeleting && text === words[currentWordIndex]) {
            timeout = setTimeout(() => setIsDeleting(true), 1500);
        } else if (isDeleting && text === "") {
            setIsDeleting(false);
            setCurrentWordIndex(prev => (prev + 1) % words.length);
        } else {
            timeout = setTimeout(() => {
                setText(prev =>
                    isDeleting
                        ? prev.slice(0, -1)
                        : words[currentWordIndex].slice(0, prev.length + 1)
                );
            }, typingSpeed);
        }
        return () => clearTimeout(timeout);
    }, [text, isDeleting, currentWordIndex]);

    const stats = [
        { n: "1+",   l: "Years\nExperience" },
        { n: "15+",  l: "Projects\nCompleted" },
        { n: "200+", l: "Coding\nQuestions" },
    ];

    return (
        <section
            id="home"
            style={{
                padding: "70px 16px",
                backgroundColor: "var(--bg-color)",
                color: "var(--text-color)",
                transition: "background-color 0.3s ease, color 0.3s ease",
            }}
        >
            <div className="container">
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
                    gap: 48,
                    alignItems: "center",
                    maxWidth: 960,
                    margin: "0 auto",
                }}>

                    {/* ── Left: Text ── */}
                    <div data-aos="fade-right">

                        {/* Available tag */}
                        <div style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            background: "var(--card-bg)",
                            border: "1px solid var(--border-color)",
                            borderRadius: 999, padding: "3px 12px",
                            fontSize: 11, color: "var(--muted-color)",
                            marginBottom: 14,
                        }}>
                            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
                            Available for work
                        </div>

                        {/* Eyebrow */}
                        <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--primary-color)", margin: "0 0 8px" }}>
                            Portfolio
                        </p>

                        {/* Name */}
                        <h1 style={{ fontSize: "clamp(2rem, 5vw, 2.8rem)", fontWeight: 700, color: "var(--text-color)", lineHeight: 1.15, margin: "0 0 12px" }}>
                            Ishaan Gupta
                        </h1>

                        {/* Typing row */}
                        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                            <span style={{ fontSize: 18, color: "var(--muted-color)" }}>I'm a</span>
                            <span style={{ fontSize: 18, fontWeight: 600, color: "var(--primary-color)" }}>{text}</span>
                            <span style={{
                                fontSize: 18, color: "var(--primary-color)",
                                animation: "heroBlinkCursor 0.7s infinite",
                            }}>|</span>
                        </div>

                        {/* Description */}
                        <p style={{ fontSize: 15, color: "var(--muted-color)", lineHeight: 1.7, maxWidth: 440, margin: "0 0 24px" }}>
                            Transforming ideas into elegant solutions through creative design and innovative development.
                        </p>

                        {/* CTA Buttons */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 36 }}>
    <a
        href="#portfolio"
        style={{
            padding: "10px 24px",
            borderRadius: 999,
            background: "var(--primary-color)",
            color: "#fff",
            fontSize: 14,
            fontWeight: 500,
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            transition: "opacity 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
    >
        <i className="bi bi-grid"></i> My Work
    </a>

    <a
        href="/file/Ishaan CV.pdf"
        target="_blank"
        rel="noopener noreferrer"
        style={{
            padding: "10px 24px",
            borderRadius: 999,
            background: "transparent",
            color: "var(--text-color)",
            fontSize: 14,
            fontWeight: 500,
            border: "1px solid var(--border-color)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            transition: "background 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--card-bg)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
        <i className="bi bi-download"></i> Resume
    </a>
</div>

                        {/* Stats bar */}
                        <div style={{
                            display: "flex",
                            border: "1px solid var(--border-color)",
                            borderRadius: 12,
                            overflow: "hidden",
                        }}>
                            {stats.map((s, i) => (
                                <div
                                    key={i}
                                    style={{
                                        flex: 1, textAlign: "center", padding: "12px 8px",
                                        borderRight: i < stats.length - 1 ? "1px solid var(--border-color)" : "none",
                                    }}
                                >
                                    <span style={{ fontSize: 20, fontWeight: 700, color: "var(--primary-color)", display: "block" }}>
                                        {s.n}
                                    </span>
                                    <span style={{ fontSize: 11, color: "var(--muted-color)", lineHeight: 1.4, display: "block", marginTop: 2, whiteSpace: "pre-line" }}>
                                        {s.l}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Right: Image ── */}
                    <div data-aos="fade-left" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <div style={{ position: "relative", width: "clamp(290px, 35vw, 420px)", height: "clamp(290px, 35vw, 420px)" }}>

                            {/* Dashed rings */}
                            <div style={{ position: "absolute", inset: -22, borderRadius: "50%", border: "0.5px solid var(--border-color)" }} />
                            <div style={{ position: "absolute", inset: -10, borderRadius: "50%", border: "1.5px dashed var(--border-color)" }} />

                            {/* Profile image */}
                            <img
                                src="/img/profile/profile-1.webp"
                                alt="Ishaan Gupta"
                                style={{
                                    width: "100%", height: "100%",
                                    objectFit: "cover",
                                    borderRadius: "50%",
                                    border: "4px solid var(--bg-color)",
                                    display: "block",
                                    position: "relative", zIndex: 1,
                                }}
                            />

                            {/* Badge — bottom left */}
                            <div style={{
                                position: "absolute", bottom: 18, left: -14, zIndex: 2,
                                background: "var(--card-bg)",
                                border: "1px solid var(--border-color)",
                                borderRadius: 12, padding: "8px 12px",
                                display: "flex", alignItems: "center", gap: 8,
                            }}>
                                <i className="bi bi-code-slash" style={{ fontSize: 16, color: "var(--primary-color)" }}></i>
                                <div>
                                    <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-color)", margin: 0 }}>Full Stack</p>
                                    <p style={{ fontSize: 11, color: "var(--muted-color)", margin: 0 }}>Developer</p>
                                </div>
                            </div>

                            {/* Badge — top right */}
                            <div style={{
                                position: "absolute", top: 18, right: -14, zIndex: 2,
                                background: "var(--card-bg)",
                                border: "1px solid var(--border-color)",
                                borderRadius: 12, padding: "8px 12px",
                                display: "flex", alignItems: "center", gap: 8,
                            }}>
                                <i className="bi bi-palette" style={{ fontSize: 16, color: "var(--primary-color)" }}></i>
                                <div>
                                    <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-color)", margin: 0 }}>UI / UX</p>
                                    <p style={{ fontSize: 11, color: "var(--muted-color)", margin: 0 }}>Designer</p>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            {/* Cursor blink keyframe */}
            <style>{`
                @keyframes heroBlinkCursor { 50% { opacity: 0; } }
                @media (max-width: 640px) {
                    #home .hero-text-col { text-align: center; }
                    #home .hero-text-col > div[style*="inline-flex"] { margin: 0 auto 14px; }
                    #home .hero-text-col > div[style*="flex-wrap"] { justify-content: center; }
                    #home p[style*="max-width: 440"] { margin: 0 auto 24px; }
                }
            `}</style>
        </section>
    );
}