import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { authApi } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({
    username: "", password: "",
    first_name: "", last_name: "",
    email: "", phone: "", shipping_address: ""
  });
  const [err, setErr] = useState("");
  const { setToken } = useAuth();
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setErr("");
    try {
      const { token } = await authApi.register(form);
      setToken(token);
      nav("/books");
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <Card title="Create customer account">
        <form onSubmit={submit} className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Input label="Username" value={form.username} onChange={(e)=>setForm({...form, username:e.target.value})} />
          <Input label="Password" type="password" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})} />
          <Input label="First name" value={form.first_name} onChange={(e)=>setForm({...form, first_name:e.target.value})} />
          <Input label="Last name" value={form.last_name} onChange={(e)=>setForm({...form, last_name:e.target.value})} />
          <Input label="Email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} />
          <Input label="Phone" value={form.phone} onChange={(e)=>setForm({...form, phone:e.target.value})} />
          <div className="md:col-span-2">
            <Input label="Shipping address" value={form.shipping_address} onChange={(e)=>setForm({...form, shipping_address:e.target.value})} />
          </div>
          {err && <div className="md:col-span-2 text-sm text-red-600">{err}</div>}
          <div className="md:col-span-2">
            <Button className="w-full" type="submit">Sign up</Button>
          </div>
        </form>
        <div className="mt-6 flex items-center gap-3">
          <span className="text-base text-slate-400">
            Already have an account?
          </span>
          <Link
            to="/login"
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
            Login
          </Link>
        </div>
      </Card>
    </div>
  );
}
