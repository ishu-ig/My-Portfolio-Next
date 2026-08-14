"use client";
import React, { useEffect } from "react";
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

    useEffect(() => {
        dispatch(getBlog());
        AOS.init({ duration: 900, once: true });
    }, [dispatch]);

    const activeBlogs = Array.isArray(BlogStateData) ? BlogStateData.filter((b) => b.active) : [];

    return (
        <section
            id="blog"
            style={{ padding: "95px 0", backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
        >
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
                    <p className="section-subtitle mb-5">
                        Deep dives into full-stack architecture, React performance patterns, modern CSS, and web development.
                    </p>
                </div>

                {/* Swiper Slider */}
                <div data-aos="fade-up" data-aos-delay="100">
                    <Swiper
                        modules={[Autoplay, Pagination]}
                        slidesPerView={1}
                        spaceBetween={24}
                        loop={activeBlogs.length > 3}
                        speed={600}
                        autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                        pagination={{ clickable: true }}
                        breakpoints={{
                            640:  { slidesPerView: 1, spaceBetween: 20 },
                            768:  { slidesPerView: 2, spaceBetween: 24 },
                            1024: { slidesPerView: 3, spaceBetween: 28 },
                        }}
                        style={{ paddingBottom: 20 }}
                    >
                        {activeBlogs.map((blog, index) => (
                            <SwiperSlide key={blog._id || index} style={{ height: "auto" }}>
                                <BlogCard blog={blog} index={index} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
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