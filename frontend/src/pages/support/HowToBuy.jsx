import Card from "../../components/ui/Card";

export default function HowToBuy() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="glass-panel-strong rounded-[2.4rem] px-6 py-8 sm:px-8">
        <div className="relative z-[1]">
          <div className="section-kicker">How to buy</div>
          <h1 className="mt-3 font-display text-5xl font-semibold leading-[0.96] text-balance">
            A faster way to move from discovery to delivery.
          </h1>
          <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
            Booky is designed so the path from browsing to checkout feels simple, guided, and stock-aware.
          </p>
        </div>
      </section>

      <Card title="Quick guide" subtitle="The essential flow for placing an order on Booky.">
        <ol className="space-y-4">
          {[
            "Browse books and open a title details page.",
            "Add the book to your cart while staying within available stock.",
            "Review the cart summary, then continue to checkout.",
            "Confirm shipping details and choose card payment or Cash on Delivery.",
            "Track the result later from Orders.",
          ].map((step, index) => (
            <li
              key={step}
              className="flex gap-4 rounded-[1.4rem] border border-[color:var(--stroke)] bg-white/45 p-4 text-sm text-[color:var(--text)] dark:bg-white/5"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,var(--accent),var(--accent-deep))] text-xs font-black text-white">
                {index + 1}
              </span>
              <span className="leading-7">{step}</span>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}
