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
      <style>{`
        .achievement-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 20px;
          max-width: 1000px;
          margin: 40px auto 0;
        }

        @media (max-width: 991.98px) {
          .achievement-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 16px;
          }
        }

        @media (max-width: 576px) {
          #achievements {
            padding: 45px 0 !important;
          }
          .achievement-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 10px !important;
            margin-top: 24px;
          }
          .achievement-grid > :last-child:nth-child(odd) {
            grid-column: 1 / -1 !important;
            justify-self: center !important;
            width: calc(50% - 5px) !important;
            max-width: calc(50% - 5px) !important;
          }
          .achievement-card-v2 {
            padding: 14px 8px !important;
            border-radius: var(--radius-md) !important;
            min-width: 0 !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }
          .achievement-icon-circle {
            width: 36px !important;
            height: 36px !important;
            font-size: 1.05rem !important;
            margin-bottom: 8px !important;
            border-radius: 10px !important;
          }
          .achievement-number {
            font-size: 1.35rem !important;
            margin-bottom: 2px !important;
          }
          .achievement-label {
            font-size: 0.68rem !important;
            letter-spacing: 0.03em !important;
            line-height: 1.2 !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
          }
        }

        @media (max-width: 360px) {
          .achievement-grid {
            gap: 8px !important;
          }
          .achievement-card-v2 {
            padding: 10px 6px !important;
          }
          .achievement-icon-circle {
            width: 32px !important;
            height: 32px !important;
            font-size: 0.95rem !important;
          }
          .achievement-number {
            font-size: 1.2rem !important;
          }
          .achievement-label {
            font-size: 0.62rem !important;
          }
        }
      `}</style>
      <div className="container">

        {/* Header */}
        <div className="text-center mb-4" data-aos="fade-up">
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
          <p className="section-subtitle mb-0">
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
                      <span style={{ fontSize: "1.1rem", fontWeight: 700 }}>+</span>
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