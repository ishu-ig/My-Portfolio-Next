"use client";

import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import AOS from "aos";

import { getAbout } from "../Redux/ActionCreators/AboutActionCreators";
import { getSkill } from "../Redux/ActionCreators/SkillActionCreators";
import { getPortfolio } from "../Redux/ActionCreators/PortfolioActionCreators";
import { getService } from "../Redux/ActionCreators/ServiceActionCreators";
import { getEducation } from "../Redux/ActionCreators/EducationActionCreators";
import { getExperience } from "../Redux/ActionCreators/ExperienceActionCreators";
import { getCertificate } from "../Redux/ActionCreators/CertificateActionCreators";
import { getTestimonial } from "../Redux/ActionCreators/TestimonialActionCreators";
import { getAchievement } from "../Redux/ActionCreators/AchievementActionCreators";
import { getBlog } from "../Redux/ActionCreators/BlogActionCreators";
import { getSkillCategory } from "../Redux/ActionCreators/SkillCategoryActionCreators";
import { getProjectCategory } from "../Redux/ActionCreators/ProjectCategoryActionCreators";

export default function Preloader() {
  const dispatch = useDispatch();

  // Redux state selectors to track real data loading
  const AboutStateData = useSelector((state) => state.AboutStateData);
  const SkillStateData = useSelector((state) => state.SkillStateData);
  const PortfolioStateData = useSelector((state) => state.PortfolioStateData);
  const ServiceStateData = useSelector((state) => state.ServiceStateData);
  const EducationStateData = useSelector((state) => state.EducationStateData);
  const ExperienceStateData = useSelector((state) => state.ExperienceStateData);
  const CertificateStateData = useSelector((state) => state.CertificateStateData);
  const TestimonialStateData = useSelector((state) => state.TestimonialStateData);
  const AchievementStateData = useSelector((state) => state.AchievementStateData);
  const BlogStateData = useSelector((state) => state.BlogStateData);
  const SkillCategoryStateData = useSelector((state) => state.SkillCategoryStateData);
  const ProjectCategoryStateData = useSelector((state) => state.ProjectCategoryStateData);

  const [progress, setProgress] = useState(15);
  const [statusText, setStatusText] = useState("Initializing portfolio engine...");
  const [isExiting, setIsExiting] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  const dataFinishedRef = useRef(false);
  const minTimeElapsedRef = useRef(false);
  const allSettledRef = useRef(false);

  // Dispatch initial data fetches immediately on mount
  useEffect(() => {
    dispatch(getAbout());
    dispatch(getSkill());
    dispatch(getSkillCategory());
    dispatch(getPortfolio());
    dispatch(getProjectCategory());
    dispatch(getService());
    dispatch(getEducation());
    dispatch(getExperience());
    dispatch(getCertificate());
    dispatch(getTestimonial());
    dispatch(getAchievement());
    dispatch(getBlog());

    // Lock page scroll while preloader is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [dispatch]);

  // Track settled network requests in parallel
  useEffect(() => {
    const BASE_URL = (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"))
      ? "http://localhost:8000"
      : (process.env.NEXT_PUBLIC_BACKEND_SERVER || "https://admin.ishaanportfolio.com");
    if (!BASE_URL) return;

    const endpoints = [
      "about",
      "skill",
      "portfolio",
      "service",
      "education",
      "experience",
      "certificate",
      "testimonial",
      "blog",
      "skillcategory",
      "projectcategory",
    ];

    Promise.allSettled(
      endpoints.map((ep) =>
        fetch(`${BASE_URL}/api/${ep}`, { method: "GET" }).catch(() => null)
      )
    ).then(() => {
      allSettledRef.current = true;
    });
  }, []);

  // Calculate actual loaded collections in Redux
  const loadedCount = useMemo(() => {
    let count = 0;
    if (AboutStateData?.length > 0) count++;
    if (SkillStateData?.length > 0) count++;
    if (PortfolioStateData?.length > 0) count++;
    if (ServiceStateData?.length > 0) count++;
    if (EducationStateData?.length > 0) count++;
    if (ExperienceStateData?.length > 0) count++;
    if (CertificateStateData?.length > 0) count++;
    if (TestimonialStateData?.length > 0) count++;
    if (AchievementStateData?.length > 0) count++;
    if (BlogStateData?.length > 0) count++;
    return count;
  }, [
    AboutStateData,
    SkillStateData,
    PortfolioStateData,
    ServiceStateData,
    EducationStateData,
    ExperienceStateData,
    CertificateStateData,
    TestimonialStateData,
    AchievementStateData,
    BlogStateData,
  ]);

  // Check if critical core data is ready
  const isCoreDataReady = useMemo(() => {
    const hasAbout = AboutStateData?.length > 0;
    const hasSkills = SkillStateData?.length > 0;
    const hasPortfolio = PortfolioStateData?.length > 0;
    const hasServices = ServiceStateData?.length > 0;
    const hasResume = EducationStateData?.length > 0 || ExperienceStateData?.length > 0;

    // Ready if all major sections are populated, or at least 5 collections loaded including About
    return (hasAbout && hasSkills && hasPortfolio) || (hasAbout && loadedCount >= 5);
  }, [
    AboutStateData,
    SkillStateData,
    PortfolioStateData,
    ServiceStateData,
    EducationStateData,
    ExperienceStateData,
    loadedCount,
  ]);

  // Handler to smoothly conclude the preloader
  const completeLoader = useCallback(() => {
    if (dataFinishedRef.current) return;
    dataFinishedRef.current = true;

    setProgress(100);
    setStatusText("All data loaded — Launching portfolio");

    const exitTimeout = setTimeout(() => {
      setIsExiting(true);

      const unmountTimeout = setTimeout(() => {
        setIsMounted(false);
        document.body.style.overflow = "";
        try {
          AOS.refresh();
        } catch {
          // ignore
        }
      }, 650);

      return () => clearTimeout(unmountTimeout);
    }, 350);

    return () => clearTimeout(exitTimeout);
  }, []);

  // Minimum display timer (1.4s) to ensure smooth motion
  useEffect(() => {
    const minTimer = setTimeout(() => {
      minTimeElapsedRef.current = true;
      if (isCoreDataReady || allSettledRef.current) {
        completeLoader();
      }
    }, 1400);

    // Safety timeout (10s) — gives ample time for cold-start servers, but prevents permanent hanging
    const safetyTimeout = setTimeout(() => {
      completeLoader();
    }, 10000);

    return () => {
      clearTimeout(minTimer);
      clearTimeout(safetyTimeout);
    };
  }, [completeLoader, isCoreDataReady]);

  // Trigger completion as soon as core data is ready and min time elapsed
  useEffect(() => {
    if (minTimeElapsedRef.current) {
      if (isCoreDataReady || allSettledRef.current) {
        completeLoader();
      }
    }
  }, [isCoreDataReady, completeLoader]);

  // Dynamically update progress and status text based on real data loading
  useEffect(() => {
    if (dataFinishedRef.current) return;

    if (loadedCount === 0) {
      setProgress((prev) => Math.max(prev, 20));
      setStatusText("Connecting to portfolio database...");
    } else if (loadedCount <= 2) {
      setProgress((prev) => Math.max(prev, 40));
      setStatusText("Syncing profile & bio...");
    } else if (loadedCount <= 4) {
      setProgress((prev) => Math.max(prev, 60));
      setStatusText("Loading skills & technologies...");
    } else if (loadedCount <= 7) {
      setProgress((prev) => Math.max(prev, 82));
      setStatusText("Compiling projects, services & resume...");
    } else {
      setProgress((prev) => Math.max(prev, 95));
      setStatusText("Finalizing assets & workspace...");
    }
  }, [loadedCount]);

  // Smooth animation ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (dataFinishedRef.current) return 100;
        if (prev < 90) {
          return prev + 1;
        }
        return prev;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcut: Press Escape to instantly enter
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        completeLoader();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [completeLoader]);

  if (!isMounted) return null;

  return (
    <aside
      aria-label="Loading Portfolio"
      role="status"
      aria-live="polite"
      className={`preloader-overlay ${isExiting ? "preloader-exit" : ""}`}
      style={{
        position: "fixed",
        inset: 0,
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 99999999,
      }}
    >
      {/* Dynamic Background Glows */}
      <div className="preloader-bg-glow glow-top" />
      <div className="preloader-bg-glow glow-bottom" />
      <div className="preloader-grid" />

      {/* Main Center Content */}
      <div className="preloader-content">
        {/* Holographic Logo with Orbital Rings */}
        <div className="preloader-emblem-wrap">
          {/* Orbital Outer Ring */}
          <div className="preloader-orbital-ring ring-outer">
            <svg viewBox="0 0 160 160" className="orbital-svg">
              <circle
                cx="80"
                cy="80"
                r="72"
                fill="none"
                stroke="url(#ringGradient1)"
                strokeWidth="1.5"
                strokeDasharray="8 12"
              />
              <defs>
                <linearGradient id="ringGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#a855f7" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity="0.9" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Orbital Middle Ring */}
          <div className="preloader-orbital-ring ring-middle">
            <svg viewBox="0 0 140 140" className="orbital-svg">
              <circle
                cx="70"
                cy="70"
                r="62"
                fill="none"
                stroke="url(#ringGradient2)"
                strokeWidth="2"
                strokeDasharray="40 10 15 10"
              />
              <defs>
                <linearGradient id="ringGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity="0.7" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Central Glass Card */}
          <div className="preloader-badge">
            <div className="preloader-badge-shine" />
            <div className="preloader-monogram">
              <span className="mono-bracket">&lt;</span>
              <span className="mono-initials">IG</span>
              <span className="mono-slash">/</span>
              <span className="mono-bracket">&gt;</span>
            </div>
          </div>
        </div>

        {/* Identity & Title */}
        <div className="preloader-identity">
          <h1 className="preloader-name">ISHAAN GUPTA</h1>
          <p className="preloader-tagline">FULL STACK DEVELOPER &bull; MERN SPECIALIST</p>
        </div>

        {/* Status Badge */}
        <div className="preloader-status-badge">
          <span className="status-dot-pulse">
            <span className="dot-core" />
            <span className="dot-ripple" />
          </span>
          <span className="status-message">{statusText}</span>
        </div>

        {/* Progress Bar Container */}
        <div className="preloader-progress-wrap">
          <div className="progress-info-row">
            <span className="progress-label">
              {loadedCount > 0 ? `SYNCED ${loadedCount}/9 DATASETS` : "CONNECTING..."}
            </span>
            <span className="progress-value">{Math.round(progress)}%</span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            >
              <span className="progress-fill-glow" />
            </div>
          </div>
        </div>

        {/* Micro System Indicators */}
        <div className="preloader-micro-stats">
          <div className={`micro-pill ${progress >= 30 ? "active" : ""}`}>
            <i className="bi bi-cpu" />
            <span>CORE</span>
          </div>
          <div className={`micro-pill ${isCoreDataReady || loadedCount >= 4 ? "active" : ""}`}>
            <i className="bi bi-database-check" />
            <span>DATA {loadedCount ? `(${loadedCount})` : ""}</span>
          </div>
          <div className={`micro-pill ${progress >= 85 ? "active" : ""}`}>
            <i className="bi bi-box" />
            <span>3D UI</span>
          </div>
        </div>

        {/* Skip button for rapid accessibility */}
        <button
          type="button"
          onClick={completeLoader}
          className="preloader-skip-btn"
          aria-label="Skip intro animation"
        >
          <span>Skip</span>
          <kbd className="skip-kbd">ESC</kbd>
        </button>
      </div>
    </aside>
  );
}
