"use client"
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { useDispatch, useSelector } from "react-redux";
import { createTestimonial, getTestimonial } from "../Redux/ActionCreators/TestimonialActionCreators";
import formValidator from "../FormValidators/formValidator";
import imageValidator from "../FormValidators/imageValidator";
import AOS from "aos";
import "aos/dist/aos.css";
import "swiper/css";
import "swiper/css/pagination";

const STYLES = `
  #testimonials .swiper-pagination { position: static; margin-top: 32px; }
  #testimonials .swiper-pagination-bullet {
    width: 8px; height: 8px;
    background: var(--text-muted);
    opacity: 0.35; transition: all 0.3s ease;
    border-radius: 4px;
  }
  #testimonials .swiper-pagination-bullet-active {
    width: 28px; opacity: 1;
    background: var(--primary-color);
  }

  .tcard {
    border-radius: var(--radius-lg);
    padding: 32px 28px;
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    transition: transform var(--ease-smooth), box-shadow var(--ease-smooth), border-color var(--ease-smooth);
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    min-width: 0;
    width: 100%;
    box-sizing: border-box;
  }
  .tcard::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: var(--primary-gradient);
    opacity: 0;
    transition: opacity var(--ease-smooth);
  }
  .tcard:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-lg), 0 0 30px rgba(var(--accent-rgb), 0.15);
    border-color: var(--primary-color);
  }
  .tcard:hover::before { opacity: 1; }

  .t-stars { display: flex; gap: 4px; margin-bottom: 14px; }
  .t-star { color: #f59e0b; font-size: 1rem; filter: drop-shadow(0 0 4px rgba(245, 158, 11, 0.4)); }

  .t-msg {
    font-size: 0.95rem;
    line-height: 1.75;
    color: var(--text-color);
    font-style: italic;
    flex: 1;
    margin: 0 0 24px;
  }

  .t-author-wrap {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .t-author-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--primary-color);
    box-shadow: 0 2px 10px rgba(var(--accent-rgb), 0.3);
    flex-shrink: 0;
  }

  .t-author-name {
    font-size: 1rem;
    font-weight: 700;
    color: var(--text-color);
    margin: 0;
  }

  .t-author-badge {
    font-size: 0.78rem;
    color: var(--primary-color);
    font-weight: 600;
    margin: 2px 0 0;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  @media (max-width: 576px) {
    .testimonials-section {
      padding: 50px 0;
    }
    .tcard {
      padding: 14px 10px;
      border-radius: var(--radius-md);
    }
    .t-stars {
      gap: 2px;
      margin-bottom: 6px;
    }
    .t-star {
      font-size: 0.72rem;
    }
    .t-msg {
      font-size: 0.76rem;
      line-height: 1.4;
      margin: 0 0 10px;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .t-author-wrap {
      gap: 6px;
      min-width: 0;
    }
    .t-author-avatar {
      width: 32px !important;
      height: 32px !important;
      border-width: 1.5px;
    }
    .t-author-name {
      font-size: 0.8rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 85px;
    }
    .t-author-badge {
      font-size: 0.64rem;
      gap: 2px;
      white-space: nowrap;
    }
  }

  @media (max-width: 360px) {
    .tcard {
      padding: 10px 8px;
    }
    .t-msg {
      font-size: 0.72rem;
      -webkit-line-clamp: 2;
    }
    .t-author-avatar {
      width: 28px !important;
      height: 28px !important;
    }
    .t-author-name {
      font-size: 0.75rem;
      max-width: 70px;
    }
  }

  .t-input {
    width: 100%; padding: 11px 16px;
    border-radius: var(--radius-sm); font-size: 0.9rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: var(--bg-color); color: var(--text-color);
    outline: none; transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
  }
  .t-input:focus {
    border-color: var(--primary-color) !important;
    box-shadow: 0 0 0 3px rgba(var(--accent-rgb), 0.2);
  }

  @keyframes modalIn {
    from { opacity: 0; transform: scale(0.94) translateY(12px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  .t-modal-card { animation: modalIn 0.3s cubic-bezier(0.34, 1.4, 0.64, 1) forwards; }
`;

export default function Testimonials() {
  const testimonials = useSelector((state) => state.TestimonialStateData);
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
    AOS.init({ duration: 900, once: true });
  }, [dispatch]);

  const getInputData = (e) => {
    const { name } = e.target;
    const value = e.target.files ? e.target.files[0] : e.target.value;
    if (name !== "active") {
      setError((prev) => ({
        ...prev,
        [name]: e.target.files ? imageValidator(e) : formValidator(e),
      }));
    }
    setData((prev) => ({ ...prev, [name]: name === "active" ? value === "1" : value }));
  };

  const postSubmit = (e) => {
    e.preventDefault();
    const errorItem = Object.values(error).find((x) => x !== "");
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

  const active = Array.isArray(testimonials) ? testimonials.filter((x) => x.active) : [];

  return (
    <section
      id="testimonials"
      className="testimonials-section"
    >
      <style>{STYLES}</style>
      <div className="container">

        {/* Section Header */}
        <div className="text-center mb-5" data-aos="fade-up">
          <span className="section-badge">
            <i className="bi bi-chat-heart-fill"></i>
            Recommendations
          </span>
          <h2 className="section-title">
            Client Testimonials
          </h2>
          <div className="title-shape">
            <svg viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M 0,10 C 40,0 60,20 100,10 C 140,0 160,20 200,10" fill="none" stroke="currentColor" strokeWidth="2"></path>
            </svg>
          </div>
          <p className="section-subtitle">
            Feedback and experiences from clients, collaborators, and product leaders I&apos;ve worked with.
          </p>
        </div>

        {/* Swiper Carousel */}
        <div data-aos="fade-up" data-aos-delay="100">
          <Swiper
            key={active.length}
            modules={[Autoplay, Pagination]}
            slidesPerView={2}
            spaceBetween={14}
            loop={active.length > 2}
            speed={600}
            autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
            pagination={{ clickable: true }}
            breakpoints={{
              0: { slidesPerView: 2, spaceBetween: 10 },
              576: { slidesPerView: 2, spaceBetween: 14 },
              768: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 28 },
            }}
            style={{ paddingBottom: 12 }}
          >
            {active.map((t) => (
              <SwiperSlide key={t._id} style={{ height: "auto" }}>
                <TestimonialCard t={t} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Add Testimonial Action */}
        <div className="text-center mt-5" data-aos="fade-up">
          <button className="btn btn-outline-dark" onClick={() => setShowModal(true)}>
            <i className="bi bi-plus-circle-fill"></i>
            Add Your Testimonial
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <TestimonialModal
          show={show}
          error={error}
          getInputData={getInputData}
          postSubmit={postSubmit}
          onClose={() => { setShowModal(false); setShow(false); }}
        />
      )}
    </section>
  );
}

const FALLBACK_AVATARS = [
  "/img/person/person-m-7.webp",
  "/img/person/person-f-5.webp",
  "/img/person/person-m-9.webp",
  "/img/person/person-f-8.webp",
  "/img/person/person-f-10.webp",
];

function getFallbackAvatar(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash + name.charCodeAt(i)) % FALLBACK_AVATARS.length;
  }
  return FALLBACK_AVATARS[hash] || FALLBACK_AVATARS[0];
}

function resolveImageSrc(src, fallback) {
  if (!src) return fallback;
  if (Array.isArray(src)) src = src[0];
  if (typeof src === "object" && src !== null) src = src.url || src.path || src.src || "";
  if (typeof src !== "string") return fallback;
  const trimmed = src.trim();
  if (!trimmed || trimmed === "undefined" || trimmed === "null") return fallback;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/")) {
    return trimmed;
  }
  const backend = process.env.NEXT_PUBLIC_BACKEND_SERVER || "";
  if (trimmed.startsWith("public/")) {
    return backend ? `${backend}/${trimmed.slice(7)}` : `/${trimmed.slice(7)}`;
  }
  return backend ? `${backend}/${trimmed}` : `/${trimmed}`;
}

