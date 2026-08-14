"use client";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroCanvas3D() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const width = container.clientWidth || 440;
    const height = container.clientHeight || 440;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5.2;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Group to hold all 3D objects for mouse rotation
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x6366f1, 80, 50); // Indigo glow
    pointLight1.position.set(3, 4, 3);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xec4899, 60, 50); // Pink accent
    pointLight2.position.set(-4, -3, 2);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0x38bdf8, 70, 50); // Cyan rim light
    pointLight3.position.set(0, 5, -4);
    scene.add(pointLight3);

    // 5. Central 3D Geometry: Futuristic Icosahedron & Core
    // Outer Wireframe Crystal
    const outerGeo = new THREE.IcosahedronGeometry(1.6, 1);
    const wireframeMat = new THREE.MeshStandardMaterial({
      color: 0x818cf8,
      wireframe: true,
      emissive: 0x4338ca,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.8,
    });
    const outerMesh = new THREE.Mesh(outerGeo, wireframeMat);
    mainGroup.add(outerMesh);

    // Inner Glassy Core
    const innerGeo = new THREE.OctahedronGeometry(0.9, 0);
    const innerMat = new THREE.MeshPhysicalMaterial({
      color: 0x6366f1,
      emissive: 0x2e1065,
      emissiveIntensity: 0.8,
      roughness: 0.1,
      metalness: 0.9,
      transmission: 0.6,
      ior: 1.5,
      reflectivity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    mainGroup.add(innerMesh);

    // Innermost Glowing Nucleus
    const nucleusGeo = new THREE.SphereGeometry(0.35, 32, 32);
    const nucleusMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });
    const nucleus = new THREE.Mesh(nucleusGeo, nucleusMat);
    mainGroup.add(nucleus);

    // 6. Glowing Vertices (Point Nodes)
    const pointsGeo = new THREE.IcosahedronGeometry(1.6, 1);
    const pointsMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.08,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });
    const pointsMesh = new THREE.Points(pointsGeo, pointsMat);
    mainGroup.add(pointsMesh);

    // 7. Orbiting Rings
    const ringGroup = new THREE.Group();
    mainGroup.add(ringGroup);

    // Ring 1 (Tilted Ring)
    const ring1Geo = new THREE.TorusGeometry(2.1, 0.02, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      transparent: true,
      opacity: 0.65,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    ringGroup.add(ring1);

    // Ring 2 (Counter Ring)
    const ring2Geo = new THREE.TorusGeometry(2.35, 0.015, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0xec4899,
      transparent: true,
      opacity: 0.45,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = Math.PI / 3;
    ringGroup.add(ring2);

    // 8. Particle Cloud (Star Dust)
    const particleCount = 180;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 2.0 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      particlePositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i + 2] = radius * Math.cos(phi);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xa5b4fc,
      size: 0.04,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particles);

    // 9. Interactive Mouse Tracking
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotationY = x * 0.8;
      targetRotationX = -y * 0.8;
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((touch.clientY - rect.top) / rect.height) * 2 - 1);
        targetRotationY = x * 0.8;
        targetRotationX = -y * 0.8;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    // 10. Responsive resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // 11. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth inertia towards mouse position
      currentRotationX += (targetRotationX - currentRotationX) * 0.05;
      currentRotationY += (targetRotationY - currentRotationY) * 0.05;

      mainGroup.rotation.x = currentRotationX + Math.sin(elapsedTime * 0.5) * 0.08;
      mainGroup.rotation.y = currentRotationY + elapsedTime * 0.25;

      // Independent rotations for internal layers
      innerMesh.rotation.x = -elapsedTime * 0.4;
      innerMesh.rotation.y = elapsedTime * 0.5;

      ring1.rotation.z = elapsedTime * 0.3;
      ring2.rotation.z = -elapsedTime * 0.25;

      // Gentle floating pulse
      const scalePulse = 1 + Math.sin(elapsedTime * 1.5) * 0.03;
      outerMesh.scale.set(scalePulse, scalePulse, scalePulse);
      pointsMesh.scale.set(scalePulse, scalePulse, scalePulse);

      // Light rotation
      pointLight1.position.x = Math.sin(elapsedTime * 0.7) * 4;
      pointLight1.position.z = Math.cos(elapsedTime * 0.7) * 4;

      renderer.render(scene, camera);
    };

    animate();

    // 12. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      // Dispose geometries & materials
      [outerGeo, innerGeo, nucleusGeo, pointsGeo, ring1Geo, ring2Geo, particleGeo].forEach(g => g.dispose());
      [wireframeMat, innerMat, nucleusMat, pointsMat, ring1Mat, ring2Mat, particleMat].forEach(m => m.dispose());
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        minHeight: 400,
        position: "relative",
        cursor: "grab",
      }}
    />
  );
}
