import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Instagram, Globe } from 'lucide-react';

const PublicFooter: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 pt-16 sm:pt-24 pb-12 border-t border-white/20 overflow-hidden">
      {/* Advanced Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-teal-500/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] animate-pulse animation-delay-2000"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 mb-16">
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6 group cursor-pointer" onClick={scrollToTop}>
              <img src="/logo.png" alt="Zyra Logo" className="h-12 lg:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-110" />
            </Link>
            <p className="text-emerald-100/70 text-sm leading-relaxed mb-8 max-w-sm">
              The #1 Inventory Management System designed specifically for modern pharmacies. Secure, fast, and intelligent.
            </p>
            <div className="flex gap-4">
              <a href="https://twitter.com/zyrasystems" target="_blank" rel="noopener noreferrer" className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-teal-600 transition-all duration-300 shadow-lg hover:-translate-y-1">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/company/zyrasystems" target="_blank" rel="noopener noreferrer" className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-teal-600 transition-all duration-300 shadow-lg hover:-translate-y-1">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://instagram.com/zyrasystems" target="_blank" rel="noopener noreferrer" className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-teal-600 transition-all duration-300 shadow-lg hover:-translate-y-1">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4 sm:mb-6 text-white text-lg">Product</h4>
            <ul className="space-y-3 sm:space-y-4 text-sm text-emerald-100/60 font-medium">
              <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/trust-center" className="hover:text-white transition-colors">Trust Center</Link></li>
              <li><button onClick={scrollToTop} className="hover:text-white transition-colors">Top</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 sm:mb-6 text-white text-lg">Company</h4>
            <ul className="space-y-3 sm:space-y-4 text-sm text-emerald-100/60 font-medium">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 sm:mb-6 text-white text-lg">Legal</h4>
            <ul className="space-y-3 sm:space-y-4 text-sm text-emerald-100/60 font-medium">
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              <li><Link to="/security" className="hover:text-white transition-colors">Security</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-emerald-100/40 text-xs sm:text-sm text-center md:text-left font-bold uppercase tracking-widest">© 2026 Zyra Systems Inc. All rights reserved.</p>
          <div className="flex items-center gap-2 text-sm text-emerald-100/40 font-black uppercase tracking-widest hover:text-white transition-colors cursor-pointer">
            <Globe className="w-4 h-4" />
            <span>English (US)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;