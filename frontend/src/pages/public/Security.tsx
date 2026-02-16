import React from 'react';
import { ShieldCheck, ShieldAlert, Key, Database } from 'lucide-react';

const Security = () => {
  const points = [
    { icon: Key, title: "Authentication", description: "Secure login with optional multi-factor authentication and session management." },
    { icon: Database, title: "Data Protection", description: "Multi-layered encryption for all medical and business records." },
    { icon: ShieldCheck, title: "Infrastructure", description: "Hosted on enterprise-grade cloud providers with 24/7 monitoring." },
    { icon: ShieldAlert, title: "Regular Audits", description: "Automated and manual security testing to identify and fix vulnerabilities." },
  ];

  return (
    <div className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 tracking-tight">
            Security <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-green-600">First</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
            How we protect your pharmacy data with advanced security technologies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {points.map((p, i) => (
            <div key={i} className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
                <p.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black mb-2 dark:text-white uppercase tracking-tight">{p.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Security;