"use client";
import React from "react";

export default function Template({ children }) {
  return (
    <div className="page-route-transition">
      {/* Subtle top ambient glowing transition shimmer on route entry */}
      <div className="route-enter-progress-bar" aria-hidden="true" />
      {children}
    </div>
  );
}
