import { useState, useRef } from "react";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import { authApi } from "../../api/auth";

export default function Profile() {
  const { token, user, refresh, setAvatar } = useAuth();

  // 🔹 avatar preview
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || "");

  // 🔹 ref for file input
  const fileRef = useRef(null);

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

  // 🔹 file picker handler
  function onPickAvatar(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErr("Please select an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErr("Image is too large. Please choose an image <= 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      setAvatarPreview(dataUrl); // preview
      setAvatar(dataUrl);        // navbar + localStorage
    };
    reader.readAsDataURL(file);
  }

  async function save() {
    setMsg("");
    setErr("");
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;

      await authApi.updateMe(token, payload);
      await refresh();

      setMsg("Updated ✅");
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card title="My profile">

        {/* 🔹 Avatar section */}
        <div className="mb-4 flex items-center gap-4">
          <div className="h-16 w-16 overflow-hidden rounded-full ring-1 ring-slate-200 dark:ring-slate-800">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full w-full place-items-center bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-200">
                {user?.username?.slice(0, 1)?.toUpperCase()}
              </div>
            )}
          </div>

          {/* hidden file input */}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onPickAvatar}
          />

          <div>
            <Button
              variant="secondary"
              type="button"
              onClick={() => fileRef.current?.click()}
            >
              Change photo
            </Button>

            <div className="mt-1 text-xs text-slate-500">
              JPG / PNG, max 2MB
            </div>
          </div>
        </div>

        {/* 🔹 Profile form */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Input label="First name" value={form.first_name}
            onChange={(e)=>setForm({...form, first_name:e.target.value})} />
          <Input label="Last name" value={form.last_name}
            onChange={(e)=>setForm({...form, last_name:e.target.value})} />
          <Input label="Email" value={form.email}
            onChange={(e)=>setForm({...form, email:e.target.value})} />
          <Input label="Phone" value={form.phone}
            onChange={(e)=>setForm({...form, phone:e.target.value})} />
          <div className="md:col-span-2">
            <Input label="Shipping address" value={form.shipping_address}
              onChange={(e)=>setForm({...form, shipping_address:e.target.value})} />
          </div>
          <Input label="New password (optional)" type="password"
            value={form.password}
            onChange={(e)=>setForm({...form, password:e.target.value})} />
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
