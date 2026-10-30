"use client";
import React, { useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getTestimonial,
  deleteTestimonial,
  updateTestimonial,
  createTestimonial,
} from "../../Redux/ActionCreators/TestimonialActionCreators";
import formValidator from "../../FormValidators/formValidator";
import imageValidator from "../../FormValidators/imageValidator";

/* ─────────────────────────────────────────────────────────────────
   Portal Modal — renders at document.body to escape transform
   stacking context caused by admin-sidebar's CSS transform
───────────────────────────────────────────────────────────────── */
function PortalModal({ onClose, children }) {
  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Close on Escape
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return ReactDOM.createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(15,23,42,0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        animation: "tmFadeIn .18s ease",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {children}
    </div>,
    document.body
  );
}

/* ─────────────────────────────────────────────────────────────────
   Add Testimonial Modal Body
───────────────────────────────────────────────────────────────── */
function AddTestimonialModal({ onClose, onSuccess }) {
  const [data, setData] = useState({ name: "", pic: "", message: "", active: true });
  const [error, setError] = useState({
    name:    "Name Field is Mandatory",
    pic:     "Pic Field is Mandatory",
    message: "Message Field is Mandatory",
  });
  const [show, setShow]       = useState(false);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const TestimonialStateData = useSelector((s) => s.TestimonialStateData);
  const dispatch = useDispatch();

  function getInputData(e) {
    const name  = e.target.name;
    const value = e.target.files ? e.target.files[0] : e.target.value;

    if (name !== "active") {
      setError((old) => ({
        ...old,
        [name]: e.target.files ? imageValidator(e) : formValidator(e),
      }));
    }
    if (name === "pic" && e.target.files?.[0]) {
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
    setData((old) => ({
      ...old,
      [name]: name === "active" ? (value === "1" ? true : false) : value,
    }));
  }

  function postSubmit(e) {
    e.preventDefault();
    const errorItem = Object.values(error).find((x) => x !== "");
    if (errorItem) {
      setShow(true);
      return;
    }
    const dup = TestimonialStateData.find(
      (x) => x.name.toLowerCase() === data.name.toLowerCase()
    );
    if (dup) {
      setShow(true);
      setError((old) => ({ ...old, name: "Testimonial Already Exists" }));
      return;
    }
    const formData = new FormData();
    formData.append("name",    data.name);
    formData.append("pic",     data.pic);
    formData.append("message", data.message);
    formData.append("active",  data.active);
    setSubmitting(true);
    dispatch(createTestimonial(formData));
    onSuccess();
  }

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 32px 80px rgba(0,0,0,0.45)",
        width: "100%",
        maxWidth: 520,
        overflow: "hidden",
        animation: "tmSlideUp .22s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 18px",
        borderBottom: "1px solid #e9ecef",
      }}>
        <h5 style={{ margin: 0, fontWeight: 700, fontSize: "1rem" }}>
          <i className="bi bi-plus-circle me-2 text-primary"></i>
          Add Testimonial
        </h5>
        <button
          onClick={onClose}
          style={{
            border: "none", background: "#f1f3f5", borderRadius: 8,
            width: 32, height: 32, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1rem", color: "#495057",
            transition: "background .13s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#f8d7da"; e.currentTarget.style.color = "#dc3545"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#f1f3f5"; e.currentTarget.style.color = "#495057"; }}
          aria-label="Close"
        >
          <i className="bi bi-x-lg"></i>
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: "18px" }}>
        {show && (
          <div className="alert alert-danger alert-dismissible mb-3 py-2" role="alert" style={{ fontSize: "0.875rem" }}>
            {Object.values(error).find((x) => x !== "")}
            <button type="button" className="btn-close btn-close-sm" onClick={() => setShow(false)} aria-label="Close" />
          </div>
        )}

        <div className="row g-3">
          {/* Name */}
          <div className="col-12">
            <label className="form-label fw-semibold" style={{ fontSize: "0.85rem" }} htmlFor="tm-name">
              Client Name <span className="text-danger">*</span>
            </label>
            <input
              id="tm-name" type="text" name="name"
              className="form-control form-control-sm"
              placeholder="Enter client name"
              value={data.name} onChange={getInputData}
            />
            {show && error.name && <div className="text-danger" style={{ fontSize: "0.78rem", marginTop: 3 }}>{error.name}</div>}
          </div>

          {/* Message */}
          <div className="col-12">
            <label className="form-label fw-semibold" style={{ fontSize: "0.85rem" }} htmlFor="tm-message">
              Testimonial Message <span className="text-danger">*</span>
            </label>
            <textarea
              id="tm-message" name="message" rows={3}
              className="form-control form-control-sm"
              placeholder="Enter client testimonial..."
              value={data.message} onChange={getInputData}
            />
            {show && error.message && <div className="text-danger" style={{ fontSize: "0.78rem", marginTop: 3 }}>{error.message}</div>}
          </div>

          {/* Photo */}
          <div className="col-md-7">
            <label className="form-label fw-semibold" style={{ fontSize: "0.85rem" }} htmlFor="tm-pic">
              Profile Photo <span className="text-danger">*</span>
            </label>
            <input
              id="tm-pic" type="file" name="pic"
              className="form-control form-control-sm"
              accept="image/jpeg,image/png,image/webp"
              onChange={getInputData}
            />
            {show && error.pic && <div className="text-danger" style={{ fontSize: "0.78rem", marginTop: 3 }}>{error.pic}</div>}
          </div>

          {/* Status */}
          <div className="col-md-5">
            <label className="form-label fw-semibold" style={{ fontSize: "0.85rem" }} htmlFor="tm-active">Status</label>
            <select
              id="tm-active" name="active"
              className="form-select form-select-sm"
              value={data.active ? "1" : "0"} onChange={getInputData}
            >
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </div>

          {/* Preview */}
          {preview && (
            <div className="col-12 d-flex align-items-center gap-2">
              <img
                src={preview} alt="Preview"
                className="rounded-circle border"
                style={{ width: 48, height: 48, objectFit: "cover", flexShrink: 0 }}
              />
              <span style={{ fontSize: "0.8rem", color: "#6c757d" }}>Photo preview</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="d-flex justify-content-end gap-2 mt-4">
          <button className="btn btn-outline-secondary btn-sm" type="button" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary btn-sm"
            type="button"
            onClick={postSubmit}
            disabled={submitting}
          >
            {submitting
              ? <><span className="spinner-border spinner-border-sm me-1" />&nbsp;Saving…</>
              : <><i className="bi bi-check-circle me-1"></i>Create Testimonial</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Main Testimonial List Page
───────────────────────────────────────────────────────────────── */
export default function AdminTestimonial() {
  let TestimonialStateData = useSelector((state) => state.TestimonialStateData);
  let dispatch = useDispatch();

  let [search, setSearch]     = useState("");
  let [showModal, setShowModal] = useState(false);

  const totalCount   = TestimonialStateData.length;
  const activeCount  = TestimonialStateData.filter((t) => t.active).length;
  const inactiveCount = TestimonialStateData.filter((t) => !t.active).length;

  let filteredData = TestimonialStateData.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  function deleteRecord(_id) {
    if (window.confirm("Are you sure you want to delete this item?")) {
      dispatch(deleteTestimonial({ _id }));
      dispatch(getTestimonial());
    }
  }

  function updateRecord(_id) {
    const item = TestimonialStateData.find((t) => t._id === _id);
    if (!item) return;
    dispatch(updateTestimonial({ _id, active: !item.active }));
  }

  function getAPIData() {
    dispatch(getTestimonial());
  }

  useEffect(() => { getAPIData(); }, []);

  const handleModalClose  = useCallback(() => setShowModal(false), []);
  const handleModalSuccess = useCallback(() => {
    setShowModal(false);
    setTimeout(() => dispatch(getTestimonial()), 400);
  }, [dispatch]);

  return (
    <>
      <style>{`
        @keyframes tmFadeIn  { from { opacity:0; } to { opacity:1; } }
        @keyframes tmSlideUp {
          from { transform: translateY(28px) scale(0.97); opacity:0; }
          to   { transform: translateY(0)    scale(1);    opacity:1; }
        }
        /* ── Metric cards ── */
        .metric-card {
          border-radius: 12px;
          border: 1px solid rgba(0,0,0,.08);
          padding: 18px 20px 14px;
          position: relative; overflow: hidden;
          transition: transform .15s, box-shadow .15s;
          box-shadow: 0 1px 4px rgba(0,0,0,.06);
        }
        .metric-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,.10);
        }
        .metric-top {
          display: flex; align-items: center;
          justify-content: space-between; margin-bottom: 10px;
        }
        .metric-label {
          font-size: 0.7rem; font-weight: 700; letter-spacing: .08em;
          text-transform: uppercase; opacity: .75;
        }
        .metric-icon {
          width: 34px; height: 34px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem; background: rgba(255,255,255,.3);
        }
        .metric-value {
          font-size: 1.9rem; font-weight: 700; line-height: 1; margin-bottom: 4px;
        }
        .metric-meta {
          font-size: 0.75rem; opacity: .75; display: flex; gap: 4px;
        }

        /* ── Action pill strip ── */
        .act-strip {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          padding: 3px;
        }
        .act-btn {
          display: inline-flex; align-items: center; justify-content: center;
          width: 30px; height: 30px; border-radius: 6px;
          border: none; background: transparent; cursor: pointer;
          font-size: 0.88rem; color: #6c757d;
          transition: background .13s, color .13s, transform .1s;
          text-decoration: none; position: relative;
        }
        .act-btn:hover { transform: scale(1.1); }
        .act-btn-edit:hover { background: #cfe2ff; color: #0d6efd; }
        .act-btn-on:hover   { background: #d1e7dd; color: #198754; }
        .act-btn-off:hover  { background: #fff3cd; color: #856404; }
        .act-btn-del:hover  { background: #f8d7da; color: #dc3545; }
        .act-sep {
          width: 1px; height: 16px;
          background: #dee2e6; flex-shrink: 0;
        }
        /* Tooltip */
        .act-btn::after {
          content: attr(data-tip);
          position: absolute; bottom: calc(100% + 6px); left: 50%;
          transform: translateX(-50%);
          background: #212529; color: #fff;
          font-size: 0.67rem; font-weight: 600;
          padding: 3px 7px; border-radius: 4px; white-space: nowrap;
          pointer-events: none; z-index: 20;
          opacity: 0; transition: opacity .12s;
        }
        .act-btn:hover::after { opacity: 1; }

        /* ── Message truncate ── */
        .msg-cell {
          max-width: 220px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 0.82rem;
          color: #6c757d;
          pointer-events: none;
          user-select: none;
        }
      `}</style>

      {/* ── Add Testimonial Portal Modal ── */}
      {showModal && (
        <PortalModal onClose={handleModalClose}>
          <AddTestimonialModal onClose={handleModalClose} onSuccess={handleModalSuccess} />
        </PortalModal>
      )}

      <main className="dashboard-content">
        <div className="container-fluid px-3 px-lg-4 py-4">
          {/* ── Page heading ── */}
          <div className="page-heading">
            <div className="page-heading-copy">
              <span className="page-icon">
                <i className="bi bi-chat-quote" aria-hidden="true"></i>
              </span>
              <div>
                <p className="eyebrow mb-1">Management</p>
                <h1 className="h3 mb-1">Testimonials</h1>
                <p className="text-muted mb-0">
                  Review and manage testimonials.
                </p>
              </div>
            </div>
            <div className="heading-actions">
              {/* Opens the portal modal instead of navigating away */}
              <button
                className="btn btn-primary btn-sm"
                type="button"
                onClick={() => setShowModal(true)}
              >
                <i className="bi bi-plus-circle" aria-hidden="true"></i> Add Testimonial
              </button>
            </div>
          </div>

          {/* ── Summary metric cards ── */}
          <section className="row g-3 mt-2 mb-1" aria-label="Testimonial summary">
            <div className="col-12 col-sm-6 col-xl-4">
              <article className="metric-card text-white">
                <div className="metric-top">
                  <span className="metric-label">Total</span>
                  <span className="metric-icon">
                    <i className="bi bi-chat-quote-fill"></i>
                  </span>
                </div>
                <div className="metric-value">{totalCount}</div>
                <div className="metric-meta">
                  <span>all</span>
                  <span>testimonials</span>
                </div>
              </article>
            </div>
            <div className="col-12 col-sm-6 col-xl-4">
              <article className="metric-card text-white">
                <div className="metric-top">
                  <span className="metric-label">Active</span>
                  <span className="metric-icon">
                    <i className="bi bi-check-circle-fill"></i>
                  </span>
                </div>
                <div className="metric-value">{activeCount}</div>
                <div className="metric-meta">
                  <span>published</span>
                  <span>on site</span>
                </div>
              </article>
            </div>
            <div className="col-12 col-sm-6 col-xl-4">
              <article className="metric-card">
                <div className="metric-top">
                  <span className="metric-label">Inactive</span>
                  <span className="metric-icon">
                    <i className="bi bi-eye-slash-fill"></i>
                  </span>
                </div>
                <div className="metric-value">{inactiveCount}</div>
                <div className="metric-meta">
                  <span>hidden</span>
                  <span>from site</span>
                </div>
              </article>
            </div>
          </section>

          {/* ── Table panel ── */}
          <section className="panel mt-3">
            <div className="panel-header">
              <div>
                <h2 className="h5 mb-1 section-title">
                  <i className="bi bi-table" aria-hidden="true"></i>
                  <span>Testimonial List</span>
                </h2>
                <p className="text-muted mb-0">
                  Search, review, and manage testimonials.
                  <span className="ms-2 badge text-bg-secondary">
                    {filteredData.length} / {totalCount}
                  </span>
                </p>
              </div>
              {/* Search */}
              <div className="ms-auto" style={{ minWidth: 220 }}>
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-white">
                    <i className="bi bi-search text-muted"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search testimonials..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {search && (
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => setSearch("")}
                      title="Clear search"
                    >
                      <i className="bi bi-x"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table align-middle mb-0" id="DataTable">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Person</th>
                    <th scope="col">Message</th>
                    <th scope="col">Status</th>
                    <th scope="col" className="text-end">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <tr key={item._id}>
                        <td
                          className="text-muted"
                          style={{ fontSize: "0.8rem" }}
                        >
                          {index + 1}
                        </td>

                        {/* Person: avatar + name stacked */}
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <img
                              src={item.pic}
                              alt={item.name}
                              style={{
                                width: 36,
                                height: 36,
                                objectFit: "cover",
                                borderRadius: "50%",
                                flexShrink: 0,
                                border: "2px solid #dee2e6",
                              }}
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                            <span
                              style={{ fontWeight: 600, fontSize: "0.875rem" }}
                            >
                              {item.name}
                            </span>
                          </div>
                        </td>

                        <td>
                          <span className="msg-cell" title={item.message}>
                            {item.message && item.message.length > 60
                              ? item.message.slice(0, 60) + "..."
                              : item.message}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`badge ${item.active ? "text-bg-success" : "text-bg-secondary"}`}
                          >
                            {item.active ? "Active" : "Inactive"}
                          </span>
                        </td>

                        {/* ── Action pill strip ── */}
                        <td className="text-end">
                          <div className="act-strip">
                            {/* Edit */}
                            <Link
                              className="act-btn act-btn-edit"
                              to={`/testimonial/Update/${item._id}`}
                              data-tip="Edit"
                            >
                              <i className="bi bi-pencil-square"></i>
                            </Link>

                            <span className="act-sep"></span>

                            {/* Toggle */}
                            <button
                              className={`act-btn ${item.active ? "act-btn-off" : "act-btn-on"}`}
                              onClick={() => updateRecord(item._id)}
                              data-tip={item.active ? "Deactivate" : "Activate"}
                            >
                              <i
                                className={`bi ${item.active ? "bi-pause-fill" : "bi-play-fill"}`}
                              ></i>
                            </button>

                            <span className="act-sep"></span>

                            {/* Delete */}
                            <button
                              className="act-btn act-btn-del"
                              onClick={() => deleteRecord(item._id)}
                              data-tip="Delete"
                            >
                              <i className="bi bi-trash3-fill"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center text-muted py-5">
                        <div
                          style={{
                            fontSize: "2rem",
                            opacity: 0.3,
                            marginBottom: 8,
                          }}
                        >
                          <i className="bi bi-chat-quote"></i>
                        </div>
                        {search
                          ? `No testimonials found for "${search}"`
                          : "No testimonials available."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}