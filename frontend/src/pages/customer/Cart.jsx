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

  useEffect(() => { load(); }, []);

  async function remove(isbn) {
    await cartApi.remove(token, isbn);
    load();
  }

  async function clear() {
    await cartApi.clear(token);
    load();
  }

  const columns = [
    { key: "title", header: "Book" },
    { key: "qty", header: "Qty" },
    { key: "selling_price", header: "Unit" , render: r => Number(r.selling_price).toFixed(2) },
    { key: "line_total", header: "Total", render: r => Number(r.line_total).toFixed(2) },
    { key: "actions", header: "", render: r => <Button variant="secondary" onClick={() => remove(r.isbn)}>Remove</Button> },
  ];

  if (err) return <div className="text-red-600">{err}</div>;
  if (!cart) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <Card
        title="Your cart"
        right={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={load}>Refresh</Button>
            <Button variant="danger" onClick={clear}>Clear</Button>
          </div>
        }
      >
        {cart.items.length === 0 ? (
          <div className="text-sm text-slate-600">
            Cart is empty. <Link className="font-semibold text-slate-900" to="/books">Browse books</Link>
          </div>
        ) : (
          <>
            <Table columns={columns} rows={cart.items} keyField="isbn" />
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-slate-600">Cart total</div>
              <div className="text-xl font-black">{Number(cart.total).toFixed(2)} EGP</div>
            </div>
            <div className="mt-4">
              <Button className="w-full" onClick={() => nav("/checkout")}>Proceed to checkout</Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
