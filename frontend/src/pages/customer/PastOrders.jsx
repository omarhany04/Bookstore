import { useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import { ordersApi } from "../../api/orders";
import { useAuth } from "../../context/AuthContext";

export default function PastOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [err, setErr] = useState("");
  const [busyOrderId, setBusyOrderId] = useState(null);
  const [notice, setNotice] = useState("");
  const [confirmOrderId, setConfirmOrderId] = useState(null);

  async function load() {
    setErr("");
    try {
      const data = await ordersApi.mine(token);
      setOrders(data);
    } catch (error) {
      setErr(error.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function deleteOrder(orderId) {
    if (busyOrderId) return;

    setErr("");
    setBusyOrderId(orderId);
    try {
      await ordersApi.cancel(token, orderId);
      await load();
    } catch (error) {
      setErr(error.message);
      throw error;
    } finally {
      setBusyOrderId(null);
    }
  }

  function badgeTone(status) {
    if (status === "Confirmed") return "green";
    if (status === "Cancelled") return "red";
    return "yellow";
  }

  return (
    <div className="space-y-6">
      <section className="glass-panel-strong rounded-[2.4rem] px-6 py-8 sm:px-8">
        <div className="relative z-[1]">
          <div className="section-kicker">Order history</div>
          <h1 className="mt-3 font-display text-5xl font-semibold leading-[0.96] text-balance">
            Review previous purchases in one polished timeline.
          </h1>
          <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
            Check status, inspect line items, and cancel confirmed orders while stock restoration stays automatic.
          </p>
        </div>
      </section>

      {err && (
        <div className="rounded-[1.6rem] border border-red-200/70 bg-red-100/80 px-5 py-4 text-sm font-semibold text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200">
          {err}
        </div>
      )}

      {notice && (
        <div className="rounded-[1.6rem] border border-emerald-200/70 bg-emerald-100/80 px-5 py-4 text-sm font-semibold text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200">
          {notice}
        </div>
      )}

      <Card title="Past orders" subtitle={`${orders.length} order records available`}>
        {orders.length === 0 ? (
          <div className="text-sm text-[color:var(--muted)]">No orders yet.</div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isBusy = busyOrderId === order.order_id;
              const canDelete = order.status === "Confirmed";

              return (
                <div key={order.order_id} className="rounded-[1.8rem] border border-[color:var(--stroke)] bg-white/45 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] dark:bg-white/5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="font-display text-2xl font-semibold text-[color:var(--text)]">Order #{order.order_id}</div>
                      <div className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--muted)]">
                        {new Date(order.order_date).toLocaleString()} • paid **** {order.payment_last4 || "----"}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={badgeTone(order.status)}>{order.status}</Badge>
                      <div className="rounded-full border border-[color:var(--stroke-strong)] bg-white/60 px-4 py-2 text-sm font-black text-[color:var(--text)] dark:bg-white/5">
                        {Number(order.total_price).toFixed(2)} EGP
                      </div>
                      {canDelete && (
                        <Button
                          variant="danger"
                          disabled={isBusy}
                          onClick={() => {
                            setErr("");
                            setNotice("");
                            setConfirmOrderId(order.order_id);
                          }}
                        >
                          Cancel order
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <Table
                      keyField="isbn"
                      emptyMessage="This order has no line items."
                      columns={[
                        { key: "book_name_snapshot", header: "Book" },
                        { key: "qty", header: "Qty" },
                        {
                          key: "unit_price_snapshot",
                          header: "Unit",
                          render: (item) => Number(item.unit_price_snapshot).toFixed(2),
                        },
                      ]}
                      rows={order.items}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {confirmOrderId != null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm" onClick={() => (busyOrderId ? null : setConfirmOrderId(null))} />
            <div className="glass-panel relative w-full max-w-md rounded-[2rem] p-6">
              <div className="relative z-[1]">
                <div className="font-display text-3xl font-semibold text-[color:var(--text)]">Cancel this order?</div>
                <div className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                  This will cancel <span className="font-bold text-[color:var(--text)]">Order #{confirmOrderId}</span> and restore stock automatically.
                </div>
                <div className="mt-4 rounded-[1.4rem] border border-[color:var(--stroke)] bg-white/45 p-4 text-sm text-[color:var(--muted)] dark:bg-white/5">
                  If you paid by card, refunds are processed within <span className="font-semibold text-[color:var(--text)]">5 business days</span>.
                </div>
                <div className="mt-5 flex flex-wrap justify-end gap-2">
                  <Button variant="secondary" disabled={!!busyOrderId} onClick={() => setConfirmOrderId(null)}>
                    Keep order
                  </Button>
                  <Button
                    variant="danger"
                    disabled={busyOrderId === confirmOrderId}
                    onClick={async () => {
                      setErr("");
                      setNotice("");
                      try {
                        await deleteOrder(confirmOrderId);
                        setNotice("Order cancelled.");
                        setConfirmOrderId(null);
                      } catch {}
                    }}
                  >
                    {busyOrderId === confirmOrderId ? "Cancelling..." : "Confirm cancel"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
