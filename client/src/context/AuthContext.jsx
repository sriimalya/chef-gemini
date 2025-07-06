import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const login = (newToken, userInfo) => {
    setToken(newToken);
    setUser(userInfo);
  };

  const logout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setToken(null);
      setUser(null);
    }
  };

  const getToken = async () => {
    if (!token) {
      try {
        const res = await axios.get('/auth/refresh-token');
        const newToken = res.data.token;
        setToken(newToken);
        return newToken;
      } catch (err) {
        console.error('Refresh failed');
        logout();
        return null;
      }
    }
    return token;
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
