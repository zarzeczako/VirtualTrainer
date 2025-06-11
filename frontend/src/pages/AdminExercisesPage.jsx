// frontend/src/pages/AdminExercisesPage.jsx

import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import './AdminExercisesPage.css';

const AdminExercisesPage = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return (
      <>
        <Navbar />
        <div className="admin-container">
          <p className="error" style={{ padding: '0.5rem' }}>
            Brak dostępu. Tylko dla administratora.
          </p>
        </div>
      </>
    );
  }

  const [allExercises, setAllExercises] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('Push');
  const [editLevel, setEditLevel] = useState('początkujący');
  const [editGender, setEditGender] = useState('uniwersalne');
  const [editGoal, setEditGoal] = useState('masa');

  const [manageMessage, setManageMessage] = useState(null);
  const [manageError, setManageError] = useState(null);
  const [manageLoading, setManageLoading] = useState(false);

  const [addName, setAddName] = useState('');
  const [addCategory, setAddCategory] = useState('Push');
  const [addLevel, setAddLevel] = useState('początkujący');
  const [addGender, setAddGender] = useState('uniwersalne');
  const [addGoal, setAddGoal] = useState('masa');

  const [addMessage, setAddMessage] = useState(null);
  const [addError, setAddError] = useState(null);
  const [addLoading, setAddLoading] = useState(false);

  const [bulkInput, setBulkInput] = useState('');
  const [bulkMessage, setBulkMessage] = useState(null);
  const [bulkError, setBulkError] = useState(null);
  const [bulkLoading, setBulkLoading] = useState(false);

  useEffect(() => {
    fetchAllExercises();
  }, []);

  const fetchAllExercises = async () => {
    try {
      const res = await API.get('/exercises');
      setAllExercises(res.data);
    } catch (err) {
      console.error('❌ Błąd przy pobieraniu listy ćwiczeń:', err);
    }
  };

  const handleSelectChange = (e) => {
    const id = e.target.value;
    setSelectedId(id);
    setManageMessage(null);
    setManageError(null);

    if (!id) {
      setEditName('');
      setEditCategory('Push');
      setEditLevel('początkujący');
      setEditGender('uniwersalne');
      setEditGoal('masa');
      return;
    }

    const ex = allExercises.find((item) => item._id === id);
    if (ex) {
      setEditName(ex.name);
      setEditCategory(ex.category);
      setEditLevel(ex.level);
      setEditGender(ex.gender);
      setEditGoal(ex.goal);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    if (!window.confirm('Czy na pewno chcesz usunąć to ćwiczenie?')) return;

    setManageLoading(true);
    setManageMessage(null);
    setManageError(null);
    try {
      await API.delete(`/exercises/${selectedId}`);
      setManageMessage('Ćwiczenie zostało usunięte.');
      fetchAllExercises();
      setSelectedId('');
      setEditName('');
      setEditCategory('Push');
      setEditLevel('początkujący');
      setEditGender('uniwersalne');
      setEditGoal('masa');
    } catch (err) {
      console.error('❌ Błąd podczas usuwania ćwiczenia:', err);
      if (err.response && err.response.data) {
        setManageError(JSON.stringify(err.response.data));
      } else {
        setManageError('Błąd serwera podczas usuwania.');
      }
    } finally {
      setManageLoading(false);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!selectedId) return;
    setManageLoading(true);
    setManageMessage(null);
    setManageError(null);

    console.log('[DEBUG] PUT payload – id:', selectedId, {
      name: editName,
      category: editCategory,
      level: editLevel,
      gender: editGender,
      goal: editGoal
    });

    try {
      const payload = {
        name: editName,
        category: editCategory,
        level: editLevel,
        gender: editGender,
        goal: editGoal
      };
      const res = await API.put(`/exercises/${selectedId}`, payload);
      console.log('[DEBUG] PUT response:', res.data);
      setManageMessage('Ćwiczenie zostało zaktualizowane.');
      fetchAllExercises();
    } catch (err) {
      console.error('❌ Błąd podczas edycji ćwiczenia:', err);
      if (err.response && err.response.data) {
        setManageError(JSON.stringify(err.response.data));
      } else {
        setManageError('Błąd serwera podczas edycji.');
      }
    } finally {
      setManageLoading(false);
    }
  };

  const handleAddSingle = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setAddMessage(null);
    setAddError(null);
    try {
      const payload = {
        name: addName,
        category: addCategory,
        level: addLevel,
        gender: addGender,
        goal: addGoal
      };
      const res = await API.post('/exercises', payload);
      setAddMessage('Ćwiczenie dodane pomyślnie.');
      setAddName('');
      setAddCategory('Push');
      setAddLevel('początkujący');
      setAddGender('uniwersalne');
      setAddGoal('masa');
      fetchAllExercises();
    } catch (err) {
      console.error('❌ Błąd przy POST /exercises:', err);
      if (err.response && err.response.data) {
        setAddError(JSON.stringify(err.response.data));
      } else {
        setAddError('Coś poszło nie tak przy dodawaniu ćwiczenia.');
      }
    } finally {
      setAddLoading(false);
    }
  };

  const handleAddBulk = async (e) => {
    e.preventDefault();
    setBulkLoading(true);
    setBulkMessage(null);
    setBulkError(null);

    try {
      const arr = JSON.parse(bulkInput);
      if (!Array.isArray(arr)) {
        throw new Error('Wprowadź poprawny JSON w formie tablicy.');
      }
      const res = await API.post('/exercises/bulk', arr);
      setBulkMessage(`Dodano pomyślnie ${res.data.count} ćwiczeń.`);
      setBulkInput('');
      fetchAllExercises();
    } catch (err) {
      console.error('❌ Błąd przy POST /exercises/bulk:', err);
      if (err instanceof SyntaxError) {
        setBulkError('Niepoprawny JSON. Sprawdź składnię.');
      } else if (err.response && err.response.data) {
        setBulkError(JSON.stringify(err.response.data));
      } else {
        setBulkError('Coś poszło nie tak przy dodawaniu wielu ćwiczeń.');
      }
    } finally {
      setBulkLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="admin-container">
        <h2>Panel Administratora – Zarządzanie Ćwiczeniami</h2>

        <section className="form-section">
          <h3>Usuń / Edytuj istniejące ćwiczenie</h3>

          <div className="form-group">
            <label htmlFor="selectExercise">Wybierz ćwiczenie:</label>
            <select
              id="selectExercise"
              value={selectedId}
              onChange={handleSelectChange}
            >
              <option value="">-- wybierz ćwiczenie --</option>
              {allExercises.map((ex) => (
                <option key={ex._id} value={ex._id}>
                  {`${ex.name} [${ex.category} | ${ex.level} | ${ex.gender} | ${ex.goal}]`}
                </option>
              ))}
            </select>
          </div>

          {selectedId && (
            <form onSubmit={handleSaveEdit}>
              <div className="form-group">
                <label htmlFor="editName">Nazwa ćwiczenia:</label>
                <input
                  id="editName"
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="editCategory">Kategoria:</label>
                <select
                  id="editCategory"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                >
                  <option value="Push">Push</option>
                  <option value="Pull">Pull</option>
                  <option value="Legs">Legs</option>
                  <option value="Full body">Full body</option>
                  <option value="Core">Core</option>
                  <option value="Cardio">Cardio</option>
                  <option value="HIIT">HIIT</option>
                  <option value="Rest">Rest</option>
                  <option value="Stretching + Mobility">
                    Stretching + Mobility
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="editLevel">Poziom:</label>
                <select
                  id="editLevel"
                  value={editLevel}
                  onChange={(e) => setEditLevel(e.target.value)}
                >
                  <option value="początkujący">początkujący</option>
                  <option value="średniozaawansowany">
                    średniozaawansowany
                  </option>
                  <option value="zaawansowany">zaawansowany</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="editGender">Płeć:</label>
                <select
                  id="editGender"
                  value={editGender}
                  onChange={(e) => setEditGender(e.target.value)}
                >
                  <option value="uniwersalne">uniwersalne</option>
                  <option value="mężczyzna">mężczyzna</option>
                  <option value="kobieta">kobieta</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="editGoal">Cel:</label>
                <select
                  id="editGoal"
                  value={editGoal}
                  onChange={(e) => setEditGoal(e.target.value)}
                >
                  <option value="masa">masa</option>
                  <option value="redukcja">redukcja</option>
                  <option value="utrzymanie">utrzymanie</option>
                </select>
              </div>

              <button
                type="submit"
                className="admin-button"
                disabled={manageLoading}
                style={{ marginRight: '1rem' }}
              >
                {manageLoading ? 'Zapisywanie...' : 'Zapisz zmiany'}
              </button>

              <button
                type="button"
                className="admin-button"
                disabled={manageLoading}
                onClick={handleDelete}
                style={{ backgroundColor: '#dc3545' }}
              >
                {manageLoading ? 'Usuwanie...' : 'Usuń ćwiczenie'}
              </button>
            </form>
          )}

          {manageMessage && <div className="message">{manageMessage}</div>}
          {manageError && (
            <div className="error" style={{ whiteSpace: 'pre-wrap' }}>
              {manageError}
            </div>
          )}
        </section>

        <section className="form-section">
          <h3>Dodaj pojedyncze ćwiczenie</h3>
          <form onSubmit={handleAddSingle}>
            <div className="form-group">
              <label htmlFor="addName">Nazwa ćwiczenia:</label>
              <input
                id="addName"
                type="text"
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
                placeholder="Wpisz nazwę ćwiczenia"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="addCategory">Kategoria:</label>
              <select
                id="addCategory"
                value={addCategory}
                onChange={(e) => setAddCategory(e.target.value)}
              >
                <option value="Push">Push</option>
                <option value="Pull">Pull</option>
                <option value="Legs">Legs</option>
                <option value="Full body">Full body</option>
                <option value="Core">Core</option>
                <option value="Cardio">Cardio</option>
                <option value="HIIT">HIIT</option>
                <option value="Rest">Rest</option>
                <option value="Stretching + Mobility">
                  Stretching + Mobility
                </option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="addLevel">Poziom:</label>
              <select
                id="addLevel"
                value={addLevel}
                onChange={(e) => setAddLevel(e.target.value)}
              >
                <option value="początkujący">początkujący</option>
                <option value="średniozaawansowany">
                  średniozaawansowany
                </option>
                <option value="zaawansowany">zaawansowany</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="addGender">Płeć:</label>
              <select
                id="addGender"
                value={addGender}
                onChange={(e) => setAddGender(e.target.value)}
              >
                <option value="uniwersalne">uniwersalne</option>
                <option value="mężczyzna">mężczyzna</option>
                <option value="kobieta">kobieta</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="addGoal">Cel:</label>
              <select
                id="addGoal"
                value={addGoal}
                onChange={(e) => setAddGoal(e.target.value)}
              >
                <option value="masa">masa</option>
                <option value="redukcja">redukcja</option>
                <option value="utrzymanie">utrzymanie</option>
              </select>
            </div>

            <button
              type="submit"
              className="admin-button"
              disabled={addLoading}
            >
              {addLoading ? 'Dodawanie...' : 'Dodaj ćwiczenie'}
            </button>
          </form>
          {addMessage && <div className="message">{addMessage}</div>}
          {addError && (
            <div className="error" style={{ whiteSpace: 'pre-wrap' }}>
              {addError}
            </div>
          )}
        </section>

        <section className="form-section">
          <h3>Dodaj wiele ćwiczeń (bulk)</h3>
          <p className="bulk-instruction">
            Wklej tutaj JSON w formacie tablicy. Każdy obiekt MUSI zawierać również
            pole <strong>level</strong>, np.:
          </p>
          <code className="bulk-instruction">
            [
            {'{'}
            "name":"Przysiad",
            "category":"Legs",
            "level":"początkujący",
            "gender":"uniwersalne",
            "goal":"masa"
            {'}'}
            ,{'{'}
            "name":"Podciąganie",
            "category":"Pull",
            "level":"średniozaawansowany",
            "gender":"mężczyzna",
            "goal":"utrzymanie"
            {'}'}
            ]
          </code>
          <form onSubmit={handleAddBulk}>
            <textarea
              placeholder='[{"name":"X","category":"Push","level":"początkujący","gender":"uniwersalne","goal":"masa"}, …]'
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
            />
            <br />
            <button
              type="submit"
              className="admin-button"
              disabled={bulkLoading}
            >
              {bulkLoading ? 'Dodawanie wielu...' : 'Dodaj wiele ćwiczeń'}
            </button>
          </form>
          {bulkMessage && <div className="message">{bulkMessage}</div>}
          {bulkError && (
            <div className="error" style={{ whiteSpace: 'pre-wrap' }}>
              {bulkError}
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default AdminExercisesPage;
