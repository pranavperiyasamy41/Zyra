import { createBrowserRouter } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardWrapper from './pages/DashboardWrapper';
import DashboardPage from './pages/Dashboard';
import InventoryPage from './pages/InventoryPage';
import SalesPage from './pages/SalesPage';
import NotesPage from './pages/NotesPage';
import SettingsPage from './pages/SettingsPage';
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './components/ProtectedRoute'; 

// ✅ IMPORT ADMIN PAGES
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard'; 
// import AdminUsersPage from './pages/AdminUsersPage'; // Uncomment if you have this file

const router = createBrowserRouter([
  // --- PUBLIC ROUTES ---
  {
    path: '/',
    element: <LandingPage />, 
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  
  // ✅ ADMIN ROUTES (Added this section)
  {
    path: '/admin-login',
    element: <AdminLoginPage />,
  },
  {
    path: '/admin-dashboard',
    element: (
      // You can add an AdminProtected route wrapper here later for security
      <AdminDashboard />
    ),
  },

  // --- USER DASHBOARD ROUTES ---
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardWrapper />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true, 
        element: <DashboardPage />,
      },
      {
        path: 'inventory',
        element: <InventoryPage />,
      },
      {
        path: 'sales',
        element: <SalesPage />,
      },
      {
        path: 'notes',
        element: <NotesPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
]);

export default router;