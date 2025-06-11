import React, { useEffect, useState } from 'react';
import API from '../services/api';

const NoteManager = () => {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState('');
  const [editId, setEditId] = useState(null);
  const [show, setShow] = useState(false);

  const fetchNotes = async () => {
    const res = await API.get('/notes');
    setNotes(res.data);
  };

  useEffect(() => {
    if (show) fetchNotes();
  }, [show]);

  const saveNote = async () => {
    if (!text.trim()) return;
    if (editId) {
      await API.patch(`/notes/${editId}`, { text });
    } else {
      await API.post('/notes', { text });
    }
    setText('');
    setEditId(null);
    fetchNotes();
  };

  const editNote = (note) => {
    setEditId(note._id);
    setText(note.text);
  };

  const deleteNote = async (id) => {
    await API.delete(`/notes/${id}`);
    fetchNotes();
  };

  return (
    <div className="bg-white mt-6 p-4 shadow rounded">
      <button
        onClick={() => setShow(!show)}
        className="bg-indigo-600 text-white px-4 py-2 rounded mb-4"
      >
        {show ? '🙈 Ukryj notatki' : '📝 Twoje notatki'}
      </button>

      {show && (
        <>
          <textarea
            className="w-full border p-2 rounded mb-2"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="Dodaj notatkę..."
          />

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
            onClick={saveNote}
          >
            💾 {editId ? 'Zapisz zmiany' : 'Dodaj'}
          </button>

          {notes.length === 0 && <p className="text-gray-500">Brak notatek</p>}

          {notes.map((note) => (
            <div key={note._id} className="bg-gray-50 border p-3 rounded mb-2">
              <p>{note.text}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => editNote(note)}
                  className="text-blue-600 hover:underline"
                >
                  ✏️ Edytuj
                </button>
                <button
                  onClick={() => deleteNote(note._id)}
                  className="text-red-600 hover:underline"
                >
                  🗑 Usuń
                </button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default NoteManager;
