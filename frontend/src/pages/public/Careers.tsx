import React from 'react';
import { Rocket, Heart, Coffee, Laptop, Users, Briefcase, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Careers = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
      {/* Hero */}
      <section className="bg-teal-900 text-white py-24 relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 opacity-90"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Build the Future of Pharmacy</h1>
          <p className="text-xl text-teal-100 max-w-2xl mx-auto font-medium mb-10">
            Join a passionate team dedicated to transforming healthcare through technology. We're hiring for remote roles worldwide.
          </p>
          <a href="#open-roles" className="inline-flex items-center gap-2 px-8 py-3 bg-white text-teal-900 font-bold rounded-full hover:bg-teal-50 transition-colors shadow-lg">
            View Open Roles <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Values / Benefits */}
      <section className="py-24 container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Why Join Zyra?</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
                We believe in taking care of our people so they can take care of our customers.
            </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
                { icon: <Laptop className="w-8 h-8" />, title: "Remote-First", desc: "Work from anywhere. We focus on output, not hours in a chair." },
                { icon: <Heart className="w-8 h-8" />, title: "Health & Wellness", desc: "Comprehensive health insurance, mental health days, and gym stipends." },
                { icon: <Rocket className="w-8 h-8" />, title: "Growth & Learning", desc: "Annual budget for conferences, courses, and professional development." },
                { icon: <Coffee className="w-8 h-8" />, title: "Flexible Schedule", desc: "Manage your own time. We respect work-life balance." },
                { icon: <Users className="w-8 h-8" />, title: "Diverse Team", desc: "We celebrate diversity and are committed to creating an inclusive workplace." },
                { icon: <Briefcase className="w-8 h-8" />, title: "Competitive Pay", desc: "Top-tier salary and equity packages. We share in our success." }
            ].map((benefit, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-shadow">
                    <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center text-teal-600 dark:text-teal-400 mb-6">
                        {benefit.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{benefit.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{benefit.desc}</p>
                </div>
            ))}
        </div>
      </section>

      {/* Open Positions */}
      <section id="open-roles" className="py-24 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12 text-center">Open Positions</h2>
            
            <div className="space-y-4">
                {[
                    { title: "Senior Full Stack Engineer", dept: "Engineering", loc: "Remote (US/EU)", type: "Full-time" },
                    { title: "Product Designer (UI/UX)", dept: "Design", loc: "Remote", type: "Full-time" },
                    { title: "Customer Success Manager", dept: "Sales", loc: "New York, NY", type: "Full-time" },
                    { title: "DevOps Engineer", dept: "Engineering", loc: "Remote", type: "Contract" },
                ].map((job, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-teal-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{job.title}</h3>
                            <div className="flex gap-4 text-sm text-slate-500 mt-2">
                                <span className="font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400">{job.dept}</span>
                                <span>{job.loc}</span>
                            </div>
                        </div>
                        <div className="mt-4 md:mt-0 flex items-center gap-4">
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-wide">{job.type}</span>
                            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-teal-500 transition-colors" />
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="text-center mt-12">
                <p className="text-slate-600 dark:text-slate-400 mb-4">Don't see your role?</p>
                <Link to="/contact" className="text-teal-600 dark:text-teal-400 font-bold hover:underline">Send us your resume anyway</Link>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;