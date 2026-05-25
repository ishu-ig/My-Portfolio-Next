"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSkill } from "../Redux/ActionCreartors/SkillActionCreators";
import AOS from "aos";
import "aos/dist/aos.css";

function getLevelLabel(pct) {
    if (pct >= 85) return { label: "Expert", bg: "rgba(0,123,255,0.1)", color: "var(--primary-color)" };
    if (pct >= 70) return { label: "Advanced", bg: "rgba(0,180,120,0.1)", color: "#0a8a5c" };
    return { label: "Intermediate", bg: "rgba(255,160,0,0.1)", color: "#b57800" };
}

export default function Skills() {
    const SkillStateData = useSelector(state => state.SkillStateData);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSkill());
        AOS.init({ duration: 900, once: false });
        AOS.refresh();
    }, [dispatch]);

    const active = SkillStateData.filter(x => x.active);

    return (
        <section
            id="skills"
            style={{ padding: "70px 16px", backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
        >
            <div className="container">

                {/* ── Header ── */}
                <div className="text-center mb-5" data-aos="fade-up">
                    <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--primary-color)", margin: "0 0 8px" }}>
                        What I do
                    </p>
                    <h2 style={{ fontSize: "2rem", fontWeight: 600, color: "var(--text-color)", margin: "0 0 10px" }}>
                        Skills
                    </h2>
                    <svg viewBox="0 0 80 16" style={{ width: 70, display: "block", margin: "0 auto 14px" }}>
                        <path d="M0 8 C13 0,20 16,40 8 C60 0,67 16,80 8" stroke="var(--primary-color)" strokeWidth="2" fill="none" strokeLinecap="round" />
                    </svg>
                    <p style={{ fontSize: 15, color: "var(--muted-color)", maxWidth: 460, margin: "0 auto", lineHeight: 1.6 }}>
                        Enhancing my expertise through continuous learning and innovation.
                    </p>
                </div>

                {/* ── Grid ── */}
                <div style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(clamp(140px, 42vw, 210px), 1fr))",
    gap: 14,
    maxWidth: 960,
    margin: "0 auto",
}}>
                    {active.map((skill, index) => {
                        const { label, bg, color } = getLevelLabel(skill.level);
                        return (
                            <div
                                key={skill._id}
                                data-aos="fade-up"
                                data-aos-delay={index * 80}
                                style={{
                                    background: "var(--card-bg)",
                                    border: "1px solid var(--border-color)",
                                    borderRadius: 14,
                                    padding: "18px 16px",
                                    transition: "transform 0.22s, border-color 0.22s",
                                    textAlign: "left",
                                    cursor: "default",
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = "translateY(-5px)";
                                    e.currentTarget.style.borderColor = "var(--primary-color)";
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.borderColor = "var(--border-color)";
                                }}
                            >
                                {/* Top row: icon + level pill */}
                                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                                    <div style={{
                                        width: 38, height: 38, borderRadius: 10,
                                        background: "rgba(0,123,255,0.1)",
                                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                                    }}>
                                        <i className="bi bi-code-slash" style={{ fontSize: 18, color: "var(--primary-color)" }}></i>
                                    </div>
                                    <span style={{
                                        fontSize: 11, fontWeight: 500,
                                        background: bg, color,
                                        padding: "2px 8px", borderRadius: 999,
                                        flexShrink: 0,
                                    }}>
                                        {label}
                                    </span>
                                </div>

                                {/* Skill name */}
                                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-color)", margin: "8px 0 4px" }}>
                                    {skill.name}
                                </p>

                                {/* Description — 2-line clamp */}
                                <p style={{
                                    fontSize: 12, color: "var(--muted-color)", lineHeight: 1.5,
                                    marginBottom: 12,
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                }}>
                                    {skill.description}
                                </p>

                                {/* Progress bar row */}
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <div style={{
                                        flex: 1, height: 5,
                                        background: "var(--border-color)",
                                        borderRadius: 999, overflow: "hidden",
                                    }}>
                                        <div style={{
                                            height: "100%",
                                            width: `${skill.level}%`,
                                            background: "var(--primary-color)",
                                            borderRadius: 999,
                                            transition: "width 0.6s ease",
                                        }} />
                                    </div>
                                    <span style={{ fontSize: 11, fontWeight: 500, color: "var(--primary-color)", minWidth: 28, textAlign: "right" }}>
                                        {skill.level}%
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}