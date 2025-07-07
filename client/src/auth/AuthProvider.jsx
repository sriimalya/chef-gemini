import { createContext, useEffect, useState } from 'react';
import api from '../utils/api';
import {
  setAccessToken,
  getAccessToken,
  clearAccessToken,
} from './tokenStore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const token = getAccessToken();

  if (token) {
    api.get('/user/me')
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((err) => {
        console.log('Error fetching user:', err.message);
        clearAccessToken(); 
      })
      .finally(() => setLoading(false));
  } else {
    setLoading(false);
  }
}, []);


  const login = async (username, password) => {
    const res = await api.post('/auth/login', { username, password });
    setAccessToken(res.data.token);
    setUser(res.data.user);
  };

  const signup = async ({ username, email, password }) => {
    const res = await api.post('/auth/signup', { username, email, password });
    setAccessToken(res.data.token);
    setUser(res.data.user);
  };

  const logout = async () => {
    await api.post('/auth/logout');
    clearAccessToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
