import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpenText, ShieldCheck, Sparkles } from "lucide-react";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { authApi } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    shipping_address: "",
  });
  const [err, setErr] = useState("");
  const { setToken } = useAuth();
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    setErr("");
    try {
      const { token } = await authApi.register(form);
      setToken(token);
      navigate("/books");
    } catch (error) {
      setErr(error.message);
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <section className="glass-panel rounded-[2.5rem] px-6 py-8 sm:px-8 lg:px-10">
          <div className="relative z-[1]">
            <div className="section-kicker">Create account</div>
            <h1 className="mt-3 font-display text-5xl font-semibold leading-[0.96] text-balance sm:text-6xl">
              Join a cleaner, smarter bookstore flow.
            </h1>
            <p className="mt-5 text-sm leading-7 text-[color:var(--muted)] sm:text-base">
              Your account unlocks persistent cart behavior, streamlined checkout, order history, profile editing, and a more connected Booky experience.
            </p>

            <div className="mt-8 space-y-4">
              <div className="glass-panel rounded-[1.8rem] p-4">
                <div className="flex items-center gap-3">
                  <BookOpenText className="h-5 w-5 text-[color:var(--accent-deep)]" />
                  <div className="font-semibold text-[color:var(--text)]">Shop with continuity</div>
                </div>
                <div className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
                  Keep your customer profile, cart, and orders in one connected account.
                </div>
              </div>
              <div className="glass-panel rounded-[1.8rem] p-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-[color:var(--success)]" />
                  <div className="font-semibold text-[color:var(--text)]">Protected by role-aware access</div>
                </div>
                <div className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
                  The same system supports customers and admins without mixing the two experiences.
                </div>
              </div>
              <div className="glass-panel rounded-[1.8rem] p-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-[color:var(--teal)]" />
                  <div className="font-semibold text-[color:var(--text)]">Ready for recommendations</div>
                </div>
                <div className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
                  Use Booky Assistant for catalog discovery, checkout help, and guided browsing.
                </div>
              </div>
            </div>
          </div>
        </section>

        <Card
          title="Create customer account"
          subtitle="Start with the essentials below. You can refine your profile later from the account page."
          className="self-center"
        >
          <form onSubmit={submit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input label="Username" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} />
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
            />
            <Input
              label="First name"
              value={form.first_name}
              onChange={(event) => setForm({ ...form, first_name: event.target.value })}
            />
            <Input
              label="Last name"
              value={form.last_name}
              onChange={(event) => setForm({ ...form, last_name: event.target.value })}
            />
            <Input label="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
            <Input label="Phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
            <div className="md:col-span-2">
              <Input
                label="Shipping address"
                value={form.shipping_address}
                onChange={(event) => setForm({ ...form, shipping_address: event.target.value })}
              />
            </div>

            {err && (
              <div className="md:col-span-2 rounded-[1.3rem] border border-red-200/70 bg-red-100/80 px-4 py-3 text-sm font-semibold text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200">
                {err}
              </div>
            )}

            <div className="md:col-span-2">
              <Button className="w-full" type="submit">
                Create account
              </Button>
            </div>
          </form>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-[color:var(--muted)]">
            <span>Already have an account?</span>
            <Link to="/login">
              <Button variant="secondary">Login</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
