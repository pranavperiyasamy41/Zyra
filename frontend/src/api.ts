import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', 
});

// Use an interceptor to inject the token into EVERY request dynamically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;