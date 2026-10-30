"use client";
import React, { useEffect, useRef, useState } from "react";
import { getService } from "../Redux/ActionCreators/ServiceActionCreators";
import { useDispatch, useSelector } from "react-redux";
import "aos/dist/aos.css";
import AOS from "aos";
import Link from "next/link";
import useIntersectionWebGL from '../hooks/useIntersectionWebGL';
import * as THREE from "three";

/* =========================================================================
   CSS 3D ARTIFACT PER SERVICE CARD (Zero WebGL — pure CSS transforms)
   Types:
     0 -> Cyber Cube & Hologram Wireframe Cage
     1 -> Iridescent Torus Knot
     2 -> Floating Book Stack
     3 -> Octahedron + Radar Ring
     4 -> Icosahedron Wireframe Core
     5 -> Dual Gyroscope Rings
   ========================================================================= */
function ServiceCard3D({ typeIndex = 0, isHovered = false }) {
  const t = typeIndex % 6;
  const speed = isHovered ? 0.36 : 1;

  const styles = `
    .srv-css3d-wrap {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      perspective: 320px;
      position: relative;
    }
    /* ---- Shared ring / face ---- */
    .srv-cube-scene { position: relative; width: 54px; height: 54px; transform-style: preserve-3d; animation: srvCubeSpin ${speed * 4}s linear infinite; }
    .srv-cube-face {
      position: absolute;
      width: 54px; height: 54px;
      border: 1.5px solid rgba(99,102,241,0.7);
      background: rgba(79,70,229,0.12);
      backdrop-filter: blur(2px);
    }
    @keyframes srvCubeSpin { to { transform: rotateX(360deg) rotateY(360deg); } }

    .srv-torus-wrap { position: relative; width: 58px; height: 58px; }
    .srv-torus-ring {
      position: absolute;
      border-radius: 50%;
      border: 3px solid transparent;
    }
    .srv-tr-1 { width: 52px; height: 52px; top: 3px; left: 3px;
      border-color: #8b5cf6 transparent;
      animation: srvTorusSpin1 ${speed * 2.2}s linear infinite; }
    .srv-tr-2 { width: 38px; height: 38px; top: 10px; left: 10px;
      border-color: transparent #06b6d4;
      animation: srvTorusSpin2 ${speed * 1.6}s linear infinite reverse; }
    .srv-tr-core { width: 18px; height: 18px; top: 20px; left: 20px;
      border-radius: 50%; background: radial-gradient(circle, #a78bfa, #6366f1); }
    @keyframes srvTorusSpin1 { to { transform: rotate(360deg); } }
    @keyframes srvTorusSpin2 { to { transform: rotateY(360deg) rotate(360deg); } }

    .srv-book-wrap { position: relative; width: 54px; height: 58px; perspective: 200px; transform-style: preserve-3d;
      animation: srvBookFloat ${speed * 3}s ease-in-out infinite alternate; }
    .srv-book {
      position: absolute; border-radius: 3px 5px 5px 3px;
      transform-style: preserve-3d;
    }
    .srv-book-1 { width: 36px; height: 48px; bottom: 0; left: 9px;
      background: linear-gradient(135deg,#4f46e5,#312e81);
      transform: rotateY(-18deg) rotateX(8deg);
      box-shadow: inset -4px 0 8px rgba(0,0,0,0.35), 2px 4px 12px rgba(99,102,241,0.4); }
    .srv-book-2 { width: 34px; height: 44px; bottom: 4px; left: 12px;
      background: linear-gradient(135deg,#06b6d4,#0891b2);
      transform: rotateY(-24deg) rotateX(4deg) translateZ(3px);
      box-shadow: inset -3px 0 6px rgba(0,0,0,0.3), 2px 4px 10px rgba(6,182,212,0.35); }
    .srv-book-spine { position: absolute; left: 9px; bottom: 0; width: 5px; height: 48px;
      background: linear-gradient(180deg,#6366f1,#312e81);
      transform: rotateY(-108deg) translateX(-2.5px); }
    @keyframes srvBookFloat { 0% { transform: translateY(0) rotateX(0deg); } 100% { transform: translateY(-5px) rotateX(5deg); } }

    .srv-octa-wrap { position: relative; width: 58px; height: 58px; display:flex; align-items:center; justify-content:center; }
    .srv-octa {
      width: 36px; height: 36px;
      background: linear-gradient(135deg,#0ea5e9,#0369a1);
      clip-path: polygon(50% 0%,100% 50%,50% 100%,0% 50%);
      animation: srvOctaSpin ${speed * 3.5}s linear infinite;
      box-shadow: 0 0 14px rgba(14,165,233,0.5);
    }
    .srv-octa-ring {
      position: absolute;
      border-radius: 50%;
      border: 2px solid rgba(56,189,248,0.65);
      animation: srvOctaRingSpin ${speed * 2}s linear infinite;
    }
    .srv-or-1 { width: 54px; height: 20px; top: 19px; left: 2px; }
    .srv-or-2 { width: 54px; height: 20px; top: 19px; left: 2px; animation-direction: reverse; animation-duration: ${speed * 2.8}s; }
    @keyframes srvOctaSpin { to { transform: rotate(360deg); } }
    @keyframes srvOctaRingSpin { to { transform: rotateX(360deg); } }

    .srv-ico-wrap { position: relative; width: 58px; height: 58px; display:flex; align-items:center; justify-content:center; }
    .srv-ico-outer {
      width: 48px; height: 48px;
      border: 2px solid rgba(168,85,247,0.7);
      clip-path: polygon(50% 0%,95% 25%,95% 75%,50% 100%,5% 75%,5% 25%);
      animation: srvIcoSpin ${speed * 4}s linear infinite;
      background: rgba(168,85,247,0.08);
    }
    .srv-ico-inner {
      position: absolute;
      width: 22px; height: 22px; border-radius: 50%;
      background: radial-gradient(circle,#06b6d4,#0891b2);
      box-shadow: 0 0 12px rgba(6,182,212,0.7);
      animation: srvIcoPulse ${speed * 1.5}s ease-in-out infinite alternate;
    }
    @keyframes srvIcoSpin { to { transform: rotate(360deg); } }
    @keyframes srvIcoPulse { to { transform: scale(1.2); } }

    .srv-gyro-wrap { position: relative; width: 58px; height: 58px; display:flex; align-items:center; justify-content:center; }
    .srv-gyro-ring {
      position: absolute;
      border-radius: 50%;
      border: 2.5px solid;
    }
    .srv-gr-1 { width: 52px; height: 52px; border-color: #6366f1 transparent;
      animation: srvGyro1 ${speed * 2.4}s linear infinite; }
    .srv-gr-2 { width: 52px; height: 52px; border-color: transparent #06b6d4;
      animation: srvGyro2 ${speed * 1.8}s linear infinite; }
    .srv-gr-3 { width: 32px; height: 32px; border-color: #a78bfa transparent;
      animation: srvGyro3 ${speed * 3}s linear infinite reverse; }
    .srv-gyro-core { width: 14px; height: 14px; border-radius: 50%;
      background: radial-gradient(circle,#fff,#818cf8); z-index:1; }
    @keyframes srvGyro1 { to { transform: rotateX(360deg); } }
    @keyframes srvGyro2 { to { transform: rotateY(360deg); } }
    @keyframes srvGyro3 { to { transform: rotate(360deg) rotateX(180deg); } }
  `;

  return (
    <div className="srv-card-3d-canvas" aria-hidden="true">
      <style>{styles}</style>
      <div className="srv-css3d-wrap">
        {t === 0 && (
          <div style={{ perspective: "220px" }}>
            <div className="srv-cube-scene">
              <div className="srv-cube-face" style={{ transform: "translateZ(27px)" }} />
              <div className="srv-cube-face" style={{ transform: "translateZ(-27px) rotateY(180deg)" }} />
              <div className="srv-cube-face" style={{ transform: "rotateY(90deg) translateZ(27px)", borderColor: "rgba(6,182,212,0.7)", background: "rgba(6,182,212,0.08)" }} />
              <div className="srv-cube-face" style={{ transform: "rotateY(-90deg) translateZ(27px)", borderColor: "rgba(6,182,212,0.7)" }} />
              <div className="srv-cube-face" style={{ transform: "rotateX(90deg) translateZ(27px)", borderColor: "rgba(168,85,247,0.5)" }} />
              <div className="srv-cube-face" style={{ transform: "rotateX(-90deg) translateZ(27px)" }} />
            </div>
          </div>
        )}
        {t === 1 && (
          <div className="srv-torus-wrap">
            <div className="srv-tr-1 srv-torus-ring" />
            <div className="srv-tr-2 srv-torus-ring" />
            <div className="srv-tr-core" />
          </div>
        )}
        {t === 2 && (
          <div className="srv-book-wrap">
            <div className="srv-book srv-book-1" />
            <div className="srv-book srv-book-2" />
            <div className="srv-book-spine" />
          </div>
        )}
        {t === 3 && (
          <div className="srv-octa-wrap">
            <div className="srv-octa-ring srv-or-1" />
            <div className="srv-octa-ring srv-or-2" />
            <div className="srv-octa" />
          </div>
        )}
        {t === 4 && (
          <div className="srv-ico-wrap">
            <div className="srv-ico-outer" />
            <div className="srv-ico-inner" />
          </div>
        )}
        {t === 5 && (
          <div className="srv-gyro-wrap">
            <div className="srv-gr-1 srv-gyro-ring" />
            <div className="srv-gr-2 srv-gyro-ring" />
            <div className="srv-gr-3 srv-gyro-ring" />
            <div className="srv-gyro-core" />
          </div>
        )}
      </div>
    </div>
  );
}


