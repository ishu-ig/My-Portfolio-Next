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
  const [modalPos, setModalPos] = useState({ top: 0, left: 0 });
  const [modalVisible, setModalVisible] = useState(false);

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
    setHoveredSkill(skill);
    setModalPos({ top: rect.bottom + window.scrollY + 10, left: rect.left + window.scrollX + rect.width / 2 });
    setModalVisible(true);
  }

  function handleMouseLeave() {
    setModalVisible(false);
    setHoveredSkill(null);
  }

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
          Core technical stack, modern frameworks, and engineering tools.
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

      {/* Floating Minimal Description Tooltip */}
      {modalVisible && hoveredSkill && (
        <div
          className="skill-hover-modal"
          style={{
            position: "absolute",
            top: modalPos.top,
            left: modalPos.left,
            transform: "translateX(-50%)",
            zIndex: 9999,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              borderRadius: "var(--radius-sm, 10px)",
              boxShadow: "var(--shadow-lg)",
              padding: "12px 16px",
              maxWidth: 280,
              minWidth: 200,
              backdropFilter: "blur(12px)",
              animation: "modalIn 0.15s ease-out",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <i className={getSkillIcon(hoveredSkill)} style={{ fontSize: "1.1rem", color: "var(--primary-color)" }}></i>
              <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-color)" }}>
                {hoveredSkill.name}
              </div>
              <span style={{ marginLeft: "auto", fontSize: "0.76rem", fontWeight: 700, color: "var(--text-muted)", fontFamily: "'DM Mono', monospace" }}>
                {hoveredSkill.level}%
              </span>
            </div>

            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.5, margin: 0 }}>
              {hoveredSkill.description || "Core technical proficiency."}
            </p>
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
        @keyframes modalIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-4px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0);    }
        }
      `}</style>
    </section>
  );
}
