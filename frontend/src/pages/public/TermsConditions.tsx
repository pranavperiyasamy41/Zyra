import React from 'react';

const TermsConditions = () => {
  return (
    <div className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
          <h1 className="text-4xl font-black mb-8 tracking-tight uppercase text-slate-900 dark:text-white">Terms of Service</h1>
          <p className="text-slate-500 font-bold mb-8">Last Updated: February 16, 2026</p>
          
          <div className="space-y-10 text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            <section>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tight">1. Acceptance of Terms</h2>
              <p>By accessing or using Zyra, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tight">2. Use License</h2>
              <p>Permission is granted to use our software for your pharmacy's internal business operations. This is a license, not a transfer of title.</p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tight">3. User Conduct</h2>
              <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tight">4. Limitation of Liability</h2>
              <p>Zyra and its suppliers shall not be liable for any damages arising out of the use or inability to use the platform.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;