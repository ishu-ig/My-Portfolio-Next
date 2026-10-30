import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

// A item with `children` becomes a collapsible group.
const navLinks = [
  { to: "/", icon: "bi-speedometer2", label: "Dashboard" },
  { to: "/about", icon: "bi-person-badge", label: "About Me" },
  {
    icon: "bi-stars",
    label: "Skills",
    children: [
      { to: "/skill", icon: "bi-star", label: "Skill" },
      { to: "/skill-category", icon: "bi-tags", label: "Skill Category" },
    ],
  },
  { to: "/education", icon: "bi-mortarboard", label: "Education" },
  { to: "/experience", icon: "bi-briefcase", label: "Experience" },
  { to: "/achievement", icon: "bi-trophy", label: "Achievements" },
  { to: "/certificate", icon: "bi-patch-check", label: "Certificates" },
  {
    icon: "bi-collection",
    label: "Portfolio",
    children: [
      { to: "/portfolio", icon: "bi-folder2-open", label: "Project" },
      { to: "/project-category", icon: "bi-folder", label: "Project Category" },
    ],
  },
  { to: "/service", icon: "bi-gear", label: "Services" },
  { to: "/blog", icon: "bi-file-earmark-text", label: "Blogs" },
  { to: "/testimonial", icon: "bi-chat-quote", label: "Testimonial" },
  { to: "/note", icon: "bi-file-earmark-pdf-fill", label: "PDF Notes" },
  { to: "/newsletter", icon: "bi-envelope-paper", label: "Newsletter" },
  { to: "/user", icon: "bi-people", label: "Users" },
  { to: "/contactUs", icon: "bi-headset", label: "Queries" },
];

export default function Sidebar({ onLinkClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState(null);
  const [openGroups, setOpenGroups] = useState({});

  useEffect(() => {
    (async () => {
      try {
        let response = await fetch(
          `${process.env.REACT_APP_BACKEND_SERVER}/api/user/${localStorage.getItem("userid")}`,
          { headers: { Authorization: localStorage.getItem("token") } }
        );
        response = await response.json();
        if (response.data) setData(response.data);
        else navigate("/login");
      } catch {
        navigate("/login");
      }
    })();
  }, [navigate]);

  // Auto-open the group that contains the current route
  useEffect(() => {
    navLinks.forEach((item) => {
      if (
        item.children &&
        item.children.some(
          (c) =>
            location.pathname === c.to ||
            location.pathname.startsWith(c.to + "/")
        )
      ) {
        setOpenGroups((old) => ({ ...old, [item.label]: true }));
      }
    });
  }, [location.pathname]);

  function toggleGroup(label) {
    setOpenGroups((old) => ({ ...old, [label]: !old[label] }));
  }

  function handleLinkClick() {
    if (!window.matchMedia("(min-width: 992px)").matches) {
      onLinkClick?.();
    }
  }

  const name = data?.name || localStorage.getItem("name") || "Admin";

  return (
    <aside className="admin-sidebar" id="adminSidebar" aria-label="Main navigation">
      <style>{`
        .nav-group-toggle {
          width: 100%;
          background: transparent;
          border: none;
          text-align: left;
          color: inherit;
          font: inherit;
          cursor: pointer;
        }
        .nav-chevron {
          margin-left: auto;
          font-size: 0.75rem;
          transition: transform .2s ease;
        }
        .nav-group-toggle.open .nav-chevron { transform: rotate(180deg); }
        .nav-sub {
          display: none;
          margin: 2px 0 4px 18px;
          padding-left: 10px;
          border-left: 1px solid rgba(255, 255, 255, .15);
        }
        .nav-sub.open { display: block; }
        .nav-sub .nav-link { font-size: 0.9rem; padding-top: 6px; padding-bottom: 6px; }
      `}</style>

      <div className="sidebar-header">
        <NavLink className="brand-mark" to="/" aria-label="Dashboard">
          <span className="brand-icon">
            <i className="bi bi-grid-1x2-fill" aria-hidden="true"></i>
          </span>
          <span className="brand-copy">
            <span className="brand-title">adminHMD</span>
            <span className="brand-subtitle">Admin Template</span>
          </span>
        </NavLink>
      </div>

      <nav className="sidebar-nav">
        {navLinks.map((item) => {
          if (item.children) {
            const isOpen = !!openGroups[item.label];
            const hasActiveChild = item.children.some(
              (c) =>
                location.pathname === c.to ||
                location.pathname.startsWith(c.to + "/")
            );
            return (
              <div key={item.label}>
                <button
                  type="button"
                  className={`nav-link nav-group-toggle${isOpen ? " open" : ""}${hasActiveChild ? " active" : ""
                    }`}
                  onClick={() => toggleGroup(item.label)}
                  aria-expanded={isOpen}
                >
                  <span className="nav-icon">
                    <i className={`bi ${item.icon}`} aria-hidden="true"></i>
                  </span>
                  <span className="nav-text">{item.label}</span>
                  <i className="bi bi-chevron-down nav-chevron" aria-hidden="true"></i>
                </button>
                <div className={`nav-sub${isOpen ? " open" : ""}`}>
                  {item.children.map(({ to, icon, label }) => (
                    <NavLink
                      key={to}
                      to={to}
                      className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                      onClick={handleLinkClick}
                    >
                      <span className="nav-icon">
                        <i className={`bi ${icon}`} aria-hidden="true"></i>
                      </span>
                      <span className="nav-text">{label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          }

          const { to, icon, label } = item;
          return (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
              onClick={handleLinkClick}
            >
              <span className="nav-icon">
                <i className={`bi ${icon}`} aria-hidden="true"></i>
              </span>
              <span className="nav-text">{label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* <div className="sidebar-user">
        <img
          className="avatar-img avatar-md sidebar-user-avatar"
          src={data?.pic ? `${data.pic}` : "https://i.pravatar.cc/100"}
          alt={name}
        />
        <strong>{name}</strong>
        <small>Active Workspace</small>
      </div>

      <div className="sidebar-footer">
        <span className="status-dot"></span>
        <span className="sidebar-footer-text">System running smoothly</span>
      </div> */}
    </aside>
  );
}