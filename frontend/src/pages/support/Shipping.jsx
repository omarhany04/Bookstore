import Card from "../../components/ui/Card";

export default function Shipping() {
  return (
    <div className="mx-auto max-w-3xl">
      <Card className="p-6">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Shipping & Returns
        </h1>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Everything you need to know about delivery and returns.
        </p>

        <div className="mt-6 space-y-5 text-sm text-slate-700 dark:text-slate-200">
          <section>
            <h2 className="font-semibold text-slate-900 dark:text-white">
              Shipping
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Orders are processed within 24 hours.</li>
              <li>Delivery usually takes 2–5 business days.</li>
              <li>You will receive an email once your order is shipped.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900 dark:text-white">
              Shipping Fees
            </h2>
            <p className="mt-2">
              Shipping fees are calculated at checkout based on your location.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900 dark:text-white">
              Returns
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Returns are accepted within 7 days of delivery.</li>
              <li>Books must be unused and in original condition.</li>
              <li>Refunds are processed within 5 business days.</li>
            </ul>
          </section>
        </div>
      </Card>
    </div>
  );
}
