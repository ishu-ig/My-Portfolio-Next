import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import formValidator from "../../FormValidators/formValidator";
import imageValidator from "../../FormValidators/imageValidator";
import { updateBlog, getBlog } from "../../Redux/ActionCreators/BlogActionCreators";

const checklist = [
  { dot: "bg-success", title: "Review content", body: "Confirm title and descriptions are current." },
  { dot: "bg-primary", title: "Check thumbnail", body: "Re-upload only if you want to replace it."   },
  { dot: "bg-warning", title: "Save changes",    body: "Changes take effect immediately."            },
];

export default function AdminUpdateBlog() {
  let { _id } = useParams();

  let [data, setData] = useState({
    title: "",
    pic: "",
    shortDescription: "",
    longDescription: "",
    category: "",
    tags: "",
    author: "Admin",
    active: true,
  });
  let [error, setError] = useState({
    title: "",
    pic: "",
    shortDescription: "",
    longDescription: "",
    category: "",
    author: "",
  });
  let [show, setShow] = useState(false);
  let navigate = useNavigate();

  let BlogStateData = useSelector((state) => state.BlogStateData);
  let dispatch = useDispatch();

  function getInputData(e) {
    let name = e.target.name;
    let value = e.target.files ? e.target.files[0] : e.target.value;

    if (name !== "active" && name !== "tags") {
      setError((old) => ({
        ...old,
        [name]: e.target.files ? imageValidator(e) : formValidator(e),
      }));
    }
    setData((old) => ({
      ...old,
      [name]: name === "active" ? (value === "1" ? true : false) : value,
    }));
  }

  function postSubmit(e) {
    e.preventDefault();
    let errorItem = Object.values(error).find((x) => x !== "");
    if (errorItem) {
      setShow(true);
    } else {
      let item = BlogStateData.find(
        (x) =>
          x._id !== _id &&
          x.title.toLocaleLowerCase() === data.title.toLocaleLowerCase()
      );
      if (item) {
        setShow(true);
        setError((old) => ({ ...old, title: "Blog Already Exist" }));
      } else {
        let formData = new FormData();
        formData.append("_id", data._id);
        formData.append("title", data.title);
        formData.append("pic", data.pic);
        formData.append("shortDescription", data.shortDescription);
        formData.append("longDescription", data.longDescription);
        formData.append("category", data.category);
        formData.append("tags", data.tags);
        formData.append("author", data.author);
        formData.append("active", data.active);
        dispatch(updateBlog(formData));
        navigate("/blog");
      }
    }
  }

  useEffect(() => {
    dispatch(getBlog());
    if (BlogStateData.length) {
      let item = BlogStateData.find((x) => x._id === _id);
      if (item) setData({ ...item });
    }
  }, [BlogStateData.length]);

  return (
    <main className="dashboard-content">
      <div className="container-fluid px-3 px-lg-4 py-4">

        <div className="page-heading">
          <div className="page-heading-copy">
            <span className="page-icon">
              <i className="bi bi-pencil-square" aria-hidden="true"></i>
            </span>
            <div>
              <p className="eyebrow mb-1">Management</p>
              <h1 className="h3 mb-1">Update Blog</h1>
              <p className="text-muted mb-0">
                Edit the blog content, category, tags, and status.
              </p>
            </div>
          </div>
          <div className="heading-actions">
            <Link className="btn btn-outline-secondary btn-sm" to="/blog">
              <i className="bi bi-arrow-left" aria-hidden="true"></i> Back to Blog
            </Link>
          </div>
        </div>

        {show && (
          <div className="alert alert-danger alert-dismissible" role="alert">
            {Object.values(error).find((x) => x !== "")}
            <button
              type="button"
              className="btn-close"
              onClick={() => setShow(false)}
              aria-label="Close"
            />
          </div>
        )}

        <section className="row g-3">

          <div className="col-12 col-xl-8">
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2 className="h5 mb-1 section-title">
                    <i className="bi bi-pencil-square" aria-hidden="true"></i>
                    <span>Blog Information</span>
                  </h2>
                  <p className="text-muted mb-0">
                    Update the details for this blog post.
                  </p>
                </div>
              </div>

              <div className="row g-3">

                <div className="col-12">
                  <label className="form-label" htmlFor="title">Title</label>
                  <input
                    className={`form-control ${show && error.title ? "is-invalid" : ""}`}
                    id="title"
                    type="text"
                    name="title"
                    onChange={getInputData}
                    value={data.title}
                    placeholder="Enter Blog Title"
                  />
                  {show && error.title && (
                    <div className="text-danger small mt-1">{error.title}</div>
                  )}
                </div>

                <div className="col-12">
                  <label className="form-label" htmlFor="shortDescription">Short Description</label>
                  <input
                    className={`form-control ${show && error.shortDescription ? "is-invalid" : ""}`}
                    id="shortDescription"
                    type="text"
                    name="shortDescription"
                    onChange={getInputData}
                    value={data.shortDescription}
                    placeholder="Enter Short Description"
                  />
                  {show && error.shortDescription && (
                    <div className="text-danger small mt-1">{error.shortDescription}</div>
                  )}
                </div>

                <div className="col-12">
                  <label className="form-label" htmlFor="longDescription">Long Description</label>
                  <textarea
                    className={`form-control ${show && error.longDescription ? "is-invalid" : ""}`}
                    id="longDescription"
                    name="longDescription"
                    onChange={getInputData}
                    value={data.longDescription}
                    placeholder="Enter Long Description"
                    rows={4}
                  />
                  {show && error.longDescription && (
                    <div className="text-danger small mt-1">{error.longDescription}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="category">Category</label>
                  <input
                    className={`form-control ${show && error.category ? "is-invalid" : ""}`}
                    id="category"
                    type="text"
                    name="category"
                    onChange={getInputData}
                    value={data.category}
                    placeholder="Enter Category"
                  />
                  {show && error.category && (
                    <div className="text-danger small mt-1">{error.category}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="author">Author</label>
                  <input
                    className={`form-control ${show && error.author ? "is-invalid" : ""}`}
                    id="author"
                    type="text"
                    name="author"
                    onChange={getInputData}
                    value={data.author}
                    placeholder="Enter Author Name"
                  />
                  {show && error.author && (
                    <div className="text-danger small mt-1">{error.author}</div>
                  )}
                </div>

                <div className="col-12">
                  <label className="form-label" htmlFor="tags">Tags</label>
                  <input
                    className="form-control"
                    id="tags"
                    type="text"
                    name="tags"
                    onChange={getInputData}
                    value={data.tags}
                    placeholder="Enter Tags (optional)"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="pic">Thumbnail Image</label>
                  <input
                    className={`form-control ${show && error.pic ? "is-invalid" : ""}`}
                    id="pic"
                    type="file"
                    name="pic"
                    onChange={getInputData}
                  />
                  {show && error.pic && (
                    <div className="text-danger small mt-1">{error.pic}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="active">Status</label>
                  <select
                    className="form-select"
                    id="active"
                    name="active"
                    value={data.active ? "1" : "0"}
                    onChange={getInputData}
                  >
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>

              </div>

              <div className="d-flex flex-wrap justify-content-end gap-2 mt-4">
                <Link className="btn btn-outline-secondary" to="/blog">Cancel</Link>
                <button className="btn btn-primary" type="button" onClick={postSubmit}>
                  <i className="bi bi-check-circle" aria-hidden="true"></i> Update Blog
                </button>
              </div>
            </div>
          </div>

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