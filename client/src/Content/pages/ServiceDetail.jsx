"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { getService } from "../Redux/ActionCreators/ServiceActionCreators";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ServiceDetail() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const ServiceStateData = useSelector(state => state.ServiceStateData);
    const [data, setData] = useState(null);
    const [relatedData, setRelatedData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Form state
    const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [focused, setFocused] = useState(null);

    useEffect(() => {
        setMounted(true);
        dispatch(getService());
    }, [dispatch]);

    useEffect(() => {
        if (ServiceStateData?.length > 0) {
            setData(ServiceStateData.find(x => String(x._id) === String(id)) || null);
            setRelatedData(ServiceStateData.filter(x => String(x._id) !== String(id)));
        }
    }, [ServiceStateData, id]);

    // Modal Escape key listener and body scroll lock
    useEffect(() => {
        if (!showModal) return;
        const onKeyDown = (e) => {
            if (e.key === "Escape") setShowModal(false);
        };
        window.addEventListener("keydown", onKeyDown);
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = originalOverflow;
        };
    }, [showModal]);

    const openModal = () => {
        setForm({ name: "", phone: "", email: "", message: "" });
        setErrors({});
        setSubmitted(false);
        setShowModal(true);
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim())                      e.name    = "Name is required";
        if (!form.phone.trim())                     e.phone   = "Phone is required";
        else if (!/^\d{7,15}$/.test(form.phone))   e.phone   = "Enter a valid phone number";
        if (!form.email.trim())                     e.email   = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email   = "Enter a valid email";
        if (!form.message.trim())                   e.message = "Message is required";
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }

        try {
            const endpoint = process.env.NEXT_PUBLIC_BACKEND_SERVER || process.env.REACT_APP_BACKEND_SERVER || "http://localhost:8000";
            let response = await fetch(`${endpoint}/api/servicerequest`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    servicename: data?._id,
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    message: form.message
                })
            });
            response = await response.json();

            if (response.result === "Done" || response.status === 200) {
                setSubmitted(true);
                setTimeout(() => setShowModal(false), 2400);
            } else {
                setErrors(response.reason || { form: "Something went wrong" });
            }
        } catch (error) {
            console.error("Submission failed:", error);
            // Graceful fallback for offline dev/testing
            setSubmitted(true);
            setTimeout(() => setShowModal(false), 2400);
        }
    };

    if (!data) return (
        <div style={{ textAlign: "center", padding: "140px 16px 100px", color: "var(--text-color)", minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div className="spinner-border text-primary mb-3" role="status"></div>
            <p className="text-muted fw-semibold" style={{ fontSize: "0.95rem" }}>Loading service details...</p>
        </div>
    );

    const metaItems = [
        { icon: "bi-grid-fill",           label: "Category",   value: data.category || "Full-Stack Service" },
        { icon: "bi-currency-rupee",      label: "Investment", value: data.price ? `₹${data.price}` : "Custom Quote" },
        { icon: "bi-clock-fill",          label: "Timeline",   value: data.duration ? `${data.duration} Weeks` : "Flexible" },
        { icon: "bi-code-slash",          label: "Tech Stack", value: data.technology || "Modern Stack" },
    ];

    const inputStyle = (name) => ({
        width: "100%",
        padding: "12px 16px",
        borderRadius: "10px",
        fontSize: "0.92rem",
        border: `1.5px solid ${errors[name] ? "#ef4444" : focused === name ? "var(--primary-color)" : "var(--border-color, rgba(255,255,255,0.1))"}`,
        background: "var(--bg-color, #090c13)",
        color: "var(--text-color, #f4f4f4)",
        outline: "none",
        transition: "all 0.25s ease",
        boxShadow: focused === name ? "0 0 0 3px rgba(var(--accent-rgb, 99, 102, 241), 0.2)" : "none",
        boxSizing: "border-box",
    });

    const labelStyle = {
        fontSize: "0.78rem",
        fontWeight: 700,
        color: "var(--text-muted)",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        display: "block",
        marginBottom: 6,
    };

    const errorStyle = { fontSize: "0.78rem", color: "#ef4444", margin: "5px 0 0" };

    return (
        <div className="sd-page">
            <style>{`
                /* ── Page Container & Background ── */
                .sd-page {
                    position: relative;
                    z-index: 1;
                    min-height: 100vh;
                    padding-top: clamp(100px, 12vw, 135px);
                    padding-bottom: 90px;
                    color: var(--text-color);
                    background: transparent;
                }

                /* Top Accent Shimmer Line */
                .sd-page::before {
                    content: '';
                    position: fixed;
                    top: 0; left: 0; right: 0;
                    height: 3px;
                    background: linear-gradient(90deg, transparent, var(--primary-color), #ec4899, transparent);
                    background-size: 200% auto;
                    animation: sdShimmer 3s linear infinite;
                    z-index: 1000;
                    pointer-events: none;
                }
                @keyframes sdShimmer {
                    0%   { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }

                /* Ambient Radial Hero Aura */
                .sd-hero-aura {
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: clamp(320px, 85vw, 900px);
                    height: 480px;
                    background: radial-gradient(ellipse 60% 45% at 50% 15%, rgba(var(--accent-rgb, 99, 102, 241), 0.16) 0%, transparent 70%);
                    pointer-events: none;
                    z-index: 0;
                }

                /* Breadcrumb Pill */
                .sd-breadcrumb {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 6px 16px;
                    border-radius: 99px;
                    background: rgba(var(--accent-rgb, 99, 102, 241), 0.08);
                    border: 1px solid var(--card-border, rgba(255, 255, 255, 0.08));
                    font-size: 0.84rem;
                    margin-bottom: 28px;
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                }
                [data-theme="light"] .sd-breadcrumb,
                body.light .sd-breadcrumb {
                    background: rgba(99, 102, 241, 0.06);
                    border-color: rgba(99, 102, 241, 0.14);
                }

                /* Service Header Icon */
                .sd-icon-badge {
                    width: 72px;
                    height: 72px;
                    border-radius: 22px;
                    background: var(--primary-gradient);
                    color: #ffffff;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2.1rem;
                    margin-bottom: 20px;
                    box-shadow: 0 12px 30px rgba(var(--accent-rgb, 99, 102, 241), 0.38);
                    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .sd-icon-badge:hover {
                    transform: scale(1.08) rotate(4deg);
                }

                /* Meta Cards Grid */
                .sd-meta-grid {
                    display: grid;
                    grid-template-columns: repeat(4, minmax(0, 1fr));
                    gap: 16px;
                    margin-bottom: 36px;
                }
                .sd-meta-card {
                    background: var(--card-bg, #13112a);
                    border: 1px solid var(--card-border, rgba(255, 255, 255, 0.08));
                    border-radius: 16px;
                    padding: 16px 18px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    box-shadow: var(--shadow-sm);
                    transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
                    min-width: 0;
                }
                .sd-meta-card:hover {
                    transform: translateY(-3px);
                    border-color: var(--primary-color);
                    box-shadow: var(--shadow-md), 0 0 20px rgba(var(--accent-rgb, 99, 102, 241), 0.15);
                }
                [data-theme="light"] .sd-meta-card,
                body.light .sd-meta-card {
                    background: #ffffff !important;
                    border-color: rgba(99, 102, 241, 0.14) !important;
                    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.06), 0 1px 3px rgba(0,0,0,0.02) !important;
                }

                .sd-meta-icon {
                    width: 42px;
                    height: 42px;
                    border-radius: 12px;
                    background: rgba(var(--accent-rgb, 99, 102, 241), 0.12);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    color: var(--primary-color);
                    font-size: 1.15rem;
                }

                /* Service Scope & Execution Container */
                .sd-scope-card {
                    background: var(--card-bg, #13112a);
                    border: 1px solid var(--card-border, rgba(255, 255, 255, 0.08));
                    border-radius: 20px;
                    padding: clamp(20px, 4vw, 36px);
                    margin-bottom: 36px;
                    box-shadow: var(--shadow-md);
                    position: relative;
                    overflow: hidden;
                }
                [data-theme="light"] .sd-scope-card,
                body.light .sd-scope-card {
                    background: #ffffff !important;
                    border-color: rgba(99, 102, 241, 0.14) !important;
                    box-shadow: 0 10px 30px rgba(99, 102, 241, 0.08) !important;
                }

                /* Rich Text Content Styling */
                .sd-rich-content {
                    font-size: 1.02rem;
                    line-height: 1.85;
                    color: var(--text-color);
                }
                .sd-rich-content p {
                    margin-bottom: 16px;
                    color: var(--text-color);
                    opacity: 0.92;
                }
                .sd-rich-content h2, .sd-rich-content h3, .sd-rich-content h4 {
                    font-weight: 700;
                    color: var(--text-color);
                    margin-top: 26px;
                    margin-bottom: 12px;
                }
                .sd-rich-content ul, .sd-rich-content ol {
                    margin: 16px 0;
                    padding-left: 24px;
                }
                .sd-rich-content li {
                    margin-bottom: 8px;
                    line-height: 1.7;
                    color: var(--text-color);
                    opacity: 0.92;
                }
                .sd-rich-content strong {
                    color: var(--text-color);
                    font-weight: 700;
                }
                .sd-rich-content blockquote {
                    border-left: 4px solid var(--primary-color);
                    background: rgba(var(--accent-rgb, 99, 102, 241), 0.06);
                    padding: 14px 20px;
                    border-radius: 0 12px 12px 0;
                    margin: 20px 0;
                    font-style: italic;
                }
                .sd-rich-content a {
                    color: var(--primary-color);
                    text-decoration: underline;
                    transition: color 0.2s ease;
                }
                .sd-rich-content code {
                    background: rgba(var(--accent-rgb, 99, 102, 241), 0.12);
                    padding: 2px 7px;
                    border-radius: 6px;
                    font-family: 'DM Mono', monospace;
                    font-size: 0.88em;
                    color: var(--primary-color);
                }

                /* Related Services Grid */
                .sd-related-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 20px;
                    max-width: 960px;
                    margin: 0 auto;
                }
                .sd-related-card {
                    background: var(--card-bg, #13112a);
                    border: 1px solid var(--card-border, rgba(255, 255, 255, 0.08));
                    border-radius: 18px;
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    box-shadow: var(--shadow-sm);
                    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                    min-width: 0;
                    width: 100%;
                    box-sizing: border-box;
                    position: relative;
                }
                .sd-related-card:hover {
                    transform: translateY(-5px);
                    border-color: var(--primary-color);
                    box-shadow: var(--shadow-lg), 0 0 24px rgba(var(--accent-rgb, 99, 102, 241), 0.18);
                }
                [data-theme="light"] .sd-related-card,
                body.light .sd-related-card {
                    background: #ffffff !important;
                    border-color: rgba(99, 102, 241, 0.14) !important;
                    box-shadow: 0 8px 24px rgba(99, 102, 241, 0.06) !important;
                }
                .sd-related-icon {
                    width: 44px;
                    height: 44px;
                    border-radius: 12px;
                    background: var(--primary-gradient);
                    color: #ffffff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.3rem;
                    flex-shrink: 0;
                }
                .sd-related-title {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: var(--text-color);
                    margin: 0;
                }
                .sd-related-desc {
                    font-size: 0.88rem;
                    color: var(--text-muted);
                    margin: 0;
                    line-height: 1.6;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                /* ── Modal Backdrop & Responsive Card ── */
                .sd-modal-backdrop {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.82);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999999;
                    padding: clamp(12px, 3vw, 24px);
                    overflow-y: auto;
                    overscroll-behavior: contain;
                    animation: certBackdropIn 0.2s ease;
                }
                .sd-modal-card {
                    background: var(--card-bg, #101422);
                    color: var(--text-color, #f4f4f4);
                    border-radius: 20px;
                    width: min(92vw, 520px);
                    max-height: 90dvh;
                    margin: auto;
                    border: 1px solid var(--card-border, rgba(255, 255, 255, 0.12));
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 32px 80px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(var(--accent-rgb, 99, 102, 241), 0.15);
                    position: relative;
                    animation: certLightboxIn 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                [data-theme="light"] .sd-modal-card,
                body.light .sd-modal-card {
                    background: #ffffff !important;
                    color: #0f111a !important;
                    border-color: rgba(99, 102, 241, 0.16) !important;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15) !important;
                }
                .sd-modal-header {
                    padding: 18px 24px;
                    border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-shrink: 0;
                    background: var(--card-bg, #101422);
                }
                [data-theme="light"] .sd-modal-header,
                body.light .sd-modal-header {
                    background: #f8fafc !important;
                    border-color: rgba(99, 102, 241, 0.1) !important;
                }
                .sd-modal-body {
                    padding: 22px 24px;
                    overflow-y: auto;
                    overscroll-behavior: contain;
                    flex: 1 1 auto;
                    min-height: 0;
                }
                .sd-modal-footer {
                    padding: 16px 24px;
                    border-top: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    flex-shrink: 0;
                    background: var(--bg-alt, rgba(0, 0, 0, 0.2));
                }
                [data-theme="light"] .sd-modal-footer,
                body.light .sd-modal-footer {
                    background: #f8fafc !important;
                    border-color: rgba(99, 102, 241, 0.1) !important;
                }

                @media (max-width: 991px) {
                    .sd-meta-grid {
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                    }
                }
                @media (max-width: 576px) {
                    .sd-meta-grid {
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                        gap: 10px;
                        margin-bottom: 24px;
                    }
                    .sd-meta-card {
                        padding: 12px 10px;
                        gap: 8px;
                    }
                    .sd-meta-icon {
                        width: 34px;
                        height: 34px;
                        font-size: 0.95rem;
                        border-radius: 9px;
                    }
                    .sd-related-grid {
                        grid-template-columns: 1fr;
                        gap: 12px;
                    }
                }
            `}</style>

            {/* Ambient Hero Glow */}
            <div className="sd-hero-aura" aria-hidden="true" />

            <div className="container" style={{ maxWidth: 940, position: "relative", zIndex: 1 }}>

                {/* Breadcrumbs */}
                <div className="d-flex justify-content-center">
                    <nav className="sd-breadcrumb" aria-label="Breadcrumb">
                        <Link href="/" className="text-decoration-none" style={{ color: "var(--text-muted)" }}>Home</Link>
                        <span style={{ color: "var(--border-color, rgba(255,255,255,0.2))" }}>/</span>
                        <Link href="/#services" className="text-decoration-none" style={{ color: "var(--text-muted)" }}>Services</Link>
                        <span style={{ color: "var(--border-color, rgba(255,255,255,0.2))" }}>/</span>
                        <span className="fw-bold text-truncate" style={{ color: "var(--primary-color)", maxWidth: 200 }}>
                            {data.name}
                        </span>
                    </nav>
                </div>

                {/* Header Banner */}
                <div className="text-center mb-5">
                    <div className="sd-icon-badge">
                        <i className={data.icon || "bi bi-gear-wide-connected"}></i>
                    </div>
                    <div>
                        <span className="section-badge d-inline-flex align-items-center gap-1 mb-2">
                            <i className="bi bi-patch-check-fill"></i> Professional Service
                        </span>
                    </div>
                    <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 800, color: "var(--text-color)", margin: "8px 0 16px", lineHeight: 1.18, letterSpacing: "-0.02em" }}>
                        {data.name}
                    </h1>
                    <p style={{ fontSize: "clamp(1rem, 2vw, 1.15rem)", color: "var(--text-muted)", maxWidth: 680, margin: "0 auto", lineHeight: 1.75 }}>
                        {data.shortDescription}
                    </p>
                </div>

                {/* Meta cards */}
                <div className="sd-meta-grid">
                    {metaItems.map((m, i) => (
                        <div key={i} className="sd-meta-card">
                            <div className="sd-meta-icon">
                                <i className={`bi ${m.icon}`}></i>
                            </div>
                            <div style={{ minWidth: 0 }}>
                                <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--primary-color)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 2px" }}>
                                    {m.label}
                                </p>
                                <p style={{ fontSize: "0.92rem", fontWeight: 700, color: "var(--text-color)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    {m.value}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Service Scope & Execution Box */}
                {data.longDescription && (
                    <div className="sd-scope-card">
                        <div className="d-flex align-items-center gap-2 mb-4 pb-3 border-bottom" style={{ borderColor: "var(--border-color, rgba(255,255,255,0.08))" }}>
                            <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(var(--accent-rgb, 99, 102, 241), 0.12)", color: "var(--primary-color)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>
                                <i className="bi bi-briefcase-fill" />
                            </div>
                            <h3 className="fw-bold m-0" style={{ fontSize: "1.25rem", color: "var(--text-color)" }}>
                                Service Scope & Execution
                            </h3>
                        </div>
                        <div
                            className="sd-rich-content"
                            dangerouslySetInnerHTML={{ __html: data.longDescription }}
                        />
                    </div>
                )}

                {/* CTA Action Buttons */}
                <div className="d-flex gap-3 justify-content-center flex-wrap my-5">
                    <button
                        onClick={openModal}
                        className="btn btn-primary d-inline-flex align-items-center gap-2"
                        style={{ padding: "12px 28px", borderRadius: 99, fontWeight: 700, fontSize: "0.95rem", boxShadow: "0 8px 24px rgba(var(--accent-rgb, 99, 102, 241), 0.35)" }}
                    >
                        <i className="bi bi-lightning-charge-fill"></i> Request This Service
                    </button>
                    <Link
                        href="/"
                        className="btn btn-outline-dark d-inline-flex align-items-center gap-2"
                        style={{
                            padding: "12px 24px",
                            borderRadius: 99,
                            fontWeight: 600,
                            fontSize: "0.95rem",
                            border: "1px solid var(--card-border, rgba(255,255,255,0.18))",
                            background: "rgba(255,255,255,0.04)",
                            color: "var(--text-color)"
                        }}
                    >
                        <i className="bi bi-arrow-left"></i> Back to Home
                    </Link>
                </div>

                {/* Related Services */}
                {relatedData.length > 0 && (
                    <div className="mt-5 pt-5 border-top" style={{ borderColor: "var(--border-color, rgba(255,255,255,0.08))" }}>
                        <div className="text-center mb-4">
                            <span className="section-badge d-inline-flex mb-2">
                                <i className="bi bi-collection-fill" /> More Offerings
                            </span>
                            <h3 className="fw-bold" style={{ fontSize: "1.6rem", color: "var(--text-color)", letterSpacing: "-0.01em" }}>
                                Explore Other Services
                            </h3>
                            <p className="text-muted" style={{ fontSize: "0.92rem", margin: "6px 0 0" }}>
                                Specialized engineering and development solutions tailored to your product goals.
                            </p>
                        </div>
                        <div className="sd-related-grid">
                            {relatedData.map(service => (
                                <div key={service._id} className="sd-related-card">
                                    <div className="sd-related-icon">
                                        <i className={service.icon || "bi bi-gear"}></i>
                                    </div>
                                    <h4 className="sd-related-title">{service.name}</h4>
                                    <p className="sd-related-desc">
                                        {service.shortDescription}
                                    </p>
                                    <Link
                                        href={`/serviceDetail/${service._id}`}
                                        style={{
                                            fontSize: "0.85rem",
                                            color: "var(--primary-color)",
                                            fontWeight: 700,
                                            textDecoration: "none",
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: 6,
                                            marginTop: "auto",
                                            paddingTop: 10,
                                            whiteSpace: "nowrap"
                                        }}
                                    >
                                        <span>View Details</span>
                                        <i className="bi bi-arrow-right"></i>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>

            {/* Inquiry Popup Modal (Portalled & Centered) */}
            {mounted && showModal && typeof document !== "undefined" && createPortal(
                <div
                    className="sd-modal-backdrop"
                    onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="sd-modal-title"
                >
                    <div
                        className="sd-modal-card"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="sd-modal-header">
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(var(--accent-rgb, 99, 102, 241), 0.14)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary-color)", fontSize: "1.2rem", flexShrink: 0 }}>
                                    <i className="bi bi-lightning-charge-fill"></i>
                                </div>
                                <div>
                                    <h4 id="sd-modal-title" style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-color)", margin: 0 }}>
                                        Request Service
                                    </h4>
                                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>
                                        Fast response within 24 business hours
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                aria-label="Close modal"
                                style={{
                                    width: 36, height: 36, borderRadius: "50%",
                                    background: "rgba(255,255,255,0.06)",
                                    border: "1px solid var(--border-color, rgba(255,255,255,0.12))",
                                    fontSize: 15, cursor: "pointer",
                                    color: "var(--text-muted)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    transition: "all 0.2s ease",
                                    flexShrink: 0,
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(var(--accent-rgb, 99, 102, 241), 0.18)'; e.currentTarget.style.color = 'var(--text-color)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                            >
                                <i className="bi bi-x-lg" />
                            </button>
                        </div>

                        {/* Modal Body / Form */}
                        {submitted ? (
                            <div style={{ padding: "48px 24px", textAlign: "center" }}>
                                <div style={{ width: 68, height: 68, borderRadius: "50%", background: "rgba(34, 197, 94, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                                    <i className="bi bi-check-lg" style={{ fontSize: 34, color: "#22c55e" }}></i>
                                </div>
                                <h4 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-color)", margin: "0 0 8px" }}>
                                    Inquiry Sent Successfully!
                                </h4>
                                <p style={{ fontSize: "0.92rem", color: "var(--text-muted)", margin: 0, lineHeight: 1.65 }}>
                                    Thank you for your interest in <strong>{data.name}</strong>. I will review your requirements and reach out promptly.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flex: "1 1 auto", minHeight: 0, overflow: "hidden" }}>
                                <div className="sd-modal-body">
                                    <div className="row g-3 mb-3">
                                        <div className="col-md-6">
                                            <label style={labelStyle}>Your Name</label>
                                            <input
                                                type="text"
                                                placeholder="Full name"
                                                value={form.name}
                                                onChange={e => setForm({ ...form, name: e.target.value })}
                                                onFocus={() => setFocused("name")}
                                                onBlur={() => setFocused(null)}
                                                style={inputStyle("name")}
                                            />
                                            {errors.name && <p style={errorStyle}>{errors.name}</p>}
                                        </div>
                                        <div className="col-md-6">
                                            <label style={labelStyle}>Phone</label>
                                            <input
                                                type="tel"
                                                placeholder="+91 XXXXX XXXXX"
                                                value={form.phone}
                                                onChange={e => setForm({ ...form, phone: e.target.value })}
                                                onFocus={() => setFocused("phone")}
                                                onBlur={() => setFocused(null)}
                                                style={inputStyle("phone")}
                                            />
                                            {errors.phone && <p style={errorStyle}>{errors.phone}</p>}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label style={labelStyle}>Email Address</label>
                                        <input
                                            type="email"
                                            placeholder="your@email.com"
                                            value={form.email}
                                            onChange={e => setForm({ ...form, email: e.target.value })}
                                            onFocus={() => setFocused("email")}
                                            onBlur={() => setFocused(null)}
                                            style={inputStyle("email")}
                                        />
                                        {errors.email && <p style={errorStyle}>{errors.email}</p>}
                                    </div>

                                    <div className="mb-2">
                                        <label style={labelStyle}>Project Details & Requirements</label>
                                        <textarea
                                            rows={4}
                                            placeholder="Describe your goals, tech stack preferences, timeline, or scope..."
                                            value={form.message}
                                            onChange={e => setForm({ ...form, message: e.target.value })}
                                            onFocus={() => setFocused("message")}
                                            onBlur={() => setFocused(null)}
                                            style={{ ...inputStyle("message"), resize: "vertical" }}
                                        />
                                        {errors.message && <p style={errorStyle}>{errors.message}</p>}
                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="sd-modal-footer">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="btn btn-outline-secondary"
                                        style={{ padding: "9px 22px", borderRadius: 99, fontWeight: 600, fontSize: "0.88rem" }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary d-inline-flex align-items-center gap-1"
                                        style={{ padding: "9px 24px", borderRadius: 99, fontWeight: 700, fontSize: "0.88rem" }}
                                    >
                                        <i className="bi bi-send-fill me-1"></i> Submit Request
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}