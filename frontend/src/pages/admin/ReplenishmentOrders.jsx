import { useEffect, useMemo, useState } from "react";
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
    } catch (error) {
      setErr(error.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function confirm(id) {
    setErr("");
    try {
      await apiFetch(`/admin/replenishment-orders/${id}/confirm`, { method: "PATCH", token });
      await load();
    } catch (error) {
      setErr(error.message);
    }
  }

  const pendingCount = useMemo(() => rows.filter((row) => row.status !== "Confirmed").length, [rows]);
  const confirmedCount = useMemo(() => rows.filter((row) => row.status === "Confirmed").length, [rows]);

  const columns = [
    { key: "repl_order_id", header: "Order #" },
    { key: "title", header: "Book" },
    { key: "isbn", header: "ISBN" },
    { key: "publisher", header: "Publisher" },
    { key: "qty", header: "Qty" },
    {
      key: "status",
      header: "Status",
      render: (row) => <Badge tone={row.status === "Confirmed" ? "green" : "yellow"}>{row.status}</Badge>,
    },
    {
      key: "actions",
      header: "",
      render: (row) =>
        row.status === "Confirmed" ? (
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--muted)]">Completed</span>
        ) : (
          <Button variant="secondary" onClick={() => confirm(row.repl_order_id)}>
            Confirm
          </Button>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <section className="glass-panel-strong rounded-[2.4rem] px-6 py-8 sm:px-8">
        <div className="relative z-[1] flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="section-kicker">Replenishment workflow</div>
            <h1 className="mt-3 font-display text-5xl font-semibold leading-[0.96] text-balance">
              Review low-stock recovery with a clearer operational view.
            </h1>
            <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
              Confirm orders here and the database trigger handles the stock increase after approval.
            </p>
          </div>
          <Button variant="secondary" onClick={load}>
            Refresh
          </Button>
        </div>
      </section>

      {err && (
        <div className="rounded-[1.6rem] border border-red-200/70 bg-red-100/80 px-5 py-4 text-sm font-semibold text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200">
          {err}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="glass-panel rounded-[2rem] p-5">
          <div className="relative z-[1] text-[0.72rem] font-extrabold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            Pending confirmations
          </div>
          <div className="mt-3 font-display text-4xl font-semibold text-[color:var(--text)]">{pendingCount}</div>
        </div>
        <div className="glass-panel rounded-[2rem] p-5">
          <div className="relative z-[1] text-[0.72rem] font-extrabold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            Confirmed replenishments
          </div>
          <div className="mt-3 font-display text-4xl font-semibold text-[color:var(--text)]">{confirmedCount}</div>
        </div>
      </div>

      <Card title="Replenishment orders" subtitle="Pending and completed inventory recovery requests.">
        <Table columns={columns} rows={rows} keyField="repl_order_id" emptyMessage="No replenishment orders yet." />
      </Card>
    </div>
  );
}
