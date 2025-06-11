import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password || !confirm) {
      setError('Wszystkie pola są wymagane.');
      return;
    }
    if (username.length < 3) {
      setError('Nazwa użytkownika musi mieć co najmniej 3 znaki.');
      return;
    }
    if (password.length < 6) {
      setError('Hasło musi mieć co najmniej 6 znaków.');
      return;
    }
    if (password !== confirm) {
      setError('Hasła muszą być identyczne.');
      return;
    }

    try {
      await API.post('/auth/register', { username, password });
      navigate('/login');
    } catch (err) {
      console.error('❌ Błąd podczas rejestracji:', err);
      setError(err.response?.data?.msg || 'Coś poszło nie tak.');
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
            Rejestracja
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

          <div className="mb-4">
            <label className="block text-indigo-700 font-medium mb-1">
              Hasło
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Minimum 6 znaków"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-indigo-700 font-medium mb-1">
              Powtórz hasło
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-4 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Potwierdź hasło"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-700 hover:bg-indigo-800 text-white font-semibold rounded-lg shadow-md transition-colors"
          >
            Zarejestruj się
          </button>

          <p className="mt-4 text-center text-sm text-indigo-700">
            Masz już konto?{' '}
            <span
              onClick={() => navigate('/login')}
              className="text-indigo-900 font-medium hover:underline cursor-pointer"
            >
              Zaloguj się
            </span>
          </p>
        </form>
      </div>
    </>
  );
};

export default RegisterPage;
