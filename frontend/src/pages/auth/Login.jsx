import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setErr("");
    try {
      const { token } = await authApi.login(username, password);
      setToken(token);
      nav("/books");
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div className="mx-auto max-w-md text-base">
      <Card title="Login">
        <form onSubmit={submit} className="space-y-3">
          <Input label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {err && <div className="text-sm text-red-600">{err}</div>}
          <Button className="w-full" type="submit">Login</Button>
        </form>
        <div className="mt-6 flex items-center gap-3">
          <span className="text-base text-slate-400">
            No account?
          </span>
          <Link
          to="/register"
          className="
            inline-flex items-center justify-center
            rounded-full
            px-4 py-1.5
            text-sm font-semibold
            transition
            bg-slate-900 text-white hover:bg-slate-800
            dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white
          "
        >
          Create one
        </Link>
        </div>
      </Card>
    </div>
  );
}
