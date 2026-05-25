"use client";
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const personalInfo = [
    { label: "Name",        value: "Ishaan Gupta" },
    { label: "Phone",       value: "+91-8218635344" },
    { label: "Age",         value: "23 Years" },
    { label: "Email",       value: "ishaanguptacse@gmail.com" },
    { label: "Occupation",  value: "Full Stack Developer" },
    { label: "Nationality", value: "Indian" },
];

export default function About() {
    useEffect(() => {
        AOS.init({ duration: 900, once: false });
    }, []);

    return (
        <section id="about" style={{ padding: "70px 16px", backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}>
            <div className="container">

                {/* Header */}
                <div className="text-center mb-5" data-aos="fade-up">
                    <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--primary-color)", margin: "0 0 8px" }}>
                        Who I Am
                    </p>
                    <h2 style={{ fontSize: "2rem", fontWeight: 600, color: "var(--text-color)", margin: "0 0 10px" }}>About</h2>
                    <svg viewBox="0 0 80 16" style={{ width: 70, display: "block", margin: "0 auto 14px" }}>
                        <path d="M0 8 C13 0,20 16,40 8 C60 0,67 16,80 8" stroke="var(--primary-color)" strokeWidth="2" fill="none" strokeLinecap="round" />
                    </svg>
                    <p style={{ fontSize: 15, color: "var(--muted-color)", maxWidth: 500, margin: "0 auto", lineHeight: 1.6 }}>
                        Passionate about building scalable web applications and exploring the latest technologies.
                    </p>
                </div>

                {/* Two-column layout */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
                    gap: 40, alignItems: "center", maxWidth: 960, margin: "0 auto",
                }}>
                    {/* Image */}
                    <div data-aos="fade-right">
                        <img
                            src="/img/profile/my_image.jpg"
                            alt="Ishaan Gupta"
                            style={{ width: "100%", borderRadius: 16, objectFit: "cover", maxHeight: 400, display: "block" }}
                        />
                    </div>

                    {/* Content */}
                    <div data-aos="fade-left">
                        <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "2px", textTransform: "uppercase", color: "var(--primary-color)", margin: "0 0 6px" }}>
                            About Me
                        </p>
                        <h3 style={{ fontSize: "clamp(1.4rem, 3vw, 1.8rem)", fontWeight: 600, color: "var(--text-color)", margin: "0 0 14px", lineHeight: 1.3 }}>
                            Full Stack Web Developer &amp; Programmer
                        </h3>
                        <p style={{ fontSize: 14, color: "var(--muted-color)", lineHeight: 1.75, marginBottom: 10 }}>
                            I specialise in building modern web applications using cutting-edge technologies like React, Node.js, MongoDB, and more. I enjoy solving complex problems and continuously improving my skills.
                        </p>
                        <p style={{ fontSize: 14, color: "var(--muted-color)", lineHeight: 1.75, marginBottom: 24 }}>
                            My goal is to develop innovative and efficient solutions that enhance user experience and drive business success.
                        </p>

                        {/* Info cards */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                            {personalInfo.map((item, i) => (
                                <div key={i} style={{
                                    background: "var(--card-bg)",
                                    border: "1px solid var(--border-color)",
                                    borderRadius: 10, padding: "10px 12px",
                                }}>
                                    <p style={{ fontSize: 10, fontWeight: 500, color: "var(--primary-color)", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 2px" }}>
                                        {item.label}
                                    </p>
                                    <p style={{ fontSize: 13, color: "var(--text-color)", margin: 0 }}>
                                        {item.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}