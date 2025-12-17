import { useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import { useAuth } from "../../context/AuthContext";
import { reportsApi } from "../../api/reports";

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    (async () => {
      const prev = await reportsApi.previousMonthSales(token);
      const topC = await reportsApi.topCustomers(token);
      const topB = await reportsApi.topBooks(token);
      setStats({ prev, topC, topB });
    })();
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card title="Sales (previous month)">
          <div className="text-3xl font-black">{Number(stats.prev.total_sales).toFixed(2)} EGP</div>
        </Card>
        <Card title="Top customers (3 months)">
          <div className="text-sm text-slate-600">{stats.topC[0]?.username || "—"}</div>
          <div className="text-xl font-black">{stats.topC[0] ? Number(stats.topC[0].total_spent).toFixed(2) : "0.00"} EGP</div>
        </Card>
        <Card title="Top selling book (3 months)">
          <div className="text-sm text-slate-600 line-clamp-2">{stats.topB[0]?.book_name_snapshot || "—"}</div>
          <div className="text-xl font-black">{stats.topB[0]?.total_sold || 0} copies</div>
        </Card>
      </div>
    </div>
  );
}
