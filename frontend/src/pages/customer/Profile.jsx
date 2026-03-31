import { useRef, useState } from "react";
import { Camera, UserRound } from "lucide-react";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import { authApi } from "../../api/auth";

export default function Profile() {
  const { token, user, refresh, setAvatar } = useAuth();
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || "");
  const fileRef = useRef(null);
  const [form, setForm] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    shipping_address: user?.shipping_address || "",
    password: "",
  });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  function onPickAvatar(event) {
    setMsg("");
    setErr("");

    const file = event.target.files?.[0];
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
      setAvatarPreview(dataUrl);
      setAvatar(dataUrl);
      setMsg("Photo updated.");
      window.setTimeout(() => setMsg(""), 2500);
    };
    reader.readAsDataURL(file);
  }

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
    if (msg) setMsg("");
    if (err) setErr("");
  }

  async function save() {
    setMsg("");
    setErr("");

    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      await authApi.updateMe(token, payload);
      await refresh();
      setMsg("Profile updated successfully.");
      window.setTimeout(() => setMsg(""), 3000);
    } catch (error) {
      setErr(error.message);
    }
  }

  return (
    <div className="space-y-6">
      <section className="glass-panel-strong rounded-[2.4rem] px-6 py-8 sm:px-8">
        <div className="relative z-[1]">
          <div className="section-kicker">Profile</div>
          <h1 className="mt-3 font-display text-5xl font-semibold leading-[0.96] text-balance">
            Personal details, avatar, and delivery preferences in one place.
          </h1>
          <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
            Keep your account presentation polished and your checkout details ready for the next order.
          </p>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <Card title="Account snapshot" subtitle="This identity block shows how your account appears across the app.">
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-full border border-[color:var(--stroke)] bg-white/45 shadow-lg dark:bg-white/5">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-[linear-gradient(135deg,var(--accent),var(--accent-deep))] text-white">
                    <UserRound className="h-9 w-9" />
                  </div>
                )}
              </div>

              <div>
                <div className="font-display text-3xl font-semibold text-[color:var(--text)]">{user?.username}</div>
                <div className="mt-1 text-[0.72rem] font-extrabold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                  {user?.role}
                </div>
              </div>
            </div>

            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPickAvatar} />

            <Button variant="secondary" className="w-full" onClick={() => fileRef.current?.click()}>
              <Camera className="h-4 w-4" />
              Change photo
            </Button>

            <div className="rounded-[1.4rem] border border-[color:var(--stroke)] bg-white/45 p-4 text-sm text-[color:var(--muted)] dark:bg-white/5">
              JPG / PNG, maximum 2MB. The avatar updates instantly in the navbar and profile area.
            </div>
          </div>
        </Card>

        <Card title="Edit details" subtitle="Update the data used during account and checkout flows.">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input label="First name" value={form.first_name} onChange={(event) => updateField("first_name", event.target.value)} />
            <Input label="Last name" value={form.last_name} onChange={(event) => updateField("last_name", event.target.value)} />
            <Input label="Email" value={form.email} onChange={(event) => updateField("email", event.target.value)} />
            <Input label="Phone" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} />
            <div className="md:col-span-2">
              <Input
                label="Shipping address"
                value={form.shipping_address}
                onChange={(event) => updateField("shipping_address", event.target.value)}
              />
            </div>
            <Input
              label="New password"
              type="password"
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
            />
          </div>

          {err && (
            <div className="mt-4 rounded-[1.3rem] border border-red-200/70 bg-red-100/80 px-4 py-3 text-sm font-semibold text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200">
              {err}
            </div>
          )}

          {msg && (
            <div className="mt-4 rounded-[1.3rem] border border-emerald-200/70 bg-emerald-100/80 px-4 py-3 text-sm font-semibold text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200">
              {msg}
            </div>
          )}

          <div className="mt-5">
            <Button onClick={save}>Save changes</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
