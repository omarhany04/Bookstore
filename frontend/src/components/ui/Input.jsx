export default function Input({ label, className = "", ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-2 block text-[0.72rem] font-extrabold uppercase tracking-[0.2em] text-[color:var(--muted)]">
          {label}
        </span>
      )}
      <input
        className={`w-full rounded-[1.3rem] border border-[color:var(--stroke-strong)] bg-white/75 px-4 py-3 text-sm text-[color:var(--text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] outline-none transition-all duration-300 placeholder:text-slate-400 focus:-translate-y-px focus:border-[color:var(--accent)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(199,108,43,0.12)] dark:bg-white/5 dark:shadow-none dark:placeholder:text-slate-500 dark:focus:bg-white/10 ${className}`}
        {...props}
      />
    </label>
  );
}
