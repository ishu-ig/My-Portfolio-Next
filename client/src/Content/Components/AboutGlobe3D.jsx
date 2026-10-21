"use client";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * AboutGlobe3D
 * ---------------------------------------------------------------------------
 * A futuristic 3D Holographic Cyber-Globe with:
 *  - Dotted geodesic sphere & luminous latitude/longitude rings
 *  - Inner pulsing energy core
 *  - Pulsing beacon at Ishaan's coordinates (India: ~20.5° N, 78.9° E) with radar wave rings
 *  - Curved great-circle bezier communication arcs with animated traveling photons
 *  - Multi-axis gyroscope / astrolabe orbital rings with orbiting tech satellites
 *  - Interactive pointer drag with inertia, cursor parallax tilt, and click energy ripples
 *  - Real-time dark / light theme adaptation via MutationObserver
 */

// Global tech hub coordinates for great-circle arcs [lat, lon, label]
const HUBS = [
  { lat: 20.5937, lon: 78.9629, label: "India (HQ)", isOrigin: true },
  { lat: 37.7749, lon: -122.4194, label: "San Francisco" },
  { lat: 51.5074, lon: -0.1278, label: "London" },
  { lat: 35.6762, lon: 139.6503, label: "Tokyo" },
  { lat: 1.3521,  lon: 103.8198, label: "Singapore" },
  { lat: -33.8688, lon: 151.2093, label: "Sydney" },
  { lat: 25.2048, lon: 55.2708, label: "Dubai" },
  { lat: 52.5200, lon: 13.4050, label: "Berlin" },
];

function latLonToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

