import React from 'react';
import { Lock, Server, ShieldCheck, Eye, Key } from 'lucide-react';

const Security = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
      {/* Hero Section with Green Gradient - matching other professional pages */}
      <section className="bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 text-white py-24 relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:40px_40px]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <ShieldCheck className="w-16 h-16 mx-auto mb-6 text-emerald-400" />
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Enterprise-Grade Security</h1>
          <p className="text-xl text-teal-100 max-w-2xl mx-auto font-medium">
            We built Zyra with a security-first mindset. From the ground up, our platform is designed to protect your sensitive pharmacy data.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-5xl py-24">
        
        {/* Intro Section - matching Privacy/Terms layout */}
        <div className="mb-20">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Security Overview</h2>
            <div className="w-20 h-1.5 bg-teal-500 mb-8 rounded-full"></div>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                At Zyra, we understand that pharmacies handle highly sensitive patient and inventory information. Our security program is designed to meet the rigorous demands of the healthcare industry, ensuring that your data is always protected, available, and confidential.
            </p>
        </div>

        {/* Security Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
            <div className="group p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 transition-all shadow-sm hover:shadow-xl">
                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center text-teal-600 dark:text-teal-400 mb-6 group-hover:scale-110 transition-transform">
                    <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Encryption Everywhere</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    We use TLS 1.3 for all data in transit and AES-256 for data at rest. Your patient records, inventory logs, and financial data are encrypted before they ever touch our disks.
                </p>
            </div>

            <div className="group p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-all shadow-sm hover:shadow-xl">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                    <Server className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Secure Infrastructure</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Zyra runs on AWS (Amazon Web Services), the world's most secure cloud computing environment. We utilize VPCs, strict firewalls, and automated intrusion detection systems.
                </p>
            </div>

            <div className="group p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 transition-all shadow-sm hover:shadow-xl">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                    <Eye className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">24/7 Monitoring</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Our security operations center (SOC) monitors for suspicious activity around the clock. Automated alerts notify our engineers of potential threats in seconds.
                </p>
            </div>

            <div className="group p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-orange-500 transition-all shadow-sm hover:shadow-xl">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400 mb-6 group-hover:scale-110 transition-transform">
                    <Key className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Access Control</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    We enforce strict Role-Based Access Control (RBAC). Employees only have access to the data necessary for their specific job function, and all access is logged.
                </p>
            </div>
        </div>

        {/* Footer Contact - matching Privacy Policy style */}
        <section className="border-t border-slate-200 dark:border-slate-800 pt-12 mt-24">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Questions?</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">If you have any questions about our security practices, please contact our security team:</p>
            <ul className="list-none space-y-2 text-slate-600 dark:text-slate-400">
                <li>By email: <a href="mailto:zyra.pharmacy@gmail.com" className="text-teal-600 hover:underline font-medium">zyra.pharmacy@gmail.com</a></li>
                <li>By visiting our contact page: <a href="/contact" className="text-teal-600 hover:underline font-medium">/contact</a></li>
            </ul>
        </section>
      </div>
    </div>
  );
};

export default Security;