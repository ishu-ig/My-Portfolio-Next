import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import formValidator from "../../FormValidators/formValidator"
import { updateResume, getResume } from '../../Redux/ActionCreators/ResumeActionCreators'
import { getSkill } from '../../Redux/ActionCreators/SkillActionCreators'
import { getEducation } from '../../Redux/ActionCreators/EducationActionCreators'
import { getExperience } from '../../Redux/ActionCreators/ExperienceActionCreators'
import { getPortfolio } from '../../Redux/ActionCreators/PortfolioActionCreators'
import { getCertificate } from '../../Redux/ActionCreators/CertificateActionCreators'
import { getService } from '../../Redux/ActionCreators/ServiceActionCreators'

export default function AdminUpdateResume() {
    let { _id } = useParams()

    let [data, setData] = useState({
        about: {
            summary: "",
            skills: [],
            education: [],
            experience: [],
            projects: [],
            certificates: [],
            services: []
        },
        contact: {
            email: "",
            github: "",
            linkedin: "",
            portfolio: ""
        },
        skills: [],
        education: [],
        experience: [],
        projects: [],
        certificates: [],
        services: [],
        active: true
    })

    let [error, setError] = useState({
        summary: "",
        email: "",
        github: "",
        linkedin: "",
        portfolio: ""
    })

    let [show, setShow] = useState(false)
    let navigate = useNavigate()

    let ResumeStateData = useSelector(state => state.ResumeStateData)
    let SkillStateData = useSelector(state => state.SkillStateData)
    let EducationStateData = useSelector(state => state.EducationStateData)
    let ExperienceStateData = useSelector(state => state.ExperienceStateData)
    let PortfolioStateData = useSelector(state => state.PortfolioStateData)
    let CertificateStateData = useSelector(state => state.CertificateStateData)
    let ServiceStateData = useSelector(state => state.ServiceStateData)
    let dispatch = useDispatch()

    // Normalize ObjectId refs → string IDs for checkbox matching
    function normalizeIds(arr) {
        if (!arr) return []
        return arr.map(x => (typeof x === "object" && x._id ? x._id : x).toString())
    }

    function getInputData(e) {
        let name = e.target.name
        let value = e.target.value

        if (name === "summary") {
            setError(old => ({ ...old, summary: formValidator(e) }))
            setData(old => ({ ...old, about: { ...old.about, summary: value } }))
        } else if (["email", "github", "linkedin", "portfolio"].includes(name)) {
            setError(old => ({ ...old, [name]: formValidator(e) }))
            setData(old => ({ ...old, contact: { ...old.contact, [name]: value } }))
        } else if (name === "active") {
            setData(old => ({ ...old, active: value === "1" ? true : false }))
        }
    }

    function handleCheckbox(e, section, isAbout = false) {
        let value = e.target.value
        let checked = e.target.checked

        if (isAbout) {
            setData(old => {
                let current = old.about[section]
                let updated = checked ? [...current, value] : current.filter(x => x !== value)
                return { ...old, about: { ...old.about, [section]: updated } }
            })
        } else {
            setData(old => {
                let current = old[section]
                let updated = checked ? [...current, value] : current.filter(x => x !== value)
                return { ...old, [section]: updated }
            })
        }
    }

    function postSubmit(e) {
        e.preventDefault()
        let errorItem = Object.values(error).find(x => x !== "")
        if (errorItem)
            setShow(true)
        else {
            dispatch(updateResume({ ...data, _id }))
            navigate("/resume")
        }
    }

    useEffect(() => {
        dispatch(getResume())
        dispatch(getSkill())
        dispatch(getEducation())
        dispatch(getExperience())
        dispatch(getPortfolio())
        dispatch(getCertificate())
        dispatch(getService())
    }, [])

    useEffect(() => {
        if (ResumeStateData && ResumeStateData.length) {
            let item = ResumeStateData.find(x => x._id === _id)
            if (item) {
                setData({
                    ...item,
                    about: {
                        ...item.about,
                        skills: normalizeIds(item.about?.skills),
                        education: normalizeIds(item.about?.education),
                        experience: normalizeIds(item.about?.experience),
                        projects: normalizeIds(item.about?.projects),
                        certificates: normalizeIds(item.about?.certificates),
                        services: normalizeIds(item.about?.services),
                    },
                    skills: normalizeIds(item.skills),
                    education: normalizeIds(item.education),
                    experience: normalizeIds(item.experience),
                    projects: normalizeIds(item.projects),
                    certificates: normalizeIds(item.certificates),
                    services: normalizeIds(item.services),
                })
            }
        }
    }, [ResumeStateData.length])

    function CheckboxGroup({ label, items, labelKey, section, isAbout = false, selectedValues }) {
        return (
            <div className="mb-3">
                <label className="fw-bold">{label}</label>
                <div className="border border-primary rounded p-3" style={{ maxHeight: "160px", overflowY: "auto" }}>
                    {items && items.length > 0 ? items.map(item => (
                        <div className="form-check" key={item._id}>
                            <input
                                className="form-check-input"
                                type="checkbox"
                                value={item._id}
                                checked={selectedValues.includes(item._id.toString())}
                                onChange={(e) => handleCheckbox(e, section, isAbout)}
                                id={`${section}-${isAbout ? "about-" : ""}${item._id}`}
                            />
                            <label className="form-check-label" htmlFor={`${section}-${isAbout ? "about-" : ""}${item._id}`}>
                                {item[labelKey]}
                            </label>
                        </div>
                    )) : <p className="text-muted mb-0">No records found</p>}
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="container">
                <h5 className="text-center text-light bg-primary p-2">
                    Update Resume{' '}
                    <Link to="/resume"><i className="fa fa-arrow-left text-light float-end pt-1"></i></Link>
                </h5>

                <div className="card mt-3 shadow-sm p-4">
                    <form onSubmit={postSubmit}>

                        {/* ── ABOUT SECTION ── */}
                        <h6 className="fw-bold text-primary border-bottom pb-1 mb-3">About Section</h6>

                        {/* Summary */}
                        <div className="mb-3">
                            <label className="fw-bold">Summary</label>
                            <textarea
                                name="summary"
                                onChange={getInputData}
                                value={data.about.summary}
                                placeholder="Enter Summary"
                                rows={3}
                                className={`form-control ${show && error.summary ? 'border-danger' : 'border-primary'}`}
                            />
                            {show && error.summary && <p className="text-danger mt-1">{error.summary}</p>}
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <CheckboxGroup label="Skills (About)" items={SkillStateData} labelKey="name" section="skills" isAbout={true} selectedValues={data.about.skills} />
                            </div>
                            <div className="col-md-6">
                                <CheckboxGroup label="Education (About)" items={EducationStateData} labelKey="degreeName" section="education" isAbout={true} selectedValues={data.about.education} />
                            </div>
                            <div className="col-md-6">
                                <CheckboxGroup label="Experience (About)" items={ExperienceStateData} labelKey="jobTitle" section="experience" isAbout={true} selectedValues={data.about.experience} />
                            </div>
                            <div className="col-md-6">
                                <CheckboxGroup label="Projects (About)" items={PortfolioStateData} labelKey="name" section="projects" isAbout={true} selectedValues={data.about.projects} />
                            </div>
                            <div className="col-md-6">
                                <CheckboxGroup label="Certificates (About)" items={CertificateStateData} labelKey="name" section="certificates" isAbout={true} selectedValues={data.about.certificates} />
                            </div>
                            <div className="col-md-6">
                                <CheckboxGroup label="Services (About)" items={ServiceStateData} labelKey="name" section="services" isAbout={true} selectedValues={data.about.services} />
                            </div>
                        </div>

                        {/* ── CONTACT SECTION ── */}
                        <h6 className="fw-bold text-primary border-bottom pb-1 mb-3 mt-2">Contact Section</h6>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="fw-bold">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    onChange={getInputData}
                                    value={data.contact.email}
                                    placeholder="Enter Email"
                                    className={`form-control ${show && error.email ? 'border-danger' : 'border-primary'}`}
                                />
                                {show && error.email && <p className="text-danger mt-1">{error.email}</p>}
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="fw-bold">GitHub</label>
                                <input
                                    type="text"
                                    name="github"
                                    onChange={getInputData}
                                    value={data.contact.github}
                                    placeholder="Enter GitHub URL"
                                    className={`form-control ${show && error.github ? 'border-danger' : 'border-primary'}`}
                                />
                                {show && error.github && <p className="text-danger mt-1">{error.github}</p>}
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="fw-bold">LinkedIn</label>
                                <input
                                    type="text"
                                    name="linkedin"
                                    onChange={getInputData}
                                    value={data.contact.linkedin}
                                    placeholder="Enter LinkedIn URL"
                                    className={`form-control ${show && error.linkedin ? 'border-danger' : 'border-primary'}`}
                                />
                                {show && error.linkedin && <p className="text-danger mt-1">{error.linkedin}</p>}
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="fw-bold">Portfolio URL</label>
                                <input
                                    type="text"
                                    name="portfolio"
                                    onChange={getInputData}
                                    value={data.contact.portfolio}
                                    placeholder="Enter Portfolio URL"
                                    className={`form-control ${show && error.portfolio ? 'border-danger' : 'border-primary'}`}
                                />
                                {show && error.portfolio && <p className="text-danger mt-1">{error.portfolio}</p>}
                            </div>
                        </div>

                        {/* ── TOP-LEVEL REF ARRAYS ── */}
                        <h6 className="fw-bold text-primary border-bottom pb-1 mb-3 mt-2">Resume Sections</h6>

                        <div className="row">
                            <div className="col-md-6">
                                <CheckboxGroup label="Skills*" items={SkillStateData} labelKey="name" section="skills" selectedValues={data.skills} />
                            </div>
                            <div className="col-md-6">
                                <CheckboxGroup label="Education*" items={EducationStateData} labelKey="degreeName" section="education" selectedValues={data.education} />
                            </div>
                            <div className="col-md-6">
                                <CheckboxGroup label="Experience" items={ExperienceStateData} labelKey="jobTitle" section="experience" selectedValues={data.experience} />
                            </div>
                            <div className="col-md-6">
                                <CheckboxGroup label="Projects*" items={PortfolioStateData} labelKey="name" section="projects" selectedValues={data.projects} />
                            </div>
                            <div className="col-md-6">
                                <CheckboxGroup label="Certificates" items={CertificateStateData} labelKey="name" section="certificates" selectedValues={data.certificates} />
                            </div>
                            <div className="col-md-6">
                                <CheckboxGroup label="Services" items={ServiceStateData} labelKey="name" section="services" selectedValues={data.services} />
                            </div>
                        </div>

                        {/* Active */}
                        <div className="mb-3">
                            <label className="fw-bold">Active</label>
                            <select
                                name="active"
                                value={data.active ? "1" : "0"}
                                onChange={getInputData}
                                className="form-select border-primary"
                            >
                                <option value="1">Yes</option>
                                <option value="0">No</option>
                            </select>
                        </div>

                        {/* Submit Button */}
                        <div className="mb-3">
                            <button type="submit" className="btn btn-primary w-100 text-light p-2">
                                <i className="fa fa-save"></i> Update Resume
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </>
    )
}