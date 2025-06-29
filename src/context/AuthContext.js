
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/check-auth', { withCredentials: true })
      .then((res) => {
        setUser(res.data.user);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Auth check error:', err);
        setUser(null);
        setLoading(false);
      });
  }, []);

  const login = async (username, password) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/login',
        { username, password },
        { withCredentials: true }
      );
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      throw err.response?.data?.error || 'Login failed';
    }
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:5000/api/logout', {}, { withCredentials: true });
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
