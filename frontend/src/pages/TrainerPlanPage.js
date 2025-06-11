// frontend/src/pages/TrainerPlanPage.js

import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';

const TrainerPlanPage = () => {
  const [plan, setPlan] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get('/auth/me');
        const weeklyPlan = res.data?.weeklyPlan || [];
        setPlan(weeklyPlan);
      } catch (err) {
        console.error('❌ Błąd podczas pobierania planu:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return <p>Ładowanie planu...</p>;
  }

  if (!plan || plan.length === 0) {
    return <p>Nie znaleziono planu. Uzupełnij profil.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Twój plan treningowy
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plan.map((day, index) => (
            <div
              key={index}
              className="rounded-xl shadow-lg p-5 bg-white transition duration-300 hover:shadow-xl"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Dzień {index + 1}: {day.nazwa}
              </h2>

              {day.ćwiczenia && day.ćwiczenia.length > 0 ? (
                <ul className="mt-4 list-disc list-inside space-y-2 text-gray-700">
                  {day.ćwiczenia.map((ex, i) => (
                    <li key={i} className="pl-2">
                      {ex}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">Brak ćwiczeń na ten dzień</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrainerPlanPage;
