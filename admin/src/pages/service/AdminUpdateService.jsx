import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import formValidator from "../../FormValidators/formValidator"
import { updateService, getService } from '../../Redux/ActionCreators/ServiceActionCreators'

export default function AdminUpdateService() {
    let { _id } = useParams()

    let [data, setData] = useState({
        name: "",
        icon: "",
        shortDescription: "",
        longDescription: "",
        price: "",
        duration: "",
        category: "",
        technology: "",
        active: true
    })
    let [error, setError] = useState({
        name: "",
        icon: "",
        shortDescription: "",
        longDescription: "",
        price: "",
        duration: "",
        category: "",
        technology: ""
    })
    let [show, setShow] = useState(false)
    let navigate = useNavigate()

    let ServiceStateData = useSelector(state => state.ServiceStateData)
    let dispatch = useDispatch()

    function getInputData(e) {
        let name = e.target.name
        let value = e.target.value

        if (name !== "active") {
            setError((old) => ({
                ...old,
                [name]: formValidator(e)
            }))
        }
        setData((old) => ({
            ...old,
            [name]: name === "active" ? (value === "1" ? true : false) : value
        }))
    }

    function postSubmit(e) {
        e.preventDefault()
        let errorItem = Object.values(error).find(x => x !== "")
        if (errorItem)
            setShow(true)
        else {
            let item = ServiceStateData.find(x => x._id !== _id && x.name.toLocaleLowerCase() === data.name.toLocaleLowerCase())
            if (item) {
                setShow(true)
                setError((old) => ({
                    ...old,
                    "name": "Service Already Exist"
                }))
            }
            else {
                dispatch(updateService({ ...data }))
                navigate("/service")
            }
        }
    }

    useEffect(() => {
        (() => {
            dispatch(getService())
            if (ServiceStateData.length) {
                let item = ServiceStateData.find(x => x._id === _id)
                if (item)
                    setData({ ...item })
            }
        })()
    }, [ServiceStateData.length])

    return (
        <>
            <div className="container">
                <h5 className="text-center text-light bg-primary p-2">
                    Update Service{' '}
                    <Link to="/service"><i className="fa fa-arrow-left text-light float-end pt-1"></i></Link>
                </h5>

                <div className="card mt-3 shadow-sm p-4">
                    <form onSubmit={postSubmit}>

                        {/* Name */}
                        <div className="mb-3">
                            <label className="fw-bold">Name</label>
                            <input
                                type="text"
                                name="name"
                                onChange={getInputData}
                                value={data.name}
                                placeholder="Enter Service Name"
                                className={`form-control ${show && error.name ? 'border-danger' : 'border-primary'}`}
                            />
                            {show && error.name && <p className="text-danger mt-1">{error.name}</p>}
                        </div>

                        {/* Icon */}
                        <div className="mb-3">
                            <label className="fw-bold">Icon <small className="text-muted fw-normal">(e.g. fa fa-code)</small></label>
                            <div className="input-group">
                                <span className="input-group-text border-primary">
                                    <i className={data.icon}></i>
                                </span>
                                <input
                                    type="text"
                                    name="icon"
                                    onChange={getInputData}
                                    value={data.icon}
                                    placeholder="Enter FontAwesome Icon Class"
                                    className={`form-control ${show && error.icon ? 'border-danger' : 'border-primary'}`}
                                />
                            </div>
                            {show && error.icon && <p className="text-danger mt-1">{error.icon}</p>}
                        </div>

                        {/* Short Description */}
                        <div className="mb-3">
                            <label className="fw-bold">Short Description</label>
                            <input
                                type="text"
                                name="shortDescription"
                                onChange={getInputData}
                                value={data.shortDescription}
                                placeholder="Enter Short Description"
                                className={`form-control ${show && error.shortDescription ? 'border-danger' : 'border-primary'}`}
                            />
                            {show && error.shortDescription && <p className="text-danger mt-1">{error.shortDescription}</p>}
                        </div>

                        {/* Long Description */}
                        <div className="mb-3">
                            <label className="fw-bold">Long Description</label>
                            <textarea
                                name="longDescription"
                                onChange={getInputData}
                                value={data.longDescription}
                                placeholder="Enter Long Description"
                                rows={4}
                                className={`form-control ${show && error.longDescription ? 'border-danger' : 'border-primary'}`}
                            />
                            {show && error.longDescription && <p className="text-danger mt-1">{error.longDescription}</p>}
                        </div>

                        {/* Price & Duration */}
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="fw-bold">Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    onChange={getInputData}
                                    value={data.price}
                                    placeholder="Enter Price"
                                    className={`form-control ${show && error.price ? 'border-danger' : 'border-primary'}`}
                                />
                                {show && error.price && <p className="text-danger mt-1">{error.price}</p>}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="fw-bold">Duration</label>
                                <input
                                    type="text"
                                    name="duration"
                                    onChange={getInputData}
                                    value={data.duration}
                                    placeholder="e.g. 2 weeks, 1 month"
                                    className={`form-control ${show && error.duration ? 'border-danger' : 'border-primary'}`}
                                />
                                {show && error.duration && <p className="text-danger mt-1">{error.duration}</p>}
                            </div>
                        </div>

                        {/* Category & Technology */}
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="fw-bold">Category</label>
                                <input
                                    type="text"
                                    name="category"
                                    onChange={getInputData}
                                    value={data.category}
                                    placeholder="Enter Category"
                                    className={`form-control ${show && error.category ? 'border-danger' : 'border-primary'}`}
                                />
                                {show && error.category && <p className="text-danger mt-1">{error.category}</p>}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="fw-bold">Technology</label>
                                <input
                                    type="text"
                                    name="technology"
                                    onChange={getInputData}
                                    value={data.technology}
                                    placeholder="Enter Technology"
                                    className={`form-control ${show && error.technology ? 'border-danger' : 'border-primary'}`}
                                />
                                {show && error.technology && <p className="text-danger mt-1">{error.technology}</p>}
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
                                <i className="fa fa-save"></i> Update Service
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </>
    )
}