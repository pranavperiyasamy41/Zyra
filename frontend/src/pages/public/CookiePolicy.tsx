import React from 'react';

const CookiePolicy = () => {
  return (
    <div className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
          <h1 className="text-4xl font-black mb-8 tracking-tight uppercase text-slate-900 dark:text-white">Cookie Policy</h1>
          <p className="text-slate-500 font-bold mb-8">Last Updated: February 16, 2026</p>
          
          <div className="space-y-10 text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            <section>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tight">1. What are Cookies?</h2>
              <p>Cookies are small text files stored on your device when you visit a website. They help us remember your preferences and improve your experience.</p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tight">2. How We Use Cookies</h2>
              <p>We use essential cookies for authentication and security. We also use analytics cookies to understand how users interact with our platform.</p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tight">3. Managing Cookies</h2>
              <p>You can choose to disable cookies through your browser settings. However, some parts of our platform may not function correctly without them.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;