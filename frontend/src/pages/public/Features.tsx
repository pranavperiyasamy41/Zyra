import React from 'react';
import { Zap, Shield, BarChart, Box, Users, Bell } from 'lucide-react';

const Features = () => {
  const features = [
    { icon: Zap, title: "Real-time Analytics", description: "Monitor your pharmacy's performance with live data and interactive charts." },
    { icon: Shield, title: "Enterprise Security", description: "Bank-grade encryption and secure access controls for your sensitive data." },
    { icon: BarChart, title: "Sales Tracking", description: "Track every sale, batch, and inventory movement with precision." },
    { icon: Box, title: "Inventory Management", description: "Automated stock alerts and batch-wise tracking to prevent expiries." },
    { icon: Users, title: "User Management", description: "Role-based access for staff and advanced monitoring for admins." },
    { icon: Bell, title: "Smart Notifications", description: "Instant alerts for low stock, expiring medicines, and system activities." },
  ];

  return (
    <div className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 tracking-tight">
            Powerful <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-green-600">Features</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
            Everything you need to run a modern, efficient, and profitable pharmacy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-green-500 flex items-center justify-center text-white mb-6 shadow-lg shadow-teal-500/20">
                <f.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black mb-4 dark:text-white">{f.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;