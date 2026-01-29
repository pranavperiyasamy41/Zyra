import React from 'react';
import { Toaster } from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

const ThemedToaster = () => {
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  return (
    <Toaster 
      position="top-center" 
      toastOptions={{ 
        duration: 4000,
        style: {
          background: isDark ? '#1e293b' : '#ffffff', // Slate 800 : White
          color: isDark ? '#fff' : '#1f2937',         // White : Gray 800
          border: isDark ? '1px solid #334155' : '1px solid #e5e7eb', // Slate 700 : Gray 200
          borderRadius: '12px',
          padding: '12px 16px',
          fontSize: '14px',
          fontWeight: '600',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        },
        success: {
          iconTheme: {
            primary: '#34d399', // Emerald 400
            secondary: isDark ? '#064e3b' : '#ecfdf5', // Emerald 900 : Emerald 50
          },
        },
        error: {
          iconTheme: {
            primary: '#f87171', // Red 400
            secondary: isDark ? '#7f1d1d' : '#fef2f2', // Red 900 : Red 50
          },
        },
      }} 
    />
  );
};

export default ThemedToaster;