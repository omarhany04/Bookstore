export default function Card({ title, children, right }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      {(title || right) && (
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">{title}</h2>
          {right}
        </div>
      )}
      {children}
    </div>
  );
}
