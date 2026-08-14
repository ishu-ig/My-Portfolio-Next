import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import formValidator from "../../FormValidators/formValidator";
import { createSkill, getSkill } from "../../Redux/ActionCreators/SkillActionCreators";

const checklist = [
  { dot: "bg-success", title: "Name the skill",    body: "Use a clear, unique skill name."           },
  { dot: "bg-primary", title: "Add description",   body: "Briefly describe what the skill covers."   },
  { dot: "bg-warning", title: "Set level & status", body: "Level indicates proficiency or order."    },
];

export default function AdminCreateSkill() {
  let [data, setData] = useState({
    name: "",
    description: "",
    icon: "",
    level: "",
    active: true,
  });
  let [error, setError] = useState({
    name: "Name Field is Mandatory",
    description: "Description Field is Mandatory",
    level: "Level Field is Mandatory",
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
        (x) => x.name.toLocaleLowerCase() === data.name.toLocaleLowerCase()
      );
      if (item) {
        setShow(true);
        setError((old) => ({ ...old, name: "Skill Already Exist" }));
      } else {
        dispatch(createSkill({ ...data }));
        navigate("/skill");
      }
    }
  }

  useEffect(() => {
    dispatch(getSkill());
  }, [SkillStateData.length]);

  return (
    <main className="dashboard-content">
      <div className="container-fluid px-3 px-lg-4 py-4">

        {/* Page heading */}
        <div className="page-heading">
          <div className="page-heading-copy">
            <span className="page-icon">
              <i className="bi bi-plus-circle" aria-hidden="true"></i>
            </span>
            <div>
              <p className="eyebrow mb-1">Management</p>
              <h1 className="h3 mb-1">Add Skill</h1>
              <p className="text-muted mb-0">
                Create a new skill with name, description, level, and status.
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
                    <i className="bi bi-stars" aria-hidden="true"></i>
                    <span>Skill Information</span>
                  </h2>
                  <p className="text-muted mb-0">
                    Fill in the details to create a new skill.
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
                      value={data.icon}
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
                  <i className="bi bi-check-circle" aria-hidden="true"></i> Create Skill
                </button>
              </div>
            </div>
          </div>

          {/* Checklist */}
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