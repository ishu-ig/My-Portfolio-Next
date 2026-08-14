import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
    PieChart, Pie, Cell, Legend,
} from "recharts";

import { getEducation }   from "../Redux/ActionCreators/EducationActionCreators";
import { getExperience }  from "../Redux/ActionCreators/ExperienceActionCreators";
import { getService }     from "../Redux/ActionCreators/ServiceActionCreators";
import { getSkill }       from "../Redux/ActionCreators/SkillActionCreators";
import { getCertificate } from "../Redux/ActionCreators/CertificateActionCreators";
import { getPortfolio }   from "../Redux/ActionCreators/PortfolioActionCreators";
import { getContactUs }   from "../Redux/ActionCreators/ContactUsActionCreators";
import { getTestimonial } from "../Redux/ActionCreators/TestimonialActionCreators";
import { getBlog }        from "../Redux/ActionCreators/BlogActionCreators";
import { getResume }      from "../Redux/ActionCreators/ResumeActionCreators";
import { getNewsletter }  from "../Redux/ActionCreators/NewsletterActionCreators";
import { getComment }     from "../Redux/ActionCreators/CommentActionCreators";

// ── Sample fallback ────────────────────────────────────────────────────────────
const SAMPLE = {
    skills:       [
        { name: "React",      level: 90, category: "Frontend" },
        { name: "Node.js",    level: 80, category: "Backend"  },
        { name: "MongoDB",    level: 75, category: "Database" },
        { name: "TypeScript", level: 85, category: "Frontend" },
        { name: "Docker",     level: 65, category: "DevOps"   },
        { name: "AWS",        level: 60, category: "DevOps"   },
    ],
    education:    [
        { degreeName: "B.Tech Computer Science", instituteName: "IIT Delhi",   startDate: "2018", endDate: "2022", active: true  },
        { degreeName: "Full-Stack Bootcamp",      instituteName: "Scaler",      startDate: "2022", endDate: "2022", active: true  },
        { degreeName: "M.Tech (ongoing)",         instituteName: "BITS Pilani", startDate: "2023", endDate: "2025", active: false },
    ],
    experience:   [
        { jobTitle: "Junior Developer",    companyName: "TechNova",  startDate: "2022", endDate: "2023", active: true },
        { jobTitle: "React Developer",     companyName: "Freelance", startDate: "2023", endDate: "2023", active: true },
        { jobTitle: "Senior Frontend Dev", companyName: "InnoSoft",  startDate: "2023", endDate: "2025", active: true },
    ],
    services:     [
        { name: "Web Development",    active: true  },
        { name: "UI/UX Design",       active: true  },
        { name: "API Integration",    active: true  },
        { name: "SEO Consulting",     active: false },
        { name: "Mobile Dev",         active: true  },
    ],
    certificates: [
        { name: "AWS Certified",           issuedBY: "Amazon", active: true },
        { name: "React Professional",      issuedBY: "Meta",   active: true },
        { name: "MongoDB Associate",       issuedBY: "MongoDB",active: true },
        { name: "Google Cloud Essentials", issuedBY: "Google", active: true },
    ],
    portfolios:   [
        { name: "E-Commerce Platform", category: "Web App",     active: true  },
        { name: "Portfolio Builder",   category: "SaaS",        active: true  },
        { name: "Chat Application",    category: "Real-time",   active: false },
        { name: "Blog CMS",            category: "Web App",     active: true  },
        { name: "Weather Dashboard",   category: "API",         active: true  },
        { name: "Task Manager",        category: "Productivity",active: false },
    ],
    contacts:     [
        { name: "Rahul Sharma",  email: "rahul@email.com",  active: true  },
        { name: "Priya Mehta",   email: "priya@email.com",  active: true  },
        { name: "Aakash Singh",  email: "aakash@email.com", active: false },
        { name: "Sneha Patel",   email: "sneha@email.com",  active: true  },
        { name: "Vikram Nair",   email: "vikram@email.com", active: false },
    ],
    testimonials: [
        { name: "Rahul Sharma", active: true  },
        { name: "Priya Mehta",  active: true  },
        { name: "Aakash Singh", active: true  },
        { name: "Sneha Patel",  active: false },
        { name: "Vikram Nair",  active: true  },
        { name: "Anjali Rao",   active: false },
    ],
    blogs:        [
        { name: "Getting Started with React 19",   category: "React",   active: true,  views: 1240 },
        { name: "Node.js Best Practices 2025",     category: "Backend", active: true,  views: 870  },
        { name: "CSS Grid vs Flexbox",             category: "CSS",     active: true,  views: 2100 },
        { name: "TypeScript Tips for Beginners",   category: "TS",      active: false, views: 0    },
        { name: "Building REST APIs with Express", category: "Backend", active: true,  views: 640  },
    ],
    resumes:      [
        { label: "General Resume",    version: "v1", active: false },
        { label: "Frontend Focused",  version: "v2", active: false },
        { label: "Full-Stack 2025",   version: "v3", active: true  },
    ],
    newsletters:  Array(28).fill({ _id: "x" }),
    comments:     [
        { author: "Rahul",  active: true  },
        { author: "Priya",  active: true  },
        { author: "Aakash", active: false },
        { author: "Sneha",  active: false },
        { author: "Vikram", active: true  },
        { author: "Anjali", active: false },
    ],
    achievements: [
        { name: "Best Developer Award", active: true },
        { name: "Hackathon Winner",     active: true },
        { name: "100k Views Milestone", active: true },
    ],
};

