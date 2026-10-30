import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getCertificate,
  deleteCertificate,
  updateCertificate,
} from "../../Redux/ActionCreators/CertificateActionCreators";

export default function AdminCertificate() {
  let CertificateStateData = useSelector((state) => state.CertificateStateData);
  let dispatch = useDispatch();
  let [flag, setFlag] = useState(false);
  let [search, setSearch] = useState("");

  // ── View Modal state ──
  let [viewItem, setViewItem] = useState(null);

  function deleteRecord(_id) {
    if (window.confirm("Are you sure you want to delete this item?")) {
      dispatch(deleteCertificate({ _id: _id }));
      setFlag(!flag);
    }
  }

  function updateRecord(_id) {
    const item = CertificateStateData.find((c) => c._id === _id);
    if (!item) return;
    let formData = new FormData();
    formData.append("_id", _id);
    formData.append("active", !item.active);
    dispatch(updateCertificate(formData));
    setFlag(!flag);
  }

  function getAPIData() {
    dispatch(getCertificate());
  }

  useEffect(() => {
    getAPIData();
  }, [flag]);

  const totalCount    = CertificateStateData ? CertificateStateData.length : 0;
  const activeCount   = CertificateStateData ? CertificateStateData.filter((i) => i.active).length : 0;
  const inactiveCount = CertificateStateData ? CertificateStateData.filter((i) => !i.active).length : 0;

  const filteredData = CertificateStateData
    ? CertificateStateData.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.issuedBy?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <>
      <style>{`
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
        .act-btn-view:hover   { background: #e0cffc; color: #6610f2; }
        .act-btn-edit:hover   { background: #cfe2ff; color: #0d6efd; }
        .act-btn-on:hover     { background: #d1e7dd; color: #198754; }
        .act-btn-off:hover    { background: #fff3cd; color: #856404; }
        .act-btn-del:hover    { background: #f8d7da; color: #dc3545; }
        .act-sep {
          width: 1px; height: 16px;
          background: #dee2e6; flex-shrink: 0;
        }
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

        /* ── Certificate View Modal ── */
        .cert-modal-overlay {
          position: fixed; inset: 0; z-index: 99999;
          background: rgba(0,0,0,0.72);
          display: flex; align-items: center; justify-content: center;
          padding: 16px;
          animation: certFadeIn .18s ease;
        }
        @keyframes certFadeIn { from { opacity:0; } to { opacity:1; } }
        .cert-modal-box {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 32px 80px rgba(0,0,0,0.45);
          max-width: 700px; width: 100%;
          overflow: hidden;
          animation: certSlideUp .22s cubic-bezier(0.22,1,0.36,1);
        }
        @keyframes certSlideUp {
          from { transform: translateY(30px) scale(0.97); opacity:0; }
          to   { transform: translateY(0)    scale(1);    opacity:1; }
        }
        .cert-modal-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 18px;
          border-bottom: 1px solid #e9ecef;
        }
        .cert-modal-title {
          font-weight: 700; font-size: 1rem; margin: 0;
        }
        .cert-modal-close {
          border: none; background: #f1f3f5; border-radius: 8px;
          width: 32px; height: 32px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem; color: #495057;
          transition: background .13s, color .13s;
        }
        .cert-modal-close:hover { background: #f8d7da; color: #dc3545; }
        .cert-modal-body {
          padding: 16px 18px;
        }
        .cert-modal-img {
          width: 100%; border-radius: 10px;
          box-shadow: 0 8px 28px rgba(0,0,0,0.15);
          display: block; max-height: 70vh; object-fit: contain;
          background: #f8f9fa;
        }
        .cert-modal-meta {
          margin-top: 12px; padding-top: 12px;
          border-top: 1px solid #f1f3f5;
          display: flex; flex-wrap: wrap; gap: 12px;
          font-size: 0.82rem; color: #495057;
        }
        .cert-thumb {
          cursor: pointer;
          transition: transform .15s, box-shadow .15s;
        }
        .cert-thumb:hover {
          transform: scale(1.08);
          box-shadow: 0 4px 14px rgba(0,0,0,0.25) !important;
        }
      `}</style>

      {/* ── Certificate View Modal — rendered via portal to escape transform stacking context ── */}
      {viewItem && ReactDOM.createPortal(
        <div
          className="cert-modal-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) setViewItem(null); }}
        >
          <div className="cert-modal-box">
            <div className="cert-modal-header">
              <p className="cert-modal-title">
                <i className="bi bi-patch-check me-2 text-success"></i>
                {viewItem.name}
              </p>
              <button className="cert-modal-close" onClick={() => setViewItem(null)} aria-label="Close">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="cert-modal-body">
              {viewItem.pic ? (
                <img
                  src={viewItem.pic}
                  alt={viewItem.name}
                  className="cert-modal-img"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                style={{
                  display: "none",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 200,
                  color: "#adb5bd",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <i className="bi bi-image" style={{ fontSize: "2.5rem" }}></i>
                <span>Image unavailable</span>
              </div>
              <div className="cert-modal-meta">
                <span>
                  <i className="bi bi-building me-1 text-muted"></i>
                  <strong>Issued By:</strong>&nbsp;{viewItem.issuedBy || "—"}
                </span>
                <span className={`badge ms-auto ${viewItem.active ? "text-bg-success" : "text-bg-secondary"}`}>
                  {viewItem.active ? "Active" : "Inactive"}
                </span>
              </div>
              {viewItem.pic && (
                <div className="mt-3 text-end">
                  <a
                    href={viewItem.pic}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-outline-primary"
                  >
                    <i className="bi bi-box-arrow-up-right me-1"></i>
                    Open Full Image
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      <main className="dashboard-content">
        <div className="container-fluid px-3 px-lg-4 py-4">
          <div className="page-heading">
            <div className="page-heading-copy">
              <span className="page-icon">
                <i className="bi bi-patch-check" aria-hidden="true"></i>
              </span>
              <div>
                <p className="eyebrow mb-1">Management</p>
                <h1 className="h3 mb-1">Certificates</h1>
                <p className="text-muted mb-0">
                  Review and manage certificates.
                </p>
              </div>
            </div>
            <div className="heading-actions">
              <Link className="btn btn-primary btn-sm" to="/certificate/create">
                <i className="bi bi-plus-circle" aria-hidden="true"></i> Add Certificate
              </Link>
            </div>
          </div>

          {/* Metric Cards */}
          <section className="row g-3 mt-2 mb-1" aria-label="Certificate summary">
            <div className="col-12 col-sm-6 col-xl-4">
              <article className="metric-card text-white">
                <div className="metric-top">
                  <span className="metric-label">Total</span>
                  <span className="metric-icon"><i className="bi bi-patch-check-fill"></i></span>
                </div>
                <div className="metric-value">{totalCount}</div>
                <div className="metric-meta"><span>all</span><span>certificates</span></div>
              </article>
            </div>
            <div className="col-12 col-sm-6 col-xl-4">
              <article className="metric-card text-white">
                <div className="metric-top">
                  <span className="metric-label">Active</span>
                  <span className="metric-icon"><i className="bi bi-check-circle-fill"></i></span>
                </div>
                <div className="metric-value">{activeCount}</div>
                <div className="metric-meta"><span>published</span><span>on site</span></div>
              </article>
            </div>
            <div className="col-12 col-sm-6 col-xl-4">
              <article className="metric-card">
                <div className="metric-top">
                  <span className="metric-label">Inactive</span>
                  <span className="metric-icon"><i className="bi bi-eye-slash-fill"></i></span>
                </div>
                <div className="metric-value">{inactiveCount}</div>
                <div className="metric-meta"><span>hidden</span><span>from site</span></div>
              </article>
            </div>
          </section>

          <section className="panel mt-3">
            <div className="panel-header">
              <div>
                <h2 className="h5 mb-1 section-title">
                  <i className="bi bi-table" aria-hidden="true"></i>
                  <span>Certificate List</span>
                </h2>
                <p className="text-muted mb-0">
                  Search, review, and manage certificates.
                </p>
              </div>
              <div className="ms-auto" style={{ minWidth: 220 }}>
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-white">
                    <i className="bi bi-search text-muted"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search certificates..."
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
              <table className="table align-middle mb-0" id="certificatesTable">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Certificate</th>
                    <th scope="col">Name</th>
                    <th scope="col">Issued By</th>
                    <th scope="col">Status</th>
                    <th scope="col" className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <tr key={item._id}>
                        <td>{index + 1}</td>
                        <td>
                          {/* Thumbnail — click to view modal */}
                          {item.pic ? (
                            <img
                              src={item.pic}
                              height={44}
                              width={70}
                              className="rounded shadow-sm cert-thumb"
                              style={{ objectFit: "cover" }}
                              alt={item.name}
                              onClick={() => setViewItem(item)}
                              title="Click to view certificate"
                              onError={(e) => { e.target.style.opacity = 0.3; }}
                            />
                          ) : (
                            <span className="text-muted" style={{ fontSize: "0.8rem" }}>No image</span>
                          )}
                        </td>
                        <td style={{ fontWeight: 600, fontSize: "0.875rem" }}>{item.name}</td>
                        <td style={{ fontSize: "0.875rem", color: "#6c757d" }}>{item.issuedBy}</td>
                        <td>
                          <span
                            className={`badge ${item.active ? "text-bg-success" : "text-bg-secondary"}`}
                          >
                            {item.active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="text-end">
                          <div className="act-strip">
                            {/* View */}
                            <button
                              className="act-btn act-btn-view"
                              onClick={() => setViewItem(item)}
                              data-tip="View"
                            >
                              <i className="bi bi-eye"></i>
                            </button>

                            <span className="act-sep"></span>

                            {/* Edit */}
                            <Link
                              className="act-btn act-btn-edit"
                              to={`/certificate/update/${item._id}`}
                              data-tip="Edit"
                            >
                              <i className="bi bi-pencil-square"></i>
                            </Link>

                            <span className="act-sep"></span>

                            {/* Toggle Active */}
                            <button
                              className={`act-btn ${item.active ? "act-btn-off" : "act-btn-on"}`}
                              onClick={() => updateRecord(item._id)}
                              data-tip={item.active ? "Deactivate" : "Activate"}
                            >
                              <i
                                className={`bi ${item.active ? "bi-pause-fill" : "bi-play-fill"}`}
                              ></i>
                            </button>

                            {localStorage.getItem("role") === "Super Admin" && (
                              <>
                                <span className="act-sep"></span>
                                <button
                                  className="act-btn act-btn-del"
                                  onClick={() => deleteRecord(item._id)}
                                  data-tip="Delete"
                                >
                                  <i className="bi bi-trash3-fill"></i>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center text-muted py-4">
                        <div style={{ fontSize: "2rem", opacity: 0.3, marginBottom: 8 }}>
                          <i className="bi bi-patch-check"></i>
                        </div>
                        {search
                          ? `No certificates found for "${search}"`
                          : "No certificates available."}
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