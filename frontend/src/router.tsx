import { createBrowserRouter } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardWrapper from "./pages/DashboardWrapper";

// User Pages
import Dashboard from "./pages/Dashboard";
import InventoryPage from "./pages/InventoryPage";
import SalesPage from "./pages/SalesPage";
import NotesPage from "./pages/NotesPage";
import SettingsPage from "./pages/SettingsPage";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsersPage from "./pages/AdminUsersPage";

const router = createBrowserRouter([
  // --- PUBLIC ROUTES ---
  { path: "/", element: <LandingPage /> },
  { path: "/landing", element: <LandingPage /> },
  { path: "/login", element: <Login /> },
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
      { path: "sales", element: <SalesPage /> },
      { path: "notes", element: <NotesPage /> },
      { path: "settings", element: <SettingsPage /> },

      // ✅ ADMIN ROUTES (Now inside the layout!)
      { path: "admin-dashboard", element: <AdminDashboard /> },
      { path: "admin-users", element: <AdminUsersPage /> },
    ],
  },
]);

export default router;