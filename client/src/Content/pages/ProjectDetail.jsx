"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getPortfolio } from "../Redux/ActionCreators/PortfolioActionCreators";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import AOS from "aos";
import "aos/dist/aos.css";

/* ── Reusable Mac Browser Mockup for Live Previews ── */
function BrowserPreviewMockup({
  badgeText = "Client Application",
  badgeIcon = "bi-globe",
  title,
  liveUrl,
  fallbackImage,
}) {
  const validUrl = liveUrl
    ? (liveUrl.startsWith("http://") || liveUrl.startsWith("https://") ? liveUrl : `https://${liveUrl}`)
    : "";

  const [mode, setMode] = useState(validUrl ? "live" : "image");
  const [isInteracting, setIsInteracting] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [mobileScrolling, setMobileScrolling] = useState(false);

  const displayDomain = validUrl
    ? validUrl.replace(/^https?:\/\//, "").replace(/\/.*$/, "")
    : "preview.domain.dev";

  return (
    <div
      className={`pd-browser-card ${isHovered ? "is-hovered" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Mac Browser Chrome Header ── */}
      <div className="pd-chrome">
        <div className="pd-dots">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>

        <div className="pd-panel-badge">
          <i className={`bi ${badgeIcon}`} />
          <span>{badgeText}</span>
        </div>

        <div className="pd-url-bar">
          <i className="bi bi-shield-fill-check pd-lock" />
          <span className="pd-url-text" title={validUrl || displayDomain}>
            https://{displayDomain}
          </span>
          {validUrl && (
            <span className="pd-live-chip">
              <span className="live-ping" />
              <span className="live-dot" />
              LIVE
            </span>
          )}
        </div>

        <div className="pd-tools">
          {validUrl && (
            <>
              <button
                type="button"
                className={`pd-tool-btn ${mode === "live" ? "is-active" : ""}`}
                onClick={() => {
                  setMode(m => (m === "live" ? "image" : "live"));
                  setIsInteracting(false);
                }}
                title={mode === "live" ? "View snapshot image" : "View live website"}
              >
                <i className={`bi ${mode === "live" ? "bi-window-fullscreen" : "bi-image"}`} />
                <span className="tool-text pd-tool-text">{mode === "live" ? "Live Web" : "Snapshot"}</span>
              </button>
              {mode === "live" && (
                <button
                  type="button"
                  className="pd-tool-btn icon-only"
                  onClick={() => {
                    setIframeLoaded(false);
                    setIframeKey(k => k + 1);
                  }}
                  title="Reload live preview"
                >
                  <i className="bi bi-arrow-clockwise" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Viewport Canvas ── */}
      <div className="pd-viewport">
        {mode === "live" && validUrl ? (
          <div className={`pd-iframe-wrap ${isInteracting ? "is-interacting" : ""}`}>
            {!iframeLoaded && (
              <div className="pd-loader">
                <div className="loader-ring" />
                <span>Connecting live interface...</span>
              </div>
            )}
            <iframe
              key={iframeKey}
              src={validUrl}
              title={`${title} — ${badgeText}`}
              className="pd-iframe"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              loading="lazy"
              onLoad={() => setIframeLoaded(true)}
            />

            {!isInteracting ? (
              <div
                className="pd-shield"
                onClick={() => setIsInteracting(true)}
                role="button"
                tabIndex={0}
                aria-label="Click to interact with live panel"
              >
                <div className="pd-shield-pill">
                  <span className="live-dot" />
                  <span>Live {badgeText} · Click to Interact</span>
                  <i className="bi bi-cursor-fill" />
                </div>
                <a
                  href={validUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pd-popout"
                  onClick={e => e.stopPropagation()}
                  title="Open in new window"
                >
                  <i className="bi bi-box-arrow-up-right" />
                </a>
              </div>
            ) : (
              <button
                type="button"
                className="pd-exit-pill"
                onClick={() => setIsInteracting(false)}
                title="Release scroll lock"
              >
                <i className="bi bi-x-circle-fill" />
                <span>Release Scroll</span>
              </button>
            )}
          </div>
        ) : (
          <div
            className={`pd-snapshot-wrap ${isHovered || mobileScrolling ? "is-scrolling" : ""}`}
            onClick={() => setMobileScrolling(p => !p)}
            role="button"
            tabIndex={0}
            aria-label="Scroll snapshot preview"
          >
            <Image
              src={fallbackImage || "/img/portfolio/portfolio-1.webp"}
              alt={`${title} — ${badgeText} screenshot`}
              fill
              sizes="(max-width: 900px) 100vw, 900px"
              style={{ objectFit: "cover", objectPosition: "top" }}
              priority
            />
            <div className="pd-snapshot-hint">
              <i className="bi bi-arrow-down-up" />
              <span>{mobileScrolling ? "Scrolling" : "Hover / Tap to scroll snapshot"}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Mini Mac Browser Mockup for Other Featured Works ── */
function MiniRelatedProjectCard({ item }) {
  const validUrl = item.liveUrl
    ? (item.liveUrl.startsWith("http://") || item.liveUrl.startsWith("https://") ? item.liveUrl : `https://${item.liveUrl}`)
    : "";
  const [mode, setMode] = useState(validUrl ? "live" : "image");
  const [isInteracting, setIsInteracting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const displayDomain = validUrl
    ? validUrl.replace(/^https?:\/\//, "").replace(/\/.*$/, "")
    : "preview.domain.dev";

  const itemPic = Array.isArray(item.pic)
    ? (item.pic[0] || "/img/portfolio/portfolio-1.webp")
    : (item.pic || "/img/portfolio/portfolio-1.webp");

  const rawTechs = item.tech ? item.tech.split(",").map(t => t.trim()).filter(Boolean) : [];

  return (
    <div
      className={`pd-related-card ${isHovered ? "is-hovered" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsInteracting(false);
      }}
    >
      {/* Mini Mac Browser Chrome Header */}
      <div className="pd-mini-chrome">
        <div className="pd-mini-dots">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>
        <div className="pd-mini-url" title={validUrl || displayDomain}>
          <i className="bi bi-shield-fill-check text-success" />
          <span className="pd-mini-url-text">{displayDomain}</span>
        </div>
        {validUrl && (
          <button
            type="button"
            className={`pd-mini-mode-btn ${mode === "live" ? "is-active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setMode(m => (m === "live" ? "image" : "live"));
            }}
            title={mode === "live" ? "Switch to snapshot preview" : "Switch to live website"}
          >
            <i className={`bi ${mode === "live" ? "bi-window-fullscreen" : "bi-image"}`} />
            <span>{mode === "live" ? "Live" : "Snap"}</span>
          </button>
        )}
      </div>

      {/* Mini Viewport */}
      <div className="pd-mini-viewport">
        {mode === "live" && validUrl ? (
          <div className="pd-mini-iframe-wrap">
            <iframe
              src={validUrl}
              title={`${item.name} Preview`}
              className="pd-mini-iframe"
              sandbox="allow-scripts allow-same-origin allow-popups"
              loading="lazy"
            />
            {!isInteracting ? (
              <div
                className="pd-mini-shield"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsInteracting(true);
                }}
                role="button"
                tabIndex={0}
                aria-label="Click to interact with live preview"
              >
                <span className="pd-mini-shield-badge">
                  <span className="live-dot" />
                  <span>Click to interact</span>
                </span>
              </div>
            ) : (
              <button
                type="button"
                className="pd-mini-exit"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsInteracting(false);
                }}
                title="Release scroll lock"
              >
                <i className="bi bi-x-circle-fill" />
                <span>Exit</span>
              </button>
            )}
          </div>
        ) : (
          <div className={`pd-mini-snapshot-wrap ${isHovered ? "is-scrolling" : ""}`}>
            <img
              src={itemPic}
              alt={`${item.name} screenshot`}
              className="pd-mini-snapshot-img"
              loading="lazy"
            />
            <div className="pd-mini-hint">
              <i className="bi bi-arrow-down-up" />
              <span>Hover to scroll preview</span>
            </div>
          </div>
        )}
      </div>

      {/* Mini Card Information Body */}
      <div className="pd-related-body">
        <div className="d-flex align-items-center justify-content-between mb-1">
          <span className="pd-related-cat">{item.projectCategory?.name || item.category || "Web App"}</span>
          {validUrl && (
            <span className="pd-live-pill">
              <span className="live-dot" />
              <span>LIVE</span>
            </span>
          )}
        </div>
        <h4 className="pd-related-title" title={item.name}>{item.name}</h4>
        {item.shortDescription && (
          <p className="pd-related-desc">{item.shortDescription}</p>
        )}

        {rawTechs.length > 0 && (
          <div className="pd-related-chips">
            {rawTechs.slice(0, 3).map((t, i) => (
              <span key={i}>{t}</span>
            ))}
          </div>
        )}

        <div className="pd-related-actions">
          <Link href={`/projectDetail/${item._id}`} className="pd-related-link">
            <span>Case Study</span>
            <i className="bi bi-arrow-right" />
          </Link>
          {validUrl && (
            <a
              href={validUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pd-related-external"
              title="Visit live website in new tab"
            >
              <i className="bi bi-box-arrow-up-right" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProjectDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const PortfolioStateData = useSelector(state => state.PortfolioStateData);
  const [data, setData] = useState(null);
  const [relatedData, setRelatedData] = useState([]);

  useEffect(() => { dispatch(getPortfolio()); }, [dispatch]);

  useEffect(() => {
    if (PortfolioStateData && PortfolioStateData.length) {
      setData(PortfolioStateData.find(x => String(x._id) === String(id)) || null);
      setRelatedData(PortfolioStateData.filter(x => String(x._id) !== String(id)));
    }
  }, [PortfolioStateData, id]);

  /* ── AOS initialisation ── */
  useEffect(() => {
    AOS.init({
      duration: 700,
      once: true,
      easing: "ease-out-cubic",
      offset: 60,
    });
  }, []);

  if (!data) return (
    <div style={{ textAlign: "center", padding: "100px 16px", color: "var(--text-color)" }}>
      <div className="spinner-border text-primary" role="status"></div>
      <p className="mt-3 text-muted">Loading project details...</p>
    </div>
  );

  const pics = Array.isArray(data.pic)
    ? data.pic
    : data.pic
    ? [data.pic]
    : [];

  const mainFallbackImg = pics[0] || "/img/portfolio/portfolio-1.webp";
  const adminFallbackImg = pics.length > 1 ? pics[1] : (pics[0] || "/img/portfolio/portfolio-1.webp");

  const rawTechs = data.tech ? data.tech.split(",").map(t => t.trim()).filter(Boolean) : [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500;600&display=swap');

        /* ── Adaptive Theme Design Tokens ── */
        .pd-page {
          --pd-chrome-bg: #090c13;
          --pd-chrome-border: rgba(255, 255, 255, 0.08);
          --pd-url-bg: rgba(255, 255, 255, 0.05);
          --pd-card-bg: var(--card-bg, #0d1117);
          --pd-card-border: var(--card-border, rgba(255, 255, 255, 0.09));
          --pd-text: var(--text-color, #f0f2f5);
          --pd-text-muted: var(--text-muted, #8b92a5);
          --pd-accent: var(--primary-color);
          --pd-aura: rgba(var(--accent-rgb, 99, 102, 241), 0.16);
          --pd-glass: rgba(255, 255, 255, 0.03);
          --pd-gradient-line: linear-gradient(90deg, transparent, var(--pd-accent), transparent);
          --pd-card-shadow: 0 4px 24px rgba(0, 0, 0, 0.18), 0 1px 4px rgba(0,0,0,0.08);
          --pd-card-shadow-hover: 0 12px 40px rgba(0, 0, 0, 0.32), 0 0 0 1px var(--pd-accent), 0 0 30px var(--pd-aura);
        }

        [data-theme="light"] .pd-page,
        body.light .pd-page {
          --pd-chrome-bg: #f0f4f8;
          --pd-chrome-border: rgba(15, 23, 42, 0.08);
          --pd-url-bg: #ffffff;
          --pd-card-bg: #ffffff;
          --pd-card-border: rgba(15, 23, 42, 0.1);
          --pd-text: #0c0f1a;
          --pd-text-muted: #5a6072;
          --pd-accent: var(--primary-color, #4f35d2);
          --pd-aura: rgba(79, 53, 210, 0.1);
          --pd-glass: rgba(0, 0, 0, 0.02);
          --pd-card-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
          --pd-card-shadow-hover: 0 8px 32px rgba(0, 0, 0, 0.14), 0 0 0 1.5px var(--pd-accent);
        }

        /* ── Custom Keyframe Animations ── */
        @keyframes pd-fade-up {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pd-fade-right {
          from { opacity: 0; transform: translateX(-24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes pd-fade-left {
          from { opacity: 0; transform: translateX(24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes pd-scale-in {
          from { opacity: 0; transform: scale(0.93); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes gradient-slide {
          0%   { transform: scaleX(0); opacity: 0; }
          100% { transform: scaleX(1); opacity: 1; }
        }
        @keyframes float-badge {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-4px); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes ping { 75%, 100% { transform: scale(2.4); opacity: 0; } }

        /* ── Page Wrapper ── */
        .pd-page {
          position: relative;
        }
        .pd-page::before {
          content: '';
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: var(--pd-gradient-line);
          background-size: 200% auto;
          animation: shimmer 2.8s linear infinite;
          z-index: 100;
          pointer-events: none;
        }

        /* ── Mac Browser Mockup Card ── */
        .pd-browser-card {
          border-radius: 18px;
          background: var(--pd-card-bg);
          border: 1px solid var(--pd-card-border);
          box-shadow: var(--pd-card-shadow);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          position: relative;
          margin-bottom: 0;
          transition: transform .4s cubic-bezier(.22,1,.36,1), border-color .3s, box-shadow .4s;
        }
        .pd-browser-card.is-hovered {
          transform: translateY(-4px) scale(1.008);
          box-shadow: var(--pd-card-shadow-hover);
        }

        .pd-chrome {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          background: var(--pd-chrome-bg);
          border-bottom: 1px solid var(--pd-chrome-border);
          flex-shrink: 0;
          z-index: 3;
        }
        .pd-dots {
          display: flex;
          gap: 6px;
          flex-shrink: 0;
        }
        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          display: block;
        }
        .dot-red { background: #ff5f57; }
        .dot-yellow { background: #febc2e; }
        .dot-green { background: #28c840; }

        .pd-panel-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'DM Mono', monospace;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--pd-text);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--pd-chrome-border);
          padding: 2px 8px;
          border-radius: 6px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .pd-url-bar {
          flex: 1;
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--pd-url-bg);
          border: 1px solid var(--pd-chrome-border);
          border-radius: 6px;
          padding: 3px 10px;
          overflow: hidden;
        }
        .pd-lock {
          font-size: 0.68rem;
          color: #22c55e;
          flex-shrink: 0;
        }
        .pd-url-text {
          font-family: 'DM Mono', monospace;
          font-size: 0.68rem;
          color: var(--pd-text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .pd-live-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-family: 'DM Mono', monospace;
          font-size: 0.58rem;
          font-weight: 700;
          color: #22c55e;
          background: rgba(34, 197, 94, 0.14);
          padding: 1px 6px;
          border-radius: 4px;
          margin-left: auto;
          position: relative;
          flex-shrink: 0;
        }
        .live-ping {
          position: absolute;
          left: 6px;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #22c55e;
          opacity: 0.75;
          animation: ping 1.6s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .live-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 8px #22c55e;
          flex-shrink: 0;
        }
        @keyframes ping {
          75%, 100% { transform: scale(2.4); opacity: 0; }
        }

        .pd-tools {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }
        .pd-tool-btn {
          background: var(--pd-url-bg);
          border: 1px solid var(--pd-chrome-border);
          color: var(--pd-text-muted);
          padding: 3px 8px;
          border-radius: 5px;
          font-size: 0.68rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .pd-tool-btn:hover, .pd-tool-btn.is-active {
          background: rgba(var(--accent-rgb, 99, 102, 241), 0.14);
          color: var(--pd-accent);
          border-color: var(--pd-accent);
        }
        .pd-tool-btn.icon-only {
          padding: 3px 6px;
        }
        .pd-tool-btn.icon-only:hover i {
          transform: rotate(180deg);
          transition: transform 0.35s ease;
        }

        .pd-viewport {
          position: relative;
          width: 100%;
          height: clamp(340px, 45vw, 520px);
          background: #090c13;
          overflow: hidden;
        }
        .pd-iframe-wrap {
          width: 100%;
          height: 100%;
          position: relative;
        }
        .pd-iframe {
          width: 100%;
          height: 100%;
          border: none;
          display: block;
          background: #ffffff;
        }

        .pd-loader {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: var(--pd-card-bg);
          color: var(--pd-text-muted);
          font-size: 0.78rem;
          font-family: 'DM Mono', monospace;
          z-index: 2;
        }
        .loader-ring {
          width: 28px;
          height: 28px;
          border: 2.5px solid var(--pd-chrome-border);
          border-top-color: var(--pd-accent);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .pd-shield {
          position: absolute;
          inset: 0;
          background: rgba(9, 12, 19, 0.22);
          backdrop-filter: blur(1.5px);
          -webkit-backdrop-filter: blur(1.5px);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.25s ease;
          z-index: 4;
        }
        .pd-shield:hover {
          background: rgba(9, 12, 19, 0.05);
        }
        .pd-shield-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(9, 12, 19, 0.92);
          border: 1px solid rgba(255, 255, 255, 0.22);
          color: #fff;
          font-size: 0.78rem;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 99px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.2s;
        }
        .pd-shield:hover .pd-shield-pill {
          transform: scale(1.05);
          background: var(--pd-accent);
          color: #0b0f19;
          border-color: #fff;
        }
        .pd-popout {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(9, 12, 19, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #fff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 0.78rem;
          transition: all 0.2s ease;
        }
        .pd-popout:hover {
          background: var(--pd-accent);
          color: #0b0f19;
          transform: scale(1.15);
        }

        .pd-exit-pill {
          position: absolute;
          bottom: 12px;
          right: 12px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(9, 12, 19, 0.92);
          border: 1px solid rgba(201, 240, 107, 0.4);
          color: #fff;
          font-size: 0.7rem;
          font-weight: 600;
          padding: 5px 12px;
          border-radius: 99px;
          cursor: pointer;
          z-index: 5;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
        }

        .pd-snapshot-wrap {
          width: 100%;
          height: 100%;
          overflow: hidden;
          position: relative;
          cursor: pointer;
        }
        .pd-snapshot-hint {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: rgba(9, 12, 19, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #fff;
          font-size: 0.68rem;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 99px;
          display: flex;
          align-items: center;
          gap: 6px;
          pointer-events: none;
        }

        /* ── Stage Sections ── */
        .stage-section {
          margin-bottom: clamp(56px, 8vw, 100px);
          padding-bottom: clamp(40px, 6vw, 70px);
          border-bottom: 1px solid var(--pd-card-border);
          position: relative;
        }
        .stage-section:last-of-type {
          border-bottom: none;
          margin-bottom: 40px;
        }
        /* Subtle gradient accent line between stages */
        .stage-section:not(:last-of-type)::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 50%;
          transform: translateX(-50%);
          width: min(200px, 35%);
          height: 2px;
          background: var(--pd-gradient-line);
          opacity: 0.6;
          border-radius: 2px;
        }

        .stage-split {
          display: grid;
          grid-template-columns: minmax(0, 1.12fr) minmax(0, 0.88fr);
          gap: clamp(24px, 4vw, 48px);
          align-items: center;
        }
        .stage-split.stage-inverse {
          grid-template-columns: minmax(0, 0.88fr) minmax(0, 1.12fr);
        }
        .stage-media-col { display: flex; flex-direction: column; width: 100%; }
        .stage-info-col  { display: flex; flex-direction: column; gap: clamp(12px, 2vw, 18px); width: 100%; }

        .stage-split.stage-inverse .stage-media-col { order: 2; }
        .stage-split.stage-inverse .stage-info-col  { order: 1; }

        /* Stage header labels */
        .stage-header-block { margin-bottom: 4px; }
        .stage-num {
          font-family: 'DM Mono', monospace;
          font-size: clamp(0.65rem, 1.2vw, 0.78rem);
          font-weight: 700;
          color: var(--pd-accent);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 8px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .stage-num i { font-size: 0.82em; }
        .stage-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(1.25rem, 2.8vw, 1.9rem);
          font-weight: 800;
          color: var(--pd-text);
          margin: 0 0 10px;
          line-height: 1.22;
          letter-spacing: -0.02em;
        }
        .stage-subtitle {
          color: var(--pd-text-muted);
          font-size: clamp(0.82rem, 1.5vw, 0.96rem);
          line-height: 1.65;
          margin: 0;
        }

        /* ── Info Cards ── */
        .info-card {
          background: var(--pd-card-bg);
          border: 1px solid var(--pd-card-border);
          border-radius: 16px;
          padding: clamp(16px, 2.5vw, 22px);
          display: flex;
          flex-direction: column;
          box-shadow: var(--pd-card-shadow);
          transition: transform .35s cubic-bezier(.22,1,.36,1), border-color .25s ease, box-shadow .35s ease;
          position: relative;
          overflow: hidden;
        }
        .info-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--pd-accent), transparent);
          opacity: 0;
          transition: opacity 0.35s ease;
        }
        .info-card:hover {
          transform: translateY(-3px);
          border-color: rgba(var(--accent-rgb, 99, 102, 241), 0.3);
          box-shadow: var(--pd-card-shadow-hover);
        }
        .info-card:hover::before { opacity: 1; }

        .info-card-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }
        .info-card-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(var(--accent-rgb, 99, 102, 241), 0.14);
          color: var(--pd-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: clamp(0.9rem, 1.6vw, 1.05rem);
          flex-shrink: 0;
          transition: transform 0.25s ease;
        }
        .info-card:hover .info-card-icon { transform: scale(1.12) rotate(-5deg); }
        .info-card-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(0.85rem, 1.4vw, 0.98rem);
          font-weight: 700;
          color: var(--pd-text);
          margin: 0;
          letter-spacing: -0.01em;
        }

        /* Bullet Points */
        .feature-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 9px;
        }
        .feature-list li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: clamp(0.78rem, 1.4vw, 0.86rem);
          color: var(--pd-text);
          line-height: 1.5;
        }
        .feature-list li i {
          color: #22c55e;
          font-size: 0.78rem;
          margin-top: 3px;
          flex-shrink: 0;
        }

        /* Tech Chips */
        .stage-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid var(--pd-chrome-border);
        }
        .stage-chips span {
          font-family: 'DM Mono', monospace;
          font-size: clamp(0.62rem, 1.1vw, 0.73rem);
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 99px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--pd-chrome-border);
          color: var(--pd-text-muted);
          transition: background 0.2s ease, color 0.2s ease;
        }
        .stage-chips span:hover {
          background: rgba(var(--accent-rgb, 99, 102, 241), 0.12);
          color: var(--pd-accent);
          border-color: var(--pd-accent);
        }

        /* Admin Credential Box */
        .admin-credential-box {
          background: rgba(var(--accent-rgb, 99, 102, 241), 0.06);
          border: 1px dashed rgba(var(--accent-rgb, 99, 102, 241), 0.4);
          border-radius: 12px;
          padding: clamp(10px, 2vw, 14px) clamp(12px, 2.5vw, 18px);
          margin-bottom: 14px;
          display: flex;
          flex-direction: column;
          gap: 7px;
        }
        .cred-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: clamp(0.72rem, 1.3vw, 0.82rem);
        }
        .cred-label {
          color: var(--pd-text-muted);
          font-family: 'DM Mono', monospace;
        }
        .cred-val {
          font-family: 'DM Mono', monospace;
          font-weight: 600;
          color: var(--pd-text);
        }

        /* Snapshot image hover scroll */
        .pd-snapshot-wrap img {
          transition: transform 6.5s cubic-bezier(0.25, 1, 0.5, 1) !important;
          will-change: transform;
        }
        .pd-browser-card:hover .pd-snapshot-wrap img,
        .pd-snapshot-wrap.is-scrolling img {
          transform: translateY(calc(-100% + 320px));
        }

        /* Architecture Deep Dive card */
        .pd-arch-card {
          background: var(--pd-card-bg);
          border: 1px solid var(--pd-card-border);
          border-radius: 18px;
          padding: clamp(18px, 3.5vw, 38px);
          margin-bottom: clamp(24px, 4vw, 40px);
          box-shadow: var(--pd-card-shadow);
          position: relative;
          overflow: hidden;
        }
        .pd-arch-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--pd-accent), rgba(var(--accent-rgb,99,102,241),0.4), var(--pd-accent));
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
        .pd-arch-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(1.05rem, 2vw, 1.35rem);
          font-weight: 800;
          color: var(--pd-text);
          margin: 0;
          letter-spacing: -0.02em;
        }
        .pd-arch-body {
          font-size: clamp(0.82rem, 1.5vw, 0.96rem);
          line-height: 1.85;
          color: var(--pd-text-muted);
          overflow-x: auto;
          word-break: break-word;
        }
        .pd-arch-body table {
          width: 100%;
          border-collapse: collapse;
          display: block;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          margin: 14px 0;
        }
        .pd-arch-body pre {
          background: rgba(0, 0, 0, 0.25);
          padding: 12px 14px;
          border-radius: 10px;
          overflow-x: auto;
          font-size: 0.8rem;
          max-width: 100%;
          margin: 12px 0;
        }
        .pd-arch-body code {
          font-family: 'DM Mono', monospace;
          word-break: break-word;
        }
        .pd-arch-body img {
          max-width: 100%;
          height: auto;
          border-radius: 10px;
        }
        .pd-arch-body ul, .pd-arch-body ol {
          padding-left: 20px;
          margin-bottom: 12px;
        }

        /* Action buttons row */
        .pd-actions-row {
          display: flex;
          gap: clamp(8px, 2vw, 14px);
          justify-content: center;
          flex-wrap: wrap;
          padding: clamp(16px, 3vw, 28px) 0;
        }
        .pd-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: clamp(9px, 1.5vw, 12px) clamp(18px, 3vw, 28px);
          border-radius: 99px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(0.8rem, 1.4vw, 0.9rem);
          font-weight: 700;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.2s ease;
          letter-spacing: 0.01em;
          white-space: nowrap;
        }
        .pd-action-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.25); }
        .pd-action-btn.primary {
          background: var(--pd-accent);
          color: #0a0c12;
        }
        .pd-action-btn.primary:hover { box-shadow: 0 8px 24px var(--pd-aura); }
        .pd-action-btn.outline {
          background: transparent;
          border: 1.5px solid var(--pd-card-border);
          color: var(--pd-text);
        }
        .pd-action-btn.outline:hover {
          border-color: var(--pd-accent);
          color: var(--pd-accent);
        }
        .pd-action-btn.ghost {
          background: var(--pd-glass);
          border: 1.5px solid var(--pd-card-border);
          color: var(--pd-text-muted);
        }
        .pd-action-btn.ghost:hover {
          color: var(--pd-text);
          border-color: var(--pd-text-muted);
        }

        /* Responsive breakpoints */
        @media (max-width: 1199px) {
          .stage-split {
            grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
          }
          .stage-split.stage-inverse {
            grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
          }
        }
        @media (max-width: 991px) {
          .stage-split,
          .stage-split.stage-inverse {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
          .stage-split.stage-inverse .stage-media-col { order: 1; }
          .stage-split.stage-inverse .stage-info-col  { order: 2; }
          .pd-viewport { height: clamp(280px, 50vw, 420px) !important; }
        }
        @media (max-width: 767px) {
          .stage-section {
            margin-bottom: 48px;
            padding-bottom: 36px;
          }
          .stage-split { gap: 20px !important; }
          .pd-viewport { height: clamp(240px, 56vw, 360px) !important; }
          .info-card {
            padding: 16px 14px;
            border-radius: 14px;
          }
          .info-card-icon {
            width: 32px;
            height: 32px;
            font-size: 0.95rem;
            border-radius: 8px;
          }
          .pd-arch-card {
            padding: 20px 16px;
            border-radius: 14px;
          }
        }
        @media (max-width: 576px) {
          .pd-panel-badge { display: none !important; }
          .pd-chrome {
            padding: 7px 10px;
            gap: 6px;
          }
          .pd-dots { gap: 4px; }
          .dot { width: 8px; height: 8px; }
          .pd-url-bar { padding: 3px 6px; }
          .pd-url-text { font-size: 0.64rem; }
          .pd-viewport { height: clamp(220px, 62vw, 300px) !important; }
          .pd-shield-pill {
            padding: 6px 12px;
            font-size: 0.7rem;
            gap: 6px;
          }
          .pd-popout {
            width: 28px;
            height: 28px;
            font-size: 0.72rem;
            top: 8px;
            right: 8px;
          }
          .pd-exit-pill {
            bottom: 8px;
            right: 8px;
            padding: 4px 10px;
            font-size: 0.65rem;
          }
          .stage-title {
            font-size: 1.35rem;
            line-height: 1.25;
          }
          .cred-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 2px;
          }
          .cred-val {
            word-break: break-all;
          }
          .stage-cta-btn {
            width: 100% !important;
            justify-content: center !important;
            padding: 11px 16px !important;
            font-size: 0.84rem !important;
          }
          .pd-actions-row {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
            width: 100%;
            padding: 16px 0 10px;
          }
          .pd-actions-row > :last-child:nth-child(odd) {
            grid-column: 1 / -1;
          }
          .pd-action-btn {
            width: 100%;
            justify-content: center;
            padding: 10px 12px;
            font-size: 0.78rem;
          }
          .pd-mini-viewport { height: 160px; }
        }
        @media (max-width: 400px) {
          .pd-tool-text { display: none !important; }
          .pd-live-chip span:last-child { display: none; }
          .pd-live-chip { padding: 2px 4px; }
          .pd-actions-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <section className="pd-page" style={{ padding: "clamp(46px, 7vw, 75px) clamp(12px, 3vw, 24px) 60px", backgroundColor: "transparent", color: "var(--text-color)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>

          {/* Breadcrumbs */}
          <div
            className="d-flex align-items-center flex-wrap gap-2 mb-4"
            style={{ fontSize: "clamp(0.75rem, 1.3vw, 0.88rem)", rowGap: "4px" }}
            data-aos="fade-down"
            data-aos-duration="500"
          >
            <Link href="/" className="text-muted text-decoration-none">Home</Link>
            <span className="text-muted" style={{ opacity: 0.5 }}>/</span>
            <Link href="/#portfolio" className="text-muted text-decoration-none">Portfolio</Link>
            <span className="text-muted" style={{ opacity: 0.5 }}>/</span>
            <span className="fw-bold text-truncate" style={{ color: "var(--pd-accent)" }}>{data.name}</span>
          </div>

          {/* Header */}
          <div className="text-center mb-5" data-aos="fade-up" data-aos-duration="700">
            <span className="section-badge" style={{ animation: "float-badge 3s ease-in-out infinite" }}>
              <i className="bi bi-briefcase-fill"></i>
              Project Architecture &amp; Case Study
            </span>
            <h1 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "clamp(1.65rem, 4.6vw, 3.2rem)",
              fontWeight: 800,
              color: "var(--text-color)",
              margin: "10px 0 16px",
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              wordBreak: "break-word"
            }}>
              {data.name}
            </h1>
            <div className="title-shape">
              <svg viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M 0,10 C 40,0 60,20 100,10 C 140,0 160,20 200,10" fill="none" stroke="currentColor" strokeWidth="2"></path>
              </svg>
            </div>
            <p style={{
              fontSize: "clamp(0.9rem, 1.8vw, 1.1rem)",
              color: "var(--text-muted)",
              lineHeight: 1.72,
              maxWidth: 740,
              margin: "0 auto"
            }}>
              {data.shortDescription}
            </p>
          </div>

          {/* ═══ STAGE 1: CLIENT APPLICATION ═══ */}
          <div className="stage-section" data-aos="fade-up" data-aos-delay="50">
            <div className="stage-split">
              {/* LEFT: Client Browser Preview Mockup */}
              <div className="stage-media-col" data-aos="fade-right" data-aos-delay="100" data-aos-duration="750">
                <BrowserPreviewMockup
                  badgeText="Client App"
                  badgeIcon="bi-globe"
                  title={data.name}
                  liveUrl={data.liveUrl}
                  fallbackImage={mainFallbackImg}
                />
              </div>

              {/* RIGHT: Client Application Content & Information */}
              <div className="stage-info-col" data-aos="fade-left" data-aos-delay="200" data-aos-duration="750">
                <div className="stage-header-block">
                  <p className="stage-num">
                    <i className="bi bi-laptop" />
                    01 · Customer Experience
                  </p>
                  <h2 className="stage-title">Main Client Application</h2>
                  <p className="stage-subtitle">
                    User-facing digital experience architected for high conversion, minimal cognitive load, and instant responsiveness.
                  </p>
                </div>

                {/* Card 1: Experience & Purpose */}
                <div className="info-card">
                  <div className="info-card-header">
                    <div className="info-card-icon">
                      <i className="bi bi-layout-text-window-reverse" />
                    </div>
                    <h3 className="info-card-title">User Experience & Purpose</h3>
                  </div>
                  <ul className="feature-list">
                    <li><i className="bi bi-check-circle-fill" /> Responsive interactive UI with optimized Core Web Vitals</li>
                    <li><i className="bi bi-check-circle-fill" /> Smooth dynamic routing with client-side state caching</li>
                    <li><i className="bi bi-check-circle-fill" /> Direct user onboarding, cart/catalog, and checkout flows</li>
                  </ul>
                </div>

                {/* Card 2: Frontend Architecture & Tech Stack */}
                <div className="info-card">
                  <div className="info-card-header">
                    <div className="info-card-icon">
                      <i className="bi bi-code-square" />
                    </div>
                    <h3 className="info-card-title">Frontend Architecture</h3>
                  </div>
                  <ul className="feature-list">
                    <li><i className="bi bi-check-circle-fill" /> Next.js / React with modular component architecture</li>
                    <li><i className="bi bi-check-circle-fill" /> Global state management via Redux Toolkit</li>
                    <li><i className="bi bi-check-circle-fill" /> Seamless REST API integration with real-time feedback</li>
                  </ul>
                  <div className="stage-chips">
                    {rawTechs.slice(0, 4).map((tech, i) => (
                      <span key={i}>{tech}</span>
                    ))}
                  </div>
                </div>

                {data.liveUrl && (
                  <div className="pt-2 stage-cta-wrap">
                    <a
                      href={data.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary stage-cta-btn d-inline-flex align-items-center gap-2"
                      style={{ borderRadius: 99, padding: "10px 22px", fontSize: "0.85rem", fontWeight: 600 }}
                    >
                      <i className="bi bi-box-arrow-up-right" />
                      <span>Launch Live Web App</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ═══ STAGE 2: ADMIN MANAGEMENT ═══ */}
          <div className="stage-section" data-aos="fade-up" data-aos-delay="80">
            <div className="stage-split stage-inverse">
              {/* DESKTOP RIGHT: Admin Browser Preview Mockup */}
              <div className="stage-media-col" data-aos="fade-left" data-aos-delay="150" data-aos-duration="750">
                <BrowserPreviewMockup
                  badgeText="Admin Console"
                  badgeIcon="bi-shield-lock"
                  title={`${data.name} Admin Panel`}
                  liveUrl={data.adminUrl || "https://admin.ishaanportfolio.com"}
                  fallbackImage={adminFallbackImg}
                />
              </div>

              {/* DESKTOP LEFT: Admin Static Info */}
              <div className="stage-info-col" data-aos="fade-right" data-aos-delay="250" data-aos-duration="750">
                <div className="stage-header-block">
                  <p className="stage-num">
                    <i className="bi bi-shield-lock-fill" />
                    02 · Back-Office Operations
                  </p>
                  <h2 className="stage-title">Admin Management & Control Panel</h2>
                  <p className="stage-subtitle">
                    Centralized command center for platform administrators to manage inventory, fulfill orders, and monitor telemetry.
                  </p>
                </div>

                {/* Card 1: Static Demo Credentials & Permissions */}
                <div className="info-card">
                  <div className="info-card-header">
                    <div className="info-card-icon">
                      <i className="bi bi-key-fill text-warning" />
                    </div>
                    <h3 className="info-card-title">Static Admin Authentication</h3>
                  </div>

                  {/* Static Credentials Box */}
                  <div className="admin-credential-box">
                    <div className="cred-row">
                      <span className="cred-label">Security Role:</span>
                      <span className="cred-val text-primary">Super Administrator</span>
                    </div>
                    <div className="cred-row">
                      <span className="cred-label">Demo Email:</span>
                      <span className="cred-val">admin@enterprise.dev</span>
                    </div>
                    <div className="cred-row">
                      <span className="cred-label">Access State:</span>
                      <span className="cred-val text-success">Verified & Active</span>
                    </div>
                  </div>

                  <ul className="feature-list">
                    <li><i className="bi bi-check-circle-fill" /> JWT authentication with automatic refresh rotation</li>
                    <li><i className="bi bi-check-circle-fill" /> Protected route wrappers and encrypted session headers</li>
                  </ul>
                </div>

                {/* Card 2: Operational Modules & Data Management */}
                <div className="info-card">
                  <div className="info-card-header">
                    <div className="info-card-icon">
                      <i className="bi bi-graph-up-arrow" />
                    </div>
                    <h3 className="info-card-title">Management Modules & Controls</h3>
                  </div>
                  <ul className="feature-list">
                    <li><i className="bi bi-check-circle-fill" /> <strong>Catalog & Inventory:</strong> Full CRUD for products and prices</li>
                    <li><i className="bi bi-check-circle-fill" /> <strong>Order Fulfillment:</strong> Lifecycle tracking and receipts</li>
                    <li><i className="bi bi-check-circle-fill" /> <strong>Live Telemetry:</strong> Traffic conversion and session graphs</li>
                    <li><i className="bi bi-check-circle-fill" /> <strong>Asset Pipeline:</strong> Multi-image uploads via Cloudinary CDN</li>
                  </ul>
                  <div className="stage-chips">
                    <span>Node.js</span>
                    <span>Express</span>
                    <span>MongoDB</span>
                    <span>Cloudinary</span>
                    <span>JWT RBAC</span>
                  </div>
                </div>

                <div className="pt-2 stage-cta-wrap">
                  <a
                    href={data.adminUrl || "https://admin.ishaanportfolio.com"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary stage-cta-btn d-inline-flex align-items-center gap-2"
                    style={{ borderRadius: 99, padding: "10px 22px", fontSize: "0.85rem", fontWeight: 600 }}
                  >
                    <i className="bi bi-shield-check" />
                    <span>Open Live Admin Portal</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ═══ SYSTEM ARCHITECTURE & TECHNICAL OVERVIEW ═══ */}
          {data.longDescription && (
            <div className="pd-arch-card" data-aos="fade-up" data-aos-delay="80">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: "rgba(var(--accent-rgb,99,102,241),0.14)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--pd-accent)", fontSize: "1.2rem", flexShrink: 0
                }}>
                  <i className="bi bi-cpu-fill" />
                </div>
                <h3 className="pd-arch-title">
                  Full-Stack Architecture & Engineering Deep Dive
                </h3>
              </div>
              <div
                className="pd-arch-body"
                dangerouslySetInnerHTML={{ __html: data.longDescription }}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="pd-actions-row" data-aos="fade-up" data-aos-delay="100">
            {data.liveUrl && (
              <a href={data.liveUrl} target="_blank" rel="noreferrer" className="pd-action-btn primary">
                <i className="bi bi-box-arrow-up-right" />
                <span>Visit Client App</span>
              </a>
            )}
            {data.adminUrl && (
              <a href={data.adminUrl} target="_blank" rel="noreferrer" className="pd-action-btn outline">
                <i className="bi bi-shield-lock" />
                <span>Admin Console</span>
              </a>
            )}
            {data.githubRepo && (
              <a href={data.githubRepo} target="_blank" rel="noreferrer" className="pd-action-btn ghost">
                <i className="bi bi-github" />
                <span>Source Code</span>
              </a>
            )}
            <Link href="/#portfolio" className="pd-action-btn ghost">
              <i className="bi bi-arrow-left" />
              <span>Portfolio</span>
            </Link>
          </div>

        </div>
      </section>

      {/* Related Projects */}
      {relatedData.length > 0 && (
        <section style={{ padding: "70px 16px 90px", backgroundColor: "transparent" }}>
          <style>{`
            /* ── Mini Browser Card for Other Featured Works ── */
            .pd-related-card {
              background: var(--pd-card-bg, #0f121d);
              border: 1px solid var(--pd-card-border, rgba(255, 255, 255, 0.1));
              border-radius: 16px;
              overflow: hidden;
              display: flex;
              flex-direction: column;
              box-shadow: 0 6px 22px rgba(0, 0, 0, 0.12);
              transition: transform .3s ease, border-color .3s ease, box-shadow .3s ease;
              height: 100%;
            }
            .pd-related-card:hover {
              transform: translateY(-5px);
              border-color: var(--pd-accent);
              box-shadow: 0 14px 34px rgba(0, 0, 0, 0.25);
            }

            .pd-mini-chrome {
              display: flex;
              align-items: center;
              gap: 8px;
              padding: 8px 12px;
              background: var(--pd-chrome-bg, #090c13);
              border-bottom: 1px solid var(--pd-chrome-border, rgba(255, 255, 255, 0.08));
              flex-shrink: 0;
            }
            .pd-mini-dots {
              display: flex;
              gap: 5px;
              flex-shrink: 0;
            }
            .pd-mini-dots .dot {
              width: 7px;
              height: 7px;
            }
            .pd-mini-url {
              flex: 1;
              min-width: 0;
              display: flex;
              align-items: center;
              gap: 5px;
              background: var(--pd-url-bg, rgba(255, 255, 255, 0.05));
              border: 1px solid var(--pd-chrome-border, rgba(255, 255, 255, 0.08));
              border-radius: 4px;
              padding: 2px 7px;
              overflow: hidden;
            }
            .pd-mini-url-text {
              font-family: 'DM Mono', monospace;
              font-size: 0.62rem;
              color: var(--pd-text-muted);
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .pd-mini-mode-btn {
              background: transparent;
              border: 1px solid var(--pd-chrome-border, rgba(255, 255, 255, 0.08));
              color: var(--pd-text-muted);
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 0.62rem;
              font-weight: 600;
              display: inline-flex;
              align-items: center;
              gap: 3px;
              cursor: pointer;
              transition: all 0.2s ease;
            }
            .pd-mini-mode-btn:hover, .pd-mini-mode-btn.is-active {
              background: rgba(var(--accent-rgb, 99, 102, 241), 0.14);
              color: var(--pd-accent);
              border-color: var(--pd-accent);
            }

            .pd-mini-viewport {
              position: relative;
              width: 100%;
              height: 200px;
              background: #090c13;
              overflow: hidden;
            }
            .pd-mini-iframe-wrap {
              width: 100%;
              height: 100%;
              position: relative;
            }
            .pd-mini-iframe {
              width: 100%;
              height: 100%;
              border: none;
              display: block;
              background: #ffffff;
            }
            .pd-mini-shield {
              position: absolute;
              inset: 0;
              background: rgba(0, 0, 0, 0.15);
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              z-index: 2;
              transition: background 0.2s ease;
            }
            .pd-mini-shield:hover {
              background: rgba(0, 0, 0, 0.35);
            }
            .pd-mini-shield-badge {
              display: inline-flex;
              align-items: center;
              gap: 5px;
              background: rgba(9, 12, 19, 0.88);
              border: 1px solid rgba(255, 255, 255, 0.15);
              color: #fff;
              font-size: 0.65rem;
              font-weight: 600;
              padding: 4px 10px;
              border-radius: 99px;
              backdrop-filter: blur(4px);
            }
            .pd-mini-exit {
              position: absolute;
              bottom: 8px;
              right: 8px;
              display: inline-flex;
              align-items: center;
              gap: 4px;
              background: rgba(9, 12, 19, 0.9);
              border: 1px solid rgba(201, 240, 107, 0.4);
              color: #fff;
              font-size: 0.65rem;
              font-weight: 600;
              padding: 3px 8px;
              border-radius: 99px;
              cursor: pointer;
              z-index: 4;
            }

            .pd-mini-snapshot-wrap {
              width: 100%;
              height: 100%;
              overflow: hidden;
              position: relative;
            }
            .pd-mini-snapshot-img {
              width: 100%;
              height: auto;
              min-height: 100%;
              display: block;
              transition: transform 6s cubic-bezier(0.25, 1, 0.5, 1);
              will-change: transform;
            }
            .pd-related-card:hover .pd-mini-snapshot-img,
            .pd-mini-snapshot-wrap.is-scrolling .pd-mini-snapshot-img {
              transform: translateY(calc(-100% + 200px));
            }
            .pd-mini-hint {
              position: absolute;
              bottom: 8px;
              right: 8px;
              background: rgba(9, 12, 19, 0.85);
              border: 1px solid rgba(255, 255, 255, 0.15);
              color: #fff;
              font-size: 0.62rem;
              font-weight: 600;
              padding: 3px 8px;
              border-radius: 99px;
              display: flex;
              align-items: center;
              gap: 4px;
              pointer-events: none;
              opacity: 0.9;
            }

            .pd-related-body {
              padding: 16px;
              display: flex;
              flex-direction: column;
              flex: 1;
            }
            .pd-related-cat {
              font-family: 'DM Mono', monospace;
              font-size: 0.72rem;
              color: var(--pd-accent);
              font-weight: 700;
              letter-spacing: 0.04em;
              text-transform: uppercase;
            }
            .pd-live-pill {
              display: inline-flex;
              align-items: center;
              gap: 4px;
              font-family: 'DM Mono', monospace;
              font-size: 0.58rem;
              font-weight: 700;
              color: #22c55e;
              background: rgba(34, 197, 94, 0.12);
              padding: 1px 6px;
              border-radius: 4px;
            }
            .pd-related-title {
              font-family: 'Plus Jakarta Sans', sans-serif;
              font-size: 0.98rem;
              font-weight: 700;
              color: var(--pd-text);
              margin: 4px 0 6px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .pd-related-desc {
              font-size: 0.8rem;
              color: var(--pd-text-muted);
              line-height: 1.45;
              margin: 0 0 10px;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }
            .pd-related-chips {
              display: flex;
              flex-wrap: wrap;
              gap: 5px;
              margin-bottom: 12px;
            }
            .pd-related-chips span {
              font-family: 'DM Mono', monospace;
              font-size: 0.66rem;
              font-weight: 600;
              padding: 1px 7px;
              border-radius: 99px;
              background: rgba(255, 255, 255, 0.04);
              border: 1px solid var(--pd-chrome-border);
              color: var(--pd-text-muted);
            }
            .pd-related-actions {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-top: auto;
              padding-top: 10px;
              border-top: 1px solid var(--pd-chrome-border);
            }
            .pd-related-link {
              font-size: 0.82rem;
              font-weight: 700;
              color: var(--pd-accent);
              text-decoration: none;
              display: inline-flex;
              align-items: center;
              gap: 4px;
              transition: gap 0.2s ease;
            }
            .pd-related-link:hover {
              gap: 7px;
            }
            .pd-related-external {
              width: 28px;
              height: 28px;
              border-radius: 7px;
              background: var(--pd-url-bg);
              border: 1px solid var(--pd-chrome-border);
              display: flex;
              align-items: center;
              justify-content: center;
              color: var(--pd-text-muted);
              font-size: 0.76rem;
              text-decoration: none;
              transition: all 0.2s ease;
            }
            .pd-related-external:hover {
              background: var(--pd-accent);
              color: #0b0f19;
            }
          `}</style>
          <div className="container">
            <div className="text-center mb-5">
              <span className="section-badge mb-2">
                <i className="bi bi-collection-fill" />
                Featured Portfolio
              </span>
              <h3 className="fw-bold" style={{ fontSize: "clamp(1.5rem, 2.8vw, 2.1rem)", color: "var(--text-color)", margin: "6px 0 8px" }}>
                Other Featured Works
              </h3>
              <p className="text-muted" style={{ fontSize: "0.92rem", margin: 0 }}>
                Explore more live applications, case studies, and engineering projects
              </p>
            </div>

            <Swiper
              modules={[Autoplay]}
              spaceBetween={20}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              breakpoints={{
                0: { slidesPerView: 1.08, spaceBetween: 10 },
                480: { slidesPerView: 1.35, spaceBetween: 14 },
                768: { slidesPerView: 2, spaceBetween: 18 },
                1024: { slidesPerView: 3, spaceBetween: 24 },
              }}
            >
              {relatedData.map((item) => (
                <SwiperSlide key={item._id} style={{ height: "auto" }}>
                  <MiniRelatedProjectCard item={item} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}
    </>
  );
}