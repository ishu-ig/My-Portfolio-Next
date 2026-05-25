"use client";
import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Achievement() {
    const [counters, setCounters] = useState([
        { icon: "bi bi-briefcase", label: "Projects Built", target: 15, value: 0 },
        { icon: "bi bi-code-slash", label: "HackerRank", stat: "5 Star Coder", isStatic: true },
        { icon: "bi bi-lightbulb", label: "LeetCode", stat: "30 Problems Solved", isStatic: true },
        { icon: "bi bi-patch-check", label: "Certifications Earned", target: 10, value: 0 },
    ]);
    const [hovered, setHovered] = useState(null);

    useEffect(() => {
        AOS.init({ duration: 900, once: false });
        AOS.refresh();
    }, []);

    useEffect(() => {
        const intervals = counters.map((counter, index) => {
            if (!counter.target) return null;
            let start = 0;
            const increment = Math.ceil(counter.target / 80);
            return setInterval(() => {
                start += increment;
                if (start >= counter.target) start = counter.target;
                setCounters(prev => {
                    const updated = [...prev];
                    updated[index] = { ...counter, value: start };
                    return updated;
                });
            }, 30);
        });
        return () => intervals.forEach(i => i && clearInterval(i));
    }, []);

    return (
        <section style={{ padding: "70px 16px", backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}>
            <div className="container">

                {/* Header */}
                <div className="text-center mb-5" data-aos="fade-up">
                    <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--primary-color)", margin: "0 0 8px" }}>
                        My Milestones
                    </p>
                    <h2 style={{ fontSize: "2rem", fontWeight: 600, color: "var(--text-color)", margin: "0 0 10px" }}>
                        Achievements
                    </h2>
                    <svg viewBox="0 0 80 16" style={{ width: 70, display: "block", margin: "0 auto 14px" }}>
                        <path d="M0 8 C13 0,20 16,40 8 C60 0,67 16,80 8" stroke="var(--primary-color)" strokeWidth="2" fill="none" strokeLinecap="round" />
                    </svg>
                    <p style={{ fontSize: 15, color: "var(--muted-color)", maxWidth: 460, margin: "0 auto", lineHeight: 1.6 }}>
                        Showcasing what I have achieved so far.
                    </p>
                </div>

                {/* Grid */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(clamp(130px, 42vw, 200px), 1fr))",
                    gap: 14, maxWidth: 860, margin: "0 auto",
                }}>
                    {counters.map((counter, index) => (
                        <div
                            key={index}
                            data-aos="fade-up"
                            data-aos-delay={index * 100}
                            onMouseEnter={() => setHovered(index)}
                            onMouseLeave={() => setHovered(null)}
                            style={{
                                background: "var(--card-bg)",
                                border: `1px solid ${hovered === index ? "var(--primary-color)" : "var(--border-color)"}`,
                                borderRadius: 14, padding: "22px 16px",
                                textAlign: "center",
                                transition: "transform 0.22s, border-color 0.22s",
                                transform: hovered === index ? "translateY(-5px)" : "translateY(0)",
                                display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                            }}
                        >
                            {/* Icon box */}
                            <div style={{
                                width: 48, height: 48, borderRadius: 12,
                                background: "rgba(0,123,255,0.1)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                                <i className={counter.icon} style={{ fontSize: 22, color: "var(--primary-color)" }}></i>
                            </div>

                            {counter.isStatic ? (
                                <>
                                    <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-color)", margin: 0 }}>{counter.label}</p>
                                    <span style={{
                                        fontSize: 12, fontWeight: 500,
                                        color: "#16a34a", background: "rgba(22,163,74,0.1)",
                                        padding: "2px 10px", borderRadius: 999,
                                    }}>
                                        {counter.stat}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span style={{ fontSize: 28, fontWeight: 700, color: "var(--primary-color)", lineHeight: 1 }}>
                                        {counter.value}
                                    </span>
                                    <p style={{ fontSize: 12, color: "var(--muted-color)", margin: 0 }}>{counter.label}</p>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}