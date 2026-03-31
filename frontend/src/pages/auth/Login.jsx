import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpenText, ShieldCheck, Sparkles } from "lucide-react";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { authApi } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const { setToken } = useAuth();
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    setErr("");
    try {
      const { token } = await authApi.login(username, password);
      setToken(token);
      navigate("/books");
    } catch (error) {
      setErr(error.message);
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="grid gap-6 lg:grid-cols-[1.08fr_0.82fr]">
        <section className="glass-panel-strong rounded-[2.5rem] px-6 py-8 sm:px-8 lg:px-10">
          <div className="relative z-[1] max-w-2xl">
            <div className="section-kicker">Welcome back</div>
            <h1 className="mt-3 font-display text-5xl font-semibold leading-[0.96] text-balance sm:text-6xl">
              Log in to continue your reading journey.
            </h1>
            <p className="mt-5 text-sm leading-7 text-[color:var(--muted)] sm:text-base">
              Jump back into browsing, manage your cart, review order history, or move straight into the admin console if your account has access.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="glass-panel rounded-[1.8rem] p-4">
                <BookOpenText className="h-5 w-5 text-[color:var(--accent-deep)]" />
                <div className="mt-3 font-semibold text-[color:var(--text)]">Saved journey</div>
                <div className="mt-1 text-sm text-[color:var(--muted)]">Pick up where you left off across catalog, cart, and orders.</div>
              </div>
              <div className="glass-panel rounded-[1.8rem] p-4">
                <ShieldCheck className="h-5 w-5 text-[color:var(--success)]" />
                <div className="mt-3 font-semibold text-[color:var(--text)]">Protected access</div>
                <div className="mt-1 text-sm text-[color:var(--muted)]">Role-aware routes keep customer and admin flows separated cleanly.</div>
              </div>
              <div className="glass-panel rounded-[1.8rem] p-4">
                <Sparkles className="h-5 w-5 text-[color:var(--teal)]" />
                <div className="mt-3 font-semibold text-[color:var(--text)]">Assistant ready</div>
                <div className="mt-1 text-sm text-[color:var(--muted)]">Recommendations and workflow help are available the moment you sign in.</div>
              </div>
            </div>
          </div>
        </section>

        <Card
          title="Sign in"
          subtitle="Use your Booky account to continue into the storefront or admin workspace."
          className="self-center"
        >
          <form onSubmit={submit} className="space-y-4">
            <Input label="Username" value={username} onChange={(event) => setUsername(event.target.value)} />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            {err && (
              <div className="rounded-[1.3rem] border border-red-200/70 bg-red-100/80 px-4 py-3 text-sm font-semibold text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200">
                {err}
              </div>
            )}
            <Button className="w-full" type="submit">
              Login
            </Button>
          </form>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-[color:var(--muted)]">
            <span>No account yet?</span>
            <Link to="/register">
              <Button variant="secondary">Create one</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
