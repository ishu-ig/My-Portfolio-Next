"use client";
import React, { useEffect, useState } from 'react';
import 'aos/dist/aos.css';
import AOS from 'aos';
import { useDispatch, useSelector } from 'react-redux';
import { getAbout } from '../Redux/ActionCreators/AboutActionCreators';
import dynamic from 'next/dynamic';

const AboutGlobe3D = dynamic(() => import('./AboutGlobe3D'), { ssr: false });

export default function About() {
    const dispatch = useDispatch();
    const AboutStateData = useSelector((state) => state.AboutStateData);
    const data = AboutStateData?.length ? AboutStateData[0] : null;
    const loading = !data;
    const [copiedIndex, setCopiedIndex] = useState(null);

    useEffect(() => {
        AOS.init({ duration: 800, once: false, mirror: true });
        if (!AboutStateData || !AboutStateData.length) {
            dispatch(getAbout());
        }
    }, [dispatch, AboutStateData]);

    const handleCopy = (text, idx) => {
        if (!navigator.clipboard) return;
        navigator.clipboard.writeText(text);
        setCopiedIndex(idx);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    if (loading) {
        return (
            <section id="about" className="about-section">
                <div className="container">
                    <div className="text-center mb-5">
                        <span className="section-badge"><i className="bi bi-person-lines-fill"></i> Background</span>
                        <h2 className="section-title">About Me</h2>
                        <div className="title-shape">
                            <svg viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M 0,10 C 40,0 60,20 100,10 C 140,0 160,20 200,10" fill="none" stroke="currentColor" strokeWidth="2" />
                            </svg>
                        </div>
                    </div>
                    <div className="skeleton-shimmer" style={{ minHeight: "420px" }}>
                        <div className="row align-items-center g-5">
                            <div className="col-lg-5 text-center">
                                <div className="skeleton-bar mx-auto" style={{ width: "100%", maxWidth: "360px", height: "340px", borderRadius: "20px" }}></div>
                            </div>
                            <div className="col-lg-7">
                                <div className="skeleton-bar mb-3" style={{ height: "28px", width: "70%" }}></div>
                                <div className="skeleton-bar mb-2" style={{ height: "16px", width: "95%" }}></div>
                                <div className="skeleton-bar mb-4" style={{ height: "16px", width: "80%" }}></div>
                                <div className="row g-2">
                                    {[1, 2, 3, 4].map(n => (
                                        <div key={n} className="col-6">
                                            <div className="skeleton-bar" style={{ height: "48px", borderRadius: "10px" }}></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (!data) return null;

    // Concise, non-redundant personal contact info
    const personalInfo = [
        { label: 'Email',       value: data.email,                              icon: 'bi-envelope-at-fill',  copyable: true },
        { label: 'Phone',       value: data.phone,                              icon: 'bi-telephone-fill',    copyable: true },
        { label: 'Location',    value: data.nationality || "India",             icon: 'bi-geo-alt-fill',      copyable: false },
        { label: 'Experience',  value: `${data.yearExperience || 3}+ Years`,    icon: 'bi-briefcase-fill',    copyable: false },
    ].filter((item) => item.value);

    const profilePic = data.pic || "/img/profile/my_image.jpg";
    const questionsCount = data.programmingQuestions || 500;

    return (
        <section id="about" className="about-section">
            {/* Ambient Background Glow Orbs for Seamless Background Merging */}
            <div className="about-ambient-orb orb-1" />
            <div className="about-ambient-orb orb-2" />

            <div className="container" style={{ position: "relative", zIndex: 2 }}>

                {/* Section Title */}
                <div className="text-center mb-5" data-aos="fade-up">
                    <span className="section-badge">
                        <i className="bi bi-person-lines-fill"></i>
                        Background
                    </span>
                    <h2 className="section-title">About Me</h2>
                    <div className="title-shape">
                        <svg viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M 0,10 C 40,0 60,20 100,10 C 140,0 160,20 200,10"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            />
                        </svg>
                    </div>
                    <p className="section-subtitle">
                        {data.subtitle || "Full-stack developer building scalable software with modern UI/UX."}
                    </p>
                </div>

                {/* About Seamless Glass Enclosure */}
                <div className="about-card-container" data-aos="fade-up" data-aos-delay="100">
                    <div className="row align-items-center g-5">

                        {/* Column 1: Interactive 3D Developer Scene */}
                        <div className="col-lg-5 text-center" data-aos="fade-right" data-aos-delay="150">
                            <div className="about-3d-scene-wrapper">

                                {/* Ambient radial aura that blends the 3D model into the card & background */}
                                <div className="about-3d-radial-glow" />

                                {/* Subtle Floating Badges */}
                                <div className="about-floating-pill pill-top-left">
                                    <span style={{ fontSize: "1rem" }}>⚡</span>
                                    <span>Full-Stack MERN</span>
                                </div>

                                <div className="about-floating-pill pill-top-right">
                                    <span style={{ fontSize: "1rem" }}>🧠</span>
                                    <span>{questionsCount}+ Solved</span>
                                </div>

                                {/* 3D WebGL Holographic Cyber-Globe & Tech Orbit */}
                                <div className="about-3d-viewport">
                                    <AboutGlobe3D />
                                </div>

                                {/* Interactive Identity & Status Bar */}
                                <div className="about-identity-bar">
                                    <div className="about-id-avatar">
                                        <img
                                            src={profilePic}
                                            alt={data.name || "Ishaan Gupta"}
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = "/img/profile/Ishaan_ig.png";
                                            }}
                                        />
                                    </div>
                                    <div className="text-start" style={{ flexGrow: 1, minWidth: 0 }}>
                                        <div className="about-id-name">{data.name || "Ishaan Gupta"}</div>
                                        <div className="about-id-status">
                                            <span className="live-status-dot" />
                                            <span>Available for Projects &amp; Roles</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Interaction Caption */}
                                <div className="about-3d-caption">
                                    <i className="bi bi-globe2" /> Drag globe in 3D • Click for energy ripple
                                </div>

                            </div>
                        </div>

                        {/* Column 2: Streamlined Story, Highlights & Contact Info */}
                        <div className="col-lg-7" data-aos="fade-left" data-aos-delay="200">
                            <div>
                                <h3 className="section-badge mb-2" style={{ textTransform: "none", fontSize: "0.85rem" }}>
                                    ✨ My Journey &amp; Focus
                                </h3>
                                <h2 className="fw-bold mb-3" style={{ fontSize: "clamp(1.6rem, 3.2vw, 2.2rem)", color: "var(--text-color)" }}>
                                    {data.heading || "Engineering seamless digital products with precision"}
                                </h2>

                                {/* Single, clean description */}
                                <p className="mb-4" style={{ color: "var(--text-color)", fontSize: "0.98rem", lineHeight: 1.75 }}>
                                    {data.shortDescription || data.longDescription}
                                </p>

                                {/* 3 Crisp Highlights (replacing verbose paragraphs) */}
                                <div className="about-highlights-row mb-4">
                                    <div className="about-highlight-pill">
                                        <i className="bi bi-layers-half" style={{ color: "#6366f1" }} />
                                        <span>Full-Stack Architecture</span>
                                    </div>
                                    <div className="about-highlight-pill">
                                        <i className="bi bi-lightning-charge-fill" style={{ color: "#06b6d4" }} />
                                        <span>{questionsCount}+ Algorithmic Problems</span>
                                    </div>
                                    <div className="about-highlight-pill">
                                        <i className="bi bi-palette2" style={{ color: "#a855f7" }} />
                                        <span>Modern UI/UX &amp; 3D Web</span>
                                    </div>
                                </div>

                                {/* Personal Info Grid (Clean 2x2, non-redundant) */}
                                <div className="about-info-grid">
                                    {personalInfo.map((item, index) => (
                                        <div
                                            key={index}
                                            className="about-info-tile"
                                            onClick={() => item.copyable && handleCopy(item.value, index)}
                                            style={{ cursor: item.copyable ? "pointer" : "default" }}
                                            title={item.copyable ? "Click to copy" : ""}
                                        >
                                            <div className="about-tile-icon">
                                                <i className={`bi ${item.icon}`}></i>
                                            </div>
                                            <div style={{ flexGrow: 1, minWidth: 0 }}>
                                                <p className="about-tile-label">{item.label}</p>
                                                <p className="about-tile-val text-truncate">{item.value}</p>
                                            </div>
                                            {item.copyable && (
                                                <span
                                                    className="badge bg-primary rounded-pill ms-auto"
                                                    style={{ fontSize: "0.68rem", opacity: copiedIndex === index ? 1 : 0.6 }}
                                                >
                                                    {copiedIndex === index ? "Copied! ✓" : "Copy"}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Action Buttons */}
                                <div className="d-flex flex-wrap gap-3 mt-4 pt-2">
                                    <a href="#contact" className="btn btn-primary">
                                        <i className="bi bi-send-fill"></i>
                                        Send Message
                                    </a>
                                    {data.resume && (
                                        <a
                                            href={data.resume}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="btn btn-outline-dark"
                                        >
                                            <i className="bi bi-download"></i>
                                            Download CV
                                        </a>
                                    )}
                                </div>

                            </div>
                        </div>

                    </div>
                </div>

            </div>

            <style>{`
                .about-section {
                    position: relative;
                    padding: 90px 0 80px;
                    background: transparent !important;
                    overflow: hidden;
                }

                /* Ambient Background Blending Orbs */
                .about-ambient-orb {
                    position: absolute;
                    border-radius: 50%;
                    pointer-events: none;
                    filter: blur(80px);
                    z-index: 1;
                    opacity: 0.5;
                    animation: orbDrift 14s ease-in-out infinite alternate;
                }
                .about-ambient-orb.orb-1 {
                    top: 15%;
                    left: -5%;
                    width: 360px;
                    height: 360px;
                    background: radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%);
                }
                .about-ambient-orb.orb-2 {
                    bottom: 10%;
                    right: -5%;
                    width: 380px;
                    height: 380px;
                    background: radial-gradient(circle, rgba(6, 182, 212, 0.16) 0%, transparent 70%);
                    animation-delay: -7s;
                }
                @keyframes orbDrift {
                    0% { transform: translateY(0) scale(1); }
                    100% { transform: translateY(-30px) scale(1.1); }
                }

                /* Completely Seamless Layout (Blended 100% with Background) */
                .about-card-container {
                    background: transparent !important;
                    border: none !important;
                    box-shadow: none !important;
                    padding: 0 !important;
                    backdrop-filter: none !important;
                    -webkit-backdrop-filter: none !important;
                    position: relative;
                }
                .about-card-container::before {
                    display: none !important;
                }

                /* 3D Scene Wrapper */
                .about-3d-scene-wrapper {
                    position: relative;
                    width: 100%;
                    max-width: 440px;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
                .about-3d-radial-glow {
                    position: absolute;
                    top: 45%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 110%;
                    height: 110%;
                    border-radius: 50%;
                    background: radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.16) 0%, rgba(6, 182, 212, 0.05) 45%, transparent 72%);
                    filter: blur(26px);
                    pointer-events: none;
                    z-index: 1;
                }
                .about-3d-viewport {
                    position: relative;
                    z-index: 2;
                    width: 100%;
                    height: 360px;
                    max-width: 420px;
                    margin: 0 auto;
                    border: none !important;
                    box-shadow: none !important;
                    background: transparent !important;
                    overflow: visible !important;
                }

                /* Floating Tech Pills on 3D Model */
                .about-floating-pill {
                    position: absolute;
                    z-index: 4;
                    background: var(--glass-bg, rgba(15, 17, 30, 0.85));
                    backdrop-filter: blur(14px);
                    -webkit-backdrop-filter: blur(14px);
                    border: 1px solid var(--glass-border, rgba(120, 120, 160, 0.2));
                    padding: 6px 14px;
                    border-radius: 99px;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: var(--text-color);
                    animation: floatSlow 5s ease-in-out infinite alternate;
                    pointer-events: none;
                }
                .pill-top-left {
                    top: 15px;
                    left: -10px;
                    animation-delay: 0s;
                }
                .pill-top-right {
                    top: 20px;
                    right: -10px;
                    animation-delay: 1.5s;
                }

                /* Identity Bar below 3D Model */
                .about-identity-bar {
                    position: relative;
                    z-index: 3;
                    width: 100%;
                    max-width: 350px;
                    margin-top: -12px;
                    background: var(--card-bg, rgba(255, 255, 255, 0.05));
                    border: 1px solid var(--card-border, rgba(120, 120, 160, 0.16));
                    border-radius: 16px;
                    padding: 8px 14px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
                    transition: transform 0.3s ease;
                }
                .about-identity-bar:hover {
                    transform: translateY(-2px);
                    border-color: rgba(99, 102, 241, 0.4);
                }
                .about-id-avatar {
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    overflow: hidden;
                    border: 1.5px solid rgba(99, 102, 241, 0.5);
                    flex-shrink: 0;
                }
                .about-id-avatar img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .about-id-name {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: var(--text-color);
                    line-height: 1.2;
                }
                .about-id-status {
                    font-size: 0.72rem;
                    color: var(--text-muted);
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    margin-top: 2px;
                }
                .live-status-dot {
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background: #10b981;
                    box-shadow: 0 0 8px #10b981;
                    animation: statusPulse 2s infinite;
                }
                @keyframes statusPulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.4; transform: scale(1.3); }
                }

                .about-3d-caption {
                    font-size: 0.72rem;
                    color: var(--text-muted);
                    font-weight: 600;
                    margin-top: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    opacity: 0.75;
                }

                /* Streamlined Highlights Row */
                .about-highlights-row {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 9px;
                }
                .about-highlight-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 7px;
                    padding: 6px 14px;
                    border-radius: 99px;
                    background: var(--card-bg, rgba(255, 255, 255, 0.04));
                    border: 1px solid var(--card-border, rgba(120, 120, 160, 0.16));
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 0.78rem;
                    font-weight: 600;
                    color: var(--text-color);
                    transition: transform 0.25s, border-color 0.25s;
                }
                .about-highlight-pill:hover {
                    transform: translateY(-2px);
                    border-color: rgba(99, 102, 241, 0.4);
                }

                .about-info-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 12px;
                }

                /* ── Tablet ── */
                @media (max-width: 991px) {
                    .about-section { padding: 70px 0 60px; }
                    .about-card-container { padding: 0 !important; }
                    .about-3d-viewport { height: 290px; }
                    .about-3d-scene-wrapper { max-width: 360px; }
                    .pill-top-left { left: 4px; top: 10px; font-size: 0.72rem; padding: 5px 11px; }
                    .pill-top-right { right: 4px; top: 10px; font-size: 0.72rem; padding: 5px 11px; }
                    .about-identity-bar { max-width: 320px; }
                }

                /* ── Mobile (<= 767px) ── */
                @media (max-width: 767px) {
                    .about-section { padding: 50px 0 40px; }

                    /* Zero horizontal negative margins from Bootstrap gutters */
                    .about-card-container .row {
                        flex-direction: column;
                        margin-left: 0 !important;
                        margin-right: 0 !important;
                        gap: 20px !important;
                    }
                    .about-card-container .col-lg-5,
                    .about-card-container .col-lg-7 {
                        width: 100% !important;
                        max-width: 100% !important;
                        padding-left: 0 !important;
                        padding-right: 0 !important;
                    }

                    /* 3D Scene Container */
                    .about-3d-scene-wrapper {
                        max-width: 330px;
                        margin: 0 auto;
                        position: relative;
                    }
                    .about-3d-viewport {
                        height: 240px;
                        max-width: 100%;
                    }
                    .about-3d-radial-glow { filter: blur(16px); }

                    /* Floating pills — kept inside bounds */
                    .about-floating-pill {
                        font-size: 0.68rem;
                        padding: 4px 9px;
                        gap: 4px;
                        border-radius: 99px;
                    }
                    .pill-top-left { left: 4px; top: 6px; }
                    .pill-top-right { right: 4px; top: 6px; }

                    /* Identity bar */
                    .about-identity-bar {
                        max-width: 95%;
                        margin: -6px auto 0;
                        padding: 7px 12px;
                        border-radius: 12px;
                    }
                    .about-id-avatar { width: 32px; height: 32px; }
                    .about-id-name { font-size: 0.8rem; }
                    .about-id-status { font-size: 0.68rem; }

                    /* Caption */
                    .about-3d-caption { display: none; }

                    /* Story Content */
                    .about-card-container h2 {
                        font-size: 1.35rem !important;
                        line-height: 1.3 !important;
                    }
                    .about-card-container p {
                        font-size: 0.88rem !important;
                        line-height: 1.65 !important;
                    }

                    /* Highlights row */
                    .about-highlights-row {
                        gap: 6px;
                    }
                    .about-highlight-pill {
                        font-size: 0.72rem;
                        padding: 5px 10px;
                        gap: 5px;
                    }

                    /* Info grid — clean 2-column layout */
                    .about-info-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 8px;
                    }
                    .about-info-tile {
                        padding: 8px 10px;
                        gap: 8px;
                        border-radius: 10px;
                    }
                    .about-tile-icon {
                        width: 28px;
                        height: 28px;
                        font-size: 0.82rem;
                        border-radius: 8px;
                    }
                    .about-tile-label { font-size: 0.6rem; }
                    .about-tile-val { font-size: 0.74rem; }
                    .about-copy-btn { font-size: 0.62rem; padding: 2px 6px; }

                    /* Action buttons */
                    .about-card-container .d-flex.gap-3 {
                        gap: 8px !important;
                    }
                    .about-card-container .btn {
                        font-size: 0.82rem;
                        padding: 8px 16px;
                        border-radius: 8px;
                    }
                }

                /* ── Small Mobile (≤480px) ── */
                @media (max-width: 480px) {
                    .about-3d-viewport { height: 215px; }
                    .about-3d-scene-wrapper { max-width: 290px; }
                    .about-floating-pill { font-size: 0.64rem; padding: 3px 8px; }
                    .pill-top-left { left: 0; top: 4px; }
                    .pill-top-right { right: 0; top: 4px; }
                }

                /* ── Narrow Mobile (≤360px) ── */
                @media (max-width: 360px) {
                    .about-3d-viewport { height: 185px; }
                    .about-card-container h2 { font-size: 1.18rem !important; }
                    .about-info-grid { grid-template-columns: 1fr; gap: 7px; }
                    .about-floating-pill span:last-child { display: none; } /* Show icon only */
                    .about-floating-pill { padding: 4px 6px; }
                }
            `}</style>
        </section>
    );
}