import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import $ from 'jquery';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import 'datatables.net';

import { deleteResume, getResume } from "../../Redux/ActionCreators/ResumeActionCreators";

export default function AdminResume() {
    let ResumeStateData = useSelector(state => state.ResumeStateData);
    let dispatch = useDispatch();
    let [flag, setFlag] = useState(false)

    function deleteRecord(_id) {
        if (window.confirm("Are you sure you want to delete this resume?")) {
            dispatch(deleteResume({ _id: _id }));
            getAPIData();
            setFlag(!flag)
        }
    }

    function getAPIData() {
        dispatch(getResume());
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
    }, [ResumeStateData.length]);

    return (
        <>
            <div className="container-fluid">
                {/* Header */}
                <h5 className="text-center text-light bg-primary p-3">
                    Resume{' '}
                    <Link to="/resume/create"><i className="fa fa-plus text-light float-end pt-1"></i></Link>
                </h5>

                {/* Table */}
                <div className="table-responsive mt-3">
                    <table id="DataTable" className="table table-striped table-hover table-bordered text-center">
                        <thead className="text-light" style={{ backgroundColor: "#1F2A40" }}>
                            <tr>
                                <th>Id</th>
                                <th>Summary</th>
                                <th>Email</th>
                                <th>GitHub</th>
                                <th>LinkedIn</th>
                                <th>Portfolio</th>
                                <th>Skills</th>
                                <th>Education</th>
                                <th>Experience</th>
                                <th>Projects</th>
                                <th>Certificates</th>
                                <th>Services</th>
                                <th>Active</th>
                                <th>Update</th>
                                {localStorage.getItem("role") === "Super Admin" ? <th>Delete</th> : ""}
                            </tr>
                        </thead>
                        <tbody>
                            {ResumeStateData.map((item) => (
                                <tr key={item._id}>
                                    <td>{item._id}</td>

                                    {/* About Summary */}
                                    <td style={{ maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {item.about?.summary}
                                    </td>

                                    {/* Contact */}
                                    <td>{item.contact?.email}</td>
                                    <td>
                                        {item.contact?.github &&
                                            <a href={item.contact.github} target="_blank" rel="noreferrer" className="btn btn-dark btn-sm">
                                                <i className="fa fa-github"></i>
                                            </a>
                                        }
                                    </td>
                                    <td>
                                        {item.contact?.linkedin &&
                                            <a href={item.contact.linkedin} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
                                                <i className="fa fa-linkedin"></i>
                                            </a>
                                        }
                                    </td>
                                    <td>
                                        {item.contact?.portfolio &&
                                            <a href={item.contact.portfolio} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                                                <i className="fa fa-globe"></i>
                                            </a>
                                        }
                                    </td>

                                    {/* Ref Array Counts */}
                                    <td><span className="badge bg-primary">{item.skills?.length || 0}</span></td>
                                    <td><span className="badge bg-info text-dark">{item.education?.length || 0}</span></td>
                                    <td><span className="badge bg-success">{item.experience?.length || 0}</span></td>
                                    <td><span className="badge bg-warning text-dark">{item.projects?.length || 0}</span></td>
                                    <td><span className="badge bg-secondary">{item.certificates?.length || 0}</span></td>
                                    <td><span className="badge bg-danger">{item.services?.length || 0}</span></td>

                                    {/* Active */}
                                    <td className={item.active ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                                        {item.active ? "Yes" : "No"}
                                    </td>

                                    {/* Update */}
                                    <td>
                                        <Link to={`/resume/update/${item._id}`} className="btn btn-primary text-light btn-sm">
                                            <i className="fa fa-edit fs-5"></i>
                                        </Link>
                                    </td>

                                    {/* Delete */}
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