import Card from "../../components/ui/Card";

export default function Shipping() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="glass-panel-strong rounded-[2.4rem] px-6 py-8 sm:px-8">
        <div className="relative z-[1]">
          <div className="section-kicker">Shipping and returns</div>
          <h1 className="mt-3 font-display text-5xl font-semibold leading-[0.96] text-balance">
            Delivery expectations, return timing, and the basics in one place.
          </h1>
        </div>
      </section>

      <Card title="Shipping" subtitle="How delivery works after you place an order.">
        <ul className="space-y-3 text-sm leading-7 text-[color:var(--text)]">
          <li className="rounded-[1.4rem] border border-[color:var(--stroke)] bg-white/45 p-4 dark:bg-white/5">Orders are processed within 24 hours.</li>
          <li className="rounded-[1.4rem] border border-[color:var(--stroke)] bg-white/45 p-4 dark:bg-white/5">Delivery usually takes 2–5 business days.</li>
          <li className="rounded-[1.4rem] border border-[color:var(--stroke)] bg-white/45 p-4 dark:bg-white/5">You will receive an email once your order is shipped.</li>
        </ul>
      </Card>

      <Card title="Returns" subtitle="The return window and refund handling at a glance.">
        <ul className="space-y-3 text-sm leading-7 text-[color:var(--text)]">
          <li className="rounded-[1.4rem] border border-[color:var(--stroke)] bg-white/45 p-4 dark:bg-white/5">Returns are accepted within 7 days of delivery.</li>
          <li className="rounded-[1.4rem] border border-[color:var(--stroke)] bg-white/45 p-4 dark:bg-white/5">Books must be unused and in original condition.</li>
          <li className="rounded-[1.4rem] border border-[color:var(--stroke)] bg-white/45 p-4 dark:bg-white/5">Refunds are processed within 5 business days.</li>
        </ul>
      </Card>
    </div>
  );
}
