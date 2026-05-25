"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCertificate } from "../Redux/ActionCreartors/CertificateActionCreators";
import Link from "next/link";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Certificates() {
    const CertificateStateData = useSelector(state => state.CertificateStateData);
    const dispatch = useDispatch();
    const [hovered, setHovered] = useState(null);

    useEffect(() => {
        dispatch(getCertificate());
        AOS.init({ duration: 900, once: false });
        AOS.refresh();
    }, [dispatch]);

    const active = CertificateStateData.filter(x => x.active);

    return (
        <section id="certificate" style={{ padding: "70px 0", backgroundColor: "var(--bg-color)" }}>
            <div className="container">

                {/* ── Header ── */}
                <div className="text-center mb-4" data-aos="fade-up">
                    <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--primary-color)", margin: "0 0 8px" }}>
                        Achievements
                    </p>
                    <h2 style={{ fontSize: "2rem", fontWeight: 600, color: "var(--text-color)", margin: "0 0 10px" }}>
                        Certificates
                    </h2>
                    <svg viewBox="0 0 80 16" style={{ width: 70, display: "block", margin: "0 auto 14px" }}>
                        <path d="M0 8 C13 0,20 16,40 8 C60 0,67 16,80 8" stroke="var(--primary-color)" strokeWidth="2" fill="none" strokeLinecap="round" />
                    </svg>
                    <p style={{ fontSize: 15, color: "var(--muted-color)", maxWidth: 480, margin: "0 auto", lineHeight: 1.6 }}>
                        Professional certifications that validate my expertise and commitment to continuous learning.
                    </p>
                </div>

                {/* ── Stats Row ── */}
                <div data-aos="fade-up" data-aos-delay="100" style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    gap: 32, padding: "14px 24px",
                    background: "var(--card-bg)",
                    borderRadius: 12,
                    border: "1px solid var(--border-color)",
                    marginBottom: 36,
                    flexWrap: "wrap",
                }}>
                    {[
                        { n: `${active.length}+`, l: "Certificates" },
                        { n: `${new Set(active.map(c => c.issuedBy)).size}`, l: "Issuers" },
                        { n: `${new Set(active.map(c => c.category)).size || "3"}`, l: "Domains" },
                    ].map((s, i) => (
                        <React.Fragment key={i}>
                            {i > 0 && <div style={{ width: 1, height: 32, background: "var(--border-color)" }} />}
                            <div style={{ textAlign: "center" }}>
                                <span style={{ fontSize: "1.4rem", fontWeight: 600, color: "var(--primary-color)", display: "block" }}>{s.n}</span>
                                <span style={{ fontSize: 11, color: "var(--muted-color)" }}>{s.l}</span>
                            </div>
                        </React.Fragment>
                    ))}
                </div>

                {/* ── Grid ── */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
                    gap: 18,
                }}>
                    {active.map((cert, index) => (
                        <div
                            key={cert._id}
                            data-aos="fade-up"
                            data-aos-delay={index * 70}
                            onMouseEnter={() => setHovered(cert._id)}
                            onMouseLeave={() => setHovered(null)}
                            style={{
                                background: "var(--card-bg)",
                                borderRadius: 14,
                                border: `1px solid ${hovered === cert._id ? "var(--primary-color)" : "var(--border-color)"}`,
                                overflow: "hidden",
                                transition: "transform 0.22s, border-color 0.22s",
                                transform: hovered === cert._id ? "translateY(-7px)" : "translateY(0)",
                                position: "relative",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            {/* Verified ribbon */}
                            <div style={{
                                position: "absolute", top: 12, right: 0,
                                background: "var(--primary-color)", color: "#fff",
                                fontSize: 10, fontWeight: 500,
                                padding: "3px 10px 3px 8px",
                                borderRadius: "4px 0 0 4px",
                                zIndex: 2, display: "flex", alignItems: "center", gap: 4,
                            }}>
                                <i className="bi bi-patch-check-fill" style={{ fontSize: 10 }}></i>
                                Verified
                            </div>

                            {/* Image */}
                            <Link href={cert.pic} target="_blank" style={{ display: "block", position: "relative", overflow: "hidden", height: 155 }}>
                                <img
                                    src={cert.pic}
                                    alt={cert.name}
                                    loading="lazy"
                                    style={{
                                        width: "100%", height: "100%",
                                        objectFit: "cover", display: "block",
                                        transition: "transform 0.3s",
                                        transform: hovered === cert._id ? "scale(1.06)" : "scale(1)",
                                        backgroundColor: "var(--card-bg)",
                                    }}
                                />
                                <div style={{
                                    position: "absolute", inset: 0,
                                    background: "rgba(10,18,45,0.6)",
                                    opacity: hovered === cert._id ? 1 : 0,
                                    transition: "opacity 0.22s",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    <span style={{
                                        background: "#fff", color: "#111",
                                        fontSize: 11, fontWeight: 500,
                                        padding: "5px 14px", borderRadius: 999,
                                        display: "flex", alignItems: "center", gap: 5,
                                    }}>
                                        <i className="bi bi-box-arrow-up-right" style={{ fontSize: 12 }}></i>
                                        View Certificate
                                    </span>
                                </div>
                            </Link>

                            {/* Body */}
                            <div style={{ padding: "12px 14px 14px", flex: 1, display: "flex", flexDirection: "column" }}>

                                {/* Issuer row */}
                                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
                                    <span style={{
                                        width: 6, height: 6, borderRadius: "50%",
                                        background: "var(--primary-color)", flexShrink: 0,
                                    }} />
                                    <span style={{
                                        fontSize: 11, color: "var(--primary-color)", fontWeight: 500,
                                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                                    }}>
                                        {cert.issuedBy}
                                    </span>
                                </div>

                                {/* Name */}
                                <p style={{
                                    fontSize: 13, fontWeight: 600, color: "var(--text-color)",
                                    margin: "0 0 auto", lineHeight: 1.4,
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    paddingBottom: 10,
                                }}>
                                    {cert.name}
                                </p>

                                {/* Footer */}
                                <div style={{
                                    display: "flex", alignItems: "center", justifyContent: "space-between",
                                    paddingTop: 10,
                                    borderTop: "1px solid var(--border-color)",
                                    marginTop: 10,
                                }}>
                                    <span style={{
                                        fontSize: 10, fontWeight: 500,
                                        background: "var(--primary-color)", color: "#fff",
                                        padding: "2px 9px", borderRadius: 999,
                                    }}>
                                        {cert.category || "Certified"}
                                    </span>
                                    <Link href={cert.pic} target="_blank" style={{
                                        fontSize: 11, color: "var(--primary-color)",
                                        textDecoration: "none",
                                        display: "flex", alignItems: "center", gap: 3,
                                    }}>
                                        Open <i className="bi bi-arrow-right"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}