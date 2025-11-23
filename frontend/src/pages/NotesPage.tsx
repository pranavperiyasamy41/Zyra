import { useState } from 'react';
import { useNotes, type Note } from '../hooks/useNotes';

const NotesPage = () => {
  const { notes, isLoading, createNote, deleteNote } = useNotes();
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setLoading(true);
    setError(null);
    try {
      await createNote(newNote);
      setNewNote('');
    } catch (err) {
      setError('Failed to save note. Please try again.');
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }
    try {
      await deleteNote(id);
    } catch (err) {
      setError('Failed to delete note.');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">My Notes</h1>

      {/* --- Add Note Form --- */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="rounded-lg bg-white p-6 shadow dark:bg-slate-800 dark:border dark:border-slate-700">
          <label htmlFor="note" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
            Add a new note
          </label>
          <textarea
            id="note"
            rows={4}
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
            placeholder="E.g., Remember to order more Vitamin C..."
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <div className="mt-4 text-right">
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-blue-400 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              {loading ? 'Saving...' : 'Save Note'}
            </button>
          </div>
        </div>
      </form>

      {/* --- Notes List --- */}
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Saved Notes</h2>
      <div className="space-y-4">
        {isLoading ? (
          <p className="dark:text-slate-300">Loading notes...</p>
        ) : notes && notes.length > 0 ? (
          // 1. ADDED INDEX TO MAP
          notes.map((note: Note, index: number) => (
            <div key={note._id} className="rounded-lg bg-white p-5 shadow dark:bg-slate-800 dark:border dark:border-slate-700 flex justify-between items-start">
              <div className="flex-1">
                {/* 2. ADDED S.NO. BADGE */}
                <span className="mb-2 inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  Note #{index + 1}
                </span>
                <p className="text-gray-800 dark:text-slate-200 mt-2">{note.content}</p>
                <p className="mt-2 text-xs text-gray-500 dark:text-slate-400">
                  Created: {new Date(note.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(note._id)}
                className="ml-4 rounded-md bg-red-100 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-slate-400">You don't have any notes yet.</p>
        )}
      </div>
    </div>
  );
};

export default NotesPage;