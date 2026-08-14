import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import formValidator from "../../FormValidators/formValidator";
import imageValidator from "../../FormValidators/imageValidator";
import { createCertificate, getCertificate } from "../../Redux/ActionCreators/CertificateActionCreators";

const checklist = [
  { dot: "bg-success", title: "Name the certificate", body: "Use the official certificate title."   },
  { dot: "bg-primary", title: "Add issuer",           body: "Note who issued the certificate."       },
  { dot: "bg-warning", title: "Upload image",         body: "A clear scan or badge image works best."},
];

export default function AdminCreateCertificate() {
  let [data, setData] = useState({
    name: "",
    pic: "",
    issuedBy: "",
    active: true,
  });
  let [error, setError] = useState({
    name: "Name Field is Mandatory",
    pic: "Pic Field is Mandatory",
    issuedBy: "Issued By Field is Mandatory",
  });
  let [show, setShow] = useState(false);
  let navigate = useNavigate();

  let CertificateStateData = useSelector((state) => state.CertificateStateData);
  let dispatch = useDispatch();

  function getInputData(e) {
    let name = e.target.name;
    let value = e.target.files ? e.target.files[0] : e.target.value;

    if (name !== "active") {
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
      let item = CertificateStateData.find(
        (x) => x.name.toLocaleLowerCase() === data.name.toLocaleLowerCase()
      );
      if (item) {
        setShow(true);
        setError((old) => ({ ...old, name: "Certificate Already Exist" }));
      } else {
        let formData = new FormData();
        formData.append("name", data.name);
        formData.append("pic", data.pic);
        formData.append("issuedBy", data.issuedBy);
        formData.append("active", data.active);
        dispatch(createCertificate(formData));
        navigate("/certificate");
      }
    }
  }

  useEffect(() => {
    dispatch(getCertificate());
  }, [CertificateStateData.length]);

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
              <h1 className="h3 mb-1">Add Certificate</h1>
              <p className="text-muted mb-0">
                Create a new certificate with name, issuer, and image.
              </p>
            </div>
          </div>
          <div className="heading-actions">
            <Link className="btn btn-outline-secondary btn-sm" to="/certificate">
              <i className="bi bi-arrow-left" aria-hidden="true"></i> Back to Certificates
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
                    <i className="bi bi-patch-check" aria-hidden="true"></i>
                    <span>Certificate Information</span>
                  </h2>
                  <p className="text-muted mb-0">
                    Fill in the details to create a new certificate.
                  </p>
                </div>
              </div>

              <div className="row g-3">

                <div className="col-12">
                  <label className="form-label" htmlFor="name">Name</label>
                  <input
                    className={`form-control ${show && error.name ? "is-invalid" : ""}`}
                    id="name"
                    type="text"
                    name="name"
                    onChange={getInputData}
                    placeholder="Enter Certificate Name"
                  />
                  {show && error.name && (
                    <div className="text-danger small mt-1">{error.name}</div>
                  )}
                </div>

                <div className="col-12">
                  <label className="form-label" htmlFor="issuedBy">Issued By</label>
                  <input
                    className={`form-control ${show && error.issuedBy ? "is-invalid" : ""}`}
                    id="issuedBy"
                    type="text"
                    name="issuedBy"
                    onChange={getInputData}
                    placeholder="Enter Issued By"
                  />
                  {show && error.issuedBy && (
                    <div className="text-danger small mt-1">{error.issuedBy}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="pic">Upload Picture</label>
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
                <Link className="btn btn-outline-secondary" to="/certificate">Cancel</Link>
                <button className="btn btn-primary" type="button" onClick={postSubmit}>
                  <i className="bi bi-check-circle" aria-hidden="true"></i> Create Certificate
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