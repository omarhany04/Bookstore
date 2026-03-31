export default function Card({
  title,
  subtitle,
  children,
  right,
  className = "",
  contentClassName = "",
}) {
  const titleIsString = typeof title === "string";

  return (
    <section className={`glass-panel rounded-[2rem] p-6 sm:p-7 ${className}`}>
      {(title || right) && (
        <div className="relative z-[1] mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            {title &&
              (titleIsString ? (
                <h2 className="font-display text-[1.8rem] font-semibold leading-tight text-[color:var(--text)]">
                  {title}
                </h2>
              ) : (
                title
              ))}
            {subtitle && <p className="max-w-2xl text-sm text-[color:var(--muted)]">{subtitle}</p>}
          </div>
          {right}
        </div>
      )}
      <div className={`relative z-[1] ${contentClassName}`}>{children}</div>
    </section>
  );
}
