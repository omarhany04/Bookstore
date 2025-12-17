import { useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../api/client";

export default function ReplenishmentOrders() {
  const { token } = useAuth();
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");

  async function load() {
    setErr("");
    try {
      const data = await apiFetch("/admin/replenishment-orders", { token });
      setRows(data);
    } catch (e) {
      setErr(e.message);
    }
  }

  useEffect(() => { load(); }, []);

  async function confirm(id) {
    setErr("");
    try {
      await apiFetch(`/admin/replenishment-orders/${id}/confirm`, { method: "PATCH", token });
      await load();
    } catch (e) {
      setErr(e.message);
    }
  }

  const columns = [
    { key: "repl_order_id", header: "Order #" },
    { key: "title", header: "Book" },
    { key: "isbn", header: "ISBN" },
    { key: "publisher", header: "Publisher" },
    { key: "qty", header: "Qty" },
    { key: "status", header: "Status", render: r => <Badge tone={r.status === "Confirmed" ? "green" : "yellow"}>{r.status}</Badge> },
    { key: "actions", header: "", render: r => (
      r.status === "Confirmed"
        ? <span className="text-xs text-slate-400">—</span>
        : <Button variant="secondary" onClick={() => confirm(r.repl_order_id)}>Confirm</Button>
    )},
  ];

  return (
    <div className="space-y-6">
      <Card title="Replenishment Orders" right={<Button variant="secondary" onClick={load}>Refresh</Button>}>
        {err && <div className="mb-3 text-sm text-red-600">{err}</div>}
        <Table columns={columns} rows={rows} keyField="repl_order_id" />
        <div className="mt-3 text-xs text-slate-500">
          When you confirm, stock is automatically increased by trigger.
        </div>
      </Card>
    </div>
  );
}
