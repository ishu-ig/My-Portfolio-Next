import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import formValidator from "../../FormValidators/formValidator";
import { updateEducation, getEducation } from "../../Redux/ActionCreators/EducationActionCreators";

const checklist = [
  { dot: "bg-success", title: "Review details", body: "Confirm degree and institute are correct." },
  { dot: "bg-primary", title: "Check dates",    body: "Update end date if studies have concluded." },
  { dot: "bg-warning", title: "Save changes",   body: "Changes take effect immediately."           },
];

export default function AdminUpdateEducation() {
  let { _id } = useParams();

  let [data, setData] = useState({
    degreeName: "",
    instituteName: "",
    startDate: "",
    endDate: "",
    description: "",
    cgpa: "",
    active: true,
  });
  let [error, setError] = useState({
    degreeName: "",
    instituteName: "",
    startDate: "",
    description: "",
  });
  let [show, setShow] = useState(false);
  let navigate = useNavigate();

  let EducationStateData = useSelector((state) => state.EducationStateData);
  let dispatch = useDispatch();

  function getInputData(e) {
    let name = e.target.name;
    let value = e.target.value;

    if (name !== "active" && name !== "endDate" && name !== "cgpa") {
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
      let item = EducationStateData.find(
        (x) =>
          x._id !== _id &&
          x.degreeName.toLocaleLowerCase() === data.degreeName.toLocaleLowerCase()
      );
      if (item) {
        setShow(true);
        setError((old) => ({ ...old, degreeName: "Education Record Already Exist" }));
      } else {
        dispatch(updateEducation({ ...data }));
        navigate("/education");
      }
    }
  }

  useEffect(() => {
    dispatch(getEducation());
    if (EducationStateData.length) {
      let item = EducationStateData.find((x) => x._id === _id);
      if (item) setData({ ...item });
    }
  }, [EducationStateData.length]);

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
              <h1 className="h3 mb-1">Update Education</h1>
              <p className="text-muted mb-0">
                Edit the degree, institute, dates, and status.
              </p>
            </div>
          </div>
          <div className="heading-actions">
            <Link className="btn btn-outline-secondary btn-sm" to="/education">
              <i className="bi bi-arrow-left" aria-hidden="true"></i> Back to Education
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
                    <span>Education Information</span>
                  </h2>
                  <p className="text-muted mb-0">
                    Update the details for this education record.
                  </p>
                </div>
              </div>

              <div className="row g-3">

                <div className="col-md-6">
                  <label className="form-label" htmlFor="degreeName">Degree Name</label>
                  <input
                    className={`form-control ${show && error.degreeName ? "is-invalid" : ""}`}
                    id="degreeName"
                    type="text"
                    name="degreeName"
                    onChange={getInputData}
                    value={data.degreeName}
                    placeholder="Enter Degree Name"
                  />
                  {show && error.degreeName && (
                    <div className="text-danger small mt-1">{error.degreeName}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="instituteName">Institute Name</label>
                  <input
                    className={`form-control ${show && error.instituteName ? "is-invalid" : ""}`}
                    id="instituteName"
                    type="text"
                    name="instituteName"
                    onChange={getInputData}
                    value={data.instituteName}
                    placeholder="Enter Institute Name"
                  />
                  {show && error.instituteName && (
                    <div className="text-danger small mt-1">{error.instituteName}</div>
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
                    value={data.startDate}
                  />
                  {show && error.startDate && (
                    <div className="text-danger small mt-1">{error.startDate}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="endDate">End Date</label>
                  <input
                    className="form-control"
                    id="endDate"
                    type="date"
                    name="endDate"
                    onChange={getInputData}
                    value={data.endDate}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label" htmlFor="description">Description</label>
                  <textarea
                    className={`form-control ${show && error.description ? "is-invalid" : ""}`}
                    id="description"
                    name="description"
                    onChange={getInputData}
                    value={data.description}
                    placeholder="Enter Description"
                    rows={3}
                  />
                  {show && error.description && (
                    <div className="text-danger small mt-1">{error.description}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="cgpa">CGPA</label>
                  <input
                    className="form-control"
                    id="cgpa"
                    type="text"
                    name="cgpa"
                    onChange={getInputData}
                    value={data.cgpa}
                    placeholder="Enter CGPA (optional)"
                  />
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
                <Link className="btn btn-outline-secondary" to="/education">Cancel</Link>
                <button className="btn btn-primary" type="button" onClick={postSubmit}>
                  <i className="bi bi-check-circle" aria-hidden="true"></i> Update Education
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