"use client"
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEducation } from '../Redux/ActionCreators/EducationActionCreators';
import { getExperience } from '../Redux/ActionCreators/ExperienceActionCreators';
import "aos/dist/aos.css";
import AOS from "aos";

export default function Resume() {
    const EducationStateData = useSelector(state => state.EducationStateData);
    const ExperienceStateData = useSelector(state => state.ExperienceStateData);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getEducation());
        dispatch(getExperience());
        AOS.init({ duration: 900, once: true });
    }, [dispatch]);

    const activeExp = Array.isArray(ExperienceStateData) ? ExperienceStateData.filter(x => x.active) : [];
    const activeEdu = Array.isArray(EducationStateData) ? EducationStateData.filter(x => x.active) : [];

    return (
        <section id="resume" className="resume-section">
            <div className="container text-center" data-aos="fade-up">
                
                <span className="section-badge">
                    <i className="bi bi-briefcase-fill"></i>
                    Career Roadmap
                </span>
                <h2 className="section-title">Experience & Education</h2>
                <div className="title-shape">
                    <svg viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 0,10 C 40,0 60,20 100,10 C 140,0 160,20 200,10" fill="none" stroke="currentColor" strokeWidth="2"></path>
                    </svg>
                </div>
                <p className="section-subtitle">
                    A comprehensive timeline of my professional roles, key contributions, and educational milestones.
                </p>

                <div className="resume-container text-start">

                    {/* Column 1: Work Experience */}
                    <div data-aos="fade-right" data-aos-delay="100">
                        <h3 className="resume-column-title">
                            <i className="bi bi-laptop"></i>
                            Work Experience
                        </h3>
                        <div className="timeline-v2">
                            {activeExp.map((item, index) => (
                                <div key={item._id || index} className="timeline-node" data-aos="fade-up" data-aos-delay={index * 100}>
                                    <div className="timeline-marker"></div>
                                    <div className="timeline-card">
                                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-1">
                                            <span className="timeline-period-badge">
                                                {item.startDate} — {item.endDate}
                                            </span>
                                        </div>
                                        <h4 className="timeline-position">{item.jobTitle}</h4>
                                        <p className="timeline-org">
                                            <i className="bi bi-buildings me-1"></i>
                                            {item.companyName}
                                        </p>
                                        <p className="timeline-desc">{item.description}</p>
                                    </div>
                                </div>
                            ))}

                            {activeExp.length === 0 && (
                                <div className="p-3 text-muted">No experience entries listed yet.</div>
                            )}
                        </div>
                    </div>

                    {/* Column 2: Education */}
                    <div data-aos="fade-left" data-aos-delay="150">
                        <h3 className="resume-column-title">
                            <i className="bi bi-mortarboard-fill"></i>
                            Education & Degrees
                        </h3>
                        <div className="timeline-v2">
                            {activeEdu.map((item, index) => (
                                <div key={item._id || index} className="timeline-node" data-aos="fade-up" data-aos-delay={index * 100}>
                                    <div className="timeline-marker"></div>
                                    <div className="timeline-card">
                                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-1">
                                            <span className="timeline-period-badge">
                                                {item.startDate} — {item.endDate}
                                            </span>
                                        </div>
                                        <h4 className="timeline-position">{item.degreeName}</h4>
                                        <p className="timeline-org">
                                            <i className="bi bi-award me-1"></i>
                                            {item.instituteName}
                                        </p>
                                        <p className="timeline-desc">{item.description}</p>
                                    </div>
                                </div>
                            ))}

                            {activeEdu.length === 0 && (
                                <div className="p-3 text-muted">No education records listed yet.</div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
