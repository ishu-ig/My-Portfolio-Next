import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import $ from 'jquery';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import 'datatables.net';

import { deletePortfolio, getPortfolio } from "../../Redux/ActionCreators/PortfolioActionCreators";

export default function AdminPortfolio() {

    let PortfolioStateData = useSelector(state => state.PortfolioStateData);
    let dispatch = useDispatch();
    let [flag, setFlag] = useState(false);

    function deleteRecord(_id) {
        if (window.confirm("Are you sure you want to delete this Portfolio?")) {
            dispatch(deletePortfolio({ _id }));
            getAPIData();
            setFlag(!flag);
        }
    }

    function getAPIData() {
        dispatch(getPortfolio());

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
    }, [PortfolioStateData.length]);

    return (
        <div className="container-fluid">

            {/* HEADER */}
            <h5 className="text-center text-light bg-primary p-3">
                Portfolio
                <Link to="/portfolio/create">
                    <i className="fa fa-plus text-light float-end"></i>
                </Link>
            </h5>

            {/* TABLE */}
            <div className="table-responsive mt-3">
                <table id="DataTable" className="table table-striped table-hover table-bordered text-center">

                    <thead className="text-light" style={{ backgroundColor: "#1F2A40" }}>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Image</th>
                            <th>Category</th>
                            <th>Tech</th>
                            <th>Live</th>
                            <th>Github</th>
                            <th>Status</th>
                            <th>Update</th>
                            {localStorage.getItem("role") === "Super Admin" ? <th>Delete</th> : ""}
                        </tr>
                    </thead>

                    <tbody>
                        {PortfolioStateData.map((item) => (
                            <tr key={item._id}>

                                <td>{item._id}</td>

                                <td className="fw-bold">{item.name}</td>

                                {/* IMAGE */}
                                <td>
                                    <Link to={item.pic} target="_blank" rel="noreferrer">
                                        <img
                                            src={item.pic}
                                            height={50}
                                            width={80}
                                            className="rounded shadow-sm"
                                            alt=""
                                        />
                                    </Link>
                                </td>

                                <td>{item.category}</td>
                                <td>{item.tech}</td>

                                {/* LIVE URL */}
                                <td>
                                    {item.liveUrl ?
                                        <a href={item.liveUrl} target="_blank" rel="noreferrer" className="btn btn-success btn-sm">
                                            Live
                                        </a> : "N/A"}
                                </td>

                                {/* GITHUB */}
                                <td>
                                    {item.githubRepo ?
                                        <a href={item.githubRepo} target="_blank" rel="noreferrer" className="btn btn-dark btn-sm">
                                            Code
                                        </a> : "N/A"}
                                </td>

                                {/* STATUS */}
                                <td className={item.active ? "text-success fw-bold" : "text-danger fw-bold"}>
                                    {item.active ? "Active" : "Inactive"}
                                </td>

                                {/* UPDATE */}
                                <td>
                                    <Link to={`/portfolio/update/${item._id}`} className="btn btn-primary btn-sm">
                                        <i className="fa fa-edit"></i>
                                    </Link>
                                </td>

                                {/* DELETE */}
                                {
                                    localStorage.getItem("role") === "Super Admin" ?
                                        <td>
                                            <button className="btn btn-danger btn-sm" onClick={() => deleteRecord(item._id)}>
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