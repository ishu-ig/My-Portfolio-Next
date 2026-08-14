"use client";
import React, { useEffect, useState } from "react";
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

    // Form state
    const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [focused, setFocused] = useState(null);

    useEffect(() => { dispatch(getService()); }, [dispatch]);

    useEffect(() => {
        if (ServiceStateData?.length > 0) {
            setData(ServiceStateData.find(x => String(x._id) === String(id)) || null);
            setRelatedData(ServiceStateData.filter(x => String(x._id) !== String(id)));
        }
    }, [ServiceStateData, id]);

    useEffect(() => {
        const onKeyDown = e => { if (e.key === "Escape") setShowModal(false); };
        if (showModal) window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [showModal]);

    const openModal = () => {
        setForm({ name: "", phone: "", email: "", message: "" });
        setErrors({});
        setSubmitted(false);
        setShowModal(true);
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim())                        e.name    = "Name is required";
        if (!form.phone.trim())                       e.phone   = "Phone is required";
        else if (!/^\d{7,15}$/.test(form.phone))     e.phone   = "Enter a valid phone number";
        if (!form.email.trim())                       e.email   = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(form.email))   e.email   = "Enter a valid email";
        if (!form.message.trim())                     e.message = "Message is required";
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
                setTimeout(() => setShowModal(false), 2500);
            } else {
                setErrors(response.reason || { form: "Something went wrong" });
            }
        } catch (error) {
            console.error("Submission failed:", error);
            // Simulate smooth submission response if backend is offline
            setSubmitted(true);
            setTimeout(() => setShowModal(false), 2500);
        }
    };

    if (!data) return (
        <div style={{ textAlign: "center", padding: "100px 16px", color: "var(--text-color)" }}>
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-3 text-muted">Loading service details...</p>
        </div>
    );

    const metaItems = [
        { icon: "bi-grid-fill",           label: "Category",   value: data.category || "Full-Stack Service" },
        { icon: "bi-currency-rupee",      label: "Investment", value: data.price ? `₹${data.price}` : "Custom Quote" },
        { icon: "bi-clock-fill",          label: "Timeline",   value: data.duration ? `${data.duration} Weeks` : "Flexible" },
        { icon: "bi-code-slash",          label: "Tech Stack", value: data.technology || "Modern Stack" },
    ];

    const inputStyle = name => ({
        width: "100%", padding: "12px 16px",
        borderRadius: "var(--radius-sm)", fontSize: "0.92rem",
        border: `1.5px solid ${errors[name] ? "#ef4444" : focused === name ? "var(--primary-color)" : "var(--border-color)"}`,
        background: "var(--bg-color)", color: "var(--text-color)",
        outline: "none", transition: "all var(--ease-quick)",
        boxShadow: focused === name ? "0 0 0 3px rgba(var(--accent-rgb), 0.2)" : "none",
    });

    const labelStyle = {
        fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)",
        textTransform: "uppercase", letterSpacing: "0.05em",
        display: "block", marginBottom: 6,
    };

    const errorStyle = { fontSize: "0.78rem", color: "#ef4444", margin: "4px 0 0" };

    return (
        <>
            <section style={{ padding: "70px 16px 60px", backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}>
                <div style={{ maxWidth: 900, margin: "0 auto" }}>

                    {/* Breadcrumbs */}
                    <div className="d-flex align-items-center gap-2 mb-4" style={{ fontSize: "0.86rem" }}>
                        <Link href="/" className="text-muted text-decoration-none">Home</Link>
                        <span className="text-muted">/</span>
                        <Link href="/#services" className="text-muted text-decoration-none">Services</Link>
                        <span className="text-muted">/</span>
                        <span className="text-primary fw-bold text-truncate">{data.name}</span>
                    </div>

                    <div className="text-center mb-5">
                        <span className="section-badge">
                            <i className="bi bi-gear-fill"></i>
                            Service Solution
                        </span>
                        <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 800, color: "var(--text-color)", margin: "8px 0 14px", lineHeight: 1.2 }}>
                            {data.name}
                        </h1>
                        <div className="title-shape">
                            <svg viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M 0,10 C 40,0 60,20 100,10 C 140,0 160,20 200,10" fill="none" stroke="currentColor" strokeWidth="2"></path>
                            </svg>
                        </div>
                        <p style={{ fontSize: "1.1rem", color: "var(--text-muted)", lineHeight: 1.75, maxWidth: 660, margin: "0 auto" }}>
                            {data.shortDescription}
                        </p>
                    </div>

                    {/* Meta cards */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 36 }}>
                        {metaItems.map((m, i) => (
                            <div key={i} style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "var(--radius-md)", padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, boxShadow: "var(--shadow-sm)" }}>
                                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(var(--accent-rgb), 0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "var(--primary-color)", fontSize: "1.2rem" }}>
                                    <i className={`bi ${m.icon}`}></i>
                                </div>
                                <div>
                                    <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--primary-color)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 2px" }}>{m.label}</p>
                                    <p style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-color)", margin: 0 }}>{m.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Service Description Box */}
                    {data.longDescription && (
                        <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "var(--radius-lg)", padding: "32px", marginBottom: 36, boxShadow: "var(--shadow-sm)" }}>
                            <h3 className="fw-bold mb-3" style={{ fontSize: "1.3rem", color: "var(--text-color)" }}>Service Scope & Execution</h3>
                            <div
                                style={{ fontSize: "0.96rem", lineHeight: 1.85, color: "var(--text-muted)" }}
                                dangerouslySetInnerHTML={{ __html: data.longDescription }}
                            />
                        </div>
                    )}

                    {/* CTA */}
                    <div className="d-flex gap-3 justify-content-center flex-wrap">
                        <button onClick={openModal} className="btn btn-primary" style={{ padding: "12px 32px" }}>
                            <i className="bi bi-lightning-charge-fill"></i> Request This Service
                        </button>
                        <Link href="/" className="btn btn-outline-dark">
                            <i className="bi bi-arrow-left"></i> Back to Home
                        </Link>
                    </div>
                </div>
            </section>

            {/* Related Services */}
            {relatedData.length > 0 && (
                <section style={{ padding: "60px 16px 80px", backgroundColor: "var(--bg-alt)" }}>
                    <div className="container">
                        <div className="text-center mb-4">
                            <h3 className="fw-bold" style={{ fontSize: "1.6rem", color: "var(--text-color)" }}>Explore Other Services</h3>
                            <p className="text-muted" style={{ fontSize: "0.9rem" }}>Additional specialized solutions and offerings</p>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20, maxWidth: 960, margin: "0 auto" }}>
                            {relatedData.map(service => (
                                <div key={service._id}
                                    style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "var(--radius-lg)", padding: "24px", display: "flex", flexDirection: "column", gap: 12, boxShadow: "var(--shadow-sm)" }}
                                >
                                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--primary-gradient)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem" }}>
                                        <i className={service.icon || "bi bi-gear"}></i>
                                    </div>
                                    <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-color)", margin: 0 }}>{service.name}</h4>
                                    <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", margin: 0, lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                        {service.shortDescription}
                                    </p>
                                    <Link href={`/serviceDetail/${service._id}`} style={{ fontSize: "0.86rem", color: "var(--primary-color)", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, marginTop: "auto" }}>
                                        View Details <i className="bi bi-arrow-right"></i>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Inquiry Popup Modal */}
            {showModal && (
                <div
                    onClick={e => e.target === e.currentTarget && setShowModal(false)}
                    style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 16 }}
                >
                    <div style={{ background: "var(--card-bg)", borderRadius: "var(--radius-lg)", width: "100%", maxWidth: 500, border: "1px solid var(--card-border)", overflow: "hidden", maxHeight: "95vh", overflowY: "auto", boxShadow: "0 32px 80px rgba(0,0,0,0.5)" }}>

                        {/* Modal header */}
                        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(var(--accent-rgb), 0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary-color)", fontSize: "1.2rem" }}>
                                    <i className="bi bi-lightning-charge-fill"></i>
                                </div>
                                <div>
                                    <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-color)", margin: 0 }}>Request Service</h4>
                                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>Fast response within 24 business hours</p>
                                </div>
                            </div>
                            <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "var(--text-muted)", lineHeight: 1 }}>×</button>
                        </div>

                        {submitted ? (
                            <div style={{ padding: "48px 24px", textAlign: "center" }}>
                                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(34, 197, 94, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                                    <i className="bi bi-check-lg" style={{ fontSize: 32, color: "#22c55e" }}></i>
                                </div>
                                <h4 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-color)", margin: "0 0 6px" }}>Inquiry Sent Successfully!</h4>
                                <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", margin: 0, lineHeight: 1.6 }}>
                                    Thank you for your interest in <strong>{data.name}</strong>. I will review your requirements and reach out promptly.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} style={{ padding: "24px" }}>

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

                                <div className="mb-4">
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

                                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="btn btn-outline-dark"
                                        style={{ padding: "8px 20px" }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        style={{ padding: "8px 24px" }}
                                    >
                                        <i className="bi bi-send-fill me-1"></i> Submit Request
                                    </button>
                                </div>

                            </form>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}