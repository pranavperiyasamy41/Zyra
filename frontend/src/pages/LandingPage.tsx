import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { 
  ArrowRight, 
  BarChart3, 
  ShieldCheck, 
  Box, 
  BellRing, 
  Zap,
  Globe,
  Twitter,
  Linkedin,
  Instagram,
  CheckCircle2,
  Menu,
  Search,
  Users
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 font-sans selection:bg-blue-500 selection:text-white">
      
      {/* ==================== 1. NAVBAR ==================== */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 transition-all">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
              Z
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">ZYRA</span>
          </div>
          
          <div className="flex items-center gap-6">
            <Link 
              to="/login" 
              className="hidden md:block text-sm font-semibold text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              to="/register" 
              className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg hover:shadow-slate-500/20 active:scale-95 flex items-center gap-2"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="border-l border-slate-200 dark:border-slate-800 pl-6">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* ==================== 2. HERO SECTION ==================== */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-40 overflow-hidden text-center">
        
        {/* LIGHT MODE: Vibrant Mesh Gradients */}
        <div className="absolute inset-0 w-full h-full -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-white to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 opacity-100"></div>
        
        {/* Animated Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen dark:opacity-20 animate-blob"></div>
        <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen dark:opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-pink-400/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen dark:opacity-20 animate-blob animation-delay-4000"></div>

        <div className="container mx-auto px-6 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wide mb-8 shadow-sm backdrop-blur-sm hover:scale-105 transition-transform cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Enterprise Grade Pharmacy Solution
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-[1.1] max-w-5xl mx-auto text-slate-900 dark:text-white">
            Precision Management <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
              for Modern Pharmacies.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Automate inventory, track batch sales, and optimize pharmacy <br className="hidden md:block"/>
            operations with our integrated intelligence platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-24">
            <Link 
              to="/register" 
              className="min-w-[160px] px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/30 transition-all transform hover:-translate-y-1 hover:shadow-2xl"
            >
              Get Started
            </Link>
            <Link 
              to="/login" 
              className="min-w-[160px] px-8 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-2xl font-bold text-lg shadow-sm hover:shadow-md transition-all"
            >
              View Demo
            </Link>
          </div>
          
          {/* ==================== 💻 INTERACTIVE DASHBOARD MOCKUP ==================== */}
          <div className="relative mx-auto max-w-6xl">
             
             <div className="text-center mb-10">
                <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
                    Powerful Dashboard
                </h2>
                <div className="w-20 h-1 bg-blue-600 mx-auto mt-2 rounded-full"></div>
             </div>

             <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-purple-500/20 blur-3xl -z-10 rounded-[3rem]"></div>
             
             <div className="rounded-[2rem] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-2xl backdrop-blur-sm">
                
                <div className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 p-4 flex items-center gap-4">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                        <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                    </div>
                    <div className="flex-1 bg-white dark:bg-slate-950 h-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center px-4 max-w-lg mx-auto shadow-sm">
                        <div className="w-4 h-4 bg-slate-300 dark:bg-slate-700 rounded-full mr-2"></div>
                        <div className="h-2 w-32 bg-slate-100 dark:bg-slate-800 rounded"></div>
                    </div>
                </div>

                <div className="flex h-[500px] md:h-[600px] overflow-hidden text-left">
                    <div className="w-64 bg-slate-50 dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-800 p-6 hidden md:flex flex-col gap-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
                            <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        </div>
                        <div className="space-y-3">
                            <div className="h-10 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg w-full"></div>
                            <div className="h-10 w-full bg-transparent rounded-lg border border-transparent hover:bg-slate-100 dark:hover:bg-slate-800"></div>
                            <div className="h-10 w-full bg-transparent rounded-lg border border-transparent hover:bg-slate-100 dark:hover:bg-slate-800"></div>
                            <div className="h-10 w-full bg-transparent rounded-lg border border-transparent hover:bg-slate-100 dark:hover:bg-slate-800"></div>
                        </div>
                    </div>

                    <div className="flex-1 bg-white dark:bg-slate-950 p-6 md:p-8 overflow-hidden relative">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
                                <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800 rounded"></div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800"></div>
                        </div>

                        <div className="grid grid-cols-3 gap-6 mb-8">
                            <div className="col-span-3 md:col-span-2 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-6 h-64 relative overflow-hidden">
                                <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end justify-between px-6 pb-6 gap-2 opacity-50">
                                    <div className="w-full bg-blue-500 h-[40%] rounded-t-sm"></div>
                                    <div className="w-full bg-blue-500 h-[60%] rounded-t-sm"></div>
                                    <div className="w-full bg-blue-500 h-[30%] rounded-t-sm"></div>
                                    <div className="w-full bg-blue-500 h-[80%] rounded-t-sm"></div>
                                    <div className="w-full bg-blue-500 h-[50%] rounded-t-sm"></div>
                                    <div className="w-full bg-blue-500 h-[90%] rounded-t-sm"></div>
                                    <div className="w-full bg-blue-600 h-[70%] rounded-t-sm shadow-lg shadow-blue-500/50"></div>
                                </div>
                            </div>
                            <div className="col-span-3 md:col-span-1 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-6 h-64 flex flex-col items-center justify-center">
                                <div className="w-32 h-32 rounded-full border-8 border-slate-200 dark:border-slate-700 border-t-emerald-500 border-r-emerald-500 rotate-45"></div>
                                <div className="mt-4 h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded bg-slate-200 dark:bg-slate-800"></div>
                                        <div className="space-y-2">
                                            <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                            <div className="h-3 w-20 bg-slate-100 dark:bg-slate-800 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="h-6 w-16 bg-green-100 dark:bg-green-900/30 rounded-full"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* ==================== 3. FEATURES ==================== */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">Core Features</h2>
                <h3 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">Built for speed & accuracy.</h3>
                <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
                    Manage your entire pharmacy workflow from a single, beautiful dashboard.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="group bg-slate-50 dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
                    <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform">
                        <Box className="w-7 h-7 text-blue-600" />
                    </div>
                    <h4 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Smart Inventory</h4>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        Real-time tracking of every pill. Auto-deduct stock on sales and get instant alerts for low inventory.
                    </p>
                </div>

                <div className="group bg-slate-50 dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300">
                     <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform">
                        <BellRing className="w-7 h-7 text-purple-600" />
                    </div>
                    <h4 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Expiry Protection</h4>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        Never sell expired medicine. Our FIFO (First-In-First-Out) system warns you about expiring batches months ahead.
                    </p>
                </div>

                <div className="group bg-slate-50 dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300">
                     <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform">
                        <BarChart3 className="w-7 h-7 text-emerald-600" />
                    </div>
                    <h4 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Financial Insights</h4>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        Track daily revenue, profit margins, and top-selling items with beautiful, easy-to-read charts.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* ==================== 4. TESTIMONIAL / TRUST ==================== */}
      <section className="py-24 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-y border-slate-100 dark:border-slate-900 relative overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
            <h2 className="text-2xl md:text-3xl font-black mb-12 uppercase tracking-tight text-slate-800 dark:text-white">Trusted by Industry Leaders</h2>
            <div className="flex flex-wrap justify-center gap-12 md:gap-20">
                <div className="text-xl md:text-2xl font-black font-serif flex items-center gap-2 text-slate-600 dark:text-slate-300 opacity-70 hover:opacity-100 transition-all cursor-default">
                    <div className="w-6 h-6 bg-slate-600 dark:bg-slate-300 rounded-full"></div> MEDILIFE
                </div>
                <div className="text-xl md:text-2xl font-black font-mono flex items-center gap-2 text-slate-600 dark:text-slate-300 opacity-70 hover:opacity-100 transition-all cursor-default">
                    <div className="w-6 h-6 bg-slate-600 dark:bg-slate-300 transform rotate-45"></div> APPOLLO
                </div>
                <div className="text-xl md:text-2xl font-black font-sans flex items-center gap-2 text-slate-600 dark:text-slate-300 opacity-70 hover:opacity-100 transition-all cursor-default">
                    <div className="w-6 h-6 border-4 border-slate-600 dark:border-slate-300 rounded-full"></div> CITYCARE
                </div>
                <div className="text-xl md:text-2xl font-black font-serif flex items-center gap-2 text-slate-600 dark:text-slate-300 opacity-70 hover:opacity-100 transition-all cursor-default">
                    <div className="w-6 h-6 bg-slate-600 dark:bg-slate-300 rounded-sm"></div> HEALTHPLUS
                </div>
            </div>
        </div>
      </section>

      {/* ==================== 6. FOOTER ==================== */}
      <footer className="bg-slate-50 dark:bg-slate-950 pt-24 pb-12 border-t border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                <div className="col-span-1 md:col-span-1">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">Z</div>
                        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">ZYRA</span>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed mb-8">
                        The #1 Inventory Management System designed specifically for modern pharmacies. Secure, fast, and intelligent.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all">
                            <Twitter className="w-4 h-4" />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all">
                            <Linkedin className="w-4 h-4" />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-pink-600 hover:border-pink-200 transition-all">
                            <Instagram className="w-4 h-4" />
                        </a>
                    </div>
                </div>
                <div>
                    <h4 className="font-bold mb-6 text-slate-900 dark:text-white">Product</h4>
                    <ul className="space-y-4 text-sm text-slate-500">
                        <li><a href="#" className="hover:text-blue-600 transition-colors">Features</a></li>
                        <li><a href="#" className="hover:text-blue-600 transition-colors">Pricing</a></li>
                        <li><a href="#" className="hover:text-blue-600 transition-colors">Integrations</a></li>
                        <li><a href="#" className="hover:text-blue-600 transition-colors">Changelog</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-6 text-slate-900 dark:text-white">Company</h4>
                    <ul className="space-y-4 text-sm text-slate-500">
                        <li><a href="#" className="hover:text-blue-600 transition-colors">About Us</a></li>
                        <li><a href="#" className="hover:text-blue-600 transition-colors">Careers</a></li>
                        <li><a href="#" className="hover:text-blue-600 transition-colors">Blog</a></li>
                        <li><a href="#" className="hover:text-blue-600 transition-colors">Contact</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-6 text-slate-900 dark:text-white">Legal</h4>
                    <ul className="space-y-4 text-sm text-slate-500">
                        <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a></li>
                        <li><a href="#" className="hover:text-blue-600 transition-colors">Cookie Policy</a></li>
                        <li><a href="#" className="hover:text-blue-600 transition-colors">Security</a></li>
                    </ul>
                </div>
            </div>
            <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-slate-500 text-sm">© 2026 Zyra Systems Inc. All rights reserved.</p>
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                    <Globe className="w-4 h-4" />
                    <span>English (US)</span>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;