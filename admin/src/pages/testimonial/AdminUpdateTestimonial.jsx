import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import formValidator from "../../FormValidators/formValidator"
import imageValidator from "../../FormValidators/imageValidator"
import { updateTestimonial, getTestimonial } from '../../Redux/ActionCreators/TestimonialActionCreators'

export default function AdminUpdateTestimonial() {
    // let { id } = useParams()

    let {_id} = useParams()

    let [data, setData] = useState({
        name: "",
        pic: "",
        message: "",
        active: true
    })
    let [error, setError] = useState({
        name: "",
        pic: "",
        message: ""
    })
    let [show, setShow] = useState(false)
    let navigate = useNavigate()


    let TestimonialStateData = useSelector(state => state.TestimonialStateData)
    let dispatch = useDispatch()

    function getInputData(e) {
        let name = e.target.name
        let value = e.target.files ? e.target.files[0] : e.target.value  //in case of real backend
        // let value = e.target.files ? "Food_Testimonial/" + e.target.files[0].name : e.target.value

        if (name !== "active") {
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
            // dispatch(updateTestimonial({ ...data }))

            //in case of real backend and form has a file field
            let formData = new FormData()
            formData.append("_id",data._id)
            formData.append("name",data.name)
            formData.append("pic",data.pic)
            formData.append("message",data.message)
            formData.append("active",data.active)
            dispatch(updateTestimonial(formData))

            navigate("/testimonial")
        }

    }

    useEffect(() => {
        (() => {
            dispatch(getTestimonial())
            if (TestimonialStateData.length) {
                let item = TestimonialStateData.find(x => x._id === _id)
                if (item)
                    setData({ ...item })
            }
        })()
    }, [TestimonialStateData.length])
    return (
        <>
            <div className="container">
                <h5 className="text-center text-light bg-primary p-2">Update Testimonial <Link to="/testimonial"><i className="fa fa-arrow-left text-light float-end pt-1"></i></Link></h5>
                {/* Form */}
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
                                placeholder="Enter Testimonial Name"
                                className={`form-control ${show && error.name ? 'border-danger' : 'border-primary'}`}
                            />
                            {show && error.name && <p className="text-danger mt-1">{error.name}</p>}
                        </div>
                        <div className="mb-3">
                            <label>Message*</label>
                            <textarea name="message" onChange={getInputData} value={data.message} className={`form-control ${show && error.message ? 'border-danger' : 'border-primary'}`} placeholder='Message...' rows={6}></textarea>
                            {show && error.message ? <p className='text-danger text-capitalize'>{error.message}</p> : null}
                        </div>

                        {/* File Upload & Active Status */}
                        <div className="row">
                            {/* File Upload */}
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
                                <i className="fa fa-save"></i> Update Testimonial
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
