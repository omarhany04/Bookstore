import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }) =>
  `block rounded-xl px-3 py-2 text-sm font-semibold ${
    isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
  }`;

export default function Sidebar() {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="mb-3 text-xs font-bold uppercase text-slate-400">Admin</div>
      <nav className="space-y-1">
        <NavLink className={linkClass} to="/admin/dashboard">Dashboard</NavLink>
        <NavLink className={linkClass} to="/admin/books">Manage Books</NavLink>
        <NavLink className={linkClass} to="/admin/replenishments">Replenishments</NavLink>
        <NavLink className={linkClass} to="/admin/reports">Reports</NavLink>
      </nav>
    </div>
  );
}
