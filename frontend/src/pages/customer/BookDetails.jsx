import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, ShoppingBag, Sparkles, Truck } from "lucide-react";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import BookCover from "../../components/ui/BookCover";
import Input from "../../components/ui/Input";
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
  const navigate = useNavigate();

  async function load() {
    setErr("");
    try {
      const data = await booksApi.get(isbn);
      setBook(data);

      const maxStock = Number(data?.stock_qty || 0);
      if (maxStock > 0) setQty((current) => Math.min(Number(current) || 1, maxStock));
      else setQty(1);
    } catch (error) {
      setErr(error.message);
    }
  }

  useEffect(() => {
    load();
  }, [isbn]);

  async function addToCart() {
    setErr("");
    setMsg("");
    if (!isAuthed) return navigate("/login");

    try {
      await cartApi.add(token, book.isbn, Number(qty));
      setMsg("Added to cart successfully.");
    } catch (error) {
      setErr(error.message);
    }
  }

  if (err) {
    return (
      <div className="rounded-[1.6rem] border border-red-200/70 bg-red-100/80 px-5 py-4 text-sm font-semibold text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200">
        {err}
      </div>
    );
  }

  if (!book) {
    return (
      <div className="grid min-h-[40vh] place-items-center">
        <div className="glass-panel rounded-[2rem] px-6 py-5 text-center">
          <div className="section-kicker">Loading</div>
          <div className="mt-2 font-display text-2xl font-semibold">Pulling this title from the shelf</div>
        </div>
      </div>
    );
  }

  const stock = Number(book.stock_qty || 0);
  const qtyNum = Number(qty) || 1;
  const qtyInvalid = stock > 0 && qtyNum > stock;

  return (
    <div className="space-y-6">
      <Link
        className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--muted)] transition-colors hover:text-[color:var(--text)]"
        to="/books"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to books
      </Link>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_360px]">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="glass-panel-strong rounded-[2.5rem] p-6 sm:p-8"
        >
          <div className="relative z-[1] grid gap-6 lg:grid-cols-[320px_1fr]">
            <BookCover
              title={book.title}
              subtitle={(book.authors || []).join(", ") || book.publisher}
              category={book.category}
              className="h-[28rem] w-full"
            />

            <div className="flex flex-col">
              <div className="flex flex-wrap gap-2">
                <Badge tone={stock > 0 ? "green" : "red"}>
                  {stock > 0 ? `In stock: ${stock}` : "Out of stock"}
                </Badge>
                <Badge tone="slate">{book.category}</Badge>
              </div>

              <h1 className="mt-4 font-display text-5xl font-semibold leading-[0.96] text-balance">
                {book.title}
              </h1>

              <p className="mt-4 text-base leading-8 text-[color:var(--muted)]">
                Booky keeps the essentials clean here: author, publisher, publication year, pricing, and the stock status you need before adding the title to cart.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.4rem] border border-[color:var(--stroke)] bg-white/45 p-4 dark:bg-white/5">
                  <div className="text-[0.7rem] font-extrabold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    Authors
                  </div>
                  <div className="mt-2 text-sm font-semibold leading-7 text-[color:var(--text)]">
                    {(book.authors || []).join(", ")}
                  </div>
                </div>
                <div className="rounded-[1.4rem] border border-[color:var(--stroke)] bg-white/45 p-4 dark:bg-white/5">
                  <div className="text-[0.7rem] font-extrabold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    Publisher
                  </div>
                  <div className="mt-2 text-sm font-semibold leading-7 text-[color:var(--text)]">{book.publisher}</div>
                </div>
                <div className="rounded-[1.4rem] border border-[color:var(--stroke)] bg-white/45 p-4 dark:bg-white/5">
                  <div className="text-[0.7rem] font-extrabold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    ISBN
                  </div>
                  <div className="mt-2 text-sm font-semibold text-[color:var(--text)]">{book.isbn}</div>
                </div>
                <div className="rounded-[1.4rem] border border-[color:var(--stroke)] bg-white/45 p-4 dark:bg-white/5">
                  <div className="text-[0.7rem] font-extrabold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    Publication year
                  </div>
                  <div className="mt-2 text-sm font-semibold text-[color:var(--text)]">{book.publication_year}</div>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.5rem] border border-[color:var(--stroke)] bg-white/50 p-4 dark:bg-white/5">
                  <Truck className="h-5 w-5 text-[color:var(--teal)]" />
                  <div className="mt-3 font-semibold text-[color:var(--text)]">Fast order flow</div>
                  <div className="mt-1 text-sm text-[color:var(--muted)]">Move from details to checkout without leaving context.</div>
                </div>
                <div className="rounded-[1.5rem] border border-[color:var(--stroke)] bg-white/50 p-4 dark:bg-white/5">
                  <ShieldCheck className="h-5 w-5 text-[color:var(--success)]" />
                  <div className="mt-3 font-semibold text-[color:var(--text)]">Stock-aware cart</div>
                  <div className="mt-1 text-sm text-[color:var(--muted)]">Quantity stays aligned with available inventory.</div>
                </div>
                <div className="rounded-[1.5rem] border border-[color:var(--stroke)] bg-white/50 p-4 dark:bg-white/5">
                  <Sparkles className="h-5 w-5 text-[color:var(--accent)]" />
                  <div className="mt-3 font-semibold text-[color:var(--text)]">AI help nearby</div>
                  <div className="mt-1 text-sm text-[color:var(--muted)]">Ask Booky Assistant for recommendations or checkout help.</div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: "easeOut" }}
          className="space-y-4 xl:sticky xl:top-28 xl:self-start"
        >
          <div className="glass-panel rounded-[2.2rem] p-6">
            <div className="relative z-[1]">
              <div className="section-kicker">Purchase panel</div>
              <div className="mt-3 text-5xl font-black text-[color:var(--text)]">
                {Number(book.selling_price).toFixed(2)}
                <span className="ml-2 text-lg font-semibold text-[color:var(--muted)]">EGP</span>
              </div>

              <div className="mt-4">
                <Badge tone={stock > 0 ? "green" : "red"}>
                  {stock > 0 ? `${stock} copies available` : "Currently unavailable"}
                </Badge>
              </div>

              <div className="mt-5 space-y-3">
                <Input
                  label="Quantity"
                  type="number"
                  min={1}
                  max={stock || undefined}
                  value={qty}
                  onChange={(event) => {
                    const value = Number(event.target.value);
                    const safe = Number.isNaN(value) ? 1 : value;
                    const clamped = stock > 0 ? Math.max(1, Math.min(stock, safe)) : 1;
                    setQty(clamped);
                  }}
                />

                <div className="rounded-[1.4rem] border border-[color:var(--stroke)] bg-white/45 p-4 text-sm text-[color:var(--muted)] dark:bg-white/5">
                  Replenishment threshold: <span className="font-bold text-[color:var(--text)]">{book.threshold}</span>
                </div>

                <Button className="w-full" onClick={addToCart} disabled={stock <= 0 || qtyInvalid}>
                  <ShoppingBag className="h-4 w-4" />
                  Add to cart
                </Button>

                {qtyInvalid && <div className="text-sm font-semibold text-red-600 dark:text-red-300">Quantity cannot exceed stock.</div>}
                {msg && <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">{msg}</div>}
                {err && <div className="text-sm font-semibold text-red-600 dark:text-red-300">{err}</div>}
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-[2rem] p-5">
            <div className="relative z-[1]">
              <div className="section-kicker">Before checkout</div>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-[color:var(--muted)]">
                <li>Card checkout is validated on the client before the order is placed.</li>
                <li>Cash on Delivery stays available if you prefer a simpler payment step.</li>
                <li>Order history and cancellation remain available after purchase.</li>
              </ul>
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
