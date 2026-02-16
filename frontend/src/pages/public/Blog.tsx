import React from 'react';

const Blog = () => {
  const posts = [
    { title: "Optimizing Your Pharmacy Inventory", date: "Feb 12, 2026", category: "Optimization", image: "https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?auto=format&fit=crop&q=80&w=800" },
    { title: "Managing Expiry Dates with Automation", date: "Feb 05, 2026", category: "Productivity", image: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&q=80&w=800" },
    { title: "Security Best Practices for Medical Data", date: "Jan 28, 2026", category: "Security", image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800" },
  ];

  return (
    <div className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 tracking-tight">
            Latest from the <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-green-600">Blog</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
            Expert insights and guides for pharmacy owners and managers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {posts.map((p, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-[16/10] rounded-[2rem] overflow-hidden mb-6 shadow-xl relative">
                <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded-full text-[10px] font-black uppercase tracking-widest text-teal-600">{p.category}</div>
              </div>
              <p className="text-xs text-slate-500 font-black uppercase tracking-widest mb-2">{p.date}</p>
              <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors leading-tight">{p.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;