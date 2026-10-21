"use client"
import React, { useEffect, useState, useRef, useMemo } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from 'react-redux';
import { getCertificate } from '../Redux/ActionCreators/CertificateActionCreators';
import AOS from "aos";
import "aos/dist/aos.css";
import * as THREE from 'three';

/* ── Three.js Ambient Particle & Ring Scene for .wall__scene ── */
function WallThreeScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

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
      return;
    }

    // 1. Ambient Ring of glowing dots
    const ringCount = 180;
    const ringGeo = new THREE.BufferGeometry();
    const ringPos = new Float32Array(ringCount * 3);
    const ringColors = new Float32Array(ringCount * 3);

    for (let i = 0; i < ringCount; i++) {
      const angle = (i / ringCount) * Math.PI * 2;
      const radius = 18 + (Math.random() - 0.5) * 4;
      ringPos[i * 3] = Math.cos(angle) * radius;
      ringPos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      ringPos[i * 3 + 2] = Math.sin(angle) * radius;

      // Indigo/violet gradient matching design system
      ringColors[i * 3] = 0.38 + Math.random() * 0.25;
      ringColors[i * 3 + 1] = 0.40 + Math.random() * 0.2;
      ringColors[i * 3 + 2] = 0.95 + Math.random() * 0.05;
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

    // 2. Ambient Floating Dust
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
      opacity: 0.42,
    });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    scene.add(dustPoints);

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      ringPoints.rotation.y += 0.0025;
      ringPoints.rotation.x = Math.sin(Date.now() * 0.0005) * 0.05;
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

/* ── Individual Certificate Card on 3D Ring ── */
function CertificateCardItem({ cert, cardAngle, radius, scale, zIndex, opacity, cos, onPreview }) {
  const fallbackImg = "/img/portfolio/portfolio-1.webp";
  const [imgSrc, setImgSrc] = useState(
    cert.pic && typeof cert.pic === "string" && (cert.pic.startsWith("http") || cert.pic.startsWith("/"))
      ? cert.pic
      : fallbackImg
  );

  return (
    <div
      className={`wall__card ${cert.isSkeleton ? "skeleton-shimmer" : ""}`}
      style={{
        transform: `rotateY(${cardAngle}deg) translateZ(${radius}px) scale(${scale})`,
        zIndex,
        opacity,
        pointerEvents: cos > 0.15 && !cert.isSkeleton ? 'auto' : 'none',
      }}
      onClick={() => !cert.isSkeleton && onPreview(cert)}
    >
      <div className="wall__card-img">
        <Image
          src={imgSrc}
          alt={cert.name || "Certificate"}
          fill
          sizes="240px"
          unoptimized={typeof imgSrc === "string" && imgSrc.startsWith("http")}
          onError={() => setImgSrc(fallbackImg)}
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="wall__card-body">
        <span className="wall__card-issuer">{cert.issuedBy || "Accredited"}</span>
        <h4 className="wall__card-title">{cert.name}</h4>
        <button
          type="button"
          className="wall__card-btn"
          onClick={(e) => {
            e.stopPropagation();
            !cert.isSkeleton && onPreview(cert);
          }}
        >
          <span>View Certificate</span>
          <i className="bi bi-arrow-up-right" />
        </button>
      </div>
    </div>
  );
}

