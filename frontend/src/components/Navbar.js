// frontend/src/components/Navbar.js

import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      className="w-full px-6 py-3 flex items-center justify-between 
                 bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-900 
                 bg-[length:200%_200%] animate-gradient-x 
                 border-b border-indigo-400/20 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)] 
                 z-50"
    >
      <div
        className="text-2xl font-bold text-indigo-200 hover:text-indigo-100 
                   transition-all drop-shadow-glow tracking-wide"
      >
        <Link to="/trainer-form">🏋️‍♂️ Virtual Trainer</Link>
      </div>

      <div className="flex items-center gap-6 text-white font-medium text-lg">
        {user ? (
          <>
            <Link
              to="/trainer-form"
              className="relative group transition-all duration-200 hover:text-indigo-300"
            >
              💪 Plan
              <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-indigo-400 group-hover:w-full transition-all duration-300"></span>
            </Link>

            <Link
              to="/profile"
              className="relative group transition-all duration-200 hover:text-indigo-300"
            >
              👤 Profil
              <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-indigo-400 group-hover:w-full transition-all duration-300"></span>
            </Link>

            {user.role === "admin" && (
              <Link
                to="/admin/exercises"
                className="relative group transition-all duration-200 hover:text-indigo-300"
              >
                📝 Dodaj ćwiczenia
                <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-indigo-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-1 
                         rounded-md hover:from-red-500 hover:to-red-700 
                         shadow-md hover:shadow-red-500/40 transition duration-300 text-sm"
            >
              🚪 Wyloguj
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="relative group transition-all duration-200 hover:text-indigo-300"
            >
              🔑 Zaloguj
              <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-indigo-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              to="/register"
              className="relative group transition-all duration-200 hover:text-indigo-300"
            >
              🆕 Zarejestruj
              <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-indigo-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
