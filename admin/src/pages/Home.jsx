import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
    PieChart, Pie, Cell, Legend,
    AreaChart, Area,
    RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from "recharts";

import { getEducation }    from "../Redux/ActionCreators/EducationActionCreators";
import { getExperience }   from "../Redux/ActionCreators/ExperienceActionCreators";
import { getService }      from "../Redux/ActionCreators/ServiceActionCreators";
import { getSkill }        from "../Redux/ActionCreators/SkillActionCreators";
import { getCertificate }  from "../Redux/ActionCreators/CertificateActionCreators";
import { getPortfolio }    from "../Redux/ActionCreators/PortfolioActionCreators";
import { getContactUs }    from "../Redux/ActionCreators/ContactUsActionCreators";
import { getTestimonial }  from "../Redux/ActionCreators/TestimonialActionCreators";
import { getBlog }         from "../Redux/ActionCreators/BlogActionCreators";
import { getResume }       from "../Redux/ActionCreators/ResumeActionCreators";
import { getNewsletter }   from "../Redux/ActionCreators/NewsletterActionCreators";
import { getComment }      from "../Redux/ActionCreators/CommentActionCreators";

// ── Sample fallback data ───────────────────────────────────────────────────────
const SAMPLE = {
    education: [
        { degree: "B.Tech Computer Science", institution: "IIT Delhi",      year: "2018–2022", status: "Completed" },
        { degree: "Full-Stack Bootcamp",      institution: "Scaler Academy", year: "2022",      status: "Completed" },
        { degree: "M.Tech (ongoing)",         institution: "BITS Pilani",    year: "2023–2025", status: "Ongoing"   },
    ],
    experience: [
        { role: "Junior Developer",   company: "TechNova",    duration: "2022–2023", type: "Full-time"  },
        { role: "React Developer",    company: "Freelance",   duration: "2023",      type: "Freelance"  },
        { role: "Senior Frontend Dev",company: "InnoSoft",    duration: "2023–2025", type: "Full-time"  },
    ],
    services: [
        { title: "Web Development",    active: true  },
        { title: "UI/UX Design",       active: true  },
        { title: "API Integration",    active: true  },
        { title: "SEO Consulting",     active: false },
        { title: "Mobile Development", active: true  },
    ],
    skills: [
        { name: "React",      level: 90, category: "Frontend" },
        { name: "Node.js",    level: 80, category: "Backend"  },
        { name: "MongoDB",    level: 75, category: "Database" },
        { name: "TypeScript", level: 85, category: "Frontend" },
        { name: "Python",     level: 70, category: "Backend"  },
        { name: "AWS",        level: 60, category: "DevOps"   },
        { name: "Docker",     level: 65, category: "DevOps"   },
        { name: "GraphQL",    level: 72, category: "Backend"  },
    ],
    certificates: [
        { title: "AWS Certified Developer",    issuer: "Amazon",    year: "2023" },
        { title: "React Professional",         issuer: "Meta",      year: "2022" },
        { title: "MongoDB Associate",          issuer: "MongoDB",   year: "2023" },
        { title: "Google Cloud Fundamentals",  issuer: "Google",    year: "2024" },
    ],
    portfolios: [
        { title: "E-Commerce Platform",  category: "Web App",    tech: "React, Node", featured: true  },
        { title: "Portfolio Builder",    category: "SaaS",       tech: "Next.js",     featured: true  },
        { title: "Chat Application",     category: "Real-time",  tech: "Socket.io",   featured: false },
        { title: "Blog CMS",             category: "Web App",    tech: "MERN",        featured: true  },
        { title: "Weather Dashboard",    category: "API",        tech: "React",       featured: false },
        { title: "Task Manager",         category: "Productivity",tech: "Vue.js",     featured: false },
    ],
    contacts: [
        { name: "Rahul Sharma",  email: "rahul@email.com",  subject: "Collaboration",  active: true  },
        { name: "Priya Mehta",   email: "priya@email.com",  subject: "Job Offer",      active: true  },
        { name: "Aakash Singh",  email: "aakash@email.com", subject: "Freelance",      active: false },
        { name: "Sneha Patel",   email: "sneha@email.com",  subject: "Project Query",  active: true  },
        { name: "Vikram Nair",   email: "vikram@email.com", subject: "Feedback",       active: false },
    ],
    testimonials: [
        { author: "Rahul Sharma",  role: "CEO, TechNova",   rating: 5, approved: true  },
        { author: "Priya Mehta",   role: "HR, InnoSoft",    rating: 4, approved: true  },
        { author: "Aakash Singh",  role: "Freelance Client",rating: 5, approved: true  },
        { author: "Sneha Patel",   role: "Startup Founder", rating: 4, approved: false },
        { author: "Vikram Nair",   role: "Product Manager", rating: 5, approved: true  },
        { author: "Anjali Rao",    role: "Tech Lead",       rating: 3, approved: false },
    ],
    blogs: [
        { title: "Getting Started with React 19",     category: "React",      published: true,  views: 1240, createdAt: "2025-03-01" },
        { title: "Node.js Best Practices 2025",       category: "Backend",    published: true,  views: 870,  createdAt: "2025-03-15" },
        { title: "CSS Grid vs Flexbox",               category: "CSS",        published: true,  views: 2100, createdAt: "2025-02-10" },
        { title: "TypeScript Tips for Beginners",     category: "TypeScript", published: false, views: 0,    createdAt: "2025-04-01" },
        { title: "Building REST APIs with Express",   category: "Backend",    published: true,  views: 640,  createdAt: "2025-01-20" },
        { title: "MongoDB Aggregation Pipelines",     category: "Database",   published: false, views: 0,    createdAt: "2025-04-10" },
    ],
    resumes: [
        { version: "v1.0", label: "General Resume",   active: false },
        { version: "v2.0", label: "Frontend Focused", active: false },
        { version: "v3.0", label: "Full-Stack 2025",  active: true  },
    ],
    newsletters: Array(28).fill(null).map((_, i) => ({ _id: `nl${i}` })),
    comments: [
        { author: "Rahul",  blog: "Getting Started with React 19",   approved: true  },
        { author: "Priya",  blog: "CSS Grid vs Flexbox",             approved: true  },
        { author: "Aakash", blog: "Node.js Best Practices 2025",     approved: false },
        { author: "Sneha",  blog: "CSS Grid vs Flexbox",             approved: false },
        { author: "Vikram", blog: "Getting Started with React 19",   approved: true  },
        { author: "Anjali", blog: "Building REST APIs with Express",  approved: false },
        { author: "Deepak", blog: "Node.js Best Practices 2025",     approved: true  },
    ],
};