/* =========================================================================
   SECTION BACKGROUND: CYBER MATRIX & HOLOGRAPHIC GRID
   ========================================================================= */
function ServicesBackground3D() {
  const mountRef = useIntersectionWebGL((container) => {
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 700;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 0, 20);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Cyber Grid Floor
    const grid = new THREE.GridHelper(50, 25, 0x6366f1, 0x1e1e38);
    grid.position.y = -7;
    grid.rotation.x = 0.2;
    scene.add(grid);

    // Floating Data Particles
    const particleCount = 220;
    const partGeo = new THREE.BufferGeometry();
    const partPos = new Float32Array(particleCount * 3);
    const partColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      partPos[i * 3] = (Math.random() - 0.5) * 44;
      partPos[i * 3 + 1] = (Math.random() - 0.5) * 24;
      partPos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 4;

      const isIndigo = Math.random() > 0.4;
      partColors[i * 3] = isIndigo ? 0.38 : 0.05;
      partColors[i * 3 + 1] = isIndigo ? 0.4 : 0.75;
      partColors[i * 3 + 2] = 0.95;
    }
    partGeo.setAttribute("position", new THREE.BufferAttribute(partPos, 3));
    partGeo.setAttribute("color", new THREE.BufferAttribute(partColors, 3));

    const partMat = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
    });
    const particleSystem = new THREE.Points(partGeo, partMat);
    scene.add(particleSystem);

    let reqId;
    const gridStartTime = performance.now();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - gridStartTime) * 0.001;

      grid.position.z = (elapsed * 2) % 4 - 2;
      particleSystem.rotation.y = elapsed * 0.02;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || 700;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener("resize", handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      partGeo.dispose();
      partMat.dispose();
      grid.geometry.dispose();
      grid.material.dispose();
      renderer.forceContextLoss();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="srv-three-bg" aria-hidden="true" />;
}

