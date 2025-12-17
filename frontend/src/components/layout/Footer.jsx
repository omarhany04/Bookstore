import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Lock, ShieldAlert, UserCog, Info } from "lucide-react";


function SocialIcon({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="
        inline-flex h-10 w-10 items-center justify-center rounded-2xl
        border border-slate-300/60 bg-slate-100/40 text-slate-700 shadow-sm
        transition-all
        hover:-translate-y-[1px] hover:border-slate-400 hover:bg-slate-300/60 hover:shadow
        active:translate-y-0
        dark:border-slate-700 dark:bg-slate-950/30 dark:text-slate-200
        dark:hover:border-slate-600 dark:hover:bg-slate-800
      "
    >
      {children}
    </a>
  );
}

function FooterLink({ to, children, disabled = false, tooltip }) {
  // When disabled: prevent navigation + show tooltip on hover
  if (disabled) {
    return (
      <div className="relative group">
        <Link
          to={to}
          onClick={(e) => e.preventDefault()}
          aria-disabled="true"
          className="
            inline-flex w-fit items-center rounded-xl px-3 py-2 text-sm font-semibold
            text-slate-400 cursor-not-allowed select-none
            transition-all
            dark:text-slate-500
          "
        >
          {children}
        </Link>

        {/* Tooltip (hover only) */}
        <div
          className="
            pointer-events-none absolute left-0 top-full z-20 mt-2 w-max max-w-[260px]
            opacity-0 translate-y-1 scale-[0.98]
            transition-all duration-150
            group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100
          "
        >
          <div
            className="
              rounded-2xl border border-slate-200 bg-white/95 px-3 py-2 text-xs font-semibold text-slate-700 shadow-lg
              backdrop-blur
              dark:border-slate-800 dark:bg-slate-950/90 dark:text-slate-200
            "
          >
            <div className="flex items-start gap-2">
              <span className="mt-[1px] inline-flex h-6 w-6 items-center justify-center rounded-xl
                              bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
                <ShieldAlert className="h-4 w-4" />
              </span>
              <span className="leading-relaxed">{tooltip}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      to={to}
      className="
        inline-flex items-center rounded-xl px-3 py-2 text-sm font-semibold
        text-slate-700 transition-all
        hover:-translate-y-[1px] hover:bg-slate-300/60 hover:text-slate-900
        active:translate-y-0
        dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white
      "
    >
      {children}
    </Link>
  );
}

export default function Footer() {
  const { user, isAuthed } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const adminTooltip = "Log in as admin first to access";

  return (
    <footer className="mt-20 bg-slate-200/60 backdrop-blur dark:bg-slate-900/70">
      <div className="mx-auto max-w-7xl px-4 pt-12">
        <div className="grid grid-cols-1 gap-10 items-start md:grid-cols-4">
          {/* Brand + Social */}
          <div>
            <div className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Booky
            </div>

            <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              A full-stack bookstore order processing system with automated
              inventory control, role-based access, and real-time reporting.
            </p>

            {/* Social */}
            <div className="mt-5">
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Social
              </div>

              <div className="flex flex-wrap gap-2">
                <SocialIcon href="https://www.facebook.com/" label="Facebook">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                    <path d="M22 12a10 10 0 1 0-11.56 9.87v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.19 2.23.19v2.46h-1.25c-1.23 0-1.62.77-1.62 1.55V12h2.76l-.44 2.88h-2.32v6.99A10 10 0 0 0 22 12z" />
                  </svg>
                </SocialIcon>

                <SocialIcon href="https://www.instagram.com/" label="Instagram">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                    <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-5 4a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.5-.9a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2z" />
                  </svg>
                </SocialIcon>

                <SocialIcon href="https://www.linkedin.com/" label="LinkedIn">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                    <path d="M4.98 3.5A2.48 2.48 0 0 1 7.46 6a2.48 2.48 0 1 1-4.96 0A2.48 2.48 0 0 1 4.98 3.5zM3 8.98h3.96V21H3V8.98zM9.02 8.98h3.79v1.64h.05c.53-.99 1.82-2.03 3.74-2.03 4 0 4.74 2.63 4.74 6.05V21h-3.96v-5.44c0-1.3-.02-2.97-1.81-2.97-1.81 0-2.09 1.41-2.09 2.88V21H9.02V8.98z" />
                  </svg>
                </SocialIcon>

                <SocialIcon href="https://github.com/" label="GitHub">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                    <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.8-.25.8-.56v-2c-3.26.72-3.95-1.4-3.95-1.4-.54-1.37-1.31-1.73-1.31-1.73-1.07-.73.08-.71.08-.71 1.18.08 1.8 1.21 1.8 1.21 1.05 1.79 2.75 1.27 3.42.97.1-.76.41-1.27.75-1.56-2.6-.3-5.33-1.3-5.33-5.78 0-1.28.46-2.33 1.2-3.15-.12-.3-.52-1.5.12-3.12 0 0 .98-.31 3.2 1.2a11.1 11.1 0 0 1 5.82 0c2.22-1.51 3.2-1.2 3.2-1.2.64 1.62.24 2.82.12 3.12.75.82 1.2 1.87 1.2 3.15 0 4.5-2.74 5.48-5.35 5.77.42.36.8 1.07.8 2.16v3.2c0 .31.2.67.81.56A11.5 11.5 0 0 0 12 .5z" />
                  </svg>
                </SocialIcon>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Quick links
            </div>

            <div className="flex flex-col gap-1">
              <FooterLink to="/books">Browse Books</FooterLink>
              {isAuthed && <FooterLink to="/cart">Cart</FooterLink>}
              {isAuthed && <FooterLink to="/orders">Orders</FooterLink>}
              {isAuthed && <FooterLink to="/profile">Profile</FooterLink>}
              {!isAuthed && <FooterLink to="/login">Login</FooterLink>}
              {!isAuthed && <FooterLink to="/register">Sign up</FooterLink>}
            </div>
          </div>

          {/* Help */}
          <div>
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Help
            </div>

            <div className="flex flex-col gap-1">
              <FooterLink to="/how-to-buy">How to buy</FooterLink>
              <FooterLink to="/shipping">Shipping & Returns</FooterLink>
              <FooterLink to="/privacy">Privacy Policy</FooterLink>
              <FooterLink to="/support">Contact support</FooterLink>
            </div>
          </div>

          {/* Admin (always visible; tooltip if not admin) */}
          <div>
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Admin
            </div>

            <div className="flex flex-col gap-1">
              <FooterLink
                to="/admin/dashboard"
                disabled={!isAdmin}
                tooltip={adminTooltip}
              >
                Dashboard
              </FooterLink>
              <FooterLink
                to="/admin/books"
                disabled={!isAdmin}
                tooltip={adminTooltip}
              >
                Manage books
              </FooterLink>
              <FooterLink
                to="/admin/replenishments"
                disabled={!isAdmin}
                tooltip={adminTooltip}
              >
                Replenishments
              </FooterLink>
              <FooterLink
                to="/admin/reports"
                disabled={!isAdmin}
                tooltip={adminTooltip}
              >
                Reports
              </FooterLink>
            </div>
          </div>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="mt-6 border-t border-slate-300/60 pt-4 pb-4 dark:border-slate-700">
        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} Booky Online Store. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
