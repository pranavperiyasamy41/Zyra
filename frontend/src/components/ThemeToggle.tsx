import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative w-16 h-9 flex items-center rounded-full p-1 transition-all duration-500 ease-out shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]
        hover:ring-4 hover:ring-blue-400/20 active:scale-95
        ${isDark ? 'bg-slate-900 border border-slate-700' : 'bg-blue-50 border border-blue-100'}
      `}
      aria-label="Toggle dark mode"
    >
      {/* Background Decor Icons */}
      <span className={`absolute left-2.5 transition-opacity duration-500 ${isDark ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}>
        <Sun className="w-4 h-4 text-amber-400/50" />
      </span>
      <span className={`absolute right-2.5 transition-opacity duration-500 ${isDark ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
        <Moon className="w-4 h-4 text-indigo-400/50" />
      </span>

      {/* Sliding Thumb with Glow */}
      <div
        className={`
          absolute w-7 h-7 rounded-full bg-white shadow-md transform transition-all duration-500 cubic-bezier(0.23, 1, 0.32, 1)
          flex items-center justify-center z-10
          ${isDark 
            ? 'translate-x-7 shadow-[0_0_20px_rgba(99,102,241,0.5)] border border-indigo-100' 
            : 'translate-x-0 shadow-[0_0_20px_rgba(251,191,36,0.5)] border border-amber-100'}
        `}
      >
        {/* Sun Icon */}
        <Sun 
          className={`absolute w-4 h-4 text-amber-500 transition-all duration-500 ${isDark ? 'opacity-0 rotate-180 scale-50' : 'opacity-100 rotate-0 scale-100'}`} 
        />
        {/* Moon Icon */}
        <Moon 
          className={`absolute w-4 h-4 text-indigo-500 transition-all duration-500 ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-180 scale-50'}`} 
        />
      </div>
    </button>
  );
};

export default ThemeToggle;