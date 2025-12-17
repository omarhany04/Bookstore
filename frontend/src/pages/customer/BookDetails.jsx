import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import { booksApi } from "../../api/books";
import { cartApi } from "../../api/cart";
import { useAuth } from "../../context/AuthContext";

export default function BookDetails() {
  const { isbn } = useParams();
  const [book, setBook] = useState(null);
  const [qty, setQty] = useState(1);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const { token, isAuthed } = useAuth();
  const nav = useNavigate();

  async function load() {
    setErr("");
    try {
      const data = await booksApi.get(isbn);
      setBook(data);

      // keep qty valid if stock is smaller
      const maxStock = Number(data?.stock_qty || 0);
      if (maxStock > 0) setQty((q) => Math.min(Number(q) || 1, maxStock));
      else setQty(1);
    } catch (e) {
      setErr(e.message);
    }
  }

  useEffect(() => {
    load();
  }, [isbn]);

  async function addToCart() {
    setErr("");
    setMsg("");
    if (!isAuthed) return nav("/login");

    try {
      await cartApi.add(token, book.isbn, Number(qty));
      setMsg("Added to cart ✅");
    } catch (e) {
      setErr(e.message);
    }
  }

  if (err) return <div className="text-red-600 dark:text-red-400">{err}</div>;
  if (!book) return <div>Loading...</div>;

  const stock = Number(book.stock_qty || 0);
  const qtyNum = Number(qty) || 1;
  const qtyInvalid = stock > 0 && qtyNum > stock;

  return (
    <div className="space-y-6">
      <Link
        className="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
        to="/books"
      >
        ← Back to books
      </Link>

      <Card title={<span className="text-2xl font-bold text-slate-900 dark:text-white">{book.title}</span>}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 items-center">
          {/* Left panel: bigger + better hierarchy */}
          <div className="md:col-span-2 space-y-4 text-base text-slate-800 leading-relaxed dark:text-slate-200">
            <div className="flex gap-2">
              <span className="min-w-[90px] font-medium text-slate-500 dark:text-slate-400">ISBN</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{book.isbn}</span>
            </div>

            <div className="flex gap-2">
              <span className="min-w-[90px] font-medium text-slate-500 dark:text-slate-400">Category</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{book.category}</span>
            </div>

            <div className="flex gap-2">
              <span className="min-w-[90px] font-medium text-slate-500 dark:text-slate-400">Publisher</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{book.publisher}</span>
            </div>

            <div className="flex gap-2">
              <span className="min-w-[90px] font-medium text-slate-500 dark:text-slate-400">Authors</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {(book.authors || []).join(", ")}
              </span>
            </div>

            <div className="flex gap-2">
              <span className="min-w-[90px] font-medium text-slate-500 dark:text-slate-400">Year</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{book.publication_year}</span>
            </div>
          </div>

          {/* Right panel: light theme restored + dark mode polished */}
          <div
            className="
              rounded-2xl p-5 ring-1 shadow-lg
              bg-white text-slate-900 ring-slate-200
              dark:bg-slate-950/50 dark:text-slate-100 dark:ring-white/10
            "
          >
            <div className="text-3xl font-black tracking-tight">
              {Number(book.selling_price).toFixed(2)}{" "}
              <span className="text-slate-500 dark:text-slate-300">EGP</span>
            </div>

            <div className="mt-3">
              <Badge tone={stock > 0 ? "green" : "red"}>
                {stock > 0 ? `In stock: ${stock}` : "Out of stock"}
              </Badge>
            </div>

            <div className="mt-5 space-y-3">
              <Input
                label="Quantity"
                type="number"
                min={1}
                max={stock || undefined}
                value={qty}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  const safe = isNaN(v) ? 1 : v;
                  const clamped = stock > 0 ? Math.max(1, Math.min(stock, safe)) : 1;
                  setQty(clamped);
                }}
              />

              {stock > 0 && (
                <div className="text-xs text-slate-500 dark:text-slate-300">
                  Max available:{" "}
                  <span className="font-semibold text-slate-700 dark:text-slate-100">{stock}</span>
                </div>
              )}

              <Button className="w-full" onClick={addToCart} disabled={stock <= 0 || qtyInvalid}>
                Add to cart
              </Button>

              {qtyInvalid && (
                <div className="text-sm text-red-600 dark:text-red-400">
                  Quantity cannot exceed stock.
                </div>
              )}

              {msg && <div className="text-sm text-emerald-700 dark:text-emerald-300">{msg}</div>}
              {err && <div className="text-sm text-red-600 dark:text-red-400">{err}</div>}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
