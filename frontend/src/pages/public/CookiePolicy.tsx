import React from 'react';

const CookiePolicy = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">Cookie Policy</h1>
            <p className="text-slate-600 dark:text-slate-400">Effective Date: January 1, 2026</p>
        </div>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none space-y-12">
            
            <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. What Are Cookies?</h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Cookies are small text files that are placed on your computer or mobile device by websites that you visit. They are widely used in order to make websites work, or work more efficiently, as well as to provide information to the owners of the site. Zyra uses cookies to improve your experience on our platform, to keep you signed in, and to analyze how our service is used.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">2. How We Use Cookies</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-4">We use cookies for the following purposes:</p>
                
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-6 mb-3">A. Essential Cookies</h3>
                <p className="text-slate-600 dark:text-slate-300">
                    These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in or filling in forms. You can set your browser to block or alert you about these cookies, but some parts of the site will not then work. These cookies do not store any personally identifiable information.
                </p>

                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-6 mb-3">B. Performance Cookies</h3>
                <p className="text-slate-600 dark:text-slate-300">
                    These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site. All information these cookies collect is aggregated and therefore anonymous. If you do not allow these cookies we will not know when you have visited our site, and will not be able to monitor its performance.
                </p>

                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-6 mb-3">C. Functional Cookies</h3>
                <p className="text-slate-600 dark:text-slate-300">
                    These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we have added to our pages. If you do not allow these cookies then some or all of these services may not function properly.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">3. Managing Cookies</h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Most web browsers allow some control of most cookies through the browser settings. To find out more about cookies, including how to see what cookies have been set, visit <a href="http://www.aboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">www.aboutcookies.org</a> or <a href="http://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">www.allaboutcookies.org</a>.
                </p>
                <p className="text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
                    Find out how to manage cookies on popular browsers:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-300 mt-4">
                    <li><a href="https://support.google.com/accounts/answer/61416?co=GENIE.Platform%3DDesktop&hl=en" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">Google Chrome</a></li>
                    <li><a href="https://support.microsoft.com/en-us/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">Microsoft Edge</a></li>
                    <li><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">Mozilla Firefox</a></li>
                    <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">Apple Safari</a></li>
                </ul>
            </section>

            <section className="border-t border-slate-200 dark:border-slate-800 pt-8 mt-12">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Contact Us</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-4">If you have any questions about our use of cookies, please contact us:</p>
                <ul className="list-none space-y-2 text-slate-600 dark:text-slate-300">
                    <li>By email: <a href="mailto:zyra.pharmacy@gmail.com" className="text-teal-600 hover:underline">zyra.pharmacy@gmail.com</a></li>
                </ul>
            </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;