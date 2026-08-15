"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBlog } from "../Redux/ActionCreators/BlogActionCreators";
import BlogCard from "../Components/BlogCard";
import  Link  from "next/link";
import AOS from "aos";
import "aos/dist/aos.css";

export default function BlogPage() {
    const dispatch = useDispatch();
    const BlogStateData = useSelector((state) => state.BlogStateData);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        dispatch(getBlog());
        AOS.init({ duration: 900, once: true });
    }, [dispatch]);

    const activeBlogs = useMemo(() => {
        return Array.isArray(BlogStateData) ? BlogStateData.filter((b) => b.active) : [];
    }, [BlogStateData]);

    const categories = useMemo(() => {
        const cats = new Set(activeBlogs.map((b) => b.category).filter(Boolean));
        return ["all", ...Array.from(cats)];
    }, [activeBlogs]);

    const filteredBlogs = useMemo(() => {
        return activeBlogs.filter((blog) => {
            const matchesCat = selectedCategory === "all" || blog.category?.toLowerCase() === selectedCategory.toLowerCase();
            const matchesSearch = !searchQuery || 
                (blog.title || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                (blog.shortDescription || "").toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCat && matchesSearch;
        });
    }, [activeBlogs, selectedCategory, searchQuery]);

    return (
        <section
            id="blogs-page"
            className="py-5"
            style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)", minHeight: "85vh" }}
        >
            <style>{`
                .blog-grid {
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 24px;
                }
                @media (max-width: 991.98px) {
                    .blog-grid {
                        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                        gap: 16px;
                    }
                }
                @media (max-width: 576px) {
                    .blog-grid {
                        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                        gap: 10px !important;
                    }
                    .blog-grid > :last-child:nth-child(odd) {
                        grid-column: 1 / -1 !important;
                        justify-self: center !important;
                        width: calc(50% - 5px) !important;
                        max-width: calc(50% - 5px) !important;
                    }
                }
                @media (max-width: 360px) {
                    .blog-grid {
                        gap: 8px !important;
                    }
                }
            `}</style>
            <div className="container text-center">

                {/* Breadcrumb */}
                <div className="d-flex align-items-center justify-content-center gap-2 mb-4" style={{ fontSize: "0.86rem" }}>
                    <Link href="/" className="text-muted text-decoration-none">Home</Link>
                    <span className="text-muted">/</span>
                    <span className="text-primary fw-bold">All Articles</span>
                </div>

                {/* Header */}
                <div data-aos="fade-up">
                    <span className="section-badge">
                        <i className="bi bi-journal-text"></i>
                        Knowledge Hub
                    </span>
                    <h1 className="section-title">
                        All Articles & Technical Insights
                    </h1>
                    <div className="title-shape">
                        <svg viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M 0,10 C 40,0 60,20 100,10 C 140,0 160,20 200,10"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            />
                        </svg>
                    </div>
                    <p className="section-subtitle mb-4">
                        Explore tutorials, architectural patterns, and development perspectives.
                    </p>
                </div>

                {/* Search & Filter Bar */}
                <div className="row justify-content-center mb-5" data-aos="fade-up" data-aos-delay="100">
                    <div className="col-md-6 mb-3">
                        <div className="position-relative">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search articles by keywords..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    padding: "12px 20px 12px 42px",
                                    borderRadius: "var(--radius-pill)",
                                    background: "var(--card-bg)",
                                    border: "1.5px solid var(--border-color)",
                                    color: "var(--text-color)",
                                }}
                            />
                            <i className="bi bi-search position-absolute top-50 translate-middle-y text-muted" style={{ left: 16 }}></i>
                        </div>
                    </div>

                    {/* Filter Pills */}
                    {categories.length > 1 && (
                        <div className="col-12 d-flex justify-content-center flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    className={`btn btn-sm ${selectedCategory.toLowerCase() === cat.toLowerCase() ? "btn-primary" : "btn-outline-dark"}`}
                                    onClick={() => setSelectedCategory(cat)}
                                    style={{ borderRadius: "var(--radius-pill)", textTransform: "capitalize", padding: "6px 18px" }}
                                >
                                    {cat === "all" ? "All Categories" : cat}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Blog Grid */}
                <div className="blog-grid">
                    {filteredBlogs.map((blog, index) => (
                        <div
                            key={blog._id || index}
                            data-aos="fade-up"
                            data-aos-delay={(index % 3) * 80}
                            style={{ minWidth: 0, width: "100%" }}
                        >
                            <BlogCard blog={blog} index={index} />
                        </div>
                    ))}

                    {filteredBlogs.length === 0 && (
                        <div className="col-12 py-5 text-muted" style={{ gridColumn: "1 / -1" }}>
                            <i className="bi bi-file-earmark-x display-4 d-block mb-3 opacity-50"></i>
                            <h5>No articles found</h5>
                            <p>Try searching for a different keyword or select another category.</p>
                        </div>
                    )}
                </div>

                {/* Back to Home */}
                <div className="text-center mt-5 pt-4">
                    <Link href="/" className="btn btn-outline-dark">
                        <i className="bi bi-house-fill me-1"></i> Back to Home
                    </Link>
                </div>

            </div>
        </section>
    );
}
