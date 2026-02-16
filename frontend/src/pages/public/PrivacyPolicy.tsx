import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
          <h1 className="text-4xl font-black mb-8 tracking-tight uppercase text-slate-900 dark:text-white">Privacy Policy</h1>
          <p className="text-slate-500 font-bold mb-8">Last Updated: February 16, 2026</p>
          
          <div className="space-y-10 text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            <section>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tight">1. Information We Collect</h2>
              <p>We collect information you provide directly to us when you create an account, such as your name, email, pharmacy details, and contact information. We also collect transaction data and inventory records managed through our platform.</p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tight">2. How We Use Information</h2>
              <p>We use the collected information to provide and improve our services, process transactions, communicate with you, and ensure the security of our platform. We never sell your personal or business data to third parties.</p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tight">3. Data Security</h2>
              <p>We implement robust security measures to protect your data, including encryption, secure access controls, and regular audits. However, no method of transmission over the internet is 100% secure.</p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tight">4. Your Rights</h2>
              <p>You have the right to access, correct, or delete your personal information. You can manage your account settings or contact us directly for assistance with data management.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;