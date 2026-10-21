"use client";
import React, { useEffect, useRef, useState } from "react";
import { getService } from "../Redux/ActionCreators/ServiceActionCreators";
import { useDispatch, useSelector } from "react-redux";
import "aos/dist/aos.css";
import AOS from "aos";
import Link from "next/link";
import * as THREE from "three";

/* =========================================================================
   DIFFERENT 3D ARTIFACT PER SERVICE CARD
   Types:
     0 -> 3D Cyber Cube & Hologram Wireframe Cage
     1 -> 3D Iridescent Torus Knot
     2 -> 3D Layered Architecture Tech Stack (Floating Plates)
     3 -> 3D Octahedron Satellite with Orbiting Radar Rings
     4 -> 3D Geodesic Icosahedron Core with Pulsing Vertices
     5 -> 3D Dual Gyroscope Cosmic Rings
   ========================================================================= */
function ServiceCard3D({ typeIndex = 0, isHovered = false }) {
  const mountRef = useRef(null);
  const hoverRef = useRef(isHovered);

  useEffect(() => {
    hoverRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 90;
    const height = container.clientHeight || 90;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 50);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Subtle lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x818cf8, 2.5, 20);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);

    const group = new THREE.Group();
    scene.add(group);

    const disposables = [];
    const t = typeIndex % 6;

    if (t === 0) {
      // 0: Cyber Cube with Wireframe Outer Cage
      const innerGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
      const innerMat = new THREE.MeshStandardMaterial({
        color: 0x4f46e5,
        metalness: 0.8,
        roughness: 0.2,
        emissive: 0x312e81,
        emissiveIntensity: 0.4,
      });
      const innerMesh = new THREE.Mesh(innerGeo, innerMat);

      const cageGeo = new THREE.BoxGeometry(1.65, 1.65, 1.65);
      const cageMat = new THREE.MeshBasicMaterial({
        color: 0x06b6d4,
        wireframe: true,
        transparent: true,
        opacity: 0.65,
      });
      const cageMesh = new THREE.Mesh(cageGeo, cageMat);

      group.add(innerMesh);
      group.add(cageMesh);
      disposables.push(innerGeo, innerMat, cageGeo, cageMat);

    } else if (t === 1) {
      // 1: Iridescent Torus Knot
      const torusGeo = new THREE.TorusKnotGeometry(0.8, 0.26, 64, 12);
      const torusMat = new THREE.MeshStandardMaterial({
        color: 0x8b5cf6,
        roughness: 0.25,
        metalness: 0.75,
        wireframe: false,
        emissive: 0x581c87,
        emissiveIntensity: 0.35,
      });
      const torusMesh = new THREE.Mesh(torusGeo, torusMat);
      group.add(torusMesh);
      disposables.push(torusGeo, torusMat);

    } else if (t === 2) {
      // 2: 3D Floating Engineering Book Stack & Codex
      const bookGeo = new THREE.BoxGeometry(1.35, 1.75, 0.26);
      const coverMat1 = new THREE.MeshStandardMaterial({ color: 0x4f46e5, metalness: 0.45, roughness: 0.3, emissive: 0x312e81, emissiveIntensity: 0.25 });
      const coverMat2 = new THREE.MeshStandardMaterial({ color: 0x06b6d4, metalness: 0.45, roughness: 0.3, emissive: 0x0891b2, emissiveIntensity: 0.25 });
      const pagesMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.65 });

      const book1 = new THREE.Mesh(bookGeo, [pagesMat, coverMat1, pagesMat, pagesMat, coverMat1, coverMat1]);
      book1.position.set(0, -0.22, -0.1);
      book1.rotation.y = 0.25;

      const book2 = new THREE.Mesh(bookGeo, [pagesMat, coverMat2, pagesMat, pagesMat, coverMat2, coverMat2]);
      book2.position.set(0, 0.24, 0.1);
      book2.rotation.y = -0.35;

      group.add(book1);
      group.add(book2);
      disposables.push(bookGeo, coverMat1, coverMat2, pagesMat);

    } else if (t === 3) {
      // 3: Octahedron Satellite with Orbiting Radar Rings
      const octGeo = new THREE.OctahedronGeometry(0.95);
      const octMat = new THREE.MeshStandardMaterial({
        color: 0x0ea5e9,
        metalness: 0.8,
        roughness: 0.2,
        emissive: 0x0369a1,
        emissiveIntensity: 0.4,
      });
      const octMesh = new THREE.Mesh(octGeo, octMat);

      const ringGeo = new THREE.RingGeometry(1.35, 1.48, 28);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2.4;

      group.add(octMesh);
      group.add(ringMesh);
      disposables.push(octGeo, octMat, ringGeo, ringMat);

    } else if (t === 4) {
      // 4: Geodesic Icosahedron Core with Pulsing Wireframe Vertices
      const icoGeo = new THREE.IcosahedronGeometry(1.0, 1);
      const icoMat = new THREE.MeshStandardMaterial({
        color: 0xa855f7,
        metalness: 0.7,
        roughness: 0.3,
        wireframe: true,
      });
      const icoMesh = new THREE.Mesh(icoGeo, icoMat);

      const coreGeo = new THREE.SphereGeometry(0.55, 16, 16);
      const coreMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);

      group.add(icoMesh);
      group.add(coreMesh);
      disposables.push(icoGeo, icoMat, coreGeo, coreMat);

    } else {
      // 5: Dual Gyroscope Cosmic Rings
      const ring1Geo = new THREE.TorusGeometry(1.15, 0.08, 16, 40);
      const ring1Mat = new THREE.MeshStandardMaterial({ color: 0x6366f1, metalness: 0.8, roughness: 0.2 });
      const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);

      const ring2Geo = new THREE.TorusGeometry(0.85, 0.08, 16, 40);
      const ring2Mat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, metalness: 0.8, roughness: 0.2 });
      const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
      ring2.rotation.y = Math.PI / 2;

      group.add(ring1);
      group.add(ring2);
      disposables.push(ring1Geo, ring1Mat, ring2Geo, ring2Mat);
    }

    let reqId;
    const startTime = performance.now();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startTime) * 0.001;
      const speed = hoverRef.current ? 2.8 : 1.0;

      group.rotation.x += 0.012 * speed;
      group.rotation.y += 0.018 * speed;

      if (hoverRef.current) {
        group.scale.set(1.12, 1.12, 1.12);
      } else {
        group.scale.set(1.0, 1.0, 1.0);
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(reqId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    };
  }, [typeIndex]);

  return <div ref={mountRef} className="srv-card-3d-canvas" aria-hidden="true" />;
}

/* =========================================================================
   SECTION BACKGROUND: CYBER MATRIX & HOLOGRAPHIC GRID
   ========================================================================= */
function ServicesBackground3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

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
