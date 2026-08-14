"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import formValidator from "../FormValidators/formValidator";
import { createContactUs } from "../Redux/ActionCreators/ContactUsActionCreators";
import { getAbout } from "../Redux/ActionCreators/AboutActionCreators";
import "aos/dist/aos.css";
import AOS from "aos";

const socials = [
    { icon: "bi-github",    key: "gitLink",      label: "GitHub" },
    { icon: "bi-linkedin",  key: "linkidinLink",  label: "LinkedIn" },
    { icon: "bi-instagram", key: "instaLink",     label: "Instagram" },
    { icon: "bi-whatsapp",  key: "whatsapp",      label: "WhatsApp" },
];

export default function ContactUs() {
    const dispatch = useDispatch();
    const AboutStateData = useSelector(state => state.AboutStateData);
    const about = AboutStateData?.[0] || null;
    const [copiedKey, setCopiedKey] = useState(null);

    useEffect(() => {
        dispatch(getAbout());
        AOS.init({ duration: 900, once: true });
    }, [dispatch]);

    const whatsappNumber = (about?.whatsapp || about?.phone || "").replace(/\D/g, "");
    const whatsappHref = whatsappNumber ? `https://wa.me/${whatsappNumber}` : null;

    const contactInfo = [
        { icon: "bi-envelope-at-fill",  label: "Email Address",  value: about?.email    || "ishaan.gupta@example.com", copyable: true,  href: about?.email ? `mailto:${about.email}` : null },
        { icon: "bi-telephone-fill",    label: "Phone Number",   value: about?.phone    || "+91 98765 43210",          copyable: true,  href: null },
        { icon: "bi-whatsapp",          label: "WhatsApp",       value: whatsappNumber  ? `+${whatsappNumber}`        : "Chat on WhatsApp", copyable: false, href: whatsappHref, accent: "#25d366" },
        { icon: "bi-geo-alt-fill",      label: "Current Base",   value: about?.nationality || "India",                copyable: false, href: null },
    ];

    const defaultText = "Have a question, high-impact project, or architectural inquiry? Let's connect and build something extraordinary.";
    const thankYouText = "Thank you for reaching out! Your message has been received. I'll get back to you shortly! 🚀";

    const [data, setData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
    const [errorMessage, setErrorMessage] = useState({
        name: "Name field is mandatory",
        email: "Email field is mandatory",
        phone: "Phone field is mandatory",
        subject: "Subject field is mandatory",
        message: "Message field is mandatory",
    });
    const [show, setShow] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [focused, setFocused] = useState(null);

    const getInputData = e => {
        const { name, value } = e.target;
        setErrorMessage(old => ({ ...old, [name]: formValidator(e) }));
        setData(old => ({ ...old, [name]: value }));
    };

    const resetForm = () => {
        setData({ name: "", email: "", phone: "", subject: "", message: "" });
        setErrorMessage({
            name: "Name field is mandatory",
            email: "Email field is mandatory",
            phone: "Phone field is mandatory",
            subject: "Subject field is mandatory",
            message: "Message field is mandatory",
        });
        setShow(false);
        setIsSubmitted(false);
    };

    const postData = e => {
        e.preventDefault();
        const error = Object.values(errorMessage).find(x => x !== "");
        if (error) { setShow(true); return; }
        dispatch(createContactUs({ ...data, active: true, date: new Date() }));
        setData({ name: "", email: "", phone: "", subject: "", message: "" });
        setShow(false);
        setIsSubmitted(true);
    };

    const handleCopy = (text, key) => {
        if (!navigator.clipboard) return;
        navigator.clipboard.writeText(text);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    const inputStyle = (name) => ({
        width: "100%",
        padding: "12px 16px",
        borderRadius: "var(--radius-sm)",
        border: `1.5px solid ${show && errorMessage[name] ? "#ef4444" : focused === name ? "var(--primary-color)" : "var(--border-color)"}`,
        background: "var(--bg-color)",
        color: "var(--text-color)",
        fontSize: "0.92rem",
        outline: "none",
        transition: "all var(--ease-quick)",
        boxShadow: focused === name ? "0 0 0 3px rgba(var(--accent-rgb), 0.2)" : "none",
    });

    return (
        <section
            id="contact"
            style={{ padding: "95px 0 60px", backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
        >
            <div className="container">

                {/* Header */}
                <div className="text-center mb-5" data-aos="fade-up">
                    <span className="section-badge">
                        <i className="bi bi-chat-dots-fill"></i>
                        Get In Touch
                    </span>
                    <h2 className="section-title">
                        Let's Work Together
                    </h2>
                    <div className="title-shape">
                        <svg viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M 0,10 C 40,0 60,20 100,10 C 140,0 160,20 200,10" fill="none" stroke="currentColor" strokeWidth="2"></path>
                        </svg>
                    </div>
                    <p className="section-subtitle">
                        {isSubmitted ? thankYouText : defaultText}
                    </p>
                </div>

                {/* Grid */}
                <div className="row g-5 align-items-start justify-content-center">

                    {/* Left Column: Direct Info & Socials */}
                    <div className="col-lg-5" data-aos="fade-right" data-aos-delay="100">
                        <div style={{ paddingRight: "10px" }}>
                            <h3 className="fw-bold mb-3" style={{ fontSize: "1.4rem", color: "var(--text-color)" }}>
                                Start a Conversation
                            </h3>
                            <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.75, marginBottom: 28 }}>
                                I'm always open to discussing new projects, high-performance architecture, and technical consulting.
                            </p>

                            {/* Info Tiles */}
                            <div className="d-flex flex-column gap-3 mb-4">
                                {contactInfo.map((item, i) => {
                                    const tileContent = (
                                        <>
                                            <div style={{
                                                width: 44, height: 44,
                                                borderRadius: 12,
                                                background: item.accent ? `${item.accent}1a` : "rgba(var(--accent-rgb), 0.12)",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                flexShrink: 0,
                                                color: item.accent || "var(--primary-color)",
                                                fontSize: "1.2rem",
                                            }}>
                                                <i className={`bi ${item.icon}`}></i>
                                            </div>
                                            <div style={{ flexGrow: 1, minWidth: 0 }}>
                                                <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 2px" }}>
                                                    {item.label}
                                                </p>
                                                <p style={{ fontSize: "0.92rem", fontWeight: 600, color: "var(--text-color)", margin: 0 }} className="text-truncate">
                                                    {item.value}
                                                </p>
                                            </div>
                                            {item.copyable && (
                                                <span
                                                    className="badge bg-primary rounded-pill"
                                                    style={{ fontSize: "0.7rem", padding: "4px 10px", opacity: copiedKey === item.label ? 1 : 0.6 }}
                                                >
                                                    {copiedKey === item.label ? "Copied! ✓" : "Copy"}
                                                </span>
                                            )}
                                            {item.href && !item.copyable && (
                                                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: item.accent || "var(--primary-color)", whiteSpace: "nowrap" }}>
                                                    Open <i className="bi bi-box-arrow-up-right" style={{ fontSize: "0.65rem" }}></i>
                                                </span>
                                            )}
                                        </>
                                    );

                                    const tileStyle = {
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 14,
                                        padding: "14px 18px",
                                        background: "var(--card-bg)",
                                        border: `1px solid ${item.accent ? `${item.accent}33` : "var(--card-border)"}`,
                                        borderRadius: "var(--radius-md)",
                                        boxShadow: "var(--shadow-sm)",
                                        cursor: item.copyable || item.href ? "pointer" : "default",
                                        transition: "all var(--ease-quick)",
                                        textDecoration: "none",
                                    };

                                    return item.href ? (
                                        <a
                                            key={i}
                                            href={item.href}
                                            target={item.href.startsWith("http") ? "_blank" : undefined}
                                            rel="noopener noreferrer"
                                            style={tileStyle}
                                            className="info-card-hover"
                                        >
                                            {tileContent}
                                        </a>
                                    ) : (
                                        <div
                                            key={i}
                                            onClick={() => item.copyable && handleCopy(item.value, item.label)}
                                            style={tileStyle}
                                            className="info-card-hover"
                                            title={item.copyable ? "Click to copy" : ""}
                                        >
                                            {tileContent}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Social Badges */}
                            <div className="pt-2">
                                <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
                                    Follow & Connect
                                </p>
                                <div className="d-flex gap-2 flex-wrap">
                                    {socials.map((s, i) => {
                                        let href = about?.[s.key] || "#";
                                        // Auto-build wa.me link for WhatsApp
                                        if (s.key === "whatsapp" && href !== "#") {
                                            const num = href.replace(/\D/g, "");
                                            href = num ? `https://wa.me/${num}` : "#";
                                        }
                                        return (
                                            <a
                                                key={i}
                                                href={href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="social-icon-btn"
                                                title={s.label}
                                                style={s.key === "whatsapp" && href !== "#" ? { color: "#25d366" } : undefined}
                                            >
                                                <i className={`bi ${s.icon}`}></i>
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Contact Form / Success */}
                    <div className="col-lg-7" data-aos="fade-left" data-aos-delay="150">
                        <div style={{
                            background: "var(--card-bg)",
                            border: "1px solid var(--card-border)",
                            borderRadius: "var(--radius-xl)",
                            padding: "36px 32px",
                            boxShadow: "var(--shadow-md)",
                            minHeight: 420,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                        }}>

                            {isSubmitted ? (
                                /* ── Success / Thank-you Screen ── */
                                <div style={{ textAlign: "center", padding: "24px 0" }}>
                                    {/* Animated Checkmark Circle */}
                                    <div style={{
                                        width: 88,
                                        height: 88,
                                        borderRadius: "50%",
                                        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        margin: "0 auto 24px",
                                        boxShadow: "0 0 0 14px rgba(16,185,129,0.12), 0 0 0 28px rgba(16,185,129,0.06)",
                                        animation: "successPulse 2s ease-in-out infinite",
                                    }}>
                                        <i className="bi bi-check-lg" style={{ fontSize: "2.4rem", color: "#fff" }}></i>
                                    </div>

                                    {/* Heading */}
                                    <h3 style={{
                                        fontSize: "1.55rem",
                                        fontWeight: 800,
                                        background: "var(--primary-gradient)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                        backgroundClip: "text",
                                        marginBottom: 10,
                                    }}>
                                        Message Sent Successfully! 🚀
                                    </h3>

                                    {/* Sub text */}
                                    <p style={{ fontSize: "1rem", color: "var(--text-muted)", maxWidth: 420, margin: "0 auto 8px", lineHeight: 1.65 }}>
                                        Thank you for reaching out! Your query has been received.
                                    </p>
                                    <p style={{ fontSize: "0.92rem", color: "var(--text-muted)", maxWidth: 400, margin: "0 auto 28px", lineHeight: 1.6 }}>
                                        I typically respond within <strong style={{ color: "var(--primary-color)" }}>24–48 hours</strong>. Keep an eye on your inbox! 📬
                                    </p>

                                    {/* Divider */}
                                    <div style={{ width: 60, height: 2, background: "var(--primary-gradient)", borderRadius: 2, margin: "0 auto 28px" }}></div>

                                    {/* CTA Button */}
                                    <button
                                        onClick={resetForm}
                                        className="btn btn-primary px-5 py-3"
                                        style={{ fontSize: "0.95rem", borderRadius: "var(--radius-sm)" }}
                                    >
                                        <i className="bi bi-pencil-square me-2"></i> Send Another Message
                                    </button>
                                </div>
                            ) : (
                                /* ── Contact Form ── */
                                <form onSubmit={postData} className="d-flex flex-column gap-3">

                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>
                                                Your Name
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={data.name}
                                                onChange={getInputData}
                                                onFocus={() => setFocused("name")}
                                                onBlur={() => setFocused(null)}
                                                placeholder="e.g. Alex Carter"
                                                style={inputStyle("name")}
                                            />
                                            {show && errorMessage.name && (
                                                <p style={{ fontSize: "0.78rem", color: "#ef4444", margin: "4px 0 0" }}>{errorMessage.name}</p>
                                            )}
                                        </div>

                                        <div className="col-md-6">
                                            <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={data.email}
                                                onChange={getInputData}
                                                onFocus={() => setFocused("email")}
                                                onBlur={() => setFocused(null)}
                                                placeholder="alex@company.com"
                                                style={inputStyle("email")}
                                            />
                                            {show && errorMessage.email && (
                                                <p style={{ fontSize: "0.78rem", color: "#ef4444", margin: "4px 0 0" }}>{errorMessage.email}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>
                                                Phone Number
                                            </label>
                                            <input
                                                type="number"
                                                name="phone"
                                                value={data.phone}
                                                onChange={getInputData}
                                                onFocus={() => setFocused("phone")}
                                                onBlur={() => setFocused(null)}
                                                placeholder="+91 98765 43210"
                                                style={inputStyle("phone")}
                                            />
                                            {show && errorMessage.phone && (
                                                <p style={{ fontSize: "0.78rem", color: "#ef4444", margin: "4px 0 0" }}>{errorMessage.phone}</p>
                                            )}
                                        </div>

                                        <div className="col-md-6">
                                            <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>
                                                Subject
                                            </label>
                                            <input
                                                type="text"
                                                name="subject"
                                                value={data.subject}
                                                onChange={getInputData}
                                                onFocus={() => setFocused("subject")}
                                                onBlur={() => setFocused(null)}
                                                placeholder="Project Inquiry / Hiring"
                                                style={inputStyle("subject")}
                                            />
                                            {show && errorMessage.subject && (
                                                <p style={{ fontSize: "0.78rem", color: "#ef4444", margin: "4px 0 0" }}>{errorMessage.subject}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>
                                            Project Details / Message
                                        </label>
                                        <textarea
                                            name="message"
                                            rows={4}
                                            value={data.message}
                                            onChange={getInputData}
                                            onFocus={() => setFocused("message")}
                                            onBlur={() => setFocused(null)}
                                            placeholder="Describe your timeline, project requirements, or ideas..."
                                            style={{ ...inputStyle("message"), resize: "vertical" }}
                                        />
                                        {show && errorMessage.message && (
                                            <p style={{ fontSize: "0.78rem", color: "#ef4444", margin: "4px 0 0" }}>{errorMessage.message}</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 py-3 mt-2"
                                        style={{ fontSize: "1rem" }}
                                    >
                                        <i className="bi bi-send-fill me-2"></i> Send Message
                                    </button>

                                </form>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}