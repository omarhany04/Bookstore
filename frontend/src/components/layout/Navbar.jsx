import { Link, NavLink, useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/BookyLogo.jpg";
import { useTheme } from "../../context/ThemeContext";

const navLinkClass = ({ isActive }) =>
  `
  relative rounded-full px-4 py-2 text-sm font-semibold
  transition-all duration-200
  ${
    isActive
      ? "bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-900"
      : "text-slate-700 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
  }
  hover:-translate-y-[1px]
  `;

export default function Navbar() {
  const { user, isAuthed, logout } = useAuth();
  const nav = useNavigate();
  const { isDark, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-slate-200/70 bg-white/70 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link to="/books" className="flex items-center gap-3">
            <img src={logo} alt="Bookstore OPS" className="h-10 w-10 rounded-xl" />
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
            {/* Dark mode toggle */}
            <Button variant="secondary" onClick={toggle} className="px-3">
              {isDark ? "Dark" : "Light"}
            </Button>

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
                  className="hidden sm:flex items-center gap-2 rounded-full border border-slate-200 bg-white/60 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-white hover:shadow
                             dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-200 dark:hover:bg-slate-900/60"
                >
                  {/* ✅ Avatar (image if exists, else first letter) */}
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt="Profile"
                      className="h-7 w-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                    />
                  ) : (
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-slate-900 text-xs font-black text-white dark:bg-slate-100 dark:text-slate-900">
                      {user.username?.slice(0, 1)?.toUpperCase()}
                    </span>
                  )}

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
