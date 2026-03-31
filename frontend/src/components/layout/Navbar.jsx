import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpenText,
  LibraryBig,
  LogOut,
  Menu,
  MoonStar,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  SunMedium,
  X,
} from "lucide-react";
import Button from "../ui/Button";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/BookyLogo.jpg";
import { useTheme } from "../../context/ThemeContext";

const navItems = [
  { to: "/books", label: "Books", icon: LibraryBig },
  { to: "/quizzes", label: "Quiz", icon: Sparkles },
];

const linkClass = ({ isActive }) =>
  `inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
    isActive
      ? "bg-[color:var(--accent-soft)] text-[color:var(--text)] shadow-[inset_0_0_0_1px_var(--stroke-strong)]"
      : "text-[color:var(--muted)] hover:bg-white/55 hover:text-[color:var(--text)] dark:hover:bg-white/8"
  }`;

export default function Navbar() {
  const { user, isAuthed, logout } = useAuth();
  const nav = useNavigate();
  const { isDark, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    ...navItems,
    ...(isAuthed ? [{ to: "/cart", label: "Cart", icon: ShoppingBag }] : []),
    ...(isAuthed ? [{ to: "/orders", label: "Orders", icon: BookOpenText }] : []),
    ...(user?.role === "ADMIN" ? [{ to: "/admin/dashboard", label: "Admin", icon: ShieldCheck }] : []),
  ];

  const closeMenu = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-6">
      <div className="mx-auto max-w-7xl rounded-[1.8rem] border border-white/55 bg-white/65 px-4 py-3 shadow-[0_16px_54px_rgba(55,35,17,0.09)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/62">
        <div className="flex items-center justify-between gap-4">
          <Link to="/books" className="flex min-w-0 items-center gap-3" onClick={closeMenu}>
            <img src={logo} alt="Booky" className="h-11 w-11 rounded-[1.2rem] object-cover shadow-md" />
            <div className="min-w-0">
              <div className="font-display text-2xl font-semibold leading-none text-[color:var(--text)]">Booky</div>
              <div className="mt-1 hidden text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[color:var(--muted)] sm:block">
                Modern reading storefront
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 lg:flex">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink key={item.to} to={item.to} className={linkClass}>
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggle}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--stroke-strong)] bg-white/55 text-[color:var(--text)] shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/80 dark:bg-white/5 dark:hover:bg-white/10"
              aria-label="Toggle theme"
            >
              {isDark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
            </button>

            {!isAuthed ? (
              <div className="hidden items-center gap-2 sm:flex">
                <Link to="/login">
                  <Button variant="secondary">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Join Booky</Button>
                </Link>
              </div>
            ) : (
              <>
                <Link
                  to="/profile"
                  className="hidden items-center gap-3 rounded-full border border-[color:var(--stroke-strong)] bg-white/58 px-2.5 py-1.5 text-sm shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/78 dark:bg-white/5 dark:hover:bg-white/10 sm:flex"
                >
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt="Profile"
                      className="h-9 w-9 rounded-full object-cover ring-2 ring-white/75"
                    />
                  ) : (
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-[linear-gradient(135deg,var(--accent),var(--accent-deep))] text-xs font-black text-white shadow-md">
                      {user?.username?.slice(0, 1)?.toUpperCase()}
                    </span>
                  )}
                  <span className="max-w-[160px] truncate">
                    <span className="block font-semibold text-[color:var(--text)]">{user?.username}</span>
                    <span className="block text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[color:var(--muted)]">
                      {user?.role}
                    </span>
                  </span>
                </Link>
                <Button
                  variant="secondary"
                  className="hidden sm:inline-flex"
                  onClick={() => {
                    logout();
                    nav("/login");
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            )}

            <button
              type="button"
              onClick={() => setMobileOpen((value) => !value)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--stroke-strong)] bg-white/55 text-[color:var(--text)] shadow-sm backdrop-blur transition-all duration-300 hover:bg-white/80 dark:bg-white/5 dark:hover:bg-white/10 lg:hidden"
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="overflow-hidden lg:hidden"
            >
              <div className="mt-4 space-y-2 border-t border-[color:var(--stroke)] pt-4">
                <nav className="grid gap-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink key={item.to} to={item.to} className={linkClass} onClick={closeMenu}>
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </NavLink>
                    );
                  })}
                </nav>

                {!isAuthed ? (
                  <div className="grid gap-2 pt-2">
                    <Link to="/login" onClick={closeMenu}>
                      <Button variant="secondary" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link to="/register" onClick={closeMenu}>
                      <Button className="w-full">Join Booky</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid gap-2 pt-2">
                    <Link to="/profile" onClick={closeMenu}>
                      <Button variant="secondary" className="w-full">
                        View profile
                      </Button>
                    </Link>
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={() => {
                        logout();
                        closeMenu();
                        nav("/login");
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
