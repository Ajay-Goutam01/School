import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Public Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MobileStickyBar from "./components/MobileStickyBar";
import EnquiryModal from "./components/EnquiryModal";

// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Academics from "./pages/Academics";
import Courses from "./pages/Courses";
import Activities from "./pages/Activities";
import Facilities from "./pages/Facilities";
import Faculty from "./pages/Faculty";
import Admissions from "./pages/Admissions";
import FeeStructure from "./pages/FeeStructure";
import Gallery from "./pages/Gallery";
import NewsEvents from "./pages/NewsEvents";
import Notices from "./pages/Notices";
import Contact from "./pages/Contact";

// Admin Components & Pages
import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminWebsiteSettings from "./admin/AdminWebsiteSettings";
import AdminProfile from "./admin/AdminProfile";
import AdminSecurity from "./admin/AdminSecurity";
import AdminHero from "./admin/AdminHero";
import AdminAbout from "./admin/AdminAbout";
import AdminAchievements from "./admin/AdminAchievements";
import AdminEnquiries from "./admin/AdminEnquiries";
import AdminAcademics from "./admin/AdminAcademics";
import AdminCourses from "./admin/AdminCourses";
import AdminActivities from "./admin/AdminActivities";
import AdminFacilities from "./admin/AdminFacilities";
import AdminFaculty from "./admin/AdminFaculty";
import AdminGallery from "./admin/AdminGallery";
import AdminNews from "./admin/AdminNews";
import AdminNotices from "./admin/AdminNotices";
import AdminAdmissions from "./admin/AdminAdmissions";
import AdminFees from "./admin/AdminFees";

// Protected Route Wrapper Component
const ProtectedAdminRoute = ({ children }) => {
  const { admin, isAuthenticated, authLoading } = useAuth();
  if (authLoading) {
    return (
      <div className="p-8 text-slate-500 text-xs font-semibold">
        Verifying credentials...
      </div>
    );
  }
  if (isAuthenticated && admin?.mustChangePassword) {
    return <Navigate to="/admin/login" replace />;
  }
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <MobileStickyBar />
      <EnquiryModal />
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route
        path="/"
        element={
          <PublicLayout>
            <Home />
          </PublicLayout>
        }
      />
      <Route
        path="/about"
        element={
          <PublicLayout>
            <About />
          </PublicLayout>
        }
      />
      <Route
        path="/academics"
        element={
          <PublicLayout>
            <Academics />
          </PublicLayout>
        }
      />
      <Route
        path="/courses"
        element={
          <PublicLayout>
            <Courses />
          </PublicLayout>
        }
      />
      <Route
        path="/activities"
        element={
          <PublicLayout>
            <Activities />
          </PublicLayout>
        }
      />
      <Route
        path="/facilities"
        element={
          <PublicLayout>
            <Facilities />
          </PublicLayout>
        }
      />
      <Route
        path="/faculty"
        element={
          <PublicLayout>
            <Faculty />
          </PublicLayout>
        }
      />
      <Route
        path="/admissions"
        element={
          <PublicLayout>
            <Admissions />
          </PublicLayout>
        }
      />
      <Route
        path="/fee-structure"
        element={
          <PublicLayout>
            <FeeStructure />
          </PublicLayout>
        }
      />
      <Route
        path="/gallery"
        element={
          <PublicLayout>
            <Gallery />
          </PublicLayout>
        }
      />
      <Route
        path="/news-events"
        element={
          <PublicLayout>
            <NewsEvents />
          </PublicLayout>
        }
      />
      <Route
        path="/notices"
        element={
          <PublicLayout>
            <Notices />
          </PublicLayout>
        }
      />
      <Route
        path="/contact"
        element={
          <PublicLayout>
            <Contact />
          </PublicLayout>
        }
      />

      {/* ADMIN LOGIN */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* PROTECTED ADMIN DASHBOARD ROUTES */}
      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="settings" element={<AdminWebsiteSettings />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="security" element={<AdminSecurity />} />
        <Route path="hero" element={<AdminHero />} />
        <Route path="about" element={<AdminAbout />} />
        <Route path="achievements" element={<AdminAchievements />} />
        <Route path="enquiries" element={<AdminEnquiries />} />
        <Route path="academics" element={<AdminAcademics />} />
        <Route path="courses" element={<AdminCourses />} />
        <Route path="activities" element={<AdminActivities />} />
        <Route path="facilities" element={<AdminFacilities />} />
        <Route path="faculty" element={<AdminFaculty />} />
        <Route path="gallery" element={<AdminGallery />} />
        <Route path="news" element={<AdminNews />} />
        <Route path="notices" element={<AdminNotices />} />
        <Route path="admissions" element={<AdminAdmissions />} />
        <Route path="fees" element={<AdminFees />} />
      </Route>

      {/* CATCH ALL */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
