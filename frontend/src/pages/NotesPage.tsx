import React, { useState } from 'react';
import useSWR from 'swr';
import apiClient from '../api';

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
  
  const [newNote, setNewNote] = useState({ title: '', content: '', color: 'bg-yellow-100' });
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Available Colors for Sticky Notes
  const colors = [
    { name: 'Yellow', val: 'bg-yellow-100' },
    { name: 'Blue', val: 'bg-blue-100' },
    { name: 'Green', val: 'bg-green-100' },
    { name: 'Pink', val: 'bg-pink-100' },
    { name: 'Purple', val: 'bg-purple-100' },
  ];

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.title) return;

    try {
      await apiClient.post('/notes', newNote);
      setNewNote({ title: '', content: '', color: 'bg-yellow-100' }); // Reset
      setIsFormOpen(false);
      mutate(); // Refresh list
    } catch (err) {
      alert("Failed to save note");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Trash this note?")) {
      await apiClient.delete(`/notes/${id}`);
      mutate();
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Manager's Notebook</h1>
          <p className="text-gray-500">Reminders & To-Do List</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-gray-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 transition-all shadow-lg"
        >
          {isFormOpen ? 'Close Editor' : '+ New Note'}
        </button>
      </div>

      {/* 📝 Quick Add Form (Collapsible) */}
      {isFormOpen && (
        <div className="mb-8 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 animate-fadeIn">
          <form onSubmit={handleAddNote}>
            <div className="flex flex-col gap-4">
              <input 
                type="text" 
                placeholder="Title (e.g., Call Supplier)" 
                className="text-lg font-bold p-2 border-b-2 border-gray-200 dark:bg-slate-800 dark:text-white dark:border-slate-600 outline-none focus:border-blue-500"
                value={newNote.title}
                onChange={e => setNewNote({...newNote, title: e.target.value})}
                autoFocus
              />
              <textarea 
                placeholder="Details..." 
                className="w-full p-3 rounded bg-gray-50 dark:bg-slate-900 dark:text-gray-300 outline-none resize-none h-24"
                value={newNote.content}
                onChange={e => setNewNote({...newNote, content: e.target.value})}
              />
              
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  {colors.map(c => (
                    <button
                      key={c.val}
                      type="button"
                      onClick={() => setNewNote({...newNote, color: c.val})}
                      className={`w-8 h-8 rounded-full border-2 ${c.val} ${newNote.color === c.val ? 'border-gray-500 scale-110' : 'border-transparent'}`}
                      title={c.name}
                    />
                  ))}
                </div>
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">
                  Save Note
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* 📌 Sticky Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {notes.length > 0 ? notes.map(note => (
          <div key={note._id} className={`${note.color} p-6 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 relative group min-h-[200px] flex flex-col`}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-black text-gray-800 text-lg leading-tight">{note.title}</h3>
              <button 
                onClick={() => handleDelete(note._id)}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 font-bold transition-opacity"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-700 text-sm whitespace-pre-wrap flex-1">{note.content}</p>
            <p className="text-[10px] text-gray-500 mt-4 font-mono text-right">
              {new Date(note.createdAt).toLocaleDateString()}
            </p>
          </div>
        )) : (
          !isFormOpen && (
            <div className="col-span-full text-center py-20 opacity-50">
              <p className="text-4xl mb-2">📝</p>
              <p className="text-gray-500">Your desk is clear.</p>
              <p className="text-sm text-gray-400">Click "+ New Note" to add a reminder.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default NotesPage;