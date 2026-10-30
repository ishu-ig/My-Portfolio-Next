"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { getBlog } from "../Redux/ActionCreators/BlogActionCreators";
import {
  getComment,
  createComment,
} from "../Redux/ActionCreators/CommentActionCreators";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function BlogDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const BlogStateData = useSelector((state) => state.BlogStateData);
  const CommentStateData = useSelector((state) => state.CommentStateData);

  const [blog, setBlog] = useState(null);
  const [similarBlogs, setSimilarBlogs] = useState([]);
  const [visibleComments, setVisibleComments] = useState(3);
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [commentForm, setCommentForm] = useState({
    name: "",
    email: "",
    commentText: "",
  });
  const [focusedField, setFocusedField] = useState(null);
  const [errors, setErrors] = useState({});
  const [alertMsg, setAlertMsg] = useState(null);
  const [alertType, setAlertType] = useState("success");

  useEffect(() => {
    setMounted(true);
    dispatch(getBlog());
    dispatch(getComment());
    AOS.init({ duration: 800, once: false, mirror: true });
  }, [dispatch]);

  useEffect(() => {
    if (BlogStateData?.length > 0) {
      const selected = BlogStateData.find((item) => String(item._id) === String(id));
      setBlog(selected || null);

      if (selected) {
        const sims = BlogStateData.filter(
          (item) =>
            String(item._id) !== String(id) &&
            item.category?.toLowerCase() === selected.category?.toLowerCase()
        );
        setSimilarBlogs(sims.length > 0 ? sims : BlogStateData.filter(item => String(item._id) !== String(id)));
      }
    }
  }, [BlogStateData, id]);

  // Modal Escape key & background scroll lock
  useEffect(() => {
    if (!showModal) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setShowModal(false);
    };
    window.addEventListener("keydown", onKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [showModal]);

  const openCommentModal = () => {
    setCommentForm({ name: "", email: "", commentText: "" });
    setErrors({});
    setAlertMsg(null);
    setShowModal(true);
  };

  const validateComment = () => {
    const errs = {};
    if (!commentForm.name.trim()) errs.name = "Name is required";
    if (!commentForm.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(commentForm.email)) errs.email = "Enter a valid email address";
    if (!commentForm.commentText.trim()) errs.commentText = "Comment message is required";
    return errs;
  };

  const submitComment = (e) => {
    if (e) e.preventDefault();
    const errs = validateComment();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const data = {
      ...commentForm,
      blogId: id,
    };

    dispatch(createComment(data));

    setAlertType("success");
    setAlertMsg("Thank you! Your comment has been submitted.");
    setCommentForm({ name: "", email: "", commentText: "" });
    setErrors({});

    setTimeout(() => {
      dispatch(getComment());
    }, 500);

    setTimeout(() => {
      setShowModal(false);
      setAlertMsg(null);
    }, 1500);
  };

  if (!blog) return (
    <div style={{ textAlign: "center", padding: "140px 16px 100px", color: "var(--text-color)", minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div className="spinner-border text-primary mb-3" role="status"></div>
      <p className="text-muted fw-semibold" style={{ fontSize: "0.95rem" }}>Loading article details...</p>
    </div>
  );

  const blogComments = Array.isArray(CommentStateData) ? CommentStateData.filter((c) => String(c?.blogId?._id || c?.blogId) === String(id)) : [];
  const formattedDate = blog.date ? new Date(blog.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "Recent";
  const estimatedReadTime = Math.max(2, Math.ceil((blog.longDescription?.length || 600) / 900));

  const inputStyle = (name) => ({
    width: "100%",
    padding: "12px 16px",
    borderRadius: "10px",
    fontSize: "0.92rem",
    border: `1.5px solid ${errors[name] ? "#ef4444" : focusedField === name ? "var(--primary-color)" : "var(--border-color, rgba(255,255,255,0.1))"}`,
    background: "var(--bg-color, #090c13)",
    color: "var(--text-color, #f4f4f4)",
    outline: "none",
    transition: "all 0.25s ease",
    boxShadow: focusedField === name ? "0 0 0 3px rgba(var(--accent-rgb, 99, 102, 241), 0.2)" : "none",
    boxSizing: "border-box",
  });

  const labelStyle = {
    fontSize: "0.78rem",
    fontWeight: 700,
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    display: "block",
    marginBottom: 6,
  };

  return (
    <div className="bd-page">
      <style>{`
        /* ── Page Container & Background ── */
        .bd-page {
          position: relative;
          z-index: 1;
          min-height: 100vh;
          padding-top: clamp(100px, 12vw, 135px);
          padding-bottom: 90px;
          color: var(--text-color);
          background: transparent;
        }

        /* Top Accent Shimmer Line */
        .bd-page::before {
          content: '';
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, var(--primary-color), #ec4899, transparent);
          background-size: 200% auto;
          animation: bdShimmer 3s linear infinite;
          z-index: 1000;
          pointer-events: none;
        }
        @keyframes bdShimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        /* Ambient Hero Radial Aura */
        .bd-hero-aura {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: clamp(320px, 85vw, 900px);
          height: 480px;
          background: radial-gradient(ellipse 65% 45% at 50% 12%, rgba(var(--accent-rgb, 99, 102, 241), 0.15) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        /* Breadcrumb Pill */
        .bd-breadcrumb {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: 99px;
          background: rgba(var(--accent-rgb, 99, 102, 241), 0.08);
          border: 1px solid var(--card-border, rgba(255, 255, 255, 0.08));
          font-size: 0.84rem;
          margin-bottom: 24px;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        [data-theme="light"] .bd-breadcrumb,
        body.light .bd-breadcrumb {
          background: rgba(99, 102, 241, 0.06);
          border-color: rgba(99, 102, 241, 0.14);
        }

        /* Article Meta Bar */
        .bd-meta-bar {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-bottom: 30px;
        }
        .bd-meta-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 99px;
          background: rgba(var(--accent-rgb, 99, 102, 241), 0.06);
          border: 1px solid var(--card-border, rgba(255, 255, 255, 0.06));
          font-size: 0.82rem;
          color: var(--text-color);
        }
        [data-theme="light"] .bd-meta-chip,
        body.light .bd-meta-chip {
          background: #ffffff;
          border-color: rgba(99, 102, 241, 0.12);
        }

        /* Featured Hero Image Container */
        .bd-hero-img-wrap {
          position: relative;
          width: 100%;
          height: clamp(260px, 42vw, 440px);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: var(--shadow-md);
          border: 1px solid var(--card-border, rgba(255, 255, 255, 0.08));
          margin-bottom: 36px;
        }
        [data-theme="light"] .bd-hero-img-wrap,
        body.light .bd-hero-img-wrap {
          border-color: rgba(99, 102, 241, 0.16);
          box-shadow: 0 16px 36px rgba(99, 102, 241, 0.1);
        }

        /* Lead Summary Callout */
        .bd-lead-box {
          font-size: 1.15rem;
          line-height: 1.8;
          color: var(--text-color);
          border-left: 4px solid var(--primary-color);
          background: rgba(var(--accent-rgb, 99, 102, 241), 0.05);
          padding: 20px 24px;
          border-radius: 0 16px 16px 0;
          margin-bottom: 36px;
          font-weight: 500;
        }
        [data-theme="light"] .bd-lead-box,
        body.light .bd-lead-box {
          background: rgba(99, 102, 241, 0.04);
        }

        /* Rich Content Body */
        .bd-content-body {
          font-size: 1.08rem;
          line-height: 1.9;
          color: var(--text-color);
        }
        .bd-content-body p {
          margin-bottom: 20px;
          color: var(--text-color);
          opacity: 0.94;
        }
        .bd-content-body h2 {
          font-size: 1.65rem;
          font-weight: 800;
          color: var(--text-color);
          margin-top: 38px;
          margin-bottom: 16px;
          letter-spacing: -0.015em;
          position: relative;
          display: inline-block;
        }
        .bd-content-body h2::after {
          content: '';
          position: absolute;
          left: 0; bottom: -4px;
          width: 40px; height: 3px;
          background: var(--primary-gradient);
          border-radius: 99px;
        }
        .bd-content-body h3 {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--text-color);
          margin-top: 30px;
          margin-bottom: 14px;
        }
        .bd-content-body h4, .bd-content-body h5, .bd-content-body h6 {
          font-weight: 700;
          color: var(--text-color);
          margin-top: 24px;
          margin-bottom: 10px;
        }
        .bd-content-body ul, .bd-content-body ol {
          margin: 20px 0;
          padding-left: 26px;
        }
        .bd-content-body li {
          margin-bottom: 10px;
          line-height: 1.8;
          color: var(--text-color);
          opacity: 0.94;
        }
        .bd-content-body strong {
          color: var(--text-color);
          font-weight: 700;
        }
        .bd-content-body blockquote {
          border-left: 4px solid var(--primary-color);
          background: rgba(var(--accent-rgb, 99, 102, 241), 0.06);
          padding: 16px 22px;
          border-radius: 0 14px 14px 0;
          margin: 26px 0;
          font-style: italic;
          color: var(--text-color);
        }
        .bd-content-body code {
          background: rgba(var(--accent-rgb, 99, 102, 241), 0.12);
          padding: 3px 8px;
          border-radius: 6px;
          font-family: 'DM Mono', monospace;
          font-size: 0.88em;
          color: var(--primary-color);
        }
        .bd-content-body pre {
          background: #090c13;
          border: 1px solid var(--card-border, rgba(255, 255, 255, 0.1));
          border-radius: 14px;
          padding: 18px 22px;
          overflow-x: auto;
          margin: 24px 0;
        }
        .bd-content-body a {
          color: var(--primary-color);
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .bd-content-body img {
          max-width: 100%;
          height: auto;
          border-radius: 16px;
          margin: 24px 0;
          border: 1px solid var(--card-border, rgba(255, 255, 255, 0.08));
        }

        /* Tags Section */
        .bd-tag-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 6px 14px;
          border-radius: 99px;
          font-size: 0.82rem;
          font-weight: 600;
          background: rgba(var(--accent-rgb, 99, 102, 241), 0.08);
          border: 1px solid var(--card-border, rgba(255, 255, 255, 0.08));
          color: var(--primary-color);
          text-decoration: none;
          transition: all 0.25s ease;
          margin-right: 8px;
          margin-bottom: 8px;
        }
        .bd-tag-badge:hover {
          background: var(--primary-color);
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 4px 14px rgba(var(--accent-rgb, 99, 102, 241), 0.35);
        }

        /* Discussion & Comment Card */
        .bd-discussion-card {
          background: var(--card-bg, #13112a);
          border: 1px solid var(--card-border, rgba(255, 255, 255, 0.08));
          border-radius: 20px;
          padding: clamp(20px, 4vw, 32px);
          box-shadow: var(--shadow-sm);
          margin-top: 48px;
        }
        [data-theme="light"] .bd-discussion-card,
        body.light .bd-discussion-card {
          background: #ffffff !important;
          border-color: rgba(99, 102, 241, 0.14) !important;
          box-shadow: 0 8px 26px rgba(99, 102, 241, 0.06) !important;
        }

        .bd-comment-item {
          background: var(--bg-alt, rgba(255, 255, 255, 0.02));
          border: 1px solid var(--border-color, rgba(255, 255, 255, 0.06));
          border-radius: 14px;
          padding: 16px 18px;
          margin-bottom: 14px;
          transition: border-color 0.2s ease;
        }
        .bd-comment-item:hover {
          border-color: rgba(var(--accent-rgb, 99, 102, 241), 0.3);
        }
        [data-theme="light"] .bd-comment-item,
        body.light .bd-comment-item {
          background: #f8fafc !important;
          border-color: rgba(99, 102, 241, 0.1) !important;
        }

        /* Related Article Card */
        .bd-related-card {
          background: var(--card-bg, #13112a);
          border: 1px solid var(--card-border, rgba(255, 255, 255, 0.08));
          border-radius: 18px;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .bd-related-card:hover {
          transform: translateY(-5px);
          border-color: var(--primary-color);
          box-shadow: var(--shadow-lg), 0 0 24px rgba(var(--accent-rgb, 99, 102, 241), 0.18);
        }
        [data-theme="light"] .bd-related-card,
        body.light .bd-related-card {
          background: #ffffff !important;
          border-color: rgba(99, 102, 241, 0.14) !important;
          box-shadow: 0 8px 24px rgba(99, 102, 241, 0.06) !important;
        }

        /* ── Modal Backdrop & Responsive Card ── */
        .bd-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.82);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999999;
          padding: clamp(12px, 3vw, 24px);
          overflow-y: auto;
          overscroll-behavior: contain;
          animation: certBackdropIn 0.2s ease;
        }
        .bd-modal-card {
          background: var(--card-bg, #101422);
          color: var(--text-color, #f4f4f4);
          border-radius: 20px;
          width: min(92vw, 500px);
          max-height: 90dvh;
          margin: auto;
          border: 1px solid var(--card-border, rgba(255, 255, 255, 0.12));
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 32px 80px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(var(--accent-rgb, 99, 102, 241), 0.15);
          position: relative;
          animation: certLightboxIn 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        [data-theme="light"] .bd-modal-card,
        body.light .bd-modal-card {
          background: #ffffff !important;
          color: #0f111a !important;
          border-color: rgba(99, 102, 241, 0.16) !important;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15) !important;
        }
        .bd-modal-header {
          padding: 18px 24px;
          border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
          background: var(--card-bg, #101422);
        }
        [data-theme="light"] .bd-modal-header,
        body.light .bd-modal-header {
          background: #f8fafc !important;
          border-color: rgba(99, 102, 241, 0.1) !important;
        }
        .bd-modal-body {
          padding: 22px 24px;
          overflow-y: auto;
          overscroll-behavior: contain;
          flex: 1 1 auto;
          min-height: 0;
        }
        .bd-modal-footer {
          padding: 16px 24px;
          border-top: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          flex-shrink: 0;
          background: var(--bg-alt, rgba(0, 0, 0, 0.2));
        }
        [data-theme="light"] .bd-modal-footer,
        body.light .bd-modal-footer {
          background: #f8fafc !important;
          border-color: rgba(99, 102, 241, 0.1) !important;
        }
      `}</style>

      {/* Ambient Hero Glow */}
      <div className="bd-hero-aura" aria-hidden="true" />

      <div className="container" style={{ maxWidth: 880, position: "relative", zIndex: 1 }}>

        {/* Breadcrumbs */}
        <div className="d-flex justify-content-center">
          <nav className="bd-breadcrumb" aria-label="Breadcrumb">
            <Link href="/" className="text-decoration-none" style={{ color: "var(--text-muted)" }}>Home</Link>
            <span style={{ color: "var(--border-color, rgba(255,255,255,0.2))" }}>/</span>
            <Link href="/blog" className="text-decoration-none" style={{ color: "var(--text-muted)" }}>Articles</Link>
            <span style={{ color: "var(--border-color, rgba(255,255,255,0.2))" }}>/</span>
            <span className="fw-bold text-truncate" style={{ color: "var(--primary-color)", maxWidth: 200 }}>
              {blog.title}
            </span>
          </nav>
        </div>

        {/* Category Pill */}
        <div className="text-center mb-3">
          <span className="section-badge d-inline-flex align-items-center gap-1">
            <i className="bi bi-journal-bookmark-fill" />
            {blog.category || "Tech Article"}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-center fw-bold mb-3" style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", lineHeight: 1.2, letterSpacing: "-0.02em", color: "var(--text-color)" }}>
          {blog.title}
        </h1>

        {/* Meta Info */}
        <div className="bd-meta-bar">
          <span className="bd-meta-chip">
            <i className="bi bi-person-circle" style={{ color: "var(--primary-color)" }} />
            <span>{blog.author || "Ishaan Gupta"}</span>
          </span>
          <span className="bd-meta-chip">
            <i className="bi bi-calendar3" style={{ color: "var(--primary-color)" }} />
            <span>{formattedDate}</span>
          </span>
          <span className="bd-meta-chip">
            <i className="bi bi-clock" style={{ color: "var(--primary-color)" }} />
            <span>{estimatedReadTime} min read</span>
          </span>
        </div>

        {/* Hero Image */}
        <div className="bd-hero-img-wrap">
          <Image
            src={blog.pic || "/img/blog/blog-1.jpg"}
            alt={blog.title}
            fill
            sizes="(max-width: 880px) 100vw, 880px"
            style={{ objectFit: "cover" }}
            priority
          />
        </div>

        {/* Short description lead */}
        {blog.shortDescription && (
          <div className="bd-lead-box">
            {blog.shortDescription}
          </div>
        )}

        {/* Article Body */}
        <div
          className="bd-content-body"
          dangerouslySetInnerHTML={{ __html: blog.longDescription }}
        />

        {/* Tags */}
        {blog.tags && (
          <div className="mt-5 pt-4 border-top" style={{ borderColor: "var(--border-color, rgba(255,255,255,0.08))" }}>
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 10 }}>
              Tagged Topics:
            </span>
            <div className="d-flex flex-wrap">
              {blog.tags.split(",").map((tag, index) => (
                <span key={index} className="bd-tag-badge">
                  #{tag.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Discussion / Comments Section */}
        <div className="bd-discussion-card">
          <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom" style={{ borderColor: "var(--border-color, rgba(255,255,255,0.08))" }}>
            <div className="d-flex align-items-center gap-2">
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(var(--accent-rgb, 99, 102, 241), 0.12)", color: "var(--primary-color)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>
                <i className="bi bi-chat-quote-fill" />
              </div>
              <h4 className="fw-bold m-0" style={{ fontSize: "1.2rem", color: "var(--text-color)" }}>
                Discussion ({blogComments.length})
              </h4>
            </div>
            <button
              onClick={openCommentModal}
              className="btn btn-sm btn-primary d-inline-flex align-items-center gap-1"
              style={{ padding: "8px 18px", borderRadius: 99, fontWeight: 700 }}
            >
              <i className="bi bi-chat-left-text-fill"></i> Add Comment
            </button>
          </div>

          {blogComments.length > 0 ? (
            blogComments.slice(0, visibleComments).map((item) => (
              <div key={item._id} className="bd-comment-item">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--primary-gradient)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.82rem", fontWeight: 700, flexShrink: 0 }}>
                    {item.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <h6 className="fw-bold m-0" style={{ color: "var(--text-color)", fontSize: "0.94rem" }}>
                      {item.name}
                    </h6>
                    <small style={{ color: "var(--text-muted)", fontSize: "0.74rem" }}>
                      Verified Reader
                    </small>
                  </div>
                </div>
                <p className="m-0" style={{ color: "var(--text-color)", opacity: 0.9, fontSize: "0.93rem", lineHeight: 1.65, paddingLeft: 40 }}>
                  {item.commentText}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted" style={{ fontSize: "0.92rem" }}>
              <i className="bi bi-chat-dots fs-3 d-block mb-2" style={{ opacity: 0.5 }}></i>
              Be the first to share your perspective or ask a question on this article!
            </div>
          )}

          <div className="d-flex gap-2 mt-3">
            {blogComments.length > visibleComments && (
              <button
                className="btn btn-outline-primary btn-sm"
                style={{ borderRadius: 99, padding: "6px 18px", fontWeight: 600 }}
                onClick={() => setVisibleComments(blogComments.length)}
              >
                Show All Comments ({blogComments.length})
              </button>
            )}

            {visibleComments > 3 && (
              <button
                className="btn btn-outline-secondary btn-sm"
                style={{ borderRadius: 99, padding: "6px 18px", fontWeight: 600 }}
                onClick={() => setVisibleComments(3)}
              >
                Show Less
              </button>
            )}
          </div>
        </div>

        {/* Recommended Blogs */}
        {similarBlogs.length > 0 && (
          <div className="mt-5 pt-5 border-top" style={{ borderColor: "var(--border-color, rgba(255,255,255,0.08))" }} data-aos="fade-up">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <span className="section-badge d-inline-flex mb-1">
                  <i className="bi bi-compass" /> Keep Reading
                </span>
                <h4 className="fw-bold m-0" style={{ fontSize: "1.45rem", color: "var(--text-color)", letterSpacing: "-0.01em" }}>
                  Related Articles
                </h4>
              </div>
              <Link href="/blog" className="text-decoration-none" style={{ color: "var(--primary-color)", fontWeight: 700, fontSize: "0.88rem" }}>
                Browse All <i className="bi bi-arrow-right" />
              </Link>
            </div>

            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              pagination={{ clickable: true }}
              autoplay={{ delay: 4500, disableOnInteraction: false }}
              breakpoints={{
                576: { slidesPerView: 1.5 },
                768: { slidesPerView: 2 },
                992: { slidesPerView: 2.5 },
              }}
              style={{ paddingBottom: 32 }}
            >
              {similarBlogs.map((item) => (
                <SwiperSlide key={item._id}>
                  <Link
                    href={`/blogDetail/${item._id}`}
                    className="text-decoration-none d-block h-100"
                  >
                    <div className="bd-related-card">
                      <div style={{ position: "relative", width: "100%", height: 170, flexShrink: 0 }}>
                        <Image
                          src={item.pic || "/img/blog/blog-1.jpg"}
                          alt={item.title}
                          fill
                          sizes="(max-width: 576px) 100vw, (max-width: 992px) 50vw, 33vw"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <div className="p-3 d-flex flex-column flex-grow-1">
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--primary-color)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                          {item.category || "Article"}
                        </span>
                        <h6 className="fw-bold mb-2 text-truncate" style={{ color: "var(--text-color)", fontSize: "0.98rem" }}>
                          {item.title}
                        </h6>
                        <p
                          className="m-0"
                          style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                        >
                          {item.shortDescription}
                        </p>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="text-center mt-5 pt-3">
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link
              href="/blog"
              className="btn btn-primary d-inline-flex align-items-center gap-2"
              style={{ padding: "10px 24px", borderRadius: 99, fontWeight: 700 }}
            >
              <i className="bi bi-grid-fill"></i> All Articles
            </Link>
            <Link
              href="/"
              className="btn btn-outline-dark d-inline-flex align-items-center gap-2"
              style={{
                padding: "10px 22px",
                borderRadius: 99,
                fontWeight: 600,
                border: "1px solid var(--card-border, rgba(255,255,255,0.18))",
                background: "rgba(255,255,255,0.04)",
                color: "var(--text-color)"
              }}
            >
              <i className="bi bi-house-fill"></i> Back to Home
            </Link>
          </div>
        </div>

      </div>

      {/* Comment Submission Modal (Portalled & Centered) */}
      {mounted && showModal && typeof document !== "undefined" && createPortal(
        <div
          className="bd-modal-backdrop"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="bd-comment-modal-title"
        >
          <div
            className="bd-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bd-modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(var(--accent-rgb, 99, 102, 241), 0.14)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary-color)", fontSize: "1.1rem", flexShrink: 0 }}>
                  <i className="bi bi-chat-left-dots-fill" />
                </div>
                <h4 id="bd-comment-modal-title" style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-color)", margin: 0 }}>
                  Leave a Comment
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                aria-label="Close modal"
                style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid var(--border-color, rgba(255,255,255,0.12))",
                  fontSize: 15, cursor: "pointer",
                  color: "var(--text-muted)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s ease",
                  flexShrink: 0,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(var(--accent-rgb, 99, 102, 241), 0.18)'; e.currentTarget.style.color = 'var(--text-color)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                <i className="bi bi-x-lg" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={submitComment} style={{ display: "flex", flexDirection: "column", flex: "1 1 auto", minHeight: 0, overflow: "hidden" }}>
              <div className="bd-modal-body">
                {alertMsg && (
                  <div className={`alert alert-${alertType} mb-3`} style={{ borderRadius: 10, fontSize: "0.9rem" }}>
                    {alertMsg}
                  </div>
                )}

                <div className="mb-3">
                  <label style={labelStyle}>Your Name</label>
                  <input
                    type="text"
                    placeholder="e.g. David Miller"
                    value={commentForm.name}
                    onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    style={inputStyle("name")}
                  />
                  {errors.name && <p style={{ fontSize: "0.78rem", color: "#ef4444", margin: "5px 0 0" }}>{errors.name}</p>}
                </div>

                <div className="mb-3">
                  <label style={labelStyle}>Your Email</label>
                  <input
                    type="email"
                    placeholder="david@example.com"
                    value={commentForm.email}
                    onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    style={inputStyle("email")}
                  />
                  {errors.email && <p style={{ fontSize: "0.78rem", color: "#ef4444", margin: "5px 0 0" }}>{errors.email}</p>}
                </div>

                <div className="mb-2">
                  <label style={labelStyle}>Comment Message</label>
                  <textarea
                    rows={4}
                    placeholder="Share your perspective or thoughts..."
                    value={commentForm.commentText}
                    onChange={(e) => setCommentForm({ ...commentForm, commentText: e.target.value })}
                    onFocus={() => setFocusedField("commentText")}
                    onBlur={() => setFocusedField(null)}
                    style={{ ...inputStyle("commentText"), resize: "vertical" }}
                  />
                  {errors.commentText && <p style={{ fontSize: "0.78rem", color: "#ef4444", margin: "5px 0 0" }}>{errors.commentText}</p>}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bd-modal-footer">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-outline-secondary"
                  style={{ padding: "9px 22px", borderRadius: 99, fontWeight: 600, fontSize: "0.88rem" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary d-inline-flex align-items-center gap-1"
                  style={{ padding: "9px 24px", borderRadius: 99, fontWeight: 700, fontSize: "0.88rem" }}
                >
                  <i className="bi bi-chat-left-text-fill me-1" /> Post Comment
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}