import useSWR from 'swr';
import apiClient from '../api';

const fetcher = (url: string) => apiClient.get(url).then(res => res.data);

// --- Define the Note type ---
export interface Note {
  _id: string;
  content: string;
  createdAt: string;
}

// --- Custom Hook for Notes ---
export const useNotes = () => {
  const { data, error, isLoading, mutate } = useSWR<Note[]>('/notes', fetcher);

  // --- Create Note Function ---
  const createNote = async (content: string) => {
    try {
      await apiClient.post('/notes', { content });
      mutate(); // Refresh the list
    } catch (err) {
      console.error(err);
      // You could throw the error here to handle it in the component
      throw new Error('Failed to create note');
    }
  };

  // --- Delete Note Function ---
  const deleteNote = async (id: string) => {
    try {
      await apiClient.delete(`/notes/${id}`);
      mutate(); // Refresh the list
    } catch (err) {
      console.error(err);
      throw new Error('Failed to delete note');
    }
  };

  return {
    notes: data,
    isLoading,
    isError: error,
    createNote,
    deleteNote,
  };
};