import React, { useState } from 'react';
import apiClient from '../api';

interface AdminAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  mutateAnnouncements: () => void; // Function to refresh the list on the dashboard
}

const AdminAnnouncementModal: React.FC<AdminAnnouncementModalProps> = ({ isOpen, onClose, mutateAnnouncements }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('system');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // POST request to the secure admin announcement endpoint
      await apiClient.post('/announcements', { title, content, type });
      
      mutateAnnouncements(); // Refresh the list on the Admin Dashboard
      onClose(); // Close the modal

      // Reset form state
      setTitle('');
      setContent('');
      setType('system');
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to post announcement. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-2xl dark:bg-slate-800 dark:border dark:border-slate-700">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4 dark:border-slate-700">
          <h2 className="text-xl font-bold dark:text-white">Post New System Announcement</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-slate-400 text-2xl leading-none">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Announcement Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                Announcement Type
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            >
              <option value="system">System-Wide (All Users)</option>
              <option value="internal">Internal Note (Admin/SuperAdmin Only)</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
              Title
            </label>
            <input
              id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            />
          </div>
          
          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
              Content / Details
            </label>
            <textarea
              id="content" rows={4} value={content} onChange={(e) => setContent(e.target.value)} required
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end space-x-3 pt-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="rounded-md bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Posting...' : 'Post Announcement'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AdminAnnouncementModal;