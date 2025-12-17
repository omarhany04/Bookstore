import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { ordersApi } from "../../api/orders";
import { useAuth } from "../../context/AuthContext";

export default function Checkout() {
  const { token } = useAuth();
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMMYY, setExpiry] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setErr(""); setMsg("");
    try {
      const r = await ordersApi.checkout(token, { cardNumber, expiryMMYY });
      setMsg(`Checkout success ✅ Order #${r.order_id}`);
      setTimeout(() => nav("/orders"), 800);
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <Card title="Checkout">
        <form onSubmit={submit} className="space-y-3">
          <Input label="Credit card number" value={cardNumber} onChange={(e)=>setCardNumber(e.target.value)} placeholder="e.g. 4242 4242 4242 4242" />
          <Input label="Expiry (MMYY)" value={expiryMMYY} onChange={(e)=>setExpiry(e.target.value)} placeholder="e.g. 0728" />
          {err && <div className="text-sm text-red-600">{err}</div>}
          {msg && <div className="text-sm text-emerald-700">{msg}</div>}
          <Button className="w-full" type="submit">Pay & Place order</Button>
        </form>
        <div className="mt-3 text-xs text-slate-500">
          Demo validation: card uses Luhn + expiry must be in the future.
        </div>
      </Card>
    </div>
  );
}
