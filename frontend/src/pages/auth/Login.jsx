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
    <div className="mx-auto max-w-md">
      <Card title="Login">
        <form onSubmit={submit} className="space-y-3">
          <Input label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {err && <div className="text-sm text-red-600">{err}</div>}
          <Button className="w-full" type="submit">Login</Button>
        </form>
        <div className="mt-4 text-sm text-slate-600">
          No account? <Link className="font-semibold text-slate-900" to="/register">Create one</Link>
        </div>
      </Card>
    </div>
  );
}
