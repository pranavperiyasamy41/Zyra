import React, { useState } from 'react';
import useSWR from 'swr';
import apiClient from '../api';
import toast from 'react-hot-toast';

const fetcher = (url: string) => apiClient.get(url).then(res => res.data);

const AdminSupportPage = () => {
  const { data: tickets, mutate } = useSWR('/tickets/all', fetcher);
  const [replyText, setReplyText] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  const handleResolve = async () => {
    if (!selectedTicket || !replyText) return;
    try {
        await apiClient.put(`/tickets/${selectedTicket._id}/resolve`, { reply: replyText });
        toast.success("Ticket Resolved!");
        setReplyText('');
        setSelectedTicket(null);
        mutate();
    } catch(err) { toast.error("Failed to resolve"); }
  };

  if (!tickets) return <div className="p-8 text-white">Loading Tickets...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-black text-white mb-6">🎫 SUPPORT TICKETS</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Ticket List */}
        <div className="col-span-1 space-y-4">
            {tickets.map((t: any) => (
                <div 
                    key={t._id} 
                    onClick={() => setSelectedTicket(t)}
                    className={`p-4 rounded-lg border cursor-pointer hover:bg-slate-800 transition-colors ${selectedTicket?._id === t._id ? 'bg-slate-800 border-blue-500' : 'bg-slate-900 border-slate-700'}`}
                >
                    <div className="flex justify-between mb-2">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded ${t.status === 'OPEN' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>{t.status}</span>
                        <span className="text-xs text-gray-500">{new Date(t.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-white font-bold truncate">{t.subject}</h3>
                    <p className="text-xs text-gray-400 mt-1">From: {t.user?.pharmacyName}</p>
                </div>
            ))}
        </div>

        {/* Reply Panel */}
        <div className="col-span-2 bg-slate-900 rounded-xl border border-slate-700 p-6">
            {selectedTicket ? (
                <>
                    <h2 className="text-xl font-bold text-white mb-4">{selectedTicket.subject}</h2>
                    <div className="bg-slate-800 p-4 rounded-lg text-gray-300 mb-6">
                        {selectedTicket.message}
                    </div>

                    {selectedTicket.status === 'OPEN' ? (
                        <div>
                            <textarea 
                                className="w-full bg-slate-800 text-white p-3 rounded-lg border border-slate-600 outline-none focus:border-blue-500"
                                rows={4}
                                placeholder="Type your reply here..."
                                value={replyText}
                                onChange={e => setReplyText(e.target.value)}
                            />
                            <button onClick={handleResolve} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700">
                                Send Reply & Resolve
                            </button>
                        </div>
                    ) : (
                        <div className="bg-green-900/20 border border-green-800 p-4 rounded text-green-400">
                            <strong>Admin Reply:</strong> {selectedTicket.adminReply}
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center text-gray-500 mt-20">Select a ticket to view details</div>
            )}
        </div>
      </div>
    </div>
  );
};
export default AdminSupportPage;