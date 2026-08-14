import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import formValidator from "../../FormValidators/formValidator";
import { createPortfolio, getPortfolio } from "../../Redux/ActionCreators/PortfolioActionCreators";

const checklist = [
  { dot: "bg-primary", title: "Project Name",    body: "Use a unique, descriptive project title."                   },
  { dot: "bg-success", title: "Upload Images",   body: "Add up to 5 screenshots — first image is the cover."       },
  { dot: "bg-warning", title: "Add Links",       body: "Live URL and GitHub repo help showcase your work."          },
];

export default function AdminCreatePortfolio() {
  const [data, setData] = useState({
    name: "", shortDescription: "", longDescription: "",
    category: "", tech: "", liveUrl: "", githubRepo: "", active: true,
  });
  const [error, setError] = useState({
    name:             "Name Field is Mandatory",
    pic:             "At least one image is required",
    shortDescription: "Short Description Field is Mandatory",
    longDescription:  "Long Description Field is Mandatory",
    category:         "Category Field is Mandatory",
    tech:             "Tech Field is Mandatory",
  });

  // ✅ Multiple images: store File objects + preview URLs
  const [picFiles, setPicFiles]     = useState([]);   // File[]
  const [previews, setPreviews]     = useState([]);   // string[] (object URLs)
  const [show, setShow]             = useState(false);
  const navigate                    = useNavigate();
  const PortfolioStateData          = useSelector((state) => state.PortfolioStateData);
  const dispatch                    = useDispatch();

  // ── Handlers ───────────────────────────────────────────────────────────────

  function getInputData(e) {
    const name = e.target.name;
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
    const remaining = MAX - picFiles.length;
    if (remaining <= 0) {
      alert(`You can upload a maximum of ${MAX} images.`);
      e.target.value = "";
      return;
    }

    // Validate each file (max 2 MB, image types)
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    const validFiles = [];
    for (const file of files.slice(0, remaining)) {
      if (!allowed.includes(file.type)) { alert(`${file.name}: unsupported format.`); continue; }
      if (file.size > 2 * 1024 * 1024)  { alert(`${file.name}: exceeds 2 MB limit.`); continue; }
      validFiles.push(file);
    }
    if (!validFiles.length) { e.target.value = ""; return; }

    const newPreviews = validFiles.map((f) => URL.createObjectURL(f));
    setPicFiles((old) => [...old, ...validFiles]);
    setPreviews((old) => [...old, ...newPreviews]);
    setError((old) => ({ ...old, pic: "" }));
    e.target.value = "";
  }

  function removeImage(index) {
    URL.revokeObjectURL(previews[index]);
    setPicFiles((old) => old.filter((_, i) => i !== index));
    setPreviews((old) => {
      const next = old.filter((_, i) => i !== index);
      if (next.length === 0) setError((e) => ({ ...e, pic: "At least one image is required" }));
      return next;
    });
  }

  function postSubmit(e) {
    e.preventDefault();
    const errorItem = Object.values(error).find((x) => x !== "");
    if (errorItem) { setShow(true); return; }

    const duplicate = PortfolioStateData.find(
      (x) => x.name.toLowerCase() === data.name.toLowerCase()
    );
    if (duplicate) {
      setShow(true);
      setError((old) => ({ ...old, name: "Portfolio Already Exists" }));
      return;
    }

    const formData = new FormData();
    formData.append("name",             data.name);
    formData.append("shortDescription", data.shortDescription);
    formData.append("longDescription",  data.longDescription);
    formData.append("category",         data.category);
    formData.append("tech",             data.tech);
    formData.append("liveUrl",          data.liveUrl);
    formData.append("githubRepo",       data.githubRepo);
    formData.append("active",           data.active);
    // ✅ Append every file under the same field name "pic"
    picFiles.forEach((file) => formData.append("pic", file));

    dispatch(createPortfolio(formData));
    navigate("/portfolio");
  }

  useEffect(() => {
    dispatch(getPortfolio());
  }, [PortfolioStateData.length]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <main className="dashboard-content">
      <div className="container-fluid px-3 px-lg-4 py-4">

        {/* Page Heading */}
        <div className="page-heading">
          <div className="page-heading-copy">
            <span className="page-icon">
              <i className="bi bi-plus-circle" aria-hidden="true"></i>
            </span>
            <div>
              <p className="eyebrow mb-1">Management</p>
              <h1 className="h3 mb-1">Add Portfolio</h1>
              <p className="text-muted mb-0">Create a new portfolio project entry.</p>
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
                    <i className="bi bi-collection" aria-hidden="true"></i>
                    <span>Project Information</span>
                  </h2>
                  <p className="text-muted mb-0">Fill in the details to create a new portfolio item.</p>
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

                {/* ✅ Multiple Image Upload */}
                <div className="col-12">
                  <label className="form-label">
                    Project Images
                    <span className="text-muted fw-normal ms-1">
                      ({picFiles.length}/5 — first image is the cover)
                    </span>
                  </label>

                  {/* Dropzone / file input */}
                  {picFiles.length < 5 && (
                    <label
                      htmlFor="pic"
                      className="d-flex flex-column align-items-center justify-content-center gap-2 rounded border border-dashed p-4"
                      style={{ cursor: "pointer", borderStyle: "dashed", borderColor: "#adb5bd", background: "#f8f9fa" }}
                    >
                      <i className="bi bi-cloud-upload fs-3 text-muted"></i>
                      <span className="text-muted small">Click to add images (JPEG, PNG, WebP · max 2 MB each)</span>
                      <input
                        id="pic" type="file" name="pic"
                        className="d-none" multiple accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                  {show && error.pic && <div className="text-danger small mt-1">{error.pic}</div>}

                  {/* Preview grid */}
                  {previews.length > 0 && (
                    <div className="d-flex flex-wrap gap-2 mt-3">
                      {previews.map((src, idx) => (
                        <div
                          key={idx}
                          className="position-relative"
                          style={{ width: 96, height: 72 }}
                        >
                          <img
                            src={src} alt={`preview-${idx}`}
                            className="rounded border w-100 h-100"
                            style={{ objectFit: "cover" }}
                          />
                          {/* Cover badge on first image */}
                          {idx === 0 && (
                            <span
                              className="position-absolute bottom-0 start-0 badge text-bg-primary"
                              style={{ fontSize: "0.6rem", borderRadius: "0 4px 0 4px" }}
                            >
                              Cover
                            </span>
                          )}
                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="position-absolute top-0 end-0 btn btn-sm btn-danger p-0 d-flex align-items-center justify-content-center"
                            style={{ width: 20, height: 20, borderRadius: "0 4px 0 4px" }}
                            title="Remove image"
                          >
                            <i className="bi bi-x" style={{ fontSize: "0.75rem" }}></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
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
                  <i className="bi bi-check-circle" aria-hidden="true"></i> Create Portfolio
                </button>
              </div>
            </div>
          </div>

          {/* ── Checklist ── */}
          <div className="col-12 col-xl-4">
            <div className="panel h-100">
              <h2 className="h5 mb-3 section-title">
                <i className="bi bi-list-check" aria-hidden="true"></i>
                <span>Setup Checklist</span>
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