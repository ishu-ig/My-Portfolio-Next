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
                .blog-card-v2 {
                    min-width: 0;
                    width: 100%;
                    box-sizing: border-box;
                }
                .blog-card-v2:hover {
                    transform: translateY(-8px);
                    box-shadow: var(--shadow-lg), 0 0 30px rgba(var(--accent-rgb), 0.15);
                    border-color: var(--primary-color);
                }
                .blog-card-v2:hover .blog-card-img {
                    transform: scale(1.08);
                }
                .blog-card-img-wrap {
                    width: 100%;
                    height: 200px;
                    position: relative;
                    overflow: hidden;
                    flex-shrink: 0;
                    background: var(--bg-alt);
                }
                .blog-card-badge {
                    position: absolute;
                    top: 12px;
                    left: 12px;
                    background: var(--primary-color);
                    color: #ffffff;
                    font-size: 0.72rem;
                    font-weight: 700;
                    padding: 4px 12px;
                    border-radius: var(--radius-pill);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.25);
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                    z-index: 1;
                    max-width: calc(100% - 24px);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .blog-card-body {
                    padding: 20px 18px;
                    display: flex;
                    flex-direction: column;
                    flex-grow: 1;
                    text-align: left;
                    min-width: 0;
                }
                .blog-card-meta {
                    font-size: 0.8rem;
                    color: var(--text-muted);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 8px;
                }
                .blog-card-title {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    font-weight: 700;
                    font-size: 1.1rem;
                    line-height: 1.35;
                    margin-bottom: 10px;
                    color: var(--text-color);
                }
                .blog-card-desc {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    font-size: 0.88rem;
                    color: var(--text-muted);
                    line-height: 1.65;
                    margin-bottom: 20px;
                    flex-grow: 1;
                }
                .blog-card-footer {
                    padding-top: 14px;
                    border-top: 1px solid var(--border-color);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-top: auto;
                    min-width: 0;
                }
                .blog-card-author {
                    font-size: 0.82rem;
                    color: var(--text-muted);
                    font-weight: 600;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 50%;
                }
                .blog-card-link {
                    font-weight: 700;
                    font-size: 0.88rem;
                    color: var(--primary-color);
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    white-space: nowrap;
                    text-decoration: none;
                }

                @media (max-width: 576px) {
                    .blog-card-img-wrap {
                        height: 100px;
                    }
                    .blog-card-badge {
                        top: 5px;
                        left: 5px;
                        font-size: 0.52rem;
                        padding: 2px 5px;
                        max-width: calc(100% - 10px);
                    }
                    .blog-card-body {
                        padding: 8px 6px;
                    }
                    .blog-card-meta {
                        font-size: 0.64rem;
                        margin-bottom: 3px;
                    }
                    .blog-card-title {
                        font-size: 0.78rem;
                        line-height: 1.2;
                        margin-bottom: 3px;
                    }
                    .blog-card-desc {
                        display: none !important;
                    }
                    .blog-card-footer {
                        padding-top: 6px;
                    }
                    .blog-card-author {
                        font-size: 0.65rem;
                    }
                    .blog-card-link {
                        font-size: 0.7rem;
                    }
                }

                @media (max-width: 360px) {
                    .blog-card-img-wrap {
                        height: 85px;
                    }
                    .blog-card-body {
                        padding: 6px 4px;
                    }
                    .blog-card-title {
                        font-size: 0.72rem;
                    }
                    .blog-card-link {
                        font-size: 0.65rem;
                    }
                }
            `}</style>

            {/* Image Wrap */}
            <div className="blog-card-img-wrap">
                <Image
                    src={blog.pic && typeof blog.pic === "string" && (blog.pic.startsWith("http") || blog.pic.startsWith("/")) ? blog.pic : "/img/portfolio/portfolio-1.webp"}
                    alt={blog.title || "Blog Post"}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 50vw, 33vw"
                    className="blog-card-img"
                    style={{
                        objectFit: "cover",
                        transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                    loading={index < 3 ? undefined : "lazy"}
                />
                
                {/* Category Badge */}
                {blog.category && (
                    <span className="blog-card-badge">
                        {blog.category}
                    </span>
                )}
            </div>

            {/* Body */}
            <div className="blog-card-body">

                {/* Meta Header */}
                <div className="blog-card-meta">
                    <span className="d-flex align-items-center gap-1">
                        <i className="bi bi-calendar3"></i> {formattedDate}
                    </span>
                    <span className="d-flex align-items-center gap-1">
                        <i className="bi bi-clock"></i> {readTime}m
                    </span>
                </div>

                {/* Title */}
                <h4 className="blog-card-title">
                    {blog.title}
                </h4>

                {/* Short Description */}
                <p className="blog-card-desc">
                    {blog.shortDescription}
                </p>

                {/* Card Action Link */}
                <div className="blog-card-footer">
                    <span className="blog-card-author">
                        {blog.author || "Ishaan"}
                    </span>
                    <Link
                        href={`/blogDetail/${blog._id}`}
                        className="blog-card-link"
                    >
                        Read <i className="bi bi-arrow-right"></i>
                    </Link>
                </div>

            </div>
        </div>
    );
}