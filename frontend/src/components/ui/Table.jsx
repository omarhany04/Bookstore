export default function Table({ columns, rows, keyField }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="text-xs uppercase text-slate-500 dark:text-slate-400">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-3 py-2">{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[keyField]} className="border-t border-slate-100 dark:border-slate-800">
              {columns.map((c) => (
                <td key={c.key} className="px-3 py-2 align-top">
                  {typeof c.render === "function" ? c.render(r) : r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
