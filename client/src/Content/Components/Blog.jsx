"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBlog } from "../Redux/ActionCreartors/BlogActionCreators";
import BlogCard from "./BlogCard";
import Link from "next/link";
import AOS from "aos";
import "aos/dist/aos.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";

export default function Blog() {
    const dispatch = useDispatch();
    const BlogStateData = useSelector(state => state.BlogStateData);

    useEffect(() => {
        dispatch(getBlog());
        AOS.init({ duration: 900 });
    }, [dispatch]);

    return (
        <section id="blog" style={{ padding: "70px 16px", backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}>
            <div className="container">

                {/* Header */}
                <div className="text-center mb-5" data-aos="fade-up">
                    <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--primary-color)", margin: "0 0 8px" }}>
                        Insights
                    </p>
                    <h2 style={{ fontSize: "2rem", fontWeight: 600, color: "var(--text-color)", margin: "0 0 10px" }}>Latest Blogs</h2>
                    <svg viewBox="0 0 80 16" style={{ width: 70, display: "block", margin: "0 auto 14px" }}>
                        <path d="M0 8 C13 0,20 16,40 8 C60 0,67 16,80 8" stroke="var(--primary-color)" strokeWidth="2" fill="none" strokeLinecap="round" />
                    </svg>
                    <p style={{ fontSize: 15, color: "var(--muted-color)", maxWidth: 460, margin: "0 auto", lineHeight: 1.6 }}>
                        Explore expert articles and the latest insights in AI-driven healthcare.
                    </p>
                </div>

                {/* Swiper */}
                <Swiper
                    modules={[FreeMode]}
                    freeMode={true}
                    spaceBetween={16}
                    loop={true}
                    breakpoints={{
                        0:    { slidesPerView: 1.1 },
                        576:  { slidesPerView: 1.5 },
                        768:  { slidesPerView: 2.2 },
                        992:  { slidesPerView: 3 },
                        1200: { slidesPerView: 3.3 },
                    }}
                >
                    {Array.isArray(BlogStateData) && BlogStateData.filter(b => b.active).map((blog, index) => (
                        <SwiperSlide key={blog._id}>
                            <BlogCard blog={blog} index={index} />
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* View more */}
                <div className="text-center mt-4">
                    <Link href="/blog" style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        padding: "9px 22px", borderRadius: 999,
                        border: "1px solid var(--border-color)",
                        background: "transparent", color: "var(--text-color)",
                        fontSize: 13, fontWeight: 500, textDecoration: "none",
                        transition: "background 0.2s",
                    }}
                        onMouseEnter={e => e.currentTarget.style.background = "var(--card-bg)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                        View More Blogs <i className="bi bi-arrow-right"></i>
                    </Link>
                </div>
            </div>
        </section>
    );
}