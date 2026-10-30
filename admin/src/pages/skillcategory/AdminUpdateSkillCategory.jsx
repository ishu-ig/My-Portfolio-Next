import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import formValidator from "../../FormValidators/formValidator";
import { updateSkillCategory, getSkillCategory } from "../../Redux/ActionCreators/SkillCategoryActionCreators";

const checklist = [
    { dot: "bg-success", title: "Review name", body: "Confirm the name is still correct." },
    { dot: "bg-primary", title: "Check status", body: "Inactive items are hidden from the site." },
    { dot: "bg-warning", title: "Save changes", body: "Changes take effect immediately." },
];

export default function AdminUpdateSkillCategory() {
    let { _id } = useParams();

    let [data, setData] = useState({
        name: "",
        active: true,
    });
    let [error, setError] = useState({
        name: "",
    });
    let [show, setShow] = useState(false);
    let navigate = useNavigate();

    let SkillCategoryStateData = useSelector((state) => state.SkillCategoryStateData);
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
            [name]: name === "active" ? value === "1" : value,
        }));
    }

    function postSubmit(e) {
        e.preventDefault();
        let errorItem = Object.values(error).find((x) => x !== "");
        if (errorItem) {
            setShow(true);
        } else {
            let item = Array.isArray(SkillCategoryStateData)
                ? SkillCategoryStateData.find(
                    (x) =>
                        x._id !== _id &&
                        (x?.name || "").trim().toLowerCase() === (data.name || "").trim().toLowerCase()
                )
                : null;
            if (item) {
                setShow(true);
                setError((old) => ({ ...old, name: "Skill Category Already Exist" }));
            } else {
                dispatch(updateSkillCategory({ ...data, _id: _id }));
                navigate("/skill-category");
            }
        }
    }

    useEffect(() => {
        dispatch(getSkillCategory());
    }, [dispatch]);

    useEffect(() => {
        if (Array.isArray(SkillCategoryStateData) && SkillCategoryStateData.length) {
            let item = SkillCategoryStateData.find((x) => x._id === _id);
            if (item) {
                setData({
                    name: item.name || "",
                    active: item.active !== undefined ? item.active : true,
                    _id: item._id,
                });
            }
        }
    }, [SkillCategoryStateData, _id]);

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
                            <h1 className="h3 mb-1">Update Skill Category</h1>
                            <p className="text-muted mb-0">
                                Edit the skill category name and status.
                            </p>
                        </div>
                    </div>
                    <div className="heading-actions">
                        <Link className="btn btn-outline-secondary btn-sm" to="/skill-category">
                            <i className="bi bi-arrow-left" aria-hidden="true"></i> Back to Skill Categories
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
                                        <span>Skill Category Information</span>
                                    </h2>
                                    <p className="text-muted mb-0">
                                        Update the details for this skill category.
                                    </p>
                                </div>
                            </div>

                            <div className="row g-3">

                                <div className="col-md-8">
                                    <label className="form-label" htmlFor="name">Name</label>
                                    <input
                                        className={`form-control ${show && error.name ? "is-invalid" : ""}`}
                                        id="name"
                                        type="text"
                                        name="name"
                                        onChange={getInputData}
                                        value={data.name}
                                        placeholder="Enter Skill Category Name"
                                    />
                                    {show && error.name && (
                                        <div className="text-danger small mt-1">{error.name}</div>
                                    )}
                                </div>

                                <div className="col-md-4">
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
                                <Link className="btn btn-outline-secondary" to="/skill-category">Cancel</Link>
                                <button className="btn btn-primary" type="button" onClick={postSubmit}>
                                    <i className="bi bi-check-circle" aria-hidden="true"></i> Update Skill Category
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