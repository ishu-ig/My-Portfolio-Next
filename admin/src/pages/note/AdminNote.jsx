import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getNote,
  deleteNote,
  updateNote,
} from "../../Redux/ActionCreators/NoteActionCreators";

const SUBJECTS = [
  "All",
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

export default function AdminNote() {
  const dispatch = useDispatch();
  const NoteStateData = useSelector((state) => state.NoteStateData);

  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "table"
  const [viewingPdfNote, setViewingPdfNote] = useState(null); // for PDF preview modal
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    dispatch(getNote());
  }, [dispatch]);

  const notes = useMemo(() => {
    return Array.isArray(NoteStateData) ? NoteStateData : [];
  }, [NoteStateData]);

  const totalCount = notes.length;
  const pinnedCount = notes.filter((n) => n.isPinned).length;
  const activeCount = notes.filter((n) => n.active).length;
  const uniqueSubjects = new Set(notes.map((n) => n.subject).filter(Boolean)).size;

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchSubject =
        selectedSubject === "All" ||
        (note.subject || "").toLowerCase() === selectedSubject.toLowerCase();
      const matchSearch =
        !search ||
        (note.title || "").toLowerCase().includes(search.toLowerCase()) ||
        (note.subject || "").toLowerCase().includes(search.toLowerCase()) ||
        (note.tags || "").toLowerCase().includes(search.toLowerCase()) ||
        (note.description || "").toLowerCase().includes(search.toLowerCase());
      return matchSubject && matchSearch;
    });
  }, [notes, selectedSubject, search]);

  const handleDelete = (_id) => {
    if (window.confirm("Are you sure you want to delete this PDF note?")) {
      dispatch(deleteNote({ _id }));
      if (viewingPdfNote?._id === _id) setViewingPdfNote(null);
    }
  };

  const handleTogglePin = (note) => {
    const formData = new FormData();
    formData.append("_id", note._id);
    formData.append("isPinned", !note.isPinned);
    dispatch(updateNote(formData));
  };

  const handleToggleActive = (note) => {
    const formData = new FormData();
    formData.append("_id", note._id);
    formData.append("active", !note.active);
    dispatch(updateNote(formData));
  };

  const handleCopyLink = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <main className="dashboard-content">
      <div className="container-fluid px-3 px-lg-4 py-4">
        {/* Page Heading */}
        <div className="page-heading d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <div className="page-heading-copy">
            <span className="page-icon">
              <i className="bi bi-file-earmark-pdf-fill text-danger" style={{ fontSize: "1.4rem" }}></i>
            </span>
            <div>
              <p className="eyebrow mb-0 text-muted small text-uppercase">Document Library</p>
              <h1 className="h3 mb-0 fw-bold">PDF Notes &amp; Resources</h1>
              <p className="text-muted mb-0 small">
                Upload, organize, preview, and manage your PDF notes, cheatsheets, and documents.
              </p>
            </div>
          </div>
          <div className="heading-actions d-flex gap-2">
            <Link className="btn btn-primary btn-sm px-3 shadow-sm" to="/note/create">
              <i className="bi bi-cloud-arrow-up-fill me-1"></i> Upload PDF Note
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="panel p-3 h-100">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted small">Total PDF Notes</span>
                  <h4 className="fw-bold m-0 mt-1">{totalCount}</h4>
                </div>
                <div className="p-2 rounded-3 bg-danger-subtle text-danger">
                  <i className="bi bi-file-earmark-pdf fs-5"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="panel p-3 h-100">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted small">Pinned Notes</span>
                  <h4 className="fw-bold m-0 mt-1 text-warning">{pinnedCount}</h4>
                </div>
                <div className="p-2 rounded-3 bg-warning-subtle text-warning">
                  <i className="bi bi-pin-angle-fill fs-5"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="panel p-3 h-100">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted small">Subjects Covered</span>
                  <h4 className="fw-bold m-0 mt-1 text-primary">{uniqueSubjects}</h4>
                </div>
                <div className="p-2 rounded-3 bg-primary-subtle text-primary">
                  <i className="bi bi-folder2-open fs-5"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="panel p-3 h-100">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted small">Active Notes</span>
                  <h4 className="fw-bold m-0 mt-1 text-success">{activeCount}</h4>
                </div>
                <div className="p-2 rounded-3 bg-success-subtle text-success">
                  <i className="bi bi-check-circle-fill fs-5"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="panel p-3 mb-4">
          <div className="row g-3 align-items-center">
            {/* Search Input */}
            <div className="col-12 col-md-4">
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-transparent border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Search by title, subject, tags..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setSearch("")}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Subject Pills */}
            <div className="col-12 col-md-6">
              <div className="d-flex flex-wrap gap-1 overflow-x-auto py-1" style={{ maxHeight: 72 }}>
                {SUBJECTS.map((sub) => (
                  <button
                    key={sub}
                    className={`btn btn-sm ${
                      selectedSubject === sub
                        ? "btn-primary"
                        : "btn-outline-secondary"
                    }`}
                    style={{ fontSize: "0.78rem", padding: "3px 10px", borderRadius: 999 }}
                    onClick={() => setSelectedSubject(sub)}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="col-12 col-md-2 d-flex justify-content-md-end">
              <div className="btn-group btn-group-sm" role="group">
                <button
                  type="button"
                  className={`btn ${
                    viewMode === "grid" ? "btn-primary" : "btn-outline-secondary"
                  }`}
                  onClick={() => setViewMode("grid")}
                  title="PDF Cards View"
                >
                  <i className="bi bi-grid-fill"></i>
                </button>
                <button
                  type="button"
                  className={`btn ${
                    viewMode === "table" ? "btn-primary" : "btn-outline-secondary"
                  }`}
                  onClick={() => setViewMode("table")}
                  title="Table List View"
                >
                  <i className="bi bi-list-ul"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {filteredNotes.length === 0 ? (
          <div className="text-center py-5 panel">
            <div className="my-4">
              <i className="bi bi-file-earmark-x-fill display-4 text-danger opacity-50 d-block mb-3"></i>
              <h5 className="fw-bold">No PDF Notes Found</h5>
              <p className="text-muted small">
                {notes.length === 0
                  ? "Upload your first PDF note or study material to get started."
                  : "No PDF notes match your search/filter criteria."}
              </p>
              <Link to="/note/create" className="btn btn-primary btn-sm mt-2">
                <i className="bi bi-cloud-arrow-up-fill me-1"></i> Upload PDF Note
              </Link>
            </div>
          </div>
        ) : viewMode === "grid" ? (
          /* PDF Cards Grid */
          <div className="row g-3">
            {filteredNotes.map((note) => (
              <div key={note._id} className="col-12 col-md-6 col-xl-4">
                <div
                  className="panel h-100 p-3 d-flex flex-column position-relative shadow-sm"
                  style={{
                    borderLeft: note.isPinned ? "4px solid #f59e0b" : "4px solid #ef4444",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                >
                  {/* Card Header */}
                  <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="rounded-3 p-2 d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{
                          width: 44,
                          height: 44,
                          background: "rgba(239, 68, 68, 0.12)",
                          color: "#ef4444",
                          fontSize: "1.4rem",
                        }}
                      >
                        <i className="bi bi-file-earmark-pdf-fill"></i>
                      </div>
                      <div>
                        <span className="badge bg-body-secondary text-body" style={{ fontSize: "0.72rem" }}>
                          {note.subject || "General"}
                        </span>
                        {note.fileSize && (
                          <span className="badge bg-light text-muted ms-1" style={{ fontSize: "0.7rem" }}>
                            {note.fileSize}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Pin Action */}
                    <button
                      type="button"
                      className={`btn btn-link p-0 ${note.isPinned ? "text-warning" : "text-muted"}`}
                      onClick={() => handleTogglePin(note)}
                      title={note.isPinned ? "Unpin Note" : "Pin Note to Top"}
                      style={{ fontSize: "1.15rem" }}
                    >
                      <i className={note.isPinned ? "bi bi-pin-angle-fill" : "bi bi-pin-angle"}></i>
                    </button>
                  </div>

                  {/* Note Title */}
                  <h5
                    className="fw-bold mb-1 text-truncate"
                    style={{ cursor: "pointer", color: "var(--text-color)" }}
                    onClick={() => setViewingPdfNote(note)}
                    title="Click to Preview PDF"
                  >
                    {note.title}
                  </h5>

                  {/* Description */}
                  {note.description && (
                    <p
                      className="text-muted small mb-2 flex-grow-1"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        lineHeight: 1.5,
                      }}
                    >
                      {note.description}
                    </p>
                  )}

                  {/* Tags */}
                  {note.tags && (
                    <div className="d-flex flex-wrap gap-1 mb-3">
                      {note.tags.split(",").slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="badge bg-body-secondary text-muted" style={{ fontSize: "0.68rem" }}>
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* PDF Preview Trigger Area */}
                  <div
                    className="p-2 mb-3 rounded-2 text-center"
                    style={{
                      background: "rgba(239, 68, 68, 0.05)",
                      border: "1px dashed rgba(239, 68, 68, 0.3)",
                      cursor: "pointer",
                    }}
                    onClick={() => setViewingPdfNote(note)}
                  >
                    <span className="small text-danger fw-semibold">
                      <i className="bi bi-eye-fill me-1"></i> Preview PDF Document
                    </span>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="d-flex justify-content-between align-items-center pt-2 border-top mt-auto">
                    <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                      {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : "Recent"}
                    </span>

                    <div className="d-flex gap-1">
                      {/* Direct View in new tab */}
                      <a
                        href={note.file}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-light text-muted p-1 px-2 rounded"
                        title="Open in New Tab"
                      >
                        <i className="bi bi-box-arrow-up-right"></i>
                      </a>

                      {/* Download */}
                      <a
                        href={note.file}
                        download={note.fileName || "document.pdf"}
                        className="btn btn-sm btn-light text-primary p-1 px-2 rounded"
                        title="Download PDF"
                      >
                        <i className="bi bi-download"></i>
                      </a>

                      {/* Copy Link */}
                      <button
                        type="button"
                        className="btn btn-sm btn-light text-muted p-1 px-2 rounded"
                        title="Copy PDF Link"
                        onClick={() => handleCopyLink(note.file, note._id)}
                      >
                        <i className={copiedId === note._id ? "bi bi-check2 text-success" : "bi bi-link-45deg"}></i>
                      </button>

                      {/* Edit */}
                      <Link
                        to={`/note/update/${note._id}`}
                        className="btn btn-sm btn-light text-primary p-1 px-2 rounded"
                        title="Edit Details"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </Link>

                      {/* Delete */}
                      <button
                        type="button"
                        className="btn btn-sm btn-light text-danger p-1 px-2 rounded"
                        title="Delete PDF Note"
                        onClick={() => handleDelete(note._id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="panel p-0 overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: 36 }}></th>
                    <th>Document / Title</th>
                    <th>Subject</th>
                    <th>File Size</th>
                    <th>Status</th>
                    <th>Uploaded</th>
                    <th className="text-end pe-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNotes.map((note) => (
                    <tr key={note._id}>
                      <td>
                        <button
                          type="button"
                          className={`btn btn-link p-0 ${note.isPinned ? "text-warning" : "text-muted"}`}
                          onClick={() => handleTogglePin(note)}
                        >
                          <i className={note.isPinned ? "bi bi-pin-angle-fill" : "bi bi-pin-angle"}></i>
                        </button>
                      </td>
                      <td>
                        <div
                          className="d-flex align-items-center gap-2"
                          style={{ cursor: "pointer" }}
                          onClick={() => setViewingPdfNote(note)}
                        >
                          <i className="bi bi-file-earmark-pdf-fill text-danger fs-5"></i>
                          <div>
                            <div className="fw-semibold text-truncate" style={{ maxWidth: 280 }}>
                              {note.title}
                            </div>
                            <small className="text-muted text-truncate d-block" style={{ maxWidth: 280 }}>
                              {note.fileName || "document.pdf"}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-body-secondary text-body">
                          {note.subject || "General"}
                        </span>
                      </td>
                      <td className="text-muted small">{note.fileSize || "—"}</td>
                      <td>
                        <button
                          type="button"
                          className={`btn btn-sm ${note.active ? "btn-outline-success" : "btn-outline-secondary"}`}
                          style={{ fontSize: "0.72rem", padding: "2px 8px" }}
                          onClick={() => handleToggleActive(note)}
                        >
                          {note.active ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="text-muted small">
                        {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="text-end pe-3">
                        <div className="d-inline-flex gap-1">
                          <button
                            type="button"
                            className="btn btn-sm btn-light text-danger"
                            title="Preview PDF"
                            onClick={() => setViewingPdfNote(note)}
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          <a
                            href={note.file}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-sm btn-light text-muted"
                            title="Open in New Tab"
                          >
                            <i className="bi bi-box-arrow-up-right"></i>
                          </a>
                          <Link
                            to={`/note/update/${note._id}`}
                            className="btn btn-sm btn-light text-primary"
                            title="Edit"
                          >
                            <i className="bi bi-pencil-square"></i>
                          </Link>
                          <button
                            type="button"
                            className="btn btn-sm btn-light text-danger"
                            title="Delete"
                            onClick={() => handleDelete(note._id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Built-in Full PDF Preview Modal */}
      {viewingPdfNote && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
          tabIndex="-1"
          onClick={(e) => {
            if (e.target === e.currentTarget) setViewingPdfNote(null);
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-xl" style={{ maxWidth: "90vw" }}>
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden bg-body">
              
              {/* Modal Header */}
              <div className="modal-header border-bottom py-3 px-4 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="rounded-3 p-2 text-danger d-flex align-items-center justify-content-center"
                    style={{ width: 42, height: 42, background: "rgba(239, 68, 68, 0.12)" }}
                  >
                    <i className="bi bi-file-earmark-pdf-fill fs-4"></i>
                  </div>
                  <div>
                    <h5 className="modal-title fw-bold m-0">{viewingPdfNote.title}</h5>
                    <div className="d-flex align-items-center gap-2 mt-1">
                      <span className="badge bg-body-secondary text-body small">
                        {viewingPdfNote.subject || "General"}
                      </span>
                      {viewingPdfNote.fileSize && (
                        <span className="text-muted small">• {viewingPdfNote.fileSize}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <a
                    href={viewingPdfNote.file}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline-secondary btn-sm"
                  >
                    <i className="bi bi-box-arrow-up-right me-1"></i> Fullscreen Tab
                  </a>
                  <a
                    href={viewingPdfNote.file}
                    download={viewingPdfNote.fileName || "document.pdf"}
                    className="btn btn-primary btn-sm"
                  >
                    <i className="bi bi-download me-1"></i> Download
                  </a>
                  <button
                    type="button"
                    className="btn-close ms-2"
                    onClick={() => setViewingPdfNote(null)}
                  ></button>
                </div>
              </div>

              {/* Modal Body: Embedded PDF Viewer */}
              <div className="modal-body p-0" style={{ height: "72vh", backgroundColor: "#333" }}>
                <iframe
                  src={viewingPdfNote.file}
                  title={viewingPdfNote.title}
                  width="100%"
                  height="100%"
                  style={{ border: 0, display: "block" }}
                />
              </div>

              {/* Modal Footer: Description & Tags */}
              <div className="modal-footer border-top px-4 py-2 d-flex justify-content-between align-items-center">
                <div className="text-muted small">
                  {viewingPdfNote.description || "PDF Study Note & Resource Document."}
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setViewingPdfNote(null)}
                >
                  Close Viewer
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </main>
  );
}
