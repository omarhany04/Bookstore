import Card from "../../components/ui/Card";

export default function Support() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="glass-panel-strong rounded-[2.4rem] px-6 py-8 sm:px-8">
        <div className="relative z-[1]">
          <div className="section-kicker">Contact support</div>
          <h1 className="mt-3 font-display text-5xl font-semibold leading-[0.96] text-balance">
            Reach the Booky team without friction.
          </h1>
          <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
            If you need help with checkout, orders, or account details, share the essentials and we can respond faster.
          </p>
        </div>
      </section>

      <Card title="Support details" subtitle="Use the contact points below for order and account-related questions.">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-[1.5rem] border border-[color:var(--stroke)] bg-white/45 p-4 dark:bg-white/5">
            <div className="text-[0.72rem] font-extrabold uppercase tracking-[0.2em] text-[color:var(--muted)]">Email</div>
            <a className="mt-3 block text-sm font-semibold text-[color:var(--text)] underline underline-offset-4" href="mailto:support@booky.com">
              support@booky.com
            </a>
          </div>
          <div className="rounded-[1.5rem] border border-[color:var(--stroke)] bg-white/45 p-4 dark:bg-white/5">
            <div className="text-[0.72rem] font-extrabold uppercase tracking-[0.2em] text-[color:var(--muted)]">Hours</div>
            <div className="mt-3 text-sm font-semibold text-[color:var(--text)]">Sun-Thu, 10:00-18:00</div>
          </div>
          <div className="rounded-[1.5rem] border border-[color:var(--stroke)] bg-white/45 p-4 dark:bg-white/5">
            <div className="text-[0.72rem] font-extrabold uppercase tracking-[0.2em] text-[color:var(--muted)]">Tip</div>
            <div className="mt-3 text-sm font-semibold text-[color:var(--text)]">Include your order ID for faster support.</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
