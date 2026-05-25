"use client";
import React, { useContext, useState } from "react";
import { ThemeContext } from "../ThemeContext";
import { useDispatch } from "react-redux";
import formValidator from "../FormValidators/formValidator";
import { createContactUs } from "../Redux/ActionCreartors/ContactUsActionCreators";

const contactInfo = [
    { icon: "bi-envelope", label: "Email",    value: "ishaanguptacse@gmail.com" },
    { icon: "bi-telephone", label: "Phone",   value: "+91 82186 35344" },
    { icon: "bi-geo-alt",   label: "Location", value: "India" },
];

const socials = [
    { icon: "bi-github",    href: "#" },
    { icon: "bi-linkedin",  href: "https://www.linkedin.com/in/ishaan-gupta-2a0568242" },
    { icon: "bi-instagram", href: "https://www.instagram.com/_ishaan_12" },
    { icon: "bi-twitter-x", href: "#" },
];

const fields = [
    { name: "name",    label: "Name",    type: "text",   placeholder: "Your Name" },
    { name: "email",   label: "Email",   type: "email",  placeholder: "Your Email" },
    { name: "phone",   label: "Phone",   type: "number", placeholder: "Your Phone" },
    { name: "subject", label: "Subject", type: "text",   placeholder: "Subject" },
];

