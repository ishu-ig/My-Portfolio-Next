import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import $ from 'jquery';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import 'datatables.net';

import { deleteService, getService } from "../../Redux/ActionCreators/ServiceActionCreators";

export default function AdminService() {
    let ServiceStateData = useSelector(state => state.ServiceStateData);
    let dispatch = useDispatch();
    let [flag, setFlag] = useState(false)

    function deleteRecord(_id) {
        if (window.confirm("Are you sure you want to delete this service?")) {
            dispatch(deleteService({ _id: _id }));
            getAPIData();
            setFlag(!flag)
        }
    }

    function getAPIData() {
        dispatch(getService());
        let time = setTimeout(() => {
            if (!$.fn.DataTable.isDataTable('#DataTable')) {
                $('#DataTable').DataTable();
            }
        }, 500);
        return time;
    }

    useEffect(() => {
        let time = getAPIData();
        return () => {
            clearTimeout(time);
            if ($.fn.DataTable.isDataTable('#DataTable')) {
                $('#DataTable').DataTable().destroy();
            }
        };
    }, [ServiceStateData.length]);

    return (
        <>
            <div className="container-fluid">
                {/* Header */}
                <h5 className="text-center text-light bg-primary p-3">
                    Service{' '}
                    <Link to="/service/create"><i className="fa fa-plus text-light float-end pt-1"></i></Link>
                </h5>

                {/* Table */}
                <div className="table-responsive mt-3">
                    <table id="DataTable" className="table table-striped table-hover table-bordered text-center">
                        <thead className="text-light" style={{ backgroundColor: "#1F2A40" }}>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Icon</th>
                                <th>Short Description</th>
                                <th>Price</th>
                                <th>Duration</th>
                                <th>Category</th>
                                <th>Technology</th>
                                <th>Active</th>
                                <th>Update</th>
                                {localStorage.getItem("role") === "Super Admin" ? <th>Delete</th> : ""}
                            </tr>
                        </thead>
                        <tbody>
                            {ServiceStateData.map((item) => (
                                <tr key={item._id}>
                                    <td>{item._id}</td>
                                    <td>{item.name}</td>
                                    <td>
                                        <i className={`${item.icon} fs-4`} title={item.icon}></i>
                                    </td>
                                    <td style={{ maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {item.shortDescription}
                                    </td>
                                    <td><span className="badge bg-success fs-6">₹{item.price}</span></td>
                                    <td>{item.duration}</td>
                                    <td>{item.category}</td>
                                    <td>{item.technology}</td>
                                    <td className={item.active ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                                        {item.active ? "Yes" : "No"}
                                    </td>
                                    <td>
                                        <Link to={`/service/update/${item._id}`} className="btn btn-primary text-light btn-sm">
                                            <i className="fa fa-edit fs-5"></i>
                                        </Link>
                                    </td>
                                    {localStorage.getItem("role") === "Super Admin" ?
                                        <td>
                                            <button className="btn btn-danger btn-sm" onClick={() => deleteRecord(item._id)}>
                                                <i className="fa fa-trash fs-5"></i>
                                            </button>
                                        </td> : ""
                                    }
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}