/* =========================================================================
   INDIVIDUAL SERVICE CARD WITH HOVER EFFECT
   ========================================================================= */
function ServiceCardItem({ service, index }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      data-aos="fade-up"
      data-aos-delay={(index % 3) * 100}
      style={{ minWidth: 0, width: "100%" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`service-card ${isHovered ? "is-hovered" : ""}`}>
        {/* Top bar with 3D Hologram Artifact + Standard Icon */}
        <div className="srv-top-row">
          <div className="service-icon-box">
            <i className={service.icon || "bi bi-code-square"}></i>
          </div>
          {/* Unique 3D Canvas element per service! */}
          <ServiceCard3D typeIndex={index} isHovered={isHovered} />
        </div>

        <h3 className="service-title">{service.name}</h3>

        <p className="service-description">
          {service.shortDescription}
        </p>

        <div className="service-card-footer d-flex align-items-center justify-content-between w-100 mt-auto pt-3 border-top" style={{ borderColor: "var(--border-color)" }}>
          <Link
            href={`/serviceDetail/${service._id}`}
            className="service-action-link"
          >
            <span>Explore</span> <i className="bi bi-arrow-right"></i>
          </Link>

          {service.price && (
            <span className="service-price-badge badge bg-body-secondary text-body" style={{ fontSize: "0.8rem", padding: "4px 8px", borderRadius: "999px" }}>
              ₹{service.price}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   MAIN SERVICES COMPONENT
   ========================================================================= */
export default function Service() {
  const ServiceStateData = useSelector((state) => state.ServiceStateData);
  const dispatch = useDispatch();
  const loading = !ServiceStateData || ServiceStateData.length === 0;

  useEffect(() => {
    if (!ServiceStateData || !ServiceStateData.length) {
      dispatch(getService());
    }
    AOS.init({ duration: 800, once: false, mirror: true });
  }, [dispatch, ServiceStateData]);

  const activeServices = Array.isArray(ServiceStateData) ? ServiceStateData.filter((x) => x.active) : [];

  return (
    <section id="services" className="services-section">
      <style>{`
        .services-section {
          position: relative;
          padding: 90px 0 75px;
          background: transparent !important;
          background-color: transparent !important;
        }
        .services-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
          justify-content: center;
        }
        .srv-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          margin-bottom: 14px;
        }
        .srv-card-3d-canvas {
          width: 76px;
          height: 76px;
          flex-shrink: 0;
          filter: drop-shadow(0 4px 12px rgba(99,102,241,0.25));
          transition: transform 0.3s ease;
        }
        .service-card {
          position: relative;
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 24px 20px 20px;
          background: var(--card-bg, #13112a);
          border: 1px solid var(--card-border, rgba(255, 255, 255, 0.08));
          border-radius: 20px;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease, border-color 0.35s ease;
          box-shadow: var(--shadow-sm);
        }
        [data-theme="light"] .service-card,
        body.light .service-card {
          background: #ffffff !important;
          border-color: rgba(99, 102, 241, 0.16) !important;
          box-shadow: 0 10px 30px rgba(99, 102, 241, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04) !important;
        }
        [data-theme="dark"] .service-card,
        body.dark .service-card {
          background: #13112a !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
          box-shadow: 0 14px 36px rgba(0, 0, 0, 0.5) !important;
        }
        .service-card.is-hovered {
          transform: translateY(-6px);
          border-color: var(--primary-color) !important;
          box-shadow: var(--shadow-lg), 0 0 24px rgba(var(--accent-rgb), 0.25) !important;
        }
        .service-card.is-hovered .srv-card-3d-canvas {
          transform: scale(1.08);
        }
        .service-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-color);
          margin-bottom: 10px;
        }
        [data-theme="light"] .service-title,
        body.light .service-title {
          color: #0f111a !important;
        }
        [data-theme="dark"] .service-title,
        body.dark .service-title {
          color: #f1f0fa !important;
        }
        .service-description {
          font-size: 0.84rem;
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 20px;
          flex-grow: 1;
        }
        [data-theme="light"] .service-description,
        body.light .service-description {
          color: #64677a !important;
        }
        [data-theme="dark"] .service-description,
        body.dark .service-description {
          color: #9d99bf !important;
        }
        .service-price-badge {
          background: rgba(var(--accent-rgb), 0.1) !important;
          border: 1px solid rgba(var(--accent-rgb), 0.22) !important;
          color: var(--primary-color) !important;
          font-family: 'DM Mono', monospace;
          font-weight: 700;
        }

        @media (max-width: 991.98px) {
          .services-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 16px;
          }
        }
        @media (max-width: 576px) {
          .services-section {
            padding: 60px 0 50px;
          }
          .services-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 10px !important;
          }
          .services-grid > :last-child:nth-child(odd) {
            grid-column: 1 / -1 !important;
            justify-self: center !important;
            width: calc(50% - 5px) !important;
            max-width: calc(50% - 5px) !important;
          }
          .service-card {
            padding: 16px 12px 14px;
            border-radius: 16px;
          }
          .srv-card-3d-canvas {
            width: 58px;
            height: 58px;
          }
          .service-title {
            font-size: 0.92rem !important;
          }
          .service-description {
            font-size: 0.72rem !important;
            -webkit-line-clamp: 2 !important;
          }
        }
        @media (max-width: 360px) {
          .services-grid {
            gap: 8px !important;
          }
          .srv-card-3d-canvas {
            width: 48px;
            height: 48px;
          }
        }
      `}</style>

      <div className="container text-center" style={{ position: "relative", zIndex: 1 }}>
        {/* Section Header */}
        <div data-aos="fade-up">
          <span className="section-badge">
            <i className="bi bi-gear-wide-connected"></i> Offerings
          </span>
          <h2 className="section-title">Services &amp; Expertise</h2>
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
          <p className="section-description mb-4">
            End-to-end full-stack engineering, custom cloud architecture, interactive 3D web applications, and performance optimization.
          </p>
        </div>

        {/* Services Grid with unique 3D artifacts */}
        <div className="services-grid mt-2">
          {loading ? (
            [1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} style={{ minWidth: 0, width: "100%" }}>
                <div className="service-card skeleton-shimmer" style={{ minHeight: "260px" }}>
                  <div className="skeleton-pill mb-3" style={{ width: "48px", height: "48px", borderRadius: "12px" }}></div>
                  <div className="skeleton-bar mb-2" style={{ height: "20px", width: "70%" }}></div>
                  <div className="skeleton-bar mb-2" style={{ height: "14px", width: "90%" }}></div>
                  <div className="skeleton-bar mb-3" style={{ height: "14px", width: "60%" }}></div>
                  <div className="d-flex align-items-center justify-content-between w-100 mt-auto pt-3 border-top" style={{ borderColor: "var(--border-color)" }}>
                    <div className="skeleton-bar" style={{ height: "14px", width: "60px" }}></div>
                    <div className="skeleton-pill" style={{ height: "18px", width: "50px" }}></div>
                  </div>
                </div>
              </div>
            ))
          ) : activeServices.length > 0 ? (
            activeServices.map((service, index) => (
              <ServiceCardItem
                key={service._id || index}
                service={service}
                index={index}
              />
            ))
          ) : (
            <div className="py-5 text-muted" style={{ gridColumn: "1 / -1" }}>
              No services listed currently.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
