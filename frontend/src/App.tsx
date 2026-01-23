import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ThemeToggle from './components/ThemeToggle';

function App() {
  // ✅ FIX: Removed 'token' from destructuring. 
  // We use 'user' to check if logged in.
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const getNavLinkClass = (path: string) => {
    const isActive = path === '/dashboard' 
      ? location.pathname === path 
      : location.pathname.startsWith(path);
    
    return isActive
      ? 'bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-white'
      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700';
  };

  const handleLogout = () => {
    logout();
    navigate('/landing');
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900"> 
      {/* ✅ FIX: Check 'user' instead of 'token' */}
      {user && (
        <nav className="flex w-64 flex-col border-r border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <div className="flex h-16 items-center justify-between border-b px-4 dark:border-slate-700">
            <h1 className="text-xl font-bold text-blue-600">Smart Pharmacy</h1>
            <ThemeToggle />
          </div>
          
          <div className="flex-1 space-y-1 p-4 overflow-y-auto">
            <Link to="/dashboard" className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${getNavLinkClass('/dashboard')}`}>
              Dashboard
            </Link>
            <Link to="/dashboard/inventory" className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${getNavLinkClass('/dashboard/inventory')}`}>
              Inventory
            </Link>
            <Link to="/dashboard/sales" className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${getNavLinkClass('/dashboard/sales')}`}>
              Sales
            </Link>
            <Link to="/dashboard/notes" className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${getNavLinkClass('/dashboard/notes')}`}>
              Notes
            </Link>

            {/* Role-Based Links */}
            {(user?.role === 'admin' || user?.role === 'superadmin') && (
              <Link to="/dashboard/admin/users" className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${getNavLinkClass('/dashboard/admin/users')}`}>
                Admin Users
              </Link>
            )}
          </div>

          <div className="border-t p-4 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 uppercase font-bold">{user?.role}</span>
                <span className="text-sm font-medium text-gray-700 dark:text-slate-300">{user?.username}</span>
              </div>
              <button onClick={handleLogout} className="rounded-md bg-red-100 px-3 py-1 text-xs font-bold text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400">
                LOGOUT
              </button>
            </div>
          </div>
        </nav>
      )}

      <div className="flex-1 overflow-auto">
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default App;