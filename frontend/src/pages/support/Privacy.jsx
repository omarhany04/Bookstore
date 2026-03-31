import Card from "../../components/ui/Card";

export default function Privacy() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="glass-panel-strong rounded-[2.4rem] px-6 py-8 sm:px-8">
        <div className="relative z-[1]">
          <div className="section-kicker">Privacy</div>
          <h1 className="mt-3 font-display text-5xl font-semibold leading-[0.96] text-balance">
            Clear data usage notes, without legal clutter.
          </h1>
        </div>
      </section>

      <Card title="Information we collect" subtitle="The basics Booky needs to serve the storefront experience.">
        <p className="text-sm leading-7 text-[color:var(--text)]">
          We collect core information such as your name, email, and order details so the app can handle checkout, delivery, and account-related flows.
        </p>
      </Card>

      <Card title="How information is used" subtitle="The main purposes behind the data we store.">
        <ul className="space-y-3 text-sm leading-7 text-[color:var(--text)]">
          <li className="rounded-[1.4rem] border border-[color:var(--stroke)] bg-white/45 p-4 dark:bg-white/5">To process and deliver orders</li>
          <li className="rounded-[1.4rem] border border-[color:var(--stroke)] bg-white/45 p-4 dark:bg-white/5">To communicate order updates</li>
          <li className="rounded-[1.4rem] border border-[color:var(--stroke)] bg-white/45 p-4 dark:bg-white/5">To improve the product and shopping experience</li>
        </ul>
      </Card>

      <Card title="Data protection" subtitle="A short summary of how customer data is treated.">
        <p className="text-sm leading-7 text-[color:var(--text)]">
          Your data is stored securely and is not shared with third parties without your consent. If you have questions, contact{" "}
          <a href="mailto:support@booky.com" className="font-semibold underline underline-offset-4">
            support@booky.com
          </a>
          .
        </p>
      </Card>
    </div>
  );
}
