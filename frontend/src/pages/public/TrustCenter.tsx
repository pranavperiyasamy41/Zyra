import React from 'react';
import { ShieldCheck, Lock, Globe, Eye } from 'lucide-react';

const TrustCenter = () => {
  const certifications = [
    { icon: ShieldCheck, title: "Data Privacy", description: "Your data is encrypted at rest and in transit using industry-standard protocols." },
    { icon: Lock, title: "Compliance", description: "We adhere to international standards for medical data management and security." },
    { icon: Globe, title: "Availability", description: "99.9% uptime guarantee with globally distributed infrastructure." },
    { icon: Eye, title: "Transparency", description: "Clear policies on how we handle your data and regular security audits." },
  ];

  return (
    <div className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 tracking-tight">
            Trust <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-green-600">Center</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
            Your trust is our most valuable asset. Learn about our commitment to security and privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {certifications.map((c, i) => (
            <div key={i} className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl flex gap-6">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
                <c.icon className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-black mb-2 dark:text-white">{c.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{c.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustCenter;