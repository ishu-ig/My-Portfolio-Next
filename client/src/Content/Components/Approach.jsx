"use client";
import React, { useState, useEffect, useRef, useContext } from "react";
import * as THREE from "three";
import AOS from "aos";
import "aos/dist/aos.css";
import { ThemeContext } from "../ThemeContext";

/* ── 6 Engineering-First Approach Steps with Theme Accents ── */
const STEPS = [
  {
    num: "01",
    name: "Understand",
    sub: "Define the problem",
    text: "Clarify the core problem, user personas, and what 'done' looks like before writing a single line of code.",
    points: ["Inputs and outputs", "Boundaries", "User goals"],
    lightAccent: "#4f46e5", // Indigo
    darkAccent: "#818cf8"
  },
  {
    num: "02",
    name: "Break down",
    sub: "Split it into parts",
    text: "Turn one large problem into small parts with clear inputs, outputs and boundaries.",
    points: ["Inputs and outputs", "Boundaries", "Dependencies"],
    lightAccent: "#0284c7", // Sky/Cyan
    darkAccent: "#38bdf8"
  },
  {
    num: "03",
    name: "Investigate",
    sub: "Explore & de-risk",
    text: "Evaluate architectural trade-offs, spike challenging edge integrations, and de-risk technical uncertainties early.",
    points: ["Tech trade-offs", "Spike prototypes", "Architecture"],
    lightAccent: "#7c3aed", // Violet
    darkAccent: "#a855f7"
  },
  {
    num: "04",
    name: "Build",
    sub: "Execute & iterate",
    text: "Write clean, modular, maintainable code following solid patterns, accessible UI, and self-documenting APIs.",
    points: ["Modular code", "Type safety", "Clean architecture"],
    lightAccent: "#059669", // Emerald
    darkAccent: "#34d399"
  },
  {
    num: "05",
    name: "Test",
    sub: "Verify resilience",
    text: "Verify the happy path, edge cases, asynchronous race conditions, and catastrophic failure modes before shipping.",
    points: ["Edge boundaries", "Integration tests", "Failure resilience"],
    lightAccent: "#d97706", // Amber
    darkAccent: "#fbbf24"
  },
  {
    num: "06",
    name: "Improve",
    sub: "Optimize & scale",
    text: "Profile performance bottlenecks, analyze real telemetry, monitor uptime, and iteratively optimize the platform.",
    points: ["Performance profiling", "Telemetry & logs", "Iterative polish"],
    lightAccent: "#db2777", // Rose
    darkAccent: "#f472b6"
  }
];

/* ── Canvas Texture Generator for 3D Monolith Card ── */
function createMonolithTexture(step, isDark) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext("2d");

  const accent = isDark ? step.darkAccent : step.lightAccent;

  if (isDark) {
    // ── DARK THEME CARD (Obsidian Midnight Violet) ──
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 768);
    bgGrad.addColorStop(0, "#13112c");
    bgGrad.addColorStop(0.5, "#0a0818");
    bgGrad.addColorStop(1, "#050410");

    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(8, 8, 496, 752, 28);
    } else {
      ctx.rect(8, 8, 496, 752);
    }
    ctx.fillStyle = bgGrad;
    ctx.fill();

    // Subtle luminous glass border
    ctx.strokeStyle = "rgba(165, 180, 252, 0.22)";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Glowing top highlight rim
    const topGrad = ctx.createLinearGradient(20, 8, 492, 8);
    topGrad.addColorStop(0, "rgba(129, 140, 248, 0.05)");
    topGrad.addColorStop(0.5, "rgba(192, 132, 252, 0.85)");
    topGrad.addColorStop(1, "rgba(129, 140, 248, 0.05)");
    ctx.strokeStyle = topGrad;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(36, 8);
    ctx.lineTo(476, 8);
    ctx.stroke();

    // Large Numeral "01", "02"
    ctx.fillStyle = accent;
    ctx.font = "bold 112px 'Playfair Display', Georgia, serif";
    ctx.fillText(step.num, 44, 142);

    // Counter "01 / 06"
    ctx.fillStyle = "rgba(165, 180, 252, 0.75)";
    ctx.font = "600 22px 'DM Mono', monospace";
    ctx.textAlign = "right";
    ctx.fillText(`${step.num} / 06`, 468, 76);
    ctx.textAlign = "left";

    // Step Title
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 44px 'Playfair Display', Georgia, serif";
    ctx.fillText(step.name, 44, 465);

    // Step Subtitle
    ctx.fillStyle = "rgba(203, 213, 225, 0.75)";
    ctx.font = "500 22px 'DM Sans', sans-serif";
    ctx.fillText(step.sub, 46, 510);

    // Bottom glowing accent bar
    ctx.shadowColor = accent;
    ctx.shadowBlur = 14;
    ctx.fillStyle = accent;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(44, 690, 424, 7, 3);
    } else {
      ctx.rect(44, 690, 424, 7);
    }
    ctx.fill();
    ctx.shadowBlur = 0;
  } else {
    // ── LIGHT THEME CARD (Pearl / Frosted Ceramic White) ──
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 768);
    bgGrad.addColorStop(0, "#ffffff");
    bgGrad.addColorStop(0.45, "#f8fafc");
    bgGrad.addColorStop(1, "#edf2f7");

    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(8, 8, 496, 752, 28);
    } else {
      ctx.rect(8, 8, 496, 752);
    }
    ctx.fillStyle = bgGrad;
    ctx.fill();

    // Subtle refined border
    ctx.strokeStyle = "rgba(99, 102, 241, 0.18)";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Glowing top highlight rim
    const topGrad = ctx.createLinearGradient(20, 8, 492, 8);
    topGrad.addColorStop(0, "rgba(99, 102, 241, 0.1)");
    topGrad.addColorStop(0.5, "rgba(99, 102, 241, 0.75)");
    topGrad.addColorStop(1, "rgba(99, 102, 241, 0.1)");
    ctx.strokeStyle = topGrad;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(36, 8);
    ctx.lineTo(476, 8);
    ctx.stroke();

    // Large Numeral "01", "02"
    ctx.fillStyle = accent;
    ctx.font = "bold 112px 'Playfair Display', Georgia, serif";
    ctx.fillText(step.num, 44, 142);

    // Counter "01 / 06"
    ctx.fillStyle = "#64748b";
    ctx.font = "600 22px 'DM Mono', monospace";
    ctx.textAlign = "right";
    ctx.fillText(`${step.num} / 06`, 468, 76);
    ctx.textAlign = "left";

    // Step Title
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 44px 'Playfair Display', Georgia, serif";
    ctx.fillText(step.name, 44, 465);

    // Step Subtitle
    ctx.fillStyle = "#475569";
    ctx.font = "500 22px 'DM Sans', sans-serif";
    ctx.fillText(step.sub, 46, 510);

    // Bottom accent bar
    ctx.shadowColor = "rgba(99, 102, 241, 0.3)";
    ctx.shadowBlur = 10;
    ctx.fillStyle = accent;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(44, 690, 424, 7, 3);
    } else {
      ctx.rect(44, 690, 424, 7);
    }
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/* ── 3D Ring Slot Stage Three.js Scene ── */
function RingSlotThreeScene({ activeIndex, onSelectStep, theme }) {
  const mountRef = useRef(null);
  const activeIndexRef = useRef(activeIndex);
  const onSelectStepRef = useRef(onSelectStep);
  const themeRef = useRef(theme);
  const updateThemeInSceneRef = useRef(null);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    onSelectStepRef.current = onSelectStep;
  }, [onSelectStep]);

  // When theme prop changes, invoke dynamic update
  useEffect(() => {
    themeRef.current = theme;
    if (updateThemeInSceneRef.current) {
      updateThemeInSceneRef.current(theme === "dark");
    }
  }, [theme]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 440;
    let height = container.clientHeight || 380;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);

    const updateCameraDistance = (w, h) => {
      if (w < 380) {
        camera.position.set(0, 2.0, 9.6);
        camera.lookAt(0, 0.55, 0);
      } else if (w < 576) {
        camera.position.set(0, 2.1, 8.8);
        camera.lookAt(0, 0.6, 0);
      } else if (w < 960) {
        camera.position.set(0, 2.2, 8.0);
        camera.lookAt(0, 0.65, 0);
      } else {
        camera.position.set(0, 2.3, 7.4);
        camera.lookAt(0, 0.65, 0);
      }
    };
    updateCameraDistance(width, height);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.domElement.style.display = "block";
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.cursor = "grab";
      container.appendChild(renderer.domElement);
    } catch {
      return;
    }

    // Determine initial dark mode state
    const isDarkInitial =
      themeRef.current === "dark" ||
      (typeof document !== "undefined" &&
        document.documentElement.getAttribute("data-theme") === "dark");

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, isDarkInitial ? 0.95 : 1.35);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, isDarkInitial ? 2.0 : 2.4);
    dirLight1.position.set(6, 12, 10);
    scene.add(dirLight1);

    const rimLight = new THREE.DirectionalLight(
      isDarkInitial ? 0xa855f7 : 0x818cf8,
      isDarkInitial ? 1.6 : 1.4
    );
    rimLight.position.set(-8, 4, -6);
    scene.add(rimLight);

    const centerGlowLight = new THREE.PointLight(
      isDarkInitial ? 0x818cf8 : 0x6366f1,
      isDarkInitial ? 2.6 : 1.8,
      12,
      1.2
    );
    centerGlowLight.position.set(0, 0.6, 0);
    scene.add(centerGlowLight);

    const disposables = [];

    // Master Rotational Group for Stage & Monoliths - sleek compact scale
    const carouselGroup = new THREE.Group();
    carouselGroup.scale.set(0.9, 0.9, 0.9);
    scene.add(carouselGroup);

    // ── Circular Pedestal Stage ──
    const pedestalGeo = new THREE.CylinderGeometry(3.65, 3.82, 0.28, 64);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: isDarkInitial ? 0x0a0918 : 0xeef2f6,
      roughness: isDarkInitial ? 0.65 : 0.35,
      metalness: isDarkInitial ? 0.45 : 0.15,
    });
    disposables.push(pedestalGeo, pedestalMat);
    const pedestalMesh = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestalMesh.position.y = 0.08;
    carouselGroup.add(pedestalMesh);

    // Glowing Ring on Pedestal Edge
    const ringGeo = new THREE.RingGeometry(3.52, 3.68, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: isDarkInitial ? 0x818cf8 : 0x6366f1,
      side: THREE.DoubleSide,
    });
    disposables.push(ringGeo, ringMat);
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = 0.225;
    carouselGroup.add(ringMesh);

    // Inner subtle accent ring
    const innerRingGeo = new THREE.RingGeometry(1.6, 1.68, 48);
    const innerRingMat = new THREE.MeshBasicMaterial({
      color: isDarkInitial ? 0xa855f7 : 0x818cf8,
      transparent: true,
      opacity: isDarkInitial ? 0.3 : 0.35,
      side: THREE.DoubleSide,
    });
    disposables.push(innerRingGeo, innerRingMat);
    const innerRingMesh = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRingMesh.rotation.x = -Math.PI / 2;
    innerRingMesh.position.y = 0.223;
    carouselGroup.add(innerRingMesh);

    // ── 6 Upright Standing Monolith Cards ──
    const cardGeom = new THREE.BoxGeometry(1.5, 2.25, 0.08);
    disposables.push(cardGeom);

    const backMat = new THREE.MeshStandardMaterial({
      color: isDarkInitial ? 0x0e0c20 : 0xf8fafc,
      roughness: isDarkInitial ? 0.5 : 0.35,
      metalness: isDarkInitial ? 0.45 : 0.15,
    });
    disposables.push(backMat);

    const edgeMat = new THREE.MeshStandardMaterial({
      color: isDarkInitial ? 0x14122e : 0xe2e8f0,
      roughness: isDarkInitial ? 0.3 : 0.2,
      metalness: isDarkInitial ? 0.6 : 0.2,
      emissive: isDarkInitial ? 0x818cf8 : 0x6366f1,
      emissiveIntensity: isDarkInitial ? 0.12 : 0.06,
    });
    disposables.push(edgeMat);

    const radius = 2.68;
    const cards = [];
    const raycastMeshes = [];

    STEPS.forEach((step, idx) => {
      const texture = createMonolithTexture(step, isDarkInitial);
      disposables.push(texture);

      const frontMat = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: isDarkInitial ? 0.22 : 0.18,
        metalness: isDarkInitial ? 0.15 : 0.08,
        emissive: isDarkInitial ? 0x818cf8 : 0x6366f1,
        emissiveIntensity: isDarkInitial ? 0.08 : 0.04,
      });
      disposables.push(frontMat);

      // Materials order: [+x, -x, +y, -y, +z (front), -z (back)]
      const materials = [edgeMat, edgeMat, edgeMat, edgeMat, frontMat, backMat];

      const cardMesh = new THREE.Mesh(cardGeom, materials);
      cardMesh.userData = { stepIndex: idx };

      // Distribute radially around the pedestal ring
      const angle = (idx / 6) * Math.PI * 2;
      cardMesh.position.set(
        Math.sin(angle) * radius,
        1.32,
        Math.cos(angle) * radius
      );
      // Face outwards radially
      cardMesh.rotation.y = angle;

      carouselGroup.add(cardMesh);
      cards.push({ mesh: cardMesh, frontMat, idx, angle });
      raycastMeshes.push(cardMesh);
    });

    // Dynamic Theme Update function
    const updateThemeInScene = (isDark) => {
      if (isDark) {
        ambientLight.intensity = 0.95;
        dirLight1.intensity = 2.0;
        rimLight.color.setHex(0xa855f7);
        rimLight.intensity = 1.6;
        centerGlowLight.color.setHex(0x818cf8);
        centerGlowLight.intensity = 2.6;

        pedestalMat.color.setHex(0x0a0918);
        pedestalMat.roughness = 0.65;
        pedestalMat.metalness = 0.45;

        ringMat.color.setHex(0x818cf8);
        innerRingMat.color.setHex(0xa855f7);
        innerRingMat.opacity = 0.3;

        backMat.color.setHex(0x0e0c20);
        backMat.roughness = 0.5;
        backMat.metalness = 0.45;

        edgeMat.color.setHex(0x14122e);
        edgeMat.emissive.setHex(0x818cf8);
        edgeMat.emissiveIntensity = 0.12;
      } else {
        ambientLight.intensity = 1.35;
        dirLight1.intensity = 2.4;
        rimLight.color.setHex(0x818cf8);
        rimLight.intensity = 1.4;
        centerGlowLight.color.setHex(0x6366f1);
        centerGlowLight.intensity = 1.8;

        pedestalMat.color.setHex(0xeef2f6);
        pedestalMat.roughness = 0.35;
        pedestalMat.metalness = 0.15;

        ringMat.color.setHex(0x6366f1);
        innerRingMat.color.setHex(0x818cf8);
        innerRingMat.opacity = 0.35;

        backMat.color.setHex(0xf8fafc);
        backMat.roughness = 0.35;
        backMat.metalness = 0.15;

        edgeMat.color.setHex(0xe2e8f0);
        edgeMat.emissive.setHex(0x6366f1);
        edgeMat.emissiveIntensity = 0.06;
      }

      cards.forEach((c) => {
        const step = STEPS[c.idx];
        const oldTexture = c.frontMat.map;
        const newTexture = createMonolithTexture(step, isDark);
        disposables.push(newTexture);
        c.frontMat.map = newTexture;
        c.frontMat.emissive.setHex(isDark ? 0x818cf8 : 0x6366f1);
        c.frontMat.needsUpdate = true;
        if (oldTexture) {
          oldTexture.dispose();
        }
      });
    };
    updateThemeInSceneRef.current = updateThemeInScene;

    // MutationObserver fallback to catch any theme changes
    const observer = new MutationObserver(() => {
      const currentDark = document.documentElement.getAttribute("data-theme") === "dark";
      updateThemeInScene(currentDark);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"]
    });

    // ── Pointer Drag & Click Interaction ──
    let isDragging = false;
    let startX = 0;
    let dragDistance = 0;
    let manualRotOffset = 0;
    let currentRotY = 0;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (e) => {
      isDragging = true;
      startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      dragDistance = 0;
      renderer.domElement.style.cursor = "grabbing";
    };

    const onPointerMove = (e) => {
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

      if (isDragging) {
        const deltaX = clientX - startX;
        startX = clientX;
        dragDistance += Math.abs(deltaX);
        manualRotOffset += deltaX * 0.007;
      } else {
        // Hover raycast for cursor pointer
        const rect = container.getBoundingClientRect();
        mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(raycastMeshes, false);
        renderer.domElement.style.cursor = intersects.length > 0 ? "pointer" : "grab";
      }
    };

    const onPointerUp = (e) => {
      if (!isDragging) return;
      isDragging = false;
      renderer.domElement.style.cursor = "grab";

      if (dragDistance < 7) {
        // Treated as Click
        const clientX = e.clientX || (e.changedTouches && e.changedTouches[0]?.clientX) || 0;
        const clientY = e.clientY || (e.changedTouches && e.changedTouches[0]?.clientY) || 0;
        const rect = container.getBoundingClientRect();
        mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(raycastMeshes, false);
        if (intersects.length > 0) {
          const clickedIdx = intersects[0].object.userData.stepIndex;
          if (typeof clickedIdx === "number") {
            onSelectStepRef.current(clickedIdx);
            manualRotOffset = 0;
          }
        }
      } else {
        // Drag release: Snap to closest step
        const stepAngle = (Math.PI * 2) / 6;
        const effectiveRot = currentRotY + manualRotOffset;
        const stepIndex = Math.round(-effectiveRot / stepAngle);
        const normalized = ((stepIndex % 6) + 6) % 6;
        manualRotOffset = 0;
        onSelectStepRef.current(normalized);
      }
    };

    const domEl = renderer.domElement;
    domEl.addEventListener("mousedown", onPointerDown);
    domEl.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("mouseup", onPointerUp);
    window.addEventListener("touchend", onPointerUp);

    // ── Animation Loop ──
    let animationFrameId;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startTime) * 0.001;
      const currentActive = activeIndexRef.current;

      // Target rotation brings the active card to front (+Z)
      const targetBaseRot = -currentActive * ((Math.PI * 2) / 6);
      const targetRotY = targetBaseRot + manualRotOffset;

      currentRotY += (targetRotY - currentRotY) * 0.085;
      carouselGroup.rotation.y = currentRotY;

      // Gentle floating breathing tilt on the entire stage
      carouselGroup.rotation.x = 0.05 + Math.sin(elapsed * 1.5) * 0.015;

      // Card scale & emissive response
      cards.forEach((c) => {
        const isActive = c.idx === currentActive;
        if (isActive) {
          c.mesh.scale.lerp(new THREE.Vector3(1.04, 1.04, 1.04), 0.1);
          c.frontMat.emissiveIntensity = 0.16 + Math.sin(elapsed * 3) * 0.05;
        } else {
          c.mesh.scale.lerp(new THREE.Vector3(0.96, 0.96, 0.96), 0.1);
          c.frontMat.emissiveIntensity = 0.03;
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      updateCameraDistance(width, height);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      observer.disconnect();
      updateThemeInSceneRef.current = null;
      domEl.removeEventListener("mousedown", onPointerDown);
      domEl.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      window.removeEventListener("touchend", onPointerUp);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    />
  );
}

export default function Approach() {
  const { theme } = useContext(ThemeContext) || { theme: "dark" };
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const currStep = STEPS[activeIdx];

  // Auto-advance every 6.5 seconds unless user is interacting/hovering
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % STEPS.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [isPaused]);

  useEffect(() => {
    AOS.init({ duration: 800, once: false, mirror: true });
  }, []);

  return (
    <>
      <style>{`
        /* ── Section Container ── */
        .approach-section {
          padding: clamp(65px, 8vw, 125px) 0;
          background: transparent !important;
          background-color: transparent !important;
          color: var(--text-color, #f4f4f4);
          position: relative;
        }

        /* ── Grid Layout ── */
        .pin-grid {
          display: grid;
          grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
          gap: clamp(32px, 5vw, 76px);
          align-items: center;
          width: 100%;
        }
        .pin-copy {
          min-width: 0;
        }

        /* ── Copy Elements ── */
        .pin-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: clamp(12px, 1.1vw, 13px);
          color: var(--primary-color, #6366f1);
          letter-spacing: .1em;
          text-transform: uppercase;
          margin-bottom: 14px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-weight: 600;
          padding: 5px 14px;
          border-radius: 99px;
          background: var(--primary-gradient-subtle, rgba(99, 102, 241, 0.08));
          border: 1px solid var(--card-border, rgba(99, 102, 241, 0.15));
        }
        .pin-h2 {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 700;
          font-size: clamp(2.5rem, 5.2vw, 4.2rem);
          line-height: 1.06;
          letter-spacing: -0.03em;
          color: var(--text-color, #ffffff);
          margin-bottom: 18px;
        }
        .pin-h2 em {
          font-style: italic;
          color: var(--primary-color, #6366f1);
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .pin-lead {
          color: var(--text-muted, #9ca3af);
          font-size: clamp(0.95rem, 1.3vw, 1.15rem);
          line-height: 1.6;
          max-width: 52ch;
          margin-bottom: 0;
        }

        /* ── Active Step Detail ── */
        .detail {
          margin-top: 36px;
          min-height: 200px;
          padding: 24px;
          border-radius: 20px;
          border: 1px solid var(--card-border, rgba(255, 255, 255, 0.08));
          border-left: 4px solid var(--primary-color, #6366f1);
          background: var(--card-bg, rgba(255, 255, 255, 0.03));
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          transition: border-color 0.4s ease, background 0.4s ease, box-shadow 0.4s ease;
        }
        .detail-count {
          font-family: 'DM Mono', monospace;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: .14em;
          color: var(--primary-color, #6366f1);
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .detail-name {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 700;
          font-size: clamp(2.2rem, 3.6vw, 3rem);
          line-height: 1.08;
          letter-spacing: -0.03em;
          color: var(--text-color, #ffffff);
          margin-bottom: 12px;
        }
        .detail-text {
          color: var(--text-muted, #9ca3af);
          font-size: clamp(14.5px, 1.15vw, 16px);
          line-height: 1.65;
          max-width: 48ch;
          margin-bottom: 18px;
        }
        .detail-points {
          display: flex;
          flex-wrap: wrap;
          gap: 10px 22px;
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .detail-points li {
          font-family: 'DM Mono', monospace;
          font-size: 13.5px;
          color: var(--text-muted, #d1d5db);
          display: inline-flex;
          align-items: center;
          gap: 7px;
        }
        .detail-points li:before {
          content: "—";
          color: var(--primary-color, #6366f1);
          font-weight: bold;
        }

        /* ── Step Navigation Pill Buttons ── */
        .pin-nav {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 36px;
          list-style: none;
          padding: 0;
          margin-bottom: 0;
        }
        .pin-nav button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          border-radius: 99px;
          border: 1px solid var(--border-color, rgba(255, 255, 255, 0.12));
          background: var(--card-bg, rgba(255, 255, 255, 0.05));
          font-size: 13.5px;
          font-family: 'DM Mono', monospace;
          color: var(--text-muted, #9ca3af);
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: var(--shadow-sm);
        }
        .pin-nav button b {
          font-weight: 700;
          color: var(--primary-color, #6366f1);
        }
        .pin-nav button:hover:not([aria-current="true"]) {
          border-color: var(--primary-color, #6366f1);
          color: var(--text-color, #ffffff);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        .pin-nav button[aria-current="true"] {
          color: #ffffff !important;
          background: var(--primary-gradient, linear-gradient(135deg, #6366f1, #8b5cf6)) !important;
          border-color: transparent !important;
          box-shadow: 0 4px 20px rgba(99, 102, 241, 0.45) !important;
          transform: translateY(-2px);
        }
        .pin-nav button[aria-current="true"] b {
          color: #ffffff !important;
        }

        /* ── 3D Ring Slot & Atmospheric Aura ── */
        .ring-slot {
          position: relative;
          height: clamp(320px, 34vw, 440px);
          max-width: 440px;
          width: 100%;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ring-aura {
          position: absolute;
          width: 78%;
          height: 78%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.16) 0%, rgba(236, 72, 153, 0.05) 50%, transparent 70%);
          filter: blur(48px);
          pointer-events: none;
          z-index: 0;
          animation: auraBreathe 5s ease-in-out infinite alternate;
          transition: background 0.5s ease;
        }
        [data-theme="dark"] .ring-aura {
          background: radial-gradient(circle, rgba(129, 140, 248, 0.22) 0%, rgba(168, 85, 247, 0.1) 50%, transparent 70%);
        }
        @keyframes auraBreathe {
          0% { transform: scale(0.9); opacity: 0.6; }
          100% { transform: scale(1.1); opacity: 0.95; }
        }

        /* Responsive Breakpoints */
        @media (max-width: 960px) {
          .pin-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .ring-slot {
            order: -1;
            height: 310px;
            max-width: 360px;
          }
          .detail {
            margin-top: 20px;
            min-height: 0;
          }
        }

        @media (max-width: 576px) {
          .approach-section {
            padding: 45px 0;
          }
          .ring-slot {
            height: 240px;
            max-width: 290px;
          }
          .pin-nav {
            overflow-x: auto;
            flex-wrap: nowrap;
            padding-bottom: 6px;
            margin-top: 20px;
            scrollbar-width: none;
          }
          .pin-nav::-webkit-scrollbar {
            display: none;
          }
          .pin-nav button {
            white-space: nowrap;
            flex-shrink: 0;
            padding: 5px 12px;
            font-size: 12px;
          }
        }

        @media (max-width: 380px) {
          .ring-slot {
            height: 205px;
            max-width: 250px;
          }
          .detail-name {
            font-size: 1.8rem;
          }
        }
      `}</style>

      <section id="approach" className="approach-section">
        <div className="container">
          <div
            className="pin-grid"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Left Column: Copy & Interactive Process Steps */}
            <div className="pin-copy" data-aos="fade-up">
              <p className="pin-eyebrow">
                <i className="bi bi-compass-fill" />
                My Approach
              </p>
              <h2 className="pin-h2" id="approachTitle">
                How I <em>work</em>
              </h2>
              <p className="pin-lead">
                A software engineer who believes good software comes from a clear, repeatable process.
              </p>

              {/* Dynamic Step Detail with micro-animation */}
              <div
                className="detail"
                id="stepDetail"
                aria-live="polite"
              >
                <p className="detail-count">{currStep.num} / 06</p>
                <h3 className="detail-name">{currStep.name}</h3>
                <p className="detail-text">{currStep.text}</p>
                <ul className="detail-points">
                  {currStep.points.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>

              {/* Interactive Step Navigation */}
              <ol className="pin-nav" id="stepNav" aria-label="Process Steps">
                {STEPS.map((s, idx) => (
                  <li key={s.num}>
                    <button
                      type="button"
                      data-i={idx}
                      aria-current={activeIdx === idx ? "true" : "false"}
                      onClick={() => setActiveIdx(idx)}
                    >
                      <b>{s.num}</b>
                      {s.name}
                    </button>
                  </li>
                ))}
              </ol>
            </div>

            {/* Right Column: 3D Interactive Ring Slot Model */}
            <div className="gl-slot ring-slot" id="ringSlot" aria-hidden="true">
              <div className="ring-aura" />
              <RingSlotThreeScene activeIndex={activeIdx} onSelectStep={setActiveIdx} theme={theme} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
