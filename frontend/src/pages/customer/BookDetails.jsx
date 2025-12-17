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
    } catch (e) {
      setErr(e.message);
    }
  }

  useEffect(() => { load(); }, [isbn]);

  async function addToCart() {
    setErr(""); setMsg("");
    if (!isAuthed) return nav("/login");
    try {
      await cartApi.add(token, book.isbn, Number(qty));
      setMsg("Added to cart ✅");
    } catch (e) {
      setErr(e.message);
    }
  }

  if (err) return <div className="text-red-600">{err}</div>;
  if (!book) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <Link className="text-sm font-semibold text-slate-600 hover:text-slate-900" to="/books">
        ← Back to books
      </Link>

      <Card title={book.title}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="md:col-span-2 space-y-2 text-sm text-slate-700">
            <div><span className="font-semibold">ISBN:</span> {book.isbn}</div>
            <div><span className="font-semibold">Category:</span> {book.category}</div>
            <div><span className="font-semibold">Publisher:</span> {book.publisher}</div>
            <div><span className="font-semibold">Authors:</span> {(book.authors || []).join(", ")}</div>
            <div><span className="font-semibold">Year:</span> {book.publication_year}</div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <div className="text-2xl font-black">{Number(book.selling_price).toFixed(2)} EGP</div>
            <div className="mt-2">
              <Badge tone={book.stock_qty > 0 ? "green" : "red"}>
                {book.stock_qty > 0 ? `In stock: ${book.stock_qty}` : "Out of stock"}
              </Badge>
            </div>

            <div className="mt-4 space-y-2">
              <Input
                label="Quantity"
                type="number"
                min={1}
                value={qty}
                onChange={(e)=>setQty(e.target.value)}
              />
              <Button className="w-full" onClick={addToCart} disabled={book.stock_qty <= 0}>
                Add to cart
              </Button>
              {msg && <div className="text-sm text-emerald-700">{msg}</div>}
              {err && <div className="text-sm text-red-600">{err}</div>}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
