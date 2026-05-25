import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import $ from 'jquery';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import 'datatables.net';

import { deleteExperience, getExperience } from "../../Redux/ActionCreators/ExperienceActionCreators";

export default function AdminExperience() {

    let ExperienceStateData = useSelector(state => state.ExperienceStateData);
    let dispatch = useDispatch();
    let [flag, setFlag] = useState(false);

    function deleteRecord(_id) {
        if (window.confirm("Are you sure you want to delete this experience?")) {
            dispatch(deleteExperience({ _id }));
            getAPIData();
            setFlag(!flag);
        }
    }

    function getAPIData() {
        dispatch(getExperience());

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
    }, [ExperienceStateData.length]);

    return (
        <div className="container-fluid">

            {/* HEADER */}
            <h5 className="text-center text-light bg-primary p-3">
                Experience
                <Link to="/experience/create">
                    <i className="fa fa-plus text-light float-end"></i>
                </Link>
            </h5>

            {/* TABLE */}
            <div className="table-responsive mt-3">
                <table id="DataTable" className="table table-striped table-hover table-bordered text-center">

                    <thead className="text-light" style={{ backgroundColor: "#1F2A40" }}>
                        <tr>
                            <th>ID</th>
                            <th>Job Title</th>
                            <th>Company</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Update</th>
                            {localStorage.getItem("role") === "Super Admin" ? <th>Delete</th> : ""}
                        </tr>
                    </thead>

                    <tbody>
                        {ExperienceStateData.map((item) => (
                            <tr key={item._id}>

                                <td>{item._id}</td>

                                <td className="fw-bold text-primary">
                                    {item.jobTitle}
                                </td>

                                <td>{item.companyName}</td>

                                <td>{item.startDate}</td>

                                <td>{item.endDate}</td>

                                <td>
                                    <div style={{ maxWidth: "250px" }}>
                                        {item.description}
                                    </div>
                                </td>

                                {/* STATUS */}
                                <td className={item.active ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                                    {item.active ? "Active" : "Inactive"}
                                </td>

                                {/* UPDATE */}
                                <td>
                                    <Link to={`/experience/update/${item._id}`} className="btn btn-primary btn-sm">
                                        <i className="fa fa-edit"></i>
                                    </Link>
                                </td>

                                {/* DELETE */}
                                {
                                    localStorage.getItem("role") === "Super Admin" ?
                                        <td>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => deleteRecord(item._id)}
                                            >
                                                <i className="fa fa-trash"></i>
                                            </button>
                                        </td>
                                        : ""
                                }

                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

        </div>
    );
}