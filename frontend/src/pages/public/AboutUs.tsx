import React from 'react';

const AboutUs = () => {
  return (
    <div className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-8 tracking-tight text-center">
            Modernizing Pharmacy <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-green-600">Inventory Management</span>
          </h1>
          
          <div className="prose prose-lg dark:prose-invert mx-auto space-y-8 text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            <p className="text-xl text-center">
              Zyra was founded with a single mission: to provide pharmacists with the tools they need to operate more efficiently in a digital-first world.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-12">
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Our Vision</h3>
                <p>We believe that technology should be an enabler, not a hurdle. By automating mundane tasks, we free up pharmacists to focus on what matters most: patient care.</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Our Story</h3>
                <p>Starting as a small project to help a local pharmacy, Zyra has grown into a comprehensive platform trusted by hundreds of businesses across the country.</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-teal-600 to-green-600 rounded-[2.5rem] p-8 sm:p-12 text-white shadow-2xl shadow-teal-500/20">
              <h2 className="text-3xl font-black mb-6 uppercase tracking-tight">Built for Scale</h2>
              <p className="text-emerald-100 opacity-90">Our infrastructure is designed to handle millions of transactions, ensuring that whether you run a single shop or a nationwide chain, Zyra stays fast and reliable.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;