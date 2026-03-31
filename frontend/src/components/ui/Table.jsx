export default function Table({ columns, rows, keyField, emptyMessage = "No data yet." }) {
  if (!rows.length) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-[color:var(--stroke-strong)] bg-white/40 px-5 py-10 text-center text-sm text-[color:var(--muted)] dark:bg-white/5">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[1.6rem] border border-[color:var(--stroke)] bg-white/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] backdrop-blur dark:bg-white/5">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/55 text-[0.7rem] uppercase tracking-[0.22em] text-[color:var(--muted)] dark:bg-white/5">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className="px-4 py-3 font-extrabold">
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r[keyField]}
                className="border-t border-[color:var(--stroke)] transition-colors duration-200 hover:bg-white/40 dark:hover:bg-white/5"
              >
                {columns.map((c) => (
                  <td key={c.key} className="px-4 py-4 align-top text-[color:var(--text)]">
                    {typeof c.render === "function" ? c.render(r) : r[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
