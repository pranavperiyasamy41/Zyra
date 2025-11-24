import { createBrowserRouter, Outlet } from 'react-router-dom';
// Layouts
import App from './App';
import ProtectedRoute from './components/ProtectedRoute';
// Pages
import Root from './pages/Root';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import ForgotPasswordPage from './pages/ForgotPassword';
import DashboardPage from './pages/Dashboard';
import InventoryPage from './pages/InventoryPage';
import SalesPage from './pages/SalesPage';
import NotesPage from './pages/NotesPage';
import AdminUsersPage from './pages/AdminUsersPage'; // <-- Import new page

export const router = createBrowserRouter([
  {
    // 1. Root Path: This is the first page hit. It just redirects.
    path: '/',
    element: <Root />,
  },
  {
    // 2. Protected App Routes: All routes here are protected
    // and live inside your sidebar layout (<App />).
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <App /> 
      </ProtectedRoute>
    ),
    children: [
      {
        index: true, // /dashboard (defaults to this)
        element: <DashboardPage />,
      },
      {
        path: 'inventory', // /dashboard/inventory
        element: <InventoryPage />,
      },
      {
        path: 'sales', // /dashboard/sales
        element: <SalesPage />,
      },
      {
        path: 'notes', // /dashboard/notes
        element: <NotesPage />,
      },
      {
        path: 'admin/users', // URL will be /dashboard/admin/users
        element: <AdminUsersPage />,
      },
    ],
  },
  {
    // 3. Public-Only Routes: These are for logged-out users.
    // They use a simple <Outlet /> with no sidebar.
    element: <Outlet />,
    children: [
      {
        path: '/landing',
        element: <LandingPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPasswordPage />,
      },
    ],
  },
]);