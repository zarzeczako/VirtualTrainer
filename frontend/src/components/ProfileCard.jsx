import React from 'react';

const ProfileCard = ({ user, onChange, onSave, onAvatarUpload }) => {
  const gender = user?.profile?.gender;
  const avatar = user?.profile?.avatar || '';

  const avatarSrc = (() => {
    if (avatar.startsWith('http')) return avatar;
    if (avatar.startsWith('/avatars/')) return `http://localhost:5000${avatar}`;
    if (avatar) return `http://localhost:5000/avatars/${avatar}`;
    return gender === 'kobieta'
      ? 'http://localhost:5000/avatars/awatarfemale.png'
      : 'http://localhost:5000/avatars/awatarMale.png';
  })();

  return (
    <div className="bg-white shadow-md rounded p-6 text-center">
      <h2 className="text-xl font-bold mb-4">📄 Twój Profil</h2>

      <div className="flex justify-center mb-4">
        <img
          src={avatarSrc}
          alt="Avatar"
          className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              gender === 'kobieta'
                ? 'http://localhost:5000/avatars/awatarfemale.png'
                : 'http://localhost:5000/avatars/awatarMale.png';
          }}
        />
      </div>

      <div className="mb-4 text-left">
        <label htmlFor="avatarInput" className="block mb-2 font-semibold text-gray-700">
          📸 Prześlij nowy avatar
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={onAvatarUpload}
          className="w-full px-3 py-2 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-600 file:text-white
            hover:file:bg-blue-700 transition duration-300"
        />
      </div>
    </div>
  );
};

export default ProfileCard;
