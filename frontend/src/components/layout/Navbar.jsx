import { Link, NavLink, useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { useAuth } from "../../context/AuthContext";

const navLinkClass = ({ isActive }) =>
  `
  relative rounded-full px-4 py-2 text-sm font-semibold
  transition-all duration-200
  ${
    isActive
      ? "bg-slate-900 text-white shadow-sm"
      : "text-slate-700 hover:bg-slate-200 hover:text-slate-900"
  }
  hover:-translate-y-[1px]
  `;

export default function Navbar() {
  const { user, isAuthed, logout } = useAuth();
  const nav = useNavigate();

  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-slate-200/70 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          
          {/* Logo */}
          <Link to="/books" className="group flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-900 text-white shadow-sm">
              <span className="text-sm font-black">B</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-extrabold tracking-tight text-slate-900">
                Bookstore <span className="text-slate-400">OPS</span>
              </div>
              <div className="text-xs text-slate-500 transition group-hover:text-slate-600">
                Online bookstore
              </div>
            </div>
          </Link>

          {/* Navigation Pills */}
          <nav className="hidden items-center gap-2 md:flex">
            <NavLink to="/books" className={navLinkClass}>
              Books
            </NavLink>

            {isAuthed && (
              <NavLink to="/cart" className={navLinkClass}>
                Cart
              </NavLink>
            )}

            {isAuthed && (
              <NavLink to="/orders" className={navLinkClass}>
                Orders
              </NavLink>
            )}

            {user?.role === "ADMIN" && (
              <NavLink to="/admin/dashboard" className={navLinkClass}>
                Admin
              </NavLink>
            )}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {!isAuthed ? (
              <>
                <Link to="/login">
                  <Button variant="secondary">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Sign up</Button>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/profile"
                  className="hidden sm:flex items-center gap-2 rounded-full border border-slate-200 bg-white/60 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-white hover:shadow"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-slate-900 text-xs font-black text-white">
                    {user.username?.slice(0, 1)?.toUpperCase()}
                  </span>
                  <span className="truncate max-w-[140px]">
                    {user.username}
                    <span className="text-slate-400"> • {user.role}</span>
                  </span>
                </Link>

                <Button
                  variant="secondary"
                  onClick={() => {
                    logout();
                    nav("/login");
                  }}
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
