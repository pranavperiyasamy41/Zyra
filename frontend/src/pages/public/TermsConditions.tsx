import React from 'react';

const TermsConditions = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">Terms of Service</h1>
            <p className="text-slate-600 dark:text-slate-400">Last Updated: January 1, 2026</p>
        </div>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none space-y-12">
            
            <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    By accessing or using the Zyra Systems Inc. ("Zyra") website and platform (collectively, the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to all of these Terms, you may not access or use the Service.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">2. Account Registration</h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    To use certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">3. Use of the Service</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-4">You agree not to do any of the following:</p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-300">
                    <li>Use the Service for any illegal purpose or in violation of any local, state, national, or international law.</li>
                    <li>Violate, or encourage others to violate, any right of a third party, including by infringing or misappropriating any third-party intellectual property right.</li>
                    <li>Interfere with security-related features of the Service, including by disabling or circumventing features that prevent or limit use or copying of any content.</li>
                    <li>Interfere with the operation of the Service or any user's enjoyment of the Service, including by uploading or otherwise disseminating any virus, adware, spyware, worm, or other malicious code.</li>
                    <li>Attempt to access any service or area of the Service that you are not authorized to access.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">4. Payment and Billing</h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Certain aspects of the Service may be provided for a fee or other charge. If you elect to use paid aspects of the Service, you agree to the pricing and payment terms as we may update them from time to time. Zyra may add new services for additional fees and charges, or amend fees and charges for existing services, at any time in its sole discretion.
                </p>
                <p className="text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
                    All fees are non-refundable unless otherwise expressly provided herein or required by applicable law.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">5. Intellectual Property</h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    The Service and its original content, features, and functionality are and will remain the exclusive property of Zyra and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Zyra.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">6. Termination</h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">7. Limitation of Liability</h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    In no event shall Zyra, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.
                </p>
            </section>

            <section className="border-t border-slate-200 dark:border-slate-800 pt-8 mt-12">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Contact Us</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-4">If you have any questions about these Terms, please contact us:</p>
                <ul className="list-none space-y-2 text-slate-600 dark:text-slate-300">
                    <li>By email: <a href="mailto:zyra.pharmacy@gmail.com" className="text-teal-600 hover:underline">zyra.pharmacy@gmail.com</a></li>
                    <li>By mail: Main Road, Attur, Salem, Tamil Nadu 636102, India</li>
                </ul>
            </section>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;