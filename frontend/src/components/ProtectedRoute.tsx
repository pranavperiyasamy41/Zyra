import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// 1. We must accept 'children' as a prop
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();

  if (!token) {
    // 2. If no token, redirect to login
    return <Navigate to="/login" replace />;
  }

  // 3. If there IS a token, render the children (which is your <App /> layout)
  return children;
};

export default ProtectedRoute;