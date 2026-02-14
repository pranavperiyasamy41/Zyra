import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api';

// ✅ UPDATED INTERFACE: Now includes Address & License details
interface User {
  _id: string;
  username: string;
  email: string;
  pharmacyName: string;
  role: string;
  avatar?: string; // 🆕 Added Avatar
  // New Fields for PDF Invoice
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  drugLicense?: string;
  pharmacyContact?: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // 🆕 Fetch fresh profile to ensure avatar & details are up-to-date
        try {
          const { data } = await apiClient.get('/users/profile');
          setUser(data);
          localStorage.setItem('user', JSON.stringify(data)); // Sync fresh data
        } catch (error) {
          console.error("Failed to fetch user profile", error);
          // Fallback to stored user if fetch fails (e.g. offline)
          if (storedUser) setUser(JSON.parse(storedUser));
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    // Try-catch for localStorage quota limits (Base64 avatars can be large)
    try {
        localStorage.setItem('user', JSON.stringify(userData));
    } catch (e) {
        console.warn("Failed to save user to localStorage (likely quota exceeded).");
    }
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete apiClient.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};