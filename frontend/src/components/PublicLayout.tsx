import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';

const PublicLayout: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 font-sans selection:bg-blue-500 selection:text-white overflow-x-hidden">
      <PublicHeader />
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};

export default PublicLayout;