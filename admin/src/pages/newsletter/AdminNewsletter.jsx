import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import $ from 'jquery';                                         
import 'datatables.net-dt/css/dataTables.dataTables.min.css';   
import 'datatables.net';

import { deleteNewsletter, getNewsletter,updateNewsletter } from "../../Redux/ActionCreators/NewsletterActionCreators";

export default function AdminNewsletter() {
    let NewsletterStateData = useSelector(state => state.NewsletterStateData);
    let [flag, setFlag] = useState(false)
    let dispatch = useDispatch();

    function deleteRecord(_id) {
        if (window.confirm("Are you sure you want to delete this item?")) {
            dispatch(deleteNewsletter({ _id:_id }));
            getAPIData();
        }
    }

    function updateRecord(_id) {
        if (window.confirm("Are You Sure to Update the Status : ")) {
            let item = NewsletterStateData.find(x => x._id === _id)
            let index = NewsletterStateData.findIndex(x => x._id === _id)
            dispatch(updateNewsletter({ ...item, active: !item.active }))
            NewsletterStateData[index].active = !item.active
            setFlag(!flag)
            
        }
    }

    function getAPIData() {
        dispatch(getNewsletter());
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
    }, [NewsletterStateData.length]);

    return (
        <>
            <div className="container-fluid">
                {/* Header */}
                    <h5 className="text-center text-light bg-primary p-3">Newsletter</h5>
                {/* Table */}
                <div className="table-responsive mt-3">
                    <table id="DataTable" className="table table-striped table-hover table-bordered text-center">
                        <thead className="text-light" style={{backgroundColor:"#1F2A40"}}>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Active</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {NewsletterStateData.map((item) => (
                                <tr key={item._id}>
                                    <td>{item._id}</td>
                                    <td>{item.email}</td>
                                    <td className={item.active ? 'text-success fw-bold' : 'text-danger fw-bold'} onClick={()=>updateRecord(item._id)} style={{ cursor: "pointer" }}>
                                        {item.active ? "Yes" : "No"}
                                    </td>
                                    <td>
                                        <button className="btn btn-danger btn-sm" onClick={() => deleteRecord(item._id)}>
                                            <i className="fa fa-trash fs-5"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
