import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Trash2 } from "lucide-react";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import BookCover from "../../components/ui/BookCover";
import Card from "../../components/ui/Card";
import { cartApi } from "../../api/cart";
import { useAuth } from "../../context/AuthContext";

export default function Cart() {
  const { token } = useAuth();
  const [cart, setCart] = useState(null);
  const [err, setErr] = useState("");
  const [busyIsbn, setBusyIsbn] = useState(null);
  const navigate = useNavigate();

  async function load() {
    setErr("");
    try {
      const data = await cartApi.get(token);
      setCart(data);
    } catch (error) {
      setErr(error.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function inc(item) {
    if (busyIsbn) return;
    const stock = Number(item.stock_qty);
    const qty = Number(item.qty);
    if (stock <= 0 || qty >= stock) return;

    setBusyIsbn(item.isbn);
    try {
      await cartApi.update(token, item.isbn, qty + 1);
      await load();
    } catch (error) {
      setErr(error.message);
    } finally {
      setBusyIsbn(null);
    }
  }

  async function dec(item) {
    if (busyIsbn) return;
    setBusyIsbn(item.isbn);
    try {
      const qty = Number(item.qty);
      if (qty <= 1) await cartApi.remove(token, item.isbn);
      else await cartApi.update(token, item.isbn, qty - 1);
      await load();
    } catch (error) {
      setErr(error.message);
    } finally {
      setBusyIsbn(null);
    }
  }

  async function clear() {
    try {
      await cartApi.clear(token);
      await load();
    } catch (error) {
      setErr(error.message);
    }
  }

  const totalItems = useMemo(
    () => (cart?.items || []).reduce((sum, item) => sum + Number(item.qty || 0), 0),
    [cart]
  );

  if (!cart) {
    return (
      <div className="grid min-h-[40vh] place-items-center">
        <div className="glass-panel rounded-[2rem] px-6 py-5 text-center">
          <div className="section-kicker">Loading</div>
          <div className="mt-2 font-display text-2xl font-semibold">Rebuilding your cart summary</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="glass-panel-strong rounded-[2.4rem] px-6 py-8 sm:px-8">
        <div className="relative z-[1] flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="section-kicker">Cart overview</div>
            <h1 className="mt-3 font-display text-5xl font-semibold leading-[0.96] text-balance">
              Review every title before checkout.
            </h1>
            <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
              Adjust quantities, validate stock visually, and move into checkout with a cleaner purchasing summary.
            </p>
          </div>

          {cart.items.length > 0 && (
            <Button variant="danger" onClick={clear}>
              <Trash2 className="h-4 w-4" />
              Clear cart
            </Button>
          )}
        </div>
      </section>

      {err && (
        <div className="rounded-[1.6rem] border border-red-200/70 bg-red-100/80 px-5 py-4 text-sm font-semibold text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200">
          {err}
        </div>
      )}

      {cart.items.length === 0 ? (
        <section className="glass-panel rounded-[2.2rem] px-6 py-12 text-center">
          <div className="section-kicker">Cart is empty</div>
          <div className="mt-3 font-display text-4xl font-semibold">Add a few titles and they will appear here.</div>
          <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
            The new cart layout is ready for your next selection from the Booky catalog.
          </p>
          <div className="mt-6">
            <Link to="/books">
              <Button>
                <ShoppingBag className="h-4 w-4" />
                Browse books
              </Button>
            </Link>
          </div>
        </section>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.15fr_360px]">
          <div className="space-y-4">
            {cart.items.map((item) => {
              const isBusy = busyIsbn === item.isbn;
              const stock = Number(item.stock_qty);
              const qty = Number(item.qty);
              const atMax = stock > 0 && qty >= stock;

              return (
                <article key={item.isbn} className="glass-panel rounded-[2rem] p-4 sm:p-5">
                  <div className="relative z-[1] grid gap-4 sm:grid-cols-[180px_1fr]">
                    <BookCover
                      title={item.title}
                      subtitle={`ISBN ${item.isbn}`}
                      category="Cart item"
                      imageUrl={item.cover_image_url}
                      className="h-56 sm:h-full"
                    />

                    <div className="flex flex-col">
                      <div className="flex flex-wrap gap-2">
                        <Badge tone={stock > 0 ? "green" : "red"}>
                          {stock > 0 ? `Stock: ${stock}` : "Out of stock"}
                        </Badge>
                        <Badge tone="slate">Line total {Number(item.line_total).toFixed(2)} EGP</Badge>
                      </div>

                      <div className="mt-4 font-display text-[2rem] font-semibold text-[color:var(--text)]">
                        {item.title}
                      </div>
                      <div className="mt-2 text-sm text-[color:var(--muted)]">Unit price {Number(item.selling_price).toFixed(2)} EGP</div>

                      <div className="mt-6 flex flex-wrap items-center gap-3">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--stroke-strong)] bg-white/60 px-3 py-2 dark:bg-white/5">
                          <Button variant="secondary" className="px-3 py-2" onClick={() => dec(item)} disabled={isBusy}>
                            -
                          </Button>
                          <span className="min-w-[2rem] text-center text-sm font-black text-[color:var(--text)]">{qty}</span>
                          <Button variant="secondary" className="px-3 py-2" onClick={() => inc(item)} disabled={isBusy || atMax}>
                            +
                          </Button>
                        </div>
                        <div className="text-sm text-[color:var(--muted)]">
                          {atMax ? "You reached current stock." : "Adjust quantity anytime before checkout."}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="space-y-4 xl:sticky xl:top-28 xl:self-start">
            <Card title="Order summary" subtitle="A cleaner summary before you move into payment.">
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-[1.4rem] border border-[color:var(--stroke)] bg-white/45 px-4 py-4 dark:bg-white/5">
                  <span className="text-sm text-[color:var(--muted)]">Items</span>
                  <span className="text-lg font-black text-[color:var(--text)]">{totalItems}</span>
                </div>
                <div className="flex items-center justify-between rounded-[1.4rem] border border-[color:var(--stroke)] bg-white/45 px-4 py-4 dark:bg-white/5">
                  <span className="text-sm text-[color:var(--muted)]">Subtotal</span>
                  <span className="text-2xl font-black text-[color:var(--text)]">
                    {Number(cart.total).toFixed(2)} EGP
                  </span>
                </div>
                <Button className="w-full" onClick={() => navigate("/checkout")}>
                  Proceed to checkout
                </Button>
              </div>
            </Card>

            <div className="glass-panel rounded-[2rem] p-5">
              <div className="relative z-[1] text-sm leading-7 text-[color:var(--muted)]">
                Quantity changes stay validated against stock, so the cart reflects what the inventory can currently fulfill.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
