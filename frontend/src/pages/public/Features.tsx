import React from 'react';
import { Box, BarChart3, ShieldCheck, Zap, Users, Globe, Clock, Smartphone } from 'lucide-react';

const Features = () => {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-teal-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 to-emerald-900/90"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Powerful Features for Modern Pharmacies</h1>
          <p className="text-xl text-teal-100 max-w-2xl mx-auto font-medium">
            Discover the tools that make Zyra the #1 choice for pharmacy management. Streamline operations, boost sales, and ensure compliance.
          </p>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            
            {/* Feature 1 */}
            <div className="group p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-14 h-14 bg-teal-100 dark:bg-teal-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Box className="w-7 h-7 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Smart Inventory Control</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Real-time tracking of stock levels, automated low-stock alerts, and batch expiry management. Never run out of essential medicines again.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Advanced Analytics</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Gain deep insights into sales trends, profit margins, and top-performing products. Visualize your pharmacy's growth with interactive charts.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Security & Compliance</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Bank-grade encryption, role-based access control, and automated audit logs ensure your pharmacy meets all regulatory standards.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Staff Management</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Manage shifts, track performance, and assign specific permissions to pharmacists and staff members with ease.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Lightning Fast POS</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Process sales in seconds with our optimized Point of Sale interface. Supports barcode scanning and multiple payment methods.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-14 h-14 bg-pink-100 dark:bg-pink-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Smartphone className="w-7 h-7 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Mobile Accessible</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Access your dashboard from anywhere. Fully responsive design works perfectly on tablets and smartphones.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Detailed Breakdown Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2">
               <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-1 rounded-3xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
                 <img src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80" alt="Dashboard Preview" className="rounded-[22px] w-full" />
               </div>
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-6">Automate Your Workflow</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                Stop wasting time on manual data entry. Zyra automates the tedious parts of pharmacy management so you can focus on patient care.
              </p>
              <ul className="space-y-4">
                {[
                  "Automatic Purchase Order Generation",
                  "Expiry Date Tracking & Alerts",
                  "Supplier Performance Rating",
                  "Customer Purchase History"
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium">
                    <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center text-teal-600 dark:text-teal-400">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;