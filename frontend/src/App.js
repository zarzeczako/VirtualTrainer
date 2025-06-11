// frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfileGate from './pages/ProfileGate';
import TrainerForm from './pages/TrainerForm';
import NotFound from './pages/NotFound';
import AdminExercisesPage from './pages/AdminExercisesPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfileGate />
              </ProtectedRoute>
            }
          />

          <Route
            path="/trainer-form"
            element={
              <ProtectedRoute>
                <TrainerForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/exercises"
            element={
              <ProtectedRoute>
                <AdminExercisesPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
