"use client";
import React, { useState, useEffect, useRef, useContext } from "react";
import Image from "next/image";
import { ThemeContext } from "../ThemeContext";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getAbout } from "../Redux/ActionCreators/AboutActionCreators";

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&family=Instrument+Sans:wght@400;500;600&display=swap');

  :root {
    --nb-font-brand : 'Syne', sans-serif;
    --nb-font-nav   : 'Instrument Sans', sans-serif;
    --nb-font-mono  : 'DM Mono', monospace;
    --nb-radius     : 100px;
    --nb-pill-h     : 56px;
  }

  .nb-pill {
    height: var(--nb-pill-h);
    border-radius: var(--nb-radius);
    display: flex; align-items: center; gap: 0;
    padding: 0 10px 0 18px;
    transition: box-shadow 0.35s ease, background 0.35s ease, border-color 0.35s ease;
  }
  .nb-pill.scrolled-light {
    background: rgba(255,255,255,0.82) !important;
    box-shadow: 0 8px 40px rgba(0,0,0,0.10), 0 1px 0 rgba(255,255,255,0.9) inset;
  }
  .nb-pill.scrolled-dark {
    background: rgba(14,14,20,0.88) !important;
    box-shadow: 0 8px 40px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.04) inset;
  }

  .nb-brand {
    font-family: var(--nb-font-brand);
    font-weight: 800; font-size: 17px; letter-spacing: -0.5px;
    text-decoration: none; flex-shrink: 0;
    position: relative; padding-right: 20px;
  }
  .nb-brand::after {
    content: ''; position: absolute;
    right: 0; top: 50%; transform: translateY(-50%);
    width: 1px; height: 22px;
    background: currentColor; opacity: 0.15;
  }

  .nb-link {
    font-family: var(--nb-font-nav) !important;
    font-size: 13px !important; font-weight: 500 !important;
    letter-spacing: 0.01em; padding: 6px 11px !important;
    border-radius: 6px; text-decoration: none !important;
    position: relative; white-space: nowrap;
    transition: color 0.18s ease !important;
  }
  .nb-link::after {
    content: ''; position: absolute;
    bottom: 2px; left: 11px; right: 11px; height: 1.5px;
    background: var(--primary-color, #4f35d2);
    transform: scaleX(0); transform-origin: right;
    transition: transform 0.25s cubic-bezier(0.4,0,0.2,1);
    border-radius: 2px;
  }
  .nb-link:hover::after { transform: scaleX(1); transform-origin: left; }

  .nb-icon-btn {
    width: 36px; height: 36px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    border: none; cursor: pointer; flex-shrink: 0; font-size: 15px;
    transition: background 0.2s, transform 0.15s;
  }
  .nb-icon-btn:hover { transform: scale(1.08); }

  .nb-social-a {
    display: flex; align-items: center; justify-content: center;
    width: 32px; height: 32px; border-radius: 50%;
    text-decoration: none; font-size: 15px;
    transition: transform 0.18s, opacity 0.18s; opacity: 0.6;
  }
  .nb-social-a:hover { opacity: 1; transform: translateY(-2px); }

  .nb-mobile-menu {
    border-radius: 18px; overflow: hidden;
    animation: menuDrop 0.22s cubic-bezier(0.34,1.4,0.64,1) forwards;
  }
  @keyframes menuDrop {
    from { opacity:0; transform: translateY(-10px) scale(0.97); }
    to   { opacity:1; transform: translateY(0) scale(1); }
  }

  .chat-float-btn {
    position: fixed; bottom: 24px; right: 24px;
    width: 58px; height: 58px; border-radius: 50%;
    border: none; cursor: pointer; z-index: 1050;
    display: flex; align-items: center; justify-content: center;
    transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease;
  }
  .chat-float-btn:hover { transform: scale(1.12); }
  .chat-float-btn .pulse-ring {
    position: absolute; inset: -5px; border-radius: 50%;
    animation: pulseRing 2.4s cubic-bezier(0.4,0,0.6,1) infinite;
  }

  @keyframes pulseRing {
    0%,100% { box-shadow: 0 0 0 0 rgba(79,53,210,0.45); }
    50%      { box-shadow: 0 0 0 12px rgba(79,53,210,0); }
  }
  @keyframes eyeBlink {
    0%,88%,100% { transform: scaleY(1); }
    93%          { transform: scaleY(0.08); }
  }
  @keyframes antennaPulse {
    0%,100% { opacity: 0.45; }
    50%      { opacity: 1; }
  }
  .robot-eye-l { animation: eyeBlink 3.8s ease-in-out infinite; transform-origin: 10px 13px; }
  .robot-eye-r { animation: eyeBlink 3.8s ease-in-out infinite 0.1s; transform-origin: 18px 13px; }
  .robot-antenna-dot { animation: antennaPulse 2s ease-in-out infinite; }

  .no-scroll::-webkit-scrollbar { display: none; }
  .no-scroll { scrollbar-width: none; }

  @media (max-width: 991px) {
    .nb-desktop-links { display: none !important; }
    .nb-desktop-right { display: none !important; }
  }
  @media (min-width: 992px) {
    .nb-hamburger     { display: none !important; }
    .nb-desktop-links { display: flex !important; }
    .nb-desktop-right { display: flex !important; }
  }
  @media (min-width: 768px) and (max-width: 991px) {
    #header { padding: 14px 32px 0 32px !important; }
    .nb-pill { padding: 0 16px 0 24px !important; height: 60px !important; }
    .nb-brand { font-size: 18px !important; padding-right: 24px !important; }
    .nb-icon-btn { width: 40px !important; height: 40px !important; font-size: 16px !important; }
    .nb-mobile-menu { padding: 16px 20px 20px 20px !important; margin-bottom: 14px !important; }
    .nb-mobile-menu-links {
      display: grid !important;
      grid-template-columns: repeat(3, 1fr) !important;
      gap: 8px !important;
    }
    .nb-mobile-menu-links a { text-align: center !important; padding: 9px 10px !important; font-size: 13.5px !important; }
    .nb-mobile-socials { margin-top: 14px !important; padding-top: 14px !important; padding-bottom: 4px !important; }
    .nb-mobile-socials a { font-size: 20px !important; }
  }
  @media (max-width: 480px) {
    #header { padding: 10px 12px !important; }
    .nb-pill { padding: 0 8px 0 14px !important; }
    .nb-brand { font-size: 15px !important; }
  }
`;

/* ─────────────────────────────────────────
   ROBOT SVG ICON
───────────────────────────────────────── */
const RobotIcon = ({ size = 28, color = "#7c5ce9", eyeColor = "#fff", glowColor = "rgba(124,92,233,0.9)" }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={{ position: "relative", zIndex: 1 }}>
    <line x1="14" y1="5.5" x2="14" y2="2.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <circle className="robot-antenna-dot" cx="14" cy="1.8" r="2.2" fill={color}
      style={{ filter: `drop-shadow(0 0 3px ${glowColor})` }} />
    <rect x="4.5" y="6" width="19" height="14" rx="4.5"
      fill="rgba(255,255,255,0.1)" stroke={color} strokeWidth="1.2" />
    <rect className="robot-eye-l" x="7.5" y="10" width="4.5" height="5.5" rx="1.8"
      fill={eyeColor} style={{ filter: `drop-shadow(0 0 4px ${glowColor})` }} />
    <rect className="robot-eye-r" x="16" y="10" width="4.5" height="5.5" rx="1.8"
      fill={eyeColor} style={{ filter: `drop-shadow(0 0 4px ${glowColor})` }} />
    <rect x="9" y="17.5" width="10" height="1.4" rx="0.7" fill={color} opacity="0.55" />
    <rect x="2.5" y="10.5" width="2" height="4" rx="1" fill={color} opacity="0.4" />
    <rect x="23.5" y="10.5" width="2" height="4" rx="1" fill={color} opacity="0.4" />
  </svg>
);

/* ─────────────────────────────────────────
   NAVBAR
───────────────────────────────────────── */
export default function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [showChat, setShowChat] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dispatch = useDispatch();

  const aboutList = useSelector((state) => state.AboutStateData);
  const about     = aboutList?.[0] ?? null;

  const router = useRouter();

  useEffect(() => { dispatch(getAbout()); }, [dispatch]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 992) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace("#", "");
      const tryScroll = (attempts = 0) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
        else if (attempts < 10) setTimeout(() => tryScroll(attempts + 1), 100);
      };
      tryScroll();
    }
  }, []);

  const scrollToSection = (id) => {
    const tryScroll = (attempts = 0) => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      else if (attempts < 10) setTimeout(() => tryScroll(attempts + 1), 100);
    };
    tryScroll();
  };

  const handleNavClick = (e, item) => {
    e.preventDefault();
    setMenuOpen(false);
    if (item === "Home") {
      router.push("/");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const hash  = item.toLowerCase();
    const isHome = window.location.pathname === "/" || window.location.pathname === "/index.html";
    if (isHome) scrollToSection(hash);
    else { router.push(`/#${hash}`); setTimeout(() => scrollToSection(hash), 300); }
  };

  const navItems = ["Home","About","Skills","Resume","Certificate","Portfolio","Testimonials","Services","Blog","Contact"];

  const socials = [
    { icon: "bi-github",    url: about?.gitLink      || "#" },
    { icon: "bi-linkedin",  url: about?.linkidinLink || "#" },
    { icon: "bi-instagram", url: about?.instaLink    || "#" },
  ];

  const isDark      = theme === "dark";
  const pillBg      = scrolled
    ? (isDark ? "rgba(13,12,20,0.92)" : "rgba(255,255,255,0.88)")
    : (isDark ? "rgba(13,12,20,0.55)" : "rgba(255,255,255,0.55)");
  const pillBorder  = isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.07)";
  const textColor   = isDark ? "#ece9ff" : "#0f0e0c";
  const mutedColor  = isDark ? "rgba(148,144,184,0.85)" : "rgba(107,104,96,0.9)";
  const accentColor = isDark ? "#7c5ce9" : "#4f35d2";
  const accentRgb   = isDark ? "124,92,233" : "79,53,210";
  const btnBg       = isDark ? "rgba(124,92,233,0.12)" : "rgba(79,53,210,0.08)";

  return (
    <>
      <style>{GLOBAL_STYLES}</style>

      <header id="header" style={{
        position: "fixed", top: 0, left: 0, right: 0,
        zIndex: 1040, padding: "14px 20px 0", pointerEvents: "none",
      }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", pointerEvents: "auto" }}>

          <div
            className={`nb-pill ${scrolled ? (isDark ? "scrolled-dark" : "scrolled-light") : ""}`}
            style={{
              background: pillBg, border: pillBorder,
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
            }}
          >
            {/* Brand */}
            <a href="/" className="nb-brand" style={{ color: textColor }}
              onClick={(e) => { e.preventDefault(); router.push("/"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
              <span style={{ color: accentColor }}>✦</span> Portfolio
            </a>

            {/* Desktop nav */}
            <nav className="nb-desktop-links"
              style={{ display: "flex", alignItems: "center", flex: 1, overflow: "hidden" }}>
              {navItems.map((item, i) => (
                <a key={i}
                  href={item === "Home" ? "/" : `/#${item.toLowerCase()}`}
                  className="nb-link" style={{ color: mutedColor }}
                  onClick={(e) => handleNavClick(e, item)}>
                  {item}
                </a>
              ))}
            </nav>

            {/* Desktop right */}
            <div className="nb-desktop-right"
              style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto", flexShrink: 0 }}>
              <span style={{ width: 1, height: 20, background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)", margin: "0 6px" }} />
              {socials.map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noreferrer"
                  className="nb-social-a" style={{ color: textColor }}>
                  <i className={`bi ${s.icon}`} />
                </a>
              ))}
              <span style={{ width: 1, height: 20, background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)", margin: "0 4px" }} />
              <button className="nb-icon-btn" onClick={toggleTheme} aria-label="Toggle theme"
                style={{ background: btnBg, color: accentColor }}>
                <i className={`bi bi-${isDark ? "sun" : "moon-stars"}`} />
              </button>
            </div>

            {/* Mobile controls */}
            <div className="nb-hamburger"
              style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto" }}>
              <button className="nb-icon-btn" onClick={toggleTheme} aria-label="Toggle theme"
                style={{ background: btnBg, color: accentColor }}>
                <i className={`bi bi-${isDark ? "sun" : "moon-stars"}`} />
              </button>
              <button className="nb-icon-btn"
                onClick={() => setMenuOpen(p => !p)} aria-label="Toggle menu"
                style={{ background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)", color: textColor }}>
                <i className={`bi bi-${menuOpen ? "x-lg" : "list"}`} />
              </button>
            </div>
          </div>

          {/* Mobile dropdown */}
          {menuOpen && (
            <div className="nb-mobile-menu" style={{
              marginTop: 8,
              background: isDark ? "rgba(13,12,20,0.97)" : "rgba(255,255,255,0.97)",
              border: pillBorder,
              backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
              boxShadow: isDark ? "0 16px 48px rgba(0,0,0,0.5)" : "0 16px 48px rgba(0,0,0,0.12)",
              padding: "12px",
            }}>
              <div className="nb-mobile-menu-links" style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {navItems.map((item, i) => (
                  <a key={i}
                    href={item === "Home" ? "/" : `/#${item.toLowerCase()}`}
                    onClick={(e) => handleNavClick(e, item)}
                    style={{
                      fontFamily: "var(--nb-font-nav)", fontSize: 13, fontWeight: 500,
                      color: mutedColor, padding: "7px 14px", borderRadius: 30,
                      border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
                      textDecoration: "none", transition: "background 0.15s, color 0.15s",
                    }}>
                    {item}
                  </a>
                ))}
              </div>
              <div className="nb-mobile-socials" style={{
                display: "flex", gap: 14, marginTop: 12, paddingTop: 12,
                borderTop: isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.06)",
              }}>
                {socials.map((s, i) => (
                  <a key={i} href={s.url} target="_blank" rel="noreferrer"
                    style={{ color: mutedColor, fontSize: 18, textDecoration: "none", opacity: 0.7 }}>
                    <i className={`bi ${s.icon}`} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Floating robot button */}
      <button className="chat-float-btn"
        onClick={() => setShowChat(p => !p)}
        aria-label={showChat ? "Close chat" : "Open assistant"}
        style={{
          background: isDark
            ? "linear-gradient(135deg, #1a1828 0%, #13121e 100%)"
            : "linear-gradient(135deg, #f0edff 0%, #e4deff 100%)",
          boxShadow: showChat
            ? `0 8px 28px rgba(${accentRgb},0.25)`
            : `0 8px 28px rgba(${accentRgb},0.35), 0 2px 8px rgba(0,0,0,0.15)`,
          border: isDark
            ? `1px solid rgba(${accentRgb},0.25)`
            : `1px solid rgba(${accentRgb},0.2)`,
        }}>
        <span className="pulse-ring" />
        {showChat
          ? <i className="bi bi-x-lg" style={{ position: "relative", zIndex: 1, fontSize: 18, color: accentColor }} />
          : <RobotIcon size={28} color={accentColor}
              eyeColor={isDark ? "#fff" : accentColor}
              glowColor={`rgba(${accentRgb},0.8)`} />
        }
      </button>

      {showChat && (
        <ChatModal
          setShowChat={setShowChat}
          isDark={isDark}
          accentColor={accentColor}
          accentRgb={accentRgb}
          about={about}
        />
      )}
    </>
  );
}

/* ─────────────────────────────────────────
   CHAT MODAL
───────────────────────────────────────── */
const ChatModal = ({ setShowChat, isDark, accentColor, accentRgb, about }) => {
  const modalBg      = isDark ? "#0d0c14"                 : "#ffffff";
  const modalBorder  = isDark ? "rgba(255,255,255,0.07)"  : "rgba(79,53,210,0.12)";
  const headerBg     = isDark
    ? "linear-gradient(135deg, #13121e 0%, #1a1828 100%)"
    : "linear-gradient(135deg, #f0edff 0%, #e8e2ff 100%)";
  const headerBorder = isDark ? "rgba(255,255,255,0.06)"  : "rgba(79,53,210,0.1)";

  const botName = about?.name ? `${about.name}'s Assistant` : "Portfolio Assistant";

  return (
    <>
      <style>{`
        @keyframes chatSlideUp {
          from { opacity:0; transform: translateY(16px) scale(0.96); }
          to   { opacity:1; transform: translateY(0) scale(1); }
        }
        @keyframes dotPulse {
          0%,60%,100% { transform: scale(0.75); opacity: 0.4; }
          30%          { transform: scale(1);    opacity: 1;   }
        }
        .chat-dot-anim {
          display:inline-block; width:5px; height:5px; border-radius:50%;
          background:${accentColor}; margin:0 2px;
          animation: dotPulse 1.4s ease-in-out infinite;
        }
        .chat-dot-anim:nth-child(2) { animation-delay:0.2s; }
        .chat-dot-anim:nth-child(3) { animation-delay:0.4s; }

        .qchip {
          font-family: 'DM Mono', monospace;
          font-size: 11px; letter-spacing: 0.03em;
          padding: 5px 12px; border-radius: 20px;
          border: 1px solid rgba(${accentRgb},0.25);
          background: rgba(${accentRgb},0.08);
          color: ${accentColor};
          cursor: pointer; white-space: nowrap; flex-shrink: 0;
          transition: all 0.18s ease;
        }
        .qchip:hover {
          background: rgba(${accentRgb},0.18);
          border-color: rgba(${accentRgb},0.5);
          transform: translateY(-1px);
        }
        .chat-send-btn {
          width: 40px; height: 40px; border-radius: 50%; border: none; cursor: pointer;
          background: linear-gradient(135deg, ${accentColor}, ${isDark ? "#a78bfa" : "#7c5ce9"});
          color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; flex-shrink: 0;
          transition: transform 0.18s, box-shadow 0.18s;
          box-shadow: 0 4px 14px rgba(${accentRgb},0.35);
        }
        .chat-send-btn:hover { transform: scale(1.08); box-shadow: 0 6px 20px rgba(${accentRgb},0.5); }

        .chat-input-field {
          flex: 1;
          background: ${isDark ? "rgba(255,255,255,0.05)" : "rgba(79,53,210,0.04)"};
          border: 1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(79,53,210,0.12)"};
          border-radius: 24px; padding: 10px 16px;
          font-family: 'DM Sans', sans-serif; font-size: 13.5px;
          color: ${isDark ? "#ece9ff" : "#0f0e0c"};
          outline: none; transition: border-color 0.2s;
        }
        .chat-input-field::placeholder {
          color: ${isDark ? "rgba(255,255,255,0.25)" : "rgba(15,14,12,0.35)"};
        }
        .chat-input-field:focus {
          border-color: rgba(${accentRgb},0.45);
          box-shadow: 0 0 0 3px rgba(${accentRgb},0.1);
        }
        .chat-close-btn:hover {
          background: ${isDark ? "rgba(255,255,255,0.13)" : "rgba(79,53,210,0.1)"} !important;
          color: ${accentColor} !important;
        }
      `}</style>

      <div style={{
        position: "fixed", bottom: 96, right: 24,
        width: 380, maxWidth: "calc(100vw - 32px)",
        zIndex: 1049, fontFamily: "'DM Sans', sans-serif",
        animation: "chatSlideUp 0.3s cubic-bezier(0.34,1.4,0.64,1) forwards",
      }}>
        <div style={{
          borderRadius: 22, overflow: "hidden",
          background: modalBg, border: `1px solid ${modalBorder}`,
          boxShadow: isDark
            ? `0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(${accentRgb},0.06) inset`
            : `0 24px 60px rgba(${accentRgb},0.12), 0 2px 8px rgba(0,0,0,0.06)`,
        }}>

          {/* Header */}
          <div style={{
            padding: "16px 18px", background: headerBg,
            borderBottom: `1px solid ${headerBorder}`,
            display: "flex", alignItems: "center", gap: 12,
          }}>
            {/* Avatar: use about.pic if available, else robot icon */}
            <div style={{
              width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
              background: isDark
                ? `linear-gradient(135deg, rgba(${accentRgb},0.25), rgba(${accentRgb},0.1))`
                : `linear-gradient(135deg, rgba(${accentRgb},0.15), rgba(${accentRgb},0.05))`,
              border: `1.5px solid rgba(${accentRgb},0.3)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden",
            }}>
              {about?.pic
                ? <Image src={about.pic} alt={about.name} width={44} height={44}
                    style={{ objectFit: "cover", borderRadius: "50%" }} />
                : <RobotIcon size={26} color={accentColor}
                    eyeColor={isDark ? "#fff" : accentColor}
                    glowColor={`rgba(${accentRgb},0.7)`} />
              }
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14,
                color: isDark ? "#ece9ff" : "#0f0e0c", letterSpacing: "-0.2px",
              }}>
                {botName}
              </div>
              <div style={{
                fontSize: 11,
                color: isDark ? "rgba(148,144,184,0.7)" : "rgba(107,104,96,0.8)",
                display: "flex", alignItems: "center", gap: 5, marginTop: 2,
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: "50%", background: "#22c55e",
                  display: "inline-block", boxShadow: "0 0 6px #22c55e",
                }} />
                Online · Ask me anything
              </div>
            </div>

            <button className="chat-close-btn" onClick={() => setShowChat(false)} style={{
              width: 30, height: 30, borderRadius: "50%", border: "none",
              background: isDark ? "rgba(255,255,255,0.07)" : "rgba(79,53,210,0.07)",
              color: isDark ? "rgba(236,233,255,0.6)" : "rgba(15,14,12,0.5)",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, transition: "background 0.2s, color 0.2s",
            }}>
              <i className="bi bi-x-lg" />
            </button>
          </div>

          <ChatbotUI
            isDark={isDark}
            accentColor={accentColor}
            accentRgb={accentRgb}
            about={about}
          />
        </div>
      </div>
    </>
  );
};

/* ─────────────────────────────────────────
   CHATBOT UI  — powered by About data
───────────────────────────────────────── */
const ChatbotUI = ({ isDark, accentColor, accentRgb, about }) => {

  const chatBg        = isDark ? "#0d0c14"                   : "#ffffff";
  const msgBotBg      = isDark ? "rgba(255,255,255,0.05)"    : `rgba(${accentRgb},0.05)`;
  const msgBotBorder  = isDark ? "rgba(255,255,255,0.07)"    : `rgba(${accentRgb},0.12)`;
  const msgBotColor   = isDark ? "rgba(236,233,255,0.9)"     : "#0f0e0c";
  const msgUserBg     = `linear-gradient(135deg, ${accentColor}, ${isDark ? "#a78bfa" : "#7c5ce9"})`;
  const chipBarBg     = isDark ? "rgba(255,255,255,0.02)"    : `rgba(${accentRgb},0.03)`;
  const chipBarBorder = isDark ? "rgba(255,255,255,0.05)"    : `rgba(${accentRgb},0.08)`;
  const inputBarBg    = isDark ? "rgba(255,255,255,0.02)"    : `rgba(${accentRgb},0.03)`;

  const [messages, setMessages] = useState([{
    sender: "bot",
    text: about
      ? `👋 Hi! I'm ${about.name}'s assistant. Ask me about skills, projects, experience, services, or contact info.`
      : "👋 Hi! Ask me about skills, projects, experience, services, certificates, or contact info.",
  }]);
  const [input, setInput]     = useState("");
  const [typing, setTyping]   = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const botReply = (q) => {
    if (!about) return "⏳ Profile data is loading, please try again in a moment.";
    const nq = q.toLowerCase().trim();

    if (nq.includes("about") || nq.includes("who") || nq.includes("profile")) {
      return [
        `👤 ${about.name}`,
        about.heading          ? `💼 ${about.heading}`           : "",
        about.subtitle         ? `✨ ${about.subtitle}`           : "",
        about.shortDescription ? `\n${about.shortDescription}`   : "",
      ].filter(Boolean).join("\n");
    }

    if (nq.includes("contact") || nq.includes("email") || nq.includes("phone") || nq.includes("reach")) {
      const lines = ["📬 Contact Info"];
      if (about.email)       lines.push(`📧 Email: ${about.email}`);
      if (about.phone)       lines.push(`📞 Phone: ${about.phone}`);
      if (about.gitLink)     lines.push(`🐙 GitHub: ${about.gitLink}`);
      if (about.linkidinLink) lines.push(`💼 LinkedIn: ${about.linkidinLink}`);
      if (about.instaLink)   lines.push(`📸 Instagram: ${about.instaLink}`);
      return lines.join("\n");
    }

    if (nq.includes("github") || nq.includes("git")) {
      return about.gitLink ? `🐙 GitHub: ${about.gitLink}` : "GitHub link not set.";
    }
    if (nq.includes("linkedin")) {
      return about.linkidinLink ? `💼 LinkedIn: ${about.linkidinLink}` : "LinkedIn link not set.";
    }
    if (nq.includes("instagram") || nq.includes("insta")) {
      return about.instaLink ? `📸 Instagram: ${about.instaLink}` : "Instagram link not set.";
    }

    if (nq.includes("bio") || nq.includes("description") || nq.includes("more about") || nq.includes("detail")) {
      return about.longDescription
        ? `📝 Bio\n\n${about.longDescription}`
        : about.shortDescription || "No detailed bio available.";
    }

    if (nq.includes("experience") || nq.includes("year") || nq.includes("stats") || nq.includes("achievement")) {
      const lines = ["📊 Stats & Experience"];
      if (about.yearExperience)       lines.push(`⏳ ${about.yearExperience} year(s) of experience`);
      if (about.projectsCompleted)    lines.push(`✅ ${about.projectsCompleted} projects completed`);
      if (about.programmingQuestions) lines.push(`💻 ${about.programmingQuestions} coding problems solved`);
      if (about.occupation)           lines.push(`🧑‍💻 Occupation: ${about.occupation}`);
      if (about.nationality)          lines.push(`🌍 Nationality: ${about.nationality}`);
      if (about.age)                  lines.push(`🎂 Age: ${about.age}`);
      return lines.length > 1 ? lines.join("\n") : "No stats available yet.";
    }

    if (nq.includes("resume") || nq.includes("cv") || nq.includes("download")) {
      return about.resume
        ? `📄 You can download the resume here:\n${about.resume}`
        : "Resume is not available yet.";
    }

    if (nq.includes("occupation") || nq.includes("job") || nq.includes("role") || nq.includes("work")) {
      return about.occupation
        ? `🧑‍💻 ${about.name} works as: ${about.occupation}`
        : `🧑‍💻 ${about.heading || "Role not specified."}`;
    }

    if (nq.includes("age"))         return about.age ? `🎂 Age: ${about.age}` : "Age not listed.";
    if (nq.includes("nationality") || nq.includes("country") || nq.includes("from"))
      return about.nationality ? `🌍 Nationality: ${about.nationality}` : "Nationality not listed.";

    return `🤖 You can ask me about:\nabout · contact · bio · experience · resume · github · linkedin · instagram · occupation · age`;
  };

  const sendMessage = (msg = null) => {
    const final = (msg || input).trim();
    if (!final) return;
    setMessages(prev => [...prev, { sender: "user", text: final }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: "bot", text: botReply(final) }]);
      setTyping(false);
    }, 700);
  };

  const quickActions = ["About", "Contact", "Bio", "Experience", "Resume", "GitHub", "LinkedIn"];

  const BotAvatar = () => (
    <div style={{
      width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
      background: isDark ? `rgba(${accentRgb},0.18)` : `rgba(${accentRgb},0.1)`,
      border: `1px solid rgba(${accentRgb},0.25)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden",
    }}>
      {about?.pic
        ? <Image src={about.pic} alt="bot" width={28} height={28}
            style={{ objectFit: "cover", borderRadius: "50%" }} />
        : <RobotIcon size={17} color={accentColor}
            eyeColor={isDark ? "#fff" : accentColor}
            glowColor={`rgba(${accentRgb},0.6)`} />
      }
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: 460, background: chatBg }}>

      {/* Messages */}
      <div className="no-scroll" style={{
        flex: 1, overflowY: "auto", padding: "16px 14px",
        display: "flex", flexDirection: "column", gap: 12,
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
            alignItems: "flex-end", gap: 8,
          }}>
            {msg.sender === "bot" && <BotAvatar />}
            <div style={{
              maxWidth: "74%", padding: "10px 14px",
              borderRadius: msg.sender === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              background: msg.sender === "user" ? msgUserBg : msgBotBg,
              color: msg.sender === "user" ? "#fff" : msgBotColor,
              fontSize: "13.5px", lineHeight: 1.6,
              fontWeight: msg.sender === "user" ? 600 : 400,
              whiteSpace: "pre-line",
              border: msg.sender === "bot" ? `1px solid ${msgBotBorder}` : "none",
              boxShadow: msg.sender === "user"
                ? `0 4px 14px rgba(${accentRgb},0.3)`
                : `0 2px 8px rgba(0,0,0,0.06)`,
            }}>
              {msg.text}
            </div>
          </div>
        ))}

        {typing && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
            <BotAvatar />
            <div style={{
              padding: "12px 16px", borderRadius: "18px 18px 18px 4px",
              background: msgBotBg, border: `1px solid ${msgBotBorder}`,
              display: "flex", alignItems: "center",
            }}>
              <span className="chat-dot-anim" />
              <span className="chat-dot-anim" />
              <span className="chat-dot-anim" />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick chips */}
      <div className="no-scroll" style={{
        display: "flex", gap: 6, padding: "10px 14px",
        overflowX: "auto", background: chipBarBg,
        borderTop: `1px solid ${chipBarBorder}`,
      }}>
        {quickActions.map((label, i) => (
          <button key={i} className="qchip" onClick={() => sendMessage(label.toLowerCase())}>
            {label}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div style={{
        padding: "10px 14px 14px", background: inputBarBg,
        borderTop: `1px solid ${chipBarBorder}`,
        display: "flex", gap: 8, alignItems: "center",
      }}>
        <input
          type="text" className="chat-input-field"
          placeholder="Ask me anything…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <button className="chat-send-btn" onClick={() => sendMessage()} aria-label="Send">
          <i className="bi bi-arrow-up" />
        </button>
      </div>
    </div>
  );
};