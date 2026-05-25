"use client";
import React, { useState, useEffect, useRef, useContext } from "react";
import { ThemeContext } from "../ThemeContext";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { getResume } from "../Redux/ActionCreartors/ResumeActionCreators";

/* ===========================
   NAVBAR
=========================== */
export default function Navbar() {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [showChat, setShowChat] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const dispatch = useDispatch();
    const resume = useSelector(state => state.ResumeStateData);

    useEffect(() => { dispatch(getResume()); }, []);

    const navLinks = ["Home","About","Skills","Resume","Certificate","Portfolio","Testimonials","Services","Blog","Contact"];

    return (
        <>
            <header
                id="header"
                style={{
                    position: "sticky", top: 16, zIndex: 1000,
                    padding: "0 16px", marginBottom: 8,
                }}
            >
                {/* Pill navbar */}
                <nav style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    gap: 12,
                    background: "var(--card-bg)",
                    border: "1px solid var(--border-color)",
                    borderRadius: 999,
                    padding: "10px 20px",
                    maxWidth: 1100, margin: "0 auto",
                    backdropFilter: "blur(12px)",
                    boxShadow: "0 4px 24px var(--shadow-color)",
                }}>
                    {/* Brand */}
                    <Link href="/" style={{ fontSize: 15, fontWeight: 600, color: "var(--text-color)", textDecoration: "none", letterSpacing: 0.3 }}>
                        Portfolio
                    </Link>

                    {/* Desktop links */}
                    <div className="d-none d-lg-flex" style={{ alignItems: "center", gap: 2 }}>
                        {navLinks.map((item, i) => (
    <Link
        key={i}
        href={item === "Home" ? "/" : `#${item.toLowerCase()}`}
        style={{
            fontSize: 13,
            color: "var(--muted-color)",
            padding: "5px 10px",
            borderRadius: 999,
            textDecoration: "none",
            transition: "background 0.15s, color 0.15s",
            whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(0,123,255,0.08)";
            e.currentTarget.style.color = "var(--primary-color)";
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--muted-color)";
        }}
    >
        {item}
    </Link>
))}
                    </div>

                    {/* Right side */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        {/* Social icons — desktop only */}
                        <div className="d-none d-lg-flex" style={{ alignItems: "center", gap: 4 }}>
                            {[
                                { icon: "bi-github", url: resume?.contact?.github || "#" },
                                { icon: "bi-linkedin", url: resume?.contact?.linkedin || "#" },
                                { icon: "bi-instagram", url: "https://www.instagram.com/_ishaan_12" },
                            ].map((s, i) => (
                                <a
                                    key={i}
                                    href={s.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        width: 32, height: 32, borderRadius: "50%",
                                        border: "1px solid var(--border-color)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        color: "var(--muted-color)", textDecoration: "none",
                                        fontSize: 15, transition: "background 0.15s, color 0.15s",
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = "var(--card-bg)"; e.currentTarget.style.color = "var(--primary-color)"; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--muted-color)"; }}
                                >
                                    <i className={`bi ${s.icon}`}></i>
                                </a>
                            ))}
                        </div>

                        {/* Theme toggle */}
                        <button
                            onClick={toggleTheme}
                            style={{
                                width: 32, height: 32, borderRadius: "50%",
                                background: "rgba(0,123,255,0.1)",
                                border: "none", cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: "var(--primary-color)", fontSize: 15,
                            }}
                            aria-label="Toggle theme"
                        >
                            <i className={theme === "light" ? "bi bi-moon" : "bi bi-sun"}></i>
                        </button>

                        {/* Mobile hamburger */}
                        <button
                            className="d-lg-none"
                            onClick={() => setMenuOpen(p => !p)}
                            style={{
                                width: 32, height: 32, borderRadius: "50%",
                                border: "1px solid var(--border-color)",
                                background: "transparent", cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: "var(--text-color)", fontSize: 17,
                            }}
                            aria-label="Toggle menu"
                        >
                            <i className={menuOpen ? "bi bi-x" : "bi bi-list"}></i>
                        </button>
                    </div>
                </nav>

                {/* Mobile dropdown */}
                {menuOpen && (
                    <div style={{
                        background: "var(--card-bg)",
                        border: "1px solid var(--border-color)",
                        borderRadius: 16,
                        padding: "12px 16px",
                        marginTop: 8,
                        maxWidth: 1100, marginLeft: "auto", marginRight: "auto",
                        display: "flex", flexWrap: "wrap", gap: 4,
                        boxShadow: "0 8px 24px var(--shadow-color)",
                    }}>
                        {navLinks.map((item, i) => (
                            <a
                                key={i}
                                href={item === "Home" ? "/" : `#${item.toLowerCase()}`}
                                onClick={() => setMenuOpen(false)}
                                style={{
                                    fontSize: 13, color: "var(--muted-color)",
                                    padding: "6px 12px", borderRadius: 999,
                                    textDecoration: "none", transition: "background 0.15s",
                                    border: "1px solid var(--border-color)",
                                }}
                            >
                                {item}
                            </a>
                        ))}
                        {/* Mobile social icons */}
                        <div style={{ width: "100%", display: "flex", gap: 8, paddingTop: 8, borderTop: "1px solid var(--border-color)", marginTop: 4 }}>
                            <a href={resume?.contact?.github || "#"} target="_blank" rel="noopener noreferrer" style={{ color: "var(--muted-color)", fontSize: 18 }}><i className="bi bi-github"></i></a>
                            <a href={resume?.contact?.linkedin || "#"} target="_blank" rel="noopener noreferrer" style={{ color: "var(--muted-color)", fontSize: 18 }}><i className="bi bi-linkedin"></i></a>
                            <a href="https://www.instagram.com/_ishaan_12" target="_blank" rel="noopener noreferrer" style={{ color: "var(--muted-color)", fontSize: 18 }}><i className="bi bi-instagram"></i></a>
                        </div>
                    </div>
                )}
            </header>

            {/* Floating Chat Button */}
            <button
                onClick={() => setShowChat(true)}
                style={{
                    position: "fixed", bottom: 24, right: 24,
                    width: 52, height: 52, borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--primary-color), #9db2ff)",
                    border: "none", cursor: "pointer", zIndex: 1050,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 4px 16px rgba(0,123,255,0.4)",
                }}
                aria-label="Open chat assistant"
            >
                <i className="bi bi-robot" style={{ fontSize: 22, color: "#fff" }}></i>
                {/* Online pulse dot */}
                <span style={{
                    position: "absolute", top: -1, right: -1,
                    width: 12, height: 12, borderRadius: "50%",
                    background: "#22c55e",
                    border: "2px solid var(--bg-color)",
                }} />
            </button>

            {showChat && <ChatModal setShowChat={setShowChat} />}
        </>
    );
}

