import React from "react";

export default function Footer() {
  return (
    <footer className="admin-footer">
      <div className="container-fluid px-3 px-lg-4 d-flex flex-column flex-md-row align-items-center justify-content-between gap-2">
        <span className="text-muted">
          &copy; {new Date().getFullYear()} <strong className="text-body">adminHMD</strong> — All rights reserved.
        </span>
        <div className="d-flex align-items-center gap-3">
          <span className="badge text-bg-primary">v2.0 Pro</span>
          <span className="text-muted small">Portfolio Admin Suite</span>
        </div>
      </div>
    </footer>
  );
}