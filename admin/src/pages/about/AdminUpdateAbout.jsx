import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import formValidator from "../../FormValidators/formValidator";
import imageValidator from "../../FormValidators/imageValidator";
import resumeValidator from "../../FormValidators/resumeValidator";  // FIX: import resumeValidator
import { updateAbout, getAbout } from "../../Redux/ActionCreators/AboutActionCreators";

const checklist = [
  { dot: "bg-success", title: "Review Details",  body: "Ensure name, heading, and contact info are current." },
  { dot: "bg-primary", title: "Update Files",    body: "Replace profile image or resume if needed." },
  { dot: "bg-warning", title: "Save Changes",    body: "Changes take effect immediately on the site." },
];

const REQUIRED = ["name", "heading", "subtitle", "shortDescription", "longDescription", "phone", "email"];

export default function AdminUpdateAbout() {
  const { _id }        = useParams();
  const navigate       = useNavigate();
  const AboutStateData = useSelector((state) => state.AboutStateData);
  const dispatch       = useDispatch();

  const [data, setData] = useState({
    name: "", heading: "", subtitle: "",
    shortDescription: "", longDescription: "",
    pic: "", resume: "",                        // FIX: was "profileImage" — must match model field "pic"
    phone: "", email: "",
    age: "", occupation: "", nationality: "Indian",
    yearExperience: "", projectsCompleted: "", programmingQuestions: "",
    instaLink: "", gitLink: "", linkidinLink: "",  // FIX: added social links
  });

  const [error, setError] = useState({
    name: "", heading: "", subtitle: "",
    shortDescription: "", longDescription: "",
    phone: "", email: "",
    pic: "", resume: "",   // FIX: was "profileImage"
  });

  const [show, setShow]             = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  function getInputData(e) {
    const name  = e.target.name;
    const value = e.target.files ? e.target.files[0] : e.target.value;

    if (REQUIRED.includes(name)) {
      setError((old) => ({ ...old, [name]: formValidator(e) }));
    }
    // FIX: pic uses imageValidator, resume uses resumeValidator
    if (name === "pic" && e.target.files?.length) {
      setError((old) => ({ ...old, pic: imageValidator(e) }));
    }
    if (name === "resume" && e.target.files?.length) {
      setError((old) => ({ ...old, resume: resumeValidator(e) }));
    }
    if (name === "pic" && e.target.files?.[0]) {
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }

    setData((old) => ({ ...old, [name]: value }));
  }

  function postSubmit(e) {
    e.preventDefault();
    const errorItem = Object.values(error).find((x) => x !== "");
    if (errorItem) { setShow(true); return; }

    const formData = new FormData();
    formData.append("_id", data._id);
    Object.entries(data).forEach(([key, val]) => {
      if (key !== "_id") formData.append(key, val);
    });
    dispatch(updateAbout(formData));
    navigate("/about");
  }

  useEffect(() => {
    dispatch(getAbout());
    if (AboutStateData?.length) {
      const item = AboutStateData.find((x) => x._id === _id);
      if (item) {
        setData({
          ...item,
          pic:    item.pic    ?? "",   // FIX: correctly map pic
          resume: item.resume ?? "",
        });
        if (item.pic) setImagePreview(item.pic);  // FIX: was item.profileImage
      }
    }
  }, [AboutStateData?.length, _id]);   // FIX: added _id to dependency array

  return (
    <main className="dashboard-content">
      <div className="container-fluid px-3 px-lg-4 py-4">

        <div className="page-heading">
          <div className="page-heading-copy">
            <span className="page-icon"><i className="bi bi-person-gear" aria-hidden="true"></i></span>
            <div>
              <p className="eyebrow mb-1">Management</p>
              <h1 className="h3 mb-1">Update About</h1>
              <p className="text-muted mb-0">Edit the profile details below.</p>
            </div>
          </div>
          <div className="heading-actions">
            <Link className="btn btn-outline-secondary btn-sm" to="/about">
              <i className="bi bi-arrow-left" aria-hidden="true"></i> Back to About
            </Link>
          </div>
        </div>

        {show && (
          <div className="alert alert-danger alert-dismissible" role="alert">
            {Object.values(error).find((x) => x !== "")}
            <button type="button" className="btn-close" onClick={() => setShow(false)} aria-label="Close" />
          </div>
        )}

        <section className="row g-3">
          <div className="col-12 col-xl-8">
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2 className="h5 mb-1 section-title">
                    <i className="bi bi-person-vcard" aria-hidden="true"></i>
                    <span>Profile Information</span>
                  </h2>
                  <p className="text-muted mb-0">Update the details for this About entry.</p>
                </div>
              </div>

              <div className="row g-3">

                <div className="col-md-6">
                  <label className="form-label" htmlFor="name">Name</label>
                  <input id="name" type="text" name="name" className="form-control"
                    placeholder="Your full name" value={data.name} onChange={getInputData} />
                  {show && error.name && <div className="text-danger small mt-1">{error.name}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="heading">Heading</label>
                  <input id="heading" type="text" name="heading" className="form-control"
                    placeholder="e.g. Full Stack Developer" value={data.heading} onChange={getInputData} />
                  {show && error.heading && <div className="text-danger small mt-1">{error.heading}</div>}
                </div>

                <div className="col-12">
                  <label className="form-label" htmlFor="subtitle">Subtitle</label>
                  <input id="subtitle" type="text" name="subtitle" className="form-control"
                    placeholder="A short tagline or subtitle" value={data.subtitle} onChange={getInputData} />
                  {show && error.subtitle && <div className="text-danger small mt-1">{error.subtitle}</div>}
                </div>

                <div className="col-12">
                  <label className="form-label" htmlFor="shortDescription">Short Description</label>
                  <input id="shortDescription" type="text" name="shortDescription" className="form-control"
                    placeholder="Brief intro (1–2 sentences)" value={data.shortDescription} onChange={getInputData} />
                  {show && error.shortDescription && <div className="text-danger small mt-1">{error.shortDescription}</div>}
                </div>

                <div className="col-12">
                  <label className="form-label" htmlFor="longDescription">Long Description</label>
                  <textarea id="longDescription" name="longDescription" rows={4} className="form-control"
                    placeholder="Detailed bio or about text" value={data.longDescription} onChange={getInputData} />
                  {show && error.longDescription && <div className="text-danger small mt-1">{error.longDescription}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="phone">Phone</label>
                  <input id="phone" type="text" name="phone" className="form-control"
                    placeholder="+91 98765 43210" value={data.phone} onChange={getInputData} />
                  {show && error.phone && <div className="text-danger small mt-1">{error.phone}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="email">Email</label>
                  <input id="email" type="email" name="email" className="form-control"
                    placeholder="you@example.com" value={data.email} onChange={getInputData} />
                  {show && error.email && <div className="text-danger small mt-1">{error.email}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="age">Age <span className="text-muted fw-normal">(optional)</span></label>
                  <input id="age" type="number" name="age" min="0" className="form-control"
                    placeholder="e.g. 25" value={data.age} onChange={getInputData} />
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="occupation">Occupation <span className="text-muted fw-normal">(optional)</span></label>
                  <input id="occupation" type="text" name="occupation" className="form-control"
                    placeholder="e.g. Software Engineer" value={data.occupation} onChange={getInputData} />
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="nationality">Nationality <span className="text-muted fw-normal">(optional)</span></label>
                  <input id="nationality" type="text" name="nationality" className="form-control"
                    placeholder="e.g. Indian" value={data.nationality} onChange={getInputData} />
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="yearExperience">Years of Experience <span className="text-muted fw-normal">(optional)</span></label>
                  <input id="yearExperience" type="number" name="yearExperience" min="0" className="form-control"
                    placeholder="e.g. 3" value={data.yearExperience} onChange={getInputData} />
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="projectsCompleted">Projects Completed <span className="text-muted fw-normal">(optional)</span></label>
                  <input id="projectsCompleted" type="number" name="projectsCompleted" min="0" className="form-control"
                    placeholder="e.g. 20" value={data.projectsCompleted} onChange={getInputData} />
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="programmingQuestions">Questions Solved <span className="text-muted fw-normal">(optional)</span></label>
                  <input id="programmingQuestions" type="number" name="programmingQuestions" min="0" className="form-control"
                    placeholder="e.g. 500" value={data.programmingQuestions} onChange={getInputData} />
                </div>

                {/* FIX: Social link fields */}
                <div className="col-12">
                  <label className="form-label" htmlFor="gitLink">GitHub URL <span className="text-muted fw-normal">(optional)</span></label>
                  <input id="gitLink" type="url" name="gitLink" className="form-control"
                    placeholder="https://github.com/username" value={data.gitLink} onChange={getInputData} />
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="linkidinLink">LinkedIn URL <span className="text-muted fw-normal">(optional)</span></label>
                  <input id="linkidinLink" type="url" name="linkidinLink" className="form-control"
                    placeholder="https://linkedin.com/in/username" value={data.linkidinLink} onChange={getInputData} />
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="instaLink">Instagram URL <span className="text-muted fw-normal">(optional)</span></label>
                  <input id="instaLink" type="url" name="instaLink" className="form-control"
                    placeholder="https://instagram.com/username" value={data.instaLink} onChange={getInputData} />
                </div>

                {/* FIX: file input name changed from "profileImage" to "pic" to match model */}
                <div className="col-md-6">
                  <label className="form-label" htmlFor="pic">
                    Profile Image <span className="text-muted fw-normal">(leave blank to keep current)</span>
                  </label>
                  <input id="pic" type="file" name="pic" className="form-control"
                    onChange={getInputData} accept="image/jpeg,image/png,image/webp" />
                  {show && error.pic && <div className="text-danger small mt-1">{error.pic}</div>}
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview"
                      className="mt-2 rounded-circle border"
                      style={{ width: 72, height: 72, objectFit: "cover" }} />
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="resume">
                    Resume <span className="text-muted fw-normal">(leave blank to keep current — PDF)</span>
                  </label>
                  <input id="resume" type="file" name="resume" className="form-control"
                    onChange={getInputData} accept="application/pdf" />
                  {show && error.resume && <div className="text-danger small mt-1">{error.resume}</div>}
                </div>

              </div>

              <div className="d-flex flex-wrap justify-content-end gap-2 mt-4">
                <Link className="btn btn-outline-secondary" to="/about">Cancel</Link>
                <button className="btn btn-primary" type="button" onClick={postSubmit}>
                  <i className="bi bi-check-circle" aria-hidden="true"></i> Update About
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