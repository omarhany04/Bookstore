import { useState } from "react";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import { authApi } from "../../api/auth";

export default function Profile() {
  const { token, user, refresh } = useAuth();
  const [form, setForm] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    shipping_address: user?.shipping_address || "",
    password: ""
  });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function save() {
    setMsg(""); setErr("");
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      const updated = await authApi.updateMe(token, payload);
      await refresh();
      setMsg("Updated ✅");
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card title="My profile">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Input label="First name" value={form.first_name} onChange={(e)=>setForm({...form, first_name:e.target.value})} />
          <Input label="Last name" value={form.last_name} onChange={(e)=>setForm({...form, last_name:e.target.value})} />
          <Input label="Email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} />
          <Input label="Phone" value={form.phone} onChange={(e)=>setForm({...form, phone:e.target.value})} />
          <div className="md:col-span-2">
            <Input label="Shipping address" value={form.shipping_address} onChange={(e)=>setForm({...form, shipping_address:e.target.value})} />
          </div>
          <Input label="New password (optional)" type="password" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})} />
        </div>

        {err && <div className="mt-3 text-sm text-red-600">{err}</div>}
        {msg && <div className="mt-3 text-sm text-emerald-700">{msg}</div>}

        <div className="mt-4">
          <Button onClick={save}>Save changes</Button>
        </div>
      </Card>
    </div>
  );
}
