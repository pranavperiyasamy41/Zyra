import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import useSWR from 'swr';
import apiClient from '../api';
import toast from 'react-hot-toast';
import { 
  Trash2, 
  AlertTriangle, 
  NotebookPen, 
  Save, 
  X, 
  Plus, 
  Pin, 
  CheckCircle 
} from 'lucide-react';
import PremiumDatePicker from '../components/PremiumDatePicker';
import DatePicker from 'react-datepicker';

interface Note {
  _id: string;
  title: string;
  content: string;
  color: string;
  isPinned: boolean;
  priority: 'normal' | 'urgent' | 'personal';
  createdAt: string;
}

const fetcher = (url: string) => apiClient.get(url).then(res => res.data);

const NotesPage: React.FC = () => {
  const { data: notes = [], mutate } = useSWR<Note[]>('/notes', fetcher);
  
  const [newNote, setNewNote] = useState({ title: '', content: '', color: 'yellow', priority: 'normal' });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'urgent' | 'personal'>('all');
  const [createLoading, setCreateLoading] = useState(false);
  
  const pickerRef = useRef<DatePicker>(null);

  // Lock body scroll when any modal is open
  useEffect(() => {
    if (isAddModalOpen || !!selectedNote || !!noteToDelete) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isAddModalOpen, selectedNote, noteToDelete]);

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.title) return;
    setCreateLoading(true);

    try {
      await apiClient.post('/notes', newNote);
      setNewNote({ title: '', content: '', color: 'yellow', priority: 'normal' });
      setIsAddModalOpen(false);
      mutate(); 
      toast.success("Note saved");
    } catch (err) {
      toast.error("Failed to save note");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setNoteToDelete(id);
  };

  const confirmDelete = async () => {
    if (!noteToDelete) return;
    try {
      await apiClient.delete(`/notes/${noteToDelete}`);
      mutate();
      toast.success("Note deleted");
      setSelectedNote(null);
    } catch (err) {
      toast.error("Failed to delete note");
    } finally {
      setNoteToDelete(null);
    }
  };

  const togglePin = async (id: string, currentStatus: boolean) => {
      try {
          await apiClient.put(`/notes/${id}`, { isPinned: !currentStatus });
          mutate();
          toast.success(currentStatus ? "Note unpinned" : "Note pinned");
      } catch (err) {
          toast.error("Failed to update pin");
      }
  };

  // Filter Notes Logic
  const filteredNotes = (Array.isArray(notes) ? notes : []).filter(nt => {
    if (activeFilter !== 'all' && nt.priority !== activeFilter) return false;
    if (!selectedDate) return true;
    const noteDate = new Date(nt.createdAt).toDateString();
    const filterDate = selectedDate.toDateString();
    return noteDate === filterDate;
  }).sort((a, b) => (a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1));

  return (
    <div className="relative min-h-screen bg-transparent transition-colors">
      
      {/* 📌 FIXED HEADER */}
      <div className="fixed top-20 left-0 right-0 z-30 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-white/20 dark:border-slate-800 p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-4 transition-all shadow-md">
        <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                <NotebookPen className="w-8 h-8 text-[#064E48] dark:text-[#CDEB8B]" /> Manager's Notebook
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Keep track of tasks and reminders.</p>
        </div>
        
        <div className="flex gap-2">
            {['all', 'urgent', 'personal'].map((f) => (
                <button 
                    key={f}
                    onClick={() => setActiveFilter(f as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                        activeFilter === f 
                        ? 'bg-gradient-to-r from-[#0B5E4A] to-[#1FAE63] text-white shadow-lg shadow-[#0B5E4A]/20' 
                        : 'bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                >
                    {f}
                </button>
            ))}
            <button 
                onClick={() => setIsAddModalOpen(true)}
                className="group relative overflow-hidden bg-gradient-to-r from-[#0B5E4A] to-[#1FAE63] hover:shadow-[#1FAE63]/40 text-white px-6 py-2.5 rounded-xl font-black shadow-xl shadow-[#0B5E4A]/30 transition-all active:scale-95 flex items-center gap-2 text-xs uppercase tracking-wider"
            >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <Plus className="w-4 h-4 relative z-10 text-white" /> 
                <span className="relative z-10 text-white">New Note</span>
            </button>
        </div>
      </div>

      {/* SPACER FOR FIXED HEADER */}
      <div className="h-[340px] sm:h-[260px] md:h-[140px] w-full"></div>

      <div className="p-4 md:p-8 pt-2 md:pt-4 max-w-7xl mx-auto">
        {filteredNotes.length === 0 ? (
            <div className="text-center py-20 bg-white/50 dark:bg-slate-900/50 rounded-2xl md:rounded-[2.5rem] border border-dashed border-slate-300 dark:border-slate-700">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <NotebookPen className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-400 font-bold text-sm">No notes found.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredNotes.map((item) => (
                    <div 
                        key={item._id} 
                        onClick={() => setSelectedNote(item)}
                        className={`group relative p-5 md:p-6 rounded-2xl md:rounded-[2rem] border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer ${
                            item.isPinned 
                            ? 'bg-white/80 dark:bg-slate-900/80 text-teal-600 border-teal-200 dark:border-teal-900 shadow-sm backdrop-blur-md' 
                            : 'bg-white/60 dark:bg-slate-900/60 border-white/40 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                        }`}
                    >
                        <div className={`absolute top-4 right-4 flex gap-1.5 transition-opacity duration-300 ${
                            item.isPinned 
                            ? 'opacity-100' 
                            : 'opacity-100 md:opacity-0 group-hover:opacity-100'
                        }`}>
                            <button onClick={(e) => { e.stopPropagation(); togglePin(item._id, item.isPinned); }} className={`p-1.5 md:p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${item.isPinned ? 'text-teal-500 bg-teal-50 dark:bg-teal-900/20' : 'text-slate-400'}`}>
                                <Pin className={`w-3.5 h-3.5 md:w-4 md:h-4 ${item.isPinned ? 'fill-current rotate-45' : ''}`} />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); handleDelete(item._id); }} className="p-1.5 md:p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors">
                                <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            </button>
                        </div>

                        <div className="flex items-start justify-between mb-3 md:mb-4">
                            <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${
                                item.priority === 'urgent' ? 'bg-red-100 text-red-600 dark:bg-red-900/20' : 
                                item.priority === 'personal' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/20' : 
                                'bg-slate-100 text-slate-600 dark:bg-slate-800'
                            }`}>
                                {item.priority}
                            </span>
                        </div>

                        <h3 className={`text-base md:text-lg font-black mb-1.5 md:mb-2 line-clamp-1 ${item.isPinned ? 'text-teal-700 dark:text-teal-400' : 'text-slate-900 dark:text-white'}`}>
                            {item.title}
                        </h3>
                        
                        <div className="h-28 overflow-y-auto custom-scrollbar pr-2 mb-4 md:mb-6">
                            <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm leading-relaxed font-medium">
                                {item.content}
                            </p>
                        </div>

                        <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-slate-100 dark:border-slate-800/50">
                            <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold text-slate-400 uppercase">
                                <span>Date:</span>
                                <span className="text-slate-500 dark:text-slate-300">{new Date(item.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${
                                item.color === 'red' ? 'bg-red-400' :
                                item.color === 'green' ? 'bg-emerald-400' :
                                item.color === 'blue' ? 'bg-teal-400' :
                                'bg-yellow-400'
                            }`}></div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* Add Note Modal */}
      {isAddModalOpen && createPortal(
        <div className="fixed top-0 left-0 w-screen h-screen z-[9999] flex items-center justify-center p-4 bg-transparent backdrop-blur-xl animate-in fade-in duration-300">
            <div className="bg-white/90 dark:bg-slate-950/90 rounded-[2.5rem] shadow-2xl w-full max-w-lg scale-100 animate-in zoom-in-95 duration-300 overflow-hidden flex flex-col border border-white/20">
                <div 
                    style={{ background: 'linear-gradient(90deg, #0E5A4E 0%, #1E7F4F 50%, #25A756 100%)' }}
                    className="p-6 flex justify-between items-center shadow-lg relative overflow-hidden shrink-0 rounded-t-[2.5rem]"
                >
                    <div className="relative z-10 flex items-center gap-3">
                        <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl text-white">
                            <NotebookPen className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tight">Create Note</h2>
                    </div>
                    <button onClick={() => setIsAddModalOpen(false)} className="relative z-10 p-2 hover:bg-white/20 rounded-full text-white/80 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-8 space-y-6 overflow-y-auto">
                    <div className="relative group">
                        <label className="text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2 block pl-1">Title</label>
                        <div className="relative">
                            <NotebookPen className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 group-focus-within:text-teal-500 transition-all duration-300 transform group-hover:scale-110" />
                            <input 
                                name="title" 
                                value={newNote.title} 
                                onChange={(e) => setNewNote({...newNote, title: e.target.value})} 
                                className="w-full pl-12 pr-4 py-3.5 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400" 
                                placeholder="Note Title..." 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-black text-black dark:text-white uppercase tracking-widest mb-3 block pl-1">Priority Level</label>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { id: 'normal', label: 'Normal', color: 'slate' },
                                { id: 'urgent', label: 'Urgent', color: 'red' },
                                { id: 'personal', label: 'Personal', color: 'purple' }
                            ].map((p) => (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => setNewNote({...newNote, priority: p.id as any})}
                                    className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                                        newNote.priority === p.id 
                                        ? 'bg-gradient-to-r from-[#0B5E4A] to-[#1FAE63] text-white border-transparent shadow-lg shadow-[#0B5E4A]/20 scale-[1.02]' 
                                        : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-600 dark:hover:text-slate-300'
                                    }`}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="relative group">
                        <label className="text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2 block pl-1">Content</label>
                        <textarea 
                            name="content" 
                            value={newNote.content} 
                            onChange={(e) => setNewNote({...newNote, content: e.target.value})} 
                            className="w-full p-6 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-[2rem] text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400 h-48 resize-none leading-relaxed" 
                            placeholder="Write your note here..." 
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3.5 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-colors text-sm uppercase tracking-wide">Cancel</button>
                        <button onClick={handleCreateNote} disabled={createLoading} className="flex-[2] group relative overflow-hidden bg-gradient-to-r from-[#0B5E4A] to-[#1FAE63] text-white py-3.5 rounded-2xl font-black shadow-xl shadow-[#0B5E4A]/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm uppercase tracking-wide">
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                            <span className="relative z-10 flex items-center gap-2">{createLoading ? 'Saving...' : 'Save Note'} <CheckCircle className="w-4 h-4" /></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
      )}

      {/* View Modal */}
      {selectedNote && createPortal(
          <div className="fixed top-0 left-0 w-screen h-screen z-[9999] flex items-center justify-center p-4 bg-transparent backdrop-blur-2xl animate-in fade-in duration-300">
             <div className="bg-white/90 dark:bg-slate-950/90 rounded-[2.5rem] shadow-2xl w-full max-w-lg scale-100 animate-in zoom-in-95 duration-300 overflow-hidden flex flex-col border border-white/20">
                <div 
                    style={{ background: 'linear-gradient(90deg, #0E5A4E 0%, #1E7F4F 50%, #25A756 100%)' }}
                    className="p-6 flex justify-between items-center shadow-lg relative overflow-hidden shrink-0 rounded-t-[2.5rem]"
                >
                    <div className="relative z-10 flex items-center gap-3">
                        <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl text-white">
                            <NotebookPen className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tight line-clamp-1 max-w-[250px]">
                            {selectedNote.title}
                        </h2>
                    </div>
                    <button onClick={() => setSelectedNote(null)} className="relative z-10 p-2 hover:bg-white/20 rounded-full text-white/80 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                </div>

                <div className="p-8 space-y-6">
                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase ${
                            selectedNote.priority === 'urgent' ? 'bg-red-500 text-white' : 
                            selectedNote.priority === 'personal' ? 'bg-purple-500 text-white' : 
                            'bg-slate-600 text-white'
                        }`}>
                            {selectedNote.priority}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                            <div className={`w-2.5 h-2.5 rounded-sm shadow-sm ${
                                selectedNote.color === 'red' ? 'bg-red-400' :
                                selectedNote.color === 'green' ? 'bg-emerald-400' :
                                selectedNote.color === 'blue' ? 'bg-teal-400' :
                                'bg-yellow-400'
                            }`} />
                            <span>Date:</span>
                            <span className="text-slate-900 dark:text-white">{new Date(selectedNote.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                    
                    <div className="max-h-[45vh] overflow-y-auto custom-scrollbar pr-4">
                        <p className="text-slate-700 dark:text-slate-200 text-base leading-relaxed whitespace-pre-wrap font-medium">
                            {selectedNote.content}
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                        <button 
                            onClick={() => handleDelete(selectedNote._id)} 
                            className="flex-1 py-3.5 rounded-2xl font-black text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 transition-all uppercase tracking-widest text-xs"
                        >
                            Delete Note
                        </button>
                        <button 
                            onClick={() => setSelectedNote(null)} 
                            className="flex-[2] group relative overflow-hidden bg-gradient-to-r from-[#0B5E4A] to-[#1FAE63] text-white py-3.5 rounded-2xl font-black shadow-xl shadow-[#0B5E4A]/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
                        >
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                            <span className="relative z-10">Close Note</span>
                        </button>
                    </div>
                </div>
             </div>
          </div>,
          document.body
      )}

      {/* Delete Confirmation Modal */}
      {noteToDelete && createPortal(
        <div className="fixed top-0 left-0 w-screen h-screen z-[9999] flex items-center justify-center p-4 bg-transparent backdrop-blur-xl animate-in fade-in duration-200">
          <div className="bg-white/90 dark:bg-slate-950/90 rounded-3xl shadow-2xl max-w-sm w-full p-8 border border-white/20 dark:border-slate-800 scale-100 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Delete Note?</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed font-medium">Are you sure you want to remove this reminder?</p>
              <div className="flex gap-3 w-full">
                <button onClick={() => setNoteToDelete(null)} className="flex-1 py-3.5 rounded-2xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors text-sm">Cancel</button>
                <button onClick={confirmDelete} className="flex-1 py-3.5 rounded-2xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-xl shadow-red-600/30 transition-all text-sm">Confirm Delete</button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default NotesPage;