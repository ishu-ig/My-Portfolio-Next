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
        AOS.init({ duration: 900, once: true });
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
                        <div className="hero-avatar-wrapper">

                            {/* Glowing backdrop aura */}
                            <div className="hero-glow-1"></div>

                            {/* Floating Tech Badges */}
                            <div className="hero-floating-pill pill-1">
                                <span style={{ fontSize: "1.1rem" }}>⚡</span>
                                <div>
                                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1 }}>Specialist</div>
                                    <div style={{ fontSize: "0.86rem", fontWeight: 700 }}>MERN Full Stack</div>
                                </div>
                            </div>

                            <div className="hero-floating-pill pill-2">
                                <span style={{ fontSize: "1.1rem" }}>🎯</span>
                                <div>
                                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1 }}>Passion</div>
                                    <div style={{ fontSize: "0.86rem", fontWeight: 700 }}>Clean UI/UX & Code</div>
                                </div>
                            </div>

                            {/* 3D Interactive WebGL Developer Object */}
                            <div
                                className="hero-avatar-frame hero-3d-frame"
                                style={{
                                    position: "relative",
                                    width: "100%",
                                    height: 440,
                                    maxWidth: 440,
                                    margin: "0 auto",
                                    background: "radial-gradient(circle at 50% 50%, rgba(99,102,241,0.12), transparent 70%)",
                                }}
                            >
                                <HeroCanvas3D />
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}