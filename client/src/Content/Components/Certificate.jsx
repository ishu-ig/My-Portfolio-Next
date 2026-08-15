"use client"
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from 'react-redux';
import { getCertificate } from '../Redux/ActionCreators/CertificateActionCreators';
import AOS from "aos";
import "aos/dist/aos.css";

export default function Certificates() {
    const CertificateStateData = useSelector(state => state.CertificateStateData);
    const dispatch = useDispatch();
    const [previewCert, setPreviewCert] = useState(null);

    useEffect(() => {
        dispatch(getCertificate());
        AOS.init({ duration: 900, once: true });
    }, [dispatch]);

    const active = Array.isArray(CertificateStateData) ? CertificateStateData.filter(x => x.active) : [];

    return (
        <>
            <style>{`
                .cert-section {
                    padding: 90px 0;
                    background-color: var(--bg-color);
                }

                .cert-grid {
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 24px;
                    justify-content: center;
                }

                @media (max-width: 991.98px) {
                    .cert-grid {
                        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                        gap: 18px;
                    }
                }

                @media (max-width: 576px) {
                    .cert-section {
                        padding: 50px 0;
                    }
                    .cert-grid {
                        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                        gap: 10px;
                    }
                    .cert-img-wrap {
                        height: 115px;
                    }
                    .cert-ribbon {
                        font-size: 0.56rem;
                        padding: 2px 6px 2px 5px;
                        top: 6px;
                    }
                    .cert-body {
                        padding: 10px 8px;
                    }
                    .cert-issuer-name {
                        font-size: 0.64rem;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    .cert-name {
                        font-size: 0.8rem;
                        margin: 2px 0 6px;
                        line-height: 1.25;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                    }
                    .cert-footer {
                        padding-top: 6px;
                        min-width: 0;
                    }
                    .cert-badge {
                        font-size: 0.6rem;
                        padding: 2px 5px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        max-width: 55%;
                    }
                    .cert-open-btn {
                        font-size: 0.7rem;
                        white-space: nowrap;
                        flex-shrink: 0;
                    }
                    .cert-overlay-btn {
                        font-size: 0.68rem;
                        padding: 4px 10px;
                        white-space: nowrap;
                    }
                }

                @media (max-width: 360px) {
                    .cert-grid {
                        gap: 8px;
                    }
                    .cert-img-wrap {
                        height: 95px;
                    }
                    .cert-body {
                        padding: 8px 6px;
                    }
                    .cert-name {
                        font-size: 0.76rem;
                    }
                }

                .cert-card {
                    background: var(--card-bg);
                    border-radius: var(--radius-lg);
                    border: 1px solid var(--card-border);
                    overflow: hidden;
                    transition: transform var(--ease-smooth), border-color var(--ease-smooth), box-shadow var(--ease-smooth);
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    box-shadow: var(--shadow-sm);
                    min-width: 0;
                    width: 100%;
                }

                .cert-card:hover {
                    transform: translateY(-8px);
                    border-color: var(--primary-color);
                    box-shadow: var(--shadow-lg), 0 0 25px rgba(var(--accent-rgb), 0.15);
                }

                .cert-ribbon {
                    position: absolute; top: 12px; right: 0;
                    background: var(--primary-color); color: #ffffff;
                    font-size: 0.72rem; font-weight: 600;
                    padding: 4px 12px 4px 10px;
                    border-radius: 4px 0 0 4px;
                    z-index: 2; display: flex; align-items: center; gap: 5px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                }

                .cert-img-wrap {
                    display: block;
                    position: relative;
                    overflow: hidden;
                    height: 180px;
                    cursor: pointer;
                    background: var(--bg-alt);
                }

                .cert-img-wrap img {
                    width: 100%; height: 100%;
                    object-fit: cover; display: block;
                    transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
                }

                .cert-card:hover .cert-img-wrap img { transform: scale(1.08); }

                .cert-img-overlay {
                    position: absolute; inset: 0;
                    background: rgba(10, 14, 35, 0.65);
                    opacity: 0;
                    transition: opacity var(--ease-quick);
                    display: flex; align-items: center; justify-content: center;
                    backdrop-filter: blur(3px);
                }
                .cert-card:hover .cert-img-overlay { opacity: 1; }

                .cert-overlay-btn {
                    background: #ffffff; color: #0f111a;
                    font-size: 0.82rem; font-weight: 600;
                    padding: 8px 18px; border-radius: var(--radius-pill);
                    display: flex; align-items: center; gap: 6px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.25);
                }

                .cert-body {
                    padding: 16px 18px;
                    flex: 1; display: flex; flex-direction: column;
                }

                .cert-issuer-name {
                    font-size: 0.82rem; color: var(--primary-color); font-weight: 700;
                    text-transform: uppercase; letter-spacing: 0.04em;
                }

                .cert-name {
                    font-size: 0.98rem; font-weight: 700; color: var(--text-color);
                    margin: 6px 0 12px; line-height: 1.4;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .cert-footer {
                    display: flex; align-items: center; justify-content: space-between;
                    padding-top: 12px;
                    border-top: 1px solid var(--border-color);
                    margin-top: auto;
                }

                .cert-badge {
                    font-size: 0.74rem; font-weight: 600;
                    background: rgba(var(--accent-rgb), 0.1); color: var(--primary-color);
                    padding: 4px 12px; border-radius: var(--radius-pill);
                    border: 1px solid rgba(var(--accent-rgb), 0.2);
                }

                .cert-open-btn {
                    font-size: 0.84rem; font-weight: 600; color: var(--text-color);
                    cursor: pointer; background: transparent; border: none;
                    display: flex; align-items: center; gap: 4px;
                    transition: color var(--ease-quick);
                }
                .cert-open-btn:hover { color: var(--primary-color); }

                /* Lightbox Modal */
                .cert-lightbox-backdrop {
                    position: fixed; inset: 0;
                    background: rgba(0, 0, 0, 0.85);
                    backdrop-filter: blur(8px);
                    z-index: 3000;
                    display: flex; align-items: center; justify-content: center;
                    padding: 20px;
                    animation: fadeIn 0.25s ease-out;
                }

                .cert-lightbox-card {
                    background: var(--card-bg);
                    border: 1px solid var(--card-border);
                    border-radius: var(--radius-lg);
                    max-width: 760px; width: 100%;
                    overflow: hidden;
                    box-shadow: 0 25px 70px rgba(0,0,0,0.6);
                    position: relative;
                }

                .cert-lightbox-img-wrap {
                    position: relative;
                    width: 100%;
                    height: 70vh;
                    background: #000;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>

            <section id="certificate" className="cert-section">
                <div className="container">

                    {/* Header */}
                    <div className="text-center mb-5" data-aos="fade-up">
                        <span className="section-badge">
                            <i className="bi bi-patch-check-fill"></i>
                            Credentials
                        </span>
                        <h2 className="section-title">Certifications</h2>
                        <div className="title-shape">
                            <svg viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M 0,10 C 40,0 60,20 100,10 C 140,0 160,20 200,10" fill="none" stroke="currentColor" strokeWidth="2"></path>
                            </svg>
                        </div>
                        <p className="section-subtitle">
                            Industry-recognized certifications and professional credentials validating technical competence.
                        </p>
                    </div>

                    {/* Grid */}
                    <div className="cert-grid">
                        {active.map((cert, index) => (
                            <div
                                key={cert._id || index}
                                className="cert-card"
                                data-aos="fade-up"
                                data-aos-delay={(index % 3) * 100}
                            >
                                {/* Verified ribbon */}
                                <div className="cert-ribbon">
                                    <i className="bi bi-shield-check"></i>
                                    Verified
                                </div>

                                {/* Image with Lightbox click */}
                                <div 
                                    className="cert-img-wrap"
                                    onClick={() => setPreviewCert(cert)}
                                    role="button"
                                    tabIndex={0}
                                >
                                    <Image
                                        src={cert.pic && typeof cert.pic === "string" && (cert.pic.startsWith("http") || cert.pic.startsWith("/")) ? cert.pic : "/img/portfolio/portfolio-1.webp"}
                                        alt={cert.name}
                                        fill
                                        sizes="(max-width: 992px) 50vw, 33vw"
                                        unoptimized={typeof cert.pic === "string" && cert.pic.startsWith("http")}
                                        style={{ objectFit: "cover" }}
                                    />
                                    <div className="cert-img-overlay">
                                        <span className="cert-overlay-btn">
                                            <i className="bi bi-arrows-fullscreen"></i>
                                            View Certificate
                                        </span>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="cert-body">
                                    <div className="d-flex align-items-center gap-2 mb-1">
                                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--primary-color)" }} />
                                        <span className="cert-issuer-name">{cert.issuedBy || "Accredited"}</span>
                                    </div>
                                    <h4 className="cert-name">{cert.name}</h4>
                                    
                                    <div className="cert-footer">
                                        <span className="cert-badge">{cert.category || "Certification"}</span>
                                        <button 
                                            type="button" 
                                            className="cert-open-btn"
                                            onClick={() => setPreviewCert(cert)}
                                        >
                                            Preview <i className="bi bi-arrow-right"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {active.length === 0 && (
                        <div className="text-center py-5 text-muted">
                            No certificates listed yet.
                        </div>
                    )}

                </div>
            </section>

            {/* Lightbox Preview Modal */}
            {previewCert && (
                <div 
                    className="cert-lightbox-backdrop"
                    onClick={() => setPreviewCert(null)}
                >
                    <div 
                        className="cert-lightbox-card"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="d-flex justify-content-between align-items-center p-3 border-bottom" style={{ borderColor: "var(--border-color)" }}>
                            <div>
                                <h5 className="m-0 fw-bold" style={{ color: "var(--text-color)" }}>{previewCert.name}</h5>
                                <small className="text-muted">{previewCert.issuedBy} • {previewCert.category || "Certificate"}</small>
                            </div>
                            <button 
                                type="button" 
                                className="btn-close" 
                                onClick={() => setPreviewCert(null)}
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="cert-lightbox-img-wrap">
                            <Image
                                src={previewCert.pic && typeof previewCert.pic === "string" && (previewCert.pic.startsWith("http") || previewCert.pic.startsWith("/")) ? previewCert.pic : "/img/portfolio/portfolio-1.webp"}
                                alt={previewCert.name}
                                fill
                                sizes="(max-width: 768px) 100vw, 760px"
                                style={{ objectFit: "contain" }}
                            />
                        </div>
                        <div className="p-3 d-flex justify-content-end gap-2 bg-body-tertiary">
                            <a 
                                href={previewCert.pic} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="btn btn-sm btn-primary"
                            >
                                <i className="bi bi-box-arrow-up-right me-1"></i>
                                Open Full Size
                            </a>
                            <button 
                                type="button" 
                                className="btn btn-sm btn-outline-secondary" 
                                onClick={() => setPreviewCert(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}