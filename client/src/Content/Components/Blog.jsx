"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBlog } from "../Redux/ActionCreators/BlogActionCreators";
import BlogCard from "./BlogCard";
import  Link  from "next/link";
import AOS from "aos";
import "aos/dist/aos.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

export default function Blog() {
    const dispatch = useDispatch();
    const BlogStateData = useSelector((state) => state.BlogStateData);
    const [loading, setLoading] = useState(!BlogStateData?.length);

    useEffect(() => {
        dispatch(getBlog());
        AOS.init({ duration: 900, once: true });
    }, [dispatch]);

    useEffect(() => {
        if (BlogStateData) {
            setLoading(false);
        }
    }, [BlogStateData]);

    const activeBlogs = Array.isArray(BlogStateData) ? BlogStateData.filter((b) => b.active) : [];

    return (
        <section
            id="blog"
            style={{ padding: "95px 0", backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
        >
            <style>{`
                @media (max-width: 576px) {
                    #blog {
                        padding: 45px 0 !important;
                    }
                }
            `}</style>
            <div className="container text-center">

                {/* Header */}
                <div data-aos="fade-up">
                    <span className="section-badge">
                        <i className="bi bi-journal-richtext"></i>
                        Articles & Insights
                    </span>
                    <h2 className="section-title">
                        Latest Tech Articles
                    </h2>
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
                        Deep dives into full-stack architecture, React performance patterns, modern CSS, and web development.
                    </p>
                </div>

                {/* Swiper Slider / Skeletons */}
                <div data-aos="fade-up" data-aos-delay="100">
                    {loading ? (
                        <div className="row g-3 justify-content-center">
                            {[1, 2, 3].map((n) => (
                                <div key={n} className="col-12 col-md-6 col-lg-4">
                                    <div className="skeleton-shimmer p-3" style={{ borderRadius: "var(--radius-lg, 16px)", minHeight: "360px", textAlign: "left" }}>
                                        <div style={{ height: "180px", borderRadius: "12px", background: "rgba(255,255,255,0.03)", marginBottom: "16px" }}></div>
                                        <div className="skeleton-pill mb-2" style={{ height: "18px", width: "70px" }}></div>
                                        <div className="skeleton-bar mb-2" style={{ height: "20px", width: "85%" }}></div>
                                        <div className="skeleton-bar mb-3" style={{ height: "14px", width: "95%" }}></div>
                                        <div className="d-flex align-items-center gap-2 mt-auto pt-3 border-top" style={{ borderColor: "var(--border-color)" }}>
                                            <div className="skeleton-pill" style={{ width: "30px", height: "30px", borderRadius: "50%" }}></div>
                                            <div className="skeleton-bar" style={{ height: "12px", width: "90px" }}></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : activeBlogs.length > 0 ? (
                        <Swiper
                            modules={[Autoplay, Pagination]}
                            slidesPerView={2}
                            spaceBetween={8}
                            loop={activeBlogs.length > 2}
                            speed={600}
                            autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                            pagination={{ clickable: true }}
                            breakpoints={{
                                0:    { slidesPerView: 2, spaceBetween: 8 },
                                576:  { slidesPerView: 2, spaceBetween: 12 },
                                768:  { slidesPerView: 2, spaceBetween: 16 },
                                1024: { slidesPerView: 3, spaceBetween: 24 },
                            }}
                            style={{ paddingBottom: 20 }}
                        >
                            {activeBlogs.map((blog, index) => (
                                <SwiperSlide key={blog._id || index} style={{ height: "auto" }}>
                                    <BlogCard blog={blog} index={index} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <div className="py-5 text-muted">
                            No articles published yet.
                        </div>
                    )}
                </div>

                {/* View All Button */}
                <div className="text-center mt-5" data-aos="fade-up">
                    <Link
                        href="/blog"
                        className="btn btn-outline-dark"
                    >
                        Explore All Articles <i className="bi bi-arrow-right"></i>
                    </Link>
                </div>

            </div>
        </section>
    );
}