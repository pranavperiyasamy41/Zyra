import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', 
});

// --- THIS IS THE FIX ---
// Set the token on initial load from localStorage
// This runs *before* any of your React components or hooks.
const token = localStorage.getItem('token');
if (token) {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
// ---

export default apiClient;