export default function Certificates() {
  const CertificateStateData = useSelector(state => state.CertificateStateData);
  const dispatch = useDispatch();
  const loading = !CertificateStateData || CertificateStateData.length === 0;
  const [previewCert, setPreviewCert] = useState(null);
  const [viewMode, setViewMode] = useState('circular'); // 'circular' | 'grid'

  // Responsive 3D cylinder radius based on device viewport
  const [ringRadius, setRingRadius] = useState(290);

  useEffect(() => {
    const handleResizeRadius = () => {
      const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
      if (w <= 480) {
        setRingRadius(205);
      } else if (w <= 768) {
        setRingRadius(245);
      } else {
        setRingRadius(290);
      }
    };
    handleResizeRadius();
    window.addEventListener('resize', handleResizeRadius);
    return () => window.removeEventListener('resize', handleResizeRadius);
  }, []);

  // Escape key & background scroll lock for lightbox modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setPreviewCert(null);
    };
    if (previewCert) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [previewCert]);

  // 3D Circular Ring Carousel State
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragRotation, setDragRotation] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const animRef = useRef(null);

  useEffect(() => {
    if (!CertificateStateData || !CertificateStateData.length) {
      dispatch(getCertificate());
    }
  }, [dispatch, CertificateStateData]);

  useEffect(() => {
    AOS.init({ duration: 800, once: false, mirror: true });
    AOS.refresh();
  }, [CertificateStateData]);

  const active = useMemo(() =>
    Array.isArray(CertificateStateData) ? CertificateStateData.filter(x => x.active) : [],
  [CertificateStateData]);

  // Expand slots if active is small so circular ring looks full
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

  // Fallback items while loading so ring is never blank
  const displayItems = useMemo(() => {
    if (loading && carouselItems.length === 0) {
      return [
        { name: "Python Programming", issuedBy: "Coursera (META)", pic: "/img/portfolio/portfolio-1.webp", isSkeleton: true },
        { name: "Technovation Hackathon", issuedBy: "Sharda University", pic: "/img/portfolio/portfolio-2.webp", isSkeleton: true },
        { name: "Techzibition (Delhi Zonal)", issuedBy: "IIT Roorkee", pic: "/img/portfolio/portfolio-4.webp", isSkeleton: true },
        { name: "Python Programming", issuedBy: "Coursera (META)", pic: "/img/portfolio/portfolio-1.webp", isSkeleton: true },
        { name: "Technovation Hackathon", issuedBy: "Sharda University", pic: "/img/portfolio/portfolio-2.webp", isSkeleton: true },
        { name: "Techzibition (Delhi Zonal)", issuedBy: "IIT Roorkee", pic: "/img/portfolio/portfolio-4.webp", isSkeleton: true },
      ];
    }
    return carouselItems;
  }, [loading, carouselItems]);

  // Continuous auto-rotation when not dragging or hovering
  useEffect(() => {
    if (viewMode !== 'circular') return;
    const loop = () => {
      if (!isDragging && !isHovered) {
        setRotation(prev => prev + 0.14);
      }
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [isDragging, isHovered, viewMode]);

  // Pointer drag events for smooth 3D spinning
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
    const angleStep = 360 / Math.max(displayItems.length, 6);
    setRotation(prev => prev + dir * angleStep);
  };

  return (
    <>
      <style>{`
        /* ── Section Tokens ── */
        .cert-section {
          padding: clamp(65px, 8vw, 120px) 0;
          background: transparent !important;
          background-color: transparent !important;
          position: relative;
          color: var(--text-color);
        }

        /* ── Header ── */
        .cert-header {
          text-align: center;
          margin-bottom: 24px;
        }

        /* View Toggle Controls */
        .cert-view-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin: 24px auto 36px;
        }
        .cert-toggle-btn {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 12.5px;
          font-weight: 600;
          padding: 7px 18px;
          border-radius: 99px;
          border: 1px solid var(--card-border);
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .cert-toggle-btn:hover {
          color: var(--text-color);
          border-color: var(--primary-color);
          transform: translateY(-1px);
        }
        .cert-toggle-btn.is-active {
          background: rgba(var(--accent-rgb), 0.12);
          border-color: var(--primary-color);
          color: var(--primary-color);
          box-shadow: 0 0 0 1px rgba(var(--accent-rgb), 0.2), 0 6px 18px rgba(var(--accent-rgb), 0.15);
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
          min-height: calc(var(--cert-stage-h) + 80px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
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
          --cert-card-w: 220px;
          --cert-card-h: 290px;
          --cert-img-h: 152px;
          --cert-stage-h: 360px;
        }
        @media (min-width: 768px) {
          :root {
            --cert-card-w: 240px;
            --cert-card-h: 310px;
            --cert-img-h: 164px;
            --cert-stage-h: 380px;
          }
        }
        @media (max-width: 480px) {
          :root {
            --cert-card-w: 190px;
            --cert-card-h: 258px;
            --cert-img-h: 130px;
            --cert-stage-h: 316px;
          }
        }
        .wall__stage {
          perspective: 1400px;
          perspective-origin: 50% 50%;
          width: 100%;
          height: var(--cert-stage-h);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
          user-select: none;
          touch-action: pan-y;
          cursor: grab;
        }
        .wall__stage:active { cursor: grabbing; }

        .wall__cylinder {
          position: absolute;
          width: var(--cert-card-w);
          height: var(--cert-card-h);
          transform-style: preserve-3d;
          transition: transform 0.08s linear;
        }

        /* Card on the circular ring */
        .wall__card {
          position: absolute;
          top: 0;
          left: 0;
          width: var(--cert-card-w);
          height: var(--cert-card-h);
          border-radius: 16px;
          background: var(--card-bg, #13112a);
          border: 1px solid var(--card-border, rgba(255, 255, 255, 0.08));
          box-shadow: var(--shadow-md);
          overflow: hidden;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transform-origin: center center;
          transition: border-color 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
        }
        [data-theme="light"] .wall__card,
        body.light .wall__card {
          background: #ffffff !important;
          border-color: rgba(99, 102, 241, 0.16) !important;
          box-shadow: 0 10px 30px rgba(99, 102, 241, 0.1), 0 2px 8px rgba(0, 0, 0, 0.04) !important;
        }
        [data-theme="dark"] .wall__card,
        body.dark .wall__card {
          background: #13112a !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5) !important;
        }
        .wall__card:hover {
          border-color: var(--primary-color) !important;
          box-shadow: var(--shadow-lg), 0 0 24px rgba(var(--accent-rgb), 0.22) !important;
        }

        .wall__card-img {
          width: 100%;
          height: var(--cert-img-h);
          position: relative;
          background: var(--bg-alt);
          overflow: hidden;
          flex-shrink: 0;
        }
        .wall__card-body {
          padding: 10px 12px;
          flex: 1;
          display: flex;
          flex-direction: column;
          background: var(--card-bg, #13112a);
        }
        [data-theme="light"] .wall__card-body,
        body.light .wall__card-body {
          background: #ffffff !important;
        }
        [data-theme="dark"] .wall__card-body,
        body.dark .wall__card-body {
          background: #13112a !important;
        }
        .wall__card-issuer {
          font-family: 'DM Mono', monospace;
          font-size: 0.6rem;
          color: var(--primary-color);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 4px;
        }
        .wall__card-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-color);
          line-height: 1.35;
          margin: 0 0 auto;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        [data-theme="light"] .wall__card-title,
        body.light .wall__card-title {
          color: #0f111a !important;
        }
        [data-theme="dark"] .wall__card-title,
        body.dark .wall__card-title {
          color: #f1f0fa !important;
        }
        .wall__card-btn {
          margin-top: 8px;
          width: 100%;
          padding: 6px 10px;
          border-radius: 8px;
          background: rgba(var(--accent-rgb), 0.08);
          border: 1px solid rgba(var(--accent-rgb), 0.18);
          color: var(--primary-color);
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.72rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .wall__card:hover .wall__card-btn {
          background: var(--primary-color);
          color: #ffffff;
          border-color: var(--primary-color);
          box-shadow: 0 4px 14px rgba(var(--accent-rgb), 0.4);
        }

        /* Navigation Arrows */
        .wall__controls {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 18px;
          z-index: 2;
        }
        .wall__arrow-btn {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          color: var(--text-muted);
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
          border-color: var(--primary-color);
          transform: scale(1.12);
          box-shadow: 0 6px 20px rgba(var(--accent-rgb), 0.4);
        }

        /* ── Quote Line ── */
        .wall__line {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(1rem, 2vw, 1.35rem);
          font-weight: 500;
          text-align: center;
          color: var(--text-muted);
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
        .wall__line .word { display: inline-block; }
        .wall__line .word.serif {
          font-style: italic;
          font-weight: 700;
          color: var(--primary-color);
        }

        /* ── Lightbox Modal ── */
        .cert-lightbox-backdrop {
          position: fixed; inset: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          z-index: 9999;
          display: flex; align-items: center; justify-content: center;
          padding: 16px;
          animation: certBackdropIn 0.2s ease;
        }
        @keyframes certBackdropIn { from { opacity: 0; } to { opacity: 1; } }
        .cert-lightbox-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 20px;
          max-width: 780px; width: 100%;
          overflow: hidden;
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(var(--accent-rgb), 0.08);
          animation: certLightboxIn 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes certLightboxIn {
          from { opacity: 0; transform: scale(0.93) translateY(18px); }
          to { opacity: 1; transform: none; }
        }
        .cert-lightbox-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-color);
        }
        .cert-lightbox-img-wrap {
          position: relative;
          width: 100%;
          height: 62vh;
          min-height: 260px;
          background: var(--bg-alt);
          display: flex; align-items: center; justify-content: center;
          padding: 10px;
        }
        .cert-lightbox-footer {
          padding: 14px 20px;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          background: var(--bg-alt);
          border-top: 1px solid var(--border-color);
        }

        /* ── Classic Grid ── */
        .cert-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
        }
        .cert-grid-item {
          position: relative;
          width: 100%;
          min-height: 320px;
          border-radius: 18px;
          background: var(--card-bg, #13112a);
          border: 1px solid var(--card-border, rgba(255, 255, 255, 0.08));
          box-shadow: var(--shadow-sm);
          overflow: hidden;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease, border-color 0.3s ease;
        }
        [data-theme="light"] .cert-grid-item,
        body.light .cert-grid-item {
          background: #ffffff !important;
          border-color: rgba(99, 102, 241, 0.16) !important;
          box-shadow: 0 10px 30px rgba(99, 102, 241, 0.08) !important;
        }
        [data-theme="dark"] .cert-grid-item,
        body.dark .cert-grid-item {
          background: #13112a !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
        }
        .cert-grid-item:hover {
          transform: translateY(-6px);
          border-color: var(--primary-color) !important;
          box-shadow: var(--shadow-lg), 0 0 24px rgba(var(--accent-rgb), 0.15) !important;
        }

        @media (max-width: 991px) {
          .cert-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
        }
        @media (max-width: 576px) {
          .cert-grid { grid-template-columns: 1fr; gap: 12px; }
          .wall__pin { min-height: calc(var(--cert-stage-h) + 60px); }
        }
      `}</style>

      <section id="certificate" className="cert-section">
        <div className="container">

          {/* Section Header */}
          <div className="cert-header" data-aos="fade-up">
            <span className="section-badge">
              <i className="bi bi-patch-check-fill" />
              Credentials
            </span>
            <h2 className="section-title">Verified <em style={{ fontStyle: 'italic', color: 'var(--primary-color)' }}>credentials</em></h2>
            <div className="title-shape">
              <svg viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M 0,10 C 40,0 60,20 100,10 C 140,0 160,20 200,10" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <p className="section-description">
              Industry-accredited certifications and specialized training validating software engineering proficiency.
            </p>

            {/* View Mode Switcher */}
            <div className="cert-view-toggle">
              <button
                type="button"
                className={`cert-toggle-btn ${viewMode === 'circular' ? 'is-active' : ''}`}
                onClick={() => setViewMode('circular')}
              >
                <i className="bi bi-disc" />
                <span>3D Ring Gallery</span>
              </button>
              <button
                type="button"
                className={`cert-toggle-btn ${viewMode === 'grid' ? 'is-active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <i className="bi bi-grid-fill" />
                <span>Grid View</span>
              </button>
            </div>
          </div>

          {/* ═══ Circular 3D Wall Scene or Grid View ═══ */}
          {viewMode === 'circular' ? (
            <div className="wall" aria-label="Certification gallery">
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
                    {displayItems.map((cert, i) => {
                      const totalSlots = displayItems.length;
                      const angleStep = 360 / totalSlots;
                      const cardAngle = (i * angleStep) + rotation;
                      const rad = (cardAngle * Math.PI) / 180;
                      const cos = Math.cos(rad);

                      const opacity = Math.max(0.18, (cos + 1) / 2);
                      const scale = 0.86 + (cos + 1) * 0.08;
                      const zIndex = Math.round((cos + 1) * 50);

                      return (
                        <CertificateCardItem
                          key={cert._id ? `${cert._id}-${i}` : i}
                          cert={cert}
                          cardAngle={cardAngle}
                          radius={ringRadius}
                          scale={scale}
                          zIndex={zIndex}
                          opacity={opacity}
                          cos={cos}
                          onPreview={setPreviewCert}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Left/Right Controls */}
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

                {/* Quote */}
                <p className="wall__line">
                  <span className="word">Some</span>{" "}
                  <span className="word">for</span>{" "}
                  <span className="word">clients.</span>{" "}
                  <span className="word">Some</span>{" "}
                  <span className="word serif">to</span>{" "}
                  <span className="word serif">learn</span>{" "}
                  <span className="word serif">something</span>{" "}
                  <span className="word serif">new.</span>
                </p>

              </div>
            </div>
          ) : (
            /* Classic Grid View */
            <div className="cert-grid">
              {loading && active.length === 0 ? (
                [1, 2, 3].map((n) => (
                  <div key={n} className="cert-grid-item skeleton-shimmer" style={{ minHeight: '300px' }}>
                    <div style={{ height: '190px', width: '100%', background: 'var(--card-border)' }} />
                    <div style={{ padding: '16px' }}>
                      <div className="skeleton-bar mb-2" style={{ height: '12px', width: '35%' }} />
                      <div className="skeleton-bar mb-3" style={{ height: '18px', width: '75%' }} />
                      <div className="skeleton-bar" style={{ height: '34px', width: '100%', borderRadius: '8px' }} />
                    </div>
                  </div>
                ))
              ) : (
                active.map((cert, index) => (
                  <div
                    key={cert._id || index}
                    className="cert-grid-item"
                    onClick={() => setPreviewCert(cert)}
                    data-aos="fade-up"
                    data-aos-delay={(index % 3) * 80}
                  >
                    <div className="wall__card-img" style={{ height: '200px', flexShrink: 0 }}>
                      <Image
                        src={cert.pic && typeof cert.pic === "string" && (cert.pic.startsWith("http") || cert.pic.startsWith("/")) ? cert.pic : "/img/portfolio/portfolio-1.webp"}
                        alt={cert.name || "Certificate"}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        unoptimized={typeof cert.pic === "string" && cert.pic.startsWith("http")}
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="wall__card-body">
                      <span className="wall__card-issuer">{cert.issuedBy || "Accredited"}</span>
                      <h4 className="wall__card-title" style={{ fontSize: '1rem', marginBottom: '10px' }}>{cert.name}</h4>
                      <button
                        type="button"
                        className="wall__card-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewCert(cert);
                        }}
                      >
                        <span>View Certificate</span>
                        <i className="bi bi-arrow-up-right" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      </section>

      {/* Lightbox Preview Modal */}
      {previewCert && (
        <div
          className="cert-lightbox-backdrop"
          onClick={() => setPreviewCert(null)}
        >
          <div
            className="cert-lightbox-card"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="cert-lightbox-header">
              <div style={{ maxWidth: "85%" }}>
                <h5 className="m-0 fw-bold text-truncate" style={{ color: "var(--text-color)", fontSize: '1rem' }}>{previewCert.name}</h5>
                <small className="d-flex align-items-center gap-1 mt-1" style={{ color: 'var(--text-muted)' }}>
                  <i className="bi bi-patch-check-fill text-success" />
                  {previewCert.issuedBy} · Verified Credential
                </small>
              </div>
              <button
                type="button"
                style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'rgba(var(--accent-rgb), 0.08)',
                  border: '1px solid var(--card-border)',
                  color: 'var(--text-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', fontSize: 14, transition: 'all 0.2s ease',
                }}
                onClick={() => setPreviewCert(null)}
                aria-label="Close"
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(var(--accent-rgb), 0.16)'; e.currentTarget.style.color = 'var(--text-color)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(var(--accent-rgb), 0.08)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                <i className="bi bi-x-lg" />
              </button>
            </div>

            {/* Image */}
            <div className="cert-lightbox-img-wrap">
              <Image
                src={previewCert.pic && typeof previewCert.pic === "string" && (previewCert.pic.startsWith("http") || previewCert.pic.startsWith("/")) ? previewCert.pic : "/img/portfolio/portfolio-1.webp"}
                alt={previewCert.name}
                fill
                sizes="(max-width: 768px) 100vw, 780px"
                style={{ objectFit: "contain" }}
              />
            </div>

            {/* Footer */}
            <div className="cert-lightbox-footer">
              <a
                href={previewCert.pic}
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-primary d-inline-flex align-items-center gap-1"
              >
                <i className="bi bi-box-arrow-up-right" />
                Open Full Size
              </a>
              <button
                type="button"
                className="btn btn-sm"
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-muted)',
                  borderRadius: '999px',
                }}
                onClick={() => setPreviewCert(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}