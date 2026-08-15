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
      <style>{`
        .services-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
          justify-content: center;
        }
        @media (max-width: 991.98px) {
          .services-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 16px;
          }
        }
        @media (max-width: 576px) {
          .services-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 10px !important;
          }
          .services-grid > :last-child:nth-child(odd) {
            grid-column: 1 / -1 !important;
            justify-self: center !important;
            width: calc(50% - 5px) !important;
            max-width: calc(50% - 5px) !important;
          }
        }
        @media (max-width: 360px) {
          .services-grid {
            gap: 8px !important;
          }
        }
      `}</style>
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
        <div className="services-grid mt-2">
          {activeServices.map((service, index) => (
            <div
              key={service._id || index}
              data-aos="fade-up"
              data-aos-delay={(index % 3) * 100}
              style={{ minWidth: 0, width: "100%" }}
            >
              <div className="service-card">
                <div className="service-icon-box">
                  <i className={service.icon || "bi bi-code-square"}></i>
                </div>

                <h3 className="service-title">{service.name}</h3>

                <p className="service-description">
                  {service.shortDescription}
                </p>

                <div className="service-card-footer d-flex align-items-center justify-content-between w-100 mt-auto pt-3 border-top" style={{ borderColor: "var(--border-color)" }}>
                  <Link
                    href={`/serviceDetail/${service._id}`}
                    className="service-action-link"
                  >
                    <span>Explore</span> <i className="bi bi-arrow-right"></i>
                  </Link>

                  {service.price && (
                    <span className="service-price-badge badge bg-body-secondary text-body" style={{ fontSize: "0.8rem", padding: "4px 8px", borderRadius: "999px" }}>
                      ₹{service.price}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {activeServices.length === 0 && (
            <div className="py-5 text-muted" style={{ gridColumn: "1 / -1" }}>
              No services listed currently.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
