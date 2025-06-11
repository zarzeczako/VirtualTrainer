import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError('Wszystkie pola są wymagane.');
      return;
    }

    try {
      const res = await API.post('/auth/login', { username, password });
      const { token, user } = res.data;
      login(token, user);

      if (user.profile && user.profile.gender) {
        navigate('/trainer-form');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      console.error('❌ Błąd logowania:', err);
      setError(err.response?.data?.msg || 'Nieprawidłowe dane logowania.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-800 to-indigo-600 p-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white bg-opacity-90 backdrop-blur-md p-8 rounded-xl shadow-lg"
        >
          <h2 className="text-3xl font-extrabold text-indigo-800 mb-6 text-center">
            Logowanie
          </h2>

          {error && (
            <div className="mb-4 px-4 py-2 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-indigo-700 font-medium mb-1">
              Nazwa użytkownika
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Wpisz nazwę użytkownika"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-indigo-700 font-medium mb-1">
              Hasło
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Twoje hasło"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-700 hover:bg-indigo-800 text-white font-semibold rounded-lg shadow-md transition-colors"
          >
            Zaloguj się
          </button>

          <p className="mt-4 text-center text-sm text-indigo-700">
            Nie masz konta?{' '}
            <span
              onClick={() => navigate('/register')}
              className="text-indigo-900 font-medium hover:underline cursor-pointer"
            >
              Zarejestruj się
            </span>
          </p>
        </form>
      </div>
    </>
  );
};

export default LoginPage;
