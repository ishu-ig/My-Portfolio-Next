import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createNote } from "../../Redux/ActionCreators/NoteActionCreators";

const SUBJECTS = [
  "Web Development",
  "React & Frontend",
  "Node & Backend",
  "Data Structures & Algorithms",
  "Database Systems",
  "System Design",
  "Operating Systems",
  "DevOps & Cloud",
  "General",
];

const checklist = [
  { dot: "bg-danger", title: "Select PDF File", body: "Upload your study notes, cheatsheet, or reference PDF." },
  { dot: "bg-primary", title: "Add Subject & Title", body: "Use descriptive titles for easy searchability." },
  { dot: "bg-warning", title: "Pin & Organize", body: "Pin essential docs to keep them on top." },
];

export default function AdminCreateNote() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [data, setData] = useState({
    title: "",
    subject: "Web Development",
    description: "",
    tags: "",
    isPinned: false,
    active: true,
  });

  const [file, setFile] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [error, setError] = useState({});
  const [showError, setShowError] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error[name]) {
      setError((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf" && !selectedFile.name.endsWith(".pdf")) {
        setError((prev) => ({ ...prev, file: "Please select a valid PDF file" }));
        setFile(null);
        setFileInfo(null);
        return;
      }
      setFile(selectedFile);
      setFileInfo({
        name: selectedFile.name,
        size: (selectedFile.size / (1024 * 1024)).toFixed(2) + " MB",
      });
      setError((prev) => ({ ...prev, file: "" }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!data.title.trim()) errs.title = "Note Title is mandatory";
    if (!file) errs.file = "PDF file is mandatory";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setError(errs);
      setShowError(true);
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("subject", data.subject);
    formData.append("description", data.description);
    formData.append("tags", data.tags);
    formData.append("isPinned", data.isPinned);
    formData.append("active", data.active);
    formData.append("file", file);

    dispatch(createNote(formData));
    navigate("/note");
  };

  return (
    <main className="dashboard-content">
      <div className="container-fluid px-3 px-lg-4 py-4">
        {/* Page Heading */}
        <div className="page-heading d-flex justify-content-between align-items-center mb-4">
          <div className="page-heading-copy">
            <span className="page-icon">
              <i className="bi bi-cloud-arrow-up-fill text-danger" style={{ fontSize: "1.4rem" }}></i>
            </span>
            <div>
              <p className="eyebrow mb-0 text-muted small text-uppercase">Document Management</p>
              <h1 className="h3 mb-0 fw-bold">Upload PDF Note</h1>
              <p className="text-muted mb-0 small">
                Attach a PDF document, set subject classification, and organize your resource.
              </p>
            </div>
          </div>
          <div className="heading-actions">
            <Link className="btn btn-outline-secondary btn-sm" to="/note">
              <i className="bi bi-arrow-left me-1"></i> Back to Notes
            </Link>
          </div>
        </div>

        {showError && Object.values(error).some(Boolean) && (
          <div className="alert alert-danger alert-dismissible" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            Please fill in all mandatory fields before uploading.
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowError(false)}
            ></button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            {/* Main Form Fields */}
            <div className="col-12 col-xl-8">
              <div className="panel p-4 mb-4">
                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <i className="bi bi-file-earmark-pdf text-danger"></i> PDF Note Details
                </h5>

                {/* Title */}
                <div className="mb-3">
                  <label className="form-label fw-semibold small text-uppercase" htmlFor="title">
                    Note Title <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className={`form-control ${error.title ? "is-invalid" : ""}`}
                    placeholder="e.g. MERN Stack Complete Architecture Guide, DSA Cheatsheet..."
                    value={data.title}
                    onChange={handleInputChange}
                  />
                  {error.title && <div className="invalid-feedback">{error.title}</div>}
                </div>

                {/* PDF File Upload */}
                <div className="mb-4">
                  <label className="form-label fw-semibold small text-uppercase" htmlFor="file">
                    PDF Document File <span className="text-danger">*</span>
                  </label>

                  <div
                    className="p-4 rounded-3 text-center"
                    style={{
                      border: "2px dashed var(--border-color, #dee2e6)",
                      backgroundColor: "var(--card-bg)",
                      cursor: "pointer",
                    }}
                    onClick={() => document.getElementById("file-input").click()}
                  >
                    <input
                      type="file"
                      id="file-input"
                      accept=".pdf,application/pdf"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />

                    <div className="mb-2">
                      <i className="bi bi-file-earmark-pdf-fill text-danger display-5"></i>
                    </div>

                    {fileInfo ? (
                      <div>
                        <h6 className="fw-bold text-success m-0 mb-1">
                          <i className="bi bi-check-circle-fill me-1"></i> {fileInfo.name}
                        </h6>
                        <span className="text-muted small">File Size: {fileInfo.size}</span>
                        <div className="mt-2">
                          <span className="btn btn-outline-danger btn-sm">Change PDF</span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="fw-semibold mb-1">Click to browse or drag & drop your PDF file</p>
                        <p className="text-muted small mb-0">Supports .pdf files up to 10MB</p>
                      </div>
                    )}
                  </div>
                  {error.file && <div className="text-danger small mt-2">{error.file}</div>}
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label className="form-label fw-semibold small text-uppercase" htmlFor="description">
                    Summary / Key Topics Covered
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    className="form-control"
                    placeholder="Brief description of chapters, theorems, formulas, or concepts included..."
                    value={data.description}
                    onChange={handleInputChange}
                  ></textarea>
                </div>

                {/* Tags */}
                <div className="mb-3">
                  <label className="form-label fw-semibold small text-uppercase" htmlFor="tags">
                    Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    className="form-control"
                    placeholder="e.g. react, hooks, redux, nodejs, architecture"
                    value={data.tags}
                    onChange={handleInputChange}
                  />
                  <small className="text-muted">Separate multiple tags with commas.</small>
                </div>

                {/* Actions */}
                <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                  <Link to="/note" className="btn btn-outline-secondary">
                    Cancel
                  </Link>
                  <button type="submit" className="btn btn-primary px-4 shadow-sm">
                    <i className="bi bi-cloud-arrow-up-fill me-1"></i> Upload PDF
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar Classification & Checklist */}
            <div className="col-12 col-xl-4">
              <div className="panel p-4 mb-4">
                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <i className="bi bi-sliders text-primary"></i> Categorization
                </h5>

                {/* Subject */}
                <div className="mb-3">
                  <label className="form-label fw-semibold small text-uppercase" htmlFor="subject">
                    Subject / Domain
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="form-select"
                    value={data.subject}
                    onChange={handleInputChange}
                  >
                    {SUBJECTS.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pin Note */}
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="isPinned"
                    name="isPinned"
                    checked={data.isPinned}
                    onChange={handleInputChange}
                  />
                  <label className="form-check-label fw-semibold small" htmlFor="isPinned">
                    <i className="bi bi-pin-angle-fill text-warning me-1"></i> Pin to Top of Library
                  </label>
                </div>

                {/* Active */}
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="active"
                    name="active"
                    checked={data.active}
                    onChange={handleInputChange}
                  />
                  <label className="form-check-label fw-semibold small" htmlFor="active">
                    Active / Published
                  </label>
                </div>
              </div>

              {/* Checklist Panel */}
              <div className="panel p-4">
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <i className="bi bi-list-check text-primary"></i> Upload Checklist
                </h6>
                <div className="d-flex flex-column gap-3">
                  {checklist.map(({ dot, title, body }) => (
                    <div key={title} className="d-flex gap-2">
                      <span
                        className={`rounded-circle flex-shrink-0 mt-1 ${dot}`}
                        style={{ width: 8, height: 8 }}
                      ></span>
                      <div>
                        <p className="mb-0 fw-semibold small">{title}</p>
                        <p className="text-muted small mb-0">{body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
