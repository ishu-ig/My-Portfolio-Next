import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import formValidator from "../../FormValidators/formValidator"
import { updateSkill, getSkill } from '../../Redux/ActionCreators/SkillActionCreators'

export default function AdminUpdateSkill() {
    let { _id } = useParams()

    let [data, setData] = useState({
        name: "",
        description: "",
        level: "",
        active: true
    })
    let [error, setError] = useState({
        name: "",
        description: "",
        level: ""
    })
    let [show, setShow] = useState(false)
    let navigate = useNavigate()

    let SkillStateData = useSelector(state => state.SkillStateData)
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
                [name]: name === "active" ? (value === "1" ? true : false)
                       : name === "level" ? Number(value)
                       : value
            }
        })
    }

    function postSubmit(e) {
        e.preventDefault()
        let errorItem = Object.values(error).find(x => x !== "")
        if (errorItem)
            setShow(true)
        else {
            let item = SkillStateData.find(x => x._id !== _id && x.name.toLocaleLowerCase() === data.name.toLocaleLowerCase())
            if (item) {
                setShow(true)
                setError((old) => {
                    return {
                        ...old,
                        "name": "Skill Already Exist"
                    }
                })
            }
            else {
                dispatch(updateSkill({ ...data }))
                navigate("/skill")
            }
        }
    }

    useEffect(() => {
        (() => {
            dispatch(getSkill())
            if (SkillStateData.length) {
                let item = SkillStateData.find(x => x._id === _id)
                if (item)
                    setData({ ...item })
            }
        })()
    }, [SkillStateData.length])

    return (
        <>
            <div className="container">
                <h5 className="text-center text-light bg-primary p-2">
                    Update Skill
                    <Link to="/skill"><i className="fa fa-arrow-left text-light float-end pt-1"></i></Link>
                </h5>
                <div className="card mt-3 shadow-sm p-4">
                    <form onSubmit={postSubmit}>

                        {/* Name Field */}
                        <div className="mb-3">
                            <label className="fw-bold">Name</label>
                            <input
                                type="text"
                                name="name"
                                onChange={getInputData}
                                value={data.name}
                                placeholder="Enter Skill Name"
                                className={`form-control ${show && error.name ? 'border-danger' : 'border-primary'}`}
                            />
                            {show && error.name && <p className="text-danger mt-1">{error.name}</p>}
                        </div>

                        {/* Description Field */}
                        <div className="mb-3">
                            <label className="fw-bold">Description</label>
                            <textarea
                                name="description"
                                onChange={getInputData}
                                value={data.description}
                                placeholder="Enter Skill Description"
                                rows={3}
                                className={`form-control ${show && error.description ? 'border-danger' : 'border-primary'}`}
                            />
                            {show && error.description && <p className="text-danger mt-1">{error.description}</p>}
                        </div>

                        {/* Level & Active Status */}
                        <div className="row">
                            {/* Level Field */}
                            <div className="col-md-6 mb-3">
                                <label className="fw-bold">Level</label>
                                <input
                                    type="number"
                                    name="level"
                                    onChange={getInputData}
                                    value={data.level}
                                    placeholder="Enter Skill Level"
                                    className={`form-control ${show && error.level ? 'border-danger' : 'border-primary'}`}
                                />
                                {show && error.level && <p className="text-danger mt-1">{error.level}</p>}
                            </div>

                            {/* Active Status */}
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
                                <i className="fa fa-save"></i> Update Skill
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </>
    )
}