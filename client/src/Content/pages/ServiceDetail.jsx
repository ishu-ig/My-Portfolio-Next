"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getService } from "../Redux/ActionCreartors/ServiceActionCreators";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ServiceDetails() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const ServiceStateData = useSelector(state => state.ServiceStateData);
    const [data, setData] = useState(null);
    const [relatedData, setRelatedData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [hovered, setHovered] = useState(null);

    // ── Form state ──
    const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [focused, setFocused] = useState(null);

    useEffect(() => { dispatch(getService()); }, [dispatch]);

    useEffect(() => {
        if (ServiceStateData?.length > 0) {
            setData(ServiceStateData.find(x => x._id == id) || null);
            setRelatedData(ServiceStateData.filter(x => x._id != id));
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

    // ── Validation ──
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
        let response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/servicerequest`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                servicename: data._id,
                name: form.name,
                email: form.email,
                phone: form.phone,
                message: form.message
            })
        });
        response = await response.json();

        if (response.result === "Done") {
            setSubmitted(true);
            setTimeout(() => setShowModal(false), 2500);
        } else {
            setErrors(response.reason);
        }
    } catch (error) {
        console.error("Submission failed:", error);
    }
};

    if (!data) return (
        <div style={{ textAlign: "center", padding: "80px 16px", color: "var(--text-color)" }}>
            Loading service details...
        </div>
    );

    const metaItems = [
        { icon: "bi-grid",           label: "Category",  value: data.category },
        { icon: "bi-currency-rupee", label: "Price",     value: data.price },
        { icon: "bi-clock",          label: "Duration",  value: `${data.duration} Weeks` },
        { icon: "bi-code-slash",     label: "Tech Stack", value: data.technology },
    ];

    // ── Shared input style ──
    const inputStyle = name => ({
        width: "100%", padding: "10px 14px",
        borderRadius: 10, fontSize: 13,
        border: `1px solid ${errors[name] ? "#ef4444" : focused === name ? "var(--primary-color)" : "var(--border-color)"}`,
        background: "var(--bg-color)", color: "var(--text-color)",
        outline: "none", transition: "border-color 0.2s",
    });

    const labelStyle = {
        fontSize: 11, fontWeight: 500, color: "var(--muted-color)",
        textTransform: "uppercase", letterSpacing: "1px",
        display: "block", marginBottom: 5,
    };

    const errorStyle = { fontSize: 11, color: "#ef4444", margin: "3px 0 0" };

    return (
        <>
            {/* ── Service Detail ── */}
            <section style={{ padding: "60px 16px", backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}>
                <div style={{ maxWidth: 860, margin: "0 auto" }}>

                    <div className="text-center mb-4">
                        <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--primary-color)", margin: "0 0 8px" }}>Service</p>
                        <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 700, color: "var(--text-color)", margin: "0 0 14px", lineHeight: 1.2 }}>
                            {data.name}
                        </h1>
                        <div style={{ width: 60, height: 4, background: "var(--primary-color)", borderRadius: 2, margin: "0 auto 20px" }} />
                        <p style={{ fontSize: 16, color: "var(--muted-color)", lineHeight: 1.7, maxWidth: 600, margin: "0 auto" }}>
                            {data.shortDescription}
                        </p>
                    </div>

                    <div style={{ borderTop: "1px dashed var(--border-color)", margin: "28px 0" }} />

                    <div style={{ fontSize: 15, lineHeight: 1.85, color: "var(--text-color)", marginBottom: 32 }}
                        dangerouslySetInnerHTML={{ __html: data.longDescription }} />

                    {/* Meta cards */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 32 }}>
                        {metaItems.map((m, i) => (
                            <div key={i} style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 10 }}>
                                <div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(0,123,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <i className={`bi ${m.icon}`} style={{ fontSize: 15, color: "var(--primary-color)" }}></i>
                                </div>
                                <div>
                                    <p style={{ fontSize: 10, fontWeight: 500, color: "var(--primary-color)", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 2px" }}>{m.label}</p>
                                    <p style={{ fontSize: 13, color: "var(--text-color)", margin: 0 }}>{m.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                        <button onClick={openModal} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "11px 26px", borderRadius: 999, background: "var(--primary-color)", color: "#fff", border: "none", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
                            <i className="bi bi-lightning-charge"></i> Get Service
                        </button>
                        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "11px 26px", borderRadius: 999, border: "1px solid var(--border-color)", background: "transparent", color: "var(--text-color)", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>
                            <i className="bi bi-house"></i> Home
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Related Services ── */}
            <section style={{ padding: "50px 16px", backgroundColor: "var(--bg-color)" }}>
                <div className="container">
                    <div className="text-center mb-4">
                        <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--primary-color)", margin: "0 0 8px" }}>More</p>
                        <h2 style={{ fontSize: "1.6rem", fontWeight: 600, color: "var(--text-color)", margin: "0 0 10px" }}>Other Services</h2>
                        <div style={{ width: 60, height: 4, background: "var(--primary-color)", borderRadius: 2, margin: "0 auto" }} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(clamp(140px, 42vw, 220px), 1fr))", gap: 16, maxWidth: 960, margin: "0 auto" }}>
                        {relatedData.map(service => (
                            <div key={service._id}
                                onMouseEnter={() => setHovered(service._id)}
                                onMouseLeave={() => setHovered(null)}
                                style={{ background: "var(--card-bg)", border: `1px solid ${hovered === service._id ? "var(--primary-color)" : "var(--border-color)"}`, borderRadius: 14, padding: "18px 16px", transition: "transform 0.22s, border-color 0.22s", transform: hovered === service._id ? "translateY(-5px)" : "translateY(0)", display: "flex", flexDirection: "column", gap: 10 }}
                            >
                                <div style={{ width: 42, height: 42, borderRadius: 10, background: "rgba(0,123,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <i className={service.icon} style={{ fontSize: 20, color: "var(--primary-color)" }}></i>
                                </div>
                                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-color)", margin: 0 }}>{service.name}</p>
                                <p style={{ fontSize: 12, color: "var(--muted-color)", margin: 0, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                    {service.shortDescription}
                                </p>
                                <Link href={`/serviceDetail/${service._id}`} style={{ fontSize: 12, color: "var(--primary-color)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 3, marginTop: "auto" }}>
                                    View Details <i className="bi bi-arrow-right"></i>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Inquiry Popup Form ── */}
            {showModal && (
                <div
                    onClick={e => e.target === e.currentTarget && setShowModal(false)}
                    style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 16 }}
                >
                    <div style={{ background: "var(--card-bg)", borderRadius: 18, width: "100%", maxWidth: 480, border: "1px solid var(--border-color)", overflow: "hidden", maxHeight: "95vh", overflowY: "auto" }}>

                        {/* Modal header */}
                        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(0,123,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <i className="bi bi-lightning-charge" style={{ fontSize: 17, color: "var(--primary-color)" }}></i>
                                </div>
                                <div>
                                    <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-color)", margin: 0 }}>Request Service</p>
                                    <p style={{ fontSize: 11, color: "var(--muted-color)", margin: 0 }}>We'll get back to you within 24 hours</p>
                                </div>
                            </div>
                            <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "var(--muted-color)", lineHeight: 1 }}>×</button>
                        </div>

                        {submitted ? (
                            /* ── Success state ── */
                            <div style={{ padding: "48px 24px", textAlign: "center" }}>
                                <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(22,163,74,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                                    <i className="bi bi-check-lg" style={{ fontSize: 28, color: "#16a34a" }}></i>
                                </div>
                                <p style={{ fontSize: 16, fontWeight: 600, color: "var(--text-color)", margin: "0 0 6px" }}>Request Sent!</p>
                                <p style={{ fontSize: 13, color: "var(--muted-color)", margin: 0, lineHeight: 1.6 }}>
                                    Thanks for your interest in <strong>{data.name}</strong>. We'll reach out soon.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} style={{ padding: "20px" }}>

                                {/* Service name — read only pill */}
                                <div style={{ marginBottom: 16 }}>
                                    <label style={labelStyle}>Service</label>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", borderRadius: 10, background: "rgba(0,123,255,0.06)", border: "1px solid rgba(0,123,255,0.2)" }}>
                                        <i className={data.icon} style={{ fontSize: 16, color: "var(--primary-color)" }}></i>
                                        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--primary-color)" }}>{data.name}</span>
                                        <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--muted-color)" }}>{data.price} · {data.duration} wks</span>
                                    </div>
                                </div>

                                {/* Name + Phone — side by side */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                                    <div>
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
                                    <div>
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

                                {/* Email — full width */}
                                <div style={{ marginBottom: 14 }}>
                                    <label style={labelStyle}>Email</label>
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

                                {/* Message — full width */}
                                <div style={{ marginBottom: 20 }}>
                                    <label style={labelStyle}>Message</label>
                                    <textarea
                                        rows={4}
                                        placeholder="Tell us about your project requirements, timeline, or any questions…"
                                        value={form.message}
                                        onChange={e => setForm({ ...form, message: e.target.value })}
                                        onFocus={() => setFocused("message")}
                                        onBlur={() => setFocused(null)}
                                        style={{ ...inputStyle("message"), resize: "vertical" }}
                                    />
                                    {errors.message && <p style={errorStyle}>{errors.message}</p>}
                                </div>

                                {/* Footer buttons */}
                                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        style={{ padding: "9px 20px", borderRadius: 999, border: "1px solid var(--border-color)", background: "transparent", color: "var(--text-color)", fontSize: 13, cursor: "pointer" }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        style={{ padding: "9px 22px", borderRadius: 999, background: "var(--primary-color)", color: "#fff", border: "none", fontSize: 13, fontWeight: 500, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}
                                    >
                                        <i className="bi bi-send"></i> Submit Request
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