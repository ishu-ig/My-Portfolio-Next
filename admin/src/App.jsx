import React, { useEffect, useCallback } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Sidebar from "./Components/Sidebar";

// Auth Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

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
import AdminTestimonial from './pages/testimonial/AdminTestiminial';
import AdminCreateTestimonial from './pages/testimonial/AdminCreateTestimonial';
import AdminUpdateTestimonial from './pages/testimonial/AdminUpdateTestimonial';

// Blog
import AdminBlog from './pages/blog/AdminBlog';
import AdminCreateBlog from './pages/blog/AdminCreateBlog';
import AdminUpdateBlog from './pages/blog/AdminUpdateBlog';

// Newsletter
import AdminNewsletter from './pages/newsletter/AdminNewsletter';

// User
import AdminUser from './pages/user/AdminUser';
import AdminCreateUser from './pages/user/AdminCreateUser';
import AdminUpdateUser from './pages/user/AdminUpdateUser';

// Service
import AdminService from './pages/service/AdminService';
import AdminCreateService from './pages/service/AdminCreateService';
import AdminUpdateService from './pages/service/AdminUpdateService';

// Portfolio
import AdminPortfolio from './pages/portfolio/AdminPortfolio';
import AdminCreatePortfolio from './pages/portfolio/AdminCreatePortfolio';
import AdminUpdatePortfolio from './pages/portfolio/AdminUpdatePortfolio';

// Contact Us


// Achievement
import AdminAchievement from './pages/achievement/AdminAchievement';
import AdminCreateAchievement from './pages/achievement/AdminCreateAchievement';
import AdminUpdateAchievement from './pages/achievement/AdminUpdateAchievement';
import ForgetPasswordPage from "./pages/ForgetPassword";
import AdminContactUs from "./pages/contactus/AdminContactUs";
import AdminShowQuery from "./pages/contactus/AdminShowQuery"
import AdminAbout from "./pages/about/AdminAbout";
import AdminCreateAbout from "./pages/about/AdminCreateAbout";
import AdminUpdateAbout from "./pages/about/AdminUpdateAbout";

// Notes
import AdminNote from "./pages/note/AdminNote";
import AdminCreateNote from "./pages/note/AdminCreateNote";
import AdminUpdateNote from "./pages/note/AdminUpdateNote";

// FIX: All public routes listed here must match route paths exactly
const publicRoutes = ["/login", "/register", "/forgot-password"];

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}

