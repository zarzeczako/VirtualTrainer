// frontend/src/pages/ProfileGate.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import ProfileForm from '../components/ProfileForm';
import ProfilePage from './ProfilePage';

const ProfileGate = () => {
  const [loading, setLoading] = useState(true);
  const [hasGender, setHasGender] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get('/auth/me');
        const user = res.data;
        setUserData(user);

        if (user.profile && user.profile.gender) {
          setHasGender(true);
        } else {
          setHasGender(false);
        }
      } catch (err) {
        console.error('❌ Błąd przy pobieraniu usera', err);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleProfileSubmit = async (formData) => {
    try {
      await API.post('/user/profile', formData);
      setHasGender(true);
      navigate('/trainer-form');
    } catch (err) {
      console.error('❌ Błąd zapisu profilu', err);
      alert('Coś poszło nie tak podczas zapisu profilu.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-xl">Ładowanie profilu użytkownika…</span>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      {hasGender ? (
        <ProfilePage user={userData} />
      ) : (
        <ProfileForm onSubmit={handleProfileSubmit} />
      )}
    </>
  );
};

export default ProfileGate;
