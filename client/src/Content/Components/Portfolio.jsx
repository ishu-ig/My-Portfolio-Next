"use client"
import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { getPortfolio } from '../Redux/ActionCreators/PortfolioActionCreators';
import { getProjectCategory } from '../Redux/ActionCreators/ProjectCategoryActionCreators';
import "aos/dist/aos.css";
import AOS from "aos";

export function getPortfolioCategoryName(item) {
  if (!item) return '';
  if (typeof item.projectCategory === 'object' && item.projectCategory?.name) {
    return item.projectCategory.name.trim();
  }
  if (typeof item.projectCategory === 'string' && item.projectCategory.trim()) {
    return item.projectCategory.trim();
  }
  if (typeof item.category === 'string' && item.category.trim()) {
    return item.category.trim();
  }
  return '';
}

/* ── Minimal, High-Impact Project Item ── */
function ProjectItem({ item, index, total }) {
  const isFlip = index % 2 === 1;

  const validLiveUrl = item.liveUrl
    ? (item.liveUrl.startsWith('http://') || item.liveUrl.startsWith('https://')
        ? item.liveUrl
        : `https://${item.liveUrl}`)
    : '';

  const [mode, setMode] = useState(validLiveUrl ? 'live' : 'image');
  const [isInteracting, setIsInteracting] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [mobileScrolling, setMobileScrolling] = useState(false);

  const imgSrc = Array.isArray(item.pic) ? item.pic[0] : (item.pic || "/img/portfolio/portfolio-1.webp");
  const rawTechs = item.tech ? item.tech.split(',').map(t => t.trim()).filter(Boolean) : [];

  const displayDomain = validLiveUrl
    ? validLiveUrl.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
    : `${item.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.dev`;

  // Concise 1-2 sentence description without data overload
  const cleanDesc = useMemo(() => {
    if (!item.shortDescription) return 'Modern full-stack web application built for high performance and smooth user experience.';
    const firstSentence = item.shortDescription.split('.')[0];
    if (firstSentence && firstSentence.length >= 45) {
      return firstSentence.trim() + '.';
    }
    return item.shortDescription.length > 135
      ? item.shortDescription.slice(0, 135).trim() + '...'
      : item.shortDescription;
  }, [item.shortDescription]);

  return (
    <article
      className={`project ${isFlip ? 'project--flip' : ''}`}
      data-aos="fade-up"
      data-aos-delay="100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Project Media: Live Website Homepage Inside Mockup ── */}
      <div className="project-media-container">
        {/* Ambient Glow Aura */}
        <div className="project-aura" aria-hidden="true" />

        <div className="project-media gl-slot">
          {/* Browser Chrome Header */}
          <div className="media-chrome">
            <div className="chrome-dots">
              <span className="dot dot-red" title="Close" />
              <span className="dot dot-yellow" title="Minimize" />
              <span className="dot dot-green" title="Maximize" />
            </div>

            <div className="chrome-url-bar">
              <i className="bi bi-shield-fill-check chrome-lock" />
              <span className="chrome-url-text" title={`https://${displayDomain}`}>
                https://{displayDomain}
              </span>
              {validLiveUrl && (
                <span className="chrome-live-chip" title="Live Homepage Online">
                  <span className="live-ping" />
                  <span className="live-dot" />
                  LIVE
                </span>
              )}
            </div>

            <div className="chrome-tools">
              {validLiveUrl && (
                <>
                  <button
                    type="button"
                    className={`chrome-tool-btn ${mode === 'live' ? 'is-active' : ''}`}
                    onClick={() => {
                      setMode(m => m === 'live' ? 'image' : 'live');
                      setIsInteracting(false);
                    }}
                    title={mode === 'live' ? "Switch to snapshot image" : "Switch to live website"}
                  >
                    <i className={`bi ${mode === 'live' ? 'bi-window-fullscreen' : 'bi-image'}`} />
                    <span className="tool-text">{mode === 'live' ? 'Live' : 'Snapshot'}</span>
                  </button>
                  {mode === 'live' && (
                    <button
                      type="button"
                      className="chrome-tool-btn icon-only"
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

          {/* Media Canvas / Screen */}
          <div className="media-screen">
            {mode === 'live' && validLiveUrl ? (
              <div className={`live-frame-wrap ${isInteracting ? 'is-interacting' : ''}`}>
                {!iframeLoaded && (
                  <div className="live-loader">
                    <div className="loader-ring" />
                    <span>Connecting live homepage...</span>
                  </div>
                )}
                <iframe
                  key={iframeKey}
                  src={validLiveUrl}
                  title={`${item.name} — live website homepage`}
                  className="live-iframe"
                  loading={index < 2 ? "eager" : "lazy"}
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  onLoad={() => setIframeLoaded(true)}
                />

                {/* Interaction Shield: Keeps page scrolling smooth */}
                {!isInteracting ? (
                  <div
                    className="interaction-shield"
                    onClick={() => setIsInteracting(true)}
                    role="button"
                    tabIndex={0}
                    aria-label="Click to interact with live website"
                  >
                    <div className="shield-pill">
                      <span className="live-dot" />
                      <span>Live Website · Click to Interact</span>
                      <i className="bi bi-cursor-fill" />
                    </div>
                    <a
                      href={validLiveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shield-popout"
                      onClick={e => e.stopPropagation()}
                      title="Open full site in new tab"
                    >
                      <i className="bi bi-box-arrow-up-right" />
                    </a>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="interaction-exit-pill"
                    onClick={() => setIsInteracting(false)}
                    title="Click to release scroll"
                  >
                    <i className="bi bi-x-circle-fill" />
                    <span>Release Scroll</span>
                  </button>
                )}
              </div>
            ) : (
              <div
                className={`snapshot-wrap ${isHovered || mobileScrolling ? 'is-scrolling' : ''}`}
                onClick={() => setMobileScrolling(p => !p)}
                role="button"
                tabIndex={0}
                aria-label={`Scroll snapshot of ${item.name}`}
              >
                <img
                  src={imgSrc}
                  alt={`${item.name} — screenshot`}
                  loading="lazy"
                  className="snapshot-img"
                />
                <div className="snapshot-hint">
                  <i className="bi bi-arrow-down-up" />
                  <span>{mobileScrolling ? 'Scrolling preview' : 'Hover / Tap to scroll'}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Streamlined Project Info (Clean, Less Data, High Impact) ── */}
      <div className="project-info">
        <p className="project-num">
          0{index + 1} · {getPortfolioCategoryName(item) || 'Featured'}
        </p>

        <h3 className="project-title">{item.name}</h3>

        <p className="project-desc">{cleanDesc}</p>

        {/* Clean Tech Chips (Top 4 essentials) */}
        {rawTechs.length > 0 && (
          <ul className="chips">
            {rawTechs.slice(0, 4).map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        )}

        {/* Action Row */}
        <div className="project-actions">
          {validLiveUrl ? (
            <a
              className="btn btn-ghost"
              href={validLiveUrl}
              target="_blank"
              rel="noopener"
            >
              <span>Visit live site</span>
              <svg viewBox="0 0 24 24" aria-hidden="true" width="15" height="15">
                <path d="M7 17L17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          ) : (
            <span className="btn btn-ghost btn-disabled">
              <span>Preview offline</span>
            </span>
          )}

          <Link href={`/projectDetail/${item._id}`} className="btn-case">
            <span>Case study</span>
            <i className="bi bi-arrow-right" />
          </Link>

          <div className="extra-links">
            {item.githubRepo && (
              <a
                href={item.githubRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="icon-link"
                title="View Source on GitHub"
              >
                <i className="bi bi-github" />
              </a>
            )}
            {item.adminUrl && (
              <a
                href={item.adminUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="icon-link"
                title="Admin Dashboard"
              >
                <i className="bi bi-shield-lock" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Portfolio() {
  const PortfolioStateData = useSelector(state => state.PortfolioStateData);
  const ProjectCategoryStateData = useSelector(state => state.ProjectCategoryStateData);
  const dispatch = useDispatch();
  const loading = !PortfolioStateData || PortfolioStateData.length === 0;
  const [activeFilter, setActiveFilter] = useState('all');
  const [animating, setAnimating] = useState(false);

  const handleFilterChange = (cat) => {
    if (cat === activeFilter) return;
    setAnimating(true);
    setTimeout(() => { setActiveFilter(cat); setAnimating(false); }, 200);
  };

  useEffect(() => {
    if (!PortfolioStateData || !PortfolioStateData.length) dispatch(getPortfolio());
    if (!ProjectCategoryStateData || !ProjectCategoryStateData.length) dispatch(getProjectCategory());
    AOS.init({ duration: 800, once: false, mirror: true });
  }, [dispatch, PortfolioStateData, ProjectCategoryStateData]);

  const activeItems = useMemo(() =>
    Array.isArray(PortfolioStateData) ? PortfolioStateData.filter(x => x.active) : [],
  [PortfolioStateData]);

  const categories = useMemo(() => {
    const activeProjectCategories = Array.isArray(ProjectCategoryStateData)
      ? ProjectCategoryStateData.filter(c => c.active).map(c => (c.name || '').trim()).filter(Boolean)
      : [];
    const itemCats = Array.from(new Set(activeItems.map(getPortfolioCategoryName).filter(Boolean)));
    const combined = activeProjectCategories.length > 0
      ? Array.from(new Set([...activeProjectCategories, ...itemCats]))
      : itemCats;
    return ['all', ...combined];
  }, [ProjectCategoryStateData, activeItems]);

  const filtered = useMemo(() =>
    activeItems.filter(x => {
      if (activeFilter.trim().toLowerCase() === 'all') return true;
      const itemCat = getPortfolioCategoryName(x).toLowerCase();
      return itemCat === activeFilter.trim().toLowerCase();
    }),
  [activeItems, activeFilter]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

        /* ── Adaptive Theme Design Tokens ── */
        .work-section {
          padding: clamp(60px, 7vw, 115px) 0;
          background: transparent !important;
          background-color: transparent !important;
          color: var(--text-color, #f4f4f4);
          position: relative;

          /* Dynamic Theme Tokens */
          --pf-chrome-bg: #090c13;
          --pf-chrome-border: rgba(255, 255, 255, 0.08);
          --pf-url-bg: rgba(255, 255, 255, 0.05);
          --pf-url-border: rgba(255, 255, 255, 0.08);
          --pf-frame-bg: #0b0e16;
          --pf-frame-border: rgba(255, 255, 255, 0.1);
          --pf-frame-shadow: 0 24px 60px rgba(0, 0, 0, .45);
          --pf-text: var(--text-color, #f4f4f4);
          --pf-text-muted: var(--text-muted, #9e9f97);
          --pf-aura: rgba(var(--accent-rgb, 99, 102, 241), 0.14);
          --pf-pill-bg: rgba(var(--accent-rgb, 99, 102, 241), 0.08);
          --pf-pill-border: rgba(var(--accent-rgb, 99, 102, 241), 0.22);
          --pf-btn-ghost-border: rgba(255, 255, 255, 0.22);
          --pf-btn-ghost-bg: transparent;
          --pf-btn-ghost-color: #fff;
          --pf-btn-ghost-hover-bg: #fff;
          --pf-btn-ghost-hover-color: #0b0e16;
          --pf-btn-case-bg: rgba(255, 255, 255, 0.04);
          --pf-btn-case-border: rgba(255, 255, 255, 0.08);
          --pf-icon-bg: rgba(255, 255, 255, 0.04);
          --pf-icon-border: rgba(255, 255, 255, 0.1);
        }

        /* ── Light Theme Adaptation ── */
        [data-theme="light"] .work-section,
        body.light .work-section {
          --pf-chrome-bg: #edf2f7;
          --pf-chrome-border: rgba(15, 23, 42, 0.08);
          --pf-url-bg: #ffffff;
          --pf-url-border: rgba(15, 23, 42, 0.1);
          --pf-frame-bg: #ffffff;
          --pf-frame-border: rgba(15, 23, 42, 0.1);
          --pf-frame-shadow: 0 20px 45px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
          --pf-text: #0f111a;
          --pf-text-muted: #5e6278;
          --pf-aura: rgba(99, 102, 241, 0.09);
          --pf-pill-bg: rgba(99, 102, 241, 0.07);
          --pf-pill-border: rgba(99, 102, 241, 0.18);
          --pf-btn-ghost-border: #0f111a;
          --pf-btn-ghost-bg: transparent;
          --pf-btn-ghost-color: #0f111a;
          --pf-btn-ghost-hover-bg: #0f111a;
          --pf-btn-ghost-hover-color: #ffffff;
          --pf-btn-case-bg: rgba(15, 23, 42, 0.04);
          --pf-btn-case-border: rgba(15, 23, 42, 0.1);
          --pf-icon-bg: rgba(15, 23, 42, 0.04);
          --pf-icon-border: rgba(15, 23, 42, 0.12);
        }

        /* ── Dark Theme Adaptation ── */
        [data-theme="dark"] .work-section,
        body.dark .work-section {
          --pf-chrome-bg: #0c0f18;
          --pf-chrome-border: rgba(255, 255, 255, 0.08);
          --pf-url-bg: rgba(255, 255, 255, 0.06);
          --pf-url-border: rgba(255, 255, 255, 0.09);
          --pf-frame-bg: #121522;
          --pf-frame-border: rgba(255, 255, 255, 0.09);
          --pf-frame-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
          --pf-text: #f1f0fa;
          --pf-text-muted: #9d99bf;
          --pf-aura: rgba(129, 140, 248, 0.16);
          --pf-pill-bg: rgba(129, 140, 248, 0.1);
          --pf-pill-border: rgba(129, 140, 248, 0.22);
          --pf-btn-ghost-border: rgba(255, 255, 255, 0.25);
          --pf-btn-ghost-bg: transparent;
          --pf-btn-ghost-color: #ffffff;
          --pf-btn-ghost-hover-bg: #ffffff;
          --pf-btn-ghost-hover-color: #090c13;
          --pf-btn-case-bg: rgba(255, 255, 255, 0.04);
          --pf-btn-case-border: rgba(255, 255, 255, 0.08);
          --pf-icon-bg: rgba(255, 255, 255, 0.04);
          --pf-icon-border: rgba(255, 255, 255, 0.1);
        }

        /* ── Eyebrow & Titles ── */
        .work-header {
          margin-bottom: clamp(32px, 4.5vw, 54px);
        }
        .work-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: clamp(11px, 1.1vw, 13px);
          color: var(--primary-color);
          letter-spacing: .09em;
          text-transform: uppercase;
          margin-bottom: 10px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-weight: 500;
        }
        .work-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 700;
          font-size: clamp(2.4rem, 4.8vw, 4.2rem);
          line-height: 1.06;
          letter-spacing: -0.025em;
          color: var(--pf-text);
          margin-bottom: 14px;
        }
        .work-title em {
          font-style: italic;
          color: var(--primary-color);
        }
        .work-subtitle {
          color: var(--pf-text-muted);
          font-size: clamp(0.92rem, 1.25vw, 1.1rem);
          max-width: 580px;
          line-height: 1.6;
          margin-bottom: 0;
        }

        /* ── Filter Pills ── */
        .work-filters {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
          margin-bottom: clamp(40px, 5.5vw, 68px);
        }
        .work-pill {
          font-family: 'DM Mono', monospace;
          padding: 7px 18px;
          border-radius: 99px;
          font-size: clamp(12px, 1.1vw, 13px);
          font-weight: 500;
          cursor: pointer;
          transition: all .25s cubic-bezier(.34, 1.56, .64, 1);
          border: 1px solid var(--pf-frame-border);
          background: var(--pf-btn-case-bg);
          color: var(--pf-text-muted);
          backdrop-filter: blur(8px);
        }
        .work-pill:hover:not(.is-active) {
          border-color: var(--primary-color);
          color: var(--pf-text);
          transform: translateY(-2px);
        }
        .work-pill.is-active {
          background: var(--pf-pill-bg);
          border-color: var(--primary-color);
          color: var(--primary-color);
          transform: translateY(-2px);
          box-shadow: 0 4px 18px var(--pf-aura);
        }

        /* ── Projects Container ── */
        .projects {
          display: grid;
          gap: clamp(55px, 8vw, 110px);
          transition: opacity .25s ease;
        }
        .projects.is-exiting { opacity: 0; }

        /* ── Project Item (Alternating 2-column Grid) ── */
        .project {
          display: grid;
          grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
          gap: clamp(30px, 4.5vw, 68px);
          align-items: center;
          position: relative;
        }
        .project--flip {
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.25fr);
        }
        .project--flip .project-media-container {
          order: 2;
        }
        .project--flip .project-info {
          order: 1;
        }

        /* ── Project Media Wrapper & Aura ── */
        .project-media-container {
          position: relative;
          width: 100%;
          min-width: 0;
        }
        .project-aura {
          position: absolute;
          inset: -20px;
          border-radius: 28px;
          background: radial-gradient(circle at 50% 50%, var(--pf-aura) 0%, transparent 68%);
          filter: blur(35px);
          pointer-events: none;
          z-index: 0;
          opacity: 0.65;
          transition: opacity .4s ease;
        }
        .project:hover .project-aura {
          opacity: 1;
        }

        /* ── Mac Browser Mockup ── */
        .project-media {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          width: 100%;
          aspect-ratio: 16 / 10;
          min-height: 250px;
          border-radius: 16px;
          background: var(--pf-frame-bg);
          border: 1px solid var(--pf-frame-border);
          box-shadow: var(--pf-frame-shadow);
          overflow: hidden;
          transition: transform .4s cubic-bezier(.34, 1.56, .64, 1), box-shadow .4s ease, border-color .3s;
        }
        .project:hover .project-media {
          transform: translateY(-6px);
          border-color: var(--primary-color);
        }

        /* Browser Chrome Bar */
        .media-chrome {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          background: var(--pf-chrome-bg);
          border-bottom: 1px solid var(--pf-chrome-border);
          flex-shrink: 0;
          z-index: 3;
          transition: background .3s, border-color .3s;
        }
        .chrome-dots {
          display: flex;
          gap: 6px;
          flex-shrink: 0;
        }
        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          display: block;
          transition: transform .2s ease;
        }
        .dot-red { background: #ff5f57; }
        .dot-yellow { background: #febc2e; }
        .dot-green { background: #28c840; }
        .project:hover .dot { transform: scale(1.08); }

        .chrome-url-bar {
          flex: 1;
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--pf-url-bg);
          border: 1px solid var(--pf-url-border);
          border-radius: 6px;
          padding: 3px 10px;
          overflow: hidden;
          transition: background .3s, border-color .3s;
        }
        .chrome-lock {
          font-size: .68rem;
          color: #22c55e;
          flex-shrink: 0;
        }
        .chrome-url-text {
          font-family: 'DM Mono', monospace;
          font-size: .68rem;
          color: var(--pf-text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .chrome-live-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-family: 'DM Mono', monospace;
          font-size: .58rem;
          font-weight: 700;
          color: #22c55e;
          background: rgba(34, 197, 94, .14);
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
          opacity: .75;
          animation: ping 1.6s cubic-bezier(0, 0, .2, 1) infinite;
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
          75%, 100% {
            transform: scale(2.4);
            opacity: 0;
          }
        }

        .chrome-tools {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }
        .chrome-tool-btn {
          background: var(--pf-url-bg);
          border: 1px solid var(--pf-url-border);
          color: var(--pf-text-muted);
          padding: 3px 8px;
          border-radius: 5px;
          font-size: .68rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          transition: all .2s ease;
        }
        .chrome-tool-btn:hover, .chrome-tool-btn.is-active {
          background: var(--pf-pill-bg);
          color: var(--primary-color);
          border-color: var(--primary-color);
        }
        .chrome-tool-btn.icon-only {
          padding: 3px 6px;
        }
        .chrome-tool-btn.icon-only:hover i {
          transform: rotate(180deg);
          transition: transform .35s ease;
        }

        /* Screen Canvas */
        .media-screen {
          flex: 1;
          position: relative;
          overflow: hidden;
          background: #090c13;
        }
        .live-frame-wrap {
          width: 100%;
          height: 100%;
          position: relative;
        }
        .live-iframe {
          width: 100%;
          height: 100%;
          border: none;
          display: block;
          background: #ffffff;
        }

        .live-loader {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: var(--pf-frame-bg);
          color: var(--pf-text-muted);
          font-size: .76rem;
          font-family: 'DM Mono', monospace;
          z-index: 2;
        }
        .loader-ring {
          width: 26px;
          height: 26px;
          border: 2.5px solid var(--pf-url-border);
          border-top-color: var(--primary-color);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Interaction Shield */
        .interaction-shield {
          position: absolute;
          inset: 0;
          background: rgba(9, 12, 19, .22);
          backdrop-filter: blur(1.5px);
          -webkit-backdrop-filter: blur(1.5px);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all .25s ease;
          z-index: 4;
        }
        .interaction-shield:hover {
          background: rgba(9, 12, 19, .05);
        }
        .shield-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(9, 12, 19, .92);
          border: 1px solid rgba(255, 255, 255, .22);
          color: #fff;
          font-size: clamp(.72rem, 1vw, .78rem);
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 99px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, .45);
          transition: transform .25s cubic-bezier(.34, 1.56, .64, 1), background .2s;
        }
        .interaction-shield:hover .shield-pill {
          transform: scale(1.05);
          background: var(--primary-color);
          color: #0b0f19;
          border-color: #fff;
        }
        .shield-popout {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(9, 12, 19, .85);
          border: 1px solid rgba(255, 255, 255, .2);
          color: #fff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: .78rem;
          transition: all .2s ease;
        }
        .shield-popout:hover {
          background: var(--primary-color);
          color: #0b0f19;
          transform: scale(1.15);
        }

        .interaction-exit-pill {
          position: absolute;
          bottom: 10px;
          right: 10px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(9, 12, 19, .92);
          border: 1px solid rgba(201, 240, 107, .4);
          color: #fff;
          font-size: .7rem;
          font-weight: 600;
          padding: 5px 12px;
          border-radius: 99px;
          cursor: pointer;
          z-index: 5;
          box-shadow: 0 4px 14px rgba(0, 0, 0, .4);
          transition: transform .2s ease, background .2s;
        }
        .interaction-exit-pill:hover {
          background: var(--primary-color);
          color: #0b0f19;
          transform: scale(1.04);
        }

        /* Snapshot Mode with Smooth Scroll */
        .snapshot-wrap {
          width: 100%;
          height: 100%;
          overflow: hidden;
          position: relative;
          cursor: pointer;
        }
        .snapshot-img {
          width: 100%;
          height: auto;
          min-height: 140%;
          object-fit: cover;
          object-position: top;
          display: block;
          transition: transform 6s cubic-bezier(0.22, 1, 0.5, 1);
          transform: translateY(0);
        }
        .snapshot-wrap.is-scrolling .snapshot-img {
          transform: translateY(calc(-100% + 260px));
        }
        .snapshot-hint {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: rgba(9, 12, 19, .85);
          border: 1px solid rgba(255, 255, 255, .15);
          color: #fff;
          font-size: .65rem;
          font-weight: 600;
          padding: 3px 9px;
          border-radius: 99px;
          display: flex;
          align-items: center;
          gap: 5px;
          pointer-events: none;
        }

        /* ── Streamlined Project Info ── */
        .project-info {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .project-num {
          font-family: 'DM Mono', monospace;
          font-size: clamp(12px, 1.1vw, 13px);
          color: var(--primary-color);
          letter-spacing: .08em;
          margin: 0;
          text-transform: uppercase;
          font-weight: 600;
        }
        .project-title {
          margin-top: 10px;
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 700;
          font-size: clamp(2.2rem, 3.8vw, 3.6rem);
          line-height: 1.08;
          letter-spacing: -0.03em;
          color: var(--pf-text);
          margin-bottom: 0;
          word-break: break-word;
        }
        .project-desc {
          margin-top: 14px;
          color: var(--pf-text-muted);
          font-size: clamp(14px, 1.1vw, 15.5px);
          line-height: 1.65;
          margin-bottom: 0;
          max-width: 520px;
        }

        /* ── Tech Chips ── */
        .chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 20px;
          list-style: none;
          padding: 0;
          margin-bottom: 0;
        }
        .chips li {
          display: inline-flex;
          align-items: center;
          padding: 5px 13px;
          border-radius: 99px;
          border: 1px solid var(--pf-pill-border);
          background: var(--pf-pill-bg);
          font-size: 12.5px;
          color: var(--primary-color);
          font-family: 'DM Mono', monospace;
          font-weight: 500;
          transition: all .2s ease;
        }
        .chips li:hover {
          transform: translateY(-1px);
          filter: brightness(1.15);
        }

        /* ── Action Buttons ── */
        .project-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 28px;
          flex-wrap: wrap;
        }
        .btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 22px;
          border-radius: 99px;
          border: 1.5px solid var(--pf-btn-ghost-border);
          background: var(--pf-btn-ghost-bg);
          color: var(--pf-btn-ghost-color);
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: all .25s cubic-bezier(.34, 1.56, .64, 1);
        }
        .btn-ghost:hover {
          border-color: var(--primary-color);
          background: var(--primary-color);
          color: #0b0f19;
          transform: translateY(-2px);
          box-shadow: 0 4px 18px var(--pf-aura);
        }
        .btn-ghost.btn-disabled {
          opacity: .4;
          cursor: not-allowed;
        }

        .btn-case {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 20px;
          border-radius: 99px;
          background: var(--pf-btn-case-bg);
          color: var(--pf-text-muted);
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          border: 1px solid var(--pf-btn-case-border);
          transition: all .25s ease;
        }
        .btn-case:hover {
          color: var(--pf-text);
          border-color: var(--primary-color);
          transform: translateY(-2px);
        }

        .extra-links {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-left: auto;
        }
        .icon-link {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: var(--pf-icon-bg);
          border: 1px solid var(--pf-icon-border);
          color: var(--pf-text-muted);
          font-size: .95rem;
          text-decoration: none;
          transition: all .25s cubic-bezier(.34, 1.56, .64, 1);
        }
        .icon-link:hover {
          color: var(--primary-color);
          border-color: var(--primary-color);
          transform: scale(1.14);
          background: var(--pf-pill-bg);
        }

        /* ── Responsive Breakpoints ── */

        /* Tablets & Small Laptops (991px and down) */
        @media (max-width: 991px) {
          .project, .project--flip {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .project--flip .project-media-container {
            order: 0 !important;
          }
          .project--flip .project-info {
            order: 1 !important;
          }
          .project-media {
            aspect-ratio: auto;
            height: clamp(280px, 44vw, 400px);
          }
        }

        /* Mobile Screens (767px and down) */
        @media (max-width: 767px) {
          .work-section {
            padding: 48px 0;
          }
          .work-title {
            font-size: clamp(2rem, 7vw, 2.7rem);
          }
          .project-title {
            font-size: clamp(1.85rem, 6.5vw, 2.4rem);
          }
          .project-media {
            height: clamp(230px, 56vw, 300px);
            border-radius: 12px;
          }
          .media-chrome {
            padding: 8px 12px;
            gap: 8px;
          }
          .chrome-url-bar {
            padding: 3px 8px;
          }
          .chrome-url-text {
            font-size: .62rem;
          }
          .chrome-live-chip {
            font-size: .52rem;
            padding: 1px 4px;
          }
          .chrome-tool-btn .tool-text {
            display: none;
          }
          .chrome-tool-btn {
            padding: 3px 6px;
          }
          .project-actions {
            gap: 10px;
          }
          .btn-ghost, .btn-case {
            padding: 9px 18px;
            font-size: 12px;
          }
          .extra-links {
            margin-left: 0;
            width: 100%;
            justify-content: flex-start;
            padding-top: 4px;
          }
        }

        /* Very Small Phones (420px and down) */
        @media (max-width: 420px) {
          .project-actions {
            flex-direction: column;
            align-items: stretch;
          }
          .btn-ghost, .btn-case {
            justify-content: center;
            width: 100%;
          }
          .extra-links {
            justify-content: center;
          }
        }
      `}</style>

      <section id="portfolio" className="work-section">
        <div className="container">

          {/* Section Header matching other sections */}
          <div className="text-center mb-5" data-aos="fade-up">
            <span className="section-badge">
              <i className="bi bi-briefcase-fill" />
              Featured Projects
            </span>
            <h2 className="section-title">Portfolio Showcase</h2>
            <div className="title-shape">
              <svg viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M 0,10 C 40,0 60,20 100,10 C 140,0 160,20 200,10" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <p className="section-subtitle">
              A curated selection of full-stack web applications, commerce operating systems, and digital platforms.
            </p>
          </div>

          {/* Categories Filter Pills */}
          <div className="work-filters" data-aos="fade-up" data-aos-delay="60">
            {categories.map(cat => {
              const count = cat.toLowerCase() === 'all'
                ? activeItems.length
                : activeItems.filter(x => getPortfolioCategoryName(x).toLowerCase() === cat.trim().toLowerCase()).length;
              return (
                <button
                  key={cat}
                  className={`work-pill ${activeFilter.trim().toLowerCase() === cat.trim().toLowerCase() ? 'is-active' : ''}`}
                  onClick={() => handleFilterChange(cat)}
                >
                  {cat.toLowerCase() === 'all' ? `All (${count})` : (count > 0 ? `${cat} (${count})` : cat)}
                </button>
              );
            })}
          </div>

          {/* Streamlined Project Showcase */}
          <div className={`projects ${animating ? 'is-exiting' : ''}`} id="projects">
            {loading ? (
              [1, 2].map(n => (
                <div key={n} className="project skeleton-shimmer" style={{ minHeight: '360px', borderRadius: '16px' }} />
              ))
            ) : filtered.length > 0 ? (
              filtered.map((item, index) => (
                <ProjectItem
                  key={item._id || index}
                  item={item}
                  index={index}
                  total={filtered.length}
                />
              ))
            ) : (
              <div className="text-center py-5 text-muted">
                No projects found in this category.
              </div>
            )}
          </div>

        </div>
      </section>
    </>
  );
}
