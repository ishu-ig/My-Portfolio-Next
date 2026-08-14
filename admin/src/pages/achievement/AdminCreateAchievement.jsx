import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import formValidator from "../../FormValidators/formValidator";
import { createAchievement, getAchievement } from "../../Redux/ActionCreators/AchievementActionCreators";

const checklist = [
  { dot: "bg-success", title: "Pick an icon",  body: "Use a Bootstrap icon class, e.g. bi bi-trophy." },
  { dot: "bg-primary", title: "Choose a type", body: "Counter animates a number; static shows badge text." },
  { dot: "bg-warning", title: "Set the order", body: "Lower numbers display first."                       },
];

export default function AdminCreateAchievement() {
  let [data, setData] = useState({
    icon: "",
    label: "",
    type: "counter",
    target: "",
    stat: "",
    order: 0,
    active: true,
  });
  let [error, setError] = useState({
    icon: "Icon Field is Mandatory",
    label: "Label Field is Mandatory",
    target: "",
    stat: "",
  });
  let [show, setShow] = useState(false);
  let navigate = useNavigate();

  let AchievementStateData = useSelector((state) => state.AchievementStateData);
  let dispatch = useDispatch();

  function getInputData(e) {
    let name = e.target.name;
    let value = e.target.value;

    if (!["active", "type"].includes(name)) {
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

  useEffect(() => {
    setError((old) => ({
      ...old,
      target: data.type === "counter" && !data.target ? "Target Field is Mandatory" : "",
      stat: data.type === "static" && !data.stat ? "Stat Field is Mandatory" : "",
    }));
  }, [data.type, data.target, data.stat]);

  function postSubmit(e) {
    e.preventDefault();

    const relevantErrors = {
      icon: error.icon,
      label: error.label,
      ...(data.type === "counter" ? { target: error.target } : {}),
      ...(data.type === "static" ? { stat: error.stat } : {}),
    };

    let errorItem = Object.values(relevantErrors).find((x) => x !== "");
    if (errorItem) {
      setShow(true);
      return;
    }

    let item = AchievementStateData.find(
      (x) => x.label.toLocaleLowerCase() === data.label.toLocaleLowerCase()
    );
    if (item) {
      setShow(true);
      setError((old) => ({ ...old, label: "Achievement Already Exist" }));
      return;
    }

    const payload = {
      ...data,
      target: data.type === "counter" ? Number(data.target) : null,
      stat: data.type === "static" ? data.stat : null,
      order: Number(data.order) || 0,
    };

    dispatch(createAchievement(payload));
    navigate("/achievement");
  }

  useEffect(() => {
    dispatch(getAchievement());
  }, [AchievementStateData.length]);

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
              <h1 className="h3 mb-1">Add Achievement</h1>
              <p className="text-muted mb-0">
                Create a new achievement with icon, type, and status.
              </p>
            </div>
          </div>
          <div className="heading-actions">
            <Link className="btn btn-outline-secondary btn-sm" to="/achievement">
              <i className="bi bi-arrow-left" aria-hidden="true"></i> Back to Achievements
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
                    <i className="bi bi-trophy" aria-hidden="true"></i>
                    <span>Achievement Information</span>
                  </h2>
                  <p className="text-muted mb-0">
                    Fill in the details to create a new achievement.
                  </p>
                </div>
              </div>

              <div className="row g-3">

                <div className="col-12">
                  <label className="form-label" htmlFor="label">Label</label>
                  <input
                    className={`form-control ${show && error.label ? "is-invalid" : ""}`}
                    id="label"
                    type="text"
                    name="label"
                    value={data.label}
                    onChange={getInputData}
                    placeholder="e.g. Projects Completed"
                  />
                  {show && error.label && (
                    <div className="text-danger small mt-1">{error.label}</div>
                  )}
                </div>

                <div className="col-12">
                  <label className="form-label" htmlFor="icon">
                    Icon <small className="text-muted">(e.g. bi bi-trophy)</small>
                  </label>
                  <input
                    className={`form-control ${show && error.icon ? "is-invalid" : ""}`}
                    id="icon"
                    type="text"
                    name="icon"
                    value={data.icon}
                    onChange={getInputData}
                    placeholder="Enter Bootstrap Icon Class"
                  />
                  {show && error.icon && (
                    <div className="text-danger small mt-1">{error.icon}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="type">Type</label>
                  <select
                    className="form-select"
                    id="type"
                    name="type"
                    value={data.type}
                    onChange={getInputData}
                  >
                    <option value="counter">Counter (animated number)</option>
                    <option value="static">Static (badge text)</option>
                  </select>
                </div>

                {data.type === "counter" && (
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="target">
                      Target <small className="text-muted">(number to count up to)</small>
                    </label>
                    <input
                      className={`form-control ${show && error.target ? "is-invalid" : ""}`}
                      id="target"
                      type="number"
                      name="target"
                      value={data.target}
                      onChange={getInputData}
                      placeholder="e.g. 150"
                    />
                    {show && error.target && (
                      <div className="text-danger small mt-1">{error.target}</div>
                    )}
                  </div>
                )}

                {data.type === "static" && (
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="stat">
                      Stat <small className="text-muted">(badge text to display)</small>
                    </label>
                    <input
                      className={`form-control ${show && error.stat ? "is-invalid" : ""}`}
                      id="stat"
                      type="text"
                      name="stat"
                      value={data.stat}
                      onChange={getInputData}
                      placeholder="e.g. Top Rated"
                    />
                    {show && error.stat && (
                      <div className="text-danger small mt-1">{error.stat}</div>
                    )}
                  </div>
                )}

                <div className="col-md-6">
                  <label className="form-label" htmlFor="order">Order</label>
                  <input
                    className="form-control"
                    id="order"
                    type="number"
                    name="order"
                    value={data.order}
                    onChange={getInputData}
                    placeholder="Display order (0, 1, 2…)"
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
                <Link className="btn btn-outline-secondary" to="/achievement">Cancel</Link>
                <button className="btn btn-primary" type="button" onClick={postSubmit}>
                  <i className="bi bi-check-circle" aria-hidden="true"></i> Create Achievement
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