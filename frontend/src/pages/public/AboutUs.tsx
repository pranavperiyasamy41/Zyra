import React from 'react';
import { Users, Globe, Award, Briefcase } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-900 via-emerald-900 to-slate-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-black mb-8 tracking-tight leading-tight">Empowering Healthcare with <br /><span className="text-emerald-400">Intelligent Solutions</span></h1>
          <p className="text-xl text-teal-100 font-medium leading-relaxed">
            At Zyra, we are on a mission to simplify pharmacy management. We believe that technology should empower pharmacists to focus on what matters most: patient care.
          </p>
        </div>
      </section>

      {/* Our Story / Mission */}
      <section className="py-24 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Our Story</h2>
                <div className="w-20 h-1.5 bg-teal-500 mb-8 rounded-full"></div>
                <div className="space-y-6 text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                    <p>
                        Zyra started as a simple idea during my journey as a B.Tech student in Artificial Intelligence & Data Science. While working on real-world projects, I realized that many small businesses still rely on manual tracking or outdated systems to manage their inventory. This often leads to expired products, stock mismanagement, and financial loss.
                    </p>
                    <p>
                        Instead of just learning concepts, I wanted to build something practical that could solve an actual problem.
                    </p>
                    <p className="font-bold text-teal-600 dark:text-teal-400">
                        That’s how Zyra Smart Inventory was born.
                    </p>
                    <p>
                        Built using React.js, TypeScript, Node.js, and MongoDB, Zyra is designed to provide real-time stock tracking, expiry monitoring, and intelligent inventory insights — all in a clean and easy-to-use interface. The goal was simple: create a modern, efficient, and scalable system that reduces waste, improves stock visibility, and helps businesses make smarter decisions.
                    </p>
                    <p>
                        Zyra is not just a project — it represents my passion for building impactful technology solutions that combine software engineering with data-driven intelligence.
                    </p>
                    <p className="italic font-medium">
                        This is just the beginning.
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
                <div className="aspect-square bg-slate-200 dark:bg-slate-800 rounded-3xl overflow-hidden shadow-2xl transform translate-y-8 border-8 border-white dark:border-slate-900">
                    <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80" alt="Tech" className="object-cover w-full h-full hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="aspect-square bg-slate-200 dark:bg-slate-800 rounded-3xl overflow-hidden shadow-2xl border-8 border-white dark:border-slate-900">
                    <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80" alt="Data" className="object-cover w-full h-full hover:scale-110 transition-transform duration-500" />
                </div>
            </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white dark:bg-slate-900 py-20 border-y border-slate-100 dark:border-slate-800">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div className="p-6">
                    <div className="text-4xl font-black text-teal-600 dark:text-teal-400 mb-2">500+</div>
                    <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Active Users</div>
                </div>
                <div className="p-6">
                    <div className="text-4xl font-black text-emerald-600 dark:text-emerald-400 mb-2">10k+</div>
                    <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Items Tracked</div>
                </div>
                <div className="p-6">
                    <div className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-2">99.9%</div>
                    <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Uptime</div>
                </div>
                <div className="p-6">
                    <div className="text-4xl font-black text-purple-600 dark:text-purple-400 mb-2">24/7</div>
                    <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Monitoring</div>
                </div>
            </div>
        </div>
      </section>

      {/* Team (Simplified) */}
      <section className="py-24 container mx-auto px-4 text-center">
         <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-16">The Founder</h2>
         <div className="max-w-md mx-auto">
            <div className="group">
                <div className="w-64 h-64 mx-auto mb-8 rounded-[3rem] overflow-hidden border-8 border-white dark:border-slate-800 shadow-2xl group-hover:scale-105 transition-all duration-500 rotate-3 hover:rotate-0">
                    <img src="/pranav.jpeg" alt="Pranav" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Pranav</h3>
                <p className="text-xl text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wider">CEO</p>
                <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium italic">AI & Data Science Specialist</p>
            </div>
         </div>
      </section>
    </div>
  );
};

export default AboutUs;