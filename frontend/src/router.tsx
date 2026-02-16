import { createBrowserRouter } from "react-router-dom";
import Root from "./pages/Root";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin"; 
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardWrapper from "./pages/DashboardWrapper";
import PublicLayout from "./components/PublicLayout";

// Public Footer Pages
import Features from "./pages/public/Features";
import Pricing from "./pages/public/Pricing";
import TrustCenter from "./pages/public/TrustCenter";
import AboutUs from "./pages/public/AboutUs";
import Careers from "./pages/public/Careers";
import Blog from "./pages/public/Blog";
import Contact from "./pages/public/Contact";
import PrivacyPolicy from "./pages/public/PrivacyPolicy";
import TermsConditions from "./pages/public/TermsConditions";
import CookiePolicy from "./pages/public/CookiePolicy";
import Security from "./pages/public/Security";

// User Pages
import Dashboard from "./pages/Dashboard";
import InventoryPage from "./pages/InventoryPage";
import SalesPage from "./pages/SalesPage";
import NotesPage from "./pages/NotesPage";
import SettingsPage from "./pages/SettingsPage";
import SupportPage from "./pages/SupportPage";
import SuppliersPage from "./pages/SuppliersPage"; 

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminAuditLogs from "./pages/AdminAuditLogs";
import AdminSupportPage from "./pages/AdminSupportPage";
import AdminSettingsPage from "./pages/AdminSettingsPage"; 
import AdminAnnouncements from "./pages/AdminAnnouncements";
import AdminLicensePage from "./pages/AdminLicensePage"; 

const router = createBrowserRouter([
  // --- PUBLIC ROUTES ---
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "features", element: <Features /> },
      { path: "pricing", element: <Pricing /> },
      { path: "trust-center", element: <TrustCenter /> },
      { path: "about", element: <AboutUs /> },
      { path: "careers", element: <Careers /> },
      { path: "blog", element: <Blog /> },
      { path: "contact", element: <Contact /> },
      { path: "privacy", element: <PrivacyPolicy /> },
      { path: "terms", element: <TermsConditions /> },
      { path: "cookie-policy", element: <CookiePolicy /> },
      { path: "security", element: <Security /> },
    ]
  },
  { path: "/landing", element: <LandingPage /> }, // Keep for compatibility if needed
  { path: "/login", element: <Login /> },
  
  // 🔒 HIDDEN ADMIN ROUTE
  { path: "/admin-login", element: <AdminLogin /> },
  
  { path: "/register", element: <Register /> },
  { path: "/forgot-password", element: <ForgotPassword /> },

  // --- PROTECTED ROUTES (WITH SIDEBAR) ---
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardWrapper />
      </ProtectedRoute>
    ),
    children: [
      // Standard User Routes
      { path: "dashboard", element: <Dashboard /> },
      { path: "inventory", element: <InventoryPage /> },
      { path: "suppliers", element: <SuppliersPage /> }, 
      { path: "sales", element: <SalesPage /> },
      { path: "notes", element: <NotesPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "support", element: <SupportPage /> },

      // ADMIN ROUTES
      { path: "admin-dashboard", element: <AdminDashboard /> },
      { path: "admin-users", element: <AdminUsersPage /> },
      { path: "admin-licenses", element: <AdminLicensePage /> }, // 🆕 ROUTE
      { path: "admin-logs", element: <AdminAuditLogs /> },
      { path: "admin-support", element: <AdminSupportPage /> },
      { path: "admin-settings", element: <AdminSettingsPage /> },
      { path: "admin-announcements", element: <AdminAnnouncements /> }, 
    ],
  },
]);

export default router;