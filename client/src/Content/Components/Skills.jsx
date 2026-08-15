"use client"
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import AOS from "aos";
import "aos/dist/aos.css";
import { getSkill } from "../Redux/ActionCreators/SkillActionCreators";

// Map common skill names to Bootstrap icons as fallbacks
const SKILL_ICON_MAP = {
  "react": "bi bi-infinity",
  "next": "bi bi-arrow-right-circle-fill",
  "vue": "bi bi-triangle-fill",
  "html": "bi bi-filetype-html",
  "css": "bi bi-filetype-css",
  "javascript": "bi bi-filetype-js",
  "typescript": "bi bi-filetype-tsx",
  "redux": "bi bi-arrow-repeat",
  "tailwind": "bi bi-wind",
  "bootstrap": "bi bi-bootstrap-fill",
  "node": "bi bi-node-plus",
  "express": "bi bi-server",
  "mongo": "bi bi-database-fill",
  "mysql": "bi bi-table",
  "postgresql": "bi bi-grid-3x3",
  "python": "bi bi-filetype-py",
  "java": "bi bi-cup-hot-fill",
  "c++": "bi bi-code-slash",
  "golang": "bi bi-braces",
  "git": "bi bi-git",
  "github": "bi bi-github",
  "docker": "bi bi-box-seam",
  "aws": "bi bi-cloud-fill",
  "figma": "bi bi-vector-pen",
  "postman": "bi bi-send-check-fill",
  "firebase": "bi bi-fire",
  "graphql": "bi bi-bezier2",
  "linux": "bi bi-terminal-fill",
  "sass": "bi bi-filetype-scss",
  "webpack": "bi bi-layers-fill",
  "vite": "bi bi-lightning-fill",
  "php": "bi bi-filetype-php",
  "swift": "bi bi-phone-fill",
  "kotlin": "bi bi-phone-fill",
  "flutter": "bi bi-phone",
  "redis": "bi bi-database-fill-gear",
  "nginx": "bi bi-hdd-network",
  "kubernetes": "bi bi-gear-wide-connected",
};

function getSkillIcon(skill) {
  if (skill.icon && skill.icon.trim()) return skill.icon.trim();
  const lowerName = skill.name.toLowerCase();
  for (const [key, cls] of Object.entries(SKILL_ICON_MAP)) {
    if (lowerName.includes(key)) return cls;
  }
  return "bi bi-stars";
}

