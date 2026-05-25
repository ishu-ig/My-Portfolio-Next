"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPortfolio } from "../Redux/ActionCreartors/PortfolioActionCreators";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function ProjectDetails() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const PortfolioStateData = useSelector(state => state.PortfolioStateData);
    const [data, setData] = useState(null);
    const [relatedData, setRelatedData] = useState([]);
    const [imgHovered, setImgHovered] = useState(null);

    useEffect(() => { dispatch(getPortfolio()); }, [dispatch]);

    useEffect(() => {
        if (PortfolioStateData.length) {
            setData(PortfolioStateData.find(x => x._id === id) || null);
            setRelatedData(PortfolioStateData.filter(x => x._id !== id));
        }
    }, [PortfolioStateData, id]);

    if (!data) return (
        <div style={{ textAlign: "center", padding: "80px 16px", color: "var(--text-color)" }}>
            Loading project details...
        </div>
    );

    const metaItems = [
        { icon: "bi-grid", label: "Category", value: data.category },
        { icon: "bi-code-slash", label: "Tech Stack", value: data.tech },
    ];

    return (
        <>
            {/* ── Project Detail ── */}
            <section style={{ padding: "60px 16px", backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}>
                <div style={{ maxWidth: 860, margin: "0 auto" }}>

                    {/* Header */}
                    <div className="text-center mb-4">
                        <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--primary-color)", margin: "0 0 8px" }}>
                            Project
                        </p>
                        <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 700, color: "var(--text-color)", margin: "0 0 14px", lineHeight: 1.2 }}>
                            {data.name}
                        </h1>
                        <div style={{ width: 60, height: 4, background: "var(--primary-color)", borderRadius: 2, margin: "0 auto 20px" }} />
                    </div>

                    {/* Hero image */}
                    <div style={{ borderRadius: 16, overflow: "hidden", marginBottom: 28 }}>
                        <img src={data.pic} alt={data.name} style={{ width: "100%", maxHeight: 420, objectFit: "cover", display: "block" }} />
                    </div>

                    {/* Short description */}
                    <p style={{ fontSize: 16, color: "var(--muted-color)", lineHeight: 1.75, textAlign: "center", marginBottom: 28, maxWidth: 640, margin: "0 auto 28px" }}>
                        {data.shortDescription}
                    </p>

                    {/* Divider */}
                    <div style={{ borderTop: "1px dashed var(--border-color)", margin: "28px 0" }} />

                    {/* Long description */}
                    <div style={{ fontSize: 15, lineHeight: 1.85, color: "var(--text-color)", marginBottom: 32 }}
                        dangerouslySetInnerHTML={{ __html: data.longDescription }} />

                    {/* Meta cards */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 28 }}>
                        {metaItems.map((m, i) => (
                            <div key={i} style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 10 }}>
                                <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(0,123,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <i className={`bi ${m.icon}`} style={{ fontSize: 16, color: "var(--primary-color)" }}></i>
                                </div>
                                <div>
                                    <p style={{ fontSize: 10, fontWeight: 500, color: "var(--primary-color)", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 2px" }}>{m.label}</p>
                                    <p style={{ fontSize: 13, color: "var(--text-color)", margin: 0 }}>{m.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA buttons */}
                    <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                        {data.githubRepo && (
                            <a href={data.githubRepo} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 22px", borderRadius: 999, background: "var(--primary-color)", color: "#fff", fontSize: 13, fontWeight: 500, textDecoration: "none" }}>
                                <i className="bi bi-github"></i> GitHub Repo
                            </a>
                        )}
                        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 22px", borderRadius: 999, border: "1px solid var(--border-color)", background: "transparent", color: "var(--text-color)", fontSize: 13, fontWeight: 500, textDecoration: "none" }}>
                            <i className="bi bi-house"></i> Home
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Related Projects ── */}
            <section style={{ padding: "50px 16px", backgroundColor: "var(--bg-color)" }}>
                <div className="container">
                    <div className="text-center mb-4">
                        <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--primary-color)", margin: "0 0 8px" }}>
                            Explore More
                        </p>
                        <h2 style={{ fontSize: "1.6rem", fontWeight: 600, color: "var(--text-color)", margin: "0 0 10px" }}>Other Projects</h2>
                        <div style={{ width: 60, height: 4, background: "var(--primary-color)", borderRadius: 2, margin: "0 auto" }} />
                    </div>

                    <Swiper modules={[Autoplay]} spaceBetween={16} autoplay={{ delay: 2500 }}
                        breakpoints={{ 0: { slidesPerView: 1.1 }, 576: { slidesPerView: 2 }, 992: { slidesPerView: 3 } }}>
                        {relatedData.map((item, i) => (
                            <SwiperSlide key={item._id}>
                                <div
                                    onMouseEnter={() => setImgHovered(item._id)}
                                    onMouseLeave={() => setImgHovered(null)}
                                    style={{ background: "var(--card-bg)", border: `1px solid ${imgHovered === item._id ? "var(--primary-color)" : "var(--border-color)"}`, borderRadius: 14, overflow: "hidden", transition: "transform 0.22s, border-color 0.22s", transform: imgHovered === item._id ? "translateY(-5px)" : "translateY(0)" }}
                                >
                                    <div style={{ height: 160, overflow: "hidden" }}>
                                        <img src={item.pic} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.3s", transform: imgHovered === item._id ? "scale(1.05)" : "scale(1)" }} />
                                    </div>
                                    <div style={{ padding: "12px 14px" }}>
                                        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-color)", margin: "0 0 4px" }}>{item.name}</p>
                                        <p style={{ fontSize: 11, color: "var(--muted-color)", margin: "0 0 10px" }}>{item.category}</p>
                                        <Link href={`/projectDetail/${item._id}`} style={{ fontSize: 12, color: "var(--primary-color)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 3 }}>
                                            View Details <i className="bi bi-arrow-right"></i>
                                        </Link>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section>
        </>
    );
}