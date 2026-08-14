import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAbout, deleteAbout } from "../../Redux/ActionCreators/AboutActionCreators";

function getInitials(name = "") {
  return name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
}

export default function AdminAbout() {
  const AboutStateData = useSelector((state) => state.AboutStateData);
  const dispatch = useDispatch();

  const about = AboutStateData?.[0] ?? null;
  const hasRecord = Boolean(about);

  function deleteRecord(_id) {
    if (window.confirm("Are you sure you want to delete this About profile?")) {
      dispatch(deleteAbout({ _id }));
    }
  }

  useEffect(() => { dispatch(getAbout()); }, []);

  return (
    <>
      <style>{`
        .aa-eyebrow { font-size:11px; font-weight:500; color:var(--admin-muted); letter-spacing:.08em; text-transform:uppercase; margin:0 0 2px; }
        .aa-card { background:var(--admin-surface); border:1px solid var(--admin-border); border-radius:12px; overflow:hidden; margin-top:1rem; box-shadow:var(--admin-shadow-sm); }
        .aa-banner { height:6px; background:linear-gradient(90deg,#7F77DD,#1D9E75); }
        .aa-body { padding:1.5rem; }
        .aa-avatar { width:88px; height:88px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:28px; font-weight:500; color:#534AB7; flex-shrink:0; border:2px solid var(--admin-border); background:var(--admin-surface-soft); }
        .aa-avatar img { width:100%; height:100%; border-radius:50%; object-fit:cover; }
        .aa-name    { font-size:18px; font-weight:500; margin:0 0 2px; color:var(--admin-text); }
        .aa-role    { font-size:13px; color:#534AB7; font-weight:500; margin:0 0 4px; }
        .aa-tagline { font-size:13px; color:var(--admin-muted); margin:0 0 10px; }
        .aa-desc    { font-size:13px; color:var(--admin-text); line-height:1.6; margin:0; }
        .aa-btn { display:inline-flex; align-items:center; gap:6px; padding:6px 14px; border-radius:8px; border:1px solid var(--admin-border); background:transparent; font-size:13px; cursor:pointer; color:var(--admin-text); transition:background .15s; }
        .aa-btn:hover { background:var(--admin-surface-soft); }
        .aa-btn-danger { color:var(--admin-danger); border-color:var(--admin-danger); }
        .aa-btn-danger:hover { background:rgba(220,53,69,0.08); }
        .aa-divider { border:none; border-top:1px solid var(--admin-border); margin:1.25rem 0; }
        .aa-longdesc { font-size:13px; color:var(--admin-muted); line-height:1.7; margin:0 0 1.25rem; }
        .aa-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:10px; margin-bottom:1.25rem; }
        .aa-detail { border-radius:8px; padding:10px 12px; display:flex; align-items:center; gap:10px; background:var(--admin-surface-soft); border:1px solid var(--admin-border); }
        .aa-icon { width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:15px; flex-shrink:0; }
        .aa-dlabel { font-size:11px; color:var(--admin-muted); font-weight:500; letter-spacing:.04em; text-transform:uppercase; }
        .aa-dvalue { font-size:13px; font-weight:500; color:var(--admin-text); word-break:break-all; }
        .aa-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
        .aa-stat { border-radius:8px; padding:14px 12px; text-align:center; background:var(--admin-surface-soft); border:1px solid var(--admin-border); }
        .aa-stat-icon { font-size:18px; display:block; margin-bottom:6px; }
        .aa-stat-num  { font-size:22px; font-weight:500; color:var(--admin-text); margin:0; }
        .aa-stat-lbl  { font-size:11px; color:var(--admin-muted); margin:3px 0 0; }
        .aa-resume-link { display:inline-flex; align-items:center; gap:5px; font-size:13px; color:var(--admin-primary); text-decoration:none; }
        .aa-resume-link:hover { text-decoration:underline; }
        .aa-social-link { display:inline-flex; align-items:center; gap:5px; font-size:13px; color:var(--admin-primary); text-decoration:none; word-break:break-all; }
        .aa-social-link:hover { text-decoration:underline; }
        .aa-empty { border:1px solid var(--admin-border); border-radius:12px; padding:3rem 1.5rem; text-align:center; margin-top:1rem; background:var(--admin-surface); }
      `}</style>

      <main className="dashboard-content">
        <div className="container-fluid px-3 px-lg-4 py-4">

          <div className="page-heading">
            <div className="page-heading-copy">
              <span className="page-icon"><i className="bi bi-person-lines-fill" aria-hidden="true"></i></span>
              <div>
                <p className="aa-eyebrow">Management</p>
                <h1 className="h3 mb-1">About</h1>
                <p className="text-muted mb-0">Your public profile shown on the site.</p>
              </div>
            </div>
            {!hasRecord && (
              <div className="heading-actions">
                <Link className="btn btn-primary btn-sm" to="/about/create">
                  <i className="bi bi-plus-circle" aria-hidden="true"></i> Create Profile
                </Link>
              </div>
            )}
          </div>

          {!hasRecord && (
            <div className="aa-empty">
              <i className="bi bi-person-circle text-muted" style={{ fontSize: "3rem" }}></i>
              <p className="mt-3 mb-1 fw-semibold">No profile created yet.</p>
              <p className="text-muted small mb-3">Click "Create Profile" to add your About information.</p>
              <Link className="btn btn-primary btn-sm" to="/about/create">
                <i className="bi bi-plus-circle me-1"></i> Create Profile
              </Link>
            </div>
          )}

          {hasRecord && (
            <div className="aa-card">
              <div className="aa-banner"></div>
              <div className="aa-body">

                {/* Top row */}
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-3">
                  <div className="d-flex gap-3 align-items-start flex-wrap" style={{ flex: 1, minWidth: 0 }}>
                    <div className="aa-avatar">
                      {about.pic ? <img src={about.pic} alt={about.name} /> : getInitials(about.name)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className="aa-name">{about.name}</p>
                      <p className="aa-role">{about.heading}</p>
                      <p className="aa-tagline">{about.subtitle}</p>
                      <p className="aa-desc">{about.shortDescription}</p>
                    </div>
                  </div>
                  <div className="d-flex gap-2 flex-shrink-0">
                    <Link className="aa-btn" to={`/about/update/${about._id}`}>
                      <i className="bi bi-pencil-square" style={{ fontSize: 13 }}></i> Edit
                    </Link>
                    {localStorage.getItem("role") === "Super Admin" && (
                      <button className="aa-btn aa-btn-danger" onClick={() => deleteRecord(about._id)}>
                        <i className="bi bi-trash3-fill" style={{ fontSize: 13 }}></i> Delete
                      </button>
                    )}
                  </div>
                </div>

                {about.longDescription && <p className="aa-longdesc">{about.longDescription}</p>}

                <hr className="aa-divider" />

                {/* Detail grid */}
                <div className="aa-grid">
                  <div className="aa-detail">
                    <div className="aa-icon" style={{ background: "#E6F1FB", color: "#185FA5" }}>
                      <i className="bi bi-telephone-fill"></i>
                    </div>
                    <div><div className="aa-dlabel">Phone</div><div className="aa-dvalue">{about.phone}</div></div>
                  </div>

                  <div className="aa-detail">
                    <div className="aa-icon" style={{ background: "#EAF3DE", color: "#3B6D11" }}>
                      <i className="bi bi-envelope-fill"></i>
                    </div>
                    <div><div className="aa-dlabel">Email</div><div className="aa-dvalue">{about.email}</div></div>
                  </div>

                  {about.occupation && (
                    <div className="aa-detail">
                      <div className="aa-icon" style={{ background: "#E1F5EE", color: "#0F6E56" }}>
                        <i className="bi bi-briefcase-fill"></i>
                      </div>
                      <div><div className="aa-dlabel">Occupation</div><div className="aa-dvalue">{about.occupation}</div></div>
                    </div>
                  )}

                  {about.nationality && (
                    <div className="aa-detail">
                      <div className="aa-icon" style={{ background: "#FAEEDA", color: "#854F0B" }}>
                        <i className="bi bi-geo-alt-fill"></i>
                      </div>
                      <div><div className="aa-dlabel">Nationality</div><div className="aa-dvalue">{about.nationality}</div></div>
                    </div>
                  )}

                  {about.age > 0 && (
                    <div className="aa-detail">
                      <div className="aa-icon" style={{ background: "#F1EFE8", color: "#5F5E5A" }}>
                        <i className="bi bi-calendar-fill"></i>
                      </div>
                      <div><div className="aa-dlabel">Age</div><div className="aa-dvalue">{about.age} yrs</div></div>
                    </div>
                  )}

                  {about.resume && (
                    <div className="aa-detail">
                      <div className="aa-icon" style={{ background: "#FCEBEB", color: "#A32D2D" }}>
                        <i className="bi bi-file-earmark-pdf-fill"></i>
                      </div>
                      <div>
                        <div className="aa-dlabel">Resume</div>
                        <div className="aa-dvalue">
                          <a href={about.resume} target="_blank" rel="noreferrer" className="aa-resume-link">
                            View PDF <i className="bi bi-box-arrow-up-right" style={{ fontSize: 11 }}></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* FIX: social links display */}
                  {about.gitLink && (
                    <div className="aa-detail">
                      <div className="aa-icon" style={{ background: "#F1EFE8", color: "#2C2C2A" }}>
                        <i className="bi bi-github"></i>
                      </div>
                      <div>
                        <div className="aa-dlabel">GitHub</div>
                        <div className="aa-dvalue">
                          <a href={about.gitLink} target="_blank" rel="noreferrer" className="aa-social-link">
                            Visit <i className="bi bi-box-arrow-up-right" style={{ fontSize: 11 }}></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {about.linkidinLink && (
                    <div className="aa-detail">
                      <div className="aa-icon" style={{ background: "#E6F1FB", color: "#185FA5" }}>
                        <i className="bi bi-linkedin"></i>
                      </div>
                      <div>
                        <div className="aa-dlabel">LinkedIn</div>
                        <div className="aa-dvalue">
                          <a href={about.linkidinLink} target="_blank" rel="noreferrer" className="aa-social-link">
                            Visit <i className="bi bi-box-arrow-up-right" style={{ fontSize: 11 }}></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {about.instaLink && (
                    <div className="aa-detail">
                      <div className="aa-icon" style={{ background: "#FAECE7", color: "#993C1D" }}>
                        <i className="bi bi-instagram"></i>
                      </div>
                      <div>
                        <div className="aa-dlabel">Instagram</div>
                        <div className="aa-dvalue">
                          <a href={about.instaLink} target="_blank" rel="noreferrer" className="aa-social-link">
                            Visit <i className="bi bi-box-arrow-up-right" style={{ fontSize: 11 }}></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <hr className="aa-divider" />

                {/* Stats */}
                <div className="aa-stats">
                  <div className="aa-stat">
                    <i className="bi bi-briefcase aa-stat-icon" style={{ color: "#534AB7" }} aria-hidden="true"></i>
                    <p className="aa-stat-num">{about.yearExperience ?? 0}</p>
                    <p className="aa-stat-lbl">Years experience</p>
                  </div>
                  <div className="aa-stat">
                    <i className="bi bi-check2-all aa-stat-icon" style={{ color: "#3B6D11" }} aria-hidden="true"></i>
                    <p className="aa-stat-num">{about.projectsCompleted ?? 0}</p>
                    <p className="aa-stat-lbl">Projects completed</p>
                  </div>
                  <div className="aa-stat">
                    <i className="bi bi-code-slash aa-stat-icon" style={{ color: "#854F0B" }} aria-hidden="true"></i>
                    <p className="aa-stat-num">{about.programmingQuestions ?? 0}</p>
                    <p className="aa-stat-lbl">Questions solved</p>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </main>
    </>
  );
}