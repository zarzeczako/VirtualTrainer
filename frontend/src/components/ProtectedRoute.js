import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) return <div className="text-center mt-8">⏳ Sprawdzanie sesji...</div>;

  return token ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
