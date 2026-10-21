"use client";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAchievement } from "../Redux/ActionCreators/AchievementActionCreators";
import "aos/dist/aos.css";
import AOS from "aos";
import * as THREE from "three";

/* =========================================================================
   THREE.JS: GOLDEN CELESTIAL TROPHY & RADIANT MILESTONE GALAXY
   Distinct design: Central golden faceted milestone gemstone, orbiting
   golden radiant rings, and a shimmering starburst galaxy.
   ========================================================================= */
function AchievementThreeCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 550;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 80);
    camera.position.set(0, 0, 18);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Warm ambient & golden directional lights
    const ambientLight = new THREE.AmbientLight(0xfffbeb, 0.9);
    scene.add(ambientLight);

    const goldLight = new THREE.DirectionalLight(0xf59e0b, 2.5);
    goldLight.position.set(10, 15, 12);
    scene.add(goldLight);

    const violetLight = new THREE.DirectionalLight(0x8b5cf6, 1.8);
    violetLight.position.set(-12, -8, 8);
    scene.add(violetLight);

    // --- 1. CENTRAL CELESTIAL MILESTONE GEMSTONE (3D Golden Polyhedron) ---
    const trophyGroup = new THREE.Group();
    scene.add(trophyGroup);

    const gemGeo = new THREE.DodecahedronGeometry(1.6, 0);
    const gemMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.85,
      roughness: 0.18,
      emissive: 0xd97706,
      emissiveIntensity: 0.35,
    });
    const gemMesh = new THREE.Mesh(gemGeo, gemMat);
    trophyGroup.add(gemMesh);

    // Wireframe outer cage for the gemstone
    const wireGeo = new THREE.DodecahedronGeometry(2.05, 0);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xfde68a,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    trophyGroup.add(wireMesh);

    // --- 2. ORBITING GOLDEN LAUREL / MILESTONE RINGS ---
    const ring1Geo = new THREE.TorusGeometry(3.2, 0.06, 16, 64);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0xb45309,
      emissiveIntensity: 0.25,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    trophyGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(3.9, 0.05, 16, 64);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x818cf8,
      metalness: 0.85,
      roughness: 0.25,
      emissive: 0x4338ca,
      emissiveIntensity: 0.25,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 3.5;
    ring2.rotation.z = Math.PI / 4;
    trophyGroup.add(ring2);

    // --- 3. RADIANT STARBURST PARTICLES (Golden & Violet Stars) ---
    const starCount = 380;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      // Golden spiral distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 5 + Math.random() * 16;

      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.65;
      starPos[i * 3 + 2] = r * Math.cos(phi) - 2;

      // Color variation: 65% golden/amber, 35% violet/indigo
      const isGold = Math.random() > 0.35;
      if (isGold) {
        starColors[i * 3] = 0.98 + Math.random() * 0.02;
        starColors[i * 3 + 1] = 0.75 + Math.random() * 0.15;
        starColors[i * 3 + 2] = 0.15 + Math.random() * 0.2;
      } else {
        starColors[i * 3] = 0.5 + Math.random() * 0.2;
        starColors[i * 3 + 1] = 0.45 + Math.random() * 0.2;
        starColors[i * 3 + 2] = 0.98;
      }
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.22,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // --- 4. MOUSE PARALLAX & ANIMATION ---
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      mouseX = (clientX / width - 0.5) * 2;
      mouseY = -(clientY / height - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let reqId;
    const startTime = performance.now();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startTime) * 0.001;

      // Camera drift on mouse
      camera.position.x += (mouseX * 1.8 - camera.position.x) * 0.04;
      camera.position.y += (mouseY * 1.2 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      // Gemstone rotations
      gemMesh.rotation.x = elapsed * 0.28;
      gemMesh.rotation.y = elapsed * 0.38;
      wireMesh.rotation.x = -elapsed * 0.2;
      wireMesh.rotation.y = -elapsed * 0.25;

      // Orbiting rings
      ring1.rotation.z = elapsed * 0.35;
      ring2.rotation.z = -elapsed * 0.3;

      // Pulse trophy
      const pulse = 1 + Math.sin(elapsed * 2) * 0.04;
      trophyGroup.scale.set(pulse, pulse, pulse);

      // Shimmer star field
      starField.rotation.y = elapsed * 0.015;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || 550;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      gemGeo.dispose();
      gemMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      starGeo.dispose();
      starMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="ach-three-bg" aria-hidden="true" />;
}

