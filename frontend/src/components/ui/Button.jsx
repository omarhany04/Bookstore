export default function Button({
  children,
  className = "",
  variant = "primary",
  type = "button",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]/40 disabled:pointer-events-none disabled:opacity-55";

  const styles = {
    primary:
      "bg-[linear-gradient(135deg,var(--accent),var(--accent-deep))] text-white shadow-[0_18px_40px_rgba(199,108,43,0.28)] hover:-translate-y-0.5 hover:shadow-[0_24px_48px_rgba(199,108,43,0.32)]",
    secondary:
      "border border-[color:var(--stroke-strong)] bg-white/65 text-[color:var(--text)] shadow-[0_12px_28px_rgba(44,28,13,0.08)] backdrop-blur hover:-translate-y-0.5 hover:bg-white/80 dark:bg-white/5 dark:hover:bg-white/10",
    ghost:
      "text-[color:var(--muted)] hover:bg-white/55 hover:text-[color:var(--text)] dark:hover:bg-white/8",
    danger:
      "bg-[linear-gradient(135deg,#c95241,#922d22)] text-white shadow-[0_16px_38px_rgba(179,73,58,0.28)] hover:-translate-y-0.5 hover:shadow-[0_22px_44px_rgba(179,73,58,0.34)]",
  };

  return (
    <button type={type} className={`${base} ${styles[variant] || styles.primary} ${className}`} {...props}>
      {children}
    </button>
  );
}
