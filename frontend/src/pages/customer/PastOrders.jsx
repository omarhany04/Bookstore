import { useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Table from "../../components/ui/Table";
import { ordersApi } from "../../api/orders";
import { useAuth } from "../../context/AuthContext";

export default function PastOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [err, setErr] = useState("");

  async function load() {
    setErr("");
    try {
      const data = await ordersApi.mine(token);
      setOrders(data);
    } catch (e) {
      setErr(e.message);
    }
  }

  useEffect(() => { load(); }, []);

  if (err) return <div className="text-red-600">{err}</div>;

  return (
    <div className="space-y-6">
      <Card title="Past orders" right={<span className="text-sm text-slate-500">{orders.length} orders</span>}>
        {orders.length === 0 ? (
          <div className="text-sm text-slate-600">No orders yet.</div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <div key={o.order_id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-extrabold">Order #{o.order_id}</div>
                  <div className="flex items-center gap-2">
                    <Badge tone={o.status === "Confirmed" ? "green" : "yellow"}>{o.status}</Badge>
                    <div className="text-sm font-bold">{Number(o.total_price).toFixed(2)} EGP</div>
                  </div>
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  {new Date(o.order_date).toLocaleString()} • paid **** {o.payment_last4 || "----"}
                </div>

                <div className="mt-3">
                  <Table
                    keyField="isbn"
                    columns={[
                      { key: "book_name_snapshot", header: "Book" },
                      { key: "qty", header: "Qty" },
                      { key: "unit_price_snapshot", header: "Unit", render: r => Number(r.unit_price_snapshot).toFixed(2) }
                    ]}
                    rows={o.items}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
