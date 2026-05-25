"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function BlogCard({ blog, index }) {
    if (!blog) return null;
    const [hovered, setHovered] = useState(false);

    return (
        <div
            data-aos="fade-up"
            data-aos-delay={index * 100}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: "var(--card-bg)",
                border: `1px solid ${hovered ? "var(--primary-color)" : "var(--border-color)"}`,
                borderRadius: 14, overflow: "hidden",
                transition: "transform 0.22s, border-color 0.22s",
                transform: hovered ? "translateY(-5px)" : "translateY(0)",
                display: "flex", flexDirection: "column",
            }}
        >
            {/* Image */}
            <div style={{ position: "relative", height: 160, overflow: "hidden" }}>
                <img
                    src={blog.pic}
                    alt={blog.title}
                    loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.3s", transform: hovered ? "scale(1.05)" : "scale(1)" }}
                />
                {blog.category && (
                    <span style={{ position: "absolute", top: 10, left: 10, background: "var(--primary-color)", color: "#fff", fontSize: 10, fontWeight: 500, padding: "2px 9px", borderRadius: 999 }}>
                        {blog.category}
                    </span>
                )}
            </div>

            {/* Body */}
            <div style={{ padding: "14px", flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                {/* Meta */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11, color: "var(--muted-color)" }}>
                    <span>✍ {blog.author || "Admin"}</span>
                    <span>{new Date(blog.date).toDateString()}</span>
                </div>

                {/* Title */}
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-color)", lineHeight: 1.4, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {blog.title}
                </p>

                {/* Description */}
                <p style={{ fontSize: 12, color: "var(--muted-color)", lineHeight: 1.5, margin: 0, flex: 1, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {blog.shortDescription}
                </p>

                {/* Footer */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid var(--border-color)", marginTop: "auto" }}>
                    <span style={{ fontSize: 10, fontWeight: 500, background: "rgba(0,123,255,0.1)", color: "var(--primary-color)", padding: "2px 9px", borderRadius: 999 }}>
                        {blog.category || "Blog"}
                    </span>
                    <Link href={`/blogDetail/${blog._id}`} style={{ fontSize: 12, color: "var(--primary-color)", textDecoration: "none", display: "flex", alignItems: "center", gap: 3 }}>
                        Read <i className="bi bi-arrow-right"></i>
                    </Link>
                </div>
            </div>
        </div>
    );
}