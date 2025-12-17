import Card from "../../components/ui/Card";

export default function HowToBuy() {
  return (
    <div className="mx-auto max-w-3xl">
      <Card className="p-6">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          How to Buy
        </h1>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Quick guide to placing an order on Booky.
        </p>

        <ol className="mt-6 list-decimal space-y-3 pl-5 text-sm text-slate-700 dark:text-slate-200">
          <li>Browse books and open a book details page.</li>
          <li>Add the book to your cart (respecting available stock).</li>
          <li>Go to Cart → Checkout.</li>
          <li>Confirm your details and place the order.</li>
          <li>Track it from Orders.</li>
        </ol>

        <div className="mt-6 rounded-2xl border border-slate-300/60 bg-slate-100/40 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-950/30 dark:text-slate-300">
          Stock is validated at checkout to prevent overselling.
        </div>
      </Card>
    </div>
  );
}
