import React, { useState, useRef } from 'react';
import useSWR from 'swr';
import apiClient from '../api';
import toast from 'react-hot-toast';
import { Trash2, AlertTriangle, NotebookPen, Palette, Save, X, Pipette, Filter, Calendar } from 'lucide-react';
import PremiumDatePicker from '../components/PremiumDatePicker';
import DatePicker from 'react-datepicker';

interface Note {
  _id: string;
  title: string;
  content: string;
  color: string;
  createdAt: string;
}

const fetcher = (url: string) => apiClient.get(url).then(res => res.data);

const NotesPage: React.FC = () => {
  const { data: notes = [], mutate } = useSWR<Note[]>('/notes', fetcher);
  
  const [newNote, setNewNote] = useState({ title: '', content: '', color: '#FEF9C3' });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const pickerRef = useRef<DatePicker>(null);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.title) return;

    try {
      await apiClient.post('/notes', newNote);
      setNewNote({ title: '', content: '', color: '#FEF9C3' });
      setIsFormOpen(false);
      mutate(); 
      toast.success("Note saved");
    } catch (err) {
      toast.error("Failed to save note");
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
    } catch (err) {
      toast.error("Failed to delete note");
    } finally {
      setNoteToDelete(null);
    }
  };

  // Filter Notes Logic
  const filteredNotes = notes.filter(note => {
    if (!selectedDate) return true;
    const noteDate = new Date(note.createdAt).toDateString();
    const filterDate = selectedDate.toDateString();
    return noteDate === filterDate;
  });

  return (
    <div className="relative min-h-screen bg-transparent transition-colors">
      
      {/* 📌 STICKY HEADER */}
      <div className="sticky top-0 z-20 backdrop-blur-2xl bg-white/60 dark:bg-slate-900/60 border-b border-white/20 dark:border-slate-800 p-6 md:p-8 flex justify-between items-center gap-4 transition-all">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
             <NotebookPen className="w-8 h-8 text-blue-600" /> Manager's Notebook
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Reminders & To-Do List</p>
        </div>
        
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className={`group relative overflow-hidden px-8 py-3 rounded-2xl font-black shadow-xl transition-all active:scale-95 flex items-center gap-2 text-sm whitespace-nowrap ${
            isFormOpen 
            ? 'bg-slate-200 text-slate-600 shadow-none hover:bg-slate-300' 
            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'
          }`}
        >
          {!isFormOpen && <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>}
          {isFormOpen ? <X className="w-4 h-4"/> : <NotebookPen className="w-4 h-4"/>}
          <span className="relative z-10">{isFormOpen ? 'Close Editor' : 'New Note'}</span>
        </button>
      </div>

      <div className="p-6 md:p-8 pt-4">
        
        {/* 🛠️ FILTER BAR (Premium Style) */}
        <div className="mb-8 flex flex-wrap justify-center md:justify-start items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            
            {/* All Notes (Reset) */}
            <button 
                onClick={() => setSelectedDate(null)}
                className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 border hover:-translate-y-0.5 active:scale-95 ${
                    !selectedDate
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20' 
                    : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-md'
                }`}
            >
                <Filter className="w-3.5 h-3.5" /> All Notes
            </button>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden md:block"></div>

            {/* Unified Premium Date Picker */}
            <div className="relative group">
                <PremiumDatePicker 
                    ref={pickerRef}
                    selected={selectedDate} 
                    onChange={(date) => {
                        if (date) {
                            if (date > new Date()) {
                                toast.error("Invalid Selection: Future dates are not allowed.");
                                return;
                            }
                            toast.success(`Showing notes from ${date.toLocaleDateString()}`);
                        }
                        setSelectedDate(date);
                    }} 
                    maxDate={new Date()}
                    placeholder="Select Date"
                    label="FILTER BY DATE"
                    showIcon={true}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 border duration-300 hover:-translate-y-0.5 active:scale-95 ${
                        selectedDate
                        ? 'bg-white/80 dark:bg-slate-900/80 text-blue-600 border-blue-200 dark:border-blue-900 shadow-sm backdrop-blur-md' 
                        : 'bg-white/50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 backdrop-blur-md hover:bg-white dark:hover:bg-slate-800 hover:shadow-md'
                    }`}
                />
            </div>
            
            {/* Clear Button */}
            {selectedDate && (
                <button 
                    onClick={() => setSelectedDate(null)}
                    className="p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all transform hover:rotate-90 hover:scale-110 active:scale-90 duration-300"
                    title="Clear Filter"
                >
                    <X className="w-4 h-4" />
                </button>
            )}

        </div>

        {/* Structured Tiered Grid (Clean, Non-Random Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 grid-flow-row-dense items-stretch">
          {filteredNotes.length > 0 ? filteredNotes.map(note => {
            const isHex = note.color.startsWith('#');
            const len = note.content.length;
            
            // Strict Tiered Logic (Predictable & Clean)
            let colSpanClass = "col-span-1"; 
            if (len > 300) {
                colSpanClass = "col-span-1 md:col-span-2 xl:col-span-3"; // Full Width Row
            } else if (len > 100) {
                colSpanClass = "col-span-1 md:col-span-2"; // Two-Thirds Width
            }

            return (
              <div 
                key={note._id} 
                className={`${colSpanClass} ${!isHex ? note.color : ''} p-8 rounded-[2.5rem] shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative group flex flex-col border border-white/40 dark:border-slate-700/50 backdrop-blur-sm h-full`}
                style={isHex ? { backgroundColor: note.color } : {}}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-black text-slate-900/90 text-xl leading-tight w-full pr-12 break-words">{note.title}</h3>
                  <button 
                    onClick={() => handleDelete(note._id)}
                    className="absolute top-6 right-6 p-2 bg-white/40 hover:bg-red-500 hover:text-white rounded-full text-slate-700 transition-all backdrop-blur-md opacity-0 group-hover:opacity-100 shadow-sm hover:shadow-lg scale-90 hover:scale-100"
                    title="Delete Note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex-1">
                    <p className="text-slate-800/80 text-base whitespace-pre-wrap leading-relaxed font-medium">{note.content}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-black/5 flex justify-end items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-900/40">
                        {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                </div>
              </div>
            );
          }) : (
            <div className="col-span-full text-center py-20">
                <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <NotebookPen className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Your desk is clear.</h3>
                <p className="text-slate-500 dark:text-slate-400">Click "+ New Note" to add a reminder or task.</p>
            </div>
          )}
        </div>
      </div>

      {/* NEW NOTE MODAL (Pop-up) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-8 border border-white/20 dark:border-slate-800 animate-in zoom-in-95 relative">
                <button 
                    onClick={() => setIsFormOpen(false)}
                    className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-red-100 hover:text-red-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-2">
                    <NotebookPen className="w-6 h-6 text-blue-600" /> New Note
                </h2>

                <form onSubmit={handleAddNote} className="flex flex-col gap-6">
                    {/* Title & Color */}
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <input 
                            type="text" 
                            placeholder="Note Title..." 
                            className="flex-1 text-xl font-black bg-transparent border-b-2 border-slate-200 dark:border-slate-700 p-2 text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors placeholder:text-slate-300 dark:placeholder:text-slate-600 w-full"
                            value={newNote.title}
                            onChange={e => setNewNote({...newNote, title: e.target.value})}
                            autoFocus
                        />
                        
                        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-700">
                            <Palette className="w-4 h-4 text-slate-400" />
                            <div className="flex gap-2">
                                {['#FEF9C3', '#DBEAFE', '#DCFCE7', '#FEE2E2', '#F3E8FF'].map((c) => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => setNewNote({...newNote, color: c})}
                                        className={`w-6 h-6 rounded-full border-2 transition-all ${newNote.color === c ? 'border-slate-400 scale-110 shadow-md' : 'border-transparent hover:scale-110'}`}
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                                <div className="relative w-8 h-8 rounded-full border-2 border-slate-200 dark:border-slate-600 shadow-sm transition-transform hover:scale-110 flex items-center justify-center bg-white dark:bg-slate-800">
                                    <div 
                                        className="absolute inset-0 rounded-full"
                                        style={{ backgroundColor: newNote.color.startsWith('#') ? newNote.color : 'transparent' }} 
                                    />
                                    <input 
                                        type="color" 
                                        value={newNote.color.startsWith('#') ? newNote.color : '#FEF9C3'}
                                        onChange={(e) => setNewNote({...newNote, color: e.target.value})}
                                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-20 p-0 border-none"
                                        title="Choose Custom Color"
                                    />
                                    {/* Pipette icon to indicate 'Custom' color picking */}
                                    <Pipette className={`w-3.5 h-3.5 z-10 pointer-events-none ${newNote.color.startsWith('#') ? 'text-white drop-shadow-md' : 'text-slate-400'}`} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <textarea 
                        placeholder="Write your note here..." 
                        className="w-full p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none h-48 transition-all font-medium leading-relaxed"
                        value={newNote.content}
                        onChange={e => setNewNote({...newNote, content: e.target.value})}
                    />
                    
                    <div className="flex justify-end pt-2">
                        <button type="submit" className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-2xl font-black shadow-xl shadow-blue-600/30 transition-all active:scale-95 flex items-center justify-center gap-2 text-sm uppercase tracking-wide">
                            <Save className="w-4 h-4" /> Save Note
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {noteToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-gray-100 dark:border-slate-700 scale-100 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete Note?</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                This action cannot be undone. Are you sure you want to permanently delete this note?
              </p>
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setNoteToDelete(null)}
                  className="flex-1 py-2.5 rounded-xl font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesPage;