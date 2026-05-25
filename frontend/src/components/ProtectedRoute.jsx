import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, hasAccess } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/" replace />;
  if (!hasAccess(location.pathname)) return <Navigate to="/dashboard" replace />;

  return children;
}