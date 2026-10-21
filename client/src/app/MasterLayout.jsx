"use client";

import Footer from "@/Content/Components/Footer";
import Navbar from "@/Content/Components/Navbar";
import Store from "@/Content/Redux/Store";
import ScrollRestoration from "@/Content/ScrollRestoration";
import { ThemeProvider } from "@/Content/ThemeContext";
import React from "react";
import { Provider } from "react-redux";
import dynamic from "next/dynamic";
import Preloader from "@/Content/Components/Preloader";
import ScrollManager from "@/Content/Components/ScrollManager";

const ThreeBackgroundCanvas = dynamic(() => import("@/Content/Components/ThreeBackgroundCanvas"), { ssr: false });

export default function MasterLayout({ children }) {
  return (
    <ThemeProvider>
      <Provider store={Store}>
        <Preloader />
        <ScrollManager />
        {/* ── Shared Page Background Layer: base theme gradient ── */}
        <div className="page-bg-layer" aria-hidden="true" />
        {/* ── Shared Animated Three.js Particle Background ── */}
        <ThreeBackgroundCanvas />
        <Navbar />
        <ScrollRestoration />
        {children}
        <Footer />
      </Provider>
    </ThemeProvider>
  );
}

