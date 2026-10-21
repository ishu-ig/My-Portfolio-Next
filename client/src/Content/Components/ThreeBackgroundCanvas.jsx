"use client";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

// Color palettes for each theme
const DARK_PALETTE = [
  new THREE.Color("#7c3aed"), // violet
  new THREE.Color("#2563eb"), // royal blue
  new THREE.Color("#0891b2"), // cyan
  new THREE.Color("#a855f7"), // purple
  new THREE.Color("#6366f1"), // indigo
];

const LIGHT_PALETTE = [
  new THREE.Color("#818cf8"), // muted indigo
  new THREE.Color("#60a5fa"), // muted blue
  new THREE.Color("#34d399"), // muted emerald
  new THREE.Color("#a78bfa"), // muted violet
  new THREE.Color("#f472b6"), // muted pink
];

function getCurrentTheme() {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.getAttribute("data-theme") || "dark";
}

export default function ThreeBackgroundCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let W = window.innerWidth;
    let H = window.innerHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 300);
    camera.position.z = 32;

    // 2. WebGL Renderer (alpha: true so page-bg-layer shows through)
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);

    // 3. Get initial theme palette
    let isDark = getCurrentTheme() === "dark";
    let palette = isDark ? DARK_PALETTE : LIGHT_PALETTE;

    // 4. Floating Particles
    const particleCount = 320;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 90;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 65;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;

      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3]     = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particlesGeo.setAttribute("color",    new THREE.BufferAttribute(colors, 3));

    const particlesMat = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.55 : 0.28,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(particlesGeo, particlesMat);
    scene.add(points);

    // 5. Floating Wireframe Geometric Polyhedra
    const shapes = [];
    const geomTypes = [
      new THREE.OctahedronGeometry(0.7, 0),
      new THREE.TetrahedronGeometry(0.6, 0),
      new THREE.IcosahedronGeometry(0.55, 0),
      new THREE.DodecahedronGeometry(0.5, 0),
    ];

    const shapeCount = 12;
    for (let i = 0; i < shapeCount; i++) {
      const g = geomTypes[i % geomTypes.length];
      const m = new THREE.MeshBasicMaterial({
        color: palette[i % palette.length],
        wireframe: true,
        transparent: true,
        opacity: isDark ? 0.14 : 0.06,
      });
      const mesh = new THREE.Mesh(g, m);
      mesh.position.set(
        (Math.random() - 0.5) * 70,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 25
      );
      mesh.userData = {
        rotSpeedX:   (Math.random() - 0.5) * 0.007,
        rotSpeedY:   (Math.random() - 0.5) * 0.009,
        floatSpeed:  Math.random() * 0.0025 + 0.001,
        floatOffset: Math.random() * Math.PI * 2,
      };
      scene.add(mesh);
      shapes.push(mesh);
    }

    // 6. Theme change observer — update colors & opacity live
    const applyTheme = (dark) => {
      isDark = dark;
      palette = dark ? DARK_PALETTE : LIGHT_PALETTE;

      // Update particle colors
      const col = particlesGeo.attributes.color;
      for (let i = 0; i < particleCount; i++) {
        const c = palette[i % palette.length];
        col.array[i * 3]     = c.r;
        col.array[i * 3 + 1] = c.g;
        col.array[i * 3 + 2] = c.b;
      }
      col.needsUpdate = true;
      particlesMat.opacity = dark ? 0.55 : 0.28;

      // Update shape colors & opacity
      shapes.forEach((s, i) => {
        s.material.color.set(palette[i % palette.length]);
        s.material.opacity = dark ? 0.14 : 0.06;
      });
    };

    const observer = new MutationObserver(() => {
      applyTheme(getCurrentTheme() === "dark");
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // 7. Interactive Mouse & Scroll tracking
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetScrollY = 0;
    let scrollY = 0;

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 3;
      targetMouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const handleScroll = () => {
      targetScrollY = window.scrollY * 0.005;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    const handleResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    };
    window.addEventListener("resize", handleResize);

    // 8. Animation Loop
    let frameId;
    let t = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      t += 0.01;

      // Gentle continuous rotation
      points.rotation.y += 0.0004;
      points.rotation.x += 0.00015;

      // Mouse & Scroll lerp
      mouseX   += (targetMouseX - mouseX) * 0.04;
      mouseY   += (targetMouseY - mouseY) * 0.04;
      scrollY  += (targetScrollY - scrollY) * 0.04;

      camera.position.x = mouseX;
      camera.position.y = mouseY - scrollY;
      camera.lookAt(0, -scrollY, 0);

      // Float and rotate polyhedra
      for (let i = 0; i < shapes.length; i++) {
        const s = shapes[i];
        s.rotation.x += s.userData.rotSpeedX;
        s.rotation.y += s.userData.rotSpeedY;
        s.position.y += Math.sin(t * s.userData.floatSpeed * 100 + s.userData.floatOffset) * 0.006;
      }

      renderer.render(scene, camera);
    };
    animate();

    // 9. Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll",    handleScroll);
      window.removeEventListener("resize",    handleResize);

      particlesGeo.dispose();
      particlesMat.dispose();
      geomTypes.forEach((g) => g.dispose());
      shapes.forEach((s) => {
        s.material.dispose();
      });
      renderer.dispose();
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      className="global-skill-bg-root"
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* Three.js Canvas Mount */}
      <div
        ref={mountRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* Atmospheric Ambient Blobs */}
      <div className="global-sk-blob global-sk-blob-1" />
      <div className="global-sk-blob global-sk-blob-2" />
      <div className="global-sk-blob global-sk-blob-3" />
      <div className="global-sk-blob global-sk-blob-4" />

      <style>{`
        .global-sk-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(85px);
          pointer-events: none;
          z-index: 0;
          animation: globalBlobDrift 14s ease-in-out infinite alternate;
          will-change: transform;
          transition: background 0.5s ease;
        }

        .global-sk-blob-1 {
          width: 580px; height: 580px;
          background: radial-gradient(circle, rgba(124, 58, 237, 0.2) 0%, transparent 70%);
          top: -120px; left: -150px;
        }
        .global-sk-blob-2 {
          width: 480px; height: 480px;
          background: radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, transparent 70%);
          top: 48%; right: -120px;
          animation-duration: 10s;
          animation-direction: alternate-reverse;
        }
        .global-sk-blob-3 {
          width: 420px; height: 420px;
          background: radial-gradient(circle, rgba(8, 145, 178, 0.12) 0%, transparent 70%);
          bottom: -80px; left: 28%;
          animation-duration: 16s;
        }
        .global-sk-blob-4 {
          width: 380px; height: 380px;
          background: radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%);
          top: 18%; right: 28%;
          animation-duration: 12s;
          animation-direction: alternate-reverse;
        }

        @keyframes globalBlobDrift {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(32px, 24px) scale(1.08); }
        }

        /* Light mode — subtle, calm blobs */
        [data-theme="light"] .global-sk-blob-1,
        body.light .global-sk-blob-1 {
          background: radial-gradient(circle, rgba(99, 102, 241, 0.07) 0%, transparent 70%);
        }
        [data-theme="light"] .global-sk-blob-2,
        body.light .global-sk-blob-2 {
          background: radial-gradient(circle, rgba(37, 99, 235, 0.05) 0%, transparent 70%);
        }
        [data-theme="light"] .global-sk-blob-3,
        body.light .global-sk-blob-3 {
          background: radial-gradient(circle, rgba(8, 145, 178, 0.04) 0%, transparent 70%);
        }
        [data-theme="light"] .global-sk-blob-4,
        body.light .global-sk-blob-4 {
          background: radial-gradient(circle, rgba(139, 92, 246, 0.04) 0%, transparent 70%);
        }
      `}</style>
    </div>
  );
}
