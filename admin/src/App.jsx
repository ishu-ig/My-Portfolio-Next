import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

// Layout
import AdminSidebar from './Component/Sidebar';
import AdminNavbar from './Component/Navbar';
import Footer from './Component/Footer';

// Auth Pages
import LoginPage from './pages/LoginPage';
import ForgetPasswordPage1 from './pages/ForgetPasswordPage1';
import ForgetPasswordPage2 from './pages/ForgetPasswordPage2';
import ForgetPasswordPage3 from './pages/ForgetPasswordPage3';

// Main Pages
import Home from './pages/Home';
import ProfilePage from './pages/ProfilePage';
import UpdateProfilePage from './pages/UpdateProfilePage';

// Skill
import AdminSkill from './pages/skill/AdminSkill';
import AdminCreateSkill from './pages/skill/AdminCreateSkill';
import AdminUpdateSkill from './pages/skill/AdminUpdateSkill';

// Certificate
import AdminCertificate from './pages/certificate/AdminCertificate';
import AdminCreateCertificate from './pages/certificate/AdminCreateCertificate';
import AdminUpdateCertificate from './pages/certificate/AdminUpdateCertificate';

// Education
import AdminEducation from './pages/education/AdminEducation';
import AdminCreateEducation from './pages/education/AdminCreateEducation';
import AdminUpdateEducation from './pages/education/AdminUpdateEducation';

// Experience
import AdminExperience from './pages/experience/AdminExperience';
import AdminCreateExperience from './pages/experience/AdminCreateExperience';
import AdminUpdateExperience from './pages/experience/AdminUpdateExperience';

// Testimonial
import AdminTestimonial from './pages/testimonial/AdminTestimonial';
import AdminCreateTestimonial from './pages/testimonial/AdminCreateTestimonial';
import AdminUpdateTestimonial from './pages/testimonial/AdminUpdateTestimonial';

// BLOG ✅ (FIXED)
import AdminBlog from './pages/blog/AdminBlog';
import AdminCreateBlog from './pages/blog/AdminCreateBlog';
import AdminUpdateBlog from './pages/blog/AdminUpdateBlog';

// Newsletter
import AdminNewsletter from './pages/newsletter/AdminNewsletter';


// User
import AdminUser from './pages/user/AdminUser';
import AdminCreateUser from './pages/user/AdminCreateUser';
import AdminUpdateUser from './pages/user/AdminUpdateUser';

// Extra
import AdminCreateService from './pages/service/AdminCreateService';
import AdminUpdateService from './pages/service/AdminUpdateService';
import AdminService from './pages/service/AdminService';
import AdminPortfolio from './pages/portfolio/AdminPortfolio';
import AdminCreatePortfolio from './pages/portfolio/AdminCreatePortfolio';
import AdminUpdatePortfolio from './pages/portfolio/AdminUpdatePortfolio';
import AdminContactUsShow from './pages/contactUs/AdminContactUsShow';
import AdminContactUs from './pages/contactUs/AdminContactUs';

export default function App() {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(window.innerWidth > 992);

    const checkLoginStatus = () => {
        return localStorage.getItem("login") === "true";
    };

    useEffect(() => {
        const handleResize = () => {
            setIsSidebarExpanded(window.innerWidth > 992);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <BrowserRouter>
            <MainContent
                isSidebarExpanded={isSidebarExpanded}
                toggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)}
                checkLoginStatus={checkLoginStatus}
            />
        </BrowserRouter>
    );
}

