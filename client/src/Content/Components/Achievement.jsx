"use client";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAchievement } from "../Redux/ActionCreators/AchievementActionCreators";
import "aos/dist/aos.css";
import AOS from "aos";
import * as THREE from "three";
import useIntersectionWebGL from '../hooks/useIntersectionWebGL';

/* =========================================================================
   THREE.JS: GOLDEN CELESTIAL TROPHY & RADIANT MILESTONE GALAXY
   Distinct design: Central golden faceted milestone gemstone, orbiting
   golden radiant rings, and a shimmering starburst galaxy.
   ========================================================================= */
function AchievementThreeCanvas() {
  const mountRef = useIntersectionWebGL((container) => {
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
      renderer.forceContextLoss();
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
/* =========================================================================
   CSS 3D ACHIEVEMENT MINIATURES (Zero WebGL — pure CSS transforms)
   Type 0 -> Golden Trophy Cup
   Type 1 -> Brilliant Diamond Gem
   Type 2 -> Laurel Honor Medallion
   Type 3 -> Imperial Crown
   Type 4 -> Cyber Shield
   ========================================================================= */
function AchievementCard3D({ typeIndex = 0, isHovered = false }) {
  const t = typeIndex % 5;
  const spd = isHovered ? 0.35 : 1;

  const styles = `
    .ach-css3d-wrap { width:100%; height:100%; display:flex; align-items:center; justify-content:center; position:relative; }

    /* Trophy */
    .ach-trophy-body { width:32px; height:28px; border-radius:50% 50% 4px 4px;
      background:linear-gradient(160deg,#fbbf24,#b45309); position:relative;
      box-shadow:0 0 14px rgba(245,158,11,0.5), inset 0 -3px 6px rgba(0,0,0,0.2);
      animation: achTrophyBob ${spd * 2.5}s ease-in-out infinite alternate; }
    .ach-trophy-stem { width:6px; height:10px; background:linear-gradient(180deg,#f59e0b,#92400e);
      margin:0 auto; }
    .ach-trophy-base { width:28px; height:6px; border-radius:3px;
      background:linear-gradient(90deg,#fbbf24,#92400e); margin:0 auto;
      box-shadow:0 2px 6px rgba(245,158,11,0.4); }
    .ach-trophy-star { position:absolute; top:-8px; left:50%; transform:translateX(-50%);
      width:10px; height:10px;
      background:linear-gradient(135deg,#fef08a,#f59e0b);
      clip-path:polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);
      animation:achStarSpin ${spd * 3}s linear infinite; }
    @keyframes achTrophyBob { to { transform: translateY(-5px); } }
    @keyframes achStarSpin { to { transform: translateX(-50%) rotate(360deg); } }

    /* Diamond */
    .ach-diamond { width:40px; height:40px;
      background:linear-gradient(135deg,#38bdf8,#0284c7,#7dd3fc);
      clip-path:polygon(50% 0%,100% 40%,80% 100%,20% 100%,0% 40%);
      animation:achDiaSpin ${spd * 4}s linear infinite;
      box-shadow:0 0 20px rgba(56,189,248,0.6); }
    .ach-dia-cage { position:absolute; width:44px; height:44px;
      border:1.5px solid rgba(147,197,253,0.5);
      clip-path:polygon(50% 0%,100% 40%,80% 100%,20% 100%,0% 40%);
      animation:achDiaSpin ${spd * 2.5}s linear infinite reverse; }
    @keyframes achDiaSpin { to { transform: rotate(360deg); } }

    /* Medallion */
    .ach-medal { width:38px; height:38px; border-radius:50%;
      background:conic-gradient(#fbbf24,#b45309,#fbbf24,#d97706,#fbbf24);
      animation:achMedalSpin ${spd * 5}s linear infinite;
      box-shadow:0 0 14px rgba(251,191,36,0.5); }
    .ach-medal-inner { position:absolute; width:20px; height:20px; border-radius:50%;
      background:radial-gradient(circle,#fef08a,#f59e0b);
      animation:achMedalPulse ${spd * 1.6}s ease-in-out infinite alternate; }
    .ach-medal-ring { position:absolute; width:50px; height:50px; border-radius:50%;
      border:2px solid rgba(245,158,11,0.4);
      animation:achMedalRingPulse ${spd * 2}s ease-in-out infinite alternate; }
    @keyframes achMedalSpin { to { transform: rotate(360deg); } }
    @keyframes achMedalPulse { to { transform: scale(1.15); box-shadow: 0 0 12px rgba(254,240,138,0.8); } }
    @keyframes achMedalRingPulse { to { transform: scale(1.18); opacity: 0.6; } }

    /* Crown */
    .ach-crown-base { width:40px; height:22px; border-radius:0 0 4px 4px;
      background:linear-gradient(160deg,#c084fc,#7e22ce);
      position:relative;
      box-shadow:0 0 14px rgba(168,85,247,0.5);
      animation:achCrownFloat ${spd * 2.5}s ease-in-out infinite alternate; }
    .ach-crown-tip { position:absolute; bottom:18px; width:8px; height:12px;
      background:linear-gradient(180deg,#e879f9,#a855f7);
      clip-path:polygon(50% 0%,100% 100%,0% 100%); }
    .ach-crown-jewel { position:absolute; bottom:18px; width:6px; height:6px; border-radius:50%;
      background:#fef08a; box-shadow:0 0 6px #fef08a; }
    @keyframes achCrownFloat { to { transform: translateY(-5px) rotateX(8deg); } }

    /* Shield */
    .ach-shield { width:38px; height:44px;
      background:linear-gradient(160deg,#10b981,#059669);
      clip-path:polygon(15% 0%,85% 0%,100% 30%,50% 100%,0% 30%);
      animation:achShieldFloat ${spd * 2.8}s ease-in-out infinite alternate;
      box-shadow:0 0 14px rgba(16,185,129,0.5); }
    .ach-shield-ring { position:absolute; width:50px; height:50px; border-radius:50%;
      border:2px solid rgba(52,211,153,0.45);
      animation:achShieldRingSpin ${spd * 3.5}s linear infinite; }
    @keyframes achShieldFloat { to { transform: translateY(-5px) scale(1.05); } }
    @keyframes achShieldRingSpin { to { transform: rotate(360deg); } }
  `;

  return (
    <div className="ach-card-3d-canvas" aria-hidden="true">
      <style>{styles}</style>
      <div className="ach-css3d-wrap">
        {t === 0 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div className="ach-trophy-body"><div className="ach-trophy-star" /></div>
            <div className="ach-trophy-stem" />
            <div className="ach-trophy-base" />
          </div>
        )}
        {t === 1 && (
          <div style={{ position: "relative", width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="ach-dia-cage" />
            <div className="ach-diamond" />
          </div>
        )}
        {t === 2 && (
          <div style={{ position: "relative", width: "52px", height: "52px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="ach-medal-ring" />
            <div className="ach-medal" />
            <div className="ach-medal-inner" />
          </div>
        )}
        {t === 3 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ position: "relative", width: "48px", height: "36px", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
              {[0,1,2,3,4].map(i => (
                <div key={i} className="ach-crown-tip" style={{ left: `${6 + i*8}px`, height: i === 2 ? "16px" : "10px" }} />
              ))}
              {[0,1,2,3,4].map(i => (
                <div key={i} className="ach-crown-jewel" style={{ left: `${8 + i*8}px`, bottom: i === 2 ? "22px" : "16px" }} />
              ))}
            </div>
            <div className="ach-crown-base" style={{ width: "44px" }} />
          </div>
        )}
        {t === 4 && (
          <div style={{ position: "relative", width: "52px", height: "52px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="ach-shield-ring" />
            <div className="ach-shield" />
          </div>
        )}
      </div>
    </div>
  );
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
