// frontend/src/context/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      axios
        .get('http://localhost:5000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        })
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.error('❌ Nie udało się pobrać danych użytkownika:', err);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (tokenValue) => {
    localStorage.setItem('token', tokenValue);
    setToken(tokenValue);

    try {
      const res = await axios.get('http://localhost:5000/api/auth/me', {
        headers: {
          Authorization: `Bearer ${tokenValue}`
        }
      });
      setUser(res.data);
    } catch (err) {
      console.error('❌ Błąd przy pobieraniu user/me w login():', err);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