export default function ContactUs() {
    const { theme } = useContext(ThemeContext);
    const dispatch = useDispatch();

    const defaultText = "Have questions? We are here to help. Reach out to us anytime and we'll get back to you as soon as possible.";
    const thankYouText = "Thank you for contacting us! We will reach out to you soon. 🎉";

    const [data, setData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
    const [errorMessage, setErrorMessage] = useState({
        name: "Name field is mandatory",
        email: "Email field is mandatory",
        phone: "Phone field is mandatory",
        subject: "Subject field is mandatory",
        message: "Message field is mandatory",
    });
    const [show, setShow] = useState(false);
    const [displayText, setDisplayText] = useState(defaultText);
    const [focused, setFocused] = useState(null);

    const getInputData = e => {
        const { name, value } = e.target;
        setErrorMessage(old => ({ ...old, [name]: formValidator(e) }));
        setData(old => ({ ...old, [name]: value }));
    };

    const postData = e => {
        e.preventDefault();
        const error = Object.values(errorMessage).find(x => x !== "");
        if (error) { setShow(true); return; }
        dispatch(createContactUs({ ...data, active: true, date: new Date() }));
        setData({ name: "", email: "", phone: "", subject: "", message: "" });
        setShow(false);
        setDisplayText(thankYouText);
        setTimeout(() => setDisplayText(defaultText), 20000);
    };

    const inputStyle = (name) => ({
        width: "100%",
        padding: "10px 14px",
        borderRadius: 10,
        border: `1px solid ${show && errorMessage[name] ? "#ef4444" : focused === name ? "var(--primary-color)" : "var(--border-color)"}`,
        background: "var(--bg-color)",
        color: "var(--text-color)",
        fontSize: 13,
        outline: "none",
        transition: "border-color 0.2s",
    });

    return (
        <>
            <section
                id="contact"
                style={{ padding: "70px 16px 50px", backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
            >
                <div className="container">

                    {/* ── Header ── */}
                    <div className="text-center mb-5" data-aos="fade-up">
                        <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--primary-color)", margin: "0 0 8px" }}>
                            Contact
                        </p>
                        <h2 style={{ fontSize: "2rem", fontWeight: 600, color: "var(--text-color)", margin: "0 0 10px" }}>
                            Get in Touch
                        </h2>
                        <svg viewBox="0 0 80 16" style={{ width: 70, display: "block", margin: "0 auto 14px" }}>
                            <path d="M0 8 C13 0,20 16,40 8 C60 0,67 16,80 8" stroke="var(--primary-color)" strokeWidth="2" fill="none" strokeLinecap="round" />
                        </svg>
                        <p style={{ fontSize: 15, color: "var(--muted-color)", maxWidth: 460, margin: "0 auto", lineHeight: 1.6 }}>
                            {displayText}
                        </p>
                    </div>

                    {/* ── Two-column grid ── */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
                        gap: 32,
                        alignItems: "start",
                        maxWidth: 960,
                        margin: "0 auto",
                    }}>

                        {/* ── Left: Info ── */}
                        <div data-aos="fade-right">
                            <p style={{ fontSize: 14, color: "var(--muted-color)", lineHeight: 1.75, marginBottom: 24 }}>
                                Have a project in mind or just want to say hi? Fill in the form and I'll get back to you within 24 hours.
                            </p>

                            {/* Contact info cards */}
                            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                                {contactInfo.map((item, i) => (
                                    <div key={i} style={{
                                        display: "flex", alignItems: "center", gap: 12,
                                        padding: "12px 14px",
                                        background: "var(--card-bg)",
                                        border: "1px solid var(--border-color)",
                                        borderRadius: 12,
                                    }}>
                                        <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(0,123,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                            <i className={`bi ${item.icon}`} style={{ fontSize: 16, color: "var(--primary-color)" }}></i>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: 10, fontWeight: 500, color: "var(--primary-color)", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 1px" }}>
                                                {item.label}
                                            </p>
                                            <p style={{ fontSize: 13, color: "var(--text-color)", margin: 0 }}>{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Social icons */}
                            <div style={{ display: "flex", gap: 8 }}>
                                {socials.map((s, i) => (
                                    <a
                                        key={i}
                                        href={s.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            width: 36, height: 36, borderRadius: "50%",
                                            border: "1px solid var(--border-color)",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            color: "var(--muted-color)", fontSize: 15, textDecoration: "none",
                                            transition: "background 0.2s, color 0.2s, border-color 0.2s",
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.background = "var(--primary-color)"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "var(--primary-color)"; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--muted-color)"; e.currentTarget.style.borderColor = "var(--border-color)"; }}
                                    >
                                        <i className={`bi ${s.icon}`}></i>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* ── Right: Form ── */}
                        <div data-aos="fade-left" style={{
                            background: "var(--card-bg)",
                            border: "1px solid var(--border-color)",
                            borderRadius: 16,
                            padding: "24px 20px",
                        }}>
                            <form onSubmit={postData} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

                                {/* Name + Email — full width */}
                                {fields.slice(0, 2).map(f => (
                                    <div key={f.name}>
                                        <label style={{ fontSize: 11, fontWeight: 500, color: "var(--muted-color)", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 5 }}>
                                            {f.label}
                                        </label>
                                        <input
                                            type={f.type}
                                            name={f.name}
                                            value={data[f.name]}
                                            onChange={getInputData}
                                            onFocus={() => setFocused(f.name)}
                                            onBlur={() => setFocused(null)}
                                            placeholder={f.placeholder}
                                            style={inputStyle(f.name)}
                                        />
                                        {show && errorMessage[f.name] && (
                                            <p style={{ fontSize: 11, color: "#ef4444", margin: "3px 0 0" }}>{errorMessage[f.name]}</p>
                                        )}
                                    </div>
                                ))}

                                {/* Phone + Subject — side by side */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                    {fields.slice(2, 4).map(f => (
                                        <div key={f.name}>
                                            <label style={{ fontSize: 11, fontWeight: 500, color: "var(--muted-color)", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 5 }}>
                                                {f.label}
                                            </label>
                                            <input
                                                type={f.type}
                                                name={f.name}
                                                value={data[f.name]}
                                                onChange={getInputData}
                                                onFocus={() => setFocused(f.name)}
                                                onBlur={() => setFocused(null)}
                                                placeholder={f.placeholder}
                                                style={inputStyle(f.name)}
                                            />
                                            {show && errorMessage[f.name] && (
                                                <p style={{ fontSize: 11, color: "#ef4444", margin: "3px 0 0" }}>{errorMessage[f.name]}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Message */}
                                <div>
                                    <label style={{ fontSize: 11, fontWeight: 500, color: "var(--muted-color)", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 5 }}>
                                        Message
                                    </label>
                                    <textarea
                                        name="message"
                                        rows={4}
                                        value={data.message}
                                        onChange={getInputData}
                                        onFocus={() => setFocused("message")}
                                        onBlur={() => setFocused(null)}
                                        placeholder="Your message…"
                                        style={{ ...inputStyle("message"), resize: "vertical" }}
                                    />
                                    {show && errorMessage.message && (
                                        <p style={{ fontSize: 11, color: "#ef4444", margin: "3px 0 0" }}>{errorMessage.message}</p>
                                    )}
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    style={{
                                        width: "100%", padding: "12px",
                                        borderRadius: 10,
                                        background: "var(--primary-color)", color: "#fff",
                                        border: "none", fontSize: 14, fontWeight: 500,
                                        cursor: "pointer", display: "flex", alignItems: "center",
                                        justifyContent: "center", gap: 6,
                                        transition: "opacity 0.2s",
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                                >
                                    <i className="bi bi-send"></i> Send Message
                                </button>

                            </form>
                        </div>

                    </div>
                </div>
            </section>
            <div style={{ marginBottom: 60 }} />
        </>
    );
}