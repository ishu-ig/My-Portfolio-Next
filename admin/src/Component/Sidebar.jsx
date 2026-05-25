import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function AdminSidebar({ isExpanded }) {

    const location = useLocation();
    const navigate = useNavigate();

    const [data, setData] = useState(null);

    const isActive = (path) =>
        location.pathname === path || location.pathname.startsWith(path + "/");

    // 🔥 Fetch logged-in user data
    useEffect(() => {
        (async () => {
            try {
                let response = await fetch(
                    `${process.env.REACT_APP_BACKEND_SERVER}/api/user/${localStorage.getItem("userid")}`,
                    {
                        headers: {
                            Authorization: localStorage.getItem("token"),
                        },
                    }
                );

                response = await response.json();

                if (response.data) setData(response.data);
                else navigate("/login");

            } catch {
                navigate("/login");
            }
        })();
    }, [navigate]);

    return (
        <div id="sidebar" className={isExpanded ? "expanded" : ""}>

            {/* PROFILE */}
            <div className="sidebar-header">

                <img
                    src={
                        data?.pic
                            ? `${process.env.REACT_APP_BACKEND_SERVER}/${data.pic}`
                            : "https://i.pravatar.cc/100"
                    }
                    alt="Admin"
                    className="admin-avatar"
                />

                <span className="admin-name">
                    {data?.name || localStorage.getItem("name") || "Admin"}
                </span>

                <span className="admin-role">
                    {localStorage.getItem("role") || "Administrator"}
                </span>
            </div>

            {/* MENU */}
            <ul className="sidebar-nav">

                <li>
                    <Link to="/" className={`sidebar-link ${isActive("/") ? "active" : ""}`}>
                        <i className="fa fa-home"></i>
                        <span>Dashboard</span>
                    </Link>
                </li>

                <li>
                    <Link to="/skill" className={`sidebar-link ${isActive("/skill") ? "active" : ""}`}>
                        <i className="fa fa-code"></i>
                        <span>Skills</span>
                    </Link>
                </li>

                <li>
                    <Link to="/education" className={`sidebar-link ${isActive("/education") ? "active" : ""}`}>
                        <i className="fa fa-graduation-cap"></i>
                        <span>Education</span>
                    </Link>
                </li>

                <li>
                    <Link to="/experience" className={`sidebar-link ${isActive("/experience") ? "active" : ""}`}>
                        <i className="fa fa-briefcase"></i>
                        <span>Experience</span>
                    </Link>
                </li>

                <li>
                    <Link to="/certificate" className={`sidebar-link ${isActive("/certificate") ? "active" : ""}`}>
                        <i className="fa fa-certificate"></i>
                        <span>Certificates</span>
                    </Link>
                </li>

                <li>
                    <Link to="/portfolio" className={`sidebar-link ${isActive("/portfolio") ? "active" : ""}`}>
                        <i className="fa fa-layer-group"></i>
                        <span>Portfolio</span>
                    </Link>
                </li>

                <li>
                    <Link to="/service" className={`sidebar-link ${isActive("/service") ? "active" : ""}`}>
                        <i className="fa fa-cogs"></i>
                        <span>Services</span>
                    </Link>
                </li>

                <li>
                    <Link to="/testimonial" className={`sidebar-link ${isActive("/testimonial") ? "active" : ""}`}>
                        <i className="fa fa-star"></i>
                        <span>Testimonials</span>
                    </Link>
                </li>

                <li>
                    <Link to="/user" className={`sidebar-link ${isActive("/user") ? "active" : ""}`}>
                        <i className="fa fa-users"></i>
                        <span>Users</span>
                    </Link>
                </li>

                <li>
                    <Link to="/contactus" className={`sidebar-link ${isActive("/contactus") ? "active" : ""}`}>
                        <i className="fa fa-phone"></i>
                        <span>Contact Us</span>
                    </Link>
                </li>

                <li>
                    <Link to="/blog" className={`sidebar-link ${isActive("/blog") ? "active" : ""}`}>
                        <i className="fa fa-blog"></i>
                        <span>Blog</span>
                    </Link>
                </li>

                <li>
                    <Link to="/newsletter" className={`sidebar-link ${isActive("/newsletter") ? "active" : ""}`}>
                        <i className="fa fa-envelope"></i>
                        <span>Newsletter</span>
                    </Link>
                </li>

                <li>
                    <Link to="/settings" className={`sidebar-link ${isActive("/settings") ? "active" : ""}`}>
                        <i className="fa fa-cog"></i>
                        <span>Settings</span>
                    </Link>
                </li>

            </ul>
        </div>
    );
}