function Shell() {
  const location = useLocation();
  const isPublic = publicRoutes.includes(location.pathname);
  const isLoggedIn = localStorage.getItem("login") === "true";

  useEffect(() => {
    const isDesktop = window.matchMedia("(min-width: 992px)").matches;
    const savedMini = localStorage.getItem("adminHMD.sidebarMini") === "true";
    if (isDesktop && savedMini && !isPublic) {
      document.body.classList.add("sidebar-mini");
    }
    return () => {
      if (isPublic)
        document.body.classList.remove("sidebar-mini", "sidebar-open");
    };
  }, [isPublic]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 992px)");
    function handleBreakpoint(e) {
      if (e.matches) {
        document.body.classList.remove("sidebar-open");
        const savedMini =
          localStorage.getItem("adminHMD.sidebarMini") === "true";
        document.body.classList.toggle("sidebar-mini", savedMini);
      } else {
        document.body.classList.remove("sidebar-mini");
      }
    }
    if (mq.addEventListener) {
      mq.addEventListener("change", handleBreakpoint);
    } else {
      mq.addListener(handleBreakpoint);
    }
    return () => {
      if (mq.removeEventListener) {
        mq.removeEventListener("change", handleBreakpoint);
      } else {
        mq.removeListener(handleBreakpoint);
      }
    };
  }, []);

  // FIX: Moved toggleSidebar & closeMobileSidebar outside render using useCallback
  const toggleSidebar = useCallback(() => {
    const isDesktop = window.matchMedia("(min-width: 992px)").matches;
    if (isDesktop) {
      document.body.classList.toggle("sidebar-mini");
      localStorage.setItem(
        "adminHMD.sidebarMini",
        String(document.body.classList.contains("sidebar-mini"))
      );
    } else {
      document.body.classList.toggle("sidebar-open");
    }
  }, []);

  const closeMobileSidebar = useCallback(() => {
    document.body.classList.remove("sidebar-open");
  }, []);

  // Redirect unauthenticated users away from protected pages
  if (!isLoggedIn && !isPublic) {
    return <Navigate to="/login" replace />;
  }

  // ── Public pages ──────────────────────────────────────────────────────────
  if (isPublic) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {/* FIX: Added missing SignupPage import and route */}
        <Route path="/register" element={<SignupPage />} />
        {/* FIX: Multi-step forgot password routes instead of undefined <ForgetPasswordPage /> */}
        <Route path="/forgot-password" element={<ForgetPasswordPage />} />
      </Routes>
    );
  }

  // ── Protected pages ───────────────────────────────────────────────────────
  return (
    <div className="admin-shell">
      <div className="sidebar-backdrop" onClick={closeMobileSidebar} />
      <Sidebar onLinkClick={closeMobileSidebar} />

      <div className="admin-main">
        <Navbar toggleSidebar={toggleSidebar} />

        <Routes>
          {/* Dashboard */}
          {/* FIX: Removed duplicate "/" route — kept only one */}
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/update-profile" element={<UpdateProfilePage />} />

          {/* SKILL */}
          <Route path="/skill" element={<AdminSkill />} />
          <Route path="/skill/create" element={<AdminCreateSkill />} />
          <Route path="/skill/update/:_id" element={<AdminUpdateSkill />} />

          {/* CERTIFICATE */}
          <Route path="/certificate" element={<AdminCertificate />} />
          <Route path="/certificate/create" element={<AdminCreateCertificate />} />
          <Route path="/certificate/update/:_id" element={<AdminUpdateCertificate />} />

          {/* ACHIEVEMENT — FIX: Corrected misleading comment (was "CERTIFICATE") */}
          <Route path="/achievement" element={<AdminAchievement />} />
          <Route path="/achievement/create" element={<AdminCreateAchievement />} />
          <Route path="/achievement/update/:_id" element={<AdminUpdateAchievement />} />

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

          {/* BLOG */}
          <Route path="/blog" element={<AdminBlog />} />
          <Route path="/blog/create" element={<AdminCreateBlog />} />
          <Route path="/blog/update/:_id" element={<AdminUpdateBlog />} />

          {/* SERVICE */}
          <Route path="/service" element={<AdminService />} />
          <Route path="/service/create" element={<AdminCreateService />} />
          <Route path="/service/update/:_id" element={<AdminUpdateService />} />

          {/* PORTFOLIO */}
          <Route path="/portfolio" element={<AdminPortfolio />} />
          <Route path="/portfolio/create" element={<AdminCreatePortfolio />} />
          <Route path="/portfolio/update/:_id" element={<AdminUpdatePortfolio />} />

          {/* NEWSLETTER */}
          <Route path="/newsletter" element={<AdminNewsletter />} />

          {/* USER */}
          <Route path="/user" element={<AdminUser />} />
          <Route path="/user/create" element={<AdminCreateUser />} />
          <Route path="/user/update/:_id" element={<AdminUpdateUser />} />

          {/* About */}
          <Route path="/about" element={<AdminAbout />} />
          <Route path="/about/create" element={<AdminCreateAbout />} />
          <Route path="/about/update/:_id" element={<AdminUpdateAbout />} />

          {/* CONTACT */}
          <Route path="/contactus" element={<AdminContactUs />} />
          <Route path="/contactus/view/:_id" element={<AdminShowQuery />} />

          {/* NOTES */}
          <Route path="/note" element={<AdminNote />} />
          <Route path="/note/create" element={<AdminCreateNote />} />
          <Route path="/note/update/:_id" element={<AdminUpdateNote />} />

          {/* FIX: Removed forgot-password from protected routes — it belongs in public only */}
        </Routes>

        <Footer />
      </div>
    </div>
  );
}