import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getNote,
  updateNote,
} from "../../Redux/ActionCreators/NoteActionCreators";

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

export default function AdminUpdateNote() {
  const { _id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const NoteStateData = useSelector((state) => state.NoteStateData);

  const [data, setData] = useState({
    _id: "",
    title: "",
    subject: "Web Development",
    description: "",
    tags: "",
    file: "",
    fileName: "",
    fileSize: "",
    isPinned: false,
    active: true,
  });

  const [file, setFile] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [error, setError] = useState({});
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    dispatch(getNote());
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(NoteStateData) && NoteStateData.length) {
      const item = NoteStateData.find((x) => x._id === _id);
      if (item) {
        setData({
          _id: item._id,
          title: item.title || "",
          subject: item.subject || "Web Development",
          description: item.description || "",
          tags: item.tags || "",
          file: item.file || "",
          fileName: item.fileName || "document.pdf",
          fileSize: item.fileSize || "",
          isPinned: !!item.isPinned,
          active: item.active !== undefined ? item.active : true,
        });
      }
    }
  }, [NoteStateData, _id]);

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
    formData.append("_id", data._id);
    formData.append("title", data.title);
    formData.append("subject", data.subject);
    formData.append("description", data.description);
    formData.append("tags", data.tags);
    formData.append("isPinned", data.isPinned);
    formData.append("active", data.active);
    if (file) {
      formData.append("file", file);
    }

    dispatch(updateNote(formData));
    navigate("/note");
  };

  return (
    <main className="dashboard-content">
      <div className="container-fluid px-3 px-lg-4 py-4">
        {/* Page Heading */}
        <div className="page-heading d-flex justify-content-between align-items-center mb-4">
          <div className="page-heading-copy">
            <span className="page-icon">
              <i className="bi bi-pencil-square text-primary" style={{ fontSize: "1.4rem" }}></i>
            </span>
            <div>
              <p className="eyebrow mb-0 text-muted small text-uppercase">Document Management</p>
              <h1 className="h3 mb-0 fw-bold">Update PDF Note</h1>
              <p className="text-muted mb-0 small">
                Modify title, subject classification, or replace the attached PDF file.
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
            Please fill in all mandatory fields before saving.
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
                    placeholder="Enter note title..."
                    value={data.title}
                    onChange={handleInputChange}
                  />
                  {error.title && <div className="invalid-feedback">{error.title}</div>}
                </div>

                {/* Current PDF file badge & Replacement Dropzone */}
                <div className="mb-4">
                  <label className="form-label fw-semibold small text-uppercase">
                    PDF Document
                  </label>

                  {/* Current Active PDF */}
                  {data.file && (
                    <div className="p-3 rounded-3 mb-3 d-flex align-items-center justify-content-between bg-body-secondary">
                      <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-file-earmark-pdf-fill text-danger fs-4"></i>
                        <div>
                          <div className="fw-bold small">{data.fileName || "current_document.pdf"}</div>
                          <span className="text-muted small">Current File {data.fileSize ? `(${data.fileSize})` : ""}</span>
                        </div>
                      </div>
                      <a
                        href={data.file}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline-danger btn-sm"
                      >
                        <i className="bi bi-eye me-1"></i> View Current PDF
                      </a>
                    </div>
                  )}

                  {/* Optional File Replacement */}
                  <div
                    className="p-3 rounded-3 text-center"
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

                    {fileInfo ? (
                      <div>
                        <i className="bi bi-check-circle-fill text-success fs-4 mb-1 d-block"></i>
                        <h6 className="fw-bold text-success m-0 mb-1">{fileInfo.name}</h6>
                        <span className="text-muted small">New file size: {fileInfo.size}</span>
                        <div className="mt-2">
                          <span className="btn btn-outline-danger btn-sm">Change File</span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <i className="bi bi-cloud-arrow-up text-muted fs-4 mb-1 d-block"></i>
                        <p className="fw-semibold mb-0 small">Click to upload a replacement PDF file (optional)</p>
                        <span className="text-muted small">Leave unchanged to keep existing PDF</span>
                      </div>
                    )}
                  </div>
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
                    placeholder="Brief description of chapters or concepts included..."
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
                </div>

                {/* Actions */}
                <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                  <Link to="/note" className="btn btn-outline-secondary">
                    Cancel
                  </Link>
                  <button type="submit" className="btn btn-primary px-4 shadow-sm">
                    <i className="bi bi-check-circle me-1"></i> Update PDF Note
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar Classification */}
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
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
