"use client";
import React, { useEffect, useState } from "react";
import { getService } from "../Redux/ActionCreartors/ServiceActionCreators";
import { useDispatch, useSelector } from "react-redux";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";

export default function Service() {
    const ServiceStateData = useSelector(state => state.ServiceStateData);
    const dispatch = useDispatch();
    const [hovered, setHovered] = useState(null);

    useEffect(() => {
        dispatch(getService());
        AOS.init({ duration: 900, once: false });
        AOS.refresh();
    }, [dispatch]);

    const active = ServiceStateData.filter(x => x.active);

    return (
        <section
            id="services"
            style={{ padding: "70px 16px", backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
        >
            <div className="container">

                {/* ── Header ── */}
                <div className="text-center mb-5" data-aos="fade-up">
                    <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--primary-color)", margin: "0 0 8px" }}>
                        What I Offer
                    </p>
                    <h2 style={{ fontSize: "2rem", fontWeight: 600, color: "var(--text-color)", margin: "0 0 10px" }}>
                        Our Services
                    </h2>
                    <svg viewBox="0 0 80 16" style={{ width: 70, display: "block", margin: "0 auto 14px" }}>
                        <path d="M0 8 C13 0,20 16,40 8 C60 0,67 16,80 8" stroke="var(--primary-color)" strokeWidth="2" fill="none" strokeLinecap="round" />
                    </svg>
                    <p style={{ fontSize: 15, color: "var(--muted-color)", maxWidth: 460, margin: "0 auto", lineHeight: 1.6 }}>
                        Discover how our AI-driven solutions enhance your health and well-being.
                    </p>
                </div>

                {/* ── Grid ── */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(clamp(140px, 42vw, 240px), 1fr))",
                    gap: 16,
                    maxWidth: 960,
                    margin: "0 auto",
                }}>
                    {active.map((service, index) => (
                        <div
                            key={service._id}
                            data-aos="fade-up"
                            data-aos-delay={index * 80}
                            onMouseEnter={() => setHovered(service._id)}
                            onMouseLeave={() => setHovered(null)}
                            style={{
                                background: "var(--card-bg)",
                                border: `1px solid ${hovered === service._id ? "var(--primary-color)" : "var(--border-color)"}`,
                                borderRadius: 14,
                                padding: "22px 18px",
                                transition: "transform 0.22s, border-color 0.22s",
                                transform: hovered === service._id ? "translateY(-6px)" : "translateY(0)",
                                display: "flex",
                                flexDirection: "column",
                                gap: 12,
                                cursor: "default",
                            }}
                        >
                            {/* Icon */}
                            <div style={{
                                width: 46, height: 46,
                                borderRadius: 12,
                                background: "rgba(0,123,255,0.1)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                flexShrink: 0,
                                transition: "background 0.22s",
                                ...(hovered === service._id && { background: "rgba(0,123,255,0.18)" }),
                            }}>
                                <i className={service.icon} style={{ fontSize: 22, color: "var(--primary-color)" }}></i>
                            </div>

                            {/* Title */}
                            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-color)", lineHeight: 1.3, margin: 0 }}>
                                {service.name}
                            </p>

                            {/* Description — 3-line clamp */}
                            <p style={{
                                fontSize: 12, color: "var(--muted-color)", lineHeight: 1.6, margin: 0,
                                display: "-webkit-box",
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                            }}>
                                {service.shortDescription}
                            </p>

                            {/* Footer */}
                            <div style={{
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                paddingTop: 10,
                                borderTop: "1px solid var(--border-color)",
                                marginTop: "auto",
                            }}>
                                <span style={{
                                    fontSize: 10, fontWeight: 500,
                                    background: "rgba(0,123,255,0.1)",
                                    color: "var(--primary-color)",
                                    padding: "2px 9px", borderRadius: 999,
                                }}>
                                    {service.category || "Service"}
                                </span>
                                <Link
                                    href={`/serviceDetail/${service._id}`}
                                    style={{
                                        fontSize: 12, color: "var(--primary-color)",
                                        textDecoration: "none",
                                        display: "flex", alignItems: "center", gap: 3,
                                    }}
                                >
                                    Details <i className="bi bi-arrow-right"></i>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}