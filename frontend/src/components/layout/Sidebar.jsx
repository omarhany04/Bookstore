import { NavLink } from "react-router-dom";
import { BarChart3, Boxes, LayoutDashboard, Sparkles } from "lucide-react";

const items = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/books", label: "Manage Books", icon: Boxes },
  { to: "/admin/replenishments", label: "Replenishments", icon: Sparkles },
  { to: "/admin/reports", label: "Reports", icon: BarChart3 },
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-[1.2rem] px-4 py-3 text-sm font-semibold transition-all duration-300 ${
    isActive
      ? "bg-[linear-gradient(135deg,var(--accent),var(--accent-deep))] text-white shadow-[0_18px_36px_rgba(199,108,43,0.24)]"
      : "text-[color:var(--muted)] hover:bg-white/55 hover:text-[color:var(--text)] dark:hover:bg-white/8"
  }`;

export default function Sidebar() {
  return (
    <aside className="glass-panel sticky top-28 rounded-[2rem] p-5">
      <div className="relative z-[1]">
        <div className="section-kicker">Admin console</div>
        <div className="mt-2 font-display text-3xl font-semibold text-[color:var(--text)]">Control center</div>
        <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
          Inventory, replenishment, and reporting tools live here in one focused workspace.
        </p>

        <nav className="mt-6 space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} className={linkClass} to={item.to}>
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-6 rounded-[1.5rem] border border-[color:var(--stroke)] bg-white/45 px-4 py-4 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.58)] dark:bg-white/5">
          <div className="text-[0.72rem] font-extrabold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            Workflow note
          </div>
          <div className="mt-2 font-semibold text-[color:var(--text)]">
            Refresh reports after major order activity to review the latest sales and replenishment trends.
          </div>
        </div>
      </div>
    </aside>
  );
}
