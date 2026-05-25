import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import formValidator from "../../FormValidators/formValidator"
import imageValidator from "../../FormValidators/imageValidator"
import { updatePortfolio, getPortfolio } from '../../Redux/ActionCreators/PortfolioActionCreators'

export default function AdminUpdatePortfolio() {
    let { _id } = useParams()

    let [data, setData] = useState({
        name: "",
        pic: "",
        shortDescription: "",
        longDescription: "",
        category: "",
        tech: "",
        liveUrl: "",
        githubRepo: "",
        active: true
    })
    let [error, setError] = useState({
        name: "",
        pic: "",
        shortDescription: "",
        longDescription: "",
        category: "",
        tech: ""
    })
    let [show, setShow] = useState(false)
    let navigate = useNavigate()

    let PortfolioStateData = useSelector(state => state.PortfolioStateData)
    let dispatch = useDispatch()

    function getInputData(e) {
        let name = e.target.name
        let value = e.target.files ? e.target.files[0] : e.target.value

        if (name !== "active" && name !== "liveUrl" && name !== "githubRepo") {
            setError((old) => {
                return {
                    ...old,
                    [name]: e.target.files ? imageValidator(e) : formValidator(e)
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
            let item = PortfolioStateData.find(x => x._id !== _id && x.name.toLocaleLowerCase() === data.name.toLocaleLowerCase())
            if (item) {
                setShow(true)
                setError((old) => {
                    return {
                        ...old,
                        "name": "Portfolio Already Exist"
                    }
                })
            }
            else {
                let formData = new FormData()
                formData.append("_id", data._id)
                formData.append("name", data.name)
                formData.append("pic", data.pic)
                formData.append("shortDescription", data.shortDescription)
                formData.append("longDescription", data.longDescription)
                formData.append("category", data.category)
                formData.append("tech", data.tech)
                formData.append("liveUrl", data.liveUrl)
                formData.append("githubRepo", data.githubRepo)
                formData.append("active", data.active)
                dispatch(updatePortfolio(formData))
                navigate("/portfolio")
            }
        }
    }

    useEffect(() => {
        (() => {
            dispatch(getPortfolio())
            if (PortfolioStateData.length) {
                let item = PortfolioStateData.find(x => x._id === _id)
                if (item)
                    setData({ ...item })
            }
        })()
    }, [PortfolioStateData.length])

    return (
        <>
            <div className="container">
                <h5 className="text-center text-light bg-primary p-2">
                    Update Portfolio{' '}
                    <Link to="/portfolio"><i className="fa fa-arrow-left text-light float-end pt-1"></i></Link>
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
                                placeholder="Enter Portfolio Name"
                                className={`form-control ${show && error.name ? 'border-danger' : 'border-primary'}`}
                            />
                            {show && error.name && <p className="text-danger mt-1">{error.name}</p>}
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

                        {/* Category & Tech */}
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
                                <label className="fw-bold">Tech</label>
                                <input
                                    type="text"
                                    name="tech"
                                    onChange={getInputData}
                                    value={data.tech}
                                    placeholder="Enter Tech Stack"
                                    className={`form-control ${show && error.tech ? 'border-danger' : 'border-primary'}`}
                                />
                                {show && error.tech && <p className="text-danger mt-1">{error.tech}</p>}
                            </div>
                        </div>

                        {/* Live URL & GitHub Repo */}
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="fw-bold">Live URL</label>
                                <input
                                    type="text"
                                    name="liveUrl"
                                    onChange={getInputData}
                                    value={data.liveUrl}
                                    placeholder="Enter Live URL (optional)"
                                    className="form-control border-primary"
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="fw-bold">GitHub Repo</label>
                                <input
                                    type="text"
                                    name="githubRepo"
                                    onChange={getInputData}
                                    value={data.githubRepo}
                                    placeholder="Enter GitHub Repo URL (optional)"
                                    className="form-control border-primary"
                                />
                            </div>
                        </div>

                        {/* Pic Upload & Active */}
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="fw-bold">Upload Picture*</label>
                                <input
                                    type="file"
                                    name="pic"
                                    onChange={getInputData}
                                    className={`form-control ${show && error.pic ? 'border-danger' : 'border-primary'}`}
                                />
                                {show && error.pic && <p className="text-danger mt-1">{error.pic}</p>}
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
                                <i className="fa fa-save"></i> Update Portfolio
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </>
    )
}