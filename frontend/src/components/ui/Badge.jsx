export default function Badge({ children, tone = "slate" }) {
  const tones = {
    slate:
      "border border-[color:var(--stroke)] bg-white/70 text-[color:var(--muted)] dark:bg-white/5",
    green:
      "border border-emerald-200/70 bg-emerald-100/90 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/35 dark:text-emerald-300",
    yellow:
      "border border-amber-200/70 bg-amber-100/90 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/35 dark:text-amber-300",
    red:
      "border border-red-200/70 bg-red-100/90 text-red-800 dark:border-red-900/50 dark:bg-red-950/35 dark:text-red-300",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[0.72rem] font-extrabold uppercase tracking-[0.14em] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
