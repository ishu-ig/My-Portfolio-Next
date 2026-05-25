import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import formValidator from "../../FormValidators/formValidator"
import { updateExperience, getExperience } from '../../Redux/ActionCreators/ExperienceActionCreators'

export default function AdminUpdateExperience() {
    let { _id } = useParams()

    let [data, setData] = useState({
        jobTitle: "",
        companyName: "",
        startDate: "",
        endDate: "",
        description: "",
        active: true
    })
    let [error, setError] = useState({
        jobTitle: "",
        companyName: "",
        startDate: "",
        endDate: "",
        description: ""
    })
    let [show, setShow] = useState(false)
    let navigate = useNavigate()

    let ExperienceStateData = useSelector(state => state.ExperienceStateData)
    let dispatch = useDispatch()

    function getInputData(e) {
        let name = e.target.name
        let value = e.target.value

        if (name !== "active") {
            setError((old) => {
                return {
                    ...old,
                    [name]: formValidator(e)
                }
            })
        }
        setData((old) => {
            return {
                ...old,
                [name]: name === "active" ? (value === "1" ? true : false) : value
            }
        })
    }

    function postSubmit(e) {
        e.preventDefault()
        let errorItem = Object.values(error).find(x => x !== "")
        if (errorItem)
            setShow(true)
        else {
            let item = ExperienceStateData.find(x => x._id !== _id && x.jobTitle.toLocaleLowerCase() === data.jobTitle.toLocaleLowerCase())
            if (item) {
                setShow(true)
                setError((old) => {
                    return {
                        ...old,
                        "jobTitle": "Experience Record Already Exist"
                    }
                })
            }
            else {
                dispatch(updateExperience({ ...data }))
                navigate("/experience")
            }
        }
    }

    useEffect(() => {
        (() => {
            dispatch(getExperience())
            if (ExperienceStateData.length) {
                let item = ExperienceStateData.find(x => x._id === _id)
                if (item)
                    setData({ ...item })
            }
        })()
    }, [ExperienceStateData.length])

    return (
        <>
            <div className="container">
                <h5 className="text-center text-light bg-primary p-2">
                    Update Experience{' '}
                    <Link to="/experience"><i className="fa fa-arrow-left text-light float-end pt-1"></i></Link>
                </h5>

                <div className="card mt-3 shadow-sm p-4">
                    <form onSubmit={postSubmit}>

                        {/* Job Title */}
                        <div className="mb-3">
                            <label className="fw-bold">Job Title</label>
                            <input
                                type="text"
                                name="jobTitle"
                                onChange={getInputData}
                                value={data.jobTitle}
                                placeholder="Enter Job Title"
                                className={`form-control ${show && error.jobTitle ? 'border-danger' : 'border-primary'}`}
                            />
                            {show && error.jobTitle && <p className="text-danger mt-1">{error.jobTitle}</p>}
                        </div>

                        {/* Company Name */}
                        <div className="mb-3">
                            <label className="fw-bold">Company Name</label>
                            <input
                                type="text"
                                name="companyName"
                                onChange={getInputData}
                                value={data.companyName}
                                placeholder="Enter Company Name"
                                className={`form-control ${show && error.companyName ? 'border-danger' : 'border-primary'}`}
                            />
                            {show && error.companyName && <p className="text-danger mt-1">{error.companyName}</p>}
                        </div>

                        {/* Start Date & End Date */}
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="fw-bold">Start Date</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    onChange={getInputData}
                                    value={data.startDate}
                                    className={`form-control ${show && error.startDate ? 'border-danger' : 'border-primary'}`}
                                />
                                {show && error.startDate && <p className="text-danger mt-1">{error.startDate}</p>}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="fw-bold">End Date</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    onChange={getInputData}
                                    value={data.endDate}
                                    className={`form-control ${show && error.endDate ? 'border-danger' : 'border-primary'}`}
                                />
                                {show && error.endDate && <p className="text-danger mt-1">{error.endDate}</p>}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-3">
                            <label className="fw-bold">Description</label>
                            <textarea
                                name="description"
                                onChange={getInputData}
                                value={data.description}
                                placeholder="Enter Description"
                                rows={3}
                                className={`form-control ${show && error.description ? 'border-danger' : 'border-primary'}`}
                            />
                            {show && error.description && <p className="text-danger mt-1">{error.description}</p>}
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
                                <i className="fa fa-save"></i> Update Experience
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </>
    )
}