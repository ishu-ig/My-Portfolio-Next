"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import 'aos/dist/aos.css';
import AOS from 'aos';
import { useDispatch, useSelector } from 'react-redux';
import { getAbout } from '../Redux/ActionCreators/AboutActionCreators';
import dynamic from 'next/dynamic';

const DeveloperWorkspace3D = dynamic(() => import('./DeveloperWorkspace3D'), { ssr: false });

export default function About() {
    const dispatch = useDispatch();
    const AboutStateData = useSelector((state) => state.AboutStateData);
    const [data, setData] = useState(null);
    const [copiedIndex, setCopiedIndex] = useState(null);

    useEffect(() => {
        AOS.init({ duration: 900, once: true });
        dispatch(getAbout());
    }, [dispatch]);

    useEffect(() => {
        if (AboutStateData?.length) {
            setData(AboutStateData[0]);
        }
    }, [AboutStateData]);

    if (!data) return null;

    const personalInfo = [
        { label: 'Name',        value: data.name,        icon: 'bi-person-badge-fill', copyable: false },
        { label: 'Email',       value: data.email,       icon: 'bi-envelope-at-fill',  copyable: true },
        { label: 'Phone',       value: data.phone,       icon: 'bi-telephone-fill',    copyable: true },
        { label: 'Occupation',  value: data.occupation,  icon: 'bi-code-slash',        copyable: false },
        { label: 'Age',         value: data.age ? `${data.age} Years` : null, icon: 'bi-calendar-event-fill', copyable: false },
        { label: 'Location',    value: data.nationality, icon: 'bi-geo-alt-fill',      copyable: false },
    ].filter((item) => item.value);

    const handleCopy = (text, idx) => {
        if (!navigator.clipboard) return;
        navigator.clipboard.writeText(text);
        setCopiedIndex(idx);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <section id="about" className="about-section">
            <div className="container">

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
                        {data.subtitle || "Get to know more about my journey, technical background, and passion for engineering."}
                    </p>
                </div>

                {/* About Content Card Container */}
                <div className="about-card-container" data-aos="fade-up" data-aos-delay="100">
                    <div className="row align-items-center g-5">

                        {/* 3D Interactive Developer Workstation Column */}
                        <div className="col-lg-5 text-center" data-aos="fade-right" data-aos-delay="150">
                            <div
                                className="position-relative d-inline-block w-100 about-profile-img-wrap"
                                style={{
                                    position: 'relative',
                                    width: '100%',
                                    height: 420,
                                    maxWidth: 420,
                                    background: "radial-gradient(circle at 50% 50%, rgba(99,102,241,0.15), transparent 70%)",
                                    borderRadius: "var(--radius-xl)",
                                    border: "1px solid var(--card-border)",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: "16px",
                                    overflow: "hidden"
                                }}
                            >
                                <div style={{ width: "100%", height: 350, position: "relative" }}>
                                    <DeveloperWorkspace3D />
                                </div>
                                <div style={{
                                    fontSize: "0.76rem",
                                    color: "var(--text-muted)",
                                    fontWeight: 600,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                    marginTop: 4
                                }}>
                                    <i className="bi bi-controller"></i> Interactive 3D Dev Station • Drag or move cursor to tilt
                                </div>
                            </div>
                        </div>

                        {/* Story and Personal Info Column */}
                        <div className="col-lg-7" data-aos="fade-left" data-aos-delay="200">
                            <div>
                                <h3 className="section-badge mb-2" style={{ textTransform: "none", fontSize: "0.85rem" }}>
                                    ✨ My Story & Expertise
                                </h3>
                                <h2 className="fw-bold mb-3" style={{ fontSize: "clamp(1.7rem, 3.5vw, 2.3rem)", color: "var(--text-color)" }}>
                                    {data.heading || "Engineering seamless digital products with precision"}
                                </h2>

                                <p className="lead mb-3" style={{ color: "var(--text-color)", fontWeight: 500 }}>
                                    {data.shortDescription}
                                </p>

                                <p className="mb-4" style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.75 }}>
                                    {data.longDescription}
                                </p>

                                {/* Personal Info Grid */}
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
        </section>
    );
}