import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import formValidator from "../../FormValidators/formValidator";
import { updatePortfolio, getPortfolio } from "../../Redux/ActionCreators/PortfolioActionCreators";

const checklist = [
  { dot: "bg-success", title: "Review Details",  body: "Check name, description and category are current."  },
  { dot: "bg-primary", title: "Update Images",   body: "Remove old screenshots and add new ones as needed." },
  { dot: "bg-warning", title: "Save Changes",    body: "Changes take effect immediately on the site."        },
];

export default function AdminUpdatePortfolio() {
  const { _id }          = useParams();
  const navigate         = useNavigate();
  const PortfolioStateData = useSelector((state) => state.PortfolioStateData);
  const dispatch         = useDispatch();

  const [data, setData] = useState({
    name: "", shortDescription: "", longDescription: "",
    category: "", tech: "", liveUrl: "", githubRepo: "", active: true,
  });
  const [error, setError] = useState({
    name: "", pic: "", shortDescription: "", longDescription: "", category: "", tech: "",
  });

  // ✅ Existing images from DB (URLs to keep)
  const [keepPic, setKeepPic]   = useState([]);   // string[] — existing URLs still kept
  // ✅ Newly selected files
  const [newFiles, setNewFiles]   = useState([]);   // File[]
  const [newPreviews, setNewPreviews] = useState([]); // object URLs for new files

  const [show, setShow] = useState(false);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const totalCount = keepPic.length + newFiles.length;

  function getInputData(e) {
    const name  = e.target.name;
    const value = e.target.value;
    if (name !== "active" && name !== "liveUrl" && name !== "githubRepo") {
      setError((old) => ({ ...old, [name]: formValidator(e) }));
    }
    setData((old) => ({
      ...old,
      [name]: name === "active" ? (value === "1") : value,
    }));
  }

  function handleImageChange(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const MAX = 5;
    const remaining = MAX - totalCount;
    if (remaining <= 0) { alert(`Maximum ${MAX} images allowed.`); e.target.value = ""; return; }

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    const validFiles = [];
    for (const file of files.slice(0, remaining)) {
      if (!allowed.includes(file.type)) { alert(`${file.name}: unsupported format.`); continue; }
      if (file.size > 2 * 1024 * 1024)  { alert(`${file.name}: exceeds 2 MB limit.`); continue; }
      validFiles.push(file);
    }
    if (!validFiles.length) { e.target.value = ""; return; }

    setNewFiles((old) => [...old, ...validFiles]);
    setNewPreviews((old) => [...old, ...validFiles.map((f) => URL.createObjectURL(f))]);
    setError((old) => ({ ...old, pic: "" }));
    e.target.value = "";
  }

  // Remove an existing (DB) image
  function removeKeepPic(index) {
    setKeepPic((old) => {
      const next = old.filter((_, i) => i !== index);
      if (next.length === 0 && newFiles.length === 0)
        setError((e) => ({ ...e, pic: "At least one image is required" }));
      return next;
    });
  }

  // Remove a newly added (not yet uploaded) image
  function removeNewPic(index) {
    URL.revokeObjectURL(newPreviews[index]);
    setNewFiles((old) => old.filter((_, i) => i !== index));
    setNewPreviews((old) => {
      const next = old.filter((_, i) => i !== index);
      if (keepPic.length === 0 && next.length === 0)
        setError((e) => ({ ...e, pic: "At least one image is required" }));
      return next;
    });
  }

  function postSubmit(e) {
    e.preventDefault();

    // Validate at least one image
    if (totalCount === 0) {
      setError((old) => ({ ...old, pic: "At least one image is required" }));
      setShow(true);
      return;
    }

    const errorItem = Object.values(error).find((x) => x !== "");
    if (errorItem) { setShow(true); return; }

    const duplicate = PortfolioStateData.find(
      (x) => x._id !== _id && x.name.toLowerCase() === data.name.toLowerCase()
    );
    if (duplicate) {
      setShow(true);
      setError((old) => ({ ...old, name: "Portfolio Already Exists" }));
      return;
    }

    const formData = new FormData();
    formData.append("_id",             data._id ?? _id);
    formData.append("name",            data.name);
    formData.append("shortDescription",data.shortDescription);
    formData.append("longDescription", data.longDescription);
    formData.append("category",        data.category);
    formData.append("tech",            data.tech);
    formData.append("liveUrl",         data.liveUrl);
    formData.append("githubRepo",      data.githubRepo);
    formData.append("active",          data.active);

    // ✅ Send existing URLs to keep (backend will delete the rest)
    keepPic.forEach((url) => formData.append("keepPic", url));

    // ✅ Send new files
    newFiles.forEach((file) => formData.append("pic", file));

    dispatch(updatePortfolio(formData));
    navigate("/portfolio");
  }

  useEffect(() => {
    dispatch(getPortfolio());
    if (PortfolioStateData.length) {
      const item = PortfolioStateData.find((x) => x._id === _id);
      if (item) {
        setData({ ...item });
        // ✅ Populate existing images
        setKeepPic(item.pic ?? (item.pic ? [item.pic] : []));
      }
    }
  }, [PortfolioStateData.length]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <main className="dashboard-content">
      <div className="container-fluid px-3 px-lg-4 py-4">

        {/* Page Heading */}
        <div className="page-heading">
          <div className="page-heading-copy">
            <span className="page-icon">
              <i className="bi bi-pencil-square" aria-hidden="true"></i>
            </span>
            <div>
              <p className="eyebrow mb-1">Management</p>
              <h1 className="h3 mb-1">Update Portfolio</h1>
              <p className="text-muted mb-0">Edit the project details below.</p>
            </div>
          </div>
          <div className="heading-actions">
            <Link className="btn btn-outline-secondary btn-sm" to="/portfolio">
              <i className="bi bi-arrow-left" aria-hidden="true"></i> Back to Portfolio
            </Link>
          </div>
        </div>

        {/* Error Alert */}
        {show && (
          <div className="alert alert-danger alert-dismissible" role="alert">
            {Object.values(error).find((x) => x !== "")}
            <button type="button" className="btn-close" onClick={() => setShow(false)} aria-label="Close" />
          </div>
        )}

        <section className="row g-3">

          {/* ── Form Panel ── */}
          <div className="col-12 col-xl-8">
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2 className="h5 mb-1 section-title">
                    <i className="bi bi-pencil-square" aria-hidden="true"></i>
                    <span>Project Information</span>
                  </h2>
                  <p className="text-muted mb-0">Update the details for this portfolio item.</p>
                </div>
              </div>

              <div className="row g-3">

                {/* Name */}
                <div className="col-12">
                  <label className="form-label" htmlFor="name">Project Name</label>
                  <input id="name" type="text" name="name" className="form-control"
                    placeholder="Enter project name" value={data.name} onChange={getInputData} />
                  {show && error.name && <div className="text-danger small mt-1">{error.name}</div>}
                </div>

                {/* Short Description */}
                <div className="col-12">
                  <label className="form-label" htmlFor="shortDescription">Short Description</label>
                  <input id="shortDescription" type="text" name="shortDescription" className="form-control"
                    placeholder="Enter short description" value={data.shortDescription} onChange={getInputData} />
                  {show && error.shortDescription && <div className="text-danger small mt-1">{error.shortDescription}</div>}
                </div>

                {/* Long Description */}
                <div className="col-12">
                  <label className="form-label" htmlFor="longDescription">Long Description</label>
                  <textarea id="longDescription" name="longDescription" rows={4} className="form-control"
                    placeholder="Enter detailed description" value={data.longDescription} onChange={getInputData} />
                  {show && error.longDescription && <div className="text-danger small mt-1">{error.longDescription}</div>}
                </div>

                {/* Category & Tech */}
                <div className="col-md-6">
                  <label className="form-label" htmlFor="category">Category</label>
                  <input id="category" type="text" name="category" className="form-control"
                    placeholder="e.g. Web App, Mobile" value={data.category} onChange={getInputData} />
                  {show && error.category && <div className="text-danger small mt-1">{error.category}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="tech">Tech Stack</label>
                  <input id="tech" type="text" name="tech" className="form-control"
                    placeholder="e.g. React, Node.js" value={data.tech} onChange={getInputData} />
                  {show && error.tech && <div className="text-danger small mt-1">{error.tech}</div>}
                </div>

                {/* Live URL & GitHub */}
                <div className="col-md-6">
                  <label className="form-label" htmlFor="liveUrl">
                    Live URL <span className="text-muted fw-normal">(optional)</span>
                  </label>
                  <input id="liveUrl" type="text" name="liveUrl" className="form-control"
                    placeholder="https://yourproject.com" value={data.liveUrl} onChange={getInputData} />
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="githubRepo">
                    GitHub Repo <span className="text-muted fw-normal">(optional)</span>
                  </label>
                  <input id="githubRepo" type="text" name="githubRepo" className="form-control"
                    placeholder="https://github.com/user/repo" value={data.githubRepo} onChange={getInputData} />
                </div>

                {/* ✅ Image Management */}
                <div className="col-12">
                  <label className="form-label">
                    Project Images
                    <span className="text-muted fw-normal ms-1">({totalCount}/5 — first image is the cover)</span>
                  </label>

                  {/* Existing images */}
                  {keepPic.length > 0 && (
                    <div className="mb-2">
                      <p className="small text-muted mb-1">Current images — click ✕ to remove:</p>
                      <div className="d-flex flex-wrap gap-2">
                        {keepPic.map((src, idx) => (
                          <div key={src} className="position-relative" style={{ width: 96, height: 72 }}>
                            <img src={src} alt={`existing-${idx}`} className="rounded border w-100 h-100"
                              style={{ objectFit: "cover" }} />
                            {idx === 0 && (
                              <span className="position-absolute bottom-0 start-0 badge text-bg-primary"
                                style={{ fontSize: "0.6rem", borderRadius: "0 4px 0 4px" }}>
                                Cover
                              </span>
                            )}
                            <button type="button" onClick={() => removeKeepPic(idx)}
                              className="position-absolute top-0 end-0 btn btn-sm btn-danger p-0 d-flex align-items-center justify-content-center"
                              style={{ width: 20, height: 20, borderRadius: "0 4px 0 4px" }} title="Remove">
                              <i className="bi bi-x" style={{ fontSize: "0.75rem" }}></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New image previews */}
                  {newPreviews.length > 0 && (
                    <div className="mb-2">
                      <p className="small text-muted mb-1">New images to upload:</p>
                      <div className="d-flex flex-wrap gap-2">
                        {newPreviews.map((src, idx) => (
                          <div key={idx} className="position-relative" style={{ width: 96, height: 72 }}>
                            <img src={src} alt={`new-${idx}`} className="rounded border border-success w-100 h-100"
                              style={{ objectFit: "cover" }} />
                            <button type="button" onClick={() => removeNewPic(idx)}
                              className="position-absolute top-0 end-0 btn btn-sm btn-danger p-0 d-flex align-items-center justify-content-center"
                              style={{ width: 20, height: 20, borderRadius: "0 4px 0 4px" }} title="Remove">
                              <i className="bi bi-x" style={{ fontSize: "0.75rem" }}></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add more images */}
                  {totalCount < 5 && (
                    <label htmlFor="pic"
                      className="d-flex flex-column align-items-center justify-content-center gap-2 rounded border p-3"
                      style={{ cursor: "pointer", borderStyle: "dashed", borderColor: "#adb5bd", background: "#f8f9fa" }}>
                      <i className="bi bi-plus-circle fs-4 text-muted"></i>
                      <span className="text-muted small">Add more images (JPEG, PNG, WebP · max 2 MB each)</span>
                      <input id="pic" type="file" name="pic" className="d-none" multiple
                        accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} />
                    </label>
                  )}
                  {show && error.pic && <div className="text-danger small mt-1">{error.pic}</div>}
                </div>

                {/* Status */}
                <div className="col-md-6">
                  <label className="form-label" htmlFor="active">Status</label>
                  <select id="active" name="active" className="form-select"
                    value={data.active ? "1" : "0"} onChange={getInputData}>
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>

              </div>

              {/* Actions */}
              <div className="d-flex flex-wrap justify-content-end gap-2 mt-4">
                <Link className="btn btn-outline-secondary" to="/portfolio">Cancel</Link>
                <button className="btn btn-primary" type="button" onClick={postSubmit}>
                  <i className="bi bi-check-circle" aria-hidden="true"></i> Update Portfolio
                </button>
              </div>
            </div>
          </div>

          {/* ── Checklist ── */}
          <div className="col-12 col-xl-4">
            <div className="panel h-100">
              <h2 className="h5 mb-3 section-title">
                <i className="bi bi-list-check" aria-hidden="true"></i>
                <span>Update Checklist</span>
              </h2>
              <div className="activity-list">
                {checklist.map(({ dot, title, body }) => (
                  <div key={title} className="activity-item">
                    <span className={`activity-dot ${dot}`}></span>
                    <div>
                      <p className="mb-1 fw-semibold">{title}</p>
                      <p className="text-muted small mb-0">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </section>
      </div>
    </main>
  );
}