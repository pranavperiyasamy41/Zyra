import React, { useState } from 'react';
import useSWR from 'swr';
import apiClient from '../api';

const fetcher = (url: string) => apiClient.get(url).then(res => res.data);

const SupportPage = () => {
  const { data: tickets, mutate } = useSWR('/tickets/my', fetcher);
  const [formData, setFormData] = useState({ subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiClient.post('/tickets', formData);
    alert("✅ Ticket Created!");
    setFormData({ subject: '', message: '' });
    mutate();
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-8">🛠️ SUPPORT CENTER</h1>
      
      {/* Create Ticket */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg mb-8">
        <h2 className="text-lg font-bold dark:text-white mb-4">Create New Ticket</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <input 
                className="w-full p-3 border rounded-lg dark:bg-slate-900 dark:text-white dark:border-slate-700" 
                placeholder="Subject" 
                value={formData.subject}
                onChange={e => setFormData({...formData, subject: e.target.value})}
                required
            />
            <textarea 
                className="w-full p-3 border rounded-lg dark:bg-slate-900 dark:text-white dark:border-slate-700" 
                rows={3}
                placeholder="Describe your issue..." 
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                required
            />
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">Submit Ticket</button>
        </form>
      </div>

      {/* History */}
      <h2 className="text-lg font-bold dark:text-white mb-4">My Tickets</h2>
      <div className="space-y-4">
        {tickets?.map((t: any) => (
            <div key={t._id} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow border-l-4 border-blue-500">
                <div className="flex justify-between mb-2">
                    <h3 className="font-bold dark:text-white text-lg">{t.subject}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${t.status === 'OPEN' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{t.status}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{t.message}</p>
                {t.adminReply && (
                    <div className="bg-gray-100 dark:bg-slate-900 p-3 rounded text-sm dark:text-gray-300">
                        <strong>👨‍💼 Admin:</strong> {t.adminReply}
                    </div>
                )}
            </div>
        ))}
      </div>
    </div>
  );
};
export default SupportPage;