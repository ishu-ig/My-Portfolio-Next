"use client"
import React, { useEffect, useState, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
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
import * as THREE from 'three';
import useIntersectionWebGL from '../hooks/useIntersectionWebGL';

const FALLBACK_AVATARS = [
  "/img/person/person-m-7.webp",
  "/img/person/person-f-5.webp",
  "/img/person/person-m-9.webp",
  "/img/person/person-f-8.webp",
];

/* ── Three.js Ambient Particle / Nebula Scene for .wall__scene ── */
function WallThreeScene() {
  const mountRef = useIntersectionWebGL((container) => {
    let width = container.clientWidth || 768;
    let height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 40;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.domElement.setAttribute('data-engine', 'three.js r186');
      renderer.domElement.style.display = 'block';
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      container.appendChild(renderer.domElement);
    } catch {
      return () => {};
    }

    // Glowing Orbital Ring
    const ringCount = 180;
    const ringGeo = new THREE.BufferGeometry();
    const ringPos = new Float32Array(ringCount * 3);
    const ringColors = new Float32Array(ringCount * 3);

    for (let i = 0; i < ringCount; i++) {
      const angle = (i / ringCount) * Math.PI * 2;
      const radius = 18 + (Math.random() - 0.5) * 4;
      ringPos[i * 3] = Math.cos(angle) * radius;
      ringPos[i * 3 + 1] = (Math.random() - 0.5) * 7;
      ringPos[i * 3 + 2] = Math.sin(angle) * radius;

      ringColors[i * 3] = 0.8 + Math.random() * 0.2;
      ringColors[i * 3 + 1] = 0.6 + Math.random() * 0.3;
      ringColors[i * 3 + 2] = 0.9 + Math.random() * 0.1;
    }
    ringGeo.setAttribute('position', new THREE.BufferAttribute(ringPos, 3));
    ringGeo.setAttribute('color', new THREE.BufferAttribute(ringColors, 3));

    const ringMat = new THREE.PointsMaterial({
      size: 0.35,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const ringPoints = new THREE.Points(ringGeo, ringMat);
    scene.add(ringPoints);

    // Floating Stardust
    const dustCount = 80;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 45;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 35;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.22,
      color: 0x818cf8,
      transparent: true,
      opacity: 0.45,
    });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    scene.add(dustPoints);

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      ringPoints.rotation.y += 0.0022;
      ringPoints.rotation.x = Math.sin(Date.now() * 0.0005) * 0.04;
      dustPoints.rotation.y -= 0.001;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      ringGeo.dispose();
      ringMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      renderer.forceContextLoss();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    />
  );
}

function TestimonialCard({ t }) {
  const fallback = FALLBACK_AVATARS[Math.abs((t.name || "").charCodeAt(0) || 0) % FALLBACK_AVATARS.length];
  const [imgSrc, setImgSrc] = useState(
    t.pic && typeof t.pic === "string" && (t.pic.startsWith("http") || t.pic.startsWith("/"))
      ? t.pic
      : fallback
  );

  return (
    <div className="tcard">
      <div className="t-stars">
        {[1, 2, 3, 4, 5].map((s) => (
          <i key={s} className="bi bi-star-fill t-star" />
        ))}
      </div>
      <p className="t-msg">&ldquo;{t.message}&rdquo;</p>
      <div className="t-author-wrap">
        <Image
          src={imgSrc}
          alt={t.name || "Client"}
          width={46}
          height={46}
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
    `1px solid ${show && err ? "#ef4444" : "var(--border-color, rgba(255,255,255,0.1))"}`;

  // Escape key & background scroll lock
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="t-modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="testimonial-modal-heading"
    >
      <div
        className="t-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="t-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: "50%",
              background: "rgba(var(--accent-rgb, 99, 102, 241), 0.14)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--primary-color)",
              flexShrink: 0,
            }}>
              <i className="bi bi-chat-quote-fill" style={{ fontSize: 17 }} />
            </div>
            <h4 id="testimonial-modal-heading" style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--text-color)", margin: 0 }}>
              Share Your Feedback
            </h4>
          </div>
          <button
            type="button"
            onClick={onClose}
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

        {/* Modal Form with Scrollable Body */}
        <form onSubmit={postSubmit} style={{ display: "flex", flexDirection: "column", flex: "1 1 auto", minHeight: 0, overflow: "hidden" }}>
          <div className="t-modal-body">
            <div>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>Full Name</label>
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
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>Testimonial Message</label>
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
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>Profile Picture</label>
              <input
                type="file" name="pic"
                onChange={getInputData}
                className="t-input"
                style={{ border: inputBorder(error.pic), padding: "8px 14px" }}
              />
              {show && error.pic && <p style={{ fontSize: "0.78rem", color: "#ef4444", margin: "5px 0 0" }}>{error.pic}</p>}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="t-modal-footer">
            <button
              type="button" onClick={onClose}
              className="btn btn-outline-secondary"
              style={{ padding: "9px 22px", borderRadius: 99, fontWeight: 600, fontSize: "0.88rem" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: "9px 24px", borderRadius: 99, fontWeight: 600, fontSize: "0.88rem" }}
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

