import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import formValidator from "../../FormValidators/formValidator"
import imageValidator from "../../FormValidators/imageValidator"
import { createBlog, getBlog } from '../../Redux/ActionCreators/BlogActionCreators'

export default function AdminCreateBlog() {
    let [data, setData] = useState({
        title: "",
        pic: "",
        shortDescription: "",
        longDescription: "",
        category: "",
        tags: "",
        author: "Admin",
        active: true
    })
    let [error, setError] = useState({
        title: "Title Field is Mandatory",
        pic: "Pic Field is Mandatory",
        shortDescription: "Short Description Field is Mandatory",
        longDescription: "Long Description Field is Mandatory",
        category: "Category Field is Mandatory",
        author: ""
    })
    let [show, setShow] = useState(false)
    let navigate = useNavigate()

    let BlogStateData = useSelector(state => state.BlogStateData)
    let dispatch = useDispatch()

    function getInputData(e) {
        let name = e.target.name
        let value = e.target.files ? e.target.files[0] : e.target.value

        if (name !== "active" && name !== "tags") {
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
            let item = BlogStateData.find(x => x.title.toLocaleLowerCase() === data.title.toLocaleLowerCase())
            if (item) {
                setShow(true)
                setError((old) => {
                    return {
                        ...old,
                        "title": "Blog Already Exist"
                    }
                })
            }
            else {
                let formData = new FormData()
                formData.append("title", data.title)
                formData.append("pic", data.pic)
                formData.append("shortDescription", data.shortDescription)
                formData.append("longDescription", data.longDescription)
                formData.append("category", data.category)
                formData.append("tags", data.tags)
                formData.append("author", data.author)
                formData.append("active", data.active)
                dispatch(createBlog(formData))
                navigate("/blog")
            }
        }
    }

    useEffect(() => {
        (() => {
            dispatch(getBlog())
        })()
    }, [BlogStateData.length])

    return (
        <>
            <div className="container">
                <h5 className="text-center text-light bg-primary p-2">
                    Create Blog{' '}
                    <Link to="/blog"><i className="fa fa-arrow-left text-light float-end pt-1"></i></Link>
                </h5>

                <div className="card mt-3 shadow-sm p-4">
                    <form onSubmit={postSubmit}>

                        {/* Title Field */}
                        <div className="mb-3">
                            <label className="fw-bold">Title*</label>
                            <input
                                type="text"
                                name="title"
                                onChange={getInputData}
                                placeholder="Enter Blog Title"
                                className={`form-control ${show && error.title ? 'border-danger' : 'border-primary'}`}
                            />
                            {show && error.title && <p className="text-danger mt-1">{error.title}</p>}
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

                        {/* Category & Author */}
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
                                <label className="fw-bold">Author*</label>
                                <input
                                    type="text"
                                    name="author"
                                    onChange={getInputData}
                                    value={data.author}
                                    placeholder="Enter Author Name"
                                    className={`form-control ${show && error.author ? 'border-danger' : 'border-primary'}`}
                                />
                                {show && error.author && <p className="text-danger mt-1">{error.author}</p>}
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="mb-3">
                            <label className="fw-bold">Tags</label>
                            <input
                                type="text"
                                name="tags"
                                onChange={getInputData}
                                placeholder="Enter Tags (optional)"
                                className="form-control border-primary"
                            />
                        </div>

                        {/* File Upload & Active Status */}
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="fw-bold">Thumbnail Image*</label>
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
                                <i className="fa fa-save"></i> Create Blog
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </>
    )
}