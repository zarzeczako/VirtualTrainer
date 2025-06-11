import React, { useEffect, useState } from 'react';
import ProfileForm from '../components/ProfileForm';
import API from '../services/api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const UserProfile = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get('/api/user/profile/notes'); // 🔄 endpoint może być /user/profile/notes
        setNotes(res.data.notes);
      } catch (err) {
        console.error('❌ Błąd pobierania notatek:', err);
      }
    };
    fetchNotes();
  }, []);

  // ✅ Zapis profilu (cel, płeć, itd.)
  const handleSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return alert('Brak tokena, zaloguj się ponownie.');

      await API.post('/user/profile', data);
      alert('✅ Profil zapisany');
      navigate('/trainer-form');
    } catch (err) {
      console.error('❌ Błąd przy zapisie profilu:', err.response?.data || err.message);
      alert('Błąd przy zapisie profilu');
    }
  };

  const handleSaveNotes = async () => {
    try {
      await axios.patch('/api/user/profile/notes', { notes });
      alert('✅ Notatki zapisane');
    } catch (err) {
      console.error('❌ Błąd zapisu notatek:', err);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return alert('Wybierz plik do przesłania');
    const formData = new FormData();
    formData.append('avatar', avatarFile);

    try {
      await axios.patch('/api/user/profile/avatar', formData);
      alert('✅ Avatar zaktualizowany');
    } catch (err) {
      console.error('❌ Błąd uploadu avatara:', err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md space-y-6">
        <ProfileForm onSubmit={handleSubmit} />

        {/* 📝 Notatki */}
        <div>
          <h3 className="font-bold text-lg mb-2">Twoje notatki</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full border p-2 rounded-md"
            placeholder="Zapisz swoje uwagi, myśli, postępy..."
          />
          <button
            onClick={handleSaveNotes}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            💾 Zapisz notatki
          </button>
        </div>

        {/* 📷 Avatar upload */}
        <div>
          <h3 className="font-bold text-lg mb-2">Zmień avatar</h3>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatarFile(e.target.files[0])}
          />
          <button
            onClick={handleAvatarUpload}
            className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            ⬆️ Prześlij nowy avatar
          </button>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
