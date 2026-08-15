"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getPortfolio } from "../Redux/ActionCreators/PortfolioActionCreators";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/thumbs";

export default function ProjectDetails() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const PortfolioStateData = useSelector(state => state.PortfolioStateData);
    const [data, setData] = useState(null);
    const [relatedData, setRelatedData] = useState([]);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    useEffect(() => { dispatch(getPortfolio()); }, [dispatch]);

    useEffect(() => {
        if (PortfolioStateData.length) {
            setData(PortfolioStateData.find(x => String(x._id) === String(id)) || null);
            setRelatedData(PortfolioStateData.filter(x => String(x._id) !== String(id)));
        }
    }, [PortfolioStateData, id]);

    if (!data) return (
        <div style={{ textAlign: "center", padding: "100px 16px", color: "var(--text-color)" }}>
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-3 text-muted">Loading project details...</p>
        </div>
    );

    const pics = Array.isArray(data.pic)
        ? data.pic
        : data.pic
        ? [data.pic]
        : [];

    const metaItems = [
        { icon: "bi-grid-fill", label: "Category", value: data.category || "Full Stack" },
        { icon: "bi-code-slash", label: "Tech Stack", value: data.tech || "React, Node.js, Express, MongoDB" },
    ];

    return (
        <>
            <section style={{ padding: "70px 16px 50px", backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}>
                <div style={{ maxWidth: 900, margin: "0 auto" }}>

                    {/* Breadcrumbs */}
                    <div className="d-flex align-items-center gap-2 mb-4" style={{ fontSize: "0.86rem" }}>
                        <Link href="/" className="text-muted text-decoration-none">Home</Link>
                        <span className="text-muted">/</span>
                        <Link href="/#portfolio" className="text-muted text-decoration-none">Portfolio</Link>
                        <span className="text-muted">/</span>
                        <span className="text-primary fw-bold text-truncate">{data.name}</span>
                    </div>

                    {/* Header */}
                    <div className="text-center mb-4">
                        <span className="section-badge">
                            <i className="bi bi-briefcase-fill"></i>
                            Project Case Study
                        </span>
                        <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 800, color: "var(--text-color)", margin: "8px 0 14px", lineHeight: 1.2 }}>
                            {data.name}
                        </h1>
                        <div className="title-shape">
                            <svg viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M 0,10 C 40,0 60,20 100,10 C 140,0 160,20 200,10" fill="none" stroke="currentColor" strokeWidth="2"></path>
                            </svg>
                        </div>
                    </div>

                    {/* Hero Image / Swiper Gallery */}
                    <div style={{ marginBottom: 32 }}>
                        {pics.length > 1 ? (
                            <>
                                <Swiper
                                    modules={[Autoplay, Pagination, Thumbs]}
                                    autoplay={{ delay: 3500, disableOnInteraction: false }}
                                    pagination={{ clickable: true }}
                                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                                    loop={true}
                                    style={{ borderRadius: "var(--radius-lg)", marginBottom: 12, boxShadow: "var(--shadow-md)" }}
                                >
                                    {pics.map((imgUrl, i) => (
                                        <SwiperSlide key={i}>
                                            <div style={{ position: "relative", width: "100%", height: 440 }}>
                                                <Image
                                                    src={imgUrl}
                                                    alt={`${data.name} ${i + 1}`}
                                                    fill
                                                    sizes="(max-width: 900px) 100vw, 900px"
                                                    style={{ objectFit: "cover" }}
                                                    priority={i === 0}
                                                />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>

                                <Swiper
                                    onSwiper={setThumbsSwiper}
                                    modules={[Thumbs]}
                                    spaceBetween={10}
                                    slidesPerView={pics.length > 5 ? 5 : pics.length}
                                    watchSlidesProgress={true}
                                    style={{ borderRadius: "var(--radius-md)" }}
                                >
                                    {pics.map((imgUrl, i) => (
                                        <SwiperSlide key={i} style={{ cursor: "pointer" }}>
                                            <div style={{ position: "relative", width: "100%", height: 75, borderRadius: 8, overflow: "hidden", border: "2px solid transparent", transition: "border-color 0.2s, opacity 0.2s" }}>
                                                <Image
                                                    src={imgUrl}
                                                    alt={`thumb-${i + 1}`}
                                                    fill
                                                    sizes="150px"
                                                    style={{ objectFit: "cover" }}
                                                />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </>
                        ) : pics.length === 1 ? (
                            <div style={{ position: "relative", width: "100%", height: 440, borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-md)" }}>
                                <Image
                                    src={pics[0]}
                                    alt={data.name}
                                    fill
                                    sizes="(max-width: 900px) 100vw, 900px"
                                    style={{ objectFit: "cover" }}
                                    priority
                                />
                            </div>
                        ) : (
                            <div style={{ height: 240, borderRadius: "var(--radius-lg)", background: "var(--card-bg)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
                                No Project Image Available
                            </div>
                        )}
                    </div>

                    {/* Short description */}
                    <p style={{ fontSize: "1.1rem", color: "var(--text-muted)", lineHeight: 1.75, textAlign: "center", maxWidth: 700, margin: "0 auto 32px" }}>
                        {data.shortDescription}
                    </p>

                    {/* Meta cards */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 32 }}>
                        {metaItems.map((m, i) => (
                            <div key={i} style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "var(--radius-md)", padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, boxShadow: "var(--shadow-sm)" }}>
                                <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(var(--accent-rgb), 0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "var(--primary-color)", fontSize: "1.2rem" }}>
                                    <i className={`bi ${m.icon}`}></i>
                                </div>
                                <div>
                                    <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--primary-color)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 2px" }}>{m.label}</p>
                                    <p style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-color)", margin: 0 }}>{m.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Long Description Card */}
                    {data.longDescription && (
                        <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "var(--radius-lg)", padding: "32px", marginBottom: 36, boxShadow: "var(--shadow-sm)" }}>
                            <h3 className="fw-bold mb-3" style={{ fontSize: "1.3rem", color: "var(--text-color)" }}>Project Overview & Architecture</h3>
                            <div
                                style={{ fontSize: "0.96rem", lineHeight: 1.85, color: "var(--text-muted)" }}
                                dangerouslySetInnerHTML={{ __html: data.longDescription }}
                            />
                        </div>
                    )}

                    {/* Action Links */}
                    <div className="d-flex gap-3 justify-content-center flex-wrap pt-2">
                        {data.liveUrl && (
                            <a href={data.liveUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
                                <i className="bi bi-box-arrow-up-right"></i> Live Deployment
                            </a>
                        )}
                        {data.githubRepo && (
                            <a href={data.githubRepo} target="_blank" rel="noreferrer" className="btn btn-secondary">
                                <i className="bi bi-github"></i> GitHub Source
                            </a>
                        )}
                        <Link href="/" className="btn btn-outline-dark">
                            <i className="bi bi-arrow-left"></i> Back to Home
                        </Link>
                    </div>

                </div>
            </section>

            {/* Related Projects */}
            {relatedData.length > 0 && (
                <section style={{ padding: "60px 16px 80px", backgroundColor: "var(--bg-alt)" }}>
                    <style>{`
                        .pd-related-img-wrap {
                            position: relative;
                            height: 180px;
                            overflow: hidden;
                            width: 100%;
                        }
                        .pd-related-body {
                            padding: 18px 20px;
                        }
                        .pd-related-title {
                            font-size: 1rem;
                            font-weight: 700;
                            color: var(--text-color);
                            margin: 0 0 6px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                        .pd-related-cat {
                            font-size: 0.8rem;
                            color: var(--primary-color);
                            font-weight: 600;
                            margin: 0 0 14px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                        .pd-related-link {
                            font-size: 0.85rem;
                            font-weight: 700;
                            color: var(--primary-color);
                            text-decoration: none;
                            display: inline-flex;
                            align-items: center;
                            gap: 4px;
                            white-space: nowrap;
                        }
                        @media (max-width: 576px) {
                            .pd-related-img-wrap {
                                height: 110px;
                            }
                            .pd-related-body {
                                padding: 10px 8px;
                            }
                            .pd-related-title {
                                font-size: 0.82rem;
                                margin-bottom: 2px;
                            }
                            .pd-related-cat {
                                font-size: 0.7rem;
                                margin-bottom: 8px;
                            }
                            .pd-related-link {
                                font-size: 0.72rem;
                            }
                        }
                    `}</style>
                    <div className="container">
                        <div className="text-center mb-4">
                            <h3 className="fw-bold" style={{ fontSize: "1.6rem", color: "var(--text-color)" }}>Other Featured Works</h3>
                            <p className="text-muted" style={{ fontSize: "0.9rem" }}>Explore more applications and projects</p>
                        </div>

                        <Swiper
                            modules={[Autoplay]}
                            spaceBetween={14}
                            autoplay={{ delay: 3500 }}
                            breakpoints={{
                                0: { slidesPerView: 2, spaceBetween: 10 },
                                576: { slidesPerView: 2, spaceBetween: 14 },
                                992: { slidesPerView: 3, spaceBetween: 20 },
                            }}
                        >
                            {relatedData.map((item) => {
                                const itemPic = Array.isArray(item.pic) ? (item.pic[0] || "/img/portfolio/portfolio-1.webp") : (item.pic || "/img/portfolio/portfolio-1.webp");
                                return (
                                    <SwiperSlide key={item._id}>
                                        <div
                                            style={{
                                                background: "var(--card-bg)",
                                                border: "1px solid var(--card-border)",
                                                borderRadius: "var(--radius-lg)",
                                                overflow: "hidden",
                                                boxShadow: "var(--shadow-sm)",
                                                transition: "transform var(--ease-smooth), box-shadow var(--ease-smooth)",
                                                minWidth: 0,
                                                width: "100%",
                                                boxSizing: "border-box",
                                            }}
                                            className="hover-lift"
                                        >
                                            <div className="pd-related-img-wrap">
                                                <Image
                                                    src={itemPic}
                                                    alt={item.name}
                                                    fill
                                                    sizes="(max-width: 768px) 50vw, (max-width: 992px) 50vw, 33vw"
                                                    style={{ objectFit: "cover" }}
                                                />
                                            </div>
                                            <div className="pd-related-body">
                                                <h4 className="pd-related-title">{item.name}</h4>
                                                <p className="pd-related-cat">{item.category}</p>
                                                <Link
                                                    href={`/projectDetail/${item._id}`}
                                                    className="pd-related-link"
                                                >
                                                    View Details <i className="bi bi-arrow-right"></i>
                                                </Link>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                    </div>
                </section>
            )}
        </>
    );
}