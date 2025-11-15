import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  // This prop allows us to set alert colors
  alertType?: 'expiry' | 'lowStock';
}

const DashboardCard: React.FC<CardProps> = ({ title, children, alertType }) => {
  // Define color themes
  const baseColors = 'bg-white dark:bg-slate-800';
  const expiryColors = 'bg-red-50 dark:bg-red-900/30';
  const lowStockColors = 'bg-yellow-50 dark:bg-yellow-900/30';

  let cardColors = baseColors;
  if (alertType === 'expiry') cardColors = expiryColors;
  if (alertType === 'lowStock') cardColors = lowStockColors;

  return (
    <div className={`${cardColors} rounded-lg shadow dark:border dark:border-slate-700`}>
      <div className="border-b border-gray-200 px-4 py-5 dark:border-slate-700 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
          {title}
        </h3>
      </div>
      <div className="px-4 py-5 sm:p-6">
        {children}
      </div>
    </div>
  );
};

export default DashboardCard;