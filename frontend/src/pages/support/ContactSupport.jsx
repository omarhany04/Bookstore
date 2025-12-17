import Card from "../../components/ui/Card";

export default function Support() {
  return (
    <div className="mx-auto max-w-3xl">
      <Card className="p-6">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Contact Support
        </h1>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Need help? Reach us and we’ll get back to you as soon as possible.
        </p>

        <div className="mt-6 space-y-3 text-sm text-slate-700 dark:text-slate-200">
          <div>
            <span className="font-semibold">Email:</span>{" "}
            <a
              className="underline underline-offset-4 hover:opacity-80"
              href="mailto:support@booky.com"
            >
              support@booky.com
            </a>
          </div>

          <div>
            <span className="font-semibold">Hours:</span> Sun–Thu, 10:00–18:00
          </div>

          <div>
            <span className="font-semibold">Tip:</span> Include your order ID for faster support.
          </div>
        </div>
      </Card>
    </div>
  );
}
