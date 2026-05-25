import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { data, Link } from 'react-router-dom';

import $ from 'jquery';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import 'datatables.net';
import { getContactUs, deleteContactUs, updateContactUs } from '../../Redux/ActionCreators/ContactUsActionCreators';

export default function AdminContactUs() {
    let [flag, setFlag] = useState(false)
    let ContactUsStateData = useSelector((state) => state.ContactUsStateData);
    let dispatch = useDispatch();

    function deleteRecord(_id) {
        if (window.confirm("Are you sure you want to delete this item?")) {
            dispatch(deleteContactUs({ _id:_id }));
            getAPIData();
        }
    }

    function updateRecord(_id) {
        if (window.confirm("Are You Sure to Update the Status : ")) {
            let item = ContactUsStateData.find(x => x._id === _id)
            let index = ContactUsStateData.findIndex(x => x._id === _id)
            dispatch(updateContactUs({ ...item, active: !item.active }))
            ContactUsStateData[index].active = !item.active
            setFlag(!flag)
        }
    }
    function getAPIData() {
        dispatch(getContactUs());

        setTimeout(() => {
            if (!$.fn.dataTable.isDataTable("#DataTable")) {
                $("#DataTable").DataTable();
            }
        }, 500);
    }

    useEffect(() => {
        getAPIData();
        return () => {
            if ($.fn.dataTable.isDataTable("#DataTable")) {
                $("#DataTable").DataTable().destroy();
            }
        };
    }, [ContactUsStateData.length]);

    return (
        <>
            <div className="container-fluid">
                <h5 className="bg-primary text-light text-center p-2">Customer Queries</h5>
                <div className="table-responsive" >
                    <table id="DataTable" className="table table-striped table-hover table-bordered text-center">
                        <thead className="text-light" style={{ backgroundColor: "#1F2A40" }}>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Subject</th>
                                <th>Message</th>
                                <th>Active</th>
                                <th>View</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ContactUsStateData?.map((item) => (
                                <tr key={item._id}>
                                    <td>{item._id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.email}</td>
                                    <td>{item.phone}</td>
                                    <td>{item.subject}</td>
                                    <td >
                                        <div className='contactus-message'>{item.message}</div>
                                    </td>
                                    <td className={item.active ? 'text-success fw-bold' : 'text-danger fw-bold'} onClick={() => updateRecord(item._id)} style={{ cursor: "pointer" }}>
                                        {item.active ? "Yes" : "No"}
                                    </td>
                                    <td>
                                        <Link to={`/contactus/view/${item._id}`} className="btn btn-primary text-light" style={{ borderRadius: 8 }}>
                                            <i className="fa fa-eye fs-5 pt-1"></i>
                                        </Link>
                                    </td>
                                    <td>
                                        {
                                            item.active ? null :
                                                <button className="btn btn-danger btn-sm" onClick={() => deleteRecord(item._id)}>
                                                    <i className="fa fa-trash fs-5"></i>
                                                </button>
                                        }
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
