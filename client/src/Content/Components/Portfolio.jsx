"use client"
import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { getPortfolio } from '../Redux/ActionCreators/PortfolioActionCreators';
import "aos/dist/aos.css";
import AOS from "aos";

export default function Portfolio() {
    const PortfolioStateData = useSelector(state => state.PortfolioStateData);
    const dispatch = useDispatch();
    const [activeFilter, setActiveFilter] = useState('all');

    useEffect(() => {
        dispatch(getPortfolio());
        AOS.init({ duration: 900, once: true });
    }, [dispatch]);

    const activeItems = useMemo(() => {
        return Array.isArray(PortfolioStateData) ? PortfolioStateData.filter(x => x.active) : [];
    }, [PortfolioStateData]);

    const categories = useMemo(() => {
        const cats = new Set(activeItems.map(x => x.category).filter(Boolean));
        return ['all', ...Array.from(cats)];
    }, [activeItems]);

    const filtered = useMemo(() => {
        return activeItems.filter(
            x => activeFilter === 'all' || x.category?.toLowerCase() === activeFilter.toLowerCase()
        );
    }, [activeItems, activeFilter]);

    return (
        <>
            <style>{`
                .pf-section { 
                    padding: 95px 0; 
                    background: var(--bg-color); 
                    color: var(--text-color); 
                }

                .pf-filters {
                    display: flex; 
                    flex-wrap: wrap; 
                    gap: 10px;
                    justify-content: center; 
                    margin-bottom: 44px;
                }

                .pf-pill {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    padding: 8px 22px; 
                    border-radius: var(--radius-pill);
                    font-size: 0.86rem; 
                    font-weight: 600;
                    cursor: pointer; 
                    transition: all var(--ease-quick);
                    text-transform: capitalize;
                    border: 1.5px solid var(--border-color);
                    background: transparent;
                    color: var(--text-muted);
                }

                .pf-pill:hover:not(.pf-pill--active) {
                    border-color: var(--primary-color);
                    color: var(--primary-color);
                }

                .pf-pill--active {
                    background: var(--primary-color);
                    border-color: var(--primary-color);
                    color: #ffffff;
                    box-shadow: 0 4px 16px rgba(var(--accent-rgb), 0.4);
                }

                .pf-grid {
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 28px;
                    justify-content: center;
                }

                @media (max-width: 991.98px) {
                    .pf-grid {
                        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                        gap: 18px;
                    }
                }

                @media (max-width: 576px) {
                    .pf-section {
                        padding: 50px 0;
                    }
                    .pf-filters {
                        gap: 6px;
                        margin-bottom: 28px;
                    }
                    .pf-pill {
                        padding: 6px 14px;
                        font-size: 0.76rem;
                    }
                    .pf-grid {
                        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                        gap: 10px;
                    }
                    .pf-img-wrap {
                        height: 120px;
                    }
                    .pf-badge {
                        top: 6px;
                        left: 6px;
                        font-size: 0.58rem;
                        padding: 2px 6px;
                        max-width: calc(100% - 12px);
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    .pf-card-body {
                        padding: 10px 8px;
                    }
                    .pf-card-name {
                        font-size: 0.84rem;
                        margin-bottom: 4px;
                        line-height: 1.25;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        width: 100%;
                    }
                    .pf-tech-pill {
                        font-size: 0.58rem;
                        padding: 1px 4px;
                        margin-right: 2px;
                        margin-bottom: 2px;
                        white-space: nowrap;
                    }
                    .pf-card-footer {
                        padding-top: 8px;
                        min-width: 0;
                    }
                    .pf-view-link {
                        font-size: 0.72rem;
                        gap: 2px;
                        white-space: nowrap;
                    }
                    .pf-live-link {
                        font-size: 0.82rem;
                        flex-shrink: 0;
                    }
                    .pf-action-btn {
                        width: 32px;
                        height: 32px;
                        font-size: 0.8rem;
                    }
                }

                @media (max-width: 360px) {
                    .pf-grid {
                        gap: 8px;
                    }
                    .pf-img-wrap {
                        height: 100px;
                    }
                    .pf-card-body {
                        padding: 8px 6px;
                    }
                    .pf-card-name {
                        font-size: 0.78rem;
                    }
                }

                .pf-card {
                    border-radius: var(--radius-lg);
                    overflow: hidden;
                    background: var(--card-bg);
                    border: 1px solid var(--card-border);
                    box-shadow: var(--shadow-sm);
                    transition: transform var(--ease-smooth),
                                border-color var(--ease-smooth),
                                box-shadow var(--ease-smooth);
                    display: flex;
                    flex-direction: column;
                    min-width: 0;
                    width: 100%;
                }

                .pf-card:hover {
                    transform: translateY(-8px);
                    border-color: var(--primary-color);
                    box-shadow: var(--shadow-lg), 0 0 30px rgba(var(--accent-rgb), 0.15);
                }

                .pf-img-wrap {
                    position: relative;
                    height: 220px;
                    overflow: hidden;
                    background: var(--bg-alt);
                }

                .pf-img-wrap img {
                    transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
                }

                .pf-card:hover .pf-img-wrap img { 
                    transform: scale(1.08); 
                }

                .pf-badge {
                    position: absolute; 
                    top: 12px; 
                    left: 12px;
                    background: var(--primary-color); 
                    color: #ffffff;
                    font-size: 0.72rem; 
                    font-weight: 700;
                    letter-spacing: 0.04em; 
                    text-transform: uppercase;
                    padding: 4px 12px; 
                    border-radius: var(--radius-pill);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.25);
                    z-index: 2;
                }

                .pf-overlay {
                    position: absolute; 
                    inset: 0;
                    background: linear-gradient(160deg, rgba(10, 14, 38, 0.75) 0%, rgba(10, 14, 38, 0.55) 100%);
                    display: flex; 
                    align-items: center; 
                    justify-content: center;
                    gap: 16px;
                    opacity: 0;
                    transition: opacity var(--ease-quick);
                    backdrop-filter: blur(4px);
                    z-index: 3;
                }

                .pf-card:hover .pf-overlay { 
                    opacity: 1; 
                }

                .pf-action-btn {
                    width: 44px; 
                    height: 44px; 
                    border-radius: 50%;
                    background: #ffffff;
                    display: flex; 
                    align-items: center; 
                    justify-content: center;
                    color: #0f111a; 
                    text-decoration: none;
                    font-size: 1.1rem;
                    border: none; 
                    cursor: pointer;
                    transition: transform var(--ease-spring), background var(--ease-quick), color var(--ease-quick);
                    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                }

                .pf-action-btn:hover {
                    transform: scale(1.15);
                    background: var(--primary-color);
                    color: #ffffff;
                }

                .pf-card-body { 
                    padding: 20px; 
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                .pf-card-name {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 1.1rem; 
                    font-weight: 700;
                    color: var(--text-color);
                    margin: 0 0 6px;
                    line-height: 1.35;
                }

                .pf-tech-pill {
                    font-family: 'DM Mono', monospace;
                    font-size: 0.72rem;
                    color: var(--primary-color);
                    background: rgba(var(--accent-rgb), 0.1);
                    padding: 2px 8px;
                    border-radius: var(--radius-sm);
                    margin-right: 6px;
                    margin-bottom: 6px;
                    display: inline-block;
                }

                .pf-card-footer {
                    display: flex; 
                    align-items: center;
                    justify-content: space-between;
                    margin-top: auto; 
                    padding-top: 14px;
                    border-top: 1px solid var(--border-color);
                }

                .pf-view-link {
                    font-size: 0.86rem; 
                    font-weight: 700;
                    color: var(--primary-color); 
                    text-decoration: none;
                    display: inline-flex; 
                    align-items: center; 
                    gap: 6px;
                    transition: gap var(--ease-quick);
                }

                .pf-view-link:hover { 
                    gap: 10px; 
                }

                .pf-live-link {
                    font-size: 1.05rem; 
                    color: var(--text-muted);
                    text-decoration: none; 
                    transition: color var(--ease-quick), transform var(--ease-spring);
                }

                .pf-live-link:hover { 
                    color: var(--primary-color); 
                    transform: scale(1.2);
                }
            `}</style>

            <section id="portfolio" className="pf-section">
                <div className="container">

                    {/* Header */}
                    <div className="text-center mb-5" data-aos="fade-up">
                        <span className="section-badge">
                            <i className="bi bi-briefcase-fill"></i>
                            Featured Projects
                        </span>
                        <h2 className="section-title">Portfolio Showcase</h2>
                        <div className="title-shape">
                            <svg viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M 0,10 C 40,0 60,20 100,10 C 140,0 160,20 200,10" fill="none" stroke="currentColor" strokeWidth="2"></path>
                            </svg>
                        </div>
                        <p className="section-subtitle">
                            Explore full-stack web applications, SaaS platforms, UI design systems, and creative experiments.
                        </p>
                    </div>

                    {/* Filter Pills */}
                    <div className="pf-filters" data-aos="fade-up" data-aos-delay="100">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`pf-pill ${activeFilter.toLowerCase() === cat.toLowerCase() ? 'pf-pill--active' : ''}`}
                                onClick={() => setActiveFilter(cat)}
                            >
                                {cat === 'all' ? `All Projects (${activeItems.length})` : cat}
                            </button>
                        ))}
                    </div>

                    {/* Projects Grid */}
                    <div className="pf-grid">
                        {filtered.map((item, index) => {
                            const imgSrc = Array.isArray(item.pic) ? item.pic[0] : (item.pic || "/img/portfolio/portfolio-1.webp");
                            return (
                                <div
                                    key={item._id || index}
                                    className="pf-card"
                                    data-aos="fade-up"
                                    data-aos-delay={(index % 3) * 100}
                                >
                                    <div className="pf-img-wrap">
                                        <Image
                                            src={imgSrc}
                                            alt={item.name}
                                            fill
                                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 50vw, 320px"
                                            style={{ objectFit: "cover" }}
                                            loading={index < 3 ? undefined : "lazy"}
                                        />
                                        <span className="pf-badge">{item.category || "Project"}</span>

                                        <div className="pf-overlay">
                                            {item.liveUrl && (
                                                <a
                                                    href={item.liveUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="pf-action-btn"
                                                    title="Live Preview"
                                                >
                                                    <i className="bi bi-box-arrow-up-right"></i>
                                                </a>
                                            )}
                                            <Link
                                                href={`/projectDetail/${item._id}`}
                                                className="pf-action-btn"
                                                title="View Case Study"
                                            >
                                                <i className="bi bi-arrow-right"></i>
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="pf-card-body">
                                        <h3 className="pf-card-name text-truncate">{item.name}</h3>

                                        {/* Tech Stack Chips if available */}
                                        {item.tech && (
                                            <div className="mb-2">
                                                {item.tech.split(',').slice(0, 3).map((t, idx) => (
                                                    <span key={idx} className="pf-tech-pill">
                                                        {t.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="pf-card-footer">
                                            <Link
                                                href={`/projectDetail/${item._id}`}
                                                className="pf-view-link"
                                            >
                                                Case Study <i className="bi bi-arrow-right"></i>
                                            </Link>
                                            <div className="d-flex align-items-center gap-2">
                                                {item.liveUrl && (
                                                    <a
                                                        href={item.liveUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="pf-live-link"
                                                        title="Open live site"
                                                    >
                                                        <i className="bi bi-globe2"></i>
                                                    </a>
                                                )}
                                                {item.adminUrl && (
                                                    <a
                                                        href={item.adminUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="pf-live-link"
                                                        title="Open admin panel"
                                                    >
                                                        <i className="bi bi-shield-lock"></i>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {filtered.length === 0 && (
                        <div className="text-center py-5 text-muted">
                            No projects found in this category.
                        </div>
                    )}

                </div>
            </section>
        </>
    );
}