/* =========================================================================
   DIFFERENT THREE.JS 3D DESIGN PER ACHIEVEMENT CARD
   Type 0 -> 3D Golden Victory Trophy
   Type 1 -> 3D Brilliant Milestone Diamond / Faceted Gem
   Type 2 -> 3D Laurel Honor Medallion with Orbital Star Rings
   Type 3 -> 3D Imperial Honor Crown / Crest
   Type 4 -> 3D Cyber Shield of Excellence
   ========================================================================= */
function AchievementCard3D({ typeIndex = 0, isHovered = false }) {
  const mountRef = useRef(null);
  const hoverRef = useRef(isHovered);

  useEffect(() => {
    hoverRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 80;
    const height = container.clientHeight || 80;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 50);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xfffbeb, 0.95);
    scene.add(ambientLight);

    const goldLight = new THREE.DirectionalLight(0xf59e0b, 2.5);
    goldLight.position.set(4, 5, 5);
    scene.add(goldLight);

    const purpleLight = new THREE.DirectionalLight(0x8b5cf6, 1.5);
    purpleLight.position.set(-4, -3, 3);
    scene.add(purpleLight);

    const group = new THREE.Group();
    scene.add(group);

    const disposables = [];
    const t = typeIndex % 5;

    if (t === 0) {
      // 0: Golden Victory Trophy / Cup
      const cupGeo = new THREE.CylinderGeometry(0.8, 0.45, 1.2, 24);
      const goldMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.85,
        roughness: 0.2,
        emissive: 0xb45309,
        emissiveIntensity: 0.35,
      });
      const cup = new THREE.Mesh(cupGeo, goldMat);
      cup.position.y = 0.2;
      group.add(cup);

      const stemGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.5, 16);
      const stem = new THREE.Mesh(stemGeo, goldMat);
      stem.position.y = -0.6;
      group.add(stem);

      const footGeo = new THREE.CylinderGeometry(0.65, 0.75, 0.2, 24);
      const foot = new THREE.Mesh(footGeo, goldMat);
      foot.position.y = -0.85;
      group.add(foot);

      const handleGeo = new THREE.TorusGeometry(0.42, 0.08, 12, 24, Math.PI);
      const handle1 = new THREE.Mesh(handleGeo, goldMat);
      handle1.position.set(-0.75, 0.3, 0);
      handle1.rotation.z = Math.PI / 2;
      group.add(handle1);

      const handle2 = new THREE.Mesh(handleGeo, goldMat);
      handle2.position.set(0.75, 0.3, 0);
      handle2.rotation.z = -Math.PI / 2;
      group.add(handle2);

      const starGeo = new THREE.OctahedronGeometry(0.32, 0);
      const starMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
      const star = new THREE.Mesh(starGeo, starMat);
      star.position.y = 1.1;
      group.add(star);

      disposables.push(cupGeo, goldMat, stemGeo, footGeo, handleGeo, starGeo, starMat);

    } else if (t === 1) {
      // 1: Brilliant Milestone Diamond / Faceted Gem
      const gemGeo = new THREE.OctahedronGeometry(1.05, 0);
      const gemMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        metalness: 0.9,
        roughness: 0.15,
        emissive: 0x0284c7,
        emissiveIntensity: 0.45,
      });
      const gem = new THREE.Mesh(gemGeo, gemMat);
      group.add(gem);

      const cageGeo = new THREE.OctahedronGeometry(1.4, 0);
      const cageMat = new THREE.MeshBasicMaterial({
        color: 0x93c5fd,
        wireframe: true,
        transparent: true,
        opacity: 0.55,
      });
      const cage = new THREE.Mesh(cageGeo, cageMat);
      group.add(cage);

      disposables.push(gemGeo, gemMat, cageGeo, cageMat);

    } else if (t === 2) {
      // 2: Laurel Honor Medallion with Orbital Star Rings
      const medalGeo = new THREE.CylinderGeometry(1.1, 1.1, 0.18, 32);
      const medalMat = new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        metalness: 0.85,
        roughness: 0.22,
        emissive: 0xd97706,
        emissiveIntensity: 0.3,
      });
      const medal = new THREE.Mesh(medalGeo, medalMat);
      medal.rotation.x = Math.PI / 2.2;
      group.add(medal);

      const starGeo = new THREE.DodecahedronGeometry(0.42, 0);
      const starMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.5, roughness: 0.3 });
      const star = new THREE.Mesh(starGeo, starMat);
      star.position.z = 0.22;
      medal.add(star);

      const ringGeo = new THREE.TorusGeometry(1.5, 0.05, 12, 36);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.7 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 3;
      group.add(ring);

      disposables.push(medalGeo, medalMat, starGeo, starMat, ringGeo, ringMat);

    } else if (t === 3) {
      // 3: Imperial Honor Crown / Crest
      const baseGeo = new THREE.CylinderGeometry(0.9, 0.75, 0.5, 24, 1, true);
      const crownMat = new THREE.MeshStandardMaterial({
        color: 0xa855f7,
        metalness: 0.8,
        roughness: 0.2,
        emissive: 0x7e22ce,
        emissiveIntensity: 0.4,
        side: THREE.DoubleSide,
      });
      const crownBase = new THREE.Mesh(baseGeo, crownMat);
      group.add(crownBase);

      const tipGeo = new THREE.ConeGeometry(0.2, 0.55, 6);
      const jewelGeo = new THREE.SphereGeometry(0.12, 8, 8);
      const jewelMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
      disposables.push(baseGeo, crownMat, tipGeo, jewelGeo, jewelMat);

      for (let i = 0; i < 5; i++) {
        const ang = (i / 5) * Math.PI * 2;
        const tip = new THREE.Mesh(tipGeo, crownMat);
        tip.position.set(Math.cos(ang) * 0.8, 0.5, Math.sin(ang) * 0.8);
        group.add(tip);

        const jewel = new THREE.Mesh(jewelGeo, jewelMat);
        jewel.position.set(Math.cos(ang) * 0.8, 0.8, Math.sin(ang) * 0.8);
        group.add(jewel);
      }

    } else {
      // 4: Cyber Shield of Excellence
      const shieldGeo = new THREE.ConeGeometry(1.1, 1.8, 3);
      const shieldMat = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        metalness: 0.85,
        roughness: 0.2,
        emissive: 0x059669,
        emissiveIntensity: 0.35,
      });
      const shield = new THREE.Mesh(shieldGeo, shieldMat);
      shield.rotation.z = Math.PI;
      group.add(shield);

      const ringGeo = new THREE.RingGeometry(1.3, 1.42, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x34d399, side: THREE.DoubleSide, transparent: true, opacity: 0.65 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      group.add(ring);

      disposables.push(shieldGeo, shieldMat, ringGeo, ringMat);
    }

    let reqId;
    const badgeStartTime = performance.now();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const speed = hoverRef.current ? 3.0 : 1.0;
      const elapsed = (performance.now() - badgeStartTime) * 0.001;

      group.rotation.y += 0.016 * speed;
      group.rotation.x = Math.sin(elapsed * 1.5) * 0.12;

      if (hoverRef.current) {
        group.scale.lerp(new THREE.Vector3(1.16, 1.16, 1.16), 0.1);
      } else {
        group.scale.lerp(new THREE.Vector3(1.0, 1.0, 1.0), 0.1);
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

  return <div ref={mountRef} className="ach-card-3d-canvas" aria-hidden="true" />;
}

