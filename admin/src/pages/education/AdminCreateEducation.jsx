import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import formValidator from "../../FormValidators/formValidator"
import { createEducation, getEducation } from '../../Redux/ActionCreators/EducationActionCreators'

export default function AdminCreateEducation() {
    let [data, setData] = useState({
        degreeName: "",
        instituteName: "",
        startDate: "",
        endDate: "",
        description: "",
        cgpa: "",
        active: true
    })
    let [error, setError] = useState({
        degreeName: "Degree Name Field is Mandatory",
        instituteName: "Institute Name Field is Mandatory",
        startDate: "Start Date Field is Mandatory",
        description: "Description Field is Mandatory"
    })
    let [show, setShow] = useState(false)
    let navigate = useNavigate()

    let EducationStateData = useSelector(state => state.EducationStateData)
    let dispatch = useDispatch()

    function getInputData(e) {
        let name = e.target.name
        let value = e.target.value

        if (name !== "active" && name !== "endDate" && name !== "cgpa") {
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
            let item = EducationStateData.find(x => x.degreeName.toLocaleLowerCase() === data.degreeName.toLocaleLowerCase())
            if (item) {
                setShow(true)
                setError((old) => {
                    return {
                        ...old,
                        "degreeName": "Education Record Already Exist"
                    }
                })
            }
            else {
                dispatch(createEducation({ ...data }))
                navigate("/education")
            }
        }
    }

    useEffect(() => {
        (() => {
            dispatch(getEducation())
        })()
    }, [EducationStateData.length])

    return (
        <>
            <div className="container">
                <h5 className="text-center text-light bg-primary p-2">
                    Create Education{' '}
                    <Link to="/education"><i className="fa fa-arrow-left text-light float-end pt-1"></i></Link>
                </h5>

                <div className="card mt-3 shadow-sm p-4">
                    <form onSubmit={postSubmit}>

                        {/* Degree Name */}
                        <div className="mb-3">
                            <label className="fw-bold">Degree Name*</label>
                            <input
                                type="text"
                                name="degreeName"
                                onChange={getInputData}
                                placeholder="Enter Degree Name"
                                className={`form-control ${show && error.degreeName ? 'border-danger' : 'border-primary'}`}
                            />
                            {show && error.degreeName && <p className="text-danger mt-1">{error.degreeName}</p>}
                        </div>

                        {/* Institute Name */}
                        <div className="mb-3">
                            <label className="fw-bold">Institute Name*</label>
                            <input
                                type="text"
                                name="instituteName"
                                onChange={getInputData}
                                placeholder="Enter Institute Name"
                                className={`form-control ${show && error.instituteName ? 'border-danger' : 'border-primary'}`}
                            />
                            {show && error.instituteName && <p className="text-danger mt-1">{error.instituteName}</p>}
                        </div>

                        {/* Start Date & End Date */}
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="fw-bold">Start Date*</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    onChange={getInputData}
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
                                    className="form-control border-primary"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-3">
                            <label className="fw-bold">Description*</label>
                            <textarea
                                name="description"
                                onChange={getInputData}
                                placeholder="Enter Description"
                                rows={3}
                                className={`form-control ${show && error.description ? 'border-danger' : 'border-primary'}`}
                            />
                            {show && error.description && <p className="text-danger mt-1">{error.description}</p>}
                        </div>

                        {/* CGPA & Active */}
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="fw-bold">CGPA</label>
                                <input
                                    type="text"
                                    name="cgpa"
                                    onChange={getInputData}
                                    placeholder="Enter CGPA (optional)"
                                    className="form-control border-primary"
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="fw-bold">Active</label>
                                <select
                                    name="active"
                                    onChange={getInputData}
                                    className="form-select border-primary"
                                >
                                    <option value="1">Yes</option>
                                    <option value="0">No</option>
                                </select>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mb-3">
                            <button type="submit" className="btn btn-primary w-100 text-light">
                                <i className="fa fa-save"></i> Create Education
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </>
    )
}