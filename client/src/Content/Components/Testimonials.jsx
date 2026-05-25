"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import { useDispatch, useSelector } from "react-redux";
import { createTestimonial, getTestimonial } from "../Redux/ActionCreartors/TestimonialActionCreators";
import formValidator from "../FormValidators/formValidator";
import imageValidator from "../FormValidators/imageValidator";
import AOS from "aos";
import "aos/dist/aos.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function Testimonial() {
    const testimonials = useSelector(state => state.TestimonialStateData);
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [show, setShow] = useState(false);
    const [data, setData] = useState({ name: "", pic: "", message: "", active: true });
    const [error, setError] = useState({
        name: "Name Field is Mandatory",
        pic: "Pic Field is Mandatory",
        message: "Message Field is Mandatory",
    });

    useEffect(() => {
        dispatch(getTestimonial());
        AOS.init({ duration: 900, once: false });
        AOS.refresh();
    }, [dispatch]);

    const getInputData = (e) => {
        const { name } = e.target;
        const value = e.target.files ? e.target.files[0] : e.target.value;
        if (name !== "active") {
            setError(prev => ({ ...prev, [name]: e.target.files ? imageValidator(e) : formValidator(e) }));
        }
        setData(prev => ({ ...prev, [name]: name === "active" ? value === "1" : value }));
    };

    const postSubmit = (e) => {
        e.preventDefault();
        const errorItem = Object.values(error).find(x => x !== "");
        if (errorItem) { setShow(true); return; }
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("pic", data.pic);
        formData.append("active", data.active);
        formData.append("message", data.message);
        dispatch(createTestimonial(formData));
        setShowModal(false);
        setShow(false);
        setData({ name: "", pic: "", message: "", active: true });
    };

    const active = testimonials.filter(x => x.active);

    return (
        <section id="testimonials" style={{ padding: "70px 16px", backgroundColor: "var(--bg-color)", color: "var(--text-color)", overflowX: "hidden" }}>
            <div className="container">

                {/* Header */}
                <div className="text-center mb-5" data-aos="fade-up">
                    <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--primary-color)", margin: "0 0 8px" }}>
                        Kind Words
                    </p>
                    <h2 style={{ fontSize: "2rem", fontWeight: 600, color: "var(--text-color)", margin: "0 0 10px" }}>
                        Testimonials
                    </h2>
                    <svg viewBox="0 0 80 16" style={{ width: 70, display: "block", margin: "0 auto 14px" }}>
                        <path d="M0 8 C13 0,20 16,40 8 C60 0,67 16,80 8" stroke="var(--primary-color)" strokeWidth="2" fill="none" strokeLinecap="round" />
                    </svg>
                    <p style={{ fontSize: 15, color: "var(--muted-color)", maxWidth: 460, margin: "0 auto", lineHeight: 1.6 }}>
                        What our clients say.
                    </p>
                </div>

                {/* Swiper */}
                <div style={{ maxWidth: 640, margin: "0 auto" }} data-aos="fade-up">
                    <Swiper
                        key={active.length}
                        modules={[Autoplay, Pagination, EffectFade]}
                        effect="fade"
                        fadeEffect={{ crossFade: true }}
                        slidesPerView={1}
                        loop={true}
                        speed={700}
                        autoplay={{ delay: 4000 }}
                        pagination={{ clickable: true }}
                    >
                        {active.map(t => (
                            <SwiperSlide key={t._id}>
                                <div style={{
                                    background: "var(--card-bg)",
                                    border: "1px solid var(--border-color)",
                                    borderRadius: 16, padding: 24,
                                    textAlign: "left",
                                    marginBottom: 32,
                                }}>
                                    {/* Quote mark */}
                                    <div style={{ fontSize: 40, color: "var(--primary-color)", lineHeight: 1, marginBottom: 8 }}>"</div>

                                    {/* Message */}
                                    <p style={{ fontSize: 14, color: "var(--muted-color)", lineHeight: 1.75, fontStyle: "italic", marginBottom: 20 }}>
                                        {t.message}
                                    </p>

                                    {/* Profile */}
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <img
                                            src={t.pic}
                                            alt={t.name}
                                            style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--primary-color)" }}
                                        />
                                        <div>
                                            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-color)", margin: 0 }}>{t.name}</p>
                                            <p style={{ fontSize: 11, color: "var(--primary-color)", margin: 0, display: "flex", alignItems: "center", gap: 4 }}>
                                                <i className="bi bi-patch-check-fill" style={{ fontSize: 11 }}></i>
                                                Verified Client
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Add button */}
                <div className="text-center mt-2">
                    <button
                        onClick={() => setShowModal(true)}
                        style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            padding: "7px 18px", borderRadius: 999,
                            background: "rgba(0,123,255,0.1)", color: "var(--primary-color)",
                            border: "none", fontSize: 13, fontWeight: 500, cursor: "pointer",
                        }}
                    >
                        <i className="bi bi-plus"></i> Add Testimonial
                    </button>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div style={{
                    position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    zIndex: 9999, padding: 16,
                }}>
                    <div style={{
                        background: "var(--card-bg)", color: "var(--text-color)",
                        borderRadius: 16, width: "100%", maxWidth: 480,
                        border: "1px solid var(--border-color)",
                        overflow: "hidden",
                    }}>
                        {/* Modal header */}
                        <div style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "14px 18px",
                            borderBottom: "1px solid var(--border-color)",
                        }}>
                            <p style={{ fontWeight: 600, fontSize: 15, color: "var(--text-color)", margin: 0 }}>Add Testimonial</p>
                            <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "var(--muted-color)" }}>×</button>
                        </div>

                        <form onSubmit={postSubmit}>
                            <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 14 }}>
                                {[
                                    { name: "name", type: "text", placeholder: "Your Name", err: error.name },
                                    { name: "message", type: "textarea", placeholder: "Your message…", err: error.message },
                                    { name: "pic", type: "file", placeholder: "", err: error.pic },
                                ].map(field => (
                                    <div key={field.name}>
                                        {field.type === "textarea" ? (
                                            <textarea
                                                name={field.name}
                                                onChange={getInputData}
                                                placeholder={field.placeholder}
                                                rows={4}
                                                style={{
                                                    width: "100%", padding: "10px 14px",
                                                    borderRadius: 10, fontSize: 13,
                                                    border: `1px solid ${show && field.err ? "#ef4444" : "var(--border-color)"}`,
                                                    background: "var(--bg-color)", color: "var(--text-color)",
                                                    outline: "none", resize: "vertical",
                                                }}
                                            />
                                        ) : (
                                            <input
                                                type={field.type}
                                                name={field.name}
                                                onChange={getInputData}
                                                placeholder={field.placeholder}
                                                style={{
                                                    width: "100%", padding: "10px 14px",
                                                    borderRadius: 10, fontSize: 13,
                                                    border: `1px solid ${show && field.err ? "#ef4444" : "var(--border-color)"}`,
                                                    background: "var(--bg-color)", color: "var(--text-color)",
                                                    outline: "none",
                                                }}
                                            />
                                        )}
                                        {show && field.err && <p style={{ fontSize: 11, color: "#ef4444", margin: "4px 0 0" }}>{field.err}</p>}
                                    </div>
                                ))}
                            </div>

                            <div style={{ padding: "12px 18px", borderTop: "1px solid var(--border-color)", display: "flex", justifyContent: "flex-end", gap: 8 }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ padding: "8px 18px", borderRadius: 999, border: "1px solid var(--border-color)", background: "transparent", color: "var(--text-color)", fontSize: 13, cursor: "pointer" }}>
                                    Cancel
                                </button>
                                <button type="submit" style={{ padding: "8px 18px", borderRadius: 999, background: "var(--primary-color)", color: "#fff", border: "none", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}