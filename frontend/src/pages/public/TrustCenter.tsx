import React from 'react';
import { Shield, Lock, Server, FileCheck, CheckCircle2, AlertTriangle } from 'lucide-react';

const TrustCenter = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
      {/* Hero */}
      <section className="bg-teal-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-800 to-transparent opacity-40"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <Shield className="w-16 h-16 mx-auto mb-6 text-emerald-400" />
          <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Trust & Security at Zyra</h1>
          <p className="text-xl text-teal-100 max-w-2xl mx-auto font-medium">
            Your data is our most critical asset. We employ bank-grade security and strict compliance measures to keep your pharmacy safe.
          </p>
        </div>
      </section>

      {/* Security Pillars */}
      <section className="py-24 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-teal-500 transition-colors">
                <Lock className="w-10 h-10 text-teal-600 dark:text-teal-400 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Data Encryption</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    All data is encrypted both in transit (TLS 1.3) and at rest (AES-256). Your sensitive patient and inventory data is unreadable to unauthorized parties.
                </p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-teal-500 transition-colors">
                <FileCheck className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Compliance Ready</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    Zyra is built to help you meet HIPAA, GDPR, and local pharmacy regulations. We provide detailed audit logs for every action taken in the system.
                </p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-teal-500 transition-colors">
                <Server className="w-10 h-10 text-blue-600 dark:text-blue-400 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">99.99% Uptime</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    Our distributed cloud infrastructure ensures high availability. We have redundant backups and failover systems to keep your business running 24/7.
                </p>
            </div>
        </div>
      </section>

      {/* System Status Mockup */}
      <section className="py-16 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
        <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">System Operational Status</h2>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-bold">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    All Systems Operational
                </div>
            </div>
            
            <div className="space-y-4">
                {['API Gateway', 'Database Clusters', 'Authentication Services', 'Notification System', 'Backup Services'].map((service) => (
                    <div key={service} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                        <span className="font-medium text-slate-700 dark:text-slate-300">{service}</span>
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    </div>
                ))}
            </div>
            <div className="mt-8 text-center">
                <p className="text-sm text-slate-500">Last updated: Just now</p>
            </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 container mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-10">Compliance & Certifications</h2>
        <div className="flex flex-wrap justify-center gap-6 md:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             {/* Mock Certification Logos - Using text for simplicity but styled like logos */}
             <div className="px-6 py-3 border-2 border-slate-300 dark:border-slate-700 rounded-lg font-black text-slate-400 text-xl tracking-tighter">HIPAA</div>
             <div className="px-6 py-3 border-2 border-slate-300 dark:border-slate-700 rounded-lg font-black text-slate-400 text-xl tracking-tighter">SOC 2 Type II</div>
             <div className="px-6 py-3 border-2 border-slate-300 dark:border-slate-700 rounded-lg font-black text-slate-400 text-xl tracking-tighter">GDPR</div>
             <div className="px-6 py-3 border-2 border-slate-300 dark:border-slate-700 rounded-lg font-black text-slate-400 text-xl tracking-tighter">ISO 27001</div>
        </div>
      </section>
    </div>
  );
};

export default TrustCenter;