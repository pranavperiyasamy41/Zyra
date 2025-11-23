import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Root = () => {
  const { token } = useAuth();

  // If the user has a token, send them to their dashboard.
  // Otherwise, send them to the public landing page.
  return token ? <Navigate to="/dashboard" replace /> : <Navigate to="/landing" replace />;
};

export default Root;