import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import formValidator from "../../FormValidators/formValidator"
import { createService, getService } from '../../Redux/ActionCreators/ServiceActionCreators'

export default function AdminCreateService() {
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
        name: "Name Field is Mandatory",
        icon: "Icon Field is Mandatory",
        shortDescription: "Short Description Field is Mandatory",
        longDescription: "Long Description Field is Mandatory",
        price: "Price Field is Mandatory",
        duration: "Duration Field is Mandatory",
        category: "Category Field is Mandatory",
        technology: "Technology Field is Mandatory"
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
            let item = ServiceStateData.find(x => x.name.toLocaleLowerCase() === data.name.toLocaleLowerCase())
            if (item) {
                setShow(true)
                setError((old) => ({
                    ...old,
                    "name": "Service Already Exist"
                }))
            }
            else {
                dispatch(createService({ ...data }))
                navigate("/service")
            }
        }
    }

    useEffect(() => {
        (() => {
            dispatch(getService())
        })()
    }, [ServiceStateData.length])

    return (
        <>
            <div className="container">
                <h5 className="text-center text-light bg-primary p-2">
                    Create Service{' '}
                    <Link to="/service"><i className="fa fa-arrow-left text-light float-end pt-1"></i></Link>
                </h5>

                <div className="card mt-3 shadow-sm p-4">
                    <form onSubmit={postSubmit}>

                        {/* Name */}
                        <div className="mb-3">
                            <label className="fw-bold">Name*</label>
                            <input
                                type="text"
                                name="name"
                                onChange={getInputData}
                                placeholder="Enter Service Name"
                                className={`form-control ${show && error.name ? 'border-danger' : 'border-primary'}`}
                            />
                            {show && error.name && <p className="text-danger mt-1">{error.name}</p>}
                        </div>

                        {/* Icon */}
                        <div className="mb-3">
                            <label className="fw-bold">Icon* <small className="text-muted fw-normal">(e.g. fa fa-code)</small></label>
                            <input
                                type="text"
                                name="icon"
                                onChange={getInputData}
                                placeholder="Enter FontAwesome Icon Class"
                                className={`form-control ${show && error.icon ? 'border-danger' : 'border-primary'}`}
                            />
                            {show && error.icon && <p className="text-danger mt-1">{error.icon}</p>}
                        </div>

                        {/* Short Description */}
                        <div className="mb-3">
                            <label className="fw-bold">Short Description*</label>
                            <input
                                type="text"
                                name="shortDescription"
                                onChange={getInputData}
                                placeholder="Enter Short Description"
                                className={`form-control ${show && error.shortDescription ? 'border-danger' : 'border-primary'}`}
                            />
                            {show && error.shortDescription && <p className="text-danger mt-1">{error.shortDescription}</p>}
                        </div>

                        {/* Long Description */}
                        <div className="mb-3">
                            <label className="fw-bold">Long Description*</label>
                            <textarea
                                name="longDescription"
                                onChange={getInputData}
                                placeholder="Enter Long Description"
                                rows={4}
                                className={`form-control ${show && error.longDescription ? 'border-danger' : 'border-primary'}`}
                            />
                            {show && error.longDescription && <p className="text-danger mt-1">{error.longDescription}</p>}
                        </div>

                        {/* Price & Duration */}
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="fw-bold">Price*</label>
                                <input
                                    type="number"
                                    name="price"
                                    onChange={getInputData}
                                    placeholder="Enter Price"
                                    className={`form-control ${show && error.price ? 'border-danger' : 'border-primary'}`}
                                />
                                {show && error.price && <p className="text-danger mt-1">{error.price}</p>}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="fw-bold">Duration*</label>
                                <input
                                    type="text"
                                    name="duration"
                                    onChange={getInputData}
                                    placeholder="e.g. 2 weeks, 1 month"
                                    className={`form-control ${show && error.duration ? 'border-danger' : 'border-primary'}`}
                                />
                                {show && error.duration && <p className="text-danger mt-1">{error.duration}</p>}
                            </div>
                        </div>

                        {/* Category & Technology */}
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="fw-bold">Category*</label>
                                <input
                                    type="text"
                                    name="category"
                                    onChange={getInputData}
                                    placeholder="Enter Category"
                                    className={`form-control ${show && error.category ? 'border-danger' : 'border-primary'}`}
                                />
                                {show && error.category && <p className="text-danger mt-1">{error.category}</p>}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="fw-bold">Technology*</label>
                                <input
                                    type="text"
                                    name="technology"
                                    onChange={getInputData}
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
                                onChange={getInputData}
                                className="form-select border-primary"
                            >
                                <option value="1">Yes</option>
                                <option value="0">No</option>
                            </select>
                        </div>

                        {/* Submit Button */}
                        <div className="mb-3">
                            <button type="submit" className="btn btn-primary w-100 text-light">
                                <i className="fa fa-save"></i> Create Service
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </>
    )
}