export default function Skills() {
  const SkillStateData = useSelector((state) => state.SkillStateData);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("all");
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [popoverStyle, setPopoverStyle] = useState({ top: 0, left: 0, showAbove: false });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    dispatch(getSkill());
    AOS.init({ duration: 900, once: true });
  }, [dispatch]);

  const activeSkills = useMemo(() => {
    return Array.isArray(SkillStateData) ? SkillStateData.filter((x) => x.active) : [];
  }, [SkillStateData]);

  const categorizedSkills = useMemo(() => {
    if (activeTab === "all") return activeSkills;
    if (activeTab === "frontend") {
      return activeSkills.filter(s =>
        /react|next|vue|html|css|javascript|typescript|redux|tailwind|bootstrap|ui|ux|frontend|sass|angular|svelte/i.test(s.name + " " + (s.description || ""))
      );
    }
    if (activeTab === "backend") {
      return activeSkills.filter(s =>
        /node|express|mongo|sql|database|api|backend|python|java|c\+\+|golang|server|django|flask|laravel|php|graphql|redis/i.test(s.name + " " + (s.description || ""))
      );
    }
    if (activeTab === "tools") {
      return activeSkills.filter(s =>
        /git|github|docker|aws|figma|postman|vite|webpack|linux|cloud|tools|kubernetes|nginx|firebase|ci|cd/i.test(s.name + " " + (s.description || ""))
      );
    }
    return activeSkills;
  }, [activeSkills, activeTab]);

  function handleMouseEnter(e, skill) {
    const rect = e.currentTarget.getBoundingClientRect();
    const popoverHeight = 180;
    const popoverWidth = 320;
    
    // Check if there's room below or if it should show above
    const showAbove = rect.bottom + popoverHeight > window.innerHeight && rect.top > popoverHeight;
    
    // Calculate clamped horizontal position
    let left = rect.left + rect.width / 2;
    if (left - popoverWidth / 2 < 16) {
      left = popoverWidth / 2 + 16;
    } else if (left + popoverWidth / 2 > window.innerWidth - 16) {
      left = window.innerWidth - popoverWidth / 2 - 16;
    }

    const top = showAbove ? rect.top - 12 : rect.bottom + 12;

    setPopoverStyle({ top, left, showAbove });
    setHoveredSkill(skill);
    setIsVisible(true);
  }

  function handleMouseLeave() {
    setIsVisible(false);
    setHoveredSkill(null);
  }

  const getProficiencyLabel = (lvl) => {
    if (lvl >= 90) return "Mastery";
    if (lvl >= 80) return "Advanced";
    if (lvl >= 70) return "Proficient";
    return "Familiar";
  };

  return (
    <section id="skills" className="skills-section">
      <div className="container text-center" data-aos="fade-up">
        <span className="section-badge">
          <i className="bi bi-cpu"></i>
          Technical Proficiency
        </span>
        <h2 className="section-title">Skills &amp; Technologies</h2>
        <div className="title-shape">
          <svg viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M 0,10 C 40,0 60,20 100,10 C 140,0 160,20 200,10" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        <p className="section-subtitle mb-4">
          Core technical stack, modern frameworks, and engineering tools. Hover over any skill to learn more.
        </p>

        {/* Category Filter Pills */}
        <div className="skill-category-filters" data-aos="fade-up" data-aos-delay="100">
          {[
            { id: "all", label: `All Skills (${activeSkills.length})` },
            { id: "frontend", label: "Frontend" },
            { id: "backend", label: "Backend & DB" },
            { id: "tools", label: "Tools & Cloud" },
          ].map(tab => (
            <button
              key={tab.id}
              className={`skill-filter-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="row g-3 justify-content-center mt-2">
          {categorizedSkills.map((skill, index) => {
            const iconClass = getSkillIcon(skill);

            return (
              <div
                key={skill._id || index}
                className="col-6 col-sm-4 col-md-3 col-lg-2"
                data-aos="fade-up"
                data-aos-delay={(index % 6) * 40}
              >
                <div
                  className="skill-card-minimal"
                  onMouseEnter={(e) => handleMouseEnter(e, skill)}
                  onMouseLeave={handleMouseLeave}
                  onClick={(e) => handleMouseEnter(e, skill)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${skill.name}: ${skill.level}% proficiency`}
                  style={{ cursor: "pointer", position: "relative" }}
                >
                  {/* Minimal Icon Badge */}
                  <div className="skill-minimal-icon">
                    <i className={iconClass}></i>
                  </div>

                  {/* Skill Name */}
                  <h3 className="skill-minimal-name">
                    {skill.name}
                  </h3>

                  {/* Level text */}
                  <span className="skill-minimal-level">
                    {skill.level}%
                  </span>

                  {/* Minimal Progress Bar */}
                  <div className="skill-minimal-progress-wrap">
                    <div
                      className="skill-minimal-progress-bar"
                      role="progressbar"
                      style={{ width: `${skill.level}%` }}
                      aria-valuenow={skill.level}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}

          {categorizedSkills.length === 0 && (
            <div className="col-12 py-4 text-muted">
              No skills found in this category.
            </div>
          )}
        </div>
      </div>

      {/* Desktop Floating Hover Popover (>=768px) */}
      {isVisible && hoveredSkill && (
        <div
          className="skill-hover-popover d-none d-md-block"
          style={{
            position: "fixed",
            top: popoverStyle.top,
            left: popoverStyle.left,
            transform: popoverStyle.showAbove ? "translate(-50%, -100%)" : "translate(-50%, 0)",
            zIndex: 99999,
            pointerEvents: "none",
          }}
        >
          <div className="skill-popover-card">
            {/* Header */}
            <div className="d-flex align-items-center gap-3 mb-2">
              <div className="skill-popover-icon">
                <i className={getSkillIcon(hoveredSkill)}></i>
              </div>
              <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                <div className="d-flex align-items-center justify-content-between gap-2">
                  <h4 className="skill-popover-title text-truncate m-0">
                    {hoveredSkill.name}
                  </h4>
                  <span className="skill-popover-badge">
                    {getProficiencyLabel(hoveredSkill.level)}
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2 mt-1">
                  <div className="skill-popover-bar-wrap">
                    <div
                      className="skill-popover-bar"
                      style={{ width: `${hoveredSkill.level}%` }}
                    ></div>
                  </div>
                  <span className="skill-popover-pct">
                    {hoveredSkill.level}%
                  </span>
                </div>
              </div>
            </div>

            {/* Description Body */}
            <p className="skill-popover-desc m-0 text-start">
              {hoveredSkill.description || `Extensive hands-on experience and production competence with ${hoveredSkill.name}.`}
            </p>
          </div>
        </div>
      )}

      {/* Mobile Modal Dialog (<768px) */}
      {isVisible && hoveredSkill && (
        <div
          className="skill-mobile-modal-overlay d-md-none"
          onClick={() => setIsVisible(false)}
        >
          <div
            className="skill-mobile-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="skill-mobile-modal-close"
              onClick={() => setIsVisible(false)}
              aria-label="Close modal"
            >
              <i className="bi bi-x-lg"></i>
            </button>

            {/* Header */}
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="skill-popover-icon">
                <i className={getSkillIcon(hoveredSkill)}></i>
              </div>
              <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                <div className="d-flex align-items-center justify-content-between gap-2">
                  <h4 className="skill-popover-title text-truncate m-0" style={{ fontSize: "1.1rem" }}>
                    {hoveredSkill.name}
                  </h4>
                  <span className="skill-popover-badge">
                    {getProficiencyLabel(hoveredSkill.level)}
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2 mt-2">
                  <div className="skill-popover-bar-wrap" style={{ height: "6px" }}>
                    <div
                      className="skill-popover-bar"
                      style={{ width: `${hoveredSkill.level}%` }}
                    ></div>
                  </div>
                  <span className="skill-popover-pct" style={{ fontSize: "0.85rem" }}>
                    {hoveredSkill.level}%
                  </span>
                </div>
              </div>
            </div>

            {/* Description Body */}
            <p className="skill-popover-desc m-0 text-start" style={{ fontSize: "0.88rem", lineHeight: "1.65" }}>
              {hoveredSkill.description || `Extensive hands-on experience and production competence with ${hoveredSkill.name}.`}
            </p>

            {/* Dismiss Button */}
            <button
              className="btn btn-primary btn-sm w-100 mt-3"
              style={{ borderRadius: "var(--radius-pill)", fontWeight: 600, padding: "8px 16px" }}
              onClick={() => setIsVisible(false)}
            >
              Got it
            </button>
          </div>
        </div>
      )}

      <style>{`
        .skill-card-minimal {
          text-align: center;
          padding: 22px 14px 18px;
          border-radius: var(--radius-md, 14px);
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          transition: transform var(--ease-quick), border-color var(--ease-quick), box-shadow var(--ease-quick);
        }
        .skill-card-minimal:hover {
          transform: translateY(-4px);
          border-color: var(--primary-color);
          box-shadow: var(--shadow-sm);
        }
        .skill-minimal-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: var(--bg-alt);
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 12px;
          font-size: 1.4rem;
          color: var(--text-color);
          transition: all var(--ease-quick);
        }
        .skill-card-minimal:hover .skill-minimal-icon {
          color: var(--primary-color);
          border-color: rgba(var(--accent-rgb), 0.3);
          background: rgba(var(--accent-rgb), 0.08);
        }
        .skill-minimal-name {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-color);
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .skill-minimal-level {
          font-family: 'DM Mono', monospace;
          font-size: 0.76rem;
          font-weight: 600;
          color: var(--text-muted);
          display: block;
          margin-bottom: 10px;
        }
        .skill-minimal-progress-wrap {
          height: 4px;
          background: var(--border-color);
          border-radius: var(--radius-pill);
          overflow: hidden;
        }
        .skill-minimal-progress-bar {
          height: 100%;
          background: var(--primary-color);
          border-radius: var(--radius-pill);
          transition: width 0.8s ease-out;
        }

        /* Hover Popover Modal Card (Desktop) */
        .skill-hover-popover {
          width: 320px;
          max-width: calc(100vw - 32px);
          animation: popoverFadeIn 0.2s cubic-bezier(0.34, 1.4, 0.64, 1) forwards;
        }

        .skill-popover-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: var(--radius-md, 14px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(var(--accent-rgb), 0.15);
          padding: 16px 18px;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }

        .skill-popover-icon {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: rgba(var(--accent-rgb), 0.12);
          border: 1px solid rgba(var(--accent-rgb), 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          color: var(--primary-color);
          flex-shrink: 0;
        }

        .skill-popover-title {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--text-color);
        }

        .skill-popover-badge {
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 2px 8px;
          border-radius: var(--radius-pill);
          background: var(--primary-gradient);
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(var(--accent-rgb), 0.3);
        }

        .skill-popover-bar-wrap {
          flex: 1;
          height: 5px;
          background: var(--border-color);
          border-radius: var(--radius-pill);
          overflow: hidden;
        }

        .skill-popover-bar {
          height: 100%;
          background: var(--primary-gradient);
          border-radius: var(--radius-pill);
          transition: width 0.4s ease;
        }

        .skill-popover-pct {
          font-family: 'DM Mono', monospace;
          font-size: 0.76rem;
          font-weight: 700;
          color: var(--primary-color);
        }

        .skill-popover-desc {
          font-size: 0.84rem;
          line-height: 1.6;
          color: var(--text-muted);
          margin-top: 8px;
          border-top: 1px solid var(--border-color);
          padding-top: 10px;
        }

        /* Mobile Modal Styles (<768px) */
        .skill-mobile-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10, 12, 28, 0.75);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          animation: modalFadeIn 0.22s ease-out forwards;
        }

        .skill-mobile-modal-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: var(--radius-lg, 20px);
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(var(--accent-rgb), 0.2);
          padding: 22px 20px 18px;
          width: 100%;
          max-width: 360px;
          position: relative;
          animation: modalSlideUp 0.25s cubic-bezier(0.34, 1.4, 0.64, 1) forwards;
        }

        .skill-mobile-modal-close {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--bg-alt);
          border: 1px solid var(--border-color);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.82rem;
          cursor: pointer;
          transition: all var(--ease-quick);
        }

        .skill-mobile-modal-close:hover {
          color: var(--text-color);
          border-color: var(--primary-color);
        }

        @keyframes popoverFadeIn {
          from {
            opacity: 0;
            transform: scale(0.92);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes modalFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes modalSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </section>
  );
}