// ── Custom tooltip ─────────────────────────────────────────────────────────────
const DashTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: "#161D2F", border: "1px solid rgba(79,142,247,0.25)",
            borderRadius: "10px", padding: "10px 14px", fontSize: "12.5px", lineHeight: 1.8,
        }}>
            {label && <p style={{ color: "#8896B3", marginBottom: "4px", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>}
            {payload.map((p, i) => (
                <p key={i} style={{ color: p.color || p.fill || "#EEF2FF", margin: 0 }}>
                    {p.name}: <strong style={{ color: "#EEF2FF" }}>{p.value}</strong>
                </p>
            ))}
        </div>
    );
};

// ── Unwrap any Redux slice shape ───────────────────────────────────────────────
function unwrap(slice) {
    if (!slice) return [];
    if (Array.isArray(slice)) return slice;
    if (Array.isArray(slice.data)) return slice.data;
    if (slice.data && Array.isArray(slice.data.data)) return slice.data.data;
    for (const key of ["result", "records", "items", "list"]) {
        if (Array.isArray(slice[key])) return slice[key];
    }
    return [];
}

export default function Home() {
    const dispatch = useDispatch();
    const [loaded, setLoaded]           = useState(false);
    const [usingSample, setUsingSample] = useState(false);

    const raw = {
        education:    useSelector(s => s.EducationStateData),
        experience:   useSelector(s => s.ExperienceStateData),
        services:     useSelector(s => s.ServiceStateData),
        skills:       useSelector(s => s.SkillStateData),
        certificates: useSelector(s => s.CertificateStateData),
        portfolios:   useSelector(s => s.PortfolioStateData),
        contacts:     useSelector(s => s.ContactUsStateData),
        testimonials: useSelector(s => s.TestimonialStateData),
        blogs:        useSelector(s => s.BlogStateData),
        resumes:      useSelector(s => s.ResumeStateData),
        newsletters:  useSelector(s => s.NewsletterStateData),
        comments:     useSelector(s => s.CommentStateData),
    };

    useEffect(() => {
        dispatch(getEducation());
        dispatch(getExperience());
        dispatch(getService());
        dispatch(getSkill());
        dispatch(getCertificate());
        dispatch(getPortfolio());
        dispatch(getContactUs());
        dispatch(getTestimonial());
        dispatch(getBlog());
        dispatch(getResume());
        dispatch(getNewsletter());
        dispatch(getComment());
        setTimeout(() => setLoaded(true), 600);
    }, []);

    const live = {
        education:    unwrap(raw.education),
        experience:   unwrap(raw.experience),
        services:     unwrap(raw.services),
        skills:       unwrap(raw.skills),
        certificates: unwrap(raw.certificates),
        portfolios:   unwrap(raw.portfolios),
        contacts:     unwrap(raw.contacts),
        testimonials: unwrap(raw.testimonials),
        blogs:        unwrap(raw.blogs),
        resumes:      unwrap(raw.resumes),
        newsletters:  unwrap(raw.newsletters),
        comments:     unwrap(raw.comments),
    };

    const allEmpty = loaded && Object.values(live).every(a => a.length === 0);
    useEffect(() => { if (loaded) setUsingSample(allEmpty); }, [allEmpty, loaded]);

    const D = allEmpty ? SAMPLE : live;

    // ── Derived numbers ────────────────────────────────────────────────────────
    const activeServices      = D.services.filter(s => s.active).length;
    const featuredProjects    = D.portfolios.filter(p => p.featured).length;
    const publishedBlogs      = D.blogs.filter(b => b.published).length;
    const draftBlogs          = D.blogs.filter(b => !b.published).length;
    const approvedTestimonials= D.testimonials.filter(t => t.approved).length;
    const pendingTestimonials  = D.testimonials.filter(t => !t.approved).length;
    const pendingContacts      = D.contacts.filter(c => c.active).length;
    const pendingComments      = D.comments.filter(c => !c.approved).length;
    const activeResume         = D.resumes.find(r => r.active);
    const totalBlogViews       = D.blogs.reduce((s, b) => s + (b.views || 0), 0);

    // ── Chart data ─────────────────────────────────────────────────────────────

    // Skill categories breakdown
    const skillCategoryMap = {};
    D.skills.forEach(sk => {
        const cat = sk.category || "Other";
        skillCategoryMap[cat] = (skillCategoryMap[cat] || 0) + 1;
    });
    const skillCategoryData = Object.entries(skillCategoryMap).map(([name, count]) => ({ name, count }));
    const PIE_COLORS = ["#4F8EF7", "#38EFC3", "#A78BFA", "#F7C35F", "#38EF91", "#F97316"];

    // Blog category distribution
    const blogCategoryMap = {};
    D.blogs.forEach(b => {
        const cat = b.category || "Uncategorized";
        blogCategoryMap[cat] = (blogCategoryMap[cat] || 0) + 1;
    });
    const blogCategoryData = Object.entries(blogCategoryMap).map(([name, count], i) => ({
        name, count, color: PIE_COLORS[i % PIE_COLORS.length],
    }));

    // Testimonial status pie
    const testimonialPie = [
        { name: "Approved", value: approvedTestimonials,  color: "#38EF91" },
        { name: "Pending",  value: pendingTestimonials,   color: "#F7C35F" },
    ].filter(d => d.value > 0);

    // Portfolio by category
    const portfolioCatMap = {};
    D.portfolios.forEach(p => {
        const cat = p.category || "Other";
        portfolioCatMap[cat] = (portfolioCatMap[cat] || 0) + 1;
    });
    const portfolioCatData = Object.entries(portfolioCatMap).map(([name, count]) => ({ name, count }));

    // Top blog views
    const topBlogs = [...D.blogs]
        .filter(b => b.views > 0)
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5);

    // Skill level radar (top 6)
    const radarData = D.skills.slice(0, 6).map(sk => ({
        skill: sk.name,
        level: sk.level || 0,
    }));

    // Comment approval status
    const commentApproved = D.comments.filter(c => c.approved).length;
    const commentPending  = D.comments.filter(c => !c.approved).length;
    const commentData = [
        { name: "Approved", count: commentApproved, fill: "#38EF91" },
        { name: "Pending",  count: commentPending,  fill: "#F7C35F" },
    ];

    // Service active/inactive
    const serviceData = [
        { name: "Active",   count: activeServices,                     fill: "#4F8EF7" },
        { name: "Inactive", count: D.services.length - activeServices, fill: "#F75F5F" },
    ];

    const axis = { fontSize: 11, fill: "#8896B3" };
    const grid = { stroke: "rgba(255,255,255,0.05)" };

    // ── Stat cards ─────────────────────────────────────────────────────────────
    const statCards = [
        { label: "Projects",      value: D.portfolios.length,   icon: "fa-folder-open",   accent: "#4F8EF7", link: "/portfolio"    },
        { label: "Skills",        value: D.skills.length,       icon: "fa-code",           accent: "#38EFC3", link: "/skill"        },
        { label: "Certificates",  value: D.certificates.length, icon: "fa-award",          accent: "#A78BFA", link: "/certificate"  },
        { label: "Services",      value: D.services.length,     icon: "fa-briefcase",      accent: "#F7C35F", link: "/service"      },
        { label: "Blog Posts",    value: D.blogs.length,        icon: "fa-pen-nib",        accent: "#38EF91", link: "/blog"         },
        { label: "Testimonials",  value: D.testimonials.length, icon: "fa-star",           accent: "#EC4899", link: "/testimonial"  },
        { label: "Education",     value: D.education.length,    icon: "fa-graduation-cap", accent: "#F97316", link: "/education"    },
        { label: "Experience",    value: D.experience.length,   icon: "fa-building",       accent: "#14B8A6", link: "/experience"   },
    ];

    // ── Alert cards ────────────────────────────────────────────────────────────
    const alertCards = [
        { label: "New Messages",       value: pendingContacts,    icon: "fa-envelope",   color: "#4F8EF7" },
        { label: "Pending Comments",   value: pendingComments,    icon: "fa-comments",   color: "#F7C35F" },
        { label: "Pending Testimonials", value: pendingTestimonials, icon: "fa-clock",  color: "#F75F5F" },
        { label: "Unpublished Blogs",  value: draftBlogs,         icon: "fa-file-alt",  color: "#A78BFA" },
    ];

    return (
        <>
        <style>{`
            .hm-root {
                padding: 28px 24px 80px; max-width: 1280px;
                margin: 0 auto; width: 100%;
                opacity: 0; transform: translateY(14px);
                transition: opacity .45s ease, transform .45s ease;
            }
            .hm-root.hm-loaded { opacity: 1; transform: none; }
            .hm-sample-banner {
                display: flex; align-items: center; gap: 10px;
                background: rgba(247,195,95,0.1);
                border: 1px solid rgba(247,195,95,0.3);
                border-radius: 10px; padding: 10px 16px;
                font-size: 13px; color: #F7C35F; margin-bottom: 20px;
                animation: hmFadeUp .4s ease;
            }
            @keyframes hmFadeUp {
                from { opacity:0; transform:translateY(8px); }
                to   { opacity:1; transform:none; }
            }
            .hm-header {
                display: flex; align-items: flex-start;
                justify-content: space-between; flex-wrap: wrap;
                gap: 12px; margin-bottom: 22px;
            }
            .hm-title {
                font-family: 'Syne', sans-serif;
                font-size: 24px; font-weight: 800;
                color: var(--text-primary); letter-spacing: -.02em; margin: 0;
            }
            .hm-subtitle { font-size: 13px; color: var(--text-secondary); margin: 3px 0 0; }
            .hm-date {
                font-size: 12.5px; color: var(--text-muted);
                background: var(--bg-card); border: 1px solid var(--border);
                border-radius: 8px; padding: 7px 14px;
                display: flex; align-items: center; gap: 7px;
            }

            /* ── Overview banner ── */
            .hm-rev-banner {
                background: linear-gradient(135deg, #0d1d46 0%, #0a1530 60%, #061020 100%);
                border: 1px solid var(--border-accent);
                border-radius: 16px; padding: 22px 28px;
                margin-bottom: 20px; position: relative; overflow: hidden;
            }
            .hm-rev-banner::before {
                content:''; position:absolute; inset:0;
                background: radial-gradient(ellipse at 10% 50%, rgba(79,142,247,.1) 0%, transparent 60%),
                            radial-gradient(ellipse at 90% 50%, rgba(56,239,195,.07) 0%, transparent 60%);
            }
            .hm-rev-inner {
                display: flex; align-items: center;
                justify-content: space-between; flex-wrap: wrap; gap: 16px; position: relative;
            }
            .hm-rev-label {
                font-size: 12px; text-transform: uppercase; letter-spacing: .08em;
                color: var(--text-secondary); margin-bottom: 6px; font-weight: 700;
            }
            .hm-rev-value {
                font-family: 'Syne', sans-serif;
                font-size: 34px; font-weight: 800;
                color: var(--text-primary); letter-spacing: -.02em;
            }
            .hm-rev-icon {
                width: 54px; height: 54px;
                background: linear-gradient(135deg, var(--accent), #3a7de0);
                border-radius: 14px;
                display: flex; align-items: center; justify-content: center;
                font-size: 22px; color: #fff;
                box-shadow: 0 8px 24px rgba(79,142,247,.4);
            }
            .hm-rev-sub {
                display: flex; align-items: center; flex-wrap: wrap; gap: 20px;
                margin-top: 14px; padding-top: 14px;
                border-top: 1px solid rgba(255,255,255,.06); position: relative;
            }
            .hm-rev-sub span { font-size: 12.5px; color: var(--text-secondary); display: flex; align-items: center; gap: 6px; }
            .hm-rev-sub span i { color: var(--accent); }

            /* ── Stat grid ── */
            .hm-stat-grid {
                display: grid; grid-template-columns: repeat(4, 1fr);
                gap: 14px; margin-bottom: 14px;
            }
            .hm-stat-card {
                background: var(--bg-surface); border: 1px solid var(--border);
                border-radius: 14px; padding: 16px 18px;
                display: flex; align-items: center; gap: 14px;
                text-decoration: none; transition: var(--transition);
                animation: hmFadeUp .4s ease both;
                position: relative; overflow: hidden;
            }
            .hm-stat-card::after {
                content:''; position:absolute; bottom:0; left:0; right:0; height: 2px;
                background: var(--card-accent, var(--accent));
                transform: scaleX(0); transform-origin: left; transition: transform .3s ease;
            }
            .hm-stat-card:hover { background: var(--bg-hover); transform: translateY(-2px); }
            .hm-stat-card:hover::after { transform: scaleX(1); }
            .hm-stat-icon {
                width: 42px; height: 42px; border-radius: 11px;
                display: flex; align-items: center; justify-content: center;
                font-size: 16px; flex-shrink: 0;
            }
            .hm-stat-value {
                font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800;
                color: var(--text-primary); display: block; line-height: 1;
            }
            .hm-stat-label { font-size: 11.5px; color: var(--text-secondary); display: block; margin-top: 3px; font-weight: 600; }
            .hm-stat-arrow { margin-left: auto; color: var(--text-muted); font-size: 12px; }

            /* ── Alert grid ── */
            .hm-alert-grid {
                display: grid; grid-template-columns: repeat(4, 1fr);
                gap: 14px; margin-bottom: 20px;
            }
            .hm-alert-card {
                background: var(--bg-surface); border: 1px solid var(--border);
                border-radius: 12px; padding: 14px 16px;
                display: flex; align-items: center; gap: 12px;
                animation: hmFadeUp .4s ease both;
            }
            .hm-alert-val { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; line-height: 1; }
            .hm-alert-lbl { font-size: 12px; color: var(--text-secondary); font-weight: 600; }

            /* ── Chart cards ── */
            .hm-card {
                background: var(--bg-surface); border: 1px solid var(--border);
                border-radius: 14px; padding: 20px; animation: hmFadeUp .45s ease both;
            }
            .hm-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
            .hm-card-title {
                font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700;
                color: var(--text-primary); margin: 0; display: flex; align-items: center; gap: 8px;
            }
            .hm-card-title i { color: var(--accent); font-size: 13px; }
            .hm-card-link { font-size: 12px; color: var(--accent); text-decoration: none; font-weight: 600; transition: color .2s; }
            .hm-card-link:hover { color: var(--accent-2); }
            .hm-empty { font-size: 13px; color: var(--text-muted); text-align: center; padding: 28px 0; font-style: italic; }
            .hm-chart-note {
                font-size: 11px; color: var(--text-muted);
                background: var(--bg-card); border: 1px solid var(--border);
                border-radius: 6px; padding: 3px 9px;
            }

            /* ── Layouts ── */
            .hm-row-wide   { display: grid; grid-template-columns: 1.6fr 1fr; gap: 16px; margin-bottom: 16px; }
            .hm-row-three  { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 16px; }
            .hm-row-two    { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
            .hm-row-single { margin-bottom: 16px; }
            .hm-row-bottom { display: grid; grid-template-columns: 1.4fr 1fr; gap: 16px; margin-bottom: 16px; }

            /* ── Tables ── */
            .hm-table-wrap { overflow-x: auto; margin: 0 -4px; padding: 0 4px; }
            .hm-table { width: 100%; border-collapse: collapse; font-size: 13px; color: var(--text-secondary); }
            .hm-table thead tr th {
                background: var(--bg-card); color: var(--text-muted); font-size: 10.5px;
                text-transform: uppercase; letter-spacing: .07em; font-weight: 700;
                padding: 10px 14px; border-bottom: 1px solid var(--border); white-space: nowrap;
            }
            .hm-table tbody tr { border-bottom: 1px solid var(--border); transition: background .15s; }
            .hm-table tbody tr:last-child { border-bottom: none; }
            .hm-table tbody tr:hover { background: var(--bg-hover); }
            .hm-table tbody td { padding: 11px 14px; vertical-align: middle; color: var(--text-secondary); white-space: nowrap; }
            .hm-table tbody tr:hover td { color: var(--text-primary); }

            /* ── Badges ── */
            .hm-badge {
                display: inline-block; padding: 3px 10px; border-radius: 20px;
                font-size: 11px; font-weight: 700;
                background: var(--bg-card); color: var(--text-muted); border: 1px solid var(--border);
            }
            .hm-badge--success { background:rgba(56,239,145,.12); color:#38EF91; border-color:rgba(56,239,145,.25); }
            .hm-badge--warn    { background:rgba(247,195,95,.12);  color:#F7C35F; border-color:rgba(247,195,95,.25); }
            .hm-badge--info    { background:rgba(79,142,247,.12);  color:#4F8EF7; border-color:rgba(79,142,247,.25); }
            .hm-badge--danger  { background:rgba(247,95,95,.12);   color:#F75F5F; border-color:rgba(247,95,95,.25);  }
            .hm-badge--purple  { background:rgba(167,139,250,.12); color:#A78BFA; border-color:rgba(167,139,250,.25); }

            /* ── Skill bar ── */
            .hm-skill-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
            .hm-skill-name { font-size: 12.5px; color: var(--text-secondary); width: 90px; flex-shrink: 0; font-weight: 600; }
            .hm-skill-track { flex: 1; height: 6px; background: rgba(255,255,255,.07); border-radius: 4px; overflow: hidden; }
            .hm-skill-fill  { height: 100%; border-radius: 4px; transition: width .6s ease; }
            .hm-skill-pct   { font-size: 11px; color: var(--text-muted); width: 32px; text-align: right; }

            /* ── Quick actions ── */
            .hm-quick-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px; }
            .hm-quick-btn {
                display: flex; align-items: center; gap: 10px;
                background: var(--bg-card); border: 1px solid var(--border);
                border-radius: 10px; padding: 10px 12px;
                color: var(--text-secondary); font-size: 12.5px; font-weight: 600;
                text-decoration: none; transition: var(--transition);
                border-left: 3px solid var(--q-color, var(--accent));
            }
            .hm-quick-btn:hover { background: var(--bg-hover); color: var(--text-primary); transform: translateX(2px); }
            .hm-quick-btn i { font-size: 13px; width: 16px; text-align: center; }

            /* ── Resume badge ── */
            .hm-resume-active {
                display: flex; align-items: center; gap: 12px;
                background: rgba(56,239,145,.07); border: 1px solid rgba(56,239,145,.2);
                border-radius: 10px; padding: 12px 16px; margin-bottom: 12px;
            }
            .hm-resume-active i { color: #38EF91; font-size: 18px; }
            .hm-resume-label { font-size: 13px; color: var(--text-secondary); font-weight: 600; }
            .hm-resume-version { font-size: 11.5px; color: #38EF91; font-weight: 700; margin-top: 2px; }

            /* ── Responsive ── */
            @media (max-width: 900px) {
                .hm-stat-grid  { grid-template-columns: repeat(2,1fr); }
                .hm-alert-grid { grid-template-columns: repeat(2,1fr); }
                .hm-row-wide   { grid-template-columns: 1fr; }
                .hm-row-three  { grid-template-columns: 1fr 1fr; }
                .hm-row-bottom { grid-template-columns: 1fr; }
                .hm-row-two    { grid-template-columns: 1fr; }
            }
            @media (max-width: 600px) {
                .hm-stat-grid  { grid-template-columns: repeat(2,1fr); }
                .hm-alert-grid { grid-template-columns: repeat(2,1fr); }
                .hm-row-three  { grid-template-columns: 1fr; }
                .hm-rev-value  { font-size: 26px; }
            }
        `}</style>

        <div className={`hm-root ${loaded ? "hm-loaded" : ""}`}>

            {usingSample && (
                <div className="hm-sample-banner">
                    <i className="fas fa-flask"></i>
                    <strong>Preview mode —</strong> showing sample data because the API returned no records.
                </div>
            )}

            {/* ── Header ── */}
            <div className="hm-header">
                <div>
                    <h1 className="hm-title p-2 bg-primary text-light">Dashboard</h1>
                    <p className="hm-subtitle">Welcome back, Admin — here's your portfolio at a glance.</p>
                </div>
                <span className="hm-date">
                    <i className="fas fa-calendar-alt"></i>
                    {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </span>
            </div>

            {/* ── Overview banner ── */}
            <div className="hm-rev-banner">
                <div className="hm-rev-inner">
                    <div>
                        <p className="hm-rev-label">Total Blog Views</p>
                        <p className="hm-rev-value">{totalBlogViews.toLocaleString("en-IN")}</p>
                    </div>
                    <div className="hm-rev-icon"><i className="fas fa-chart-line"></i></div>
                </div>
                <div className="hm-rev-sub">
                    <span><i className="fas fa-pen-nib"></i> Published: <strong>{publishedBlogs}</strong></span>
                    <span><i className="fas fa-file-alt"></i> Drafts: <strong>{draftBlogs}</strong></span>
                    <span><i className="fas fa-folder-open"></i> Projects: <strong>{D.portfolios.length}</strong> ({featuredProjects} featured)</span>
                    <span><i className="fas fa-envelope-open"></i> Newsletter: <strong>{D.newsletters.length}</strong> subs</span>
                    {activeResume && (
                        <span><i className="fas fa-file-pdf"></i> Active Resume: <strong>{activeResume.label || activeResume.version}</strong></span>
                    )}
                </div>
            </div>

            {/* ── Stat cards ── */}
            <div className="hm-stat-grid">
                {statCards.map((c, i) => (
                    <Link to={c.link} key={i} className="hm-stat-card"
                        style={{ "--card-accent": c.accent, animationDelay: `${i * .05}s` }}>
                        <div className="hm-stat-icon" style={{ background: c.accent + "22", color: c.accent }}>
                            <i className={`fas ${c.icon}`}></i>
                        </div>
                        <div>
                            <span className="hm-stat-value">{c.value}</span>
                            <span className="hm-stat-label">{c.label}</span>
                        </div>
                        <div className="hm-stat-arrow"><i className="fas fa-arrow-right"></i></div>
                    </Link>
                ))}
            </div>

            {/* ── Alert cards ── */}
            <div className="hm-alert-grid">
                {alertCards.map((c, i) => (
                    <div key={i} className="hm-alert-card" style={{ animationDelay: `${.4 + i * .07}s` }}>
                        <i className={`fas ${c.icon}`} style={{ color: c.color, fontSize: 18 }}></i>
                        <div>
                            <div className="hm-alert-val" style={{ color: c.color }}>{c.value}</div>
                            <div className="hm-alert-lbl">{c.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Blog views + Testimonial pie ── */}
            <div className="hm-row-wide">
                <div className="hm-card">
                    <div className="hm-card-header">
                        <h2 className="hm-card-title"><i className="fas fa-eye"></i> Top Blog Posts by Views</h2>
                        <Link to="/blog" className="hm-card-link">View all</Link>
                    </div>
                    {topBlogs.length === 0
                        ? <p className="hm-empty">No published blog data yet.</p>
                        : <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={topBlogs} margin={{ top: 10, right: 10, left: 0, bottom: 40 }} barSize={32}>
                                <CartesianGrid strokeDasharray="3 3" {...grid} />
                                <XAxis dataKey="title" tick={{ ...axis, fontSize: 9.5 }}
                                    axisLine={false} tickLine={false} angle={-20} textAnchor="end" interval={0} />
                                <YAxis tick={axis} axisLine={false} tickLine={false} allowDecimals={false} />
                                <Tooltip content={<DashTooltip />} />
                                <Bar dataKey="views" name="Views" fill="#4F8EF7" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    }
                </div>
                <div className="hm-card">
                    <div className="hm-card-header">
                        <h2 className="hm-card-title"><i className="fas fa-star"></i> Testimonial Status</h2>
                        <Link to="/testimonial" className="hm-card-link">View all</Link>
                    </div>
                    {testimonialPie.length === 0
                        ? <p className="hm-empty">No testimonials yet.</p>
                        : <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie data={testimonialPie} dataKey="value" nameKey="name"
                                    cx="50%" cy="50%" innerRadius={50} outerRadius={78}
                                    paddingAngle={3} strokeWidth={0}>
                                    {testimonialPie.map((e, i) => <Cell key={i} fill={e.color} />)}
                                </Pie>
                                <Tooltip content={<DashTooltip />} />
                                <Legend iconType="circle" iconSize={8}
                                    formatter={v => <span style={{ fontSize: 11, color: "#8896B3" }}>{v}</span>} />
                            </PieChart>
                        </ResponsiveContainer>
                    }
                </div>
            </div>

            {/* ── 3-col: blog categories + portfolio categories + comment status ── */}
            <div className="hm-row-three">
                <div className="hm-card">
                    <div className="hm-card-header">
                        <h2 className="hm-card-title"><i className="fas fa-tags"></i> Blog Categories</h2>
                    </div>
                    {blogCategoryData.length === 0
                        ? <p className="hm-empty">No data yet.</p>
                        : <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie data={blogCategoryData} dataKey="count" nameKey="name"
                                    cx="50%" cy="44%" outerRadius={68} paddingAngle={4} strokeWidth={0}>
                                    {blogCategoryData.map((e, i) => <Cell key={i} fill={e.color} />)}
                                </Pie>
                                <Tooltip content={<DashTooltip />} />
                                <Legend iconType="circle" iconSize={8}
                                    formatter={v => <span style={{ fontSize: 10, color: "#8896B3" }}>{v}</span>} />
                            </PieChart>
                        </ResponsiveContainer>
                    }
                </div>
                <div className="hm-card">
                    <div className="hm-card-header">
                        <h2 className="hm-card-title"><i className="fas fa-folder-open"></i> Projects by Category</h2>
                    </div>
                    {portfolioCatData.length === 0
                        ? <p className="hm-empty">No projects yet.</p>
                        : <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={portfolioCatData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barSize={32}>
                                <CartesianGrid strokeDasharray="3 3" {...grid} />
                                <XAxis dataKey="name" tick={{ ...axis, fontSize: 10 }} axisLine={false} tickLine={false} />
                                <YAxis tick={axis} axisLine={false} tickLine={false} allowDecimals={false} />
                                <Tooltip content={<DashTooltip />} />
                                <Bar dataKey="count" name="Projects" fill="#A78BFA" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    }
                </div>
                <div className="hm-card">
                    <div className="hm-card-header">
                        <h2 className="hm-card-title"><i className="fas fa-comments"></i> Comments</h2>
                        <Link to="/comment" className="hm-card-link">View all</Link>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={commentData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barSize={44}>
                            <CartesianGrid strokeDasharray="3 3" {...grid} />
                            <XAxis dataKey="name" tick={axis} axisLine={false} tickLine={false} />
                            <YAxis tick={axis} axisLine={false} tickLine={false} allowDecimals={false} />
                            <Tooltip content={<DashTooltip />} />
                            <Bar dataKey="count" name="Comments" radius={[6, 6, 0, 0]}>
                                {commentData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ── Skill levels + Skill categories ── */}
            <div className="hm-row-wide">
                <div className="hm-card">
                    <div className="hm-card-header">
                        <h2 className="hm-card-title"><i className="fas fa-code"></i> Skill Levels</h2>
                        <Link to="/skill" className="hm-card-link">Manage</Link>
                    </div>
                    {D.skills.length === 0
                        ? <p className="hm-empty">No skills added yet.</p>
                        : D.skills.slice(0, 8).map((sk, i) => (
                            <div key={i} className="hm-skill-row">
                                <span className="hm-skill-name">{sk.name}</span>
                                <div className="hm-skill-track">
                                    <div className="hm-skill-fill"
                                        style={{
                                            width: `${sk.level || 0}%`,
                                            background: PIE_COLORS[i % PIE_COLORS.length],
                                        }} />
                                </div>
                                <span className="hm-skill-pct">{sk.level || 0}%</span>
                            </div>
                        ))
                    }
                </div>
                <div className="hm-card">
                    <div className="hm-card-header">
                        <h2 className="hm-card-title"><i className="fas fa-layer-group"></i> Skills by Category</h2>
                    </div>
                    {skillCategoryData.length === 0
                        ? <p className="hm-empty">No skills yet.</p>
                        : <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie data={skillCategoryData} dataKey="count" nameKey="name"
                                    cx="50%" cy="50%" innerRadius={46} outerRadius={74}
                                    paddingAngle={3} strokeWidth={0}>
                                    {skillCategoryData.map((e, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                                </Pie>
                                <Tooltip content={<DashTooltip />} />
                                <Legend iconType="circle" iconSize={8}
                                    formatter={v => <span style={{ fontSize: 11, color: "#8896B3" }}>{v}</span>} />
                            </PieChart>
                        </ResponsiveContainer>
                    }
                </div>
            </div>

            {/* ── Services + Contacts table ── */}
            <div className="hm-row-two">
                <div className="hm-card">
                    <div className="hm-card-header">
                        <h2 className="hm-card-title"><i className="fas fa-briefcase"></i> Service Status</h2>
                        <Link to="/service" className="hm-card-link">View all</Link>
                    </div>
                    <ResponsiveContainer width="100%" height={160}>
                        <BarChart data={serviceData} layout="vertical"
                            margin={{ top: 5, right: 20, left: 10, bottom: 5 }} barSize={28}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} {...grid} />
                            <XAxis type="number" tick={axis} axisLine={false} tickLine={false} allowDecimals={false} />
                            <YAxis type="category" dataKey="name" tick={axis} axisLine={false} tickLine={false} width={70} />
                            <Tooltip content={<DashTooltip />} />
                            <Bar dataKey="count" name="Services" radius={[0, 6, 6, 0]}>
                                {serviceData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>

                    {/* Service list */}
                    <div style={{ marginTop: 12 }}>
                        {D.services.slice(0, 5).map((s, i) => (
                            <div key={i} style={{
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                padding: "8px 0", borderBottom: "1px solid var(--border)", fontSize: 13,
                            }}>
                                <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>{s.title || s.name || `Service ${i + 1}`}</span>
                                <span className={`hm-badge ${s.active ? "hm-badge--success" : "hm-badge--danger"}`}>
                                    {s.active ? "Active" : "Inactive"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="hm-card">
                    <div className="hm-card-header">
                        <h2 className="hm-card-title"><i className="fas fa-envelope"></i> Recent Messages</h2>
                        <Link to="/contactus" className="hm-card-link">View all</Link>
                    </div>
                    {D.contacts.length === 0
                        ? <p className="hm-empty">No messages yet.</p>
                        : <div className="hm-table-wrap">
                            <table className="hm-table">
                                <thead><tr><th>Name</th><th>Subject</th><th>Status</th></tr></thead>
                                <tbody>
                                    {D.contacts.slice(0, 5).map((c, i) => (
                                        <tr key={i}>
                                            <td style={{ color: "var(--text-primary)", fontWeight: 600 }}>{c.name || "—"}</td>
                                            <td>{c.subject || "—"}</td>
                                            <td>
                                                <span className={`hm-badge ${c.active ? "hm-badge--warn" : "hm-badge--success"}`}>
                                                    {c.active ? "Unread" : "Read"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    }
                </div>
            </div>

            {/* ── Education + Experience tables ── */}
            <div className="hm-row-two">
                <div className="hm-card">
                    <div className="hm-card-header">
                        <h2 className="hm-card-title"><i className="fas fa-graduation-cap"></i> Education</h2>
                        <Link to="/education" className="hm-card-link">Manage</Link>
                    </div>
                    {D.education.length === 0
                        ? <p className="hm-empty">No education entries yet.</p>
                        : <div className="hm-table-wrap">
                            <table className="hm-table">
                                <thead><tr><th>Degree</th><th>Institution</th><th>Year</th><th>Status</th></tr></thead>
                                <tbody>
                                    {D.education.map((e, i) => (
                                        <tr key={i}>
                                            <td style={{ color: "var(--text-primary)", fontWeight: 600 }}>{e.degree || e.title || "—"}</td>
                                            <td>{e.institution || e.school || "—"}</td>
                                            <td>{e.year || e.duration || "—"}</td>
                                            <td>
                                                <span className={`hm-badge ${e.status === "Ongoing" ? "hm-badge--info" : "hm-badge--success"}`}>
                                                    {e.status || "Completed"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    }
                </div>

                <div className="hm-card">
                    <div className="hm-card-header">
                        <h2 className="hm-card-title"><i className="fas fa-building"></i> Experience</h2>
                        <Link to="/experience" className="hm-card-link">Manage</Link>
                    </div>
                    {D.experience.length === 0
                        ? <p className="hm-empty">No experience entries yet.</p>
                        : <div className="hm-table-wrap">
                            <table className="hm-table">
                                <thead><tr><th>Role</th><th>Company</th><th>Duration</th><th>Type</th></tr></thead>
                                <tbody>
                                    {D.experience.map((e, i) => (
                                        <tr key={i}>
                                            <td style={{ color: "var(--text-primary)", fontWeight: 600 }}>{e.role || e.title || e.position || "—"}</td>
                                            <td>{e.company || e.organization || "—"}</td>
                                            <td>{e.duration || e.year || "—"}</td>
                                            <td>
                                                <span className={`hm-badge ${e.type === "Freelance" ? "hm-badge--purple" : "hm-badge--info"}`}>
                                                    {e.type || "Full-time"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    }
                </div>
            </div>

            {/* ── Certificates + Quick actions ── */}
            <div className="hm-row-bottom">
                <div className="hm-card">
                    <div className="hm-card-header">
                        <h2 className="hm-card-title"><i className="fas fa-award"></i> Certificates</h2>
                        <Link to="/certificate" className="hm-card-link">View all</Link>
                    </div>
                    {D.certificates.length === 0
                        ? <p className="hm-empty">No certificates yet.</p>
                        : <div className="hm-table-wrap">
                            <table className="hm-table">
                                <thead><tr><th>#</th><th>Title</th><th>Issuer</th><th>Year</th></tr></thead>
                                <tbody>
                                    {D.certificates.map((c, i) => (
                                        <tr key={i}>
                                            <td style={{ color: "var(--text-muted)", fontSize: 11 }}>#{i + 1}</td>
                                            <td style={{ color: "var(--text-primary)", fontWeight: 600 }}>{c.title || c.name || "—"}</td>
                                            <td>{c.issuer || c.organization || "—"}</td>
                                            <td>{c.year || c.date || "—"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    }
                </div>

                <div className="hm-card">
                    <div className="hm-card-header">
                        <h2 className="hm-card-title"><i className="fas fa-bolt"></i> Quick Actions</h2>
                    </div>

                    {/* Active resume indicator */}
                    {activeResume && (
                        <div className="hm-resume-active">
                            <i className="fas fa-file-pdf"></i>
                            <div>
                                <div className="hm-resume-label">{activeResume.label || "Active Resume"}</div>
                                <div className="hm-resume-version">{activeResume.version}</div>
                            </div>
                            <Link to="/resume" className="hm-card-link" style={{ marginLeft: "auto" }}>Change</Link>
                        </div>
                    )}

                    <div className="hm-quick-grid">
                        {[
                            { label: "Add Project",     icon: "fa-folder-plus",    link: "/portfolio/create",   color: "#4F8EF7" },
                            { label: "Write Blog",      icon: "fa-pen-nib",        link: "/blog/create",        color: "#38EFC3" },
                            { label: "Add Skill",       icon: "fa-code",           link: "/skill/create",       color: "#A78BFA" },
                            { label: "Add Certificate", icon: "fa-award",          link: "/certificate/create", color: "#38EF91" },
                            { label: "Add Service",     icon: "fa-briefcase",      link: "/service/create",     color: "#F97316" },
                            { label: "Add Experience",  icon: "fa-building",       link: "/experience/create",  color: "#14B8A6" },
                            { label: "View Messages",   icon: "fa-envelope",       link: "/contactus",          color: "#F75F5F" },
                            { label: "Testimonials",    icon: "fa-star",           link: "/testimonial",        color: "#EC4899" },
                        ].map((q, i) => (
                            <Link to={q.link} key={i} className="hm-quick-btn" style={{ "--q-color": q.color }}>
                                <i className={`fas ${q.icon}`} style={{ color: q.color }}></i>
                                <span>{q.label}</span>
                            </Link>
                        ))}
                    </div>

                    <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: 13, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 7 }}>
                                <i className="fas fa-envelope-open" style={{ color: "var(--accent)" }}></i> Newsletter Subscribers
                            </span>
                            <Link to="/newsletter" className="hm-card-link"><strong>{D.newsletters.length}</strong> subs</Link>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: 13, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 7 }}>
                                <i className="fas fa-comments" style={{ color: "#F7C35F" }}></i> Pending Comments
                            </span>
                            <Link to="/comment" className="hm-card-link"><strong>{pendingComments}</strong> to review</Link>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        </>
    );
}