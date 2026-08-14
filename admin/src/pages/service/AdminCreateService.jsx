import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import formValidator from "../../FormValidators/formValidator";
import { createService, getService } from "../../Redux/ActionCreators/ServiceActionCreators";

const checklist = [
  { dot: "bg-primary", title: "Service Name",      body: "Use a clear, descriptive name for the service."    },
  { dot: "bg-success", title: "Set Pricing",        body: "Add price and estimated delivery duration."        },
  { dot: "bg-warning", title: "Pick a Category",    body: "Assign the right category for easy filtering."     },
];

export default function AdminCreateService() {
  let [data, setData] = useState({
    name: "", icon: "", shortDescription: "", longDescription: "",
    price: "", duration: "", category: "", technology: "", active: true,
  });
  let [error, setError] = useState({
    name:             "Name Field is Mandatory",
    icon:             "Icon Field is Mandatory",
    shortDescription: "Short Description Field is Mandatory",
    longDescription:  "Long Description Field is Mandatory",
    price:            "Price Field is Mandatory",
    duration:         "Duration Field is Mandatory",
    category:         "Category Field is Mandatory",
    technology:       "Technology Field is Mandatory",
  });
  let [show, setShow]   = useState(false);
  let navigate          = useNavigate();
  let ServiceStateData  = useSelector((state) => state.ServiceStateData);
  let dispatch          = useDispatch();

  function getInputData(e) {
    let name  = e.target.name;
    let value = e.target.value;
    if (name !== "active") {
      setError((old) => ({ ...old, [name]: formValidator(e) }));
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
      let item = ServiceStateData.find(
        (x) => x.name.toLocaleLowerCase() === data.name.toLocaleLowerCase()
      );
      if (item) {
        setShow(true);
        setError((old) => ({ ...old, name: "Service Already Exists" }));
      } else {
        dispatch(createService({ ...data }));
        navigate("/service");
      }
    }
  }

  useEffect(() => {
    dispatch(getService());
  }, [ServiceStateData.length]);

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
              <h1 className="h3 mb-1">Add Service</h1>
              <p className="text-muted mb-0">Create a new service with full details.</p>
            </div>
          </div>
          <div className="heading-actions">
            <Link className="btn btn-outline-secondary btn-sm" to="/service">
              <i className="bi bi-arrow-left" aria-hidden="true"></i> Back to Services
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

          {/* Form Panel */}
          <div className="col-12 col-xl-8">
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2 className="h5 mb-1 section-title">
                    <i className="bi bi-briefcase" aria-hidden="true"></i>
                    <span>Service Information</span>
                  </h2>
                  <p className="text-muted mb-0">Fill in the details to create a new service.</p>
                </div>
              </div>

              <div className="row g-3">

                {/* Name */}
                <div className="col-12">
                  <label className="form-label" htmlFor="name">Service Name</label>
                  <input
                    id="name" type="text" name="name"
                    className="form-control" placeholder="Enter service name"
                    value={data.name} onChange={getInputData}
                  />
                  {show && error.name && <div className="text-danger small mt-1">{error.name}</div>}
                </div>

                {/* Icon */}
                <div className="col-12">
                  <label className="form-label" htmlFor="icon">
                    Icon Class <small className="text-muted fw-normal">(e.g. bi bi-code-slash)</small>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className={data.icon || "bi bi-star"}></i>
                    </span>
                    <input
                      id="icon" type="text" name="icon"
                      className="form-control" placeholder="Enter Bootstrap Icon class"
                      value={data.icon} onChange={getInputData}
                    />
                  </div>
                  {show && error.icon && <div className="text-danger small mt-1">{error.icon}</div>}
                </div>

                {/* Short Description */}
                <div className="col-12">
                  <label className="form-label" htmlFor="shortDescription">Short Description</label>
                  <input
                    id="shortDescription" type="text" name="shortDescription"
                    className="form-control" placeholder="Enter short description"
                    value={data.shortDescription} onChange={getInputData}
                  />
                  {show && error.shortDescription && <div className="text-danger small mt-1">{error.shortDescription}</div>}
                </div>

                {/* Long Description */}
                <div className="col-12">
                  <label className="form-label" htmlFor="longDescription">Long Description</label>
                  <textarea
                    id="longDescription" name="longDescription" rows={4}
                    className="form-control" placeholder="Enter detailed description"
                    value={data.longDescription} onChange={getInputData}
                  />
                  {show && error.longDescription && <div className="text-danger small mt-1">{error.longDescription}</div>}
                </div>

                {/* Price & Duration */}
                <div className="col-md-6">
                  <label className="form-label" htmlFor="price">Price (₹)</label>
                  <input
                    id="price" type="number" name="price"
                    className="form-control" placeholder="Enter price"
                    value={data.price} onChange={getInputData}
                  />
                  {show && error.price && <div className="text-danger small mt-1">{error.price}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="duration">Duration</label>
                  <input
                    id="duration" type="text" name="duration"
                    className="form-control" placeholder="e.g. 2 weeks, 1 month"
                    value={data.duration} onChange={getInputData}
                  />
                  {show && error.duration && <div className="text-danger small mt-1">{error.duration}</div>}
                </div>

                {/* Category & Technology */}
                <div className="col-md-6">
                  <label className="form-label" htmlFor="category">Category</label>
                  <input
                    id="category" type="text" name="category"
                    className="form-control" placeholder="Enter category"
                    value={data.category} onChange={getInputData}
                  />
                  {show && error.category && <div className="text-danger small mt-1">{error.category}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="technology">Technology</label>
                  <input
                    id="technology" type="text" name="technology"
                    className="form-control" placeholder="Enter technology stack"
                    value={data.technology} onChange={getInputData}
                  />
                  {show && error.technology && <div className="text-danger small mt-1">{error.technology}</div>}
                </div>

                {/* Status */}
                <div className="col-md-6">
                  <label className="form-label" htmlFor="active">Status</label>
                  <select
                    id="active" name="active"
                    className="form-select"
                    value={data.active ? "1" : "0"} onChange={getInputData}
                  >
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>

              </div>

              {/* Actions */}
              <div className="d-flex flex-wrap justify-content-end gap-2 mt-4">
                <Link className="btn btn-outline-secondary" to="/service">Cancel</Link>
                <button className="btn btn-primary" type="button" onClick={postSubmit}>
                  <i className="bi bi-check-circle" aria-hidden="true"></i> Create Service
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