/* ===========================
   CHAT MODAL
=========================== */
const ChatModal = ({ setShowChat }) => (
    <div style={{
        position: "fixed", bottom: 88, right: 24,
        width: 340, zIndex: 1100,
        background: "var(--card-bg)",
        border: "1px solid var(--border-color)",
        borderRadius: 20,
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
    }}>
        {/* Header */}
        <div style={{
            padding: "14px 16px",
            background: "linear-gradient(135deg, var(--primary-color), #9db2ff)",
            display: "flex", alignItems: "center", gap: 10,
        }}>
            <div style={{
                width: 38, height: 38, borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
            }}>
                <i className="bi bi-robot" style={{ fontSize: 18, color: "#fff" }}></i>
            </div>
            <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#fff", margin: 0 }}>Helping Assistant</p>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#86efac" }} />
                    Online — Ask me anything
                </div>
            </div>
            <button
                onClick={() => setShowChat(false)}
                style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: "rgba(255,255,255,0.2)", border: "none",
                    color: "#fff", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
                }}
                aria-label="Close chat"
            >
                <i className="bi bi-x"></i>
            </button>
        </div>

        <ChatbotUI />
    </div>
);

/* ===========================
   CHATBOT UI
=========================== */
const ChatbotUI = () => {
    const dispatch = useDispatch();
    const resume = useSelector(state => state.ResumeStateData);

    const [messages, setMessages] = useState([{
        sender: "bot",
        text: "👋 Hello! Ask anything about Ishaan — skills, projects, experience, services, certificates, or contact!",
    }]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const [activeItem, setActiveItem] = useState(null);
    const chatEndRef = useRef(null);

    useEffect(() => { dispatch(getResume()); }, []);
    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

    const getFullAbout = () => {
        const a = resume?.about;
        return `👤 *About Ishaan*\n${a?.summary}\n\n⭐ *Skills:*\n${a?.skills?.map(s => "• " + s).join("\n")}\n\n🎓 *Education:*\n${a?.education?.map(e => "• " + e).join("\n")}\n\n💼 *Experience:*\n${a?.experience?.map(e => "• " + e).join("\n")}\n\n💡 *Projects:*\n${a?.projects?.map(p => "• " + p).join("\n")}\n\n📜 *Certificates:*\n${a?.certificates?.map(c => "• " + c).join("\n")}\n\n🛠 *Services:*\n${a?.services?.map(s => "• " + s).join("\n")}`;
    };

    const botReply = (q) => {
        if (!resume) return "⏳ Loading...";
        const nq = q.toLowerCase().trim();
        if (nq.includes("about")) return getFullAbout();
        const skill = resume.skills?.find(s => nq.includes(s.name.toLowerCase()));
        if (skill) { setActiveItem({ type: "skill", data: skill }); return `🧠 *${skill.name}*\n${skill.description}\n⭐ Level: ${skill.level}%`; }
        if (activeItem?.type === "skill") {
            if (nq.includes("level")) return `⭐ Level: ${activeItem.data.level}%`;
            if (nq.includes("description")) return activeItem.data.description;
        }
        const project = resume.projects?.find(p => nq.includes(p.name.toLowerCase()));
        if (project) { setActiveItem({ type: "project", data: project }); return `💡 *${project.name}*\n${project.shortDescription}\nAsk: technology, category, live, github`; }
        if (activeItem?.type === "project") {
            const p = activeItem.data;
            if (nq.includes("tech")) return p.tech;
            if (nq.includes("category")) return p.category;
            if (nq.includes("live")) return p.liveUrl;
            if (nq.includes("github")) return p.githubRepo;
        }
        const service = resume.services?.find(s => nq.includes(s.name.toLowerCase()));
        if (service) { setActiveItem({ type: "service", data: service }); return `🛠️ *${service.name}*\n${service.shortDescription}\nAsk: price, duration, technology, details`; }
        if (activeItem?.type === "service") {
            const s = activeItem.data;
            if (nq.includes("price")) return `💰 Price: ₹${s.price}`;
            if (nq.includes("duration")) return `⏳ Duration: ${s.duration} days`;
            if (nq.includes("tech")) return s.technology;
            if (nq.includes("detail")) return s.longDescription.replace(/<\/?[^>]+>/g, "");
        }
        if (nq.includes("skills")) return resume.skills.map(s => `• ${s.name} (${s.level}%)`).join("\n");
        if (nq.includes("projects")) return resume.projects.map(p => `💡 ${p.name} — ${p.shortDescription}`).join("\n\n");
        if (nq.includes("services")) return resume.services.map(s => `🛠️ ${s.name} — ${s.shortDescription}`).join("\n\n");
        if (nq.includes("experience")) return resume.experience.map(e => `💼 ${e.jobTitle} @ ${e.companyName}`).join("\n");
        if (nq.includes("certificates")) return resume.certificates.map(c => `📜 ${c.name} — ${c.issuedBy}`).join("\n");
        if (nq.includes("contact")) return `📧 ${resume?.contact?.email || "N/A"}\n📞 ${resume?.contact?.phone || "N/A"}`;
        return "🤖 I didn't understand. Try asking about: skills, projects, services, experience...";
    };

    const sendMessage = (msg = null) => {
        const final = msg || input;
        if (!final.trim()) return;
        setMessages(prev => [...prev, { sender: "user", text: final }]);
        setInput("");
        setTyping(true);
        setTimeout(() => {
            const reply = botReply(final);
            setMessages(prev => [...prev, { sender: "bot", text: reply }]);
            setTyping(false);
        }, 600);
    };

    const chips = ["About","Skills","Projects","Services","Experience","Certificates","Contact"];

    return (
        <>
            {/* Messages */}
            <div style={{ flex: 1, padding: 14, overflowY: "auto", maxHeight: 280, display: "flex", flexDirection: "column", gap: 10 }}>
                {messages.map((msg, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-end", flexDirection: msg.sender === "user" ? "row-reverse" : "row" }}>
                        {msg.sender === "bot" && (
                            <div style={{
                                width: 26, height: 26, borderRadius: "50%",
                                background: "rgba(0,123,255,0.1)",
                                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                            }}>
                                <i className="bi bi-robot" style={{ fontSize: 13, color: "var(--primary-color)" }}></i>
                            </div>
                        )}
                        <div style={{
                            maxWidth: "78%", padding: "9px 13px",
                            borderRadius: 16,
                            borderBottomLeftRadius: msg.sender === "bot" ? 4 : 16,
                            borderBottomRightRadius: msg.sender === "user" ? 4 : 16,
                            background: msg.sender === "user"
                                ? "linear-gradient(135deg, var(--primary-color), #9db2ff)"
                                : "var(--bg-color)",
                            color: msg.sender === "user" ? "#fff" : "var(--text-color)",
                            fontSize: 13, lineHeight: 1.5, whiteSpace: "pre-line",
                            border: msg.sender === "bot" ? "1px solid var(--border-color)" : "none",
                        }}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {typing && (
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(0,123,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <i className="bi bi-robot" style={{ fontSize: 13, color: "var(--primary-color)" }}></i>
                        </div>
                        <div style={{ padding: "9px 14px", borderRadius: 16, borderBottomLeftRadius: 4, background: "var(--bg-color)", border: "1px solid var(--border-color)", fontSize: 13, color: "var(--muted-color)" }}>
                            Typing…
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Quick-reply chips */}
            <div style={{
                display: "flex", gap: 6, padding: "8px 12px",
                overflowX: "auto", borderTop: "1px solid var(--border-color)",
                background: "var(--card-bg)",
            }}
                className="hide-scrollbar"
            >
                {chips.map((label, i) => (
                    <button
                        key={i}
                        onClick={() => sendMessage(label.toLowerCase())}
                        style={{
                            padding: "5px 12px", borderRadius: 999,
                            border: "1px solid var(--border-color)",
                            background: "var(--bg-color)",
                            fontSize: 12, color: "var(--muted-color)",
                            cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
                            transition: "all 0.15s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,123,255,0.08)"; e.currentTarget.style.color = "var(--primary-color)"; e.currentTarget.style.borderColor = "var(--primary-color)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-color)"; e.currentTarget.style.color = "var(--muted-color)"; e.currentTarget.style.borderColor = "var(--border-color)"; }}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Input bar */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderTop: "1px solid var(--border-color)" }}>
                <input
                    type="text"
                    placeholder="Ask me anything…"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendMessage()}
                    style={{
                        flex: 1, border: "1px solid var(--border-color)",
                        borderRadius: 999, padding: "8px 14px",
                        fontSize: 13, background: "var(--bg-color)",
                        color: "var(--text-color)", outline: "none",
                    }}
                />
                <button
                    onClick={() => sendMessage()}
                    style={{
                        width: 34, height: 34, borderRadius: "50%",
                        background: "linear-gradient(135deg, var(--primary-color), #9db2ff)",
                        border: "none", cursor: "pointer", flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                    aria-label="Send"
                >
                    <i className="bi bi-send-fill" style={{ fontSize: 14, color: "#fff" }}></i>
                </button>
            </div>

            <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
        </>
    );
};