function TestimonialCard({ t }) {
  const fallback = getFallbackAvatar(t.name || "");
  const initialSrc = resolveImageSrc(t.pic, fallback);
  const [imgSrc, setImgSrc] = useState(initialSrc);

  useEffect(() => {
    setImgSrc(resolveImageSrc(t.pic, fallback));
  }, [t.pic, fallback]);

  return (
    <div className="tcard">
      <div className="t-stars">
        {[1,2,3,4,5].map((s) => (
          <span key={s} className="t-star"><i className="bi bi-star-fill" /></span>
        ))}
      </div>

      <p className="t-msg">
        &ldquo;{t.message}&rdquo;
      </p>

      <div className="t-author-wrap">
        <Image
          src={imgSrc}
          alt={t.name || "Client"}
          width={48}
          height={48}
          unoptimized={typeof imgSrc === "string" && imgSrc.startsWith("http")}
          onError={() => setImgSrc(fallback)}
          className="t-author-avatar"
        />
        <div style={{ minWidth: 0 }}>
          <h4 className="t-author-name">{t.name}</h4>
          <p className="t-author-badge">
            <i className="bi bi-patch-check-fill" />
            Verified Client
          </p>
        </div>
      </div>
    </div>
  );
}

function TestimonialModal({ show, error, getInputData, postSubmit, onClose }) {
  const inputBorder = (err) =>
    `1px solid ${show && err ? "#ef4444" : "var(--border-color)"}`;

  return (
    <div
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 9999, padding: 16,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="t-modal-card"
        style={{
          background: "var(--card-bg)",
          color: "var(--text-color)",
          borderRadius: "var(--radius-lg)",
          width: "100%", maxWidth: 500,
          border: "1px solid var(--card-border)",
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px",
          borderBottom: "1px solid var(--border-color)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "rgba(var(--accent-rgb), 0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <i className="bi bi-chat-quote-fill" style={{ fontSize: 16, color: "var(--primary-color)" }} />
            </div>
            <h4 style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--text-color)", margin: 0 }}>
              Share Your Feedback
            </h4>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "var(--bg-color)",
              border: "1px solid var(--border-color)",
              fontSize: 14, cursor: "pointer",
              color: "var(--text-muted)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <form onSubmit={postSubmit}>
          <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 6, textTransform: "uppercase" }}>Full Name</label>
              <input
                type="text" name="name"
                onChange={getInputData}
                placeholder="e.g. Sarah Connor"
                className="t-input"
                style={{ border: inputBorder(error.name) }}
              />
              {show && error.name && <p style={{ fontSize: "0.78rem", color: "#ef4444", margin: "5px 0 0" }}>{error.name}</p>}
            </div>

            <div>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 6, textTransform: "uppercase" }}>Testimonial Message</label>
              <textarea
                name="message"
                onChange={getInputData}
                placeholder="Describe the experience, project outcome, or highlights..."
                rows={4}
                className="t-input"
                style={{ border: inputBorder(error.message), resize: "vertical" }}
              />
              {show && error.message && <p style={{ fontSize: "0.78rem", color: "#ef4444", margin: "5px 0 0" }}>{error.message}</p>}
            </div>

            <div>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 6, textTransform: "uppercase" }}>Profile Picture</label>
              <input
                type="file" name="pic"
                onChange={getInputData}
                className="t-input"
                style={{ border: inputBorder(error.pic), padding: "8px 14px" }}
              />
              {show && error.pic && <p style={{ fontSize: "0.78rem", color: "#ef4444", margin: "5px 0 0" }}>{error.pic}</p>}
            </div>
          </div>

          <div style={{
            padding: "16px 24px",
            borderTop: "1px solid var(--border-color)",
            display: "flex", justifyContent: "flex-end", gap: 10,
          }}>
            <button
              type="button" onClick={onClose}
              className="btn btn-outline-dark"
              style={{ padding: "8px 20px" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: "8px 24px" }}
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}