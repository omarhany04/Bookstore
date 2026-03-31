import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ requiredRole }) {
  const { isAuthed, user, loading } = useAuth();

  if (loading && !isAuthed) {
    return (
      <div className="grid min-h-[40vh] place-items-center">
        <div className="glass-panel rounded-[2rem] px-6 py-5 text-center">
          <div className="section-kicker">Loading</div>
          <div className="mt-2 font-display text-2xl font-semibold">Restoring your reading session</div>
          <div className="mt-2 text-sm text-[color:var(--muted)]">
            We are checking your access and getting the right workspace ready.
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthed) return <Navigate to="/login" replace />;

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/books" replace />;
  }

  return <Outlet />;
}
