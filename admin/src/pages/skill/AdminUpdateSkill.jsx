import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import formValidator from "../../FormValidators/formValidator";
import { updateSkill, getSkill } from "../../Redux/ActionCreators/SkillActionCreators";

const checklist = [
  { dot: "bg-success", title: "Review details",   body: "Confirm name and description are up to date." },
  { dot: "bg-primary", title: "Check level",      body: "Ensure the level value is still accurate."    },
  { dot: "bg-warning", title: "Save changes",     body: "Changes take effect immediately."             },
];

export default function AdminUpdateSkill() {
  let { _id } = useParams();

  let [data, setData] = useState({
    _id: "",
    name: "",
    description: "",
    icon: "",
    level: "",
    active: true,
  });
  let [error, setError] = useState({
    name: "",
    description: "",
    level: "",
  });
  let [show, setShow] = useState(false);
  let navigate = useNavigate();

  let SkillStateData = useSelector((state) => state.SkillStateData);
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
      [name]:
        name === "active"
          ? value === "1"
            ? true
            : false
          : name === "level"
          ? Number(value)
          : value,
    }));
  }

  function postSubmit(e) {
    e.preventDefault();
    let errorItem = Object.values(error).find((x) => x !== "");
    if (errorItem) {
      setShow(true);
    } else {
      let item = SkillStateData.find(
        (x) =>
          x._id !== _id &&
          x.name.toLocaleLowerCase() === data.name.toLocaleLowerCase()
      );
      if (item) {
        setShow(true);
        setError((old) => ({ ...old, name: "Skill Already Exist" }));
      } else {
        dispatch(updateSkill({ ...data }));
        navigate("/skill");
      }
    }
  }

  useEffect(() => {
    dispatch(getSkill());
    if (SkillStateData.length) {
      let item = SkillStateData.find((x) => x._id === _id);
      if (item) setData({ ...item });
    }
  }, [SkillStateData.length]);

  return (
    <main className="dashboard-content">
      <div className="container-fluid px-3 px-lg-4 py-4">

        {/* Page heading */}
        <div className="page-heading">
          <div className="page-heading-copy">
            <span className="page-icon">
              <i className="bi bi-pencil-square" aria-hidden="true"></i>
            </span>
            <div>
              <p className="eyebrow mb-1">Management</p>
              <h1 className="h3 mb-1">Update Skill</h1>
              <p className="text-muted mb-0">
                Edit the skill name, description, level, and status.
              </p>
            </div>
          </div>
          <div className="heading-actions">
            <Link className="btn btn-outline-secondary btn-sm" to="/skill">
              <i className="bi bi-arrow-left" aria-hidden="true"></i> Back to Skills
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

          {/* Form */}
          <div className="col-12 col-xl-8">
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2 className="h5 mb-1 section-title">
                    <i className="bi bi-pencil-square" aria-hidden="true"></i>
                    <span>Skill Information</span>
                  </h2>
                  <p className="text-muted mb-0">
                    Update the details for this skill.
                  </p>
                </div>
              </div>

              <div className="row g-3">

                {/* Name */}
                <div className="col-12">
                  <label className="form-label" htmlFor="name">Skill Name</label>
                  <input
                    className={`form-control ${show && error.name ? "is-invalid" : ""}`}
                    id="name"
                    type="text"
                    name="name"
                    value={data.name}
                    onChange={getInputData}
                    placeholder="Enter Skill Name"
                    required
                  />
                  {show && error.name && (
                    <div className="text-danger small mt-1">{error.name}</div>
                  )}
                </div>

                {/* Description */}
                <div className="col-12">
                  <label className="form-label" htmlFor="description">Description</label>
                  <textarea
                    className={`form-control ${show && error.description ? "is-invalid" : ""}`}
                    id="description"
                    name="description"
                    value={data.description}
                    onChange={getInputData}
                    placeholder="Enter Skill Description"
                    rows={3}
                  />
                  {show && error.description && (
                    <div className="text-danger small mt-1">{error.description}</div>
                  )}
                </div>

                {/* Icon */}
                <div className="col-12">
                  <label className="form-label" htmlFor="icon">
                    Skill Icon&nbsp;
                    <span className="text-muted small fw-normal">(Bootstrap Icon class, e.g. <code>bi bi-code-slash</code>)</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ minWidth: 46, justifyContent: "center" }}>
                      {data.icon ? (
                        <i className={data.icon} style={{ fontSize: "1.25rem" }}></i>
                      ) : (
                        <i className="bi bi-stars text-muted" style={{ fontSize: "1.25rem" }}></i>
                      )}
                    </span>
                    <input
                      className="form-control"
                      id="icon"
                      type="text"
                      name="icon"
                      value={data.icon || ""}
                      onChange={getInputData}
                      placeholder="e.g. bi bi-react, bi bi-node-plus, bi bi-database"
                    />
                  </div>
                  <div className="text-muted small mt-1">
                    Browse icons at&nbsp;
                    <a href="https://icons.getbootstrap.com/" target="_blank" rel="noreferrer" className="text-primary">icons.getbootstrap.com</a>
                  </div>
                </div>

                {/* Level */}
                <div className="col-md-6">
                  <label className="form-label" htmlFor="level">Level</label>
                  <input
                    className={`form-control ${show && error.level ? "is-invalid" : ""}`}
                    id="level"
                    type="number"
                    name="level"
                    value={data.level}
                    onChange={getInputData}
                    placeholder="Enter Skill Level"
                  />
                  {show && error.level && (
                    <div className="text-danger small mt-1">{error.level}</div>
                  )}
                </div>

                {/* Active */}
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

              {/* Actions */}
              <div className="d-flex flex-wrap justify-content-end gap-2 mt-4">
                <Link className="btn btn-outline-secondary" to="/skill">Cancel</Link>
                <button className="btn btn-primary" type="button" onClick={postSubmit}>
                  <i className="bi bi-check-circle" aria-hidden="true"></i> Update Skill
                </button>
              </div>
            </div>
          </div>

          {/* Checklist */}
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