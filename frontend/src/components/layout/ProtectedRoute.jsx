import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ requiredRole }) {
  const { isAuthed, user, loading } = useAuth();
  
  if (loading && !isAuthed) return <div className="p-6">Loading...</div>;

  if (!isAuthed) return <Navigate to="/login" replace />;

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/books" replace />;
  }

  return <Outlet />;
}
