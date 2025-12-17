import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Table from "../../components/ui/Table";
import { cartApi } from "../../api/cart";
import { useAuth } from "../../context/AuthContext";

export default function Cart() {
  const { token } = useAuth();
  const [cart, setCart] = useState(null);
  const [err, setErr] = useState("");
  const [busyIsbn, setBusyIsbn] = useState(null);
  const nav = useNavigate();

  async function load() {
    setErr("");
    try {
      const data = await cartApi.get(token);
      setCart(data);
    } catch (e) {
      setErr(e.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function inc(item) {
    if (busyIsbn) return;
    if (Number(item.stock_qty) > 0 && Number(item.qty) >= Number(item.stock_qty)) return;

    setBusyIsbn(item.isbn);
    try {
      await cartApi.update(token, item.isbn, Number(item.qty) + 1);
      await load();
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusyIsbn(null);
    }
  }

  async function dec(item) {
    if (busyIsbn) return;

    setBusyIsbn(item.isbn);
    try {
      const currentQty = Number(item.qty);

      if (currentQty <= 1) {
        await cartApi.remove(token, item.isbn);
      } else {
        await cartApi.update(token, item.isbn, currentQty - 1);
      }

      await load();
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusyIsbn(null);
    }
  }

  async function clear() {
    try {
      await cartApi.clear(token);
      load();
    } catch (e) {
      setErr(e.message);
    }
  }

  const columns = [
    { key: "title", header: "Book" },

    {
      key: "qty",
      header: "Qty",
      render: (r) => {
        const isBusy = busyIsbn === r.isbn;
        const atMax = Number(r.stock_qty) > 0 && Number(r.qty) >= Number(r.stock_qty);

        return (
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              className="px-3 py-1"
              onClick={() => dec(r)}
              disabled={isBusy}
              type="button"
              title={Number(r.qty) <= 1 ? "Remove item" : "Decrease quantity"}
            >
              −
            </Button>

            <span className="min-w-[28px] text-center font-semibold">{r.qty}</span>

            <Button
              variant="secondary"
              className="px-3 py-1"
              onClick={() => inc(r)}
              disabled={isBusy || atMax}
              type="button"
              title={atMax ? "Reached stock limit" : "Increase quantity"}
            >
              +
            </Button>

            <span className="ml-2 text-xs text-slate-500">
              {Number(r.stock_qty) > 0 ? `stock: ${r.stock_qty}` : ""}
            </span>
          </div>
        );
      },
    },

    { key: "selling_price", header: "Unit", render: (r) => Number(r.selling_price).toFixed(2) },
    { key: "line_total", header: "Total", render: (r) => Number(r.line_total).toFixed(2) },
  ];

  if (err) return <div className="text-red-600">{err}</div>;
  if (!cart) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <Card
        title="Your cart"
        right={
          <div className="flex gap-2">
            <Button variant="danger" onClick={clear} type="button">
              Clear
            </Button>
          </div>
        }
      >
        {cart.items.length === 0 ? (
          <div className="text-sm text-slate-600">
            Cart is empty.{" "}
            <Link className="font-semibold text-slate-900" to="/books">
              Browse books
            </Link>
          </div>
        ) : (
          <>
            <Table columns={columns} rows={cart.items} keyField="isbn" />

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-slate-600">Cart total</div>
              <div className="text-xl font-black">{Number(cart.total).toFixed(2)} EGP</div>
            </div>

            <div className="mt-4">
              <Button className="w-full" onClick={() => nav("/checkout")} type="button">
                Proceed to checkout
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
