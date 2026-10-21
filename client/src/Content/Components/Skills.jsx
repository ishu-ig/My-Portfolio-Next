"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import * as THREE from "three";
import AOS from "aos";
import "aos/dist/aos.css";
import { getSkill } from "../Redux/ActionCreators/SkillActionCreators";

const SKILL_ICON_MAP = {
  "react": "bi bi-infinity",
  "next": "bi bi-arrow-right-circle-fill",
  "vue": "bi bi-triangle-fill",
  "html": "bi bi-filetype-html",
  "css": "bi bi-filetype-css",
  "javascript": "bi bi-filetype-js",
  "typescript": "bi bi-filetype-tsx",
  "redux": "bi bi-arrow-repeat",
  "tailwind": "bi bi-wind",
  "bootstrap": "bi bi-bootstrap-fill",
  "node": "bi bi-node-plus",
  "express": "bi bi-server",
  "mongo": "bi bi-database-fill",
  "mysql": "bi bi-table",
  "postgresql": "bi bi-grid-3x3",
  "python": "bi bi-filetype-py",
  "java": "bi bi-cup-hot-fill",
  "c++": "bi bi-code-slash",
  "golang": "bi bi-braces",
  "git": "bi bi-git",
  "github": "bi bi-github",
  "docker": "bi bi-box-seam",
  "aws": "bi bi-cloud-fill",
  "figma": "bi bi-vector-pen",
  "postman": "bi bi-send-check-fill",
  "firebase": "bi bi-fire",
  "graphql": "bi bi-bezier2",
  "linux": "bi bi-terminal-fill",
  "sass": "bi bi-filetype-scss",
  "webpack": "bi bi-layers-fill",
  "vite": "bi bi-lightning-fill",
  "php": "bi bi-filetype-php",
  "swift": "bi bi-phone-fill",
  "kotlin": "bi bi-phone-fill",
  "flutter": "bi bi-phone",
  "redis": "bi bi-database-fill-gear",
  "nginx": "bi bi-hdd-network",
  "kubernetes": "bi bi-gear-wide-connected",
};

const SKILL_ACCENTS = [
  "#6366f1", "#8b5cf6", "#06b6d4", "#0ea5e9", "#10b981",
  "#f59e0b", "#f43f5e", "#6366f1", "#a78bfa", "#22d3ee",
  "#34d399", "#fb923c", "#818cf8", "#2dd4bf", "#c084fc",
];

function getSkillIcon(skill) {
  if (skill.icon && skill.icon.trim()) return skill.icon.trim();
  const lowerName = (skill.name || "").toLowerCase();
  for (const [key, cls] of Object.entries(SKILL_ICON_MAP)) {
    if (lowerName.includes(key)) return cls;
  }
  return "bi bi-stars";
}

function getAccent(index) {
  return SKILL_ACCENTS[index % SKILL_ACCENTS.length];
}

/* =========================================================================
   THREE.JS CANVAS: 3D FLOATING BOOKS & KNOWLEDGE CONSTELLATION
   ========================================================================= */
function SkillsThreeCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 800;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.set(0, 0, 24);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Ambient & Directional Lights for 3D Books
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x6366f1, 2.0);
    dirLight1.position.set(15, 20, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x06b6d4, 1.5);
    dirLight2.position.set(-15, -10, 8);
    scene.add(dirLight2);

    // --- 1. FLOATING 3D BOOKS (Multiple books floating across depths) ---
    const booksGroup = new THREE.Group();
    scene.add(booksGroup);

    const bookColors = [0x4f46e5, 0x6366f1, 0x8b5cf6, 0x0ea5e9, 0x7c3aed, 0x3b82f6, 0x06b6d4];
    const bookGeom = new THREE.BoxGeometry(1.6, 2.2, 0.38);
    const pagesMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.6,
      metalness: 0.1,
    });

    const bookObjects = [];
    const bookCount = 9;

    for (let i = 0; i < bookCount; i++) {
      const coverColor = bookColors[i % bookColors.length];
      const coverMat = new THREE.MeshStandardMaterial({
        color: coverColor,
        roughness: 0.35,
        metalness: 0.25,
      });

      // Box materials: [right, left, top, bottom, front, back]
      // Pages on right, top, bottom; covers on front, back, and spine (left)
      const materials = [
        pagesMat,   // right (pages edge)
        coverMat,   // left (spine)
        pagesMat,   // top (pages edge)
        pagesMat,   // bottom (pages edge)
        coverMat,   // front cover
        coverMat,   // back cover
      ];

      const book = new THREE.Mesh(bookGeom, materials);

      // Distribute in a wide curved arc behind/around cards
      const angle = (i / bookCount) * Math.PI * 2;
      const radiusX = 14 + (i % 3) * 3;
      const radiusY = 7 + (i % 2) * 2.5;

      book.position.x = Math.cos(angle) * radiusX;
      book.position.y = Math.sin(angle) * radiusY + (Math.sin(i * 1.5) * 3);
      book.position.z = -4 + (Math.sin(i * 2) * 6);

      book.rotation.x = Math.random() * Math.PI;
      book.rotation.y = Math.random() * Math.PI;
      book.rotation.z = Math.random() * 0.5;

      const scale = 0.85 + Math.random() * 0.45;
      book.scale.set(scale, scale, scale);

      // Floating properties
      bookObjects.push({
        mesh: book,
        baseY: book.position.y,
        rotSpeedX: (Math.random() - 0.5) * 0.008 + 0.004,
        rotSpeedY: (Math.random() - 0.5) * 0.012 + 0.006,
        rotSpeedZ: (Math.random() - 0.5) * 0.006,
        floatSpeed: 0.0015 + Math.random() * 0.0015,
        floatOffset: Math.random() * Math.PI * 2,
      });

      booksGroup.add(book);
    }

    // --- 2. KNOWLEDGE NODES & CONSTELLATION LINES ---
    const nodeCount = 36;
    const nodeGeo = new THREE.SphereGeometry(0.14, 8, 8);
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x818cf8 });
    const nodesGroup = new THREE.Group();
    scene.add(nodesGroup);

    const nodePositions = [];
    for (let i = 0; i < nodeCount; i++) {
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      const nx = (Math.random() - 0.5) * 36;
      const ny = (Math.random() - 0.5) * 22;
      const nz = (Math.random() - 0.5) * 14 - 3;
      node.position.set(nx, ny, nz);
      nodesGroup.add(node);
      nodePositions.push(new THREE.Vector3(nx, ny, nz));
    }

    // Connect close nodes with lines
    const linePositions = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = nodePositions[i].distanceTo(nodePositions[j]);
        if (dist < 7.5) {
          linePositions.push(
            nodePositions[i].x, nodePositions[i].y, nodePositions[i].z,
            nodePositions[j].x, nodePositions[j].y, nodePositions[j].z
          );
        }
      }
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.22,
    });
    const constellationLines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(constellationLines);

    // --- 3. AMBIENT PARTICLES (Star Field / Tech Dust) ---
    const starCount = 450;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 50;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 35;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 25 - 5;

      const isCyan = Math.random() > 0.6;
      starColors[i * 3] = isCyan ? 0.05 : 0.42;
      starColors[i * 3 + 1] = isCyan ? 0.75 : 0.45;
      starColors[i * 3 + 2] = 0.95;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);

    // --- 4. MOUSE PARALLAX & ANIMATION ---
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 0;

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
      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Camera lerp
      targetCameraX = mouseX * 2.5;
      targetCameraY = mouseY * 1.5;
      camera.position.x += (targetCameraX - camera.position.x) * 0.04;
      camera.position.y += (targetCameraY - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      // Books floating & rotating
      bookObjects.forEach((b) => {
        b.mesh.rotation.x += b.rotSpeedX;
        b.mesh.rotation.y += b.rotSpeedY;
        b.mesh.rotation.z += b.rotSpeedZ;
        b.mesh.position.y = b.baseY + Math.sin(elapsedTime * 1.5 + b.floatOffset) * 0.7;
      });

      // Slowly rotate books group and constellation
      booksGroup.rotation.y = elapsedTime * 0.03;
      nodesGroup.rotation.y = -elapsedTime * 0.015;
      constellationLines.rotation.y = -elapsedTime * 0.015;
      starPoints.rotation.y = elapsedTime * 0.01;

      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || 800;
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
      bookGeom.dispose();
      pagesMat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="sk-three-bg"
      aria-hidden="true"
    />
  );
}

