"use client"
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPortfolio } from '../Redux/ActionCreartors/PortfolioActionCreators';
import Link from 'next/link';

export default function Portfolio() {
    const PortfolioStateData = useSelector(state => state.PortfolioStateData);
    const dispatch = useDispatch();
    const [activeFilter, setActiveFilter] = useState('all');

    useEffect(() => {
        dispatch(getPortfolio());
    }, []);

    const categories = ['all', ...new Set(
        PortfolioStateData.filter(x => x.active).map(x => x.category)
    )];

    const filtered = PortfolioStateData
        .filter(x => x.active)
        .filter(x => activeFilter === 'all' || x.category === activeFilter);

    return (
        <section
            id="portfolio"
            style={{ padding: '60px 0', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
        >
            {/* ── Header ── */}
            <div className="container text-center mb-5" data-aos="fade-up">
                <p style={{ fontSize: 12, fontWeight: 500, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--primary-color)', margin: 0 }}>
                    My Work
                </p>
                <h2 style={{ fontSize: '2rem', fontWeight: 600, margin: '8px 0 12px', color: 'var(--text-color)' }}>
                    Portfolio
                </h2>
                <svg viewBox="0 0 80 16" style={{ width: 80, display: 'block', margin: '0 auto 14px' }}>
                    <path d="M0 8 C13 0,20 16,40 8 C60 0,67 16,80 8"
                        stroke="var(--primary-color)" strokeWidth="2"
                        fill="none" strokeLinecap="round" />
                </svg>
                <p style={{ fontSize: 15, color: 'var(--muted-color)', maxWidth: 500, margin: '0 auto' }}>
                    Showcasing my best works in web design, graphics, motion, and branding.
                </p>
            </div>

            {/* ── Filter Pills ── */}
            <div className="container" data-aos="fade-up">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 32 }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveFilter(cat)}
                            style={{
                                padding: '6px 18px',
                                borderRadius: 999,
                                border: `1px solid ${activeFilter === cat ? 'transparent' : 'var(--border-color)'}`,
                                background: activeFilter === cat ? 'var(--primary-color)' : 'transparent',
                                color: activeFilter === cat ? '#fff' : 'var(--muted-color)',
                                fontSize: 13,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                textTransform: 'capitalize',
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Grid ── */}
            <div className="container" data-aos="fade-up" data-aos-delay="100">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
                    gap: 20,
                    maxWidth: 960,
                    margin: '0 auto',
                }}>
                    {filtered.map((item, index) => (
                        <div
                            key={index}
                            style={{
                                background: 'var(--card-bg)',
                                borderRadius: 14,
                                border: '1px solid var(--border-color)',
                                overflow: 'hidden',
                                transition: 'transform 0.25s, border-color 0.25s',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-6px)';
                                e.currentTarget.style.borderColor = 'var(--primary-color)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.borderColor = 'var(--border-color)';
                            }}
                        >
                            {/* Image + overlay */}
                            <div style={{ position: 'relative', height: 190, overflow: 'hidden', background: 'var(--card-bg)' }}
                                className="port-img-group">
                                <img
                                    src={item.pic}
                                    alt={item.name}
                                    loading="lazy"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.35s' }}
                                />
                                {/* Category badge */}
                                <span style={{
                                    position: 'absolute', top: 12, left: 12,
                                    background: 'var(--primary-color)', color: '#fff',
                                    fontSize: 11, fontWeight: 500,
                                    padding: '3px 10px', borderRadius: 999,
                                }}>
                                    {item.category}
                                </span>

                                {/* Hover overlay */}
                                {/* Hover overlay */}
<div
    className="port-card-overlay"
    style={{
        position: 'absolute', inset: 0,
        background: 'rgba(10,18,45,0.65)',
        opacity: 0, transition: 'opacity 0.25s',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14,
    }}
>
    <a href={item.liveUrl} target="_blank" rel="noopener noreferrer" style={actionBtnStyle} aria-label="Preview">
        <i className="bi bi-eye" style={{ fontSize: 17 }}></i>
    </a>
    <Link href={`/projectDetail/${item._id}`} style={actionBtnStyle} aria-label="View details">
        <i className="bi bi-arrow-right" style={{ fontSize: 17 }}></i>
    </Link>
</div>
                            </div>

                            {/* Card body */}
                            <div style={{ padding: '14px 16px 16px' }}>
                                <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-color)', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {item.name}
                                </p>
                                <p style={{ fontSize: 12, color: 'var(--muted-color)', margin: 0 }}>
                                    <i className="bi bi-grid" style={{ marginRight: 4 }}></i>
                                    {item.category}
                                </p>
                                {/* Footer */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border-color)' }}>
                                    <Link href={`/projectDetail/${item._id}`} style={{ fontSize: 12, color: 'var(--primary-color)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                                        View details <i className="bi bi-arrow-right"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

const actionBtnStyle = {
    width: 40, height: 40,
    borderRadius: '50%',
    background: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#111',
    textDecoration: 'none',
    transition: 'transform 0.15s',
};