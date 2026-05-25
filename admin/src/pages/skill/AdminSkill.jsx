import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import $ from 'jquery';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import 'datatables.net';

import { deleteSkill, getSkill } from "../../Redux/ActionCreators/SkillActionCreators";

export default function AdminSkill() {
    let SkillStateData = useSelector(state => state.SkillStateData);
    let dispatch = useDispatch();
    let [flag, setFlag] = useState(false)

    function deleteRecord(_id) {
        if (window.confirm("Are you sure you want to delete this item?")) {
            dispatch(deleteSkill({ _id: _id }));
            getAPIData();
            setFlag(!flag)
        }
    }

    function getAPIData() {
        dispatch(getSkill());
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
    }, [SkillStateData.length]);

    return (
        <>
            <div className="container-fluid">
                {/* Header */}
                <h5 className="text-center text-light bg-primary p-3">
                    Skills
                    <Link to="/skill/create"><i className="fa fa-plus text-light float-end pt-1"></i></Link>
                </h5>

                {/* Table */}
                <div className="table-responsive mt-3">
                    <table id="DataTable" className="table table-striped table-hover table-bordered text-center">
                        <thead className="text-light" style={{ backgroundColor: "#1F2A40" }}>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Level</th>
                                <th>Active</th>
                                <th>Update</th>
                                {localStorage.getItem("role") === "Super Admin" ? <th>Delete</th> : ""}
                            </tr>
                        </thead>
                        <tbody>
                            {SkillStateData.map((item) => (
                                <tr key={item._id}>
                                    <td>{item._id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.description}</td>
                                    <td>{item.level}</td>
                                    <td className={item.active ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                                        {item.active ? "Yes" : "No"}
                                    </td>
                                    <td>
                                        <Link to={`/skill/update/${item._id}`} className="btn btn-primary text-light btn-sm">
                                            <i className="fa fa-edit fs-5"></i>
                                        </Link>
                                    </td>
                                    {
                                        localStorage.getItem("role") === "Super Admin" ?
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