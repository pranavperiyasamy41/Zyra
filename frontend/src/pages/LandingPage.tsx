import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle'; 

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-200">
      
      {/* --- Header --- */}
      <header className="border-b dark:border-slate-700">
        <nav className="container mx-auto flex items-center justify-between p-6">
          <h1 className="text-2xl font-bold text-blue-600">Smart Pharmacy</h1>
          
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-lg font-medium hover:text-blue-500 dark:text-slate-300 dark:hover:text-blue-400">
              Login
            </Link>
            <Link 
              to="/register" 
              className="rounded-md bg-blue-600 px-5 py-2 text-lg font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              Sign Up
            </Link>
            <ThemeToggle />
          </div>
        </nav>
      </header>

      {/* --- Hero Section --- */}
      <main>
        <section className="container mx-auto flex flex-col items-center px-6 py-20 text-center">
          <h2 className="text-5xl font-bold md:text-6xl">
            Modern Inventory, <span className="text-blue-600">Simplified.</span>
          </h2>
          <p className="mt-6 max-w-2xl text-lg text-gray-600 dark:text-slate-300">
            Stop guessing. Start managing. Our smart system helps small pharmacies
            track stock, manage expiry dates, and get real-time alerts.
          </p>
          <Link 
            to="/register" 
            className="mt-10 rounded-md bg-blue-600 px-8 py-3 text-xl font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            Get Started for Free
          </Link>
          
          {/* --- ADDED ADMIN LINK --- */}
          <div className="mt-6">
            <Link 
                to="/admin-login" 
                className="text-sm font-medium text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500"
            >
                System Administrator Access
            </Link>
          </div>
          {/* ----------------------- */}
          
        </section>

        {/* --- Features Section --- */}
        <section className="bg-gray-50 py-20 dark:bg-slate-800">
          <div className="container mx-auto px-6">
            <h3 className="mb-12 text-center text-4xl font-bold dark:text-white">
              Everything You Need, Nothing You Don't
            </h3>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Feature 1 */}
              <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-slate-700">
                <h4 className="text-2xl font-bold text-blue-600">Smart Alerts</h4>
                <p className="mt-4 text-gray-600 dark:text-slate-300">
                  Get automatic notifications for low-stock items and soon-to-expire medicines.
                </p>
              </div>
              {/* Feature 2 */}
              <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-slate-700">
                <h4 className="text-2xl font-bold text-blue-600">Real-time Inventory</h4>
                <p className="mt-4 text-gray-600 dark:text-slate-300">
                  Add, edit, and sell items with a fully-featured dashboard that updates instantly.
                </p>
              </div>
              {/* Feature 3 */}
              <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-slate-700">
                <h4 className="text-2xl font-bold text-blue-600">Sales History</h4>
                <p className="mt-4 text-gray-600 dark:text-slate-300">
                  Track every sale and see your business performance at a glance.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="border-t py-10 dark:border-slate-700">
        <div className="container mx-auto flex flex-col items-center justify-between px-6 md:flex-row">
          <p className="text-gray-600 dark:text-slate-400">© 2025 Smart Pharmacy. All rights reserved.</p>
          <div className="mt-4 space-x-6 md:mt-0">
            <Link to="/landing" className="text-gray-600 hover:text-blue-500 dark:text-slate-400">
              Privacy Policy
            </Link>
            <Link to="/landing" className="text-gray-600 hover:text-blue-500 dark:text-slate-400">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default LandingPage;