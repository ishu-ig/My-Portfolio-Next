"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEducation } from "../Redux/ActionCreartors/EducationActionCreators";
import { getExperience } from "../Redux/ActionCreartors/ExperienceActionCreators";

const blockIconStyle = {
    width: 38, height: 38,
    borderRadius: 10,
    background: "var(--primary-color)",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
};

const cardStyle = {
    background: "var(--card-bg)",
    borderRadius: 10,
    border: "1px solid var(--border-color)",
    padding: "12px 14px",
    transition: "border-color 0.2s",
};

const periodPillStyle = {
    fontSize: 11, fontWeight: 500,
    color: "var(--primary-color)",
    background: "rgba(0,123,255,0.08)",
    padding: "2px 8px",
    borderRadius: 999,
    whiteSpace: "nowrap",
    flexShrink: 0,
};

export default function Resume() {
    const EducationStateData = useSelector(state => state.EducationStateData);
    const ExperienceStateData = useSelector(state => state.ExperienceStateData);
    const dispatch = useDispatch();

    useEffect(() => { dispatch(getExperience()); }, [ExperienceStateData.length]);
    useEffect(() => { dispatch(getEducation()); }, [EducationStateData.length]);

    const TimelineBlock = ({ icon, title, subtitle, items, renderItem }) => (
        <div style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border-color)",
            borderRadius: 14,
            padding: "20px 18px",
            height: "100%",
        }}>
            {/* Block header */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 14, borderBottom: "1px solid var(--border-color)", marginBottom: 4 }}>
                <div style={blockIconStyle}>
                    <i className={`bi ${icon}`} style={{ fontSize: 18, color: "#fff" }}></i>
                </div>
                <div>
                    <p style={{ fontSize: 16, fontWeight: 600, color: "var(--text-color)", margin: 0 }}>{title}</p>
                    <p style={{ fontSize: 12, color: "var(--muted-color)", margin: 0 }}>{subtitle}</p>
                </div>
            </div>

            {/* Timeline */}
            <div style={{ position: "relative", paddingLeft: 20, marginTop: 16 }}>
                {/* Vertical line */}
                <div style={{
                    position: "absolute", left: 6, top: 6, bottom: 6,
                    width: 1.5, background: "var(--border-color)",
                }} />

                {items.filter(x => x.active).map((item, i) => (
                    <div key={item._id || i} style={{ position: "relative", paddingBottom: i < items.filter(x => x.active).length - 1 ? 20 : 0 }}
                        data-aos="fade-up" data-aos-delay={i * 100}>
                        {/* Dot */}
                        <div style={{
                            position: "absolute", left: -17, top: 6,
                            width: 10, height: 10, borderRadius: "50%",
                            background: "var(--primary-color)",
                            border: "2px solid var(--bg-color)",
                            boxSizing: "border-box",
                        }} />
                        {/* Card */}
                        <div style={cardStyle} onMouseEnter={e => e.currentTarget.style.borderColor = "var(--primary-color)"} onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border-color)"}>
                            {renderItem(item)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <section
            id="resume"
            style={{ padding: "70px 16px", backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
        >
            <div className="container">

                {/* ── Header ── */}
                <div className="text-center mb-5" data-aos="fade-up">
                    <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--primary-color)", margin: "0 0 8px" }}>
                        My Journey
                    </p>
                    <h2 style={{ fontSize: "2rem", fontWeight: 600, color: "var(--text-color)", margin: "0 0 10px" }}>
                        Resume
                    </h2>
                    <svg viewBox="0 0 80 16" style={{ width: 70, display: "block", margin: "0 auto 14px" }}>
                        <path d="M0 8 C13 0,20 16,40 8 C60 0,67 16,80 8" stroke="var(--primary-color)" strokeWidth="2" fill="none" strokeLinecap="round" />
                    </svg>
                    <p style={{ fontSize: 15, color: "var(--muted-color)", maxWidth: 480, margin: "0 auto", lineHeight: 1.6 }}>
                        Professional experience and educational background.
                    </p>
                </div>

                {/* ── Two-column grid — stacks on mobile ── */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))",
                    gap: 24,
                    maxWidth: 960,
                    margin: "0 auto",
                }}>

                    {/* Work Experience */}
                    <TimelineBlock
                        icon="bi-briefcase-fill"
                        title="Work Experience"
                        subtitle="Professional journey & contributions"
                        items={ExperienceStateData}
                        renderItem={(item) => (
                            <>
                                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
                                    <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-color)", lineHeight: 1.3, margin: 0 }}>
                                        {item.jobTitle}
                                    </p>
                                    <span style={periodPillStyle}>{item.startDate}–{item.endDate}</span>
                                </div>
                                <p style={{ fontSize: 12, color: "var(--primary-color)", fontWeight: 500, margin: "0 0 6px", display: "flex", alignItems: "center", gap: 4 }}>
                                    <i className="bi bi-building" style={{ fontSize: 12 }}></i>
                                    {item.companyName}
                                </p>
                                <p style={{ fontSize: 12, color: "var(--muted-color)", lineHeight: 1.6, margin: 0 }}>
                                    {item.description}
                                </p>
                            </>
                        )}
                    />

                    {/* Education */}
                    <TimelineBlock
                        icon="bi-mortarboard-fill"
                        title="Education"
                        subtitle="Academic qualifications & learning"
                        items={EducationStateData}
                        renderItem={(item) => (
                            <>
                                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
                                    <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-color)", lineHeight: 1.3, margin: 0 }}>
                                        {item.degreeName}
                                    </p>
                                    <span style={periodPillStyle}>{item.startDate}–{item.endDate}</span>
                                </div>
                                <p style={{ fontSize: 12, color: "var(--primary-color)", fontWeight: 500, margin: "0 0 6px", display: "flex", alignItems: "center", gap: 4 }}>
                                    <i className="bi bi-bank" style={{ fontSize: 12 }}></i>
                                    {item.instituteName}
                                </p>
                                <p style={{ fontSize: 12, color: "var(--muted-color)", lineHeight: 1.6, margin: 0 }}>
                                    {item.description}
                                </p>
                            </>
                        )}
                    />

                </div>
            </div>
        </section>
    );
}