"use client";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function DeveloperWorkspace3D() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 360;

    // ── SCENE & CAMERA (Isometric 3/4 view) ───────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(3.8, 3.2, 5.2);
    camera.lookAt(0, 0.2, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const sceneGroup = new THREE.Group();
    scene.add(sceneGroup);

    // ── LIGHTING ──────────────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xf0eeff, 1.2);
    scene.add(ambientLight);

    const mainSun = new THREE.DirectionalLight(0xffffff, 1.8);
    mainSun.position.set(6, 9, 5);
    mainSun.castShadow = true;
    mainSun.shadow.mapSize.width = 1024;
    mainSun.shadow.mapSize.height = 1024;
    scene.add(mainSun);

    // Neon Cyber & Lofi Accent Lights
    const neonCyan = new THREE.PointLight(0x38bdf8, 25, 6);
    neonCyan.position.set(-1.2, 1.8, 0.5);
    scene.add(neonCyan);

    const neonPurple = new THREE.PointLight(0xa855f7, 28, 7);
    neonPurple.position.set(2.0, 1.5, -1.0);
    scene.add(neonPurple);

    const screenLight = new THREE.PointLight(0x818cf8, 20, 4);
    screenLight.position.set(-0.3, 0.8, 0.8);
    scene.add(screenLight);

    // ── MATERIAL HELPERS ──────────────────────────────────────────────────
    const createMat = (color, roughness = 0.4, metalness = 0.1, emissive = null, emissiveIntensity = 0) => {
      const m = new THREE.MeshStandardMaterial({ color, roughness, metalness });
      if (emissive) {
        m.emissive = new THREE.Color(emissive);
        m.emissiveIntensity = emissiveIntensity;
      }
      return m;
    };

    const makeBox = (w, h, d, mat, shadow = true) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      mesh.castShadow = shadow;
      mesh.receiveShadow = shadow;
      return mesh;
    };

    const makeCyl = (rt, rb, h, seg, mat, shadow = true) => {
      const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat);
      mesh.castShadow = shadow;
      mesh.receiveShadow = shadow;
      return mesh;
    };

    const makeSph = (r, ws, hs, mat, shadow = true) => {
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, ws, hs), mat);
      mesh.castShadow = shadow;
      mesh.receiveShadow = shadow;
      return mesh;
    };

    // ── 1. ISOMETRIC ROOM PLATFORM / DESK BASE ────────────────────────────
    const platformGrp = new THREE.Group();
    sceneGroup.add(platformGrp);

    // Glowing circular room base
    const baseFloor = makeCyl(2.6, 2.7, 0.16, 48, createMat(0x131127, 0.7, 0.2));
    baseFloor.position.y = -1.25;
    platformGrp.add(baseFloor);

    // Neon floor ring
    const ringGeo = new THREE.TorusGeometry(2.65, 0.025, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x818cf8 });
    const neonRing = new THREE.Mesh(ringGeo, ringMat);
    neonRing.rotation.x = Math.PI / 2;
    neonRing.position.y = -1.17;
    platformGrp.add(neonRing);

    // Desk Top (Warm Walnut / Modern Dark Wood)
    const desk = makeBox(3.4, 0.1, 1.8, createMat(0x1e1b4b, 0.3, 0.6));
    desk.position.set(0, -0.65, 0);
    platformGrp.add(desk);

    // LED Strip Under Desk
    const ledStrip = makeBox(3.4, 0.02, 0.02, new THREE.MeshBasicMaterial({ color: 0xa855f7 }));
    ledStrip.position.set(0, -0.69, 0.89);
    platformGrp.add(ledStrip);

    // Desk Legs
    [[-1.5, 0.7], [1.5, 0.7], [-1.5, -0.7], [1.5, -0.7]].forEach(([x, z]) => {
      const leg = makeCyl(0.05, 0.05, 1.1, 16, createMat(0x312e81, 0.2, 0.8));
      leg.position.set(x, -1.2, z);
      platformGrp.add(leg);
    });

    // RGB Desk Mat (Extra Large CS setup mat)
    const matMesh = makeBox(2.6, 0.015, 1.2, createMat(0x0f0e26, 0.8, 0.1));
    matMesh.position.set(0, -0.59, 0.15);
    platformGrp.add(matMesh);

    // ── 2. GAMING / DEV ERGONOMIC CHAIR ──────────────────────────────────
    const chairGrp = new THREE.Group();
    chairGrp.position.set(0.15, -0.6, 0.85);
    sceneGroup.add(chairGrp);

    // Seat Cushion
    const seat = makeBox(0.85, 0.12, 0.85, createMat(0x3730a3, 0.5, 0.3));
    chairGrp.add(seat);

    // High Ergonomic Backrest with lumbar contour
    const backrest = makeBox(0.75, 1.15, 0.12, createMat(0x312e81, 0.5, 0.4));
    backrest.position.set(0, 0.58, 0.4);
    backrest.rotation.x = -0.08;
    chairGrp.add(backrest);

    // Headrest
    const headrest = makeBox(0.48, 0.25, 0.14, createMat(0x4338ca, 0.4, 0.3));
    headrest.position.set(0, 1.22, 0.45);
    chairGrp.add(headrest);

    // ── 3. ANIME CS STUDENT CHARACTER ─────────────────────────────────────
    const charGrp = new THREE.Group();
    charGrp.position.set(0.15, -0.15, 0.72);
    sceneGroup.add(charGrp);

    // Skin Material (Anime warm peach skin tone)
    const skinMat = createMat(0xfde68a, 0.35, 0.0);
    // Anime Dark Hair Material
    const hairMat = createMat(0x1e1b4b, 0.75, 0.1);
    // Dev Hoodie Material (Deep Indigo / Cyber Violet with soft matte feel)
    const hoodieMat = createMat(0x4338ca, 0.6, 0.1);

    // Torso / Comfortable Oversized Hoodie
    const torso = makeBox(0.68, 0.78, 0.52, hoodieMat);
    torso.position.set(0, 0.22, 0);
    charGrp.add(torso);

    // Hoodie Pocket & Front Kangaroo Stripe
    const pocket = makeBox(0.44, 0.26, 0.1, createMat(0x3730a3, 0.6, 0.1));
    pocket.position.set(0, 0.08, -0.23);
    charGrp.add(pocket);

    // Hoodie Logo / Mini Binary Patch "<dev/>"
    const patch = makeBox(0.18, 0.08, 0.02, new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
    patch.position.set(0.16, 0.42, -0.265);
    charGrp.add(patch);

    // Neck
    const neck = makeCyl(0.13, 0.14, 0.18, 16, skinMat);
    neck.position.set(0, 0.68, -0.04);
    charGrp.add(neck);

    // ── HEAD & ANIME FACE ─────────────────────────────────────────────────
    const headGrp = new THREE.Group();
    headGrp.position.set(0, 0.98, -0.06);
    charGrp.add(headGrp);

    // Head Base (Anime proportion)
    const head = makeSph(0.38, 32, 32, skinMat);
    head.scale.set(1, 1.08, 0.96);
    headGrp.add(head);

    // Anime Hair (Layered Spikes & Side Bangs)
    const hairBase = new THREE.Mesh(
      new THREE.SphereGeometry(0.395, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.6),
      hairMat
    );
    hairBase.position.set(0, 0.06, 0);
    headGrp.add(hairBase);

    // Stylized Anime Bangs
    const bangs = [
      { x: -0.22, y: 0.28, z: -0.32, rx: 0.35, rz: 0.35, s: 0.08 },
      { x: -0.08, y: 0.34, z: -0.36, rx: 0.2,  rz: 0.1,  s: 0.09 },
      { x:  0.08, y: 0.34, z: -0.36, rx: 0.2,  rz: -0.1, s: 0.09 },
      { x:  0.22, y: 0.28, z: -0.32, rx: 0.35, rz: -0.35, s: 0.08 },
      { x: -0.34, y: 0.05, z: -0.15, rx: 0.1,  rz: 0.2,  s: 0.07 },
      { x:  0.34, y: 0.05, z: -0.15, rx: 0.1,  rz: -0.2, s: 0.07 },
    ];
    bangs.forEach(({ x, y, z, rx, rz, s }) => {
      const spike = new THREE.Mesh(new THREE.ConeGeometry(s, 0.28, 6), hairMat);
      spike.position.set(x, y, z);
      spike.rotation.x = rx;
      spike.rotation.z = rz;
      headGrp.add(spike);
    });

    // Large Anime Eyes (Front Facing towards Desk & Camera 3/4)
    [-0.14, 0.14].forEach((xPos) => {
      // Eye White
      const eyeWhite = makeSph(0.072, 16, 16, createMat(0xffffff, 0.2));
      eyeWhite.scale.set(1, 1.15, 0.35);
      eyeWhite.position.set(xPos, 0.02, -0.35);
      headGrp.add(eyeWhite);

      // Vivid Blue Iris
      const iris = makeSph(0.048, 16, 16, createMat(0x2563eb, 0.2, 0, 0x38bdf8, 0.3));
      iris.scale.set(1, 1.15, 0.25);
      iris.position.set(xPos, 0.02, -0.375);
      headGrp.add(iris);

      // Eye Sparkle Shine
      const shine = makeSph(0.018, 8, 8, new THREE.MeshBasicMaterial({ color: 0xffffff }));
      shine.position.set(xPos + 0.022, 0.045, -0.395);
      headGrp.add(shine);

      // Eyebrows
      const brow = makeBox(0.12, 0.02, 0.02, hairMat);
      brow.position.set(xPos, 0.13, -0.36);
      brow.rotation.z = xPos < 0 ? 0.1 : -0.1;
      headGrp.add(brow);
    });

    // Cute Anime Glasses (Round Wireframe with subtle blue AR reflection)
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      roughness: 0.1,
      metalness: 0.9,
    });
    const lensMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      roughness: 0.05,
      transmission: 0.88,
      transparent: true,
      opacity: 0.45,
    });

    [-0.14, 0.14].forEach((xPos) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.082, 0.012, 10, 24), glassMat);
      ring.position.set(xPos, 0.02, -0.38);
      headGrp.add(ring);

      const lens = new THREE.Mesh(new THREE.CircleGeometry(0.075, 18), lensMat);
      lens.position.set(xPos, 0.02, -0.38);
      headGrp.add(lens);
    });

    // Glasses Bridge
    const gBridge = makeBox(0.065, 0.012, 0.012, glassMat);
    gBridge.position.set(0, 0.02, -0.39);
    headGrp.add(gBridge);

    // Glowing Over-Ear Gaming / Coding Headphones 🎧
    const hpMat = createMat(0x6366f1, 0.3, 0.7, 0x818cf8, 0.4);
    const hpCushionMat = createMat(0x1e1b4b, 0.8, 0.2);

    [-1, 1].forEach((side) => {
      const earCup = makeCyl(0.11, 0.11, 0.09, 20, hpMat);
      earCup.rotation.z = Math.PI / 2;
      earCup.position.set(side * 0.4, 0.02, -0.04);
      headGrp.add(earCup);

      const cushion = makeCyl(0.12, 0.12, 0.05, 20, hpCushionMat);
      cushion.rotation.z = Math.PI / 2;
      cushion.position.set(side * 0.36, 0.02, -0.04);
      headGrp.add(cushion);
    });

    // Headphone Arch
    const hpArch = new THREE.Mesh(new THREE.TorusGeometry(0.41, 0.03, 10, 32, Math.PI), hpMat);
    hpArch.rotation.z = -Math.PI;
    hpArch.position.set(0, 0.06, -0.04);
    headGrp.add(hpArch);

    // ── ARMS & ACTIVE TYPING HANDS ────────────────────────────────────────
    const armLGrp = new THREE.Group();
    armLGrp.position.set(-0.42, 0.45, -0.05);
    const armL = makeCyl(0.09, 0.08, 0.62, 14, hoodieMat);
    armL.rotation.x = -Math.PI / 2.6;
    armL.rotation.z = Math.PI / 6;
    armL.position.set(0, -0.2, -0.22);
    armLGrp.add(armL);
    const handL = makeSph(0.085, 12, 12, skinMat);
    handL.position.set(-0.06, -0.44, -0.46);
    armLGrp.add(handL);
    charGrp.add(armLGrp);

    const armRGrp = new THREE.Group();
    armRGrp.position.set(0.42, 0.45, -0.05);
    const armR = makeCyl(0.09, 0.08, 0.62, 14, hoodieMat);
    armR.rotation.x = -Math.PI / 2.6;
    armR.rotation.z = -Math.PI / 6;
    armR.position.set(0, -0.2, -0.22);
    armRGrp.add(armR);
    const handR = makeSph(0.085, 12, 12, skinMat);
    handR.position.set(0.06, -0.44, -0.46);
    armRGrp.add(handR);
    charGrp.add(armRGrp);

    // ── 4. CS WORKSPACE TECH GEAR ─────────────────────────────────────────
    const gearGrp = new THREE.Group();
    sceneGroup.add(gearGrp);

    // A. Main Laptop (MacBook Pro style, angled towards user)
    const laptopGrp = new THREE.Group();
    laptopGrp.position.set(0.1, -0.58, 0.15);
    laptopGrp.rotation.y = 0.05;
    gearGrp.add(laptopGrp);

    // Laptop Base
    const lpBase = makeBox(1.15, 0.035, 0.8, createMat(0x312e81, 0.25, 0.85));
    laptopGrp.add(lpBase);

    // Trackpad
    const trackpad = makeBox(0.34, 0.005, 0.22, createMat(0x4338ca, 0.4, 0.3));
    trackpad.position.set(0, 0.02, 0.24);
    laptopGrp.add(trackpad);

    // Keyboard Area with glowing keycaps
    const kbArea = makeBox(0.95, 0.008, 0.44, createMat(0x1e1b4b, 0.7, 0.2));
    kbArea.position.set(0, 0.02, -0.1);
    laptopGrp.add(kbArea);

    // Laptop Open Screen (Tilted)
    const screenGrp = new THREE.Group();
    screenGrp.position.set(0, 0.015, -0.39);
    screenGrp.rotation.x = 0.32; // Open lid angle
    laptopGrp.add(screenGrp);

    const lid = makeBox(1.15, 0.76, 0.025, createMat(0x312e81, 0.25, 0.85));
    lid.position.set(0, 0.38, 0);
    screenGrp.add(lid);

    // Glowing Code Screen (VS Code theme)
    const codeScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(1.08, 0.68),
      new THREE.MeshBasicMaterial({ color: 0x09071a })
    );
    codeScreen.position.set(0, 0.38, 0.015);
    screenGrp.add(codeScreen);

    // Code Lines on Laptop Screen
    const lineColors = [0x38bdf8, 0xa78bfa, 0x34d399, 0xf472b6, 0xfbbf24, 0x93c5fd];
    const animatedCodeLines = [];
    for (let r = 0; r < 7; r++) {
      const len = 0.25 + Math.random() * 0.55;
      const indent = r % 3 === 0 ? 0 : (r % 2 === 0 ? 0.08 : 0.16);
      const cMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(len, 0.032),
        new THREE.MeshBasicMaterial({ color: lineColors[r % lineColors.length], transparent: true, opacity: 0.9 })
      );
      cMesh.position.set(-0.48 + indent + len / 2, 0.62 - r * 0.075, 0.018);
      screenGrp.add(cMesh);
      animatedCodeLines.push({ mesh: cMesh, speed: 1.2 + Math.random(), offset: Math.random() * Math.PI });
    }

    // B. Secondary Vertical Monitor (Ultimate CS Student Flex)
    const vertMonGrp = new THREE.Group();
    vertMonGrp.position.set(-1.05, -0.58, -0.15);
    vertMonGrp.rotation.y = 0.38;
    gearGrp.add(vertMonGrp);

    const vStand = makeCyl(0.04, 0.04, 0.6, 12, createMat(0x312e81, 0.3, 0.8));
    vStand.position.set(0, 0.3, 0);
    vertMonGrp.add(vStand);

    const vBezel = makeBox(0.68, 1.25, 0.04, createMat(0x1e1b4b, 0.3, 0.85));
    vBezel.position.set(0, 0.72, 0);
    vertMonGrp.add(vBezel);

    const vDisplay = new THREE.Mesh(
      new THREE.PlaneGeometry(0.62, 1.16),
      new THREE.MeshBasicMaterial({ color: 0x050410 })
    );
    vDisplay.position.set(0, 0.72, 0.022);
    vertMonGrp.add(vDisplay);

    // Matrix / Terminal text on Vertical Monitor
    for (let vr = 0; vr < 14; vr++) {
      const vLen = 0.18 + Math.random() * 0.38;
      const vLine = new THREE.Mesh(
        new THREE.PlaneGeometry(vLen, 0.028),
        new THREE.MeshBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.8 })
      );
      vLine.position.set(-0.25 + vLen / 2, 1.2 - vr * 0.072, 0.025);
      vertMonGrp.add(vLine);
    }

    // ── 5. RELATABLE CS STUDENT DESK ACCESSORIES ──────────────────────────
    // A. Coffee Mug with Steam (Essential Fuel)
    const mug = makeCyl(0.09, 0.08, 0.22, 16, createMat(0xec4899, 0.3, 0.1, 0xf472b6, 0.2));
    mug.position.set(0.95, -0.52, 0.2);
    gearGrp.add(mug);

    const mugHandle = new THREE.Mesh(
      new THREE.TorusGeometry(0.06, 0.016, 8, 16, Math.PI),
      createMat(0xdb2777, 0.3, 0.1)
    );
    mugHandle.rotation.y = Math.PI / 2;
    mugHandle.position.set(1.06, -0.52, 0.2);
    gearGrp.add(mugHandle);

    // Rising Steam Lines
    const steamLines = [];
    for (let s = 0; s < 3; s++) {
      const pts = [];
      for (let p = 0; p <= 5; p++) {
        pts.push(new THREE.Vector3(Math.sin(p * 1.3 + s) * 0.015, p * 0.05, 0));
      }
      const stGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const stLine = new THREE.Line(stGeo, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 }));
      stLine.position.set(0.93 + s * 0.04, -0.4, 0.2);
      gearGrp.add(stLine);
      steamLines.push({ line: stLine, seed: s * 1.5 });
    }

    // B. Stack of CS Books (Algorithms, OS, React)
    const bookColors = [0x6366f1, 0x38bdf8, 0x10b981];
    bookColors.forEach((color, i) => {
      const book = makeBox(0.42, 0.075, 0.32, createMat(color, 0.6, 0.1));
      book.position.set(1.15, -0.58 + i * 0.08, -0.35);
      book.rotation.y = 0.15 * (i - 1);
      gearGrp.add(book);
    });

    // C. Desk Succulent Plant (Lofi Desk Aesthetic)
    const pot = makeCyl(0.12, 0.09, 0.16, 14, createMat(0xe2e8f0, 0.4, 0.1));
    pot.position.set(-1.15, -0.54, 0.45);
    gearGrp.add(pot);

    const plantMat = createMat(0x22c55e, 0.5, 0.1);
    for (let leaf = 0; leaf < 5; leaf++) {
      const leafMesh = makeSph(0.06, 8, 8, plantMat);
      const angle = (leaf / 5) * Math.PI * 2;
      leafMesh.position.set(-1.15 + Math.cos(angle) * 0.05, -0.43, 0.45 + Math.sin(angle) * 0.05);
      leafMesh.scale.set(1, 1.4, 0.7);
      gearGrp.add(leafMesh);
    }

    // D. Sticky Notes (relatable TODOs)
    const stickyNote = makeBox(0.24, 0.01, 0.24, new THREE.MeshBasicMaterial({ color: 0xfef08a }));
    stickyNote.position.set(-0.65, -0.58, 0.55);
    stickyNote.rotation.y = 0.2;
    gearGrp.add(stickyNote);

    // ── 6. FLOATING HOLOGRAPHIC TECH BADGES & SYMBOLS ─────────────────────
    const floatingBadges = [];
    const holoGrp = new THREE.Group();
    sceneGroup.add(holoGrp);

    // A. React Atom Hologram (Cyan glowing rings)
    const atomGrp = new THREE.Group();
    atomGrp.position.set(-1.6, 1.2, -0.2);
    holoGrp.add(atomGrp);

    const atomCenter = makeSph(0.08, 12, 12, new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
    atomGrp.add(atomCenter);

    for (let ringIdx = 0; ringIdx < 3; ringIdx++) {
      const aRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.26, 0.02, 8, 28),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.8 })
      );
      aRing.rotation.x = (ringIdx * Math.PI) / 3;
      aRing.rotation.y = (ringIdx * Math.PI) / 4;
      atomGrp.add(aRing);
    }
    floatingBadges.push({ obj: atomGrp, baseY: 1.2, speed: 1.5, rotSpeed: 1.2 });

    // B. Holographic Terminal Window ">_"
    const termBadge = makeBox(0.55, 0.36, 0.02, new THREE.MeshBasicMaterial({ color: 0x1e1b4b, transparent: true, opacity: 0.85 }));
    termBadge.position.set(1.6, 1.4, -0.4);
    holoGrp.add(termBadge);

    const termPrompt = new THREE.Mesh(
      new THREE.PlaneGeometry(0.35, 0.04),
      new THREE.MeshBasicMaterial({ color: 0x34d399 })
    );
    termPrompt.position.set(1.6, 1.45, -0.385);
    holoGrp.add(termPrompt);
    floatingBadges.push({ obj: termBadge, baseY: 1.4, speed: 1.8, rotSpeed: 0 });

    // C. Floating "{ }" & "< />" Code Symbols
    const brackets = [
      { color: 0xa855f7, x: -1.7, y: 0.2, z: 0.6 },
      { color: 0xec4899, x: 1.8,  y: 0.4, z: 0.5 },
    ];
    brackets.forEach(({ color, x, y, z }, idx) => {
      const bMesh = new THREE.Mesh(
        new THREE.TorusGeometry(0.18, 0.026, 8, 20, Math.PI * 1.2),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.85 })
      );
      bMesh.position.set(x, y, z);
      bMesh.rotation.z = idx === 0 ? Math.PI / 2 : -Math.PI / 2;
      holoGrp.add(bMesh);
      floatingBadges.push({ obj: bMesh, baseY: y, speed: 1.3 + idx * 0.4, rotSpeed: 0.8 });
    });

    // ── 7. AMBIENT TECH PARTICLES ─────────────────────────────────────────
    const particleCount = 100;
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePos[i * 3]     = (Math.random() - 0.5) * 6.5;
      particlePos[i * 3 + 1] = (Math.random() - 0.5) * 4.5 + 0.5;
      particlePos[i * 3 + 2] = (Math.random() - 0.5) * 5.0;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xa5b4fc,
      size: 0.04,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ── 8. INTERACTIVE MOUSE PARALLAX / ROTATION ──────────────────────────
    let targetRotY = 0;
    let targetRotX = 0;
    let currentRotY = 0;
    let currentRotX = 0;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        targetRotY += deltaX * 0.008;
        targetRotX += deltaY * 0.005;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      } else {
        targetRotY = normX * 0.45;
        targetRotX = -normY * 0.25;
      }
    };

    const onPointerDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    container.addEventListener("pointermove", onPointerMove, { passive: true });
    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 400;
      const h = container.clientHeight || 360;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // ── 9. ANIMATION LOOP ─────────────────────────────────────────────────
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Smooth camera / scene tilt
      currentRotY += (targetRotY - currentRotY) * 0.06;
      currentRotX += (targetRotX - currentRotX) * 0.06;
      sceneGroup.rotation.y = currentRotY + Math.sin(t * 0.4) * 0.04;
      sceneGroup.rotation.x = currentRotX + Math.cos(t * 0.3) * 0.02;

      // Realistic typing rhythm (alternating arm movements)
      armLGrp.rotation.x = Math.sin(t * 10.0) * 0.06;
      armRGrp.rotation.x = Math.cos(t * 10.0) * 0.06;

      // Character gentle breathing & nod
      charGrp.position.y = -0.15 + Math.sin(t * 2.5) * 0.008;
      headGrp.rotation.y = Math.sin(t * 0.8) * 0.04;
      headGrp.rotation.x = Math.sin(t * 1.6) * 0.02;

      // Pulse screen light
      screenLight.intensity = 18 + Math.sin(t * 2.8) * 6;

      // Code line flickering effect
      animatedCodeLines.forEach(({ mesh, speed, offset }) => {
        mesh.material.opacity = 0.6 + Math.sin(t * speed + offset) * 0.35;
      });

      // Floating Hologram Badges bob & spin
      floatingBadges.forEach(({ obj, baseY, speed, rotSpeed }) => {
        obj.position.y = baseY + Math.sin(t * speed) * 0.1;
        if (rotSpeed > 0) {
          obj.rotation.y = t * rotSpeed;
        }
      });

      // Steam gentle rising drift
      steamLines.forEach(({ line, seed }) => {
        line.position.y = -0.4 + ((t * 0.15 + seed) % 0.35);
        line.material.opacity = 0.1 + Math.sin(t * 2.0 + seed) * 0.2;
      });

      // Particle slow orbit
      particles.rotation.y = t * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("resize", onResize);
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        minHeight: 350,
        position: "relative",
        cursor: "grab",
        userSelect: "none",
        touchAction: "none",
      }}
    />
  );
}
