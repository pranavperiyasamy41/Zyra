import React from 'react';
import { Check, X, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-24">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">Simple, Transparent Pricing</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Choose the plan that fits your pharmacy's size and needs. No hidden fees. Cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-24">
          
          {/* Basic Plan */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 flex flex-col hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Starter</h3>
            <div className="text-slate-500 dark:text-slate-400 text-sm mb-6">Perfect for small, independent pharmacies.</div>
            <div className="text-5xl font-black text-slate-900 dark:text-white mb-2">$49<span className="text-lg font-medium text-slate-400">/mo</span></div>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Billed annually ($588/year)</p>
            
            <Link to="/register" className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-center mb-8 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              Start Free Trial
            </Link>

            <ul className="space-y-4 flex-1">
              <li className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                <Check className="w-5 h-5 text-teal-500" /> 1 User Account
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                <Check className="w-5 h-5 text-teal-500" /> Up to 1,000 Inventory Items
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                <Check className="w-5 h-5 text-teal-500" /> Basic Sales Reports
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                <Check className="w-5 h-5 text-teal-500" /> Email Support
              </li>
            </ul>
          </div>

          {/* Pro Plan (Most Popular) */}
          <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-8 border-2 border-teal-500 dark:border-teal-400 flex flex-col shadow-2xl scale-105 z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
              Most Popular
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Professional</h3>
            <div className="text-slate-500 dark:text-slate-400 text-sm mb-6">For growing pharmacies with multiple staff.</div>
            <div className="text-5xl font-black text-slate-900 dark:text-white mb-2">$99<span className="text-lg font-medium text-slate-400">/mo</span></div>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Billed annually ($1,188/year)</p>
            
            <Link to="/register" className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-center mb-8 hover:shadow-lg hover:scale-[1.02] transition-all">
              Get Started
            </Link>

            <ul className="space-y-4 flex-1">
              <li className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                <div className="bg-teal-100 dark:bg-teal-900/50 p-1 rounded-full"><Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /></div>
                5 User Accounts
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                <div className="bg-teal-100 dark:bg-teal-900/50 p-1 rounded-full"><Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /></div>
                Unlimited Inventory
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                <div className="bg-teal-100 dark:bg-teal-900/50 p-1 rounded-full"><Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /></div>
                Advanced Analytics & Forecasting
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                <div className="bg-teal-100 dark:bg-teal-900/50 p-1 rounded-full"><Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /></div>
                Priority Chat Support
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                <div className="bg-teal-100 dark:bg-teal-900/50 p-1 rounded-full"><Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /></div>
                Barcode Scanning Support
              </li>
            </ul>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 flex flex-col hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Enterprise</h3>
            <div className="text-slate-500 dark:text-slate-400 text-sm mb-6">Custom solutions for large chains.</div>
            <div className="text-5xl font-black text-slate-900 dark:text-white mb-2">Custom</div>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Contact sales for pricing</p>
            
            <Link to="/contact" className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-center mb-8 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              Contact Sales
            </Link>

            <ul className="space-y-4 flex-1">
              <li className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                <Check className="w-5 h-5 text-teal-500" /> Unlimited Users & Locations
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                <Check className="w-5 h-5 text-teal-500" /> Custom API Integrations
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                <Check className="w-5 h-5 text-teal-500" /> Dedicated Account Manager
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                <Check className="w-5 h-5 text-teal-500" /> 24/7 Phone Support
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                <Check className="w-5 h-5 text-teal-500" /> On-premise Deployment Option
              </li>
            </ul>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="max-w-5xl mx-auto overflow-x-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center">Detailed Comparison</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="py-4 px-6 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Feature</th>
                <th className="py-4 px-6 text-center text-sm font-bold text-slate-900 dark:text-white">Starter</th>
                <th className="py-4 px-6 text-center text-sm font-bold text-teal-600 dark:text-teal-400">Professional</th>
                <th className="py-4 px-6 text-center text-sm font-bold text-slate-900 dark:text-white">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="py-4 px-6 font-medium text-slate-700 dark:text-slate-300">Inventory Items</td>
                <td className="py-4 px-6 text-center text-slate-600 dark:text-slate-400">1,000</td>
                <td className="py-4 px-6 text-center font-bold text-teal-600 dark:text-teal-400">Unlimited</td>
                <td className="py-4 px-6 text-center text-slate-600 dark:text-slate-400">Unlimited</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-medium text-slate-700 dark:text-slate-300">Sales Reports</td>
                <td className="py-4 px-6 text-center text-slate-600 dark:text-slate-400">Basic</td>
                <td className="py-4 px-6 text-center font-bold text-teal-600 dark:text-teal-400">Advanced</td>
                <td className="py-4 px-6 text-center text-slate-600 dark:text-slate-400">Custom AI Reports</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-medium text-slate-700 dark:text-slate-300">Multi-Location</td>
                <td className="py-4 px-6 text-center"><X className="w-5 h-5 text-slate-300 mx-auto" /></td>
                <td className="py-4 px-6 text-center"><X className="w-5 h-5 text-slate-300 mx-auto" /></td>
                <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-teal-500 mx-auto" /></td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-medium text-slate-700 dark:text-slate-300">API Access</td>
                <td className="py-4 px-6 text-center"><X className="w-5 h-5 text-slate-300 mx-auto" /></td>
                <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-teal-500 mx-auto" /></td>
                <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-teal-500 mx-auto" /></td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default Pricing;