import { Link } from "react-router-dom";
import { BookOpenText, Headphones, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";

export default function Footer() {
  const { user, isAuthed } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const linkClass =
    "text-sm font-semibold text-[color:var(--muted)] transition-all duration-300 hover:translate-x-1 hover:text-[color:var(--text)]";

  return (
    <footer className="px-4 pb-8 pt-16 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="glass-panel-strong rounded-[2.4rem] px-6 py-8 sm:px-8 lg:px-10">
          <div className="relative z-[1] grid gap-10 lg:grid-cols-[1.25fr_0.85fr]">
            <div>
              <div className="section-kicker">Booky experience</div>
              <div className="mt-3 font-display text-4xl font-semibold leading-tight text-balance">
                Built to make online book buying feel curated, calm, and genuinely delightful.
              </div>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[color:var(--muted)]">
                Discover titles, move through checkout smoothly, explore reader quizzes, and manage stock and reports from a more polished admin workspace.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="stat-chip">
                  <BookOpenText className="h-4 w-4 text-[color:var(--accent-deep)]" />
                  Curated discovery
                </div>
                <div className="stat-chip">
                  <ShieldCheck className="h-4 w-4 text-[color:var(--teal)]" />
                  Protected admin tools
                </div>
                <div className="stat-chip">
                  <Sparkles className="h-4 w-4 text-[color:var(--accent)]" />
                  Booky Assistant
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="section-kicker">Explore</div>
                <div className="mt-4 flex flex-col gap-3">
                  <Link className={linkClass} to="/books">
                    Browse books
                  </Link>
                  <Link className={linkClass} to="/quizzes">
                    Take the quiz
                  </Link>
                  {isAuthed ? (
                    <>
                      <Link className={linkClass} to="/cart">
                        View cart
                      </Link>
                      <Link className={linkClass} to="/orders">
                        Order history
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link className={linkClass} to="/login">
                        Login
                      </Link>
                      <Link className={linkClass} to="/register">
                        Create account
                      </Link>
                    </>
                  )}
                </div>
              </div>

              <div>
                <div className="section-kicker">Support</div>
                <div className="mt-4 flex flex-col gap-3">
                  <Link className={linkClass} to="/how-to-buy">
                    How to buy
                  </Link>
                  <Link className={linkClass} to="/shipping">
                    Shipping and returns
                  </Link>
                  <Link className={linkClass} to="/privacy">
                    Privacy
                  </Link>
                  <Link className={linkClass} to="/support">
                    Contact support
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-[1] mt-10 grid gap-4 border-t border-[color:var(--stroke)] pt-6 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="flex flex-wrap gap-3 text-sm text-[color:var(--muted)]">
              <span className="inline-flex items-center gap-2">
                <Headphones className="h-4 w-4" />
                Support hours: Sun-Thu, 10:00-18:00
              </span>
              {isAdmin && (
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Admin access active
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Link to="/books">
                <Button variant="secondary">Explore catalog</Button>
              </Link>
              {isAdmin && (
                <Link to="/admin/dashboard">
                  <Button>Open admin</Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
          © {new Date().getFullYear()} Booky. Crafted for readers and bookstore operators.
        </p>
      </div>
    </footer>
  );
}
