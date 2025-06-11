import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';

const Plan = () => {
  const [plan, setPlan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlan = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await API.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlan(res.data.weeklyPlan || []);
    } catch (err) {
      setError('Błąd przy pobieraniu planu');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  const handleRegeneratePlan = async () => {
    setRefreshing(true);
    try {
      await API.post('/user/generate-plan');
      await fetchPlan();
    } catch (err) {
      setError('❌ Nie udało się wygenerować planu');
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded shadow">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">📅 Twój Tygodniowy Plan Treningowy</h2>

        <div className="text-center mb-6">
          <button
            onClick={handleRegeneratePlan}
            disabled={refreshing}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow transition"
          >
            🔁 {refreshing ? 'Generowanie...' : 'Generuj nowy plan'}
          </button>
        </div>

        {loading ? (
          <p className="text-center">⏳ Ładowanie planu...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : plan.length === 0 ? (
          <p className="text-center text-gray-500">Brak zapisanego planu. Uzupełnij profil.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {plan.map((day, index) => (
              <div
                key={index}
                className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-blue-700">Dzień {index + 1}</h3>
                <ul className="mt-2 text-gray-700 list-disc list-inside">
                  {typeof day === 'string' ? (
                    <li>{day}</li>
                  ) : (
                    day.ćwiczenia?.map((ex, i) => <li key={i}>{ex}</li>)
                  )}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Plan;