/* =========================================================================
   SKILL MARQUEE CHIPS
   ========================================================================= */
function SkillIconMarquee({ skills }) {
  const items = [...skills, ...skills];
  return (
    <div className="sk-marquee-outer" aria-hidden="true">
      <div className="sk-marquee-track">
        {items.map((skill, i) => {
          const iconClass = getSkillIcon(skill);
          const accent = getAccent(i % skills.length);
          return (
            <div key={i} className="sk-marquee-chip" style={{ "--chip-accent": accent }}>
              <span className="sk-marquee-icon-wrap"><i className={iconClass} /></span>
              <span className="sk-marquee-label">{skill.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================================
   DIFFERENT THREE.JS 3D MINIATURE PER SKILL CARD
   Types (index % 8):
     0 -> 3D Mini Book / Codex
     1 -> 3D Quantum Atomic Orbit Core
     2 -> 3D Cyber Tesseract Cube
     3 -> 3D Faceted Crystal Octahedron
     4 -> 3D Iridescent Torus Energy Ring
     5 -> 3D Geodesic Icosahedron Core
     6 -> 3D Double Helix Segment
     7 -> 3D Pyramidal Tetrahedral Star
   ========================================================================= */
function SkillCard3D({ typeIndex = 0, accent = "#6366f1" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 54;
    const height = container.clientHeight || 54;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 50);
    camera.position.z = 3.6;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);
    } catch {
      return;
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(4, 5, 4);
    scene.add(dirLight);

    const group = new THREE.Group();
    scene.add(group);

    const disposables = [];
    const t = typeIndex % 8;
    const accentColor = new THREE.Color(accent);

    if (t === 0) {
      // 0: 3D Mini Book
      const bookGeo = new THREE.BoxGeometry(1.2, 1.55, 0.28);
      const coverMat = new THREE.MeshStandardMaterial({
        color: accentColor,
        metalness: 0.5,
        roughness: 0.25,
        emissive: accentColor,
        emissiveIntensity: 0.35,
      });
      const pagesMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6 });
      const book = new THREE.Mesh(bookGeo, [pagesMat, coverMat, pagesMat, pagesMat, coverMat, coverMat]);
      group.add(book);
      disposables.push(bookGeo, coverMat, pagesMat);

    } else if (t === 1) {
      // 1: Quantum Atom (Nucleus + 2 Orbits)
      const nucGeo = new THREE.SphereGeometry(0.38, 16, 16);
      const nucMat = new THREE.MeshStandardMaterial({
        color: accentColor,
        emissive: accentColor,
        emissiveIntensity: 0.6,
        roughness: 0.2,
      });
      const nuc = new THREE.Mesh(nucGeo, nucMat);
      group.add(nuc);

      const rGeo = new THREE.TorusGeometry(0.9, 0.04, 12, 32);
      const rMat = new THREE.MeshBasicMaterial({ color: accentColor });
      const r1 = new THREE.Mesh(rGeo, rMat);
      r1.rotation.x = Math.PI / 3;
      const r2 = new THREE.Mesh(rGeo, rMat);
      r2.rotation.y = Math.PI / 3;
      group.add(r1);
      group.add(r2);
      disposables.push(nucGeo, nucMat, rGeo, rMat);

    } else if (t === 2) {
      // 2: Cyber Tesseract Cube
      const cubeGeo = new THREE.BoxGeometry(1.0, 1.0, 1.0);
      const cubeMat = new THREE.MeshStandardMaterial({
        color: accentColor,
        metalness: 0.8,
        roughness: 0.2,
        emissive: accentColor,
        emissiveIntensity: 0.3,
      });
      const cube = new THREE.Mesh(cubeGeo, cubeMat);
      group.add(cube);

      const wireGeo = new THREE.BoxGeometry(1.35, 1.35, 1.35);
      const wireMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.6 });
      const wire = new THREE.Mesh(wireGeo, wireMat);
      group.add(wire);
      disposables.push(cubeGeo, cubeMat, wireGeo, wireMat);

    } else if (t === 3) {
      // 3: Faceted Crystal Octahedron
      const octGeo = new THREE.OctahedronGeometry(1.05, 0);
      const octMat = new THREE.MeshStandardMaterial({
        color: accentColor,
        metalness: 0.85,
        roughness: 0.15,
        emissive: accentColor,
        emissiveIntensity: 0.45,
      });
      const oct = new THREE.Mesh(octGeo, octMat);
      group.add(oct);

      const ringGeo = new THREE.RingGeometry(1.25, 1.38, 24);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2.3;
      group.add(ring);
      disposables.push(octGeo, octMat, ringGeo, ringMat);

    } else if (t === 4) {
      // 4: Iridescent Torus Energy Ring
      const torGeo = new THREE.TorusGeometry(0.85, 0.25, 16, 36);
      const torMat = new THREE.MeshStandardMaterial({
        color: accentColor,
        metalness: 0.75,
        roughness: 0.2,
        emissive: accentColor,
        emissiveIntensity: 0.35,
      });
      const tor = new THREE.Mesh(torGeo, torMat);
      group.add(tor);
      disposables.push(torGeo, torMat);

    } else if (t === 5) {
      // 5: Geodesic Icosahedron Core
      const icoGeo = new THREE.IcosahedronGeometry(0.95, 0);
      const icoMat = new THREE.MeshStandardMaterial({
        color: accentColor,
        metalness: 0.7,
        roughness: 0.3,
        wireframe: true,
      });
      const ico = new THREE.Mesh(icoGeo, icoMat);
      group.add(ico);

      const coreGeo = new THREE.SphereGeometry(0.45, 16, 16);
      const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const core = new THREE.Mesh(coreGeo, coreMat);
      group.add(core);
      disposables.push(icoGeo, icoMat, coreGeo, coreMat);

    } else if (t === 6) {
      // 6: Double Helix Segment
      for (let i = 0; i < 4; i++) {
        const rungGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.2, 8);
        const rungMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const rung = new THREE.Mesh(rungGeo, rungMat);
        rung.position.y = (i - 1.5) * 0.45;
        rung.rotation.z = Math.PI / 2;
        rung.rotation.y = (i / 4) * Math.PI;
        group.add(rung);

        const beadGeo = new THREE.SphereGeometry(0.14, 8, 8);
        const beadMat = new THREE.MeshStandardMaterial({ color: accentColor, emissive: accentColor, emissiveIntensity: 0.5 });
        const b1 = new THREE.Mesh(beadGeo, beadMat);
        b1.position.set(Math.cos(rung.rotation.y) * 0.6, rung.position.y, Math.sin(rung.rotation.y) * 0.6);
        const b2 = new THREE.Mesh(beadGeo, beadMat);
        b2.position.set(-Math.cos(rung.rotation.y) * 0.6, rung.position.y, -Math.sin(rung.rotation.y) * 0.6);
        group.add(b1);
        group.add(b2);
        disposables.push(rungGeo, rungMat, beadGeo, beadMat);
      }

    } else {
      // 7: Pyramidal Tetrahedral Star
      const tetGeo = new THREE.TetrahedronGeometry(1.05, 0);
      const tetMat = new THREE.MeshStandardMaterial({
        color: accentColor,
        metalness: 0.8,
        roughness: 0.2,
        emissive: accentColor,
        emissiveIntensity: 0.4,
      });
      const tet1 = new THREE.Mesh(tetGeo, tetMat);
      group.add(tet1);

      const tet2 = new THREE.Mesh(tetGeo, tetMat);
      tet2.rotation.x = Math.PI;
      group.add(tet2);
      disposables.push(tetGeo, tetMat);
    }

    let reqId;
    const miniStartTime = performance.now();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - miniStartTime) * 0.001;

      group.rotation.y += 0.035;
      group.rotation.x = Math.sin(elapsed * 2) * 0.16;
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
  }, [typeIndex, accent]);

  return (
    <div
      ref={mountRef}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      aria-hidden="true"
    />
  );
}

/* =========================================================================
   SKILL CARD COMPONENT (3D FLIP + 3D MINIATURE CANVAS)
   ========================================================================= */
function SkillCard({ skill, index, accent }) {
  const [flipped, setFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const iconClass = getSkillIcon(skill);

  const getProfLabel = (lvl) => {
    if (lvl >= 90) return { label: "Mastery", stars: 5 };
    if (lvl >= 80) return { label: "Advanced", stars: 4 };
    if (lvl >= 70) return { label: "Proficient", stars: 3 };
    return { label: "Familiar", stars: 2 };
  };

  const { label, stars } = getProfLabel(skill.level || 75);
  const circumference = 201;
  const offset = circumference - (circumference * (skill.level || 75)) / 100;

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches) {
      setFlipped(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches) {
      setFlipped(false);
    }
  };

  return (
    <div
      className="sk-card-wrap"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => setFlipped((f) => !f)}
      onKeyDown={(e) => e.key === "Enter" && setFlipped((f) => !f)}
      style={{ "--accent": accent, "--delay": `${(index % 8) * 45}ms` }}
      role="button"
      tabIndex={0}
      aria-label={`${skill.name}: ${skill.level}%`}
    >
      <div className={`sk-card-inner${flipped ? " is-flipped" : ""}`}>
        {/* FRONT FACE */}
        <div className="sk-face sk-face--front">
          <div className="sk-conic-border" />
          <div className="sk-halo" />

          <div className="sk-icon-ring">
            <div className="sk-icon-sphere">
              {isHovered ? (
                <SkillCard3D typeIndex={index} accent={accent} />
              ) : (
                <i className={iconClass} />
              )}
            </div>
            <div className="sk-orbit-ring" />
          </div>

          <h3 className="sk-card-name">{skill.name}</h3>

          <div className="sk-radial">
            <svg viewBox="0 0 80 80" style={{ transform: "rotate(-90deg)", width: "100%", height: "100%" }}>
              <circle cx="40" cy="40" r="32" fill="none" stroke="var(--sk-track)" strokeWidth="4.5" />
              <circle
                cx="40"
                cy="40"
                r="32"
                fill="none"
                stroke={accent}
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ transition: "stroke-dashoffset 1.2s ease" }}
              />
            </svg>
            <span className="sk-pct" style={{ color: accent }}>{skill.level}%</span>
          </div>

          <span className="sk-flip-hint"><i className="bi bi-arrow-repeat" /> details</span>
        </div>

        {/* BACK FACE */}
        <div className="sk-face sk-face--back">
          <div className="sk-back-header">
            <div className="sk-back-icon">
              {flipped ? (
                <SkillCard3D typeIndex={index} accent={accent} />
              ) : (
                <i className={iconClass} style={{ color: accent }} />
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h4 className="sk-back-name">{skill.name}</h4>
              <span className="sk-badge" style={{ color: accent, borderColor: accent + "55", background: accent + "18" }}>
                {label}
              </span>
            </div>
          </div>

          <div className="sk-stars">
            {[1, 2, 3, 4, 5].map((s) => (
              <i
                key={s}
                className={`bi ${s <= stars ? "bi-star-fill" : "bi-star"}`}
                style={{ color: s <= stars ? accent : "var(--sk-star-empty)" }}
              />
            ))}
          </div>

          <div className="sk-bar-wrap">
            <div
              className="sk-bar"
              style={{ width: `${skill.level}%`, background: `linear-gradient(90deg,${accent},${accent}88)` }}
            />
          </div>

          <div className="sk-bar-pct" style={{ color: accent }}>{skill.level}%</div>

          <p className="sk-desc">
            {skill.description || `Production-grade experience with ${skill.name}. Applied across real-world projects and full-stack solutions.`}
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   3D SKILL CRAWLER TRACK & TECHNICAL EXPERTISE MATRIX (VERTICAL CIRCULAR 3D)
   ========================================================================= */
const DEFAULT_SKILLS_DECK = [
  {
    name: 'Front End Development',
    percentage: '92%',
    level: 92,
    color: 'from-blue-500 to-cyan-400',
    gradient: 'linear-gradient(90deg, #3b82f6, #06b6d4)',
    icon: 'bi-window-stack',
    category: 'Frontend',
    status: 'PRODUCTION',
    description: 'High-performance UI engineering using Next.js 15, React 19, TypeScript, and Tailwind CSS. Specialized in fluid animations, SSR optimization, and zero layout shift architectures.'
  },
  {
    name: 'Node.js Backend',
    percentage: '85%',
    level: 85,
    color: 'from-green-500 to-emerald-400',
    gradient: 'linear-gradient(90deg, #10b981, #059669)',
    icon: 'bi-server',
    category: 'Backend',
    status: 'OPTIMIZED',
    description: 'Scalable server microservices, high-throughput REST/GraphQL APIs with Express, JWT authentication pipelines, asynchronous task queues, and resilient error recovery.'
  },
  {
    name: 'UI/UX Visual Design',
    percentage: '88%',
    level: 88,
    color: 'from-purple-500 to-pink-400',
    gradient: 'linear-gradient(90deg, #a855f7, #ec4899)',
    icon: 'bi-palette-fill',
    category: 'Design',
    status: 'VERIFIED',
    description: 'Crafting intuitive digital experiences with Figma, 3D volumetric design, scalable design systems, interactive micro-interactions, and accessible WCAG 2.1 compliance.'
  },
  {
    name: 'Database Architecture',
    percentage: '80%',
    level: 80,
    color: 'from-amber-500 to-orange-400',
    gradient: 'linear-gradient(90deg, #f59e0b, #ea580c)',
    icon: 'bi-database-fill-gear',
    category: 'Database',
    status: 'HIGH AVAIL',
    description: 'Relational & document database schemas using MongoDB, PostgreSQL, and Redis caching. Index optimization, ACID transactions, query tuning, and replication.'
  },
  {
    name: 'Cloud & DevOps CI/CD',
    percentage: '84%',
    level: 84,
    color: 'from-cyan-500 to-blue-600',
    gradient: 'linear-gradient(90deg, #06b6d4, #2563eb)',
    icon: 'bi-cloud-check-fill',
    category: 'DevOps',
    status: 'SCALED',
    description: 'Automated CI/CD workflows, Docker container deployment, AWS cloud infrastructure, Nginx reverse proxy configuration, SSL automation, and zero-downtime rollouts.'
  },
  {
    name: 'Next.js & React Core',
    percentage: '94%',
    level: 94,
    color: 'from-indigo-500 to-purple-500',
    gradient: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
    icon: 'bi-lightning-charge-fill',
    category: 'Architecture',
    status: 'ENTERPRISE',
    description: 'Deep mastery of React Server Components (RSC), App Router conventions, dynamic streaming, Redux Toolkit state synchronization, and sub-second First Contentful Paint.'
  }
];

export function LeftAligned3DPortfolio({ dynamicSkills = [] }) {
  const [isPaused, setIsPaused] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [flippedIndex, setFlippedIndex] = useState(null);

  // Combine default deck with dynamic skills from Redux/Backend if available
  const deck = useMemo(() => {
    if (dynamicSkills && dynamicSkills.length >= 4) {
      return dynamicSkills.slice(0, 6).map((s, idx) => ({
        name: s.name,
        percentage: `${s.level || 85}%`,
        level: s.level || 85,
        color: DEFAULT_SKILLS_DECK[idx % DEFAULT_SKILLS_DECK.length].color,
        gradient: DEFAULT_SKILLS_DECK[idx % DEFAULT_SKILLS_DECK.length].gradient,
        icon: getSkillIcon(s),
        category: s.category || "Fullstack",
        status: (s.level || 85) >= 90 ? "ENTERPRISE" : "PRODUCTION",
        description: s.description && s.description.trim()
          ? s.description.trim()
          : (DEFAULT_SKILLS_DECK[idx % DEFAULT_SKILLS_DECK.length].description || `Production-grade engineering with ${s.name}. Applied across real-world scalable architectures and modern full-stack workflows.`),
      }));
    }
    return DEFAULT_SKILLS_DECK;
  }, [dynamicSkills]);

  const numCards = deck.length;
  const angleStep = 360 / numCards;

  return (
    <div className="sk-matrix-dashboard mb-5" data-aos="fade-up">
      {/* Sci-Fi Ambient Glows */}
      <div className="sk-matrix-glow sk-matrix-glow--cyan" />
      <div className="sk-matrix-glow sk-matrix-glow--purple" />

      <div className="sk-matrix-content">
        {/* Left Column: Tech Readouts & Headings */}
        <div className="sk-matrix-left">
          {/* Top-left Glowing Sci-Fi System Readout HUD */}
          <div className="sk-hud-badge">
            <div className="sk-hud-led" />
            <div className="sk-hud-text">
              <span className="sk-hud-label">SYSTEM OVERVIEW:</span> Skill Matrix V3.0
            </div>
            <span className="sk-hud-status">[ONLINE]</span>
          </div>

          <div className="sk-hud-telemetry">
            <div className="sk-telemetry-item">
              <span className="sk-telemetry-key">UPTIME:</span>
              <span className="sk-telemetry-val">99.98%</span>
            </div>
            <div className="sk-telemetry-sep">|</div>
            <div className="sk-telemetry-item">
              <span className="sk-telemetry-key">THROUGHPUT:</span>
              <span className="sk-telemetry-val">1.2 GB/s</span>
            </div>
            <div className="sk-telemetry-sep">|</div>
            <div className="sk-telemetry-item">
              <span className="sk-telemetry-key">ORBIT:</span>
              <span className="sk-telemetry-val">VERTICAL CIRCULAR 3D</span>
            </div>
          </div>

          <h2 className="sk-matrix-title">
            Technical Expertise Matrix
          </h2>

          <p className="sk-matrix-desc">
            A dynamic, real-time look into my core engineering and creative capabilities.
            Hover over any card in the vertical circular orbit to pause and flip it to inspect detailed architectural descriptions.
          </p>

          {/* Interactive Micro Telemetry & Controls */}
          <div className="sk-matrix-controls">
            <button
              type="button"
              className={`sk-ctrl-btn ${isPaused ? "active" : ""}`}
              onClick={() => setIsPaused(!isPaused)}
              title={isPaused ? "Resume Orbit" : "Pause Orbit"}
            >
              <i className={`bi ${isPaused ? "bi-play-fill" : "bi-pause-fill"}`} />
              <span>{isPaused ? "RESUME ORBIT" : "PAUSE ORBIT"}</span>
            </button>

            <button
              type="button"
              className="sk-ctrl-btn"
              onClick={() => setSpeedMultiplier(speedMultiplier === 1 ? 1.75 : 1)}
              title="Toggle Speed"
            >
              <i className="bi bi-speedometer2" />
              <span>{speedMultiplier > 1 ? "2x SPEED" : "1x SPEED"}</span>
            </button>

            <span className="sk-matrix-badge-chip">
              <i className="bi bi-cpu-fill" /> {deck.length} ACTIVE ENGINES
            </span>
          </div>
        </div>

        {/* Right Column: Single Vertical Circular Motion 3D Carousel with Flipping Cards */}
        <div className="sk-matrix-right">
          <div className="sk-crawler-rack-header">
            <div className="sk-rack-label">
              <span className="sk-rack-dot" />
              CONVEYOR BAY 01 // VERTICAL CIRCULAR ORBIT
            </div>
            <div className="sk-rack-tag">HOVER TO FLIP</div>
          </div>

          <div
            className="sk-wheel-viewport"
            style={{ perspective: "1200px" }}
          >
            {/* Ambient vertical neon rails */}
            <div className="sk-crawler-rail sk-crawler-rail--left" />
            <div className="sk-crawler-rail sk-crawler-rail--right" />

            {/* THE SINGLE 3D VERTICAL CIRCULAR WHEEL */}
            <div
              className={`sk-circular-wheel ${isPaused || hoveredIndex !== null ? "is-paused" : ""}`}
              style={{
                animationDuration: `${20 / speedMultiplier}s`
              }}
            >
              {deck.map((skill, index) => {
                const isFlipped = flippedIndex === index || hoveredIndex === index;
                return (
                  <div
                    key={`wheel-slot-${index}`}
                    className="sk-wheel-slot"
                    style={{
                      "--slot-angle": `${index * angleStep}deg`,
                    }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => setFlippedIndex(flippedIndex === index ? null : index)}
                  >
                    {/* Counter-rotation to keep card upright in 3D vertical circle */}
                    <div
                      className="sk-wheel-counter"
                      style={{
                        animationDuration: `${20 / speedMultiplier}s`
                      }}
                    >
                      {/* 3D Flip Card Container */}
                      <div className={`sk-flip-card ${isFlipped ? "is-flipped" : ""}`}>
                        <div className="sk-flip-card-inner">
                          {/* ── FRONT FACE ── */}
                          <div className="sk-flip-face sk-flip-face--front">
                            <div className="sk-card-topline">
                              <div className="sk-card-name-group">
                                <div className="sk-front-icon-box">
                                  <i className={`bi ${skill.icon || "bi-layers-fill"}`} />
                                </div>
                                <div className="sk-front-title-wrap">
                                  <span className="sk-card-title">{skill.name}</span>
                                  <span className="sk-card-sub-cat">{skill.category}</span>
                                </div>
                              </div>
                              <div className="sk-card-ring-pill">
                                <span className="sk-card-pct-text">{skill.percentage}</span>
                              </div>
                            </div>

                            {/* Volumetric Depth Progress Bar */}
                            <div className="sk-crawler-bar-recess">
                              <div
                                className="sk-crawler-bar-fill"
                                style={{
                                  width: skill.percentage,
                                  background: skill.gradient || "linear-gradient(90deg, #3b82f6, #06b6d4)",
                                }}
                              />
                            </div>

                            <div className="sk-card-footline">
                              <span className="sk-card-tier">
                                <i className="bi bi-shield-check me-1" />{skill.status}
                              </span>
                              <span className="sk-card-flip-prompt">
                                <i className="bi bi-arrow-repeat me-1" />Hover to flip
                              </span>
                            </div>
                          </div>

                          {/* ── BACK FACE (DESCRIPTION) ── */}
                          <div className="sk-flip-face sk-flip-face--back">
                            <div className="sk-back-topline">
                              <div className="sk-back-title-group">
                                <i className={`bi ${skill.icon || "bi-stars"} sk-back-icon-mini`} />
                                <span className="sk-back-title">{skill.name}</span>
                              </div>
                              <span className="sk-back-pct-badge">{skill.percentage}</span>
                            </div>

                            {/* The Description */}
                            <p className="sk-back-description">
                              {skill.description}
                            </p>

                            <div className="sk-back-footline">
                              <span className="sk-back-badge-tier">{skill.status}</span>
                              <span className="sk-back-flip-hint">
                                <i className="bi bi-check2-circle me-1" />Production Ready
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   MAIN SKILLS SECTION COMPONENT
   ========================================================================= */
export default function Skills() {
  const SkillStateData = useSelector((state) => state.SkillStateData);
  const dispatch = useDispatch();
  const loading = !SkillStateData || SkillStateData.length === 0;
  const [activeTab, setActiveTab] = useState("all");
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (!SkillStateData || !SkillStateData.length) dispatch(getSkill());
    AOS.init({ duration: 800, once: false, mirror: true });
  }, [dispatch, SkillStateData]);

  const activeSkills = useMemo(() =>
    Array.isArray(SkillStateData) ? SkillStateData.filter((x) => x.active) : [],
    [SkillStateData]
  );

  const categorizedSkills = useMemo(() => {
    if (activeTab === "all") return activeSkills;
    if (activeTab === "frontend") return activeSkills.filter((s) => /react|next|vue|html|css|javascript|typescript|redux|tailwind|bootstrap|ui|ux|frontend|sass|angular|svelte/i.test(s.name + " " + (s.description || "")));
    if (activeTab === "backend") return activeSkills.filter((s) => /node|express|mongo|sql|database|api|backend|python|java|golang|server|django|flask|laravel|php|graphql|redis/i.test(s.name + " " + (s.description || "")));
    if (activeTab === "tools") return activeSkills.filter((s) => /git|github|docker|aws|figma|postman|vite|webpack|linux|cloud|tools|kubernetes|nginx|firebase|ci|cd/i.test(s.name + " " + (s.description || "")));
    return activeSkills;
  }, [activeSkills, activeTab]);

  function handleTabChange(id) {
    if (id === activeTab) return;
    setAnimating(true);
    setTimeout(() => { setActiveTab(id); setAnimating(false); }, 220);
  }

  // Summary Metrics for Stats Row
  const stats = useMemo(() => {
    const total = activeSkills.length;
    if (!total) return { total: 0, mastered: 0, avg: 0 };
    const mastered = activeSkills.filter((s) => (s.level || 0) >= 85).length;
    const avg = Math.round(activeSkills.reduce((acc, s) => acc + (s.level || 0), 0) / total);
    return { total, mastered, avg };
  }, [activeSkills]);

  const TABS = [
    { id: "all", label: "All Skills", icon: "bi-grid-3x3-gap-fill", count: activeSkills.length },
    { id: "frontend", label: "Frontend", icon: "bi-layers-fill", count: null },
    { id: "backend", label: "Backend & DB", icon: "bi-server", count: null },
    { id: "tools", label: "Tools & Cloud", icon: "bi-cloud-fill", count: null },
  ];

  return (
    <section id="skills" className="sk-section">
      <div className="container" style={{ position: "relative", zIndex: 1 }}>

        {/* Section Header */}
        <div className="text-center" data-aos="fade-up">
          <span className="section-badge">
            <i className="bi bi-book-half" /> Knowledge &amp; Proficiency
          </span>
          <h2 className="sk-title">
            Skills &amp; <span className="sk-gradient-text">Technologies</span>
          </h2>
          <div className="sk-title-bar" />
          <p className="sk-subtitle">
            Interactive 3D knowledge universe — hover any card to inspect technical mastery and production experience.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="sk-tabs mb-4" data-aos="fade-up" data-aos-delay="60">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`sk-tab${activeTab === tab.id ? " active" : ""}`}
              onClick={() => handleTabChange(tab.id)}
            >
              <i className={`bi ${tab.icon}`} />
              <span>{tab.label}</span>
              {tab.count !== null && <span className="sk-tab-count">{tab.count}</span>}
              {activeTab === tab.id && <span className="sk-tab-ind" />}
            </button>
          ))}
        </div>

        {/* Single 3D Vertical Circular Wheel & Technical Expertise Matrix */}
        <LeftAligned3DPortfolio dynamicSkills={categorizedSkills.length > 0 ? categorizedSkills : activeSkills} />

        {/* Skills Cards Grid */}


        {/* Stats Summary Bar */}
        {!loading && activeSkills.length > 0 && (
          <div className="sk-stats-bar" data-aos="fade-up" data-aos-delay="120">
            <div className="sk-stat-box">
              <span className="sk-stat-number">{stats.total}+</span>
              <span className="sk-stat-text">Technologies Covered</span>
            </div>
            <div className="sk-stat-divider" />
            <div className="sk-stat-box">
              <span className="sk-stat-number">{stats.mastered}</span>
              <span className="sk-stat-text">Advanced Mastery (85%+)</span>
            </div>
            <div className="sk-stat-divider" />
            <div className="sk-stat-box">
              <span className="sk-stat-number">{stats.avg}%</span>
              <span className="sk-stat-text">Average Proficiency</span>
            </div>
          </div>
        )}

      </div>

      <style>{`
        .sk-section {
          position: relative;
          padding: 100px 0 80px;
          background: transparent !important;
          background-color: transparent !important;
        }



        .sk-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(1.9rem, 4.5vw, 3rem);
          font-weight: 900;
          color: var(--text-color);
          margin: 12px 0 8px;
          line-height: 1.15;
          letter-spacing: -.02em;
        }
        .sk-gradient-text {
          background: linear-gradient(135deg, #6366f1 0%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .sk-title-bar {
          width: 72px;
          height: 3px;
          background: linear-gradient(90deg, #6366f1, #06b6d4);
          border-radius: 99px;
          margin: 14px auto 18px;
          animation: skBarGrow .9s cubic-bezier(.34, 1.56, .64, 1) forwards;
        }
        @keyframes skBarGrow { from{width:0;opacity:0} to{width:72px;opacity:1} }
        .sk-subtitle {
          font-size: .97rem;
          color: var(--text-muted);
          max-width: 520px;
          margin: 0 auto 36px;
          line-height: 1.7;
        }

        /* MARQUEE */
        .sk-marquee-outer {
          overflow: hidden;
          margin: 0 -16px 44px;
          mask: linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%);
          -webkit-mask: linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%);
        }
        .sk-marquee-track {
          display: flex;
          gap: 12px;
          width: max-content;
          animation: skMarquee 32s linear infinite;
        }
        .sk-marquee-track:hover { animation-play-state: paused; }
        @keyframes skMarquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .sk-marquee-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 14px 7px 8px;
          border-radius: 99px;
          background: var(--card-bg, rgba(255,255,255,.05));
          border: 1px solid color-mix(in srgb, var(--chip-accent) 22%, transparent);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          white-space: nowrap;
          transition: transform .25s cubic-bezier(.34, 1.56, .64, 1), box-shadow .25s;
          cursor: default;
          flex-shrink: 0;
        }
        .sk-marquee-chip:hover {
          transform: translateY(-3px) scale(1.04);
          box-shadow: 0 6px 20px color-mix(in srgb, var(--chip-accent) 25%, transparent);
        }
        .sk-marquee-icon-wrap {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: color-mix(in srgb, var(--chip-accent) 18%, transparent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          color: var(--chip-accent);
          flex-shrink: 0;
        }
        .sk-marquee-label {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: .8rem;
          font-weight: 600;
          color: var(--text-color);
        }

        /* TABS */
        .sk-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          justify-content: center;
          margin-bottom: 36px;
        }
        .sk-tab {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 18px;
          border-radius: 99px;
          border: 1px solid var(--card-border, rgba(120,120,160,.18));
          background: var(--card-bg, rgba(255,255,255,.05));
          color: var(--text-muted);
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: .86rem;
          font-weight: 600;
          cursor: pointer;
          transition: all .25s cubic-bezier(.34, 1.56, .64, 1);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }
        .sk-tab i { font-size: .82rem; transition: transform .3s; }
        .sk-tab:hover {
          border-color: var(--primary-color);
          color: var(--text-color);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        .sk-tab.active {
          background: var(--primary-gradient-subtle, rgba(99,102,241,.14));
          border-color: var(--primary-color);
          color: var(--text-color);
          box-shadow: 0 4px 16px rgba(var(--accent-rgb), 0.25);
        }
        .sk-tab.active i { transform: rotate(15deg) scale(1.12); color: var(--primary-color); }
        .sk-tab-count {
          background: rgba(var(--accent-rgb), 0.15);
          color: var(--primary-color);
          font-size: .7rem;
          font-weight: 700;
          padding: 1px 7px;
          border-radius: 99px;
        }
        .sk-tab-ind {
          position: absolute;
          bottom: 0;
          left: 10%;
          width: 80%;
          height: 2px;
          background: linear-gradient(90deg, #6366f1, #06b6d4);
          border-radius: 99px;
          animation: indIn .3s ease forwards;
        }
        @keyframes indIn { from{opacity:0;transform:scaleX(0)} to{opacity:1;transform:scaleX(1)} }

        /* GRID */
        .sk-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(155px, 190px));
          gap: 18px;
          justify-content: center;
          align-items: center;
          margin: 0 auto;
          transition: opacity .22s ease, transform .22s ease;
        }
        .sk-grid.grid-exit { opacity: 0; transform: translateY(10px) scale(.98); }
        .sk-grid.grid-enter { opacity: 1; transform: none; }
        .sk-card-holder { width: 100%; max-width: 190px; justify-self: center; }
        .sk-card-holder.sk-last-odd { justify-self: center; }
        .sk-skel {
          border-radius: 18px;
          padding: 28px 16px 22px;
          text-align: center;
          min-height: 210px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .sk-empty {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 20px;
          color: var(--text-muted);
        }
        .sk-empty i { font-size: 2.8rem; margin-bottom: 14px; display: block; opacity: .35; }

        /* 3D FLIP CARD */
        .sk-card-wrap {
          perspective: 900px;
          cursor: pointer;
          animation: skCardIn .5s cubic-bezier(.34, 1.56, .64, 1) both;
          animation-delay: var(--delay, 0ms);
        }
        @keyframes skCardIn { from{opacity:0;transform:translateY(28px) scale(.9)} to{opacity:1;transform:none} }
        .sk-card-inner {
          position: relative;
          width: 100%;
          padding-top: 115%;
          transform-style: preserve-3d;
          transition: transform .6s cubic-bezier(.34, 1.4, .64, 1);
          border-radius: 18px;
        }
        .sk-card-inner.is-flipped { transform: rotateY(180deg); }
        .sk-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 18px;
          padding: 18px 13px 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          overflow: hidden;
        }

        /* Front */
        .sk-face--front {
          background: var(--card-bg, rgba(255,255,255,.06));
          border: 1px solid var(--card-border, rgba(120,120,160,.14));
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          box-shadow: 0 4px 24px rgba(0,0,0,.12), inset 0 1px 0 rgba(255,255,255,.07);
          transition: box-shadow .3s, border-color .3s, transform .3s;
        }
        .sk-halo {
          position: absolute;
          top: -30%;
          left: 50%;
          transform: translateX(-50%);
          width: 120px;
          height: 120px;
          background: radial-gradient(circle, color-mix(in srgb, var(--accent) 30%, transparent) 0%, transparent 70%);
          pointer-events: none;
          opacity: 0.6;
        }

        @media(hover: hover) {
          .sk-card-wrap:hover .sk-face--front {
            border-color: color-mix(in srgb, var(--accent) 55%, transparent);
            box-shadow: 0 12px 40px rgba(0,0,0,.22), 0 0 0 1px color-mix(in srgb, var(--accent) 32%, transparent), inset 0 1px 0 rgba(255,255,255,.15);
            transform: translateY(-4px);
          }
          .sk-card-wrap:hover .sk-conic-border { opacity: .7; }
          .sk-card-wrap:hover .sk-icon-sphere {
            transform: translateY(-5px) scale(1.1) rotateZ(8deg);
            box-shadow: 0 8px 28px color-mix(in srgb, var(--accent) 38%, transparent);
          }
          .sk-card-wrap:hover .sk-orbit-ring {
            border-color: color-mix(in srgb, var(--accent) 55%, transparent);
            animation-duration: 2.5s;
          }
          .sk-card-wrap:hover .sk-flip-hint { opacity: .75; }
        }

        .sk-conic-border {
          position: absolute;
          inset: -1px;
          border-radius: 19px;
          background: conic-gradient(from 0deg, var(--accent, #6366f1), transparent 40%, var(--accent, #06b6d4), transparent 80%, var(--accent, #6366f1));
          opacity: 0;
          transition: opacity .35s;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          -webkit-mask-composite: destination-out;
          padding: 1px;
          animation: conRot 3.5s linear infinite;
          pointer-events: none;
        }
        @keyframes conRot { to{filter:hue-rotate(360deg)} }

        /* Icon sphere */
        .sk-icon-ring {
          position: relative;
          width: 58px;
          height: 58px;
          margin-bottom: 11px;
          flex-shrink: 0;
        }
        .sk-icon-sphere {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: color-mix(in srgb, var(--accent) 16%, var(--card-bg, rgba(255,255,255,.08)));
          border: 1.5px solid color-mix(in srgb, var(--accent) 40%, transparent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.45rem;
          color: var(--accent);
          transition: transform .4s cubic-bezier(.34, 1.56, .64, 1), box-shadow .3s;
          box-shadow: 0 2px 14px color-mix(in srgb, var(--accent) 18%, transparent);
        }
        .sk-orbit-ring {
          position: absolute;
          inset: -7px;
          border-radius: 50%;
          border: 1.5px dashed color-mix(in srgb, var(--accent) 24%, transparent);
          animation: orbitSpin 7s linear infinite;
          pointer-events: none;
        }
        @keyframes orbitSpin { to{transform:rotate(360deg)} }

        .sk-card-name {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: .82rem;
          font-weight: 800;
          color: var(--text-color);
          margin: 0 0 9px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }

        :root { --sk-track: rgba(120,120,160,.15); --sk-star-empty: rgba(120,120,160,.25); }
        [data-theme="light"] { --sk-track: rgba(100,100,140,.12); --sk-star-empty: rgba(100,100,140,.22); }

        .sk-radial { position: relative; width: 68px; height: 68px; flex-shrink: 0; }
        .sk-pct {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Mono', monospace;
          font-size: .76rem;
          font-weight: 700;
        }
        .sk-flip-hint {
          margin-top: 7px;
          font-size: .62rem;
          color: var(--text-muted);
          opacity: 0;
          transition: opacity .3s;
        }

        /* Back */
        .sk-face--back {
          transform: rotateY(180deg);
          background: var(--card-bg, rgba(15,16,30,.92));
          border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 8px 36px rgba(0,0,0,.35);
          justify-content: flex-start;
        }
        .sk-back-header {
          display: flex;
          align-items: center;
          gap: 9px;
          width: 100%;
          margin-bottom: 9px;
        }
        .sk-back-icon {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: color-mix(in srgb, var(--accent) 14%, transparent);
          border: 1px solid color-mix(in srgb, var(--accent) 28%, transparent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: .95rem;
          flex-shrink: 0;
        }
        .sk-back-name {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: .85rem;
          font-weight: 800;
          color: var(--text-color);
          margin: 0 0 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sk-badge {
          font-size: .58rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .06em;
          padding: 2px 7px;
          border-radius: 99px;
          display: inline-block;
          border: 1px solid;
        }
        .sk-stars {
          display: flex;
          gap: 3px;
          justify-content: flex-start;
          width: 100%;
          margin-bottom: 7px;
        }
        .sk-stars i { font-size: .75rem; }
        .sk-bar-wrap {
          width: 100%;
          height: 3.5px;
          background: var(--sk-track);
          border-radius: 99px;
          overflow: hidden;
          margin-bottom: 3px;
        }
        .sk-bar { height: 100%; border-radius: 99px; transition: width .8s ease; }
        .sk-bar-pct {
          font-family: 'DM Mono', monospace;
          font-size: .66rem;
          font-weight: 700;
          text-align: left;
          width: 100%;
          margin-bottom: 9px;
        }
        .sk-desc {
          font-size: .7rem;
          line-height: 1.6;
          color: var(--text-muted);
          text-align: left;
          margin: 0;
          flex: 1;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 5;
          -webkit-box-orient: vertical;
        }

        /* STATS BAR */
        .sk-stats-bar {
          display: flex;
          align-items: center;
          justify-content: space-around;
          margin: 50px auto 0;
          max-width: 820px;
          padding: 20px 28px;
          background: var(--card-bg, #13112a);
          border: 1px solid var(--card-border, rgba(120,120,160,.16));
          border-radius: 20px;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: var(--shadow-md);
        }
        [data-theme="light"] .sk-stats-bar,
        body.light .sk-stats-bar {
          background: #ffffff !important;
          border-color: rgba(99, 102, 241, 0.15) !important;
          box-shadow: 0 10px 30px rgba(99, 102, 241, 0.08) !important;
        }
        .sk-stat-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .sk-stat-number {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 1.85rem;
          font-weight: 800;
          background: var(--primary-gradient, linear-gradient(135deg, #6366f1, #06b6d4));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1.1;
        }
        .sk-stat-text {
          font-size: .8rem;
          color: var(--text-muted);
          margin-top: 4px;
        }
        .sk-stat-divider {
          width: 1px;
          height: 38px;
          background: var(--border-color, rgba(120,120,160,.2));
        }

        /* TABLET (576px to 991px) */
        @media(min-width: 576px) and (max-width: 991px) {
          .sk-section { padding: 80px 0 65px; }
          .sk-grid {
            grid-template-columns: repeat(auto-fill, minmax(148px, 176px));
            gap: 14px;
            max-width: 740px;
            margin: 0 auto;
            justify-content: center;
          }
          .sk-card-holder { max-width: 176px; }
          .sk-card-inner { padding-top: 118%; }
          .sk-face { padding: 15px 10px 12px; }
          .sk-icon-ring { width: 50px; height: 50px; margin-bottom: 8px; }
          .sk-icon-sphere { font-size: 1.25rem; }
          .sk-card-name { font-size: .8rem; margin-bottom: 7px; }
          .sk-radial { width: 60px; height: 60px; }
          .sk-pct { font-size: .72rem; }
          .sk-flip-hint { opacity: .65; font-size: .6rem; }
          .sk-face--back { padding: 13px 10px 10px; }
          .sk-back-header { margin-bottom: 7px; }
          .sk-back-icon { width: 28px; height: 28px; font-size: .85rem; }
          .sk-back-name { font-size: .8rem; }
          .sk-desc { font-size: .67rem; -webkit-line-clamp: 4; }
          .sk-tabs { gap: 8px; margin-bottom: 28px; }
          .sk-tab { padding: 8px 16px; font-size: .82rem; }
          .sk-stats-bar { padding: 16px 20px; }
          .sk-stat-number { font-size: 1.55rem; }
        }

        /* MOBILE (<576px) */
        @media(max-width: 575px) {
          .sk-section { padding: 60px 0 50px; }
          .sk-title { font-size: clamp(1.65rem, 5.5vw, 2.1rem); }
          .sk-subtitle { font-size: .85rem; margin-bottom: 22px; padding: 0 8px; }
          .sk-marquee-outer { margin: 0 -12px 28px; }
          .sk-marquee-chip { padding: 5px 10px 5px 6px; gap: 6px; }
          .sk-marquee-icon-wrap { width: 25px; height: 25px; font-size: .82rem; }
          .sk-marquee-label { font-size: .74rem; }
          .sk-tabs {
            display: flex;
            flex-wrap: nowrap;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            justify-content: flex-start;
            padding: 4px 4px 12px;
            gap: 7px;
            margin-bottom: 22px;
            scrollbar-width: none;
          }
          .sk-tabs::-webkit-scrollbar { display: none; }
          .sk-tab { padding: 7px 13px; font-size: .78rem; white-space: nowrap; flex-shrink: 0; }
          .sk-tab-count { font-size: .66rem; padding: 1px 5px; }
          .sk-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
            max-width: 380px;
            margin: 0 auto;
            justify-content: center;
          }
          .sk-card-holder { width: 100%; max-width: 100%; }
          .sk-card-holder.sk-last-odd {
            grid-column: 1 / -1;
            max-width: 155px;
            margin: 0 auto;
            width: 100%;
            justify-self: center;
          }
          .sk-card-inner { padding-top: 124%; border-radius: 16px; }
          .sk-face { border-radius: 16px; padding: 13px 8px 10px; }
          .sk-icon-ring { width: 44px; height: 44px; margin-bottom: 6px; }
          .sk-icon-sphere { font-size: 1.15rem; }
          .sk-orbit-ring { inset: -5px; }
          .sk-card-name { font-size: .76rem; margin-bottom: 5px; }
          .sk-radial { width: 52px; height: 52px; }
          .sk-pct { font-size: .68rem; }
          .sk-flip-hint { opacity: .65; font-size: .56rem; margin-top: 3px; }
          .sk-face--back { padding: 11px 8px 8px; border-radius: 16px; }
          .sk-back-header { gap: 6px; margin-bottom: 5px; }
          .sk-back-icon { width: 26px; height: 26px; font-size: .78rem; border-radius: 7px; }
          .sk-back-name { font-size: .75rem; }
          .sk-badge { font-size: .5rem; padding: 1px 4px; }
          .sk-stars { gap: 2px; margin-bottom: 4px; }
          .sk-stars i { font-size: .62rem; }
          .sk-bar-wrap { height: 3px; margin-bottom: 2px; }
          .sk-bar-pct { font-size: .6rem; margin-bottom: 4px; }
          .sk-desc { font-size: .62rem; line-height: 1.35; -webkit-line-clamp: 3; }
          .sk-skel { min-height: 170px; padding: 16px 10px; }
          .sk-stats-bar {
            flex-direction: column;
            gap: 16px;
            padding: 16px;
            margin-top: 32px;
          }
          .sk-stat-divider {
            width: 80%;
            height: 1px;
          }
          .sk-stat-number { font-size: 1.6rem; }
        }

        /* NARROW MOBILE (<360px) */
        @media(max-width: 360px) {
          .sk-grid { gap: 8px; }
          .sk-face { padding: 10px 6px 8px; }
          .sk-icon-ring { width: 38px; height: 38px; margin-bottom: 4px; }
          .sk-icon-sphere { font-size: 1.05rem; }
          .sk-radial { width: 46px; height: 46px; }
          .sk-card-name { font-size: .72rem; }
          .sk-desc { -webkit-line-clamp: 2; }
        }

        /* ── 3D SKILL CRAWLER TRACK & EXPERTISE MATRIX DASHBOARD (MERGED BACKGROUND) ── */
        .sk-matrix-dashboard {
          position: relative;
          background: transparent !important;
          border: none !important;
          border-radius: 0;
          padding: 12px 0 0;
          overflow: visible;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          box-shadow: none !important;
          margin-top: 10px;
        }
        [data-theme="light"] .sk-matrix-dashboard {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }

        .sk-matrix-glow {
          position: absolute;
          width: 380px;
          height: 380px;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
          opacity: 0.18;
          z-index: 0;
        }
        .sk-matrix-glow--cyan {
          top: -40px;
          right: 8%;
          background: #06b6d4;
        }
        .sk-matrix-glow--purple {
          bottom: -40px;
          left: 6%;
          background: #8b5cf6;
        }

        .sk-matrix-content {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 1fr 1.08fr;
          gap: 36px;
          align-items: center;
        }

        /* Left Column Text & Telemetry */
        .sk-matrix-left {
          display: flex;
          flex-direction: column;
          gap: 16px;
          text-align: left;
        }
        .sk-hud-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(6, 182, 212, 0.08);
          border: 1px solid rgba(6, 182, 212, 0.35);
          padding: 6px 14px;
          border-radius: 99px;
          width: fit-content;
          box-shadow: 0 0 15px rgba(6, 182, 212, 0.15);
        }
        .sk-hud-led {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 10px #10b981;
          animation: skLedPulse 1.8s infinite;
        }
        @keyframes skLedPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
        .sk-hud-text {
          font-family: 'DM Mono', monospace;
          font-size: 0.78rem;
          color: #e2e8f0;
          letter-spacing: 0.04em;
        }
        [data-theme="light"] .sk-hud-text { color: #0f172a; }
        .sk-hud-label {
          color: #06b6d4;
          font-weight: 700;
        }
        .sk-hud-status {
          font-family: 'DM Mono', monospace;
          font-size: 0.75rem;
          color: #10b981;
          font-weight: 800;
          letter-spacing: 0.05em;
        }

        .sk-hud-telemetry {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'DM Mono', monospace;
          font-size: 0.72rem;
          color: #94a3b8;
          flex-wrap: wrap;
        }
        .sk-telemetry-item { display: flex; gap: 4px; }
        .sk-telemetry-key { color: #64748b; }
        .sk-telemetry-val { color: #38bdf8; font-weight: 600; }
        .sk-telemetry-sep { color: #334155; }

        .sk-matrix-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(1.8rem, 3.2vw, 2.5rem);
          font-weight: 900;
          line-height: 1.15;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 55%, #64748b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
        }
        [data-theme="light"] .sk-matrix-title {
          background: linear-gradient(135deg, #0f172a 0%, #334155 60%, #64748b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .sk-matrix-desc {
          font-size: 0.92rem;
          color: #94a3b8;
          line-height: 1.65;
          margin: 0;
          max-width: 520px;
        }
        [data-theme="light"] .sk-matrix-desc { color: #475569; }

        .sk-matrix-controls {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 6px;
        }
        .sk-ctrl-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 14px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #cbd5e1;
          font-family: 'DM Mono', monospace;
          font-size: 0.74rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        [data-theme="light"] .sk-ctrl-btn {
          background: rgba(255, 255, 255, 0.8);
          border-color: rgba(99, 102, 241, 0.2);
          color: #334155;
        }
        .sk-ctrl-btn:hover {
          background: rgba(6, 182, 212, 0.15);
          border-color: rgba(6, 182, 212, 0.4);
          color: #38bdf8;
          transform: translateY(-2px);
        }
        .sk-ctrl-btn.active {
          background: rgba(239, 68, 68, 0.15);
          border-color: rgba(239, 68, 68, 0.4);
          color: #f87171;
        }
        .sk-matrix-badge-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 10px;
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.25);
          color: #a5b4fc;
          font-family: 'DM Mono', monospace;
          font-size: 0.72rem;
          font-weight: 700;
        }

        /* Right Column 3D Crawler Viewport */
        .sk-matrix-right {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .sk-crawler-rack-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 6px;
        }
        .sk-rack-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'DM Mono', monospace;
          font-size: 0.7rem;
          color: #64748b;
          letter-spacing: 0.05em;
        }
        .sk-rack-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #06b6d4;
          box-shadow: 0 0 8px #06b6d4;
        }
        .sk-rack-tag {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          padding: 2px 7px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #94a3b8;
        }

        /* ── SINGLE 3D VERTICAL CIRCULAR WHEEL VIEWPORT (MERGED BACKGROUND) ── */
        .sk-wheel-viewport {
          position: relative;
          width: 100%;
          max-width: 440px;
          height: 490px;
          overflow: hidden;
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          margin: 0 auto;
          perspective: 1200px;
          perspective-origin: center center;
          display: flex;
          align-items: center;
          justify-content: center;
          mask-image: linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%);
        }
        [data-theme="light"] .sk-wheel-viewport {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }

        .sk-crawler-fade {
          display: none;
        }

        .sk-crawler-rail {
          position: absolute;
          top: 10%;
          bottom: 10%;
          width: 1.5px;
          background: linear-gradient(180deg, transparent, rgba(6, 182, 212, 0.35), transparent);
          z-index: 2;
          pointer-events: none;
        }
        .sk-crawler-rail--left { left: 10px; }
        .sk-crawler-rail--right { right: 10px; }

        /* CIRCULAR WHEEL 3D ROTATION */
        .sk-circular-wheel {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 360px;
          height: 125px;
          margin-top: -62.5px;
          margin-left: -180px;
          transform-style: preserve-3d;
          animation: skWheelSpin 20s linear infinite;
        }
        .sk-circular-wheel.is-paused,
        .sk-wheel-viewport:hover .sk-circular-wheel {
          animation-play-state: paused;
        }

        @keyframes skWheelSpin {
          0% {
            transform: rotateX(0deg);
          }
          100% {
            transform: rotateX(360deg);
          }
        }

        .sk-wheel-slot {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          /* Circular radial orbit along vertical cylinder radius 200px */
          transform: rotateX(var(--slot-angle)) translateZ(200px);
        }

        .sk-wheel-counter {
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          /* Counter-rotate around X so cards stay strictly upright facing camera */
          animation: skCounterSpin 20s linear infinite;
        }
        .sk-circular-wheel.is-paused .sk-wheel-counter,
        .sk-wheel-viewport:hover .sk-wheel-counter {
          animation-play-state: paused;
        }

        @keyframes skCounterSpin {
          0% {
            transform: rotateX(calc(-1 * var(--slot-angle) - 0deg));
          }
          100% {
            transform: rotateX(calc(-1 * var(--slot-angle) - 360deg));
          }
        }

        /* ── 3D FLIP CARD ON HOVER ── */
        .sk-flip-card {
          position: relative;
          width: 100%;
          height: 100%;
          perspective: 1000px;
          transform-style: preserve-3d;
          cursor: pointer;
        }
        .sk-flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.65s cubic-bezier(0.34, 1.4, 0.64, 1), box-shadow 0.3s ease;
          border-radius: 18px;
        }
        .sk-flip-card:hover .sk-flip-card-inner,
        .sk-flip-card.is-flipped .sk-flip-card-inner {
          transform: rotateY(180deg) scale(1.04);
        }

        .sk-flip-face {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 18px;
          overflow: hidden;
        }

        /* FRONT FACE */
        .sk-flip-face--front {
          background: var(--card-bg, #13112a);
          border: 1px solid var(--card-border, rgba(255, 255, 255, 0.12));
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          padding: 14px 16px 12px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: var(--shadow-md);
          transform: rotateY(0deg) translateZ(1px);
        }
        [data-theme="light"] .sk-flip-face--front,
        body.light .sk-flip-face--front {
          background: #ffffff !important;
          border-color: rgba(99, 102, 241, 0.18) !important;
          box-shadow: 0 10px 28px rgba(99, 102, 241, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04) !important;
        }

        .sk-front-icon-box {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(var(--accent-rgb), 0.12);
          border: 1px solid rgba(var(--accent-rgb), 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.15rem;
          color: var(--primary-color);
          flex-shrink: 0;
        }
        .sk-front-title-wrap {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .sk-card-sub-cat {
          display: block;
          font-family: 'DM Mono', monospace;
          font-size: 0.62rem;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-top: 2px;
        }
        .sk-card-flip-prompt {
          font-family: 'DM Mono', monospace;
          font-size: 0.62rem;
          color: var(--primary-color);
          opacity: 0.9;
        }

        /* BACK FACE (DESCRIPTION) */
        .sk-flip-face--back {
          background: var(--card-bg-elevated, #1a1735);
          border: 1.5px solid rgba(var(--accent-rgb), 0.45);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          padding: 12px 16px 10px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: var(--shadow-lg);
          transform: rotateY(180deg) translateZ(1px);
        }
        [data-theme="light"] .sk-flip-face--back,
        body.light .sk-flip-face--back {
          background: #ffffff !important;
          border-color: rgba(99, 102, 241, 0.4) !important;
          box-shadow: 0 12px 35px rgba(99, 102, 241, 0.18) !important;
        }

        .sk-back-topline {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .sk-back-title-group {
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .sk-back-icon-mini {
          color: var(--primary-color);
          font-size: 0.95rem;
        }
        .sk-back-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-color);
        }
        [data-theme="light"] .sk-back-title,
        body.light .sk-back-title { color: #0f172a !important; }

        .sk-back-pct-badge {
          font-family: 'DM Mono', monospace;
          font-size: 0.68rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 99px;
          background: rgba(var(--accent-rgb), 0.12);
          border: 1px solid rgba(var(--accent-rgb), 0.35);
          color: var(--primary-color);
        }

        .sk-back-description {
          font-size: 0.73rem;
          line-height: 1.48;
          color: var(--text-muted);
          margin: 6px 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-align: left;
        }
        [data-theme="light"] .sk-back-description,
        body.light .sk-back-description { color: #475569 !important; }

        .sk-back-footline {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: 'DM Mono', monospace;
          font-size: 0.64rem;
        }
        .sk-back-badge-tier {
          color: #10b981;
          font-weight: 700;
          letter-spacing: 0.04em;
        }
        .sk-back-flip-hint {
          color: var(--text-muted);
        }

        .sk-card-topline {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
        }
        .sk-card-name-group {
          display: flex;
          align-items: center;
          gap: 9px;
          overflow: hidden;
        }
        .sk-card-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.84rem;
          font-weight: 700;
          color: var(--text-color);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        [data-theme="light"] .sk-card-title,
        body.light .sk-card-title { color: #0f172a !important; }

        .sk-card-ring-pill {
          padding: 3px 9px;
          border-radius: 99px;
          background: rgba(var(--accent-rgb), 0.12);
          border: 1px solid rgba(var(--accent-rgb), 0.35);
          flex-shrink: 0;
        }
        .sk-card-pct-text {
          font-family: 'DM Mono', monospace;
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--primary-color);
        }

        /* Recessed Volumetric Progress Bar */
        .sk-crawler-bar-recess {
          width: 100%;
          height: 6px;
          background: rgba(0, 0, 0, 0.45);
          border-radius: 99px;
          overflow: hidden;
          padding: 1px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          margin: 10px 0 8px;
        }
        [data-theme="light"] .sk-crawler-bar-recess {
          background: rgba(226, 232, 240, 0.8);
          border-color: rgba(99, 102, 241, 0.15);
        }
        .sk-crawler-bar-fill {
          height: 100%;
          border-radius: 99px;
          transition: width 0.6s ease;
          box-shadow: 0 0 10px rgba(56, 189, 248, 0.4);
        }

        .sk-card-footline {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
        }
        .sk-card-tier {
          color: #10b981;
          letter-spacing: 0.05em;
          font-weight: 700;
        }

        /* Responsive Breakpoints for Matrix Dashboard */
        @media (max-width: 991px) {
          .sk-matrix-content {
            grid-template-columns: 1fr;
            gap: 28px;
          }
          .sk-wheel-viewport {
            height: 440px;
          }
        }
        @media (max-width: 575px) {
          .sk-matrix-dashboard {
            padding: 24px 16px;
            border-radius: 20px;
            margin-bottom: 2rem;
          }
          .sk-matrix-title {
            font-size: 1.6rem;
          }
          .sk-matrix-desc {
            font-size: 0.84rem;
          }
          .sk-circular-wheel {
            width: 300px;
            margin-left: -150px;
            height: 118px;
            margin-top: -59px;
          }
          .sk-wheel-slot {
            transform: rotateX(var(--slot-angle)) translateZ(165px);
          }
          .sk-wheel-viewport {
            height: 400px;
          }
          .sk-back-description {
            font-size: 0.68rem;
            line-height: 1.4;
            -webkit-line-clamp: 2;
          }
          .sk-card-title {
            font-size: 0.78rem;
          }
        }
      `}</style>
    </section>
  );
}
