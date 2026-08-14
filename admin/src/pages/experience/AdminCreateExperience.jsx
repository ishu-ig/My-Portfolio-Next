import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import formValidator from "../../FormValidators/formValidator";
import { createExperience, getExperience } from "../../Redux/ActionCreators/ExperienceActionCreators";

const checklist = [
  { dot: "bg-success", title: "Add job title",  body: "Use the official title held at the company." },
  { dot: "bg-primary", title: "Set the dates",  body: "Start and end dates frame the role's timeline." },
  { dot: "bg-warning", title: "Describe impact", body: "Summarize key responsibilities or achievements." },
];

export default function AdminCreateExperience() {
  let [data, setData] = useState({
    jobTitle: "",
    companyName: "",
    startDate: "",
    endDate: "",
    description: "",
    active: true,
  });
  let [error, setError] = useState({
    jobTitle: "Job Title Field is Mandatory",
    companyName: "Company Name Field is Mandatory",
    startDate: "Start Date Field is Mandatory",
    endDate: "End Date Field is Mandatory",
    description: "Description Field is Mandatory",
  });
  let [show, setShow] = useState(false);
  let navigate = useNavigate();

  let ExperienceStateData = useSelector((state) => state.ExperienceStateData);
  let dispatch = useDispatch();

  function getInputData(e) {
    let name = e.target.name;
    let value = e.target.value;

    if (name !== "active") {
      setError((old) => ({
        ...old,
        [name]: formValidator(e),
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
      let item = ExperienceStateData.find(
        (x) => x.jobTitle.toLocaleLowerCase() === data.jobTitle.toLocaleLowerCase()
      );
      if (item) {
        setShow(true);
        setError((old) => ({ ...old, jobTitle: "Experience Record Already Exist" }));
      } else {
        dispatch(createExperience({ ...data }));
        navigate("/experience");
      }
    }
  }

  useEffect(() => {
    dispatch(getExperience());
  }, [ExperienceStateData.length]);

  return (
    <main className="dashboard-content">
      <div className="container-fluid px-3 px-lg-4 py-4">

        <div className="page-heading">
          <div className="page-heading-copy">
            <span className="page-icon">
              <i className="bi bi-plus-circle" aria-hidden="true"></i>
            </span>
            <div>
              <p className="eyebrow mb-1">Management</p>
              <h1 className="h3 mb-1">Add Experience</h1>
              <p className="text-muted mb-0">
                Create a new work experience entry with role and dates.
              </p>
            </div>
          </div>
          <div className="heading-actions">
            <Link className="btn btn-outline-secondary btn-sm" to="/experience">
              <i className="bi bi-arrow-left" aria-hidden="true"></i> Back to Experience
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
                    <i className="bi bi-briefcase" aria-hidden="true"></i>
                    <span>Experience Information</span>
                  </h2>
                  <p className="text-muted mb-0">
                    Fill in the details to create a new experience entry.
                  </p>
                </div>
              </div>

              <div className="row g-3">

                <div className="col-md-6">
                  <label className="form-label" htmlFor="jobTitle">Job Title</label>
                  <input
                    className={`form-control ${show && error.jobTitle ? "is-invalid" : ""}`}
                    id="jobTitle"
                    type="text"
                    name="jobTitle"
                    onChange={getInputData}
                    placeholder="Enter Job Title"
                  />
                  {show && error.jobTitle && (
                    <div className="text-danger small mt-1">{error.jobTitle}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="companyName">Company Name</label>
                  <input
                    className={`form-control ${show && error.companyName ? "is-invalid" : ""}`}
                    id="companyName"
                    type="text"
                    name="companyName"
                    onChange={getInputData}
                    placeholder="Enter Company Name"
                  />
                  {show && error.companyName && (
                    <div className="text-danger small mt-1">{error.companyName}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="startDate">Start Date</label>
                  <input
                    className={`form-control ${show && error.startDate ? "is-invalid" : ""}`}
                    id="startDate"
                    type="date"
                    name="startDate"
                    onChange={getInputData}
                  />
                  {show && error.startDate && (
                    <div className="text-danger small mt-1">{error.startDate}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="endDate">End Date</label>
                  <input
                    className={`form-control ${show && error.endDate ? "is-invalid" : ""}`}
                    id="endDate"
                    type="date"
                    name="endDate"
                    onChange={getInputData}
                  />
                  {show && error.endDate && (
                    <div className="text-danger small mt-1">{error.endDate}</div>
                  )}
                </div>

                <div className="col-12">
                  <label className="form-label" htmlFor="description">Description</label>
                  <textarea
                    className={`form-control ${show && error.description ? "is-invalid" : ""}`}
                    id="description"
                    name="description"
                    onChange={getInputData}
                    placeholder="Enter Description"
                    rows={3}
                  />
                  {show && error.description && (
                    <div className="text-danger small mt-1">{error.description}</div>
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
                <Link className="btn btn-outline-secondary" to="/experience">Cancel</Link>
                <button className="btn btn-primary" type="button" onClick={postSubmit}>
                  <i className="bi bi-check-circle" aria-hidden="true"></i> Create Experience
                </button>
              </div>
            </div>
          </div>

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