/* =========================================================================
   INDIVIDUAL ACHIEVEMENT CARD ITEM WITH 3D HOVER
   ========================================================================= */
function AchievementCardItem({ counter, index }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="achievement-card-v2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Real Three.js 3D Interactive Miniature Artifact */}
      <div className="ach-card-3d-wrap">
        <AchievementCard3D typeIndex={index} isHovered={isHovered} />
      </div>

      {/* Unified Counter / Stat Display */}
      <div>
        <div className="achievement-number">
          {counter.isStatic ? (
            <span>{counter.stat || counter.target || "100%"}</span>
          ) : (
            <>
              {counter.value}
              <span style={{ fontSize: "1.1rem", fontWeight: 700 }}>+</span>
            </>
          )}
        </div>
        <p className="achievement-label">
          {counter.label}
        </p>
      </div>
    </div>
  );
}

/* =========================================================================
   MAIN ACHIEVEMENT SECTION
   ========================================================================= */
export default function Achievement() {
  const dispatch = useDispatch();
  const AchievementStateData = useSelector((state) => state.AchievementStateData);
  const [loading, setLoading] = useState(!AchievementStateData?.length);
  const [counters, setCounters] = useState([]);
  const sectionRef = useRef(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    dispatch(getAchievement());
    AOS.init({ duration: 800, once: false, mirror: true });
  }, [dispatch]);

  useEffect(() => {
    if (AchievementStateData) {
      setLoading(false);
    }
    if (!AchievementStateData?.length) return;
    const active = [...AchievementStateData]
      .filter((item) => item.active)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((item) => ({ ...item, value: 0, isStatic: item.type === "static" }));
    setCounters(active);
  }, [AchievementStateData]);

  // Run Countup when in view
  useEffect(() => {
    if (!counters.length || animatedRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animatedRef.current) {
          animatedRef.current = true;

          counters.forEach((counter, index) => {
            if (counter.isStatic || !counter.target) return;
            let current = 0;
            const target = Number(counter.target);
            const increment = Math.max(1, Math.ceil(target / 45));
            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                current = target;
                clearInterval(timer);
              }
              setCounters((prev) => {
                const next = [...prev];
                if (next[index]) next[index] = { ...next[index], value: current };
                return next;
              });
            }, 35);
          });
        }
      },
      { threshold: 0.2 }
    );

    const elem = sectionRef.current;
    if (elem) observer.observe(elem);

    return () => {
      if (elem) observer.unobserve(elem);
    };
  }, [counters]);

  if (!loading && !counters.length) return null;

  return (
    <section ref={sectionRef} id="achievements" className="achievement-section">
      <style>{`
        .achievement-section {
          position: relative;
          padding: 85px 0;
          background: transparent !important;
          background-color: transparent !important;
        }

        .achievement-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 20px;
          max-width: 1040px;
          margin: 40px auto 0;
        }

        .achievement-card-v2 {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 24px 18px 20px;
          background: var(--card-bg, #13112a);
          border: 1px solid var(--card-border, rgba(255, 255, 255, 0.08));
          border-radius: 20px;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease, border-color 0.35s ease;
          box-shadow: var(--shadow-sm);
        }
        [data-theme="light"] .achievement-card-v2,
        body.light .achievement-card-v2 {
          background: #ffffff !important;
          border-color: rgba(99, 102, 241, 0.16) !important;
          box-shadow: 0 10px 30px rgba(99, 102, 241, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04) !important;
        }
        [data-theme="dark"] .achievement-card-v2,
        body.dark .achievement-card-v2 {
          background: #13112a !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
          box-shadow: 0 14px 36px rgba(0, 0, 0, 0.5) !important;
        }

        .achievement-card-v2:hover {
          transform: translateY(-6px);
          border-color: rgba(245, 158, 11, 0.55);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.22), 0 0 20px rgba(245, 158, 11, 0.2);
        }

        .ach-card-3d-wrap {
          width: 76px;
          height: 76px;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          filter: drop-shadow(0 6px 14px rgba(245, 158, 11, 0.28));
          transition: transform 0.35s ease, filter 0.35s ease;
        }

        .achievement-card-v2:hover .ach-card-3d-wrap {
          transform: scale(1.1);
          filter: drop-shadow(0 8px 22px rgba(245, 158, 11, 0.48));
        }

        .ach-card-3d-canvas {
          width: 100%;
          height: 100%;
        }

        .achievement-icon-circle {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: color-mix(in srgb, #f59e0b 16%, transparent);
          border: 1.5px solid color-mix(in srgb, #f59e0b 35%, transparent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.35rem;
          color: #f59e0b;
          margin-bottom: 14px;
          transition: transform 0.35s ease, box-shadow 0.35s ease;
        }

        .achievement-card-v2:hover .achievement-icon-circle {
          transform: scale(1.12) rotate(6deg);
          box-shadow: 0 6px 18px rgba(245, 158, 11, 0.35);
        }

        .achievement-number {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 2.1rem;
          font-weight: 800;
          color: var(--text-color);
          line-height: 1.1;
          margin-bottom: 6px;
          background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 60%, #818cf8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .achievement-label {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-muted);
          line-height: 1.4;
          margin: 0;
        }
        [data-theme="light"] .achievement-label,
        body.light .achievement-label {
          color: #64677a !important;
        }
        [data-theme="dark"] .achievement-label,
        body.dark .achievement-label {
          color: #9d99bf !important;
        }


        @media (max-width: 991.98px) {
          .achievement-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 16px;
          }
        }

        @media (max-width: 576px) {
          .achievement-section {
            padding: 50px 0 !important;
          }
          .achievement-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 10px !important;
            margin-top: 24px;
          }
          .achievement-grid > :last-child:nth-child(odd) {
            grid-column: 1 / -1 !important;
            justify-self: center !important;
            width: calc(50% - 5px) !important;
            max-width: calc(50% - 5px) !important;
          }
          .achievement-card-v2 {
            padding: 14px 8px !important;
            border-radius: 16px !important;
            min-width: 0 !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }
          .ach-card-3d-wrap {
            width: 54px !important;
            height: 54px !important;
            margin-bottom: 6px !important;
          }
          .achievement-icon-circle {
            width: 36px !important;
            height: 36px !important;
            font-size: 1.05rem !important;
            margin-bottom: 8px !important;
            border-radius: 10px !important;
          }
          .achievement-number {
            font-size: 1.35rem !important;
            margin-bottom: 2px !important;
          }
          .achievement-label {
            font-size: 0.68rem !important;
            letter-spacing: 0.03em !important;
            line-height: 1.2 !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
          }
        }

        @media (max-width: 360px) {
          .achievement-grid {
            gap: 8px !important;
          }
          .achievement-card-v2 {
            padding: 10px 6px !important;
          }
          .achievement-icon-circle {
            width: 32px !important;
            height: 32px !important;
            font-size: 0.95rem !important;
          }
          .achievement-number {
            font-size: 1.2rem !important;
          }
          .achievement-label {
            font-size: 0.62rem !important;
          }
        }
      `}</style>

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div className="text-center mb-4" data-aos="fade-up">
          <span className="section-badge">
            <i className="bi bi-trophy-fill"></i> Key Milestones
          </span>
          <h2 className="section-title">Achievements &amp; Impact</h2>
          <div className="title-shape">
            <svg viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M 0,10 C 40,0 60,20 100,10 C 140,0 160,20 200,10" fill="none" stroke="currentColor" strokeWidth="2"></path>
            </svg>
          </div>
          <p className="section-subtitle mb-0">
            Measurable milestones, verified production results, and high-impact software metrics delivered.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="achievement-grid" data-aos="fade-up" data-aos-delay="100">
          {loading ? (
            [1, 2, 3, 4].map((n) => (
              <div key={n} className="achievement-card-v2 skeleton-shimmer" style={{ minHeight: "130px" }}>
                <div className="skeleton-pill mx-auto mb-2" style={{ width: "42px", height: "42px", borderRadius: "12px" }}></div>
                <div className="skeleton-bar mx-auto mb-2" style={{ height: "24px", width: "50%" }}></div>
                <div className="skeleton-bar mx-auto" style={{ height: "12px", width: "70%" }}></div>
              </div>
            ))
          ) : (
            counters.map((counter, index) => (
              <AchievementCardItem
                key={counter._id || index}
                counter={counter}
                index={index}
              />
            ))
          )}
        </div>

      </div>
    </section>
  );
}
