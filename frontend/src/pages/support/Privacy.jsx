import Card from "../../components/ui/Card";

export default function Privacy() {
  return (
    <div className="mx-auto max-w-3xl">
      <Card className="p-6">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Privacy Policy
        </h1>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Your privacy is important to us.
        </p>

        <div className="mt-6 space-y-5 text-sm text-slate-700 dark:text-slate-200">
          <section>
            <h2 className="font-semibold text-slate-900 dark:text-white">
              Information We Collect
            </h2>
            <p className="mt-2">
              We collect basic information such as your name, email, and order
              details to provide our services.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900 dark:text-white">
              How We Use Your Information
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>To process and deliver orders</li>
              <li>To communicate order updates</li>
              <li>To improve our services</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900 dark:text-white">
              Data Protection
            </h2>
            <p className="mt-2">
              Your data is stored securely and is never shared with third
              parties without your consent.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900 dark:text-white">
              Contact
            </h2>
            <p className="mt-2">
              If you have any questions about this policy, contact us at{" "}
              <a
                href="mailto:support@booky.com"
                className="font-semibold underline underline-offset-4"
              >
                support@booky.com
              </a>
              .
            </p>
          </section>
        </div>
      </Card>
    </div>
  );
}
