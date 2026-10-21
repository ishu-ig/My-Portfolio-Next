"use client";
import React from "react";
import DeveloperWorkspace3D from "./DeveloperWorkspace3D";

export default function HeroCanvas3D() {
  return (
    <div
      className="hero-3d-canvas-container"
      style={{
        width: "100%",
        height: "100%",
        minHeight: 440,
        position: "relative",
        cursor: "grab",
        userSelect: "none",
        touchAction: "pan-y",
      }}
      title="Interactive 3D Developer Workstation • Move cursor to tilt, drag to rotate"
    >
      <DeveloperWorkspace3D />
    </div>
  );
}
