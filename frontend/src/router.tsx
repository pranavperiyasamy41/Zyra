import { createBrowserRouter, Outlet, Navigate } from 'react-router-dom';
import App from './App';
import ProtectedRoute from './components/ProtectedRoute';
import Root from './pages/Root';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import ForgotPasswordPage from './pages/ForgotPassword';
import InventoryPage from './pages/InventoryPage';
import SalesPage from './pages/SalesPage';
import NotesPage from './pages/NotesPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminLoginPage from './pages/AdminLoginPage';
import DashboardWrapper from './pages/DashboardWrapper';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <App /> 
      </ProtectedRoute>
    ),
    children: [
      {
        index: true, // This is the ONLY index route
        element: <DashboardWrapper />, 
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
        path: 'admin/users',
        element: <AdminUsersPage />,
      },
    ],
  },
  {
    element: <Outlet />,
    children: [
      { path: '/landing', element: <LandingPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/admin-login', element: <AdminLoginPage /> },
      { path: '*', element: <Navigate to="/landing" replace /> },
    ],
  },
]);