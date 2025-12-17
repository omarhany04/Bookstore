import { Link, useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, isAuthed, logout } = useAuth();
  const nav = useNavigate();

  return (
    <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/books" className="text-base font-extrabold tracking-tight">
          Bookstore <span className="text-slate-400">OPS</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link className="text-sm font-semibold text-slate-700 hover:text-slate-900" to="/books">Books</Link>
          {isAuthed && <Link className="text-sm font-semibold text-slate-700 hover:text-slate-900" to="/cart">Cart</Link>}
          {isAuthed && <Link className="text-sm font-semibold text-slate-700 hover:text-slate-900" to="/orders">Orders</Link>}
          {user?.role === "ADMIN" && (
            <Link className="text-sm font-semibold text-slate-700 hover:text-slate-900" to="/admin/dashboard">Admin</Link>
          )}

          {!isAuthed ? (
            <>
              <Link to="/login"><Button variant="secondary">Login</Button></Link>
              <Link to="/register"><Button>Sign up</Button></Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="text-sm font-semibold text-slate-600 hover:text-slate-900">
                {user.username} ({user.role})
              </Link>
              <Button
                variant="secondary"
                onClick={() => { logout(); nav("/login"); }}
              >
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
