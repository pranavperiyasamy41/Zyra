import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const { token, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const getNavLinkClass = (path: string) => {
    // Logic for link highlighting
    if (path === '/dashboard') {
      return location.pathname === path
        ? 'bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-white'
        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700';
    }
    return location.pathname.startsWith(path) 
      ? 'bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-white'
      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700';
  };

  const handleLogout = () => {
    logout();
    navigate('/landing');
  };

  return (
    <div className="flex min-h-screen"> 
      
      {/* --- Sidebar (Only show if logged in) --- */}
      {token && (
        <nav className="flex w-64 flex-col border-r border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          
          {/* Header */}
          <div className="flex h-16 flex-shrink-0 items-center justify-between border-b px-4 dark:border-slate-700">
            <h1 className="text-xl font-bold text-blue-600">Smart Pharmacy</h1>
            <div className="lg:hidden">
              <ThemeToggle />
            </div>
          </div>
          
          {/* Links */}
          <div className="flex flex-1 flex-col overflow-y-auto">
            <div className="flex-1 space-y-1 p-4">
              <Link
                to="/dashboard"
                className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${getNavLinkClass('/dashboard')}`}
              >
                Dashboard
              </Link>
              <Link
                to="/dashboard/inventory"
                className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${getNavLinkClass('/dashboard/inventory')}`}
              >
                Inventory
              </Link>
              <Link
                to="/dashboard/sales"
                className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${getNavLinkClass('/dashboard/sales')}`}
              >
                Sales
              </Link>
              <Link
                to="/dashboard/notes"
                className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${getNavLinkClass('/dashboard/notes')}`}
              >
                Notes
              </Link>

              {/* --- CONDITIONAL ADMIN LINK (This now works) --- */}
              {user && user.role === 'superadmin' && (
                <Link
                  to="/dashboard/admin/users"
                  className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${getNavLinkClass('/dashboard/admin/users')}`}
                >
                  Admin Users
                </Link>
              )}
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="border-t p-4 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                {user ? user.username : 'User'}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-md bg-red-100 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900"
              >
                Logout
              </button>
            </div>
            <div className="mt-4 flex justify-center">
              <ThemeToggle />
            </div>
          </div>
        </nav>
      )}

      {/* --- Main Content Area --- */}
      <div className="flex-1 bg-gray-50 dark:bg-slate-900">
        <main>
          <Outlet />
        </main>
      </div>

    </div>
  )
}

export default App;