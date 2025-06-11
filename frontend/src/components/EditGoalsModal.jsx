import React, { useState } from 'react';

const EditGoalsModal = ({ user, onUpdateGoals }) => {
  const [form, setForm] = useState({
    goal: user.profile.goal,
    weight: user.profile.weight,
    level: user.profile.level,
  });

  const [planGenerated, setPlanGenerated] = useState(false);

  const handleChange = (field, val) => setForm({ ...form, [field]: val });

  const handleGenerate = async () => {
    await onUpdateGoals(form);
    setPlanGenerated(true);
  };

  const goToTrainerForm = () => {
    window.location.href = 'http://localhost:3001/trainer-form';
  };

  return (
    <div className="bg-white p-6 shadow rounded mt-6">
      <h3 className="text-lg font-semibold mb-4">🎯 Edytuj Cele</h3>

      <label className="block mb-2">Cel:</label>
      <select
        className="border p-2 rounded w-full mb-4"
        value={form.goal}
        onChange={(e) => handleChange('goal', e.target.value)}
      >
        <option value="masa">Masa</option>
        <option value="redukcja">Redukcja</option>
        <option value="utrzymanie">Utrzymanie</option>
      </select>

      <label className="block mb-2">Waga (kg):</label>
      <input
        type="number"
        className="border p-2 rounded w-full mb-4"
        value={form.weight}
        onChange={(e) => handleChange('weight', e.target.value)}
      />

      <label className="block mb-2">Poziom:</label>
      <select
        className="border p-2 rounded w-full mb-4"
        value={form.level}
        onChange={(e) => handleChange('level', e.target.value)}
      >
        <option value="początkujący">Początkujący</option>
        <option value="średniozaawansowany">Średniozaawansowany</option>
        <option value="zaawansowany">Zaawansowany</option>
      </select>

      <div className="flex gap-4">
        <button
          onClick={handleGenerate}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          🔄 Zapisz i generuj nowy plan
        </button>

        {planGenerated && (
          <button
            onClick={goToTrainerForm}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            📋 Plan
          </button>
        )}
      </div>
    </div>
  );
};

export default EditGoalsModal;
