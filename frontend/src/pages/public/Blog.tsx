import React from 'react';
import { Calendar, Tag, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Blog = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 text-white py-24 text-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Zyra Insights</h1>
          <p className="text-xl text-teal-100 font-medium max-w-2xl mx-auto">
            Expert advice, engineering deep dives, and the latest trends in pharmacy management technology.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-24 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
                { 
                    title: "The Future of Pharmacy Automation in 2026",
                    excerpt: "How AI and robotics are reshaping the way independent pharmacies operate, reducing errors and saving time.",
                    category: "Industry Trends",
                    author: "Dr. Emily Ray",
                    date: "Feb 15, 2026",
                    img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80"
                },
                { 
                    title: "Migrating from Legacy Systems to Cloud",
                    excerpt: "A step-by-step guide for pharmacy owners looking to modernize their tech stack without disrupting operations.",
                    category: "Engineering",
                    author: "David Chen",
                    date: "Jan 28, 2026",
                    img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80"
                },
                { 
                    title: "Optimizing Inventory Turnover Ratios",
                    excerpt: "Learn how to use data analytics to identify slow-moving stock and improve your pharmacy's cash flow.",
                    category: "Business Growth",
                    author: "Sarah Jenkins",
                    date: "Jan 10, 2026",
                    img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80"
                },
                { 
                    title: "Understanding HIPAA Compliance in the Cloud",
                    excerpt: "What every pharmacy owner needs to know about data security, encryption, and patient privacy in the digital age.",
                    category: "Compliance",
                    author: "Legal Team",
                    date: "Dec 15, 2025",
                    img: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80"
                },
                { 
                    title: "Zyra v2.0 Release Notes",
                    excerpt: "Introducing our new mobile app, enhanced reporting dashboard, and faster barcode scanning features.",
                    category: "Product Update",
                    author: "Product Team",
                    date: "Nov 22, 2025",
                    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80"
                },
                 { 
                    title: "5 Ways to Improve Patient Adherence",
                    excerpt: "Simple strategies and digital tools to help your patients stick to their medication schedules.",
                    category: "Patient Care",
                    author: "Dr. Emily Ray",
                    date: "Oct 05, 2025",
                    img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80"
                }
            ].map((post, idx) => (
                <article key={idx} className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full">
                    <div className="aspect-video overflow-hidden">
                        <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-8 flex-1 flex flex-col">
                        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-4">
                            <Tag className="w-3 h-3" />
                            {post.category}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-2">
                            {post.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                            {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
                             <div className="flex items-center gap-2">
                                <User className="w-3 h-3" /> {post.author}
                             </div>
                             <div className="flex items-center gap-2">
                                <Calendar className="w-3 h-3" /> {post.date}
                             </div>
                        </div>
                    </div>
                </article>
            ))}
        </div>

        {/* Newsletter CTA */}
        <div className="mt-20 bg-teal-900 rounded-3xl p-12 text-center text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
             <div className="relative z-10 max-w-2xl mx-auto">
                 <h2 className="text-3xl font-bold mb-4">Subscribe to our newsletter</h2>
                 <p className="text-teal-200 mb-8">Get the latest pharmacy insights delivered straight to your inbox. No spam, ever.</p>
                 <div className="flex gap-2 max-w-md mx-auto">
                     <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-teal-200 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                     <button className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl transition-colors">Subscribe</button>
                 </div>
             </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;