function MainContent({ isSidebarExpanded, toggleSidebar, checkLoginStatus }) {
    const location = useLocation();
    const navigate = useNavigate();

    const publicRoutes = [
        "/login",
        "/forgetPassword-1",
        "/forgetPassword-2",
        "/forgetPassword-3"
    ];

    // 🔐 Auth Guard
    useEffect(() => {
        if (!checkLoginStatus() && !publicRoutes.includes(location.pathname)) {
            navigate("/login");
        }
    }, [location, checkLoginStatus, navigate]);

    // 🎨 Background control
    useEffect(() => {
        if (publicRoutes.includes(location.pathname)) {
            document.body.style.backgroundColor = "#f4f6f9";
        } else {
            document.body.style.backgroundColor = "";
        }
    }, [location.pathname]);

    return (
        <div className={`app-container ${isSidebarExpanded ? "sidebar-expanded" : "sidebar-collapsed"}`}>

            {/* Navbar + Sidebar */}
            {!publicRoutes.includes(location.pathname) && <AdminNavbar toggleSidebar={toggleSidebar} />}
            {!publicRoutes.includes(location.pathname) && <AdminSidebar isExpanded={isSidebarExpanded} />}

            <div className="content">

                <Routes>

                    {/* AUTH */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/forgetPassword-1" element={<ForgetPasswordPage1 />} />
                    <Route path="/forgetPassword-2" element={<ForgetPasswordPage2 />} />
                    <Route path="/forgetPassword-3" element={<ForgetPasswordPage3 />} />

                    {/* HOME */}
                    <Route path="/" element={<Home />} />

                    {/* SKILL */}
                    <Route path="/skill" element={<AdminSkill />} />
                    <Route path="/skill/create" element={<AdminCreateSkill />} />
                    <Route path="/skill/update/:_id" element={<AdminUpdateSkill />} />

                    {/* CERTIFICATE */}
                    <Route path="/certificate" element={<AdminCertificate />} />
                    <Route path="/certificate/create" element={<AdminCreateCertificate />} />
                    <Route path="/certificate/update/:_id" element={<AdminUpdateCertificate />} />

                    {/* EDUCATION */}
                    <Route path="/education" element={<AdminEducation />} />
                    <Route path="/education/create" element={<AdminCreateEducation />} />
                    <Route path="/education/update/:_id" element={<AdminUpdateEducation />} />

                    {/* EXPERIENCE */}
                    <Route path="/experience" element={<AdminExperience />} />
                    <Route path="/experience/create" element={<AdminCreateExperience />} />
                    <Route path="/experience/update/:_id" element={<AdminUpdateExperience />} />

                    {/* TESTIMONIAL */}
                    <Route path="/testimonial" element={<AdminTestimonial />} />
                    <Route path="/testimonial/create" element={<AdminCreateTestimonial />} />
                    <Route path="/testimonial/update/:_id" element={<AdminUpdateTestimonial />} />

                    {/* BLOG ✅ */}
                    <Route path="/blog" element={<AdminBlog />} />
                    <Route path="/blog/create" element={<AdminCreateBlog />} />
                    <Route path="/blog/update/:_id" element={<AdminUpdateBlog />} />

                    {/* Service ✅ */}
                    <Route path="/service" element={<AdminService />} />
                    <Route path="/service/create" element={<AdminCreateService />} />
                    <Route path="/service/update/:_id" element={<AdminUpdateService />} />

                    {/* Portfolio ✅ */}
                    <Route path="/portfolio" element={<AdminPortfolio />} />
                    <Route path="/portfolio/create" element={<AdminCreatePortfolio />} />
                    <Route path="/portfolio/update/:_id" element={<AdminUpdatePortfolio />} />

                    {/* NEWSLETTER */}
                    <Route path="/newsletter" element={<AdminNewsletter />} />

                    {/* USER */}
                    <Route path="/user" element={<AdminUser />} />
                    <Route path="/user/create" element={<AdminCreateUser />} />
                    <Route path="/user/update/:_id" element={<AdminUpdateUser />} />

                    {/* CONTACT */}
                    <Route path="/contactus" element={<AdminContactUs />} />
                    <Route path="/contactus/view/:_id" element={<AdminContactUsShow />} />

                    {/* PROFILE */}
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/update-profile" element={<UpdateProfilePage />} />

                </Routes>

                {/* Footer */}
                {!publicRoutes.includes(location.pathname) && <Footer />}

            </div>
        </div>
    );
}