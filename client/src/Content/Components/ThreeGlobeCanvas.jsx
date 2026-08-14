"use client";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeGlobeCanvas() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 360;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 1. Holographic Wireframe Sphere (Earth grid)
    const globeGeo = new THREE.SphereGeometry(1.5, 28, 28);
    const globeMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const globeMesh = new THREE.Mesh(globeGeo, globeMat);
    globeGroup.add(globeMesh);

    // 2. Inner Glow Core
    const innerGeo = new THREE.SphereGeometry(1.4, 24, 24);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x312e81,
      transparent: true,
      opacity: 0.25,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    globeGroup.add(innerMesh);

    // 3. Location Network Nodes (Pulsing connection points on globe)
    const nodeCount = 36;
    const nodePositions = [];
    const nodeGeo = new THREE.BufferGeometry();

    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;
      const r = 1.51;

      const x = r * Math.cos(theta) * Math.sin(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(phi);
      nodePositions.push(x, y, z);
    }

    nodeGeo.setAttribute("position", new THREE.Float32BufferAttribute(nodePositions, 3));
    const nodeMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.08,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });
    const nodes = new THREE.Points(nodeGeo, nodeMat);
    globeGroup.add(nodes);

    // 4. Connecting Arcs (Great circle bezier arcs)
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xec4899,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });

    const arcLines = new THREE.Group();
    for (let i = 0; i < 8; i++) {
      const idxA = Math.floor(Math.random() * nodeCount) * 3;
      const idxB = Math.floor(Math.random() * nodeCount) * 3;

      const vA = new THREE.Vector3(nodePositions[idxA], nodePositions[idxA + 1], nodePositions[idxA + 2]);
      const vB = new THREE.Vector3(nodePositions[idxB], nodePositions[idxB + 1], nodePositions[idxB + 2]);

      // Control point elevated above midpoint
      const mid = vA.clone().add(vB).multiplyScalar(0.5);
      const midLen = mid.length();
      if (midLen > 0) mid.normalize().multiplyScalar(1.5 + vA.distanceTo(vB) * 0.4);

      const curve = new THREE.QuadraticBezierCurve3(vA, mid, vB);
      const points = curve.getPoints(24);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      const arcLine = new THREE.Line(arcGeo, lineMat);
      arcLines.add(arcLine);
    }
    globeGroup.add(arcLines);

    // 5. Equatorial Orbital Ring
    const ringGeo = new THREE.RingGeometry(1.85, 1.88, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2.3;
    globeGroup.add(ringMesh);

    // 6. Interactive Mouse Drag / Tilt
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      globeGroup.rotation.y += deltaX * 0.008;
      globeGroup.rotation.x += deltaY * 0.008;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => { isDragging = false; };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // Animation loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      if (!isDragging) {
        globeGroup.rotation.y += 0.006;
        globeGroup.rotation.x = Math.sin(time * 0.4) * 0.15;
      }

      ringMesh.rotation.z = time * 0.15;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      [globeGeo, innerGeo, nodeGeo, ringGeo].forEach(g => g.dispose());
      [globeMat, innerMat, nodeMat, lineMat, ringMat].forEach(m => m.dispose());
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        minHeight: 320,
        position: "relative",
        cursor: "grab",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    />
  );
}
