import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  Users,
  X
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="selection:bg-blue-500 selection:text-white overflow-x-hidden">
      
      {/* ==================== 2. HERO SECTION ==================== */}
      <section id="home" className="relative pt-12 pb-16 lg:pt-24 lg:pb-40 overflow-hidden text-center">
        
        {/* LIGHT/DARK MODE: Vibrant Animated Mesh Gradients */}
        <div className="absolute inset-0 w-full h-full -z-10 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.8),transparent)] dark:bg-[radial-gradient(circle_at_50%_50%,_rgba(15,23,42,0.9),transparent)]"></div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-20">
            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-teal-400/30 rounded-full blur-[100px] animate-blob mix-blend-multiply dark:mix-blend-screen dark:opacity-20"></div>
            <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-emerald-400/30 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-screen dark:opacity-20"></div>
            <div className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] bg-green-400/30 rounded-full blur-[100px] animate-blob animation-delay-4000 mix-blend-multiply dark:mix-blend-screen dark:opacity-20"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          
          <div className="inline-flex animate-fade-in-down items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-slate-800/60 border border-white/50 dark:border-slate-700 backdrop-blur-md text-slate-600 dark:text-slate-300 text-[10px] sm:text-xs font-bold uppercase tracking-wide mb-6 sm:mb-8 shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-default">
            <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 sm:h-2.5 sm:w-2.5 bg-lime-500"></span>
            </span>
            Enterprise Grade Pharmacy Solution
          </div>

          <h1 className="animate-fade-in-up text-4xl sm:text-6xl md:text-8xl font-black tracking-tight mb-6 sm:mb-8 leading-[1.1] max-w-6xl mx-auto text-slate-900 dark:text-white drop-shadow-sm">
            Precision Management <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 dark:from-teal-400 dark:via-emerald-400 dark:to-green-400 animate-text">
              for Modern Pharmacies.
            </span>
          </h1>

          <p className="animate-fade-in-up animation-delay-200 text-base sm:text-lg md:text-2xl text-slate-600 dark:text-slate-400 mb-10 sm:mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            Automate inventory, track batch sales, and optimize pharmacy operations with our integrated intelligence platform.
          </p>

          <div className="animate-fade-in-up animation-delay-400 flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-center mb-16 sm:mb-24">
            <Link 
              to="/register" 
              className="group relative w-auto min-w-[200px] px-10 py-3.5 bg-gradient-to-r from-brand-btn-start to-brand-btn-end text-white rounded-xl font-black text-sm uppercase tracking-widest shadow-xl shadow-brand-btn-start/30 transition-all transform hover:-translate-y-1 hover:shadow-brand-btn-end/40 overflow-hidden active:scale-95"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
              <span className="relative flex items-center justify-center gap-2">GET STARTED NOW <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
            </Link>
          </div>
          
          {/* ==================== 💻 INTERACTIVE DASHBOARD MOCKUP ==================== */}
          <div className="animate-fade-in-up animation-delay-600 relative mx-auto max-w-7xl perspective-1000 px-2 sm:px-0">
             
             <div className="text-center mb-6 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
                    Powerful Dashboard
                </h2>
                <div className="w-16 sm:w-24 h-1 sm:h-1.5 bg-gradient-to-r from-teal-600 to-green-600 mx-auto mt-2 sm:mt-3 rounded-full"></div>
             </div>

             <div className="absolute inset-0 bg-gradient-to-t from-teal-500/30 via-emerald-500/10 to-transparent blur-3xl -z-10 rounded-[2rem] sm:rounded-[4rem] animate-pulse-slow"></div>
             
             <div className="animate-float rounded-2xl sm:rounded-[2.5rem] overflow-hidden bg-white/90 dark:bg-slate-900/90 border border-white/60 dark:border-slate-700 shadow-2xl backdrop-blur-xl transform transition-transform duration-500 hover:scale-[1.01] ring-1 ring-white/50 dark:ring-slate-800">
                
                {/* Mockup Header */}
                <div className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-red-400 shadow-sm"></div>
                        <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-amber-400 shadow-sm"></div>
                        <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-emerald-400 shadow-sm"></div>
                    </div>
                    <div className="flex-1 bg-white dark:bg-slate-950 h-7 sm:h-9 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-700 flex items-center px-3 sm:px-4 max-w-2xl mx-auto shadow-inner">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 bg-slate-300 dark:bg-slate-700 rounded-full mr-2 sm:mr-3"></div>
                        <div className="h-2 w-24 sm:w-40 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                    </div>
                </div>

                {/* Mockup Body */}
                <div className="flex h-[400px] sm:h-[550px] md:h-[650px] overflow-hidden text-left relative">
                    {/* Sidebar */}
                    <div className="w-64 sm:w-72 bg-slate-50/50 dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-800 p-4 sm:p-6 hidden lg:flex flex-col gap-6 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-teal-600 to-emerald-600 rounded-lg sm:rounded-xl shadow-lg"></div>
                            <div className="h-4 sm:h-5 w-24 sm:w-32 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                        </div>
                        <div className="space-y-4">
                            <div className="h-10 sm:h-12 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800/50 rounded-xl w-full shadow-sm"></div>
                            <div className="h-10 sm:h-12 w-full bg-transparent rounded-xl border border-transparent hover:bg-white dark:hover:bg-slate-800 transition-colors"></div>
                            <div className="h-10 sm:h-12 w-full bg-transparent rounded-xl border border-transparent hover:bg-white dark:hover:bg-slate-800 transition-colors"></div>
                            <div className="h-10 sm:h-12 w-full bg-transparent rounded-xl border border-transparent hover:bg-white dark:hover:bg-slate-800 transition-colors"></div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 bg-white/60 dark:bg-slate-950/60 p-4 sm:p-8 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-50 pointer-events-none"></div>
                        
                        <div className="relative z-10 h-full flex flex-col">
                            <div className="flex justify-between items-end mb-6 sm:mb-10">
                                <div>
                                    <div className="h-6 sm:h-10 w-32 sm:w-64 bg-slate-200 dark:bg-slate-800 rounded-lg mb-2 sm:mb-3 animate-pulse"></div>
                                    <div className="h-3 sm:h-5 w-20 sm:w-40 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                                </div>
                                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-slate-100 dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700"></div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 sm:gap-8 mb-6 sm:mb-10 flex-shrink-0">
                                <div className="col-span-3 lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 h-48 sm:h-72 relative overflow-hidden shadow-lg group hover:border-teal-400 transition-colors">
                                    <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-40 flex items-end justify-between px-4 sm:px-8 pb-4 sm:pb-8 gap-2 sm:gap-3 opacity-60">
                                        <div className="w-full bg-teal-400 h-[40%] rounded-t-sm sm:rounded-t-md"></div>
                                        <div className="w-full bg-teal-400 h-[60%] rounded-t-sm sm:rounded-t-md"></div>
                                        <div className="w-full bg-teal-400 h-[30%] rounded-t-sm sm:rounded-t-md"></div>
                                        <div className="w-full bg-teal-400 h-[80%] rounded-t-sm sm:rounded-t-md"></div>
                                        <div className="w-full bg-teal-400 h-[50%] rounded-t-sm sm:rounded-t-md"></div>
                                        <div className="w-full bg-teal-400 h-[90%] rounded-t-sm sm:rounded-t-md"></div>
                                        <div className="w-full bg-gradient-to-t from-teal-600 to-emerald-500 h-[70%] rounded-t-sm sm:rounded-t-md shadow-lg shadow-emerald-500/50 relative"></div>
                                    </div>
                                </div>
                                <div className="hidden lg:flex col-span-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 h-72 flex-col items-center justify-center shadow-lg hover:border-lime-400 transition-colors">
                                    <div className="relative w-40 h-40">
                                        <div className="absolute inset-0 rounded-full border-[12px] border-slate-100 dark:border-slate-800"></div>
                                        <div className="absolute inset-0 rounded-full border-[12px] border-transparent border-t-lime-500 border-r-lime-500 rotate-45 drop-shadow-lg"></div>
                                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                                            <span className="text-3xl font-black text-slate-800 dark:text-white">85%</span>
                                            <span className="text-xs font-bold text-slate-400 uppercase">Growth</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 sm:space-y-4 overflow-hidden flex-1">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="group flex items-center justify-between p-3 sm:p-5 bg-white dark:bg-slate-900 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-teal-300 transition-all cursor-default">
                                        <div className="flex items-center gap-3 sm:gap-5">
                                            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-teal-50 dark:group-hover:bg-teal-900/20 transition-colors"></div>
                                            <div className="space-y-1 sm:space-y-2">
                                                <div className="h-3 sm:h-4 w-24 sm:w-40 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                                                <div className="h-2 sm:h-3 w-16 sm:w-24 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                                            </div>
                                        </div>
                                        <div className="h-6 sm:h-8 w-14 sm:w-20 bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-400 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold">Active</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* ==================== 3. FEATURES ==================== */}
      <section id="features" className="py-16 sm:py-24 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16">
                <h2 className="text-xs sm:text-sm font-bold text-blue-600 uppercase tracking-widest mb-2 sm:mb-3">Core Features</h2>
                <h3 className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-3 sm:mb-4">Built for speed & accuracy.</h3>
                <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
                    Manage your entire pharmacy workflow from a single, beautiful dashboard.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                <div className="group relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 border border-white/50 dark:border-slate-800 hover:border-brand-btn-end/40 hover:shadow-2xl hover:shadow-brand-btn-end/20 transition-all duration-500 overflow-hidden hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-btn-start/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shimmer" />
                    <div className="relative z-10">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-white to-brand-50 dark:from-slate-800 dark:to-slate-900 group-hover:from-brand-btn-start group-hover:to-brand-btn-end rounded-xl sm:rounded-2xl flex items-center justify-center mb-5 sm:mb-6 shadow-sm border border-white/60 dark:border-slate-700 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ease-out">
                            <Box className="w-7 h-7 sm:w-8 sm:h-8 text-brand-btn-start group-hover:text-white transition-colors drop-shadow-sm" />
                        </div>
                        <h4 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-slate-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-brand-btn-start group-hover:to-brand-btn-end transition-all">Smart Inventory</h4>
                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                            Real-time tracking of every pill. Auto-deduct stock on sales and get instant alerts for low inventory.
                        </p>
                    </div>
                </div>

                <div className="group relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 border border-white/50 dark:border-slate-800 hover:border-brand-btn-end/40 hover:shadow-2xl hover:shadow-brand-btn-end/20 transition-all duration-500 overflow-hidden hover:-translate-y-2">
                     <div className="absolute inset-0 bg-gradient-to-br from-brand-btn-start/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                     <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shimmer" />
                     <div className="relative z-10">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-white to-brand-50 dark:from-slate-800 dark:to-slate-900 group-hover:from-brand-btn-start group-hover:to-brand-btn-end rounded-xl sm:rounded-2xl flex items-center justify-center mb-5 sm:mb-6 shadow-sm border border-white/60 dark:border-slate-700 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ease-out">
                            <BellRing className="w-7 h-7 sm:w-8 sm:h-8 text-brand-btn-start group-hover:text-white transition-colors drop-shadow-sm" />
                        </div>
                        <h4 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-slate-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-brand-btn-start group-hover:to-brand-btn-end transition-all">Expiry Protection</h4>
                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                            Never sell expired medicine. Our FIFO (First-In-First-Out) system warns you about expiring batches months ahead.
                        </p>
                    </div>
                </div>

                <div className="group relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 border border-white/50 dark:border-slate-800 hover:border-brand-btn-end/40 hover:shadow-2xl hover:shadow-brand-btn-end/20 transition-all duration-500 overflow-hidden hover:-translate-y-2 sm:col-span-2 lg:col-span-1">
                     <div className="absolute inset-0 bg-gradient-to-br from-brand-btn-start/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                     <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shimmer" />
                     <div className="relative z-10">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-white to-brand-50 dark:from-slate-800 dark:to-slate-900 group-hover:from-brand-btn-start group-hover:to-brand-btn-end rounded-xl sm:rounded-2xl flex items-center justify-center mb-5 sm:mb-6 shadow-sm border border-white/60 dark:border-slate-700 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ease-out">
                            <BarChart3 className="w-7 h-7 sm:w-8 sm:h-8 text-brand-btn-start group-hover:text-white transition-colors drop-shadow-sm" />
                        </div>
                        <h4 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-slate-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-brand-btn-start group-hover:to-brand-btn-end transition-all">Financial Insights</h4>
                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                            Track daily revenue, profit margins, and top-selling items with beautiful, easy-to-read charts.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* ==================== 4. TESTIMONIAL / TRUST ==================== */}
      <section id="trusted" className="py-16 sm:py-24 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-y border-slate-100 dark:border-slate-900 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
            <h2 className="text-lg sm:text-2xl md:text-3xl font-black mb-10 sm:mb-12 uppercase tracking-tight text-slate-800 dark:text-white">Trusted by Industry Leaders</h2>
            <div className="flex flex-wrap justify-center gap-8 sm:gap-12 md:gap-20">
                <div className="text-lg sm:text-xl md:text-2xl font-black font-serif flex items-center gap-2 text-slate-600 dark:text-slate-300 opacity-70 hover:opacity-100 transition-all cursor-default">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-slate-600 dark:bg-slate-300 rounded-full"></div> MEDILIFE
                </div>
                <div className="text-lg sm:text-xl md:text-2xl font-black font-mono flex items-center gap-2 text-slate-600 dark:text-slate-300 opacity-70 hover:opacity-100 transition-all cursor-default">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-slate-600 dark:bg-slate-300 transform rotate-45"></div> APPOLLO
                </div>
                <div className="text-lg sm:text-xl md:text-2xl font-black font-sans flex items-center gap-2 text-slate-600 dark:text-slate-300 opacity-70 hover:opacity-100 transition-all cursor-default">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 border-[3px] sm:border-4 border-slate-600 dark:border-slate-300 rounded-full"></div> CITYCARE
                </div>
                <div className="text-lg sm:text-xl md:text-2xl font-black font-serif flex items-center gap-2 text-slate-600 dark:text-slate-300 opacity-70 hover:opacity-100 transition-all cursor-default">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-slate-600 dark:bg-slate-300 rounded-sm"></div> HEALTHPLUS
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;