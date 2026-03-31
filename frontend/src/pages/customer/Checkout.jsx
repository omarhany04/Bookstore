import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, ShieldCheck, Truck } from "lucide-react";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { ordersApi } from "../../api/orders";
import { useAuth } from "../../context/AuthContext";

const selectClassName =
  "w-full rounded-[1.3rem] border border-[color:var(--stroke-strong)] bg-white/75 px-4 py-3 text-sm text-[color:var(--text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] outline-none transition-all duration-300 focus:-translate-y-px focus:border-[color:var(--accent)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(199,108,43,0.12)] dark:bg-white/5 dark:shadow-none dark:focus:bg-white/10";

export default function Checkout() {
  const { token } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState("CARD");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMMYY, setExpiry] = useState("");
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
  const navigate = useNavigate();

  const shippingFee = useMemo(() => {
    const base = shippingMethod === "EXPRESS" ? 80 : 50;
    const majorCities = ["Cairo", "Giza", "Alexandria"];
    const remoteSurcharge = majorCities.includes(city) ? 0 : 20;
    return base + remoteSurcharge;
  }, [shippingMethod, city]);

  const deliveryEstimate = useMemo(
    () => (shippingMethod === "EXPRESS" ? "Estimated delivery: 1–2 business days" : "Estimated delivery: 2–5 business days"),
    [shippingMethod]
  );

  async function submit(event) {
    event.preventDefault();
    setErr("");
    setMsg("");

    if (!fullName.trim() || !phone.trim() || !address1.trim() || !city.trim()) {
      setErr("Please fill shipping details (name, phone, address, city).");
      return;
    }

    if (paymentMethod === "CARD" && (!cardNumber.trim() || !expiryMMYY.trim())) {
      setErr("Please enter card number and expiry, or choose Cash on Delivery.");
      return;
    }

    try {
      const payload =
        paymentMethod === "COD"
          ? { paymentMethod: "COD" }
          : { paymentMethod: "CARD", cardNumber, expiryMMYY };

      const result = await ordersApi.checkout(token, payload);
      setMsg(`Checkout success. Order #${result.order_id}`);
      window.setTimeout(() => navigate("/orders"), 900);
    } catch (error) {
      setErr(error.message);
    }
  }

  const optionClass = (active) =>
    `rounded-[1.5rem] border px-4 py-4 text-left transition-all duration-300 ${
      active
        ? "border-transparent bg-[linear-gradient(135deg,var(--accent),var(--accent-deep))] text-white shadow-[0_18px_34px_rgba(199,108,43,0.24)]"
        : "border-[color:var(--stroke-strong)] bg-white/55 text-[color:var(--text)] hover:-translate-y-0.5 hover:bg-white/80 dark:bg-white/5 dark:hover:bg-white/10"
    }`;

  return (
    <div className="space-y-6">
      <section className="glass-panel-strong rounded-[2.4rem] px-6 py-8 sm:px-8">
        <div className="relative z-[1] flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="section-kicker">Checkout</div>
            <h1 className="mt-3 font-display text-5xl font-semibold leading-[0.96] text-balance">
              Finish the order with a calmer, clearer flow.
            </h1>
            <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
              Shipping details, delivery choice, and payment method are grouped more intentionally so the last step feels confident instead of crowded.
            </p>
          </div>
        </div>
      </section>

      <form onSubmit={submit} className="grid gap-6 xl:grid-cols-[1.1fr_360px]">
        <div className="space-y-6">
          <Card title="Shipping details" subtitle="Tell us where the books should go.">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input label="Full name" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="e.g. Omar Hany" />
              <Input label="Phone" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="e.g. 01xxxxxxxxx" />

              <label className="block">
                <span className="mb-2 block text-[0.72rem] font-extrabold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                  Country
                </span>
                <select value={country} onChange={(event) => setCountry(event.target.value)} className={selectClassName}>
                  <option>Egypt</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-[0.72rem] font-extrabold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                  City
                </span>
                <select value={city} onChange={(event) => setCity(event.target.value)} className={selectClassName}>
                  <option>Cairo</option>
                  <option>Giza</option>
                  <option>Alexandria</option>
                  <option>Mansoura</option>
                  <option>Tanta</option>
                  <option>Aswan</option>
                </select>
              </label>

              <div className="md:col-span-2">
                <Input
                  label="Address line 1"
                  value={address1}
                  onChange={(event) => setAddress1(event.target.value)}
                  placeholder="Street, building, apartment"
                />
              </div>
              <div className="md:col-span-2">
                <Input
                  label="Address line 2"
                  value={address2}
                  onChange={(event) => setAddress2(event.target.value)}
                  placeholder="Landmark or extra instructions"
                />
              </div>
              <div className="md:col-span-2">
                <Input
                  label="ZIP / postal code"
                  value={zip}
                  onChange={(event) => setZip(event.target.value)}
                  placeholder="e.g. 12345"
                />
              </div>
            </div>
          </Card>

          <Card title="Delivery speed" subtitle="Choose the shipping rhythm that fits this order.">
            <div className="grid gap-3 sm:grid-cols-2">
              <button type="button" className={optionClass(shippingMethod === "STANDARD")} onClick={() => setShippingMethod("STANDARD")}>
                <div className="text-[0.72rem] font-extrabold uppercase tracking-[0.2em]">Standard</div>
                <div className="mt-2 text-lg font-semibold">2–5 business days</div>
                <div className="mt-2 text-sm opacity-80">50 EGP base fee with a small remote-city adjustment when needed.</div>
              </button>
              <button type="button" className={optionClass(shippingMethod === "EXPRESS")} onClick={() => setShippingMethod("EXPRESS")}>
                <div className="text-[0.72rem] font-extrabold uppercase tracking-[0.2em]">Express</div>
                <div className="mt-2 text-lg font-semibold">1–2 business days</div>
                <div className="mt-2 text-sm opacity-80">Priority delivery for readers who want the title sooner.</div>
              </button>
            </div>
          </Card>

          <Card title="Payment" subtitle="Choose card payment or keep it simple with cash on delivery.">
            <div className="grid gap-3 sm:grid-cols-2">
              <button type="button" className={optionClass(paymentMethod === "CARD")} onClick={() => setPaymentMethod("CARD")}>
                <div className="text-[0.72rem] font-extrabold uppercase tracking-[0.2em]">Card</div>
                <div className="mt-2 text-lg font-semibold">Credit / Debit</div>
                <div className="mt-2 text-sm opacity-80">Client-side validation is applied before order submission.</div>
              </button>
              <button type="button" className={optionClass(paymentMethod === "COD")} onClick={() => setPaymentMethod("COD")}>
                <div className="text-[0.72rem] font-extrabold uppercase tracking-[0.2em]">Cash</div>
                <div className="mt-2 text-lg font-semibold">Pay on delivery</div>
                <div className="mt-2 text-sm opacity-80">Keep the final step lighter and pay when the order arrives.</div>
              </button>
            </div>

            {paymentMethod === "CARD" && (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Input
                  label="Credit card number"
                  value={cardNumber}
                  onChange={(event) => setCardNumber(event.target.value)}
                  placeholder="e.g. 4242 4242 4242 4242"
                />
                <Input
                  label="Expiry (MMYY)"
                  value={expiryMMYY}
                  onChange={(event) => setExpiry(event.target.value)}
                  placeholder="e.g. 0728"
                />
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-4 xl:sticky xl:top-28 xl:self-start">
          <Card title="Order summary" subtitle="Final delivery context before you place the order.">
            <div className="space-y-4">
              <div className="rounded-[1.4rem] border border-[color:var(--stroke)] bg-white/45 p-4 dark:bg-white/5">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-[color:var(--teal)]" />
                  <div>
                    <div className="font-semibold text-[color:var(--text)]">{shippingMethod === "EXPRESS" ? "Express delivery" : "Standard delivery"}</div>
                    <div className="text-sm text-[color:var(--muted)]">{deliveryEstimate}</div>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.4rem] border border-[color:var(--stroke)] bg-white/45 p-4 dark:bg-white/5">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-[color:var(--accent-deep)]" />
                  <div>
                    <div className="font-semibold text-[color:var(--text)]">
                      {paymentMethod === "CARD" ? "Card payment" : "Cash on Delivery"}
                    </div>
                    <div className="text-sm text-[color:var(--muted)]">
                      {paymentMethod === "CARD" ? "Validated before the order is placed." : "Pay when the shipment arrives."}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-[1.4rem] border border-[color:var(--stroke)] bg-white/45 px-4 py-4 dark:bg-white/5">
                <span className="text-sm text-[color:var(--muted)]">Shipping fee</span>
                <span className="text-xl font-black text-[color:var(--text)]">{shippingFee} EGP</span>
              </div>

              {err && (
                <div className="rounded-[1.3rem] border border-red-200/70 bg-red-100/80 px-4 py-3 text-sm font-semibold text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200">
                  {err}
                </div>
              )}
              {msg && (
                <div className="rounded-[1.3rem] border border-emerald-200/70 bg-emerald-100/80 px-4 py-3 text-sm font-semibold text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200">
                  {msg}
                </div>
              )}

              <Button className="w-full" type="submit">
                {paymentMethod === "COD" ? "Place order" : "Pay and place order"}
              </Button>
            </div>
          </Card>

          <div className="glass-panel rounded-[2rem] p-5">
            <div className="relative z-[1] flex items-start gap-3">
              <ShieldCheck className="mt-1 h-5 w-5 text-[color:var(--success)]" />
              <div className="text-sm leading-7 text-[color:var(--muted)]">
                Demo validation still checks card structure with Luhn logic and confirms expiry is in the future before submission.
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
