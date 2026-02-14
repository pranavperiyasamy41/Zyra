import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import apiClient from '../api';
import { X, Megaphone, Bell, Shield, Send, AlertTriangle, Check } from 'lucide-react';

interface AdminAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  mutateAnnouncements: () => void;
}

const AdminAnnouncementModal: React.FC<AdminAnnouncementModalProps> = ({ isOpen, onClose, mutateAnnouncements }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('system');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await apiClient.post('/announcements', { title, content, type });
      mutateAnnouncements();
      onClose();
      setTitle('');
      setContent('');
      setType('system');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to post announcement.');
    } finally {
      setLoading(false);
    }
  };

  const types = [
    { id: 'system', label: 'System Wide', icon: Bell, color: 'text-blue-600', bg: 'bg-blue-100', active: 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 shadow-lg shadow-blue-500/10 scale-[1.02]' },
    { id: 'alert', label: 'Critical Alert', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100', active: 'border-red-500 bg-red-50/50 dark:bg-red-900/20 shadow-lg shadow-red-500/10 scale-[1.02]' },
    { id: 'internal', label: 'Internal Note', icon: Shield, color: 'text-amber-600', bg: 'bg-amber-100', active: 'border-amber-500 bg-amber-50/50 dark:bg-amber-900/20 shadow-lg shadow-amber-500/10 scale-[1.02]' },
  ];

  return createPortal(
    <div className="fixed top-0 left-0 w-screen h-screen z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div 
          style={{ background: 'linear-gradient(90deg, #0E5A4E 0%, #1E7F4F 50%, #25A756 100%)' }}
          className="px-8 py-6 flex justify-between items-center shadow-lg relative overflow-hidden shrink-0"
        >
          <div className="relative z-10 flex items-center gap-3">
            <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl text-white">
              <Megaphone className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">New Broadcast</h2>
          </div>
          <button 
            onClick={onClose} 
            className="relative z-10 p-2 bg-white/10 dark:bg-slate-800/20 rounded-full text-white/80 hover:text-white transition-all backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>
          {/* Decor */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
        </div>

        {/* BODY */}
        <div className="p-8 overflow-y-auto bg-slate-50 dark:bg-slate-900/50">
          <form id="announcement-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* TYPE SELECTOR */}
            <div className="space-y-3">
                <label className="text-xs font-black text-black dark:text-white uppercase tracking-widest ml-1">Broadcast Type</label>
                <div className="grid grid-cols-3 gap-3">
                    {types.map((t) => {
                        const isSelected = type === t.id;
                        return (
                            <label key={t.id} className="cursor-pointer group relative">
                                <input 
                                    type="radio" 
                                    name="type" 
                                    value={t.id} 
                                    checked={isSelected} 
                                    onChange={(e) => setType(e.target.value)} 
                                    className="sr-only"
                                />
                                <div className={`p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2 relative ${
                                    isSelected 
                                    ? t.active 
                                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700'
                                }`}>
                                    {/* Selection Checkmark */}
                                    {isSelected && (
                                        <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white shadow-md animate-in zoom-in duration-300 ${
                                            t.id === 'system' ? 'bg-blue-500' : t.id === 'alert' ? 'bg-red-500' : 'bg-amber-500'
                                        }`}>
                                            <Check className="w-3.5 h-3.5 stroke-[4]" />
                                        </div>
                                    )}

                                    <div className={`p-2 rounded-xl transition-transform duration-300 ${isSelected ? 'scale-110' : 'group-hover:scale-105'} ${t.bg} ${t.color}`}>
                                        <t.icon className="w-5 h-5" />
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-wide text-center leading-tight transition-colors ${
                                        isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'
                                    }`}>
                                        {t.label}
                                    </span>
                                </div>
                            </label>
                        );
                    })}
                </div>
            </div>

            {/* TITLE */}
            <div className="space-y-1">
                <label className="text-xs font-black text-black dark:text-white uppercase tracking-widest ml-1">Headline</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. System Maintenance Tonight"
                    required
                    className="w-full px-5 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400 shadow-sm"
                />
            </div>
            
            {/* CONTENT */}
            <div className="space-y-1">
                <label className="text-xs font-black text-black dark:text-white uppercase tracking-widest ml-1">Message Body</label>
                <textarea
                    rows={5}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Type your message here..."
                    required
                    className="w-full px-5 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400 resize-none shadow-sm"
                />
            </div>

            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-bold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> {error}
                </div>
            )}

          </form>
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end gap-3 shrink-0">
            <button 
              onClick={onClose} 
              className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors text-xs uppercase tracking-widest"
            >
              Cancel
            </button>
            <button
              form="announcement-form"
              type="submit"
              disabled={loading}
              className="group relative overflow-hidden bg-gradient-to-r from-brand-btn-start to-brand-btn-end hover:shadow-brand-btn-end/40 text-white px-8 py-3 rounded-xl font-black shadow-xl shadow-brand-btn-start/30 transition-all active:scale-95 flex items-center gap-2 text-xs uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <span className="relative z-10 flex items-center gap-2">
                {loading ? 'Posting...' : 'Publish'} <Send className="w-4 h-4" />
              </span>
            </button>
        </div>

      </div>
    </div>,
    document.body
  );
};

export default AdminAnnouncementModal;