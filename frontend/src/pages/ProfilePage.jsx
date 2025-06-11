import React, { useEffect, useState } from 'react';
import API from '../services/api';
import ProfileCard from '../components/ProfileCard';
import EditGoalsModal from '../components/EditGoalsModal';
import NoteManager from '../components/NoteManager';


const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ avatar: '' });

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      const res = await API.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setFormData({
        avatar: res.data?.profile?.avatar || '',
      });
    };
    fetchUser();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setUser((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value,
      },
    }));
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('avatar', file);

    try {
      const token = localStorage.getItem('token');
      const res = await API.patch('/user/profile/avatar', formDataUpload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const newAvatarPath = res.data.avatar;

      handleChange('avatar', newAvatarPath); // <<<<< CRUCIAL!
      alert('✅ Avatar przesłany i zapisany!');
    } catch (err) {
      console.error('❌ Upload avatar error', err);
      alert('❌ Błąd przy uploadzie avatara');
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await API.patch('/user/profile/info', { avatar: formData.avatar }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('✅ Zapisano zmiany');
    } catch (err) {
      console.error('❌ Błąd zapisu:', err);
      alert('❌ Błąd zapisu zmian');
    }
  };

  const updateGoals = async (data) => {
    const token = localStorage.getItem('token');
    await API.patch('/user/profile/goals', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert('✅ Cele zaktualizowane i plan wygenerowany');
  };

  if (!user) return <p className="text-center mt-8">⏳ Ładowanie profilu...</p>;

  return (
    <>
      
      <div className="max-w-3xl mx-auto mt-8 p-6">
        <ProfileCard
          user={user}
          onChange={handleChange}
          onSave={handleSave}
          onAvatarUpload={handleAvatarUpload}
        />
        <EditGoalsModal user={user} onUpdateGoals={updateGoals} />
        <NoteManager />
      </div>
    </>
  );
};

export default ProfilePage;
