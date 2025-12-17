import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { ordersApi } from "../../api/orders";
import { useAuth } from "../../context/AuthContext";

export default function Checkout() {
  const { token } = useAuth();

  // Payment
  const [paymentMethod, setPaymentMethod] = useState("CARD"); // NEW
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMMYY, setExpiry] = useState("");

  // Shipping
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("Egypt");
  const [city, setCity] = useState("Cairo");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [zip, setZip] = useState("");
  const [shippingMethod, setShippingMethod] = useState("STANDARD");

  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const nav = useNavigate();

  // Simple demo shipping fee logic
  const shippingFee = useMemo(() => {
    const base = shippingMethod === "EXPRESS" ? 80 : 50; // EGP
    const major = ["Cairo", "Giza", "Alexandria"];
    const remoteSurcharge = major.includes(city) ? 0 : 20;
    return base + remoteSurcharge;
  }, [shippingMethod, city]);

  const deliveryEstimate = useMemo(() => {
    return shippingMethod === "EXPRESS"
      ? "Estimated delivery: 1–2 business days"
      : "Estimated delivery: 2–5 business days";
  }, [shippingMethod]);

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setMsg("");

    // Front-end validation
    if (!fullName.trim() || !phone.trim() || !address1.trim() || !city.trim()) {
      setErr("Please fill shipping details (name, phone, address, city).");
      return;
    }

    // Payment validation
    if (paymentMethod === "CARD") {
      if (!cardNumber.trim() || !expiryMMYY.trim()) {
        setErr("Please enter card number and expiry, or choose Cash on Delivery.");
        return;
      }
    }

    try {
      // Include paymentMethod
      const payload =
        paymentMethod === "COD"
          ? { paymentMethod: "COD" }
          : { paymentMethod: "CARD", cardNumber, expiryMMYY };

      const r = await ordersApi.checkout(token, payload);

      setMsg(`Checkout success ✅ Order #${r.order_id}`);
      setTimeout(() => nav("/orders"), 800);
    } catch (e2) {
      setErr(e2.message);
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <Card title="Checkout">
        <form onSubmit={submit} className="space-y-6">
          {/* Shipping */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Shipping details
            </div>

            <Input
              label="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Omar Hany"
            />

            <Input
              label="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 01xxxxxxxxx"
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Country
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                >
                  <option>Egypt</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  City
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                >
                  <option>Cairo</option>
                  <option>Giza</option>
                  <option>Alexandria</option>
                  <option>Mansoura</option>
                  <option>Tanta</option>
                  <option>Aswan</option>
                </select>
              </div>
            </div>

            <Input
              label="Address line 1"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              placeholder="Street, building, apartment"
            />

            <Input
              label="Address line 2 (optional)"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              placeholder="Landmark, additional details"
            />

            <Input
              label="ZIP / Postal code (optional)"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              placeholder="e.g. 12345"
            />

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Shipping method
              </label>
              <select
                value={shippingMethod}
                onChange={(e) => setShippingMethod(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              >
                <option value="STANDARD">Standard (2–5 days)</option>
                <option value="EXPRESS">Express (1–2 days)</option>
              </select>

              <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                {deliveryEstimate} • Shipping fee:{" "}
                <span className="font-semibold text-slate-900 dark:text-white">
                  {shippingFee} EGP
                </span>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Payment
            </div>

            {/* Payment method selector */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Payment method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              >
                <option value="CARD">Credit / Debit Card</option>
                <option value="COD">Cash on Delivery</option>
              </select>

              {paymentMethod === "COD" && (
                <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                  You will pay in cash when the order arrives.
                </div>
              )}
            </div>

            {/* Card fields only when CARD */}
            {paymentMethod === "CARD" && (
              <>
                <Input
                  label="Credit card number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="e.g. 4242 4242 4242 4242"
                />

                <Input
                  label="Expiry (MMYY)"
                  value={expiryMMYY}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="e.g. 0728"
                />
              </>
            )}
          </div>

          {/* Policies */}
          <div className="rounded-2xl border border-slate-200 bg-white/40 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/30 dark:text-slate-200">
            <div className="font-semibold text-slate-900 dark:text-white">
              Shipping & Returns Policy
            </div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-600 dark:text-slate-400">
              <li>Orders are processed within 24 hours.</li>
              <li>Returns accepted within 7 days of delivery.</li>
              <li>Books must be unused and in original condition.</li>
              <li>Refunds are processed within 5 business days.</li>
            </ul>
          </div>

          {err && <div className="text-sm text-red-600">{err}</div>}
          {msg && <div className="text-sm text-emerald-700">{msg}</div>}

          <Button className="w-full" type="submit">
            {paymentMethod === "COD" ? "Place order (Cash on Delivery)" : "Pay & Place order"}
          </Button>
        </form>

        <div className="mt-3 text-xs text-slate-500">
          Demo validation: card uses Luhn + expiry must be in the future.
        </div>
      </Card>
    </div>
  );
}
