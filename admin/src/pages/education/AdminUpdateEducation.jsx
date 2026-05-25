import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import formValidator from "../../FormValidators/formValidator"
import { updateEducation, getEducation } from '../../Redux/ActionCreators/EducationActionCreators'

export default function AdminUpdateEducation() {
    let { _id } = useParams()

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
        degreeName: "",
        instituteName: "",
        startDate: "",
        description: ""
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
            let item = EducationStateData.find(x => x._id !== _id && x.degreeName.toLocaleLowerCase() === data.degreeName.toLocaleLowerCase())
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
                dispatch(updateEducation({ ...data }))
                navigate("/education")
            }
        }
    }

    useEffect(() => {
        (() => {
            dispatch(getEducation())
            if (EducationStateData.length) {
                let item = EducationStateData.find(x => x._id === _id)
                if (item)
                    setData({ ...item })
            }
        })()
    }, [EducationStateData.length])

    return (
        <>
            <div className="container">
                <h5 className="text-center text-light bg-primary p-2">
                    Update Education{' '}
                    <Link to="/education"><i className="fa fa-arrow-left text-light float-end pt-1"></i></Link>
                </h5>

                <div className="card mt-3 shadow-sm p-4">
                    <form onSubmit={postSubmit}>

                        {/* Degree Name */}
                        <div className="mb-3">
                            <label className="fw-bold">Degree Name</label>
                            <input
                                type="text"
                                name="degreeName"
                                onChange={getInputData}
                                value={data.degreeName}
                                placeholder="Enter Degree Name"
                                className={`form-control ${show && error.degreeName ? 'border-danger' : 'border-primary'}`}
                            />
                            {show && error.degreeName && <p className="text-danger mt-1">{error.degreeName}</p>}
                        </div>

                        {/* Institute Name */}
                        <div className="mb-3">
                            <label className="fw-bold">Institute Name</label>
                            <input
                                type="text"
                                name="instituteName"
                                onChange={getInputData}
                                value={data.instituteName}
                                placeholder="Enter Institute Name"
                                className={`form-control ${show && error.instituteName ? 'border-danger' : 'border-primary'}`}
                            />
                            {show && error.instituteName && <p className="text-danger mt-1">{error.instituteName}</p>}
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
                                    className="form-control border-primary"
                                />
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

                        {/* CGPA & Active */}
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="fw-bold">CGPA</label>
                                <input
                                    type="text"
                                    name="cgpa"
                                    onChange={getInputData}
                                    value={data.cgpa}
                                    placeholder="Enter CGPA (optional)"
                                    className="form-control border-primary"
                                />
                            </div>

                            <div className="col-md-6 mb-3">
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
                        </div>

                        {/* Submit Button */}
                        <div className="mb-3">
                            <button type="submit" className="btn btn-primary w-100 text-light p-2">
                                <i className="fa fa-save"></i> Update Education
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </>
    )
}