function unwrap(slice) {
    if (!slice) return [];
    if (Array.isArray(slice)) return slice;
    if (Array.isArray(slice.data)) return slice.data;
    return [];
}

const CHART_COLORS = ["#0d6efd", "#198754", "#0dcaf0", "#ffc107", "#dc3545", "#6f42c1"];

const DashTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: "var(--admin-surface)",
            border: "1px solid var(--admin-border)",
            borderRadius: 10,
            padding: "10px 14px",
            fontSize: 12,
            boxShadow: "var(--admin-shadow-lg)",
            backdropFilter: "blur(10px)",
        }}>
            {label && <p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: 11, color: "var(--admin-text-strong)" }}>{label}</p>}
            {payload.map((p, i) => (
                <p key={i} style={{ margin: "2px 0 0", color: p.fill || p.color, fontWeight: 500 }}>
                    {p.name}: <strong style={{ color: "var(--admin-text-strong)" }}>{p.value}</strong>
                </p>
            ))}
        </div>
    );
};

export default function Home() {
    const dispatch   = useDispatch();
    const [loaded, setLoaded]           = useState(false);
    const [usingSample, setUsingSample] = useState(false);

    const raw = {
        skills:       useSelector(s => s.SkillStateData),
        education:    useSelector(s => s.EducationStateData),
        experience:   useSelector(s => s.ExperienceStateData),
        services:     useSelector(s => s.ServiceStateData),
        certificates: useSelector(s => s.CertificateStateData),
        portfolios:   useSelector(s => s.PortfolioStateData),
        contacts:     useSelector(s => s.ContactUsStateData),
        testimonials: useSelector(s => s.TestimonialStateData),
        blogs:        useSelector(s => s.BlogStateData),
        resumes:      useSelector(s => s.ResumeStateData),
        newsletters:  useSelector(s => s.NewsletterStateData),
        comments:     useSelector(s => s.CommentStateData),
        achievements: useSelector(s => s.AchievementStateData),
    };

    useEffect(() => {
        dispatch(getSkill());
        dispatch(getEducation());
        dispatch(getExperience());
        dispatch(getService());
        dispatch(getCertificate());
        dispatch(getPortfolio());
        dispatch(getContactUs());
        dispatch(getTestimonial());
        dispatch(getBlog());
        dispatch(getResume());
        dispatch(getNewsletter());
        dispatch(getComment());
        const t = setTimeout(() => setLoaded(true), 400);
        return () => clearTimeout(t);
    }, [dispatch]);

    const live = Object.fromEntries(
        Object.entries(raw).map(([k, v]) => [k, unwrap(v)])
    );

    const allEmpty = loaded && Object.values(live).every(a => a.length === 0);

    useEffect(() => {
        if (loaded) setUsingSample(allEmpty);
    }, [allEmpty, loaded]);

    const D = allEmpty ? SAMPLE : live;

    // ── Derived ────────────────────────────────────────────────────────────────
    const publishedBlogs       = D.blogs.filter(b => b.active).length;
    const draftBlogs           = D.blogs.filter(b => !b.active).length;
    const approvedTestimonials = D.testimonials.filter(t => t.active).length;
    const pendingTestimonials  = D.testimonials.filter(t => !t.active).length;
    const unreadContacts       = D.contacts.filter(c => c.active).length;
    const pendingComments      = D.comments.filter(c => !c.active).length;
    const activeResume         = D.resumes.find(r => r.active);
    const totalViews           = D.blogs.reduce((s, b) => s + (b.views || 0), 0);

    // ── Skill category pie ─────────────────────────────────────────────────────
    const skillCatMap = {};
    D.skills.forEach(sk => {
        const c = sk.category || "Other";
        skillCatMap[c] = (skillCatMap[c] || 0) + 1;
    });
    const skillCatData = Object.entries(skillCatMap).map(([name, value]) => ({ name, value }));

    // ── Blog category bar ──────────────────────────────────────────────────────
    const blogCatMap = {};
    D.blogs.forEach(b => {
        const c = b.category || "Other";
        blogCatMap[c] = (blogCatMap[c] || 0) + 1;
    });
    const blogCatData = Object.entries(blogCatMap).map(([name, count]) => ({ name, count }));

    // ── Top blogs by views ─────────────────────────────────────────────────────
    const topBlogs = [...D.blogs]
        .filter(b => (b.views || 0) > 0)
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5);

    // ── Overview content bar ───────────────────────────────────────────────────
    const contentBars = [
        { label: "Skills",       count: D.skills.length,       to: "/skill",       color: "#3b82f6" },
        { label: "Projects",     count: D.portfolios.length,   to: "/portfolio",   color: "#10b981" },
        { label: "Blogs",        count: D.blogs.length,        to: "/blog",        color: "#06b6d4" },
        { label: "Certificates", count: D.certificates.length, to: "/certificate", color: "#f59e0b" },
        { label: "Experience",   count: D.experience.length,   to: "/experience",  color: "#8b5cf6" },
        { label: "Services",     count: D.services.length,     to: "/service",     color: "#14b8a6" },
        { label: "Achievements", count: D.achievements.length, to: "/achievement", color: "#ec4899" },
    ];
    const maxBar = Math.max(...contentBars.map(b => b.count), 1);

    // ── Stat cards ─────────────────────────────────────────────────────────────
    const statCards = [
        { label: "Skills",        value: D.skills.length,       icon: "bi-stars",             variant: "metric-primary", to: "/skill"        },
        { label: "Projects",      value: D.portfolios.length,   icon: "bi-collection",         variant: "metric-success", to: "/portfolio"    },
        { label: "Blog Posts",    value: D.blogs.length,        icon: "bi-file-earmark-text",  variant: "metric-warning", to: "/blog"         },
        { label: "Queries",       value: D.contacts.length,     icon: "bi-headset",            variant: "metric-danger",  to: "/contactUs"    },
    ];

    // ── Alert cards ────────────────────────────────────────────────────────────
    const alertCards = [
        { label: "Unread Messages",     value: unreadContacts,      icon: "bi-envelope",       color: "text-primary" },
        { label: "Pending Comments",    value: pendingComments,     icon: "bi-chat-left-text",  color: "text-warning" },
        { label: "Pending Testimonials",value: pendingTestimonials, icon: "bi-clock-history",  color: "text-danger"  },
        { label: "Draft Blogs",         value: draftBlogs,          icon: "bi-file-earmark",   color: "text-secondary"},
    ];

    // ── Quick actions ──────────────────────────────────────────────────────────
    const quickActions = [
        { label: "Add Skill",       icon: "bi-stars",            to: "/skill/create",        color: "#3b82f6" },
        { label: "Add Project",     icon: "bi-collection",        to: "/portfolio/create",    color: "#10b981" },
        { label: "Write Blog",      icon: "bi-file-earmark-text", to: "/blog/create",         color: "#06b6d4" },
        { label: "Add Certificate", icon: "bi-patch-check",       to: "/certificate/create",  color: "#f59e0b" },
        { label: "Add Experience",  icon: "bi-briefcase",         to: "/experience/create",   color: "#8b5cf6" },
        { label: "Add Service",     icon: "bi-gear",              to: "/service/create",      color: "#14b8a6" },
        { label: "View Messages",   icon: "bi-headset",           to: "/contactUs",           color: "#ef4444" },
        { label: "Testimonials",    icon: "bi-chat-quote",        to: "/testimonial",         color: "#ec4899" },
    ];

    const axisStyle = { fontSize: 11, fill: "var(--admin-muted, #64748b)" };
    const gridStyle = { stroke: "var(--admin-border, rgba(0,0,0,.08))", strokeDasharray: "3 3" };

    return (
        <main className="dashboard-content">
            <div className="container-fluid px-3 px-lg-4 py-4">

                {/* ── Page heading ── */}
                <div className="page-heading mb-4">
                    <div className="page-heading-copy">
                        <span className="page-icon">
                            <i className="bi bi-speedometer2" aria-hidden="true"></i>
                        </span>
                        <div>
                            <p className="eyebrow mb-1">Overview</p>
                            <h1 className="h3 mb-1">Dashboard</h1>
                            <p className="text-muted mb-0">
                                {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Sample banner ── */}
                {usingSample && (
                    <div className="alert alert-warning d-flex align-items-center gap-2 mb-4" role="alert">
                        <i className="bi bi-flask fs-5"></i>
                        <span><strong>Preview mode —</strong> showing sample data. API returned no records yet.</span>
                    </div>
                )}

                {/* ── Overview banner ── */}
                <div className="panel mb-3 text-white" style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #0f172a 100%)", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 10px 30px rgba(29, 78, 216, 0.25)" }}>
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                        <div>
                            <p className="text-white-50 mb-1" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: ".07em", fontWeight: 700 }}>Total Blog Views</p>
                            <p className="text-white mb-0" style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-.02em" }}>{totalViews.toLocaleString("en-IN")}</p>
                        </div>
                        <div className="d-flex align-items-center justify-content-center rounded-3" style={{ width: 54, height: 54, background: "rgba(255,255,255,.15)", fontSize: 22, color: "#fff" }}>
                            <i className="bi bi-graph-up-arrow"></i>
                        </div>
                    </div>
                    <div className="d-flex flex-wrap gap-3 mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,.15)" }}>
                        {[
                            { icon: "bi-pen-fill",      label: `${publishedBlogs} Published`         },
                            { icon: "bi-file-earmark",  label: `${draftBlogs} Drafts`                },
                            { icon: "bi-collection",    label: `${D.portfolios.length} Projects`     },
                            { icon: "bi-envelope-open", label: `${D.newsletters.length} Subscribers` },
                            ...(activeResume ? [{ icon: "bi-file-pdf", label: activeResume.label || activeResume.version }] : []),
                        ].map((s, i) => (
                            <span key={i} className="text-white-50 d-flex align-items-center gap-2" style={{ fontSize: 13 }}>
                                <i className={`bi ${s.icon} text-white`}></i> {s.label}
                            </span>
                        ))}
                    </div>
                </div>

                {/* ── Stat cards ── */}
                <section className="row g-3 mb-3">
                    {statCards.map((c, i) => (
                        <div key={i} className="col-12 col-sm-6 col-xl-3">
                            <Link to={c.to} style={{ textDecoration: "none" }}>
                                <article className={`metric-card ${c.variant}`}>
                                    <div className="metric-top">
                                        <span className="metric-label">{c.label}</span>
                                        <span className="metric-icon">
                                            <i className={`bi ${c.icon}`} aria-hidden="true"></i>
                                        </span>
                                    </div>
                                    <div className="metric-value">{c.value}</div>
                                    <div className="metric-meta">
                                        <span className="text-muted">total records</span>
                                    </div>
                                </article>
                            </Link>
                        </div>
                    ))}
                </section>

                {/* ── Alert cards ── */}
                <div className="row g-3 mb-3">
                    {alertCards.map((c, i) => (
                        <div key={i} className="col-12 col-sm-6 col-xl-3">
                            <div className="panel d-flex align-items-center gap-3 py-3">
                                <span className={`fs-4 ${c.color}`}><i className={`bi ${c.icon}`}></i></span>
                                <div>
                                    <div className="fw-bold fs-5">{c.value}</div>
                                    <div className="text-muted small">{c.label}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Content breakdown + Top blogs ── */}
                <div className="row g-3 mb-3">

                    {/* Content bar chart */}
                    <div className="col-12 col-xl-6">
                        <div className="panel h-100">
                            <div className="panel-header">
                                <div>
                                    <h2 className="h5 mb-1 section-title">
                                        <i className="bi bi-bar-chart" aria-hidden="true"></i>
                                        <span>Content Breakdown</span>
                                    </h2>
                                    <p className="text-muted mb-0">Records per section</p>
                                </div>
                            </div>
                            <div className="d-flex flex-column gap-2 mt-3">
                                {contentBars.map(b => (
                                    <div key={b.label} className="d-flex align-items-center gap-2">
                                        <Link to={b.to} style={{ width: 86, fontSize: 12, color: "var(--bs-secondary-color)", textDecoration: "none", flexShrink: 0 }}>
                                            {b.label}
                                        </Link>
                                        <div className="flex-grow-1" style={{ height: 8, background: "var(--bs-secondary-bg)", borderRadius: 99, overflow: "hidden" }}>
                                            <div style={{ height: "100%", width: `${Math.round((b.count / maxBar) * 100)}%`, background: b.color, borderRadius: 99, transition: "width .5s ease" }} />
                                        </div>
                                        <span style={{ fontSize: 12, fontWeight: 600, minWidth: 20, textAlign: "right" }}>{b.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Top blog views */}
                    <div className="col-12 col-xl-6">
                        <div className="panel h-100">
                            <div className="panel-header">
                                <div>
                                    <h2 className="h5 mb-1 section-title">
                                        <i className="bi bi-eye" aria-hidden="true"></i>
                                        <span>Top Blog Posts by Views</span>
                                    </h2>
                                    <p className="text-muted mb-0">Most read articles</p>
                                </div>
                                <Link to="/blog" className="btn btn-light btn-sm">View all</Link>
                            </div>
                            {topBlogs.length === 0
                                ? <p className="text-muted text-center py-4">No published blogs yet.</p>
                                : <ResponsiveContainer width="100%" height={220}>
                                    <BarChart data={topBlogs} margin={{ top: 10, right: 10, left: 0, bottom: 44 }} barSize={28}>
                                        <CartesianGrid {...gridStyle} />
                                        <XAxis dataKey="name" tick={{ ...axisStyle, fontSize: 9.5 }} axisLine={false} tickLine={false} angle={-20} textAnchor="end" interval={0} />
                                        <YAxis tick={axisStyle} axisLine={false} tickLine={false} allowDecimals={false} />
                                        <Tooltip content={<DashTooltip />} />
                                        <Bar dataKey="views" name="Views" fill="#0d6efd" radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            }
                        </div>
                    </div>
                </div>

                {/* ── Skill levels + Skill categories ── */}
                <div className="row g-3 mb-3">
                    <div className="col-12 col-xl-7">
                        <div className="panel h-100">
                            <div className="panel-header">
                                <div>
                                    <h2 className="h5 mb-1 section-title">
                                        <i className="bi bi-stars" aria-hidden="true"></i>
                                        <span>Skill Levels</span>
                                    </h2>
                                    <p className="text-muted mb-0">Proficiency per skill</p>
                                </div>
                                <Link to="/skill" className="btn btn-light btn-sm">Manage</Link>
                            </div>
                            <div className="mt-3 d-flex flex-column gap-2">
                                {D.skills.slice(0, 8).map((sk, i) => (
                                    <div key={i} className="d-flex align-items-center gap-2">
                                        <span style={{ width: 90, fontSize: 12, color: "var(--bs-secondary-color)", fontWeight: 600, flexShrink: 0 }}>{sk.name}</span>
                                        <div className="flex-grow-1" style={{ height: 7, background: "var(--bs-secondary-bg)", borderRadius: 99, overflow: "hidden" }}>
                                            <div style={{ height: "100%", width: `${sk.level || 0}%`, background: CHART_COLORS[i % CHART_COLORS.length], borderRadius: 99, transition: "width .5s ease" }} />
                                        </div>
                                        <span style={{ fontSize: 11, color: "var(--bs-secondary-color)", minWidth: 32, textAlign: "right" }}>{sk.level || 0}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-xl-5">
                        <div className="panel h-100">
                            <div className="panel-header">
                                <div>
                                    <h2 className="h5 mb-1 section-title">
                                        <i className="bi bi-tags" aria-hidden="true"></i>
                                        <span>Skills by Category</span>
                                    </h2>
                                    <p className="text-muted mb-0">Category distribution</p>
                                </div>
                            </div>
                            {skillCatData.length === 0
                                ? <p className="text-muted text-center py-4">No skills yet.</p>
                                : <ResponsiveContainer width="100%" height={220}>
                                    <PieChart>
                                        <Pie data={skillCatData} dataKey="value" nameKey="name"
                                            cx="50%" cy="50%" innerRadius={50} outerRadius={78}
                                            paddingAngle={3} strokeWidth={0}>
                                            {skillCatData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip content={<DashTooltip />} />
                                        <Legend iconType="circle" iconSize={8}
                                            formatter={v => <span style={{ fontSize: 11, color: "var(--bs-secondary-color)" }}>{v}</span>} />
                                    </PieChart>
                                </ResponsiveContainer>
                            }
                        </div>
                    </div>
                </div>

                {/* ── Blog categories + Testimonials ── */}
                <div className="row g-3 mb-3">
                    <div className="col-12 col-xl-6">
                        <div className="panel h-100">
                            <div className="panel-header">
                                <div>
                                    <h2 className="h5 mb-1 section-title">
                                        <i className="bi bi-tag" aria-hidden="true"></i>
                                        <span>Blog Categories</span>
                                    </h2>
                                    <p className="text-muted mb-0">Posts per category</p>
                                </div>
                            </div>
                            {blogCatData.length === 0
                                ? <p className="text-muted text-center py-4">No blogs yet.</p>
                                : <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={blogCatData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barSize={32}>
                                        <CartesianGrid {...gridStyle} />
                                        <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
                                        <YAxis tick={axisStyle} axisLine={false} tickLine={false} allowDecimals={false} />
                                        <Tooltip content={<DashTooltip />} />
                                        <Bar dataKey="count" name="Posts" fill="#6f42c1" radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            }
                        </div>
                    </div>

                    <div className="col-12 col-xl-6">
                        <div className="panel h-100">
                            <div className="panel-header">
                                <div>
                                    <h2 className="h5 mb-1 section-title">
                                        <i className="bi bi-chat-quote" aria-hidden="true"></i>
                                        <span>Testimonial Status</span>
                                    </h2>
                                    <p className="text-muted mb-0">Approved vs pending</p>
                                </div>
                                <Link to="/testimonial" className="btn btn-light btn-sm">View all</Link>
                            </div>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie data={[
                                        { name: "Approved", value: approvedTestimonials,  fill: "#198754" },
                                        { name: "Pending",  value: pendingTestimonials,   fill: "#ffc107" },
                                    ].filter(d => d.value > 0)} dataKey="value" nameKey="name"
                                        cx="50%" cy="50%" innerRadius={50} outerRadius={78}
                                        paddingAngle={3} strokeWidth={0}>
                                        {[{ fill: "#198754" }, { fill: "#ffc107" }].map((e, i) => <Cell key={i} fill={e.fill} />)}
                                    </Pie>
                                    <Tooltip content={<DashTooltip />} />
                                    <Legend iconType="circle" iconSize={8}
                                        formatter={v => <span style={{ fontSize: 11, color: "var(--bs-secondary-color)" }}>{v}</span>} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* ── Education + Experience ── */}
                <div className="row g-3 mb-3">
                    <div className="col-12 col-xl-6">
                        <div className="panel">
                            <div className="panel-header">
                                <div>
                                    <h2 className="h5 mb-1 section-title">
                                        <i className="bi bi-mortarboard" aria-hidden="true"></i>
                                        <span>Education</span>
                                    </h2>
                                </div>
                                <Link to="/education" className="btn btn-light btn-sm">Manage</Link>
                            </div>
                            <div className="table-responsive mt-2">
                                <table className="table align-middle mb-0" style={{ fontSize: 13 }}>
                                    <thead>
                                        <tr>
                                            <th>Degree</th>
                                            <th>Institution</th>
                                            <th>Period</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {D.education.map((e, i) => (
                                            <tr key={i}>
                                                <td className="fw-semibold">{e.degreeName || "—"}</td>
                                                <td className="text-muted">{e.instituteName || "—"}</td>
                                                <td className="text-muted">{e.startDate} – {e.endDate}</td>
                                                <td>
                                                    <span className={`badge ${e.active ? "text-bg-success" : "text-bg-secondary"}`}>
                                                        {e.active ? "Active" : "Completed"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-xl-6">
                        <div className="panel">
                            <div className="panel-header">
                                <div>
                                    <h2 className="h5 mb-1 section-title">
                                        <i className="bi bi-briefcase" aria-hidden="true"></i>
                                        <span>Experience</span>
                                    </h2>
                                </div>
                                <Link to="/experience" className="btn btn-light btn-sm">Manage</Link>
                            </div>
                            <div className="table-responsive mt-2">
                                <table className="table align-middle mb-0" style={{ fontSize: 13 }}>
                                    <thead>
                                        <tr>
                                            <th>Role</th>
                                            <th>Company</th>
                                            <th>Period</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {D.experience.map((e, i) => (
                                            <tr key={i}>
                                                <td className="fw-semibold">{e.jobTitle || "—"}</td>
                                                <td className="text-muted">{e.companyName || "—"}</td>
                                                <td className="text-muted">{e.startDate} – {e.endDate}</td>
                                                <td>
                                                    <span className={`badge ${e.active ? "text-bg-primary" : "text-bg-secondary"}`}>
                                                        {e.active ? "Active" : "Past"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Recent contacts + Quick actions ── */}
                <div className="row g-3 mb-3">
                    <div className="col-12 col-xl-7">
                        <div className="panel">
                            <div className="panel-header">
                                <div>
                                    <h2 className="h5 mb-1 section-title">
                                        <i className="bi bi-headset" aria-hidden="true"></i>
                                        <span>Recent Messages</span>
                                    </h2>
                                    <p className="text-muted mb-0">Latest contact queries</p>
                                </div>
                                <Link to="/contactUs" className="btn btn-light btn-sm">View all</Link>
                            </div>
                            <div className="table-responsive mt-2">
                                <table className="table align-middle mb-0" style={{ fontSize: 13 }}>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {D.contacts.slice(0, 5).map((c, i) => (
                                            <tr key={i}>
                                                <td className="fw-semibold">{c.name || "—"}</td>
                                                <td className="text-muted">{c.email || "—"}</td>
                                                <td>
                                                    <span className={`badge ${c.active ? "text-bg-warning" : "text-bg-success"}`}>
                                                        {c.active ? "Unread" : "Read"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-xl-5">
                        <div className="panel h-100">
                            <div className="panel-header">
                                <div>
                                    <h2 className="h5 mb-1 section-title">
                                        <i className="bi bi-lightning" aria-hidden="true"></i>
                                        <span>Quick Actions</span>
                                    </h2>
                                </div>
                            </div>

                            {/* Active resume badge */}
                            {activeResume && (
                                <div className="d-flex align-items-center gap-2 p-2 rounded-2 mb-3"
                                    style={{ background: "rgba(25,135,84,.1)", border: "1px solid rgba(25,135,84,.2)" }}>
                                    <i className="bi bi-file-earmark-pdf text-success fs-5"></i>
                                    <div className="flex-grow-1">
                                        <div className="fw-semibold" style={{ fontSize: 13 }}>{activeResume.label || "Active Resume"}</div>
                                        <div className="text-success" style={{ fontSize: 11 }}>{activeResume.version}</div>
                                    </div>
                                    <Link to="/resume" className="btn btn-sm btn-outline-success">Change</Link>
                                </div>
                            )}

                            <div className="row g-2">
                                {quickActions.map((q, i) => (
                                    <div key={i} className="col-6">
                                        <Link to={q.to} className="d-flex align-items-center gap-2 p-2 rounded-2 text-decoration-none"
                                            style={{
                                                background: "var(--bs-secondary-bg)",
                                                border: `1px solid var(--bs-border-color)`,
                                                borderLeft: `3px solid ${q.color}`,
                                                fontSize: 12, fontWeight: 600,
                                                color: "var(--bs-secondary-color)",
                                                transition: "background .2s",
                                            }}>
                                            <i className={`bi ${q.icon}`} style={{ color: q.color, fontSize: 14 }}></i>
                                            {q.label}
                                        </Link>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--bs-border-color)" }}>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="text-muted small d-flex align-items-center gap-2">
                                        <i className="bi bi-envelope-paper text-primary"></i> Newsletter Subscribers
                                    </span>
                                    <Link to="/newsletter" className="fw-bold small text-primary text-decoration-none">{D.newsletters.length}</Link>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="text-muted small d-flex align-items-center gap-2">
                                        <i className="bi bi-chat-left-text text-warning"></i> Pending Comments
                                    </span>
                                    <Link to="/comment" className="fw-bold small text-warning text-decoration-none">{pendingComments} to review</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}