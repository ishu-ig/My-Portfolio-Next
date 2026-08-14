"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function BlogCard({ blog, index }) {
    if (!blog) return null;

    const formattedDate = blog.date 
        ? new Date(blog.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "Recent";

    // Estimate reading time based on description length
    const wordsCount = ((blog.title || "") + " " + (blog.shortDescription || "") + " " + (blog.longDescription || "")).split(/\s+/).length;
    const readTime = Math.max(2, Math.ceil(wordsCount / 200));

    return (
        <div
            className="blog-card-v2"
            style={{
                backgroundColor: "var(--card-bg)",
                color: "var(--text-color)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--card-border)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                transition: "transform var(--ease-smooth), box-shadow var(--ease-smooth), border-color var(--ease-smooth)",
                boxShadow: "var(--shadow-sm)",
            }}
        >
            <style>{`
                .blog-card-v2:hover {
                    transform: translateY(-8px);
                    box-shadow: var(--shadow-lg), 0 0 30px rgba(var(--accent-rgb), 0.15);
                    border-color: var(--primary-color);
                }
                .blog-card-v2:hover .blog-card-img {
                    transform: scale(1.08);
                }
            `}</style>

            {/* Image Wrap */}
            <div
                style={{
                    width: "100%",
                    height: 200,
                    position: "relative",
                    overflow: "hidden",
                    flexShrink: 0,
                    background: "var(--bg-alt)",
                }}
            >
                <Image
                    src={blog.pic && typeof blog.pic === "string" && (blog.pic.startsWith("http") || blog.pic.startsWith("/")) ? blog.pic : "/img/portfolio/portfolio-1.webp"}
                    alt={blog.title || "Blog Post"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="blog-card-img"
                    style={{
                        objectFit: "cover",
                        transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                    loading={index < 3 ? undefined : "lazy"}
                />
                
                {/* Category Badge */}
                {blog.category && (
                    <span 
                        style={{
                            position: "absolute",
                            top: 12,
                            left: 12,
                            background: "var(--primary-color)",
                            color: "#ffffff",
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            padding: "4px 12px",
                            borderRadius: "var(--radius-pill)",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                            zIndex: 1,
                        }}
                    >
                        {blog.category}
                    </span>
                )}
            </div>

            {/* Body */}
            <div className="p-4 d-flex flex-column flex-grow-1 text-start">

                {/* Meta Header */}
                <div className="d-flex align-items-center justify-content-between mb-2" style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    <span className="d-flex align-items-center gap-1">
                        <i className="bi bi-calendar3"></i> {formattedDate}
                    </span>
                    <span className="d-flex align-items-center gap-1">
                        <i className="bi bi-clock"></i> {readTime} min read
                    </span>
                </div>

                {/* Title */}
                <h4
                    style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        lineHeight: 1.4,
                        marginBottom: 10,
                        color: "var(--text-color)",
                    }}
                >
                    {blog.title}
                </h4>

                {/* Short Description */}
                <p
                    style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        fontSize: "0.88rem",
                        color: "var(--text-muted)",
                        lineHeight: 1.65,
                        marginBottom: 20,
                        flexGrow: 1,
                    }}
                >
                    {blog.shortDescription}
                </p>

                {/* Card Action Link */}
                <div className="pt-3 border-top d-flex align-items-center justify-content-between" style={{ borderColor: "var(--border-color)" }}>
                    <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600 }}>
                        By {blog.author || "Ishaan"}
                    </span>
                    <Link
                        href={`/blogDetail/${blog._id}`}
                        style={{
                            fontWeight: 700,
                            fontSize: "0.88rem",
                            color: "var(--primary-color)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                        }}
                    >
                        Read Article <i className="bi bi-arrow-right"></i>
                    </Link>
                </div>

            </div>
        </div>
    );
}