export default function AboutGlobe3D() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || 380;
    let height = container.clientHeight || 360;

    // ── 1. SCENE, CAMERA & RENDERER ─────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.6, 5.2);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // ── 2. LIGHTING ────────────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x818cf8, 2.2);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x06b6d4, 1.8);
    fillLight.position.set(-6, -4, 4);
    scene.add(fillLight);

    // Master group for entire globe & satellites
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // Initial globe orientation so India/Asia faces nicely toward camera
    masterGroup.rotation.y = -Math.PI * 0.35;
    masterGroup.rotation.x = 0.22;

    const GLOBE_RADIUS = 1.48;

    // ── 3. HOLOGRAPHIC DOTTED GLOBE SURFACE ─────────────────────────────────
    const dotCount = 1200;
    const dotPositions = new Float32Array(dotCount * 3);
    const dotColors = new Float32Array(dotCount * 3);

    const isCurrentDark = () => {
      if (typeof document === "undefined") return true;
      return document.documentElement.getAttribute("data-theme") !== "light";
    };

    let isDark = isCurrentDark();

    const getColors = (dark) => ({
      primary: dark ? new THREE.Color("#818cf8") : new THREE.Color("#4f46e5"),
      accent: dark ? new THREE.Color("#38bdf8") : new THREE.Color("#0284c7"),
      secondary: dark ? new THREE.Color("#ec4899") : new THREE.Color("#db2777"),
      emerald: dark ? new THREE.Color("#34d399") : new THREE.Color("#059669"),
      gold: dark ? new THREE.Color("#fbbf24") : new THREE.Color("#d97706"),
      core: dark ? 0x1e1b4b : 0xe0e7ff,
      coreOpacity: dark ? 0.35 : 0.22,
      wireOpacity: dark ? 0.16 : 0.10,
    });

    let themeColors = getColors(isDark);

    // Fibonacci sphere distribution for uniform holographic dots
    for (let i = 0; i < dotCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / dotCount);
      const theta = Math.sqrt(dotCount * Math.PI) * phi;
      const x = GLOBE_RADIUS * Math.cos(theta) * Math.sin(phi);
      const y = GLOBE_RADIUS * Math.sin(theta) * Math.sin(phi);
      const z = GLOBE_RADIUS * Math.cos(phi);

      dotPositions[i * 3]     = x;
      dotPositions[i * 3 + 1] = y;
      dotPositions[i * 3 + 2] = z;

      // Color variation across latitudes
      const c = Math.abs(y) > 0.8 ? themeColors.primary : themeColors.accent;
      dotColors[i * 3]     = c.r;
      dotColors[i * 3 + 1] = c.g;
      dotColors[i * 3 + 2] = c.b;
    }

    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute("position", new THREE.BufferAttribute(dotPositions, 3));
    dotGeo.setAttribute("color", new THREE.BufferAttribute(dotColors, 3));

    const dotMat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.75 : 0.55,
      blending: THREE.AdditiveBlending,
    });
    const globeDots = new THREE.Points(dotGeo, dotMat);
    masterGroup.add(globeDots);

    // ── 4. WIREFRAME LATITUDE / LONGITUDE RINGS ─────────────────────────────
    const wireGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 22, 16);
    const wireMat = new THREE.MeshBasicMaterial({
      color: themeColors.primary,
      wireframe: true,
      transparent: true,
      opacity: themeColors.wireOpacity,
    });
    const globeWire = new THREE.Mesh(wireGeo, wireMat);
    masterGroup.add(globeWire);

    // ── 5. INNER TRANSLUCENT ENERGY CORE ───────────────────────────────────
    const coreGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 0.94, 28, 28);
    const coreMat = new THREE.MeshStandardMaterial({
      color: themeColors.core,
      roughness: 0.2,
      metalness: 0.7,
      transparent: true,
      opacity: themeColors.coreOpacity,
      emissive: themeColors.primary,
      emissiveIntensity: isDark ? 0.25 : 0.15,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    masterGroup.add(coreMesh);

    // ── 6. LOCATION NODES & RADAR PULSE AT HQ (INDIA) ──────────────────────
    const hubMarkers = new THREE.Group();
    masterGroup.add(hubMarkers);

    let hqMarker = null;
    const radarRings = [];

    HUBS.forEach((hub) => {
      const pos = latLonToVector3(hub.lat, hub.lon, GLOBE_RADIUS * 1.01);
      const isOrigin = !!hub.isOrigin;

      // Beacon Dot
      const markerGeo = new THREE.SphereGeometry(isOrigin ? 0.055 : 0.035, 12, 12);
      const markerMat = new THREE.MeshBasicMaterial({
        color: isOrigin ? 0x10b981 : 0x38bdf8,
      });
      const markerMesh = new THREE.Mesh(markerGeo, markerMat);
      markerMesh.position.copy(pos);
      hubMarkers.add(markerMesh);

      if (isOrigin) {
        hqMarker = markerMesh;

        // Expanding radar beacon wave rings from HQ
        for (let r = 0; r < 2; r++) {
          const ringGeo = new THREE.RingGeometry(0.04, 0.065, 24);
          const ringMat = new THREE.MeshBasicMaterial({
            color: 0x10b981,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8,
          });
          const wave = new THREE.Mesh(ringGeo, ringMat);
          wave.position.copy(pos.clone().multiplyScalar(1.005));
          wave.lookAt(pos.clone().multiplyScalar(2));
          hubMarkers.add(wave);
          radarRings.push({ mesh: wave, offset: r * 0.5 });
        }
      }
    });

    // ── 7. GREAT CIRCLE COMMUNICATION ARCS ─────────────────────────────────
    const arcGroup = new THREE.Group();
    masterGroup.add(arcGroup);

    const originHub = HUBS[0]; // India
    const originPos = latLonToVector3(originHub.lat, originHub.lon, GLOBE_RADIUS);

    const photons = []; // Traveling glowing light packets

    HUBS.slice(1).forEach((destHub, idx) => {
      const destPos = latLonToVector3(destHub.lat, destHub.lon, GLOBE_RADIUS);
      const dist = originPos.distanceTo(destPos);

      // Arc peak control point
      const mid = originPos.clone().add(destPos).multiplyScalar(0.5);
      const elevation = 1.0 + dist * 0.35;
      mid.normalize().multiplyScalar(GLOBE_RADIUS * elevation);

      const curve = new THREE.QuadraticBezierCurve3(originPos, mid, destPos);
      const curvePoints = curve.getPoints(36);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);

      const arcMat = new THREE.LineBasicMaterial({
        color: idx % 2 === 0 ? themeColors.primary : themeColors.accent,
        transparent: true,
        opacity: isDark ? 0.42 : 0.32,
        blending: THREE.AdditiveBlending,
      });
      const arcLine = new THREE.Line(arcGeo, arcMat);
      arcGroup.add(arcLine);

      // Photon packet moving along this arc
      const photonGeo = new THREE.SphereGeometry(0.024, 8, 8);
      const photonMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.9,
      });
      const photonMesh = new THREE.Mesh(photonGeo, photonMat);
      arcGroup.add(photonMesh);

      photons.push({
        mesh: photonMesh,
        curve,
        speed: 0.004 + (idx % 3) * 0.0015,
        progress: (idx * 0.17) % 1,
      });
    });

    // ── 8. MULTI-AXIS GYROSCOPE ORBITAL RINGS & TECH SATELLITES ────────────
    const gyroGroup = new THREE.Group();
    masterGroup.add(gyroGroup);

    const makeOrbitRing = (radius, tiltX, tiltY, color, opacity) => {
      const ringGeo = new THREE.RingGeometry(radius - 0.012, radius + 0.012, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = tiltX;
      ring.rotation.y = tiltY;
      gyroGroup.add(ring);
      return ring;
    };

    const ringEquator = makeOrbitRing(GLOBE_RADIUS * 1.34, Math.PI / 2, 0, themeColors.primary, 0.35);
    const ringInclined = makeOrbitRing(GLOBE_RADIUS * 1.52, Math.PI / 3, Math.PI / 4, themeColors.accent, 0.28);
    const ringPolar    = makeOrbitRing(GLOBE_RADIUS * 1.68, 0, Math.PI / 6, themeColors.secondary, 0.22);

    // Floating 3D Tech Satellites orbiting along the rings
    const SATELLITE_DEFS = [
      { geom: new THREE.OctahedronGeometry(0.08, 0),   color: 0x38bdf8, orbit: ringEquator,  speed: 0.45, offset: 0.0 }, // React/Next
      { geom: new THREE.IcosahedronGeometry(0.075, 0), color: 0x34d399, orbit: ringEquator,  speed: 0.45, offset: Math.PI }, // Node/Express
      { geom: new THREE.DodecahedronGeometry(0.08, 0), color: 0xa855f7, orbit: ringInclined, speed: -0.35, offset: 1.2 }, // Redux/State
      { geom: new THREE.TetrahedronGeometry(0.08, 0),  color: 0xf59e0b, orbit: ringPolar,    speed: 0.3, offset: 2.4 }, // Cloud/DB
    ];

    const satellites = [];
    SATELLITE_DEFS.forEach((def) => {
      const mat = new THREE.MeshStandardMaterial({
        color: def.color,
        roughness: 0.2,
        metalness: 0.8,
        emissive: def.color,
        emissiveIntensity: 0.5,
      });
      const mesh = new THREE.Mesh(def.geom, mat);
      gyroGroup.add(mesh);
      satellites.push({ mesh, ...def });
    });

    // ── 9. CLICK ENERGY WAVE RIPPLE EFFECT ──────────────────────────────────
    let pulseWave = null;
    const triggerEnergyPulse = () => {
      if (pulseWave) gyroGroup.remove(pulseWave.mesh);
      const pGeo = new THREE.RingGeometry(GLOBE_RADIUS, GLOBE_RADIUS + 0.05, 48);
      const pMat = new THREE.MeshBasicMaterial({
        color: 0x818cf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
      });
      const pMesh = new THREE.Mesh(pGeo, pMat);
      pMesh.rotation.x = Math.PI / 2;
      gyroGroup.add(pMesh);
      pulseWave = { mesh: pMesh, radius: GLOBE_RADIUS, opacity: 0.9 };
    };

    // ── 10. POINTER DRAG & INERTIA INTERACTION ─────────────────────────────
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let velX = 0;
    let velY = 0;
    let targetTiltX = 0;
    let targetTiltY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;

    const onPointerDown = (e) => {
      isDragging = true;
      dragStartX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      dragStartY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      velX = 0;
      velY = 0;
      container.style.cursor = "grabbing";
    };

    const onPointerMove = (e) => {
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

      if (isDragging) {
        const deltaX = clientX - dragStartX;
        const deltaY = clientY - dragStartY;
        velX = deltaX * 0.005;
        velY = deltaY * 0.005;

        masterGroup.rotation.y += velX;
        masterGroup.rotation.x += velY;

        dragStartX = clientX;
        dragStartY = clientY;
      } else {
        // Subtle cursor parallax
        const rect = container.getBoundingClientRect();
        const normX = ((clientX - rect.left) / rect.width) * 2 - 1;
        const normY = -(((clientY - rect.top) / rect.height) * 2 - 1);
        targetTiltY = normX * 0.25;
        targetTiltX = -normY * 0.2;
      }
    };

    const onPointerUp = () => {
      isDragging = false;
      container.style.cursor = "grab";
    };

    const onClick = () => {
      triggerEnergyPulse();
    };

    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp);
    container.addEventListener("click", onClick);

    // ── 11. THEME SWITCH OBSERVER ──────────────────────────────────────────
    const applyTheme = (dark) => {
      isDark = dark;
      themeColors = getColors(dark);

      wireMat.color.set(themeColors.primary);
      wireMat.opacity = themeColors.wireOpacity;

      coreMat.color.set(themeColors.core);
      coreMat.opacity = themeColors.coreOpacity;
      coreMat.emissive.set(themeColors.primary);

      ringEquator.material.color.set(themeColors.primary);
      ringInclined.material.color.set(themeColors.accent);
      ringPolar.material.color.set(themeColors.secondary);

      const cols = globeDots.geometry.attributes.color;
      for (let i = 0; i < dotCount; i++) {
        const y = dotPositions[i * 3 + 1];
        const c = Math.abs(y) > 0.8 ? themeColors.primary : themeColors.accent;
        cols.array[i * 3]     = c.r;
        cols.array[i * 3 + 1] = c.g;
        cols.array[i * 3 + 2] = c.b;
      }
      cols.needsUpdate = true;
      dotMat.opacity = dark ? 0.75 : 0.55;
    };

    const observer = new MutationObserver(() => {
      applyTheme(isCurrentDark());
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // ── 12. RESIZE HANDLER ─────────────────────────────────────────────────
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || 380;
      height = container.clientHeight || 360;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // ── 13. ANIMATION LOOP ─────────────────────────────────────────────────
    let animId;
    const startTime = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startTime) * 0.001;

      // Inertia damping & gentle auto-drift
      if (!isDragging) {
        velX *= 0.94;
        velY *= 0.94;
        masterGroup.rotation.y += 0.004 + velX;
        masterGroup.rotation.x += velY;

        currentTiltX += (targetTiltX - currentTiltX) * 0.06;
        currentTiltY += (targetTiltY - currentTiltY) * 0.06;
        scene.rotation.x = currentTiltX;
        scene.rotation.y = currentTiltY;
      }

      // Gyroscope counter-rotations
      ringEquator.rotation.z  = elapsed * 0.25;
      ringInclined.rotation.z = -elapsed * 0.3;
      ringPolar.rotation.z    = elapsed * 0.18;

      // Satellites orbiting their assigned rings
      satellites.forEach((sat) => {
        const angle = elapsed * sat.speed + sat.offset;
        const rad = sat.orbit.geometry.parameters.innerRadius + 0.01;
        const sx = Math.cos(angle) * rad;
        const sy = Math.sin(angle) * rad;
        const pos = new THREE.Vector3(sx, sy, 0);
        pos.applyEuler(sat.orbit.rotation);
        sat.mesh.position.copy(pos);
        sat.mesh.rotation.y = elapsed * 1.5;
        sat.mesh.rotation.x = elapsed * 1.2;
      });

      // Photons traveling along communication arcs
      photons.forEach((p) => {
        p.progress = (p.progress + p.speed) % 1;
        const pt = p.curve.getPoint(p.progress);
        p.mesh.position.copy(pt);
      });

      // Radar rings expanding from India HQ
      radarRings.forEach((r) => {
        const phase = (elapsed * 0.8 + r.offset) % 1;
        const scale = 1 + phase * 2.8;
        r.mesh.scale.set(scale, scale, scale);
        r.mesh.material.opacity = Math.max(0, 0.85 * (1 - phase));
      });

      // Expanding click energy pulse
      if (pulseWave) {
        pulseWave.radius += 0.035;
        pulseWave.opacity *= 0.94;
        const pScale = pulseWave.radius / GLOBE_RADIUS;
        pulseWave.mesh.scale.set(pScale, pScale, pScale);
        pulseWave.mesh.material.opacity = pulseWave.opacity;
        if (pulseWave.opacity < 0.03) {
          gyroGroup.remove(pulseWave.mesh);
          pulseWave.mesh.geometry.dispose();
          pulseWave.mesh.material.dispose();
          pulseWave = null;
        }
      }

      // Breathing glow core
      const corePulse = 1 + Math.sin(elapsed * 2.2) * 0.035;
      coreMesh.scale.set(corePulse, corePulse, corePulse);

      renderer.render(scene, camera);
    };

    animate();

    // ── CLEANUP ────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("click", onClick);
      window.removeEventListener("resize", handleResize);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      [dotGeo, wireGeo, coreGeo].forEach((g) => g.dispose());
      [dotMat, wireMat, coreMat].forEach((m) => m.dispose());
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        minHeight: 340,
        position: "relative",
        cursor: "grab",
        userSelect: "none",
        touchAction: "pan-y",
      }}
      title="Interactive 3D Holographic Global Network • Drag to spin, click for energy pulse"
    />
  );
}
