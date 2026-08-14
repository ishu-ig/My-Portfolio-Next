"use client";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAchievement } from "../Redux/ActionCreators/AchievementActionCreators";
import "aos/dist/aos.css";
import AOS from "aos";

export default function Achievement() {
  const dispatch = useDispatch();
  const AchievementStateData = useSelector(state => state.AchievementStateData);
  const [counters, setCounters] = useState([]);
  const sectionRef = useRef(null);
  const animatedRef = useRef(false);

  useEffect(() => { 
    dispatch(getAchievement()); 
    AOS.init({ duration: 900, once: true });
  }, [dispatch]);

  useEffect(() => {
    if (!AchievementStateData?.length) return;
    const active = [...AchievementStateData]
      .filter(item => item.active)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(item => ({ ...item, value: 0, isStatic: item.type === "static" }));
    setCounters(active);
  }, [AchievementStateData]);

  // Run Countup when in view
  useEffect(() => {
    if (!counters.length || animatedRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !animatedRef.current) {
        animatedRef.current = true;
        
        counters.forEach((counter, index) => {
          if (counter.isStatic || !counter.target) return;
          let current = 0;
          const target = Number(counter.target);
          const increment = Math.max(1, Math.ceil(target / 45));
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            setCounters(prev => {
              const next = [...prev];
              if (next[index]) next[index] = { ...next[index], value: current };
              return next;
            });
          }, 35);
        });
      }
    }, { threshold: 0.2 });

    const elem = sectionRef.current;
    if (elem) observer.observe(elem);

    return () => {
      if (elem) observer.unobserve(elem);
    };
  }, [counters]);

  if (!counters.length) return null;

  return (
    <section ref={sectionRef} id="achievements" style={{ padding: "80px 0", backgroundColor: "var(--bg-color)" }}>
      <div className="container">

        {/* Header */}
        <div className="text-center mb-5" data-aos="fade-up">
          <span className="section-badge">
            <i className="bi bi-trophy-fill"></i>
            Key Milestones
          </span>
          <h2 className="section-title">
            Achievements & Impact
          </h2>
          <div className="title-shape">
            <svg viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M 0,10 C 40,0 60,20 100,10 C 140,0 160,20 200,10" fill="none" stroke="currentColor" strokeWidth="2"></path>
            </svg>
          </div>
          <p className="section-subtitle">
            Measurable results, key achievements, and performance metrics delivered across multiple domains.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="achievement-grid" data-aos="fade-up" data-aos-delay="100">
          {counters.map((counter, index) => (
            <div
              key={counter._id || index}
              className="achievement-card-v2"
            >
              {/* Icon Circle */}
              <div className="achievement-icon-circle">
                <i className={counter.icon || "bi bi-award-fill"} />
              </div>

              {/* Unified Counter / Stat Display */}
              <div>
                <div className="achievement-number">
                  {counter.isStatic ? (
                    <span>{counter.stat || counter.target || "100%"}</span>
                  ) : (
                    <>
                      {counter.value}
                      <span style={{ fontSize: "1.3rem", fontWeight: 700 }}>+</span>
                    </>
                  )}
                </div>
                <p className="achievement-label">
                  {counter.label}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}