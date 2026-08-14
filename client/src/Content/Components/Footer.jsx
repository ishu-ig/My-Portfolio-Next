"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createNewsletter } from "../Redux/ActionCreators/NewsletterActionCreators";

export default function Footer() {
  const dispatch = useDispatch();

  const defaultMessage =
    "Get exclusive tech updates, open-source releases, and architectural insights directly to your inbox.";
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState(defaultMessage);

  function getInputData(e) {
    setEmail(e.target.value);
    if (!e.target.value) {
      setError("Email is required");
    } else {
      setError("");
    }
  }

  function postSubmit(e) {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    dispatch(createNewsletter({ email }));

    setMessage(
      "Thanks for subscribing! You'll now receive updates on new projects & articles. 🎉"
    );

    setTimeout(() => {
      setMessage(defaultMessage);
    }, 15000);

    setEmail("");
  }

  return (
    <footer id="footer" className="footer">
      <div className="container">
        
        {/* NEWSLETTER — Glass Card */}
        <div className="newsletter-glass mb-5" data-aos="fade-up">
          <div className="row align-items-center g-4">
            
            {/* Left Section */}
            <div className="col-lg-6 text-center text-lg-start">
              <div className="d-flex align-items-center justify-content-center justify-content-lg-start gap-2 mb-2">
                <span style={{ fontSize: "1.3rem" }}>📬</span>
                <h3 className="fw-bold m-0" style={{ color: "#ffffff", fontSize: "1.4rem" }}>
                  Join the Tech Newsletter
                </h3>
              </div>
              <p className="mb-0" style={{ color: "#c8c5e6", fontSize: "0.92rem", lineHeight: 1.6 }}>
                {message}
              </p>
            </div>

            {/* Right Section */}
            <div className="col-lg-6">
              <form
                onSubmit={postSubmit}
                className="d-flex justify-content-center justify-content-lg-end"
              >
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={getInputData}
                  className="newsletter-input flex-grow-1"
                  placeholder={error ? error : "Enter your email address..."}
                  style={{ maxWidth: 360 }}
                />

                <button type="submit" className="newsletter-btn">
                  Subscribe
                </button>
              </form>

              {error && (
                <p className="text-danger small mt-2 text-center text-lg-end">
                  {error}
                </p>
              )}
            </div>

          </div>
        </div>

        {/* Main Footer Content */}
        <div className="text-center pt-2">
          
          {/* Quick Navigation Links */}
          <div className="d-flex justify-content-center flex-wrap gap-4 mb-4" style={{ fontSize: "0.9rem" }}>
            <a href="#home" className="text-decoration-none" style={{ color: "#a5a2cc" }}>Home</a>
            <a href="#about" className="text-decoration-none" style={{ color: "#a5a2cc" }}>About</a>
            <a href="#skills" className="text-decoration-none" style={{ color: "#a5a2cc" }}>Skills</a>
            <a href="#portfolio" className="text-decoration-none" style={{ color: "#a5a2cc" }}>Portfolio</a>
            <a href="#services" className="text-decoration-none" style={{ color: "#a5a2cc" }}>Services</a>
            <a href="#blog" className="text-decoration-none" style={{ color: "#a5a2cc" }}>Blog</a>
            <a href="#contact" className="text-decoration-none" style={{ color: "#a5a2cc" }}>Contact</a>
          </div>

          {/* Social Links */}
          <div className="d-flex justify-content-center gap-3 mb-4">
            <a
              href="https://github.com/ishu-ig"
              target="_blank"
              rel="noreferrer"
              className="social-icon-btn"
              title="GitHub"
            >
              <i className="bi bi-github"></i>
            </a>
            <a
              href="https://www.linkedin.com/in/ishaan-gupta-2a0568242"
              target="_blank"
              rel="noreferrer"
              className="social-icon-btn"
              title="LinkedIn"
            >
              <i className="bi bi-linkedin"></i>
            </a>
            <a
              href="https://www.instagram.com/_ishaan_12"
              target="_blank"
              rel="noreferrer"
              className="social-icon-btn"
              title="Instagram"
            >
              <i className="bi bi-instagram"></i>
            </a>
          </div>

          {/* Copyright & Credits */}
          <p className="mb-1" style={{ color: "#8a85b3", fontSize: "0.86rem" }}>
            © {new Date().getFullYear()} <strong style={{ color: "#ffffff" }}>Ishaan Gupta</strong>. All Rights Reserved.
          </p>
          <p style={{ color: "#6a6594", fontSize: "0.82rem", margin: 0 }}>
            Crafted with React, Redux, and modern Web Standards.
          </p>
        </div>

      </div>
    </footer>
  );
}
