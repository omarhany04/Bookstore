import { useEffect, useState } from "react";
import { BarChart3, Sparkles, UsersRound } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { reportsApi } from "../../api/reports";

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [prev, topC, topB] = await Promise.all([
          reportsApi.previousMonthSales(token),
          reportsApi.topCustomers(token),
          reportsApi.topBooks(token),
        ]);
        setStats({ prev, topC, topB });
      } catch (error) {
        setErr(error.message);
      }
    })();
  }, [token]);

  if (err) {
    return (
      <div className="rounded-[1.6rem] border border-red-200/70 bg-red-100/80 px-5 py-4 text-sm font-semibold text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200">
        {err}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid min-h-[35vh] place-items-center">
        <div className="glass-panel rounded-[2rem] px-6 py-5 text-center">
          <div className="section-kicker">Loading</div>
          <div className="mt-2 font-display text-2xl font-semibold">Gathering admin metrics</div>
        </div>
      </div>
    );
  }

  const cards = [
    {
      label: "Previous month sales",
      value: `${Number(stats.prev.total_sales).toFixed(2)} EGP`,
      icon: BarChart3,
    },
    {
      label: "Top customer",
      value: stats.topC[0]?.username || "—",
      helper: stats.topC[0] ? `${Number(stats.topC[0].total_spent).toFixed(2)} EGP spent` : "No customer data yet",
      icon: UsersRound,
    },
    {
      label: "Top selling book",
      value: stats.topB[0]?.book_name_snapshot || "—",
      helper: `${stats.topB[0]?.total_sold || 0} copies sold`,
      icon: Sparkles,
    },
  ];

  return (
    <div className="space-y-6">
      <section className="glass-panel-strong rounded-[2.4rem] px-6 py-8 sm:px-8">
        <div className="relative z-[1]">
          <div>
            <div className="section-kicker">Admin dashboard</div>
            <h1 className="mt-3 font-display text-5xl font-semibold leading-[0.96] text-balance">
              A cleaner command view for inventory, performance, and replenishment.
            </h1>
            <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
              The dashboard now highlights the core numbers first, then points you into the inventory and reporting actions that matter most.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="glass-panel rounded-[2rem] p-5">
              <div className="relative z-[1]">
                <Icon className="h-5 w-5 text-[color:var(--accent-deep)]" />
                <div className="mt-4 text-[0.72rem] font-extrabold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                  {card.label}
                </div>
                <div className="mt-3 font-display text-3xl font-semibold leading-tight text-[color:var(--text)]">
                  {card.value}
                </div>
                {card.helper && <div className="mt-2 text-sm text-[color:var(--muted)]">{card.helper}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
