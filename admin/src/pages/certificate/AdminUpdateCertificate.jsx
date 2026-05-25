import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import formValidator from "../../FormValidators/formValidator"
import imageValidator from "../../FormValidators/imageValidator"
import { updateCertificate, getCertificate } from '../../Redux/ActionCreators/CertificateActionCreators'

export default function AdminUpdateCertificate() {
    // let { id } = useParams()

    let {_id} = useParams()

    let [data, setData] = useState({
        name: "",
        pic: "",
        issuedBy: "",
        active: true
    })
    let [error, setError] = useState({
        name: "",
        pic: "",
        issuedBy: ""
    })
    let [show, setShow] = useState(false)
    let navigate = useNavigate()


    let CertificateStateData = useSelector(state => state.CertificateStateData)
    let dispatch = useDispatch()

    function getInputData(e) {
        let name = e.target.name
        let value = e.target.files ? e.target.files[0] : e.target.value  //in case of real backend
        // let value = e.target.files ? "Food_maincategory/" + e.target.files[0].name : e.target.value

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
            let item = CertificateStateData.find(x => x._id !== _id && x.name.toLocaleLowerCase() === data.name.toLocaleLowerCase())  // in case of real backend
            // let item = CertificateStateData.find(x => x.id !== id && x.name.toLocaleLowerCase() === data.name.toLocaleLowerCase())
            if (item) {
                setShow(true)
                setError((old) => {
                    return {
                        ...old,
                        "name": "Certificate Already Exist"
                    }
                })
            }
            else {
                // dispatch(updateCertificate({ ...data }))

                //in case of real backend and form has a file field
                let formData = new FormData()
                formData.append("_id",data._id)
                formData.append("name",data.name)
                if (data.pic instanceof File) {
    formData.append("pic", data.pic)
}
                formData.append("active",data.active)
                dispatch(updateCertificate(formData))

                navigate("/certificate")
            }
        }
    }

    useEffect(() => {
        (() => {
            dispatch(getCertificate())
            if (CertificateStateData.length) {
                // let item = CertificateStateData.find(x => x.id === id)
                let item = CertificateStateData.find(x => x._id === _id)
                if (item)
                    setData({ ...item })
            }
        })()
    }, [CertificateStateData.length])
    return (
        <>
            <div className="container">
                <h5 className="text-center text-light bg-primary p-2">Update Certificate <Link to="/certificate"><i className="fa fa-arrow-left text-light float-end pt-1"></i></Link></h5>
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
                                placeholder="Enter Maincategory Name"
                                className={`form-control ${show && error.name ? 'border-danger' : 'border-primary'}`}
                            />
                            {show && error.name && <p className="text-danger mt-1">{error.name}</p>}
                        </div>
                        <div className="mb-3">
                            <label className="fw-bold">Issued By</label>
                            <input
                                type="text"
                                name="issuedBy "
                                onChange={getInputData}
                                value={data.issuedBy }
                                placeholder="Enter Issued By"
                                className={`form-control ${show && error.issuedBy ? 'border-danger' : 'border-primary'}`}
                            />
                            {show && error.issuedBy && <p className="text-danger mt-1">{error.issuedBy}</p>}
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
                                <i className="fa fa-save"></i> Update Category
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
