import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const plans = [
    { name: "Starter", price: "Free", features: ["Up to 100 Medicines", "Basic Sales Tracking", "1 User Account", "Standard Support"] },
    { name: "Professional", price: "Custom", features: ["Unlimited Medicines", "Advanced Analytics", "Up to 5 Users", "Priority Support", "Automated Backups"], popular: true },
    { name: "Enterprise", price: "Custom", features: ["Multiple Branches", "Custom Roles", "Unlimited Users", "24/7 Dedicated Support", "API Access"] },
  ];

  return (
    <div className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 tracking-tight">
            Simple, Transparent <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-green-600">Pricing</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
            Choose the plan that's right for your pharmacy business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((p, i) => (
            <div key={i} className={`p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border ${p.popular ? 'border-teal-500 ring-4 ring-teal-500/10 scale-105 z-10' : 'border-slate-100 dark:border-slate-800'} shadow-2xl relative transition-all duration-300`}>
              {p.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-teal-600 to-green-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">Most Popular</div>
              )}
              <h3 className="text-2xl font-black mb-2 dark:text-white uppercase tracking-tight">{p.name}</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-black dark:text-white">{p.price}</span>
                {p.price !== "Free" && <span className="text-slate-500 font-bold">/mo</span>}
              </div>
              <ul className="space-y-4 mb-10">
                {p.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/register" className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${p.popular ? 'bg-gradient-to-r from-teal-600 to-green-600 text-white shadow-xl shadow-teal-500/30 hover:scale-[1.02]' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}`}>
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;