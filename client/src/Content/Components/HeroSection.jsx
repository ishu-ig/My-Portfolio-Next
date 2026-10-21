"use client";
import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import "aos/dist/aos.css";
import AOS from "aos";
import { useDispatch, useSelector } from "react-redux";
import { getAbout } from "../Redux/ActionCreators/AboutActionCreators";

import dynamic from "next/dynamic";
const HeroCanvas3D = dynamic(() => import("./HeroCanvas3D"), { ssr: false });

export default function HeroSection() {
    const dispatch = useDispatch();
    const AboutStateData = useSelector((state) => state.AboutStateData);
    const data = AboutStateData?.[0] ?? null;

    const words = useMemo(() => ["Full Stack Developer", "MERN Specialist", "UI/UX Designer", "Creative Technologist"], []);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [text, setText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        AOS.init({ duration: 800, once: false, mirror: true });
        dispatch(getAbout());
    }, [dispatch]);

    useEffect(() => {
        const typingSpeed = isDeleting ? 40 : 80;
        let timeout;

        if (!isDeleting && text === words[currentWordIndex]) {
            timeout = setTimeout(() => setIsDeleting(true), 1800);
        } else if (isDeleting && text === "") {
            setIsDeleting(false);
            setCurrentWordIndex((prev) => (prev + 1) % words.length);
        } else {
            timeout = setTimeout(() => {
                setText((prevText) =>
                    isDeleting
                        ? prevText.slice(0, -1)
                        : words[currentWordIndex].slice(0, prevText.length + 1)
                );
            }, typingSpeed);
        }

        return () => clearTimeout(timeout);
    }, [text, isDeleting, currentWordIndex, words]);

    const name = data?.name || "Ishaan Gupta";
    const shortDescription = data?.shortDescription || "I build full-stack web applications, custom software architectures, and intuitive modern interfaces.";
    const yearExperience = data?.yearExperience ?? 3;
    const projectsCompleted = data?.projectsCompleted ?? 15;
    const programmingQuestions = data?.programmingQuestions ?? 500;
    const resume = data?.resume;

    return (
        <section
            id="home"
            className="hero-section d-flex align-items-center"
        >
            <div className="container position-relative" style={{ zIndex: 2 }}>
                <div className="row align-items-center g-5">

                    {/* Left Column: Intro & Info */}
                    <div className="col-lg-6 text-center text-lg-start" data-aos="fade-right">

                        {/* Live Status Badge */}
                        <div className="hero-status-pill">
                            <span className="status-dot"></span>
                            <span>Available for new projects & collaborations</span>
                        </div>

                        {/* Main Name */}
                        <h1 className="fw-bold">
                            {name}
                        </h1>

                        {/* Typing Animation */}
                        <div className="typing-container justify-content-center justify-content-lg-start">
                            <span className="static-text">I build as a</span>
                            <span className="dynamic-text ps-1">{text}</span>
                            <span className="cursor">|</span>
                        </div>

                        {/* Lead Description */}
                        <p className="lead">
                            {shortDescription}
                        </p>

                        {/* CTA Buttons */}
                        <div className="action-buttons d-flex flex-wrap justify-content-center justify-content-lg-start gap-3 mt-4">
                            <a href="#portfolio" className="btn btn-primary btn-lg">
                                <i className="bi bi-rocket-takeoff-fill"></i>
                                View My Work
                            </a>
                            <a href="#contact" className="btn btn-secondary btn-lg">
                                <i className="bi bi-chat-dots-fill"></i>
                                Let's Talk
                            </a>
                            {resume && (
                                <a
                                    href={resume}
                                    className="btn btn-outline-dark btn-lg px-4"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <i className="bi bi-file-earmark-pdf"></i>
                                    Resume
                                </a>
                            )}
                        </div>

                        {/* Live Interactive Stats Cards */}
                        <div className="hero-stats">
                            <div className="stat-item">
                                <span className="stat-number">{yearExperience}+</span>
                                <p className="stat-label">Years Experience</p>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{projectsCompleted}+</span>
                                <p className="stat-label">Projects Completed</p>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{programmingQuestions}+</span>
                                <p className="stat-label">Problems Solved</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Interactive 3D Canvas & Floating Badges */}
                    <div className="col-lg-6 text-center" data-aos="fade-left" data-aos-delay="150">
                        <div className="hero-3d-scene-wrap">

                            {/* Ambient background glow aura that seamlessly merges with section background */}
                            <div className="hero-3d-ambient-glow" />

                            {/* Floating Tech Badges */}
                            <div className="hero-floating-pill pill-1">
                                <span style={{ fontSize: "1.1rem" }}>⚡</span>
                                <div>
                                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1 }}>Specialist</div>
                                    <div style={{ fontSize: "0.86rem", fontWeight: 700 }}>MERN Full Stack</div>
                                </div>
                            </div>

                            <div className="hero-floating-pill pill-2">
                                <span style={{ fontSize: "1.1rem" }}>🎯</span>
                                <div>
                                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1 }}>Passion</div>
                                    <div style={{ fontSize: "0.86rem", fontWeight: 700 }}>Clean UI/UX & Code</div>
                                </div>
                            </div>

                            <div className="hero-floating-pill pill-3">
                                <span style={{ fontSize: "1.1rem" }}>✨</span>
                                <div>
                                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1 }}>Modern Web</div>
                                    <div style={{ fontSize: "0.86rem", fontWeight: 700 }}>Interactive 3D</div>
                                </div>
                            </div>

                            {/* 3D Interactive WebGL Developer Object (Borderless & Merged with Background) */}
                            <div className="hero-3d-viewport">
                                <HeroCanvas3D />
                            </div>

                            {/* Interaction Hint */}
                            <div className="hero-3d-caption">
                                <i className="bi bi-arrows-move" /> Drag to rotate in 3D • Click for energy pulse
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            <style>{`
                .hero-3d-scene-wrap {
                    position: relative;
                    width: 100%;
                    max-width: 520px;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
                .hero-3d-ambient-glow {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 115%;
                    height: 115%;
                    border-radius: 50%;
                    background: radial-gradient(circle at 50% 50%, rgba(99,102,241,0.2) 0%, rgba(6,182,212,0.08) 42%, transparent 72%);
                    filter: blur(32px);
                    pointer-events: none;
                    z-index: 1;
                }
                .hero-3d-viewport {
                    position: relative;
                    z-index: 2;
                    width: 100%;
                    height: 480px;
                    max-width: 480px;
                    margin: 0 auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: none !important;
                    box-shadow: none !important;
                    background: transparent !important;
                    overflow: visible !important;
                }
                .hero-3d-caption {
                    position: relative;
                    z-index: 3;
                    margin-top: -10px;
                    font-size: 0.76rem;
                    font-weight: 600;
                    color: var(--text-muted);
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 5px 14px;
                    border-radius: 99px;
                    background: rgba(255, 255, 255, 0.04);
                    border: 1px solid var(--card-border, rgba(120, 120, 160, 0.14));
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                }
                .pill-1 {
                    top: 25px;
                    left: -20px;
                    z-index: 4;
                }
                .pill-2 {
                    bottom: 35px;
                    right: -20px;
                    z-index: 4;
                }
                .pill-3 {
                    top: 48%;
                    right: -28px;
                    z-index: 4;
                    animation: floatSlow 5.5s ease-in-out infinite alternate;
                    animation-delay: 1.6s;
                }
                @media (max-width: 991px) {
                    .hero-3d-viewport {
                        height: 400px;
                        max-width: 400px;
                    }
                    .pill-1 { top: 8px; left: -10px; }
                    .pill-2 { bottom: 25px; right: -10px; }
                    .pill-3 { display: none; }
                }
                @media (max-width: 575px) {
                    .hero-3d-viewport {
                        height: 330px;
                        max-width: 330px;
                    }
                    .hero-3d-caption {
                        font-size: 0.68rem;
                        margin-top: 4px;
                    }
                    .pill-1 { top: -5px; left: 0; padding: 6px 12px; }
                    .pill-2 { bottom: 10px; right: 0; padding: 6px 12px; }
                    .pill-3 { display: none; }
                }
            `}</style>
        </section>
    );
}