export default function Testimonials() {
  const testimonials = useSelector((state) => state.TestimonialStateData);
  const dispatch = useDispatch();
  const loading = !testimonials || testimonials.length === 0;
  const [showModal, setShowModal] = useState(false);
  const [show, setShow] = useState(false);
  const [viewMode, setViewMode] = useState('circular'); // 'circular' | 'slider'

  // 3D Circular Ring State
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragRotation, setDragRotation] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const animRef = useRef(null);

  const [data, setData] = useState({ name: "", pic: "", message: "", active: true });
  const [error, setError] = useState({
    name: "Name Field is Mandatory",
    pic: "Pic Field is Mandatory",
    message: "Message Field is Mandatory",
  });

  useEffect(() => {
    if (!testimonials || !testimonials.length) {
      dispatch(getTestimonial());
    }
    AOS.init({ duration: 800, once: false, mirror: true });
  }, [dispatch, testimonials]);

  const active = useMemo(() =>
    Array.isArray(testimonials) ? testimonials.filter((x) => x.active) : [],
  [testimonials]);

  // Ensure minimum items for a 360° ring
  const carouselItems = useMemo(() => {
    if (active.length === 0) return [];
    if (active.length >= 6) return active;
    if (active.length === 1) return [active[0], active[0], active[0], active[0], active[0], active[0]];
    if (active.length === 2) return [...active, ...active, ...active];
    if (active.length === 3) return [...active, ...active];
    if (active.length === 4) return [...active, active[0], active[1]];
    if (active.length === 5) return [...active, active[0]];
    return active;
  }, [active]);

  // Continuous auto-rotation when not dragging or hovering
  useEffect(() => {
    if (viewMode !== 'circular') return;
    const loop = () => {
      if (!isDragging && !isHovered) {
        setRotation(prev => prev + 0.13);
      }
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [isDragging, isHovered, viewMode]);

  // Pointer drag for smooth 3D spinning
  const handlePointerDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX || (e.touches && e.touches[0].clientX) || 0);
    setDragRotation(rotation);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const currentX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const deltaX = currentX - startX;
    setRotation(dragRotation + deltaX * 0.42);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const stepRotation = (dir) => {
    const angleStep = 360 / Math.max(carouselItems.length, 6);
    setRotation(prev => prev + dir * angleStep);
  };

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

  return (
    <section id="testimonials" className="testimonials-section">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

        .testimonials-section {
          padding: clamp(65px, 8vw, 120px) 0;
          background: transparent !important;
          background-color: transparent !important;
          position: relative;
          color: var(--text-color, #f4f4f4);
        }

        /* ── Modal Styles (Centered in Viewport & Responsive) ── */
        .t-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
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
        .t-modal-card {
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
        [data-theme="light"] .t-modal-card,
        body.light .t-modal-card {
          background: #ffffff !important;
          color: #0f111a !important;
          border-color: rgba(99, 102, 241, 0.16) !important;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15) !important;
        }
        .t-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 24px;
          border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
          flex-shrink: 0;
          background: var(--card-bg, #101422);
        }
        [data-theme="light"] .t-modal-header,
        body.light .t-modal-header {
          background: #f8fafc !important;
          border-color: rgba(99, 102, 241, 0.1) !important;
        }
        .t-modal-body {
          padding: 22px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          flex: 1 1 auto;
          overflow-y: auto;
          overscroll-behavior: contain;
          min-height: 0;
        }
        .t-modal-footer {
          padding: 16px 24px;
          border-top: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          flex-shrink: 0;
          background: var(--bg-alt, rgba(0, 0, 0, 0.2));
        }
        [data-theme="light"] .t-modal-footer,
        body.light .t-modal-footer {
          background: #f8fafc !important;
          border-color: rgba(99, 102, 241, 0.1) !important;
        }

        /* ── Header ── */
        .t-header {
          text-align: center;
          margin-bottom: 24px;
        }
        .t-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          color: var(--primary-color);
          letter-spacing: .08em;
          text-transform: uppercase;
          margin-bottom: 10px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .t-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 700;
          font-size: clamp(2.4rem, 5vw, 4.2rem);
          line-height: 1.06;
          letter-spacing: -0.025em;
          color: var(--text-color, #f5f5f5);
          margin-bottom: 14px;
        }
        .t-title em {
          font-style: italic;
          color: var(--primary-color);
        }
        .t-subtitle {
          color: var(--text-muted, #9e9f97);
          font-size: clamp(0.92rem, 1.25vw, 1.1rem);
          max-width: 580px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* View Toggle Controls */
        .t-view-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin: 24px auto 36px;
        }
        .t-toggle-btn {
          font-family: 'DM Mono', monospace;
          font-size: 12.5px;
          font-weight: 600;
          padding: 6px 16px;
          border-radius: 99px;
          border: 1px solid var(--card-border, rgba(255, 255, 255, 0.12));
          background: rgba(255, 255, 255, 0.04);
          color: var(--text-muted);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.25s ease;
        }
        .t-toggle-btn:hover {
          color: var(--text-color);
          border-color: var(--primary-color);
        }
        .t-toggle-btn.is-active {
          background: rgba(var(--accent-rgb, 99, 102, 241), 0.14);
          border-color: var(--primary-color);
          color: var(--primary-color);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
        }

        /* ═══ 3D CIRCULAR WALL SCENE ═══════════════════════════════════ */
        .wall {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .wall__pin {
          position: relative;
          width: 100%;
          min-height: calc(var(--t-stage-h) + 80px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: transparent !important;
          background-color: transparent !important;
        }

        .wall__scene {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        /* 3D Circular Cylinder Stage */
        :root {
          --t-card-w: 230px;
          --t-card-h: 285px;
          --t-stage-h: 350px;
        }
        @media (min-width: 768px) {
          :root {
            --t-card-w: 250px;
            --t-card-h: 300px;
            --t-stage-h: 368px;
          }
        }
        @media (max-width: 480px) {
          :root {
            --t-card-w: 200px;
            --t-card-h: 260px;
            --t-stage-h: 318px;
          }
        }
        .wall__stage {
          perspective: 1200px;
          perspective-origin: 50% 50%;
          width: 100%;
          height: var(--t-stage-h);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
          user-select: none;
          touch-action: pan-y;
          cursor: grab;
        }
        .wall__stage:active {
          cursor: grabbing;
        }

        .wall__cylinder {
          position: absolute;
          width: var(--t-card-w);
          height: var(--t-card-h);
          transform-style: preserve-3d;
          transition: transform 0.08s linear;
        }

        /* Testimonial Card on Ring */
        .tcard {
          position: absolute;
          top: 0; left: 0;
          width: var(--t-card-w);
          height: var(--t-card-h);
          border-radius: 16px;
          padding: 16px 14px 14px;
          background: var(--card-bg, #101422);
          border: 1px solid var(--card-border, rgba(255, 255, 255, 0.12));
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
          display: flex;
          flex-direction: column;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transform-origin: center center;
          transition: border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
        }
        [data-theme="light"] .tcard,
        body.light .tcard {
          background: #ffffff !important;
          border-color: rgba(99, 102, 241, 0.14) !important;
          box-shadow: 0 10px 28px rgba(99, 102, 241, 0.09), 0 2px 6px rgba(0, 0, 0, 0.04) !important;
        }
        [data-theme="dark"] .tcard,
        body.dark .tcard {
          background: #13112a !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4) !important;
        }
        .tcard:hover {
          border-color: var(--primary-color);
          box-shadow: 0 18px 44px rgba(0, 0, 0, 0.5), 0 0 22px rgba(var(--accent-rgb), 0.25);
        }


        .t-stars { display: flex; gap: 3px; margin-bottom: 8px; }
        .t-star { color: #f59e0b; font-size: 0.8rem; }

        .t-msg {
          font-size: 0.82rem;
          line-height: 1.52;
          color: var(--text-color);
          font-style: italic;
          flex: 1;
          margin: 0 0 10px;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .t-author-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: auto;
          padding-top: 8px;
          border-top: 1px solid var(--card-border, rgba(255, 255, 255, 0.08));
        }
        .t-author-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--primary-color);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          flex-shrink: 0;
        }
        .t-author-name {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.84rem;
          font-weight: 700;
          color: var(--text-color);
          margin: 0;
        }
        .t-author-badge {
          font-size: 0.74rem;
          color: var(--primary-color);
          font-weight: 600;
          margin: 2px 0 0;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* Navigation Arrows on Circular Ring */
        .wall__controls {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 14px;
          z-index: 2;
        }
        .wall__arrow-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--card-bg, rgba(255, 255, 255, 0.05));
          border: 1px solid var(--card-border, rgba(255, 255, 255, 0.15));
          color: var(--text-color);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .wall__arrow-btn:hover {
          background: var(--primary-color);
          color: #ffffff;
          border-color: #fff;
          transform: scale(1.12);
        }

        /* ── Word Quote Line matching user reference ── */
        .wall__line {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.4rem, 2.8vw, 2.2rem);
          text-align: center;
          color: var(--text-color, #f4f4f4);
          margin-top: 32px;
          margin-bottom: 0;
          letter-spacing: -0.01em;
          position: relative;
          z-index: 2;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.35em;
        }
        .wall__line .word {
          display: inline-block;
          opacity: 0.88;
        }
        .wall__line .word.serif {
          font-style: italic;
          color: var(--primary-color);
        }

        .t-input {
          width: 100%; padding: 11px 16px;
          border-radius: 8px; font-size: 0.9rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: var(--bg-color, #090c13);
          color: var(--text-color, #fff);
          outline: none; transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .t-input:focus {
          border-color: var(--primary-color) !important;
          box-shadow: 0 0 0 3px rgba(var(--accent-rgb, 99, 102, 241), 0.2);
        }

        @media (max-width: 576px) {
          .wall__pin { min-height: calc(var(--t-stage-h) + 60px); }
          .t-msg { -webkit-line-clamp: 3; }
        }
      `}</style>

      <div className="container">
        {/* Section Header */}
        <div className="t-header" data-aos="fade-up">
          <p className="t-eyebrow">
            <i className="bi bi-chat-heart-fill" />
            Endorsements
          </p>
          <h2 className="t-title">Client <em>testimonials</em></h2>
          <p className="t-subtitle">
            Feedback and experiences from clients, engineering leaders, and collaborators I&apos;ve built software with.
          </p>

          {/* View Mode Switcher */}
          <div className="t-view-toggle">
            <button
              type="button"
              className={`t-toggle-btn ${viewMode === 'circular' ? 'is-active' : ''}`}
              onClick={() => setViewMode('circular')}
            >
              <i className="bi bi-disc" />
              <span>3D Ring Gallery</span>
            </button>
            <button
              type="button"
              className={`t-toggle-btn ${viewMode === 'slider' ? 'is-active' : ''}`}
              onClick={() => setViewMode('slider')}
            >
              <i className="bi bi-view-list" />
              <span>Slider View</span>
            </button>
          </div>
        </div>

        {/* ═══ 3D Circular Ring Scene or Slider View ═══ */}
        {viewMode === 'circular' ? (
          <div className="wall" aria-label="Client testimonial wall">
            <div className="wall__pin">

              {/* 3D Rotating Cylinder Stage */}
              <div
                className="wall__stage"
                onMouseDown={handlePointerDown}
                onMouseMove={handlePointerMove}
                onMouseUp={handlePointerUp}
                onTouchStart={handlePointerDown}
                onTouchMove={handlePointerMove}
                onTouchEnd={handlePointerUp}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => { setIsHovered(false); handlePointerUp(); }}
              >
                <div className="wall__cylinder">
                  {carouselItems.map((t, i) => {
                    const totalSlots = carouselItems.length;
                    const angleStep = 360 / totalSlots;
                    const cardAngle = (i * angleStep) + rotation;
                    const rad = (cardAngle * Math.PI) / 180;
                    const cos = Math.cos(rad);

                    const radius = 300;
                    const opacity = Math.max(0.2, (cos + 1) / 2);
                    const scale = 0.86 + (cos + 1) * 0.08;
                    const zIndex = Math.round((cos + 1) * 50);

                    return (
                      <div
                        key={i}
                        style={{
                          transform: `rotateY(${cardAngle}deg) translateZ(${radius}px) scale(${scale})`,
                          zIndex,
                          opacity,
                          pointerEvents: cos > 0.15 ? 'auto' : 'none',
                        }}
                      >
                        <TestimonialCard t={t} />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step Controls */}
              <div className="wall__controls">
                <button
                  type="button"
                  className="wall__arrow-btn"
                  onClick={() => stepRotation(1)}
                  title="Rotate left"
                >
                  <i className="bi bi-chevron-left" />
                </button>
                <button
                  type="button"
                  className="wall__arrow-btn"
                  onClick={() => stepRotation(-1)}
                  title="Rotate right"
                >
                  <i className="bi bi-chevron-right" />
                </button>
              </div>

              {/* Word Quote Line matching user reference */}
              <p className="wall__line">
                <span className="word" style={{ "--i": 0 }}>Some</span>{" "}
                <span className="word" style={{ "--i": 1 }}>for</span>{" "}
                <span className="word" style={{ "--i": 2 }}>clients.</span>{" "}
                <span className="word" style={{ "--i": 3 }}>Some</span>{" "}
                <span className="word serif" style={{ "--i": 4 }}>to</span>{" "}
                <span className="word serif" style={{ "--i": 5 }}>build</span>{" "}
                <span className="word serif" style={{ "--i": 6 }}>trusted</span>{" "}
                <span className="word serif" style={{ "--i": 7 }}>bonds</span>
                <span className="word" style={{ "--i": 8 }}>.</span>
              </p>

            </div>
          </div>
        ) : (
          /* Slider View */
          <div data-aos="fade-up" data-aos-delay="100">
            {loading ? (
              <div className="row g-3 justify-content-center">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="col-12 col-md-6 col-lg-4">
                    <div className="tcard skeleton-shimmer" style={{ minHeight: "240px", position: 'relative' }} />
                  </div>
                ))}
              </div>
            ) : active.length > 0 ? (
              <Swiper
                key={active.length}
                modules={[Autoplay, Pagination]}
                slidesPerView={2}
                spaceBetween={16}
                loop={active.length > 2}
                speed={600}
                autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
                pagination={{ clickable: true }}
                breakpoints={{
                  0: { slidesPerView: 1, spaceBetween: 12 },
                  768: { slidesPerView: 2, spaceBetween: 18 },
                  1024: { slidesPerView: 3, spaceBetween: 24 },
                }}
                style={{ paddingBottom: 24 }}
              >
                {active.map((t) => (
                  <SwiperSlide key={t._id} style={{ height: "auto" }}>
                    <div style={{ position: 'relative', width: '100%', height: '300px' }}>
                      <TestimonialCard t={t} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="text-center py-5 text-muted">
                No testimonials published yet.
              </div>
            )}
          </div>
        )}

        {/* Add Testimonial Action */}
        <div className="text-center mt-5" data-aos="fade-up">
          <button
            className="btn btn-outline-dark"
            style={{
              padding: "10px 24px",
              borderRadius: 99,
              fontFamily: "'DM Mono', monospace",
              fontSize: "13px",
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              border: "1.5px solid var(--card-border, rgba(255,255,255,0.2))",
              background: "rgba(255,255,255,0.04)",
              color: "var(--text-color)",
            }}
            onClick={() => setShowModal(true)}
          >
            <i className="bi bi-plus-circle-fill text-primary" />
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