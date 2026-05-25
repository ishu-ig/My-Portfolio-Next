"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createNewsletter } from "../Redux/ActionCreartors/NewsletterActionCreators";

export default function Footer() {
    const dispatch = useDispatch();
    const defaultMsg = "Get updates about new projects, UI/UX upgrades, and tech insights.";
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState(defaultMsg);
    const [inputFocused, setInputFocused] = useState(false);

    const getInputData = e => {
        setEmail(e.target.value);
        setError(e.target.value ? "" : "Email is mandatory");
    };

    const postSubmit = e => {
        e.preventDefault();
        if (!email) { setError("Email is mandatory"); return; }
        dispatch(createNewsletter({ email }));
        setMessage("Thanks for subscribing! You'll now get updates on our latest blog uploads.");
        setTimeout(() => setMessage(defaultMsg), 20000);
        setEmail("");
    };

    const socials = [
        { icon: "bi-twitter-x", href: "#" },
        { icon: "bi-facebook", href: "#" },
        { icon: "bi-instagram", href: "https://www.instagram.com/_ishaan_12" },
        { icon: "bi-linkedin", href: "https://www.linkedin.com/in/ishaan-gupta-2a0568242" },
        { icon: "bi-github", href: "#" },
    ];

    return (
        <footer id="footer" style={{ backgroundColor: "var(--footer-bg)", borderTop: "1px solid var(--footer-border)", padding: "50px 16px 28px" }}>
            <div className="container">

                {/* ── Newsletter card ── */}
                <div style={{
                    background: "var(--card-bg)",
                    border: "1px solid var(--border-color)",
                    borderRadius: 16, padding: "28px 24px",
                    marginBottom: 40,
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
                    gap: 20, alignItems: "center",
                }}>
                    {/* Left */}
                    <div>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0,123,255,0.1)", color: "var(--primary-color)", fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 999, marginBottom: 10, letterSpacing: "1px", textTransform: "uppercase" }}>
                            <i className="bi bi-envelope"></i> Newsletter
                        </div>
                        <h4 style={{ fontSize: 17, fontWeight: 600, color: "var(--footer-text)", margin: "0 0 6px" }}>
                            Join Our Newsletter
                        </h4>
                        <p style={{ fontSize: 13, color: "var(--muted-color)", margin: 0, lineHeight: 1.6 }}>{message}</p>
                    </div>

                    {/* Right — form */}
                    <div>
                        <form onSubmit={postSubmit}>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                <input
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={getInputData}
                                    onFocus={() => setInputFocused(true)}
                                    onBlur={() => setInputFocused(false)}
                                    placeholder="Enter your email"
                                    style={{
                                        flex: 1, minWidth: 0, padding: "10px 16px",
                                        borderRadius: 999, fontSize: 13,
                                        border: `1px solid ${error ? "#ef4444" : inputFocused ? "var(--primary-color)" : "var(--border-color)"}`,
                                        background: "var(--bg-color)", color: "var(--footer-text)",
                                        outline: "none", transition: "border-color 0.2s",
                                    }}
                                />
                                <button type="submit" style={{ padding: "10px 20px", borderRadius: 999, background: "var(--primary-color)", color: "#fff", border: "none", fontSize: 13, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap" }}>
                                    Subscribe
                                </button>
                            </div>
                            {error && <p style={{ fontSize: 11, color: "#ef4444", margin: "5px 0 0 4px" }}>{error}</p>}
                        </form>
                    </div>
                </div>

                {/* ── Bottom bar ── */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>

                    {/* Brand */}
                    <p style={{ fontSize: 17, fontWeight: 700, color: "var(--footer-text)", margin: 0, letterSpacing: 0.5 }}>
                        Portfolio
                    </p>

                    {/* Social icons */}
                    <div style={{ display: "flex", gap: 8 }}>
                        {socials.map((s, i) => (
                            <a
                                key={i}
                                href={s.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    width: 34, height: 34, borderRadius: "50%",
                                    border: "1px solid var(--footer-border)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    color: "var(--footer-text)", fontSize: 15, textDecoration: "none",
                                    transition: "background 0.2s, color 0.2s",
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = "var(--primary-color)"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "var(--primary-color)"; }}
                                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--footer-text)"; e.currentTarget.style.borderColor = "var(--footer-border)"; }}
                            >
                                <i className={`bi ${s.icon}`}></i>
                            </a>
                        ))}
                    </div>

                    {/* Divider */}
                    <div style={{ width: "100%", height: 1, background: "var(--footer-border)" }} />

                    {/* Copyright */}
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 6, fontSize: 12, color: "var(--muted-color)", textAlign: "center" }}>
                        <span>© 2025 <strong style={{ color: "var(--footer-text)" }}>Portfolio</strong> · All Rights Reserved</span>
                        <span>·</span>
                        <span>Designed &amp; Developed by <strong style={{ color: "var(--footer-text)" }}>Ishaan Gupta</strong></span>
                    </div>
                </div>

            </div>
        </footer>
    );
}