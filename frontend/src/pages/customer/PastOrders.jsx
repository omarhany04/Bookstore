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

  // Banner notice after cancel
  const [notice, setNotice] = useState("");

  // Confirm modal state
  const [confirmOrderId, setConfirmOrderId] = useState(null);

  async function load() {
    setErr("");
    try {
      const data = await ordersApi.mine(token);
      setOrders(data);
    } catch (e) {
      setErr(e.message);
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
    } catch (e) {
      setErr(e.message);
      throw e; // allow caller to know it failed
    } finally {
      setBusyOrderId(null);
    }
  }

  function badgeTone(status) {
    if (status === "Confirmed") return "green";
    if (status === "Cancelled") return "red";
    return "yellow";
  }

  if (err) return <div className="text-red-600">{err}</div>;

  return (
    <div className="space-y-6">
      <Card
        title="Past orders"
        right={<span className="text-sm text-slate-500">{orders.length} orders</span>}
      >
        {/* Refund/notice banner */}
        {notice && (
          <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200">
            {notice}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-sm text-slate-600">No orders yet.</div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => {
              const isBusy = busyOrderId === o.order_id;
              const canDelete = o.status === "Confirmed";

              return (
                <div key={o.order_id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-extrabold">Order #{o.order_id}</div>

                    <div className="flex items-center gap-2">
                      <Badge tone={badgeTone(o.status)}>{o.status}</Badge>
                      <div className="text-sm font-bold">
                        {Number(o.total_price).toFixed(2)} EGP
                      </div>

                      {canDelete && (
                        <Button
                          variant="danger"
                          type="button"
                          disabled={isBusy}
                          onClick={() => {
                            setErr("");
                            setNotice("");
                            setConfirmOrderId(o.order_id); // open confirm modal
                          }}
                        >
                          Delete order
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="mt-1 text-xs text-slate-500">
                    {new Date(o.order_date).toLocaleString()} • paid ****{" "}
                    {o.payment_last4 || "----"}
                  </div>

                  <div className="mt-3">
                    <Table
                      keyField="isbn"
                      columns={[
                        { key: "book_name_snapshot", header: "Book" },
                        { key: "qty", header: "Qty" },
                        {
                          key: "unit_price_snapshot",
                          header: "Unit",
                          render: (r) => Number(r.unit_price_snapshot).toFixed(2),
                        },
                      ]}
                      rows={o.items}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Confirm cancel modal */}
        {confirmOrderId != null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-slate-950/40"
              onClick={() => (busyOrderId ? null : setConfirmOrderId(null))}
            />
            <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-950">
              <div className="text-lg font-extrabold text-slate-900 dark:text-white">
                Cancel this order?
              </div>

              <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                This will cancel <span className="font-bold">Order #{confirmOrderId}</span> and
                restore stock automatically.
              </div>

              <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-200">
                <div className="font-bold mb-1">Refund info</div>
                If you paid by card, refunds are processed within{" "}
                <span className="font-semibold">5 business days</span>.
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={!!busyOrderId}
                  onClick={() => setConfirmOrderId(null)}
                >
                  No, keep it
                </Button>

                <Button
                  type="button"
                  variant="danger"
                  disabled={busyOrderId === confirmOrderId}
                  onClick={async () => {
                    setErr("");
                    setNotice("");
                    try {
                      await deleteOrder(confirmOrderId);
                      setNotice(
                        "Order cancelled."
                      );
                      setConfirmOrderId(null);
                    } catch (_) {
                      // error is already set in state
                    }
                  }}
                >
                  {busyOrderId === confirmOrderId ? "Cancelling..." : "Yes, cancel order"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
