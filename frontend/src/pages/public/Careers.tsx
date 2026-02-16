import React from 'react';
import { Briefcase, MapPin, ArrowRight } from 'lucide-react';

const Careers = () => {
  const jobs = [
    { title: "Frontend Engineer", type: "Full-time", location: "Remote / Hybrid" },
    { title: "Backend Developer (Node.js)", type: "Full-time", location: "Remote" },
    { title: "Product Designer", type: "Contract", location: "Remote" },
    { title: "Customer Success Manager", type: "Full-time", location: "Mumbai, India" },
  ];

  return (
    <div className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 tracking-tight">
            Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-green-600">Revolution</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
            We're building the future of pharmacy management. Come build it with us.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {jobs.map((j, i) => (
            <div key={i} className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-teal-500/30 transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">{j.title}</h3>
                <div className="flex gap-4 mt-1">
                  <span className="flex items-center gap-1.5 text-xs text-slate-500 font-bold uppercase tracking-widest"><Briefcase className="w-3.5 h-3.5" /> {j.type}</span>
                  <span className="flex items-center gap-1.5 text-xs text-slate-500 font-bold uppercase tracking-widest"><MapPin className="w-3.5 h-3.5" /> {j.location}</span>
                </div>
              </div>
              <button className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-teal-600 dark:text-teal-400 hover:gap-3 transition-all">
                Apply Now <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Careers;