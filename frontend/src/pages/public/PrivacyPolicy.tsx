import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">Privacy Policy</h1>
            <p className="text-slate-600 dark:text-slate-400">Effective Date: January 1, 2026</p>
        </div>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none space-y-12">
            
            <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. Introduction</h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Zyra Systems Inc. ("Zyra", "we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our inventory management platform, and engage with our services.
                </p>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4">
                    Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">2. Information We Collect</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-4">We collect information that identifies, relates to, describes, references, is capable of being associated with, or could reasonably be linked, directly or indirectly, with a particular consumer or device ("personal information").</p>
                
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-6 mb-3">A. Personal Data</h3>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-300">
                    <li><strong>Identity Data:</strong> Name, username, or similar identifier.</li>
                    <li><strong>Contact Data:</strong> Billing address, delivery address, email address, and telephone numbers.</li>
                    <li><strong>Financial Data:</strong> Bank account and payment card details (processed securely by our payment processors).</li>
                    <li><strong>Transaction Data:</strong> Details about payments to and from you and other details of products and services you have purchased from us.</li>
                </ul>

                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-6 mb-3">B. Usage Data</h3>
                <p className="text-slate-600 dark:text-slate-300">
                    We may also collect information about how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">3. How We Use Your Information</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-4">We use the collected data for various purposes:</p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-300">
                    <li>To provide and maintain the Service</li>
                    <li>To notify you about changes to our Service</li>
                    <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
                    <li>To provide customer care and support</li>
                    <li>To provide analysis or valuable information so that we can improve the Service</li>
                    <li>To monitor the usage of the Service</li>
                    <li>To detect, prevent and address technical issues</li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">4. Data Security</h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security. We implement appropriate technical and organizational measures to protect the personal data that we collect and process.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">5. Your Data Protection Rights</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-4">We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:</p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-300">
                    <li><strong>The right to access</strong> – You have the right to request copies of your personal data.</li>
                    <li><strong>The right to rectification</strong> – You have the right to request that we correct any information you believe is inaccurate.</li>
                    <li><strong>The right to erasure</strong> – You have the right to request that we erase your personal data, under certain conditions.</li>
                    <li><strong>The right to restrict processing</strong> – You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
                    <li><strong>The right to object to processing</strong> – You have the right to object to our processing of your personal data, under certain conditions.</li>
                    <li><strong>The right to data portability</strong> – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
                </ul>
            </section>

            <section className="border-t border-slate-200 dark:border-slate-800 pt-8 mt-12">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Contact Us</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-4">If you have any questions about this Privacy Policy, please contact us:</p>
                <ul className="list-none space-y-2 text-slate-600 dark:text-slate-300">
                    <li>By email: <a href="mailto:zyra.pharmacy@gmail.com" className="text-teal-600 hover:underline">zyra.pharmacy@gmail.com</a></li>
                    <li>By visiting this page on our website: <a href="/contact" className="text-teal-600 hover:underline">/contact</a></li>
                </ul>
            </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;