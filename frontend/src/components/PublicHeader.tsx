import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const PublicHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-gradient-to-r from-teal-600/90 via-emerald-600/90 to-green-600/90 border-b border-white/20 transition-all shadow-2xl">
      <div className="container mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsMenuOpen(false)}>
          <img src="/logo.png" alt="Zyra Logo" className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-110" />
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/features" className="text-sm font-bold text-white hover:text-brand-highlight transition-colors uppercase tracking-widest">Features</Link>
          <Link to="/pricing" className="text-sm font-bold text-white hover:text-brand-highlight transition-colors uppercase tracking-widest">Pricing</Link>
          <Link to="/about" className="text-sm font-bold text-white hover:text-brand-highlight transition-colors uppercase tracking-widest">About</Link>
          <Link 
            to="/login" 
            className="text-sm font-black text-white hover:text-brand-highlight transition-all uppercase tracking-widest px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10"
          >
            Sign In
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-teal-700 border-b border-white/10 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col p-6 gap-4">
            <Link to="/features" className="text-lg font-bold text-white uppercase tracking-widest" onClick={() => setIsMenuOpen(false)}>Features</Link>
            <Link to="/pricing" className="text-lg font-bold text-white uppercase tracking-widest" onClick={() => setIsMenuOpen(false)}>Pricing</Link>
            <Link to="/about" className="text-lg font-bold text-white uppercase tracking-widest" onClick={() => setIsMenuOpen(false)}>About</Link>
            <Link to="/login" className="text-lg font-black text-white uppercase tracking-widest bg-white/10 p-4 rounded-xl text-center" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default PublicHeader;