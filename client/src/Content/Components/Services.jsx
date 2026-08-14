"use client"
import React, { useEffect } from "react";
import { getService } from "../Redux/ActionCreators/ServiceActionCreators";
import { useDispatch, useSelector } from "react-redux";
import "aos/dist/aos.css";
import AOS from "aos";
import Link from "next/link";

export default function Service() {
  const ServiceStateData = useSelector((state) => state.ServiceStateData);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getService());
    AOS.init({ duration: 900, once: true });
  }, [dispatch]);

  const activeServices = Array.isArray(ServiceStateData) ? ServiceStateData.filter((x) => x.active) : [];

  return (
    <section id="services" className="services-section">
      <div className="container text-center">
        
        {/* Section Header */}
        <div data-aos="fade-up">
          <span className="section-badge">
            <i className="bi bi-gear-wide-connected"></i>
            Offerings
          </span>
          <h2 className="section-title">
            Services & Expertise
          </h2>
          <div className="title-shape">
            <svg viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M 0,10 C 40,0 60,20 100,10 C 140,0 160,20 200,10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
          <p className="section-description mb-4">
            End-to-end full-stack web engineering, custom architecture, UI/UX prototyping, and performance optimization.
          </p>
        </div>

        {/* Services Grid */}
        <div className="row g-4 mt-2 justify-content-center">
          {activeServices.map((service, index) => (
            <div
              className="col-12 col-md-6 col-lg-4"
              key={service._id || index}
              data-aos="fade-up"
              data-aos-delay={(index % 3) * 100}
            >
              <div className="service-card">
                <div className="service-icon-box">
                  <i className={service.icon || "bi bi-code-square"}></i>
                </div>

                <h3 className="service-title">{service.name}</h3>

                <p className="service-description">
                  {service.shortDescription}
                </p>

                <div className="d-flex align-items-center justify-content-between w-100 mt-auto pt-3 border-top" style={{ borderColor: "var(--border-color)" }}>
                  <Link
                    href={`/serviceDetail/${service._id}`}
                    className="service-action-link"
                  >
                    Explore Service <i className="bi bi-arrow-right"></i>
                  </Link>

                  {service.price && (
                    <span className="badge bg-body-secondary text-body" style={{ fontSize: "0.8rem", padding: "6px 12px", borderRadius: "999px" }}>
                      ₹{service.price}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {activeServices.length === 0 && (
            <div className="col-12 py-5 text-muted">
              No services listed currently.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
