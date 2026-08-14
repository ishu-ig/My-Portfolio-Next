import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getPortfolio,
  deletePortfolio,
  updatePortfolio,
} from "../../Redux/ActionCreators/PortfolioActionCreators";

export default function AdminPortfolio() {
  const PortfolioStateData = useSelector((state) => state.PortfolioStateData);
  const dispatch = useDispatch();
  const [flag, setFlag]   = useState(false);
  const [search, setSearch] = useState("");

  const totalCount    = PortfolioStateData?.length ?? 0;
  const activeCount   = PortfolioStateData?.filter((i) => i.active).length ?? 0;
  const inactiveCount = totalCount - activeCount;

  function deleteRecord(_id) {
    if (window.confirm("Are you sure you want to delete this item?")) {
      dispatch(deletePortfolio({ _id }));
      setFlag((f) => !f);
    }
  }

  function updateRecord(_id) {
    const item = PortfolioStateData.find((p) => p._id === _id);
    if (!item) return;
    dispatch(updatePortfolio({ ...item, active: !item.active }));
    setFlag((f) => !f);
  }

  useEffect(() => { dispatch(getPortfolio()); }, [flag]);

  const filteredData = PortfolioStateData?.filter(
    (item) =>
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.category?.toLowerCase().includes(search.toLowerCase()) ||
      item.tech?.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  // ✅ Helper: get the cover (first) image, fall back gracefully
  function coverPic(item) {
    if (Array.isArray(item.pic) && item.pic.length > 0) return item.pic[0];
    if (item.pic) return item.pic; // backwards compat with old single-pic data
    return "";
  }

  return (
    <>
      <style>{`
        .act-strip {
          display: inline-flex; align-items: center; gap: 2px;
          background: #f8f9fa; border: 1px solid #dee2e6;
          border-radius: 8px; padding: 3px;
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
        .act-btn-edit:hover  { background: #cfe2ff; color: #0d6efd; }
        .act-btn-on:hover    { background: #d1e7dd; color: #198754; }
        .act-btn-off:hover   { background: #fff3cd; color: #856404; }
        .act-btn-del:hover   { background: #f8d7da; color: #dc3545; }
        .act-sep { width: 1px; height: 16px; background: #dee2e6; flex-shrink: 0; }
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
        .portfolio-thumb {
          width: 64px; height: 42px; object-fit: cover;
          border-radius: 6px; border: 1px solid #dee2e6;
        }
        .pic-count {
          font-size: 0.65rem; background: #0d6efd; color: #fff;
          border-radius: 999px; padding: 1px 5px;
          position: absolute; bottom: -6px; right: -6px;
        }
      `}</style>

      <main className="dashboard-content">
        <div className="container-fluid px-3 px-lg-4 py-4">

          {/* Page Heading */}
          <div className="page-heading">
            <div className="page-heading-copy">
              <span className="page-icon">
                <i className="bi bi-collection" aria-hidden="true"></i>
              </span>
              <div>
                <p className="eyebrow mb-1">Management</p>
                <h1 className="h3 mb-1">Portfolio</h1>
                <p className="text-muted mb-0">Review and manage portfolio projects.</p>
              </div>
            </div>
            <div className="heading-actions">
              <Link className="btn btn-primary btn-sm" to="/portfolio/create">
                <i className="bi bi-plus-circle" aria-hidden="true"></i> Add Portfolio
              </Link>
            </div>
          </div>

          {/* Metric Cards */}
          <section className="row g-3 mt-2 mb-1" aria-label="Portfolio summary">
            <div className="col-12 col-sm-6 col-xl-4">
              <article className="metric-card text-white">
                <div className="metric-top">
                  <span className="metric-label">Total</span>
                  <span className="metric-icon"><i className="bi bi-collection-fill"></i></span>
                </div>
                <div className="metric-value">{totalCount}</div>
                <div className="metric-meta"><span>all</span><span>projects</span></div>
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

          {/* Table Panel */}
          <section className="panel mt-3">
            <div className="panel-header">
              <div>
                <h2 className="h5 mb-1 section-title">
                  <i className="bi bi-table" aria-hidden="true"></i>
                  <span>Portfolio List</span>
                </h2>
                <p className="text-muted mb-0">Search, review, and manage projects.</p>
              </div>
              <div className="ms-auto" style={{ minWidth: 220 }}>
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-white">
                    <i className="bi bi-search text-muted"></i>
                  </span>
                  <input type="text" className="form-control border-start-0"
                    placeholder="Search portfolio..." value={search}
                    onChange={(e) => setSearch(e.target.value)} />
                  {search && (
                    <button className="btn btn-outline-secondary" type="button"
                      onClick={() => setSearch("")} title="Clear search">
                      <i className="bi bi-x"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table align-middle mb-0" id="portfolioTable">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Cover</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Tech</th>
                    <th>Links</th>
                    <th>Status</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item, index) => {
                      const cover = coverPic(item);
                      // ✅ Count how many images this project has
                      const picCount = Array.isArray(item.pic) ? item.pic.length : (item.pic ? 1 : 0);
                      return (
                        <tr key={item._id}>
                          <td>{index + 1}</td>
                          <td>
                            <div className="position-relative d-inline-block">
                              <Link to={cover} target="_blank" rel="noreferrer">
                                <img src={cover} className="portfolio-thumb" alt={item.name} />
                              </Link>
                              {/* ✅ Show image count badge */}
                              {picCount > 1 && (
                                <span className="pic-count">+{picCount}</span>
                              )}
                            </div>
                          </td>
                          <td className="fw-semibold">{item.name}</td>
                          <td>{item.category}</td>
                          <td>{item.tech}</td>
                          <td>
                            <div className="d-flex gap-1">
                              {item.liveUrl ? (
                                <a href={item.liveUrl} target="_blank" rel="noreferrer"
                                  className="badge text-bg-success text-decoration-none">Live</a>
                              ) : (
                                <span className="text-muted small">—</span>
                              )}
                              {item.githubRepo && (
                                <a href={item.githubRepo} target="_blank" rel="noreferrer"
                                  className="badge text-bg-dark text-decoration-none">Code</a>
                              )}
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${item.active ? "text-bg-success" : "text-bg-secondary"}`}>
                              {item.active ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="text-end">
                            <div className="act-strip">
                              <Link className="act-btn act-btn-edit"
                                to={`/portfolio/update/${item._id}`} data-tip="Edit">
                                <i className="bi bi-pencil-square"></i>
                              </Link>
                              <span className="act-sep"></span>
                              <button className={`act-btn ${item.active ? "act-btn-off" : "act-btn-on"}`}
                                onClick={() => updateRecord(item._id)}
                                data-tip={item.active ? "Deactivate" : "Activate"}>
                                <i className={`bi ${item.active ? "bi-pause-fill" : "bi-play-fill"}`}></i>
                              </button>
                              {localStorage.getItem("role") === "Super Admin" && (
                                <>
                                  <span className="act-sep"></span>
                                  <button className="act-btn act-btn-del"
                                    onClick={() => deleteRecord(item._id)} data-tip="Delete">
                                    <i className="bi bi-trash3-fill"></i>
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center text-muted py-4">
                        {search ? `No projects found for "${search}"` : "No portfolio items available."}
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