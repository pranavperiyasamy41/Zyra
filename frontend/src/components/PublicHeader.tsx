import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const PublicHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-xl transition-all border-b border-white/10 bg-gradient-to-r from-teal-600/90 via-emerald-600/90 to-green-600/90 dark:from-teal-800/95 dark:via-emerald-900/95 dark:to-slate-900/95 shadow-2xl">
      <div className="container mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsMenuOpen(false)}>
          <img src="/logo.png" alt="Zyra Logo" className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          <Link to="/features" className="group relative text-sm font-semibold text-white/80 hover:text-brand-highlight transition-all">
            Features
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-highlight transition-all group-hover:w-full"></span>
          </Link>
          <Link to="/pricing" className="group relative text-sm font-semibold text-white/80 hover:text-brand-highlight transition-all">
            Pricing
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-highlight transition-all group-hover:w-full"></span>
          </Link>
          <Link to="/about" className="group relative text-sm font-semibold text-white/80 hover:text-brand-highlight transition-all">
            About
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-highlight transition-all group-hover:w-full"></span>
          </Link>
          
          <Link 
            to="/login" 
            className="group relative inline-flex items-center justify-center px-8 py-2.5 rounded-full bg-gradient-to-r from-brand-highlight to-emerald-400 text-teal-950 font-black text-sm transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(205,235,139,0.4)] active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative z-10">Sign In</span>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-white hover:text-brand-highlight transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-20 bg-teal-950/95 dark:bg-slate-900/95 backdrop-blur-2xl border-b border-white/10 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col p-8 gap-6">
            <Link to="/features" className="text-xl font-semibold text-white/80 hover:text-brand-highlight transition-all" onClick={() => setIsMenuOpen(false)}>Features</Link>
            <Link to="/pricing" className="text-xl font-semibold text-white/80 hover:text-brand-highlight transition-all" onClick={() => setIsMenuOpen(false)}>Pricing</Link>
            <Link to="/about" className="text-xl font-semibold text-white/80 hover:text-brand-highlight transition-all" onClick={() => setIsMenuOpen(false)}>About</Link>
            <Link 
                to="/login" 
                className="flex items-center justify-center py-4 rounded-2xl bg-gradient-to-r from-brand-highlight to-emerald-400 text-teal-950 font-black text-lg shadow-xl shadow-brand-highlight/10 active:scale-[0.98] transition-all" 
                onClick={() => setIsMenuOpen(false)}
            >
                Sign In
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default PublicHeader;