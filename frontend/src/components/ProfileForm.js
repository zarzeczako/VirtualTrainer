// frontend/src/components/ProfileForm.js

import React, { useState, useEffect } from 'react';

const goals = ['redukcja', 'utrzymanie', 'masa'];
const levels = ['początkujący', 'średniozaawansowany', 'zaawansowany'];
const genders = ['mężczyzna', 'kobieta'];

const ProfileForm = ({ onSubmit }) => {
  const [goal, setGoal] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [level, setLevel] = useState('');
  const [gender, setGender] = useState('');

  const [errors, setErrors] = useState({});

  const [touched, setTouched] = useState({
    goal: false,
    weight: false,
    height: false,
    level: false,
    gender: false,
  });

  const validate = () => {
    const newErrors = {};

    if (!goal) {
      newErrors.goal = 'Wybierz cel.';
    }

    if (!weight) {
      newErrors.weight = 'Podaj wagę.';
    } else {
      const w = Number(weight);
      if (isNaN(w)) {
        newErrors.weight = 'Waga musi być liczbą.';
      } else if (w < 30) {
        newErrors.weight = 'Minimalna waga to 30 kg.';
      } else if (w > 300) {
        newErrors.weight = 'Maksymalna waga to 300 kg.';
      }
    }

    if (!height) {
      newErrors.height = 'Podaj wzrost.';
    } else {
      const h = Number(height);
      if (isNaN(h)) {
        newErrors.height = 'Wzrost musi być liczbą.';
      } else if (h < 100) {
        newErrors.height = 'Minimalny wzrost to 100 cm.';
      } else if (h > 250) {
        newErrors.height = 'Maksymalny wzrost to 250 cm.';
      }
    }

    
    if (!level) {
      newErrors.level = 'Wybierz poziom.';
    }

    
    if (!gender) {
      newErrors.gender = 'Wybierz płeć.';
    }

    return newErrors;
  };

  useEffect(() => {
    setErrors(validate());
  }, [goal, weight, height, level, gender]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({
      goal: true,
      weight: true,
      height: true,
      level: true,
      gender: true,
    });

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    onSubmit({
      goal,
      weight: Number(weight),
      height: Number(height),
      level,
      gender,
    });
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Uzupełnij profil</h2>

      {/* Cel */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Cel:</label>
        <select
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          onBlur={() => handleBlur('goal')}
          className={`w-full border p-2 rounded ${
            touched.goal && errors.goal ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        >
          <option value="">Wybierz cel</option>
          {goals.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        {touched.goal && errors.goal && (
          <p className="mt-1 text-red-600 text-sm">{errors.goal}</p>
        )}
      </div>

      {/* Waga */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Waga (kg):</label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          onBlur={() => handleBlur('weight')}
          className={`w-full border p-2 rounded ${
            touched.weight && errors.weight ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="np. 70"
          required
        />
        {touched.weight && errors.weight && (
          <p className="mt-1 text-red-600 text-sm">{errors.weight}</p>
        )}
      </div>

      {/* Wzrost */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Wzrost (cm):</label>
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          onBlur={() => handleBlur('height')}
          className={`w-full border p-2 rounded ${
            touched.height && errors.height ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="np. 175"
          required
        />
        {touched.height && errors.height && (
          <p className="mt-1 text-red-600 text-sm">{errors.height}</p>
        )}
      </div>

      {/* Poziom */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Poziom:</label>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          onBlur={() => handleBlur('level')}
          className={`w-full border p-2 rounded ${
            touched.level && errors.level ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        >
          <option value="">Wybierz poziom</option>
          {levels.map((lvl) => (
            <option key={lvl} value={lvl}>
              {lvl}
            </option>
          ))}
        </select>
        {touched.level && errors.level && (
          <p className="mt-1 text-red-600 text-sm">{errors.level}</p>
        )}
      </div>

      {/* Płeć */}
      <div className="mb-6">
        <label className="block font-semibold mb-1">Płeć:</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          onBlur={() => handleBlur('gender')}
          className={`w-full border p-2 rounded ${
            touched.gender && errors.gender ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        >
          <option value="">Wybierz płeć</option>
          {genders.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        {touched.gender && errors.gender && (
          <p className="mt-1 text-red-600 text-sm">{errors.gender}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={Object.keys(errors).length > 0}
        className={`w-full py-2 px-4 text-white font-semibold rounded transition-colors ${
          Object.keys(errors).length === 0
            ? 'bg-blue-600 hover:bg-blue-700'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        Zapisz profil
      </button>
    </form>
  );
};

export default ProfileForm;
