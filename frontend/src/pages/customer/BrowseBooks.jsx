import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, LibraryBig, RotateCcw, Search, Sparkles } from "lucide-react";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import BookCover from "../../components/ui/BookCover";
import { booksApi } from "../../api/books";
import { categoriesApi } from "../../api/categories";

const pageSize = 6;
const selectClassName =
  "w-full rounded-[1.3rem] border border-[color:var(--stroke-strong)] bg-white/75 px-4 py-3 text-sm text-[color:var(--text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] outline-none transition-all duration-300 focus:-translate-y-px focus:border-[color:var(--accent)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(199,108,43,0.12)] dark:bg-white/5 dark:shadow-none dark:focus:bg-white/10";

export default function BrowseBooks() {
  const [q, setQ] = useState({ search: "", category_id: "" });
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(Number(total || 0) / pageSize)), [total]);
  const featuredCategories = useMemo(() => categories.slice(0, 6), [categories]);
  const activeCategory = useMemo(
    () => categories.find((category) => String(category.category_id) === String(q.category_id)),
    [categories, q.category_id]
  );

  async function load(currentQ = q, currentPage = page) {
    setErr("");
    try {
      const data = await booksApi.listPaged({
        search: currentQ.search?.trim() || undefined,
        category_id: currentQ.category_id === "" ? undefined : currentQ.category_id,
        page: currentPage,
        pageSize,
      });

      setRows(data.items || []);
      setTotal(Number(data.total || 0));

      const newTotalPages = Math.max(1, Math.ceil(Number(data.total || 0) / pageSize));
      if (currentPage > newTotalPages) setPage(1);
    } catch (error) {
      setErr(error.message);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const cats = await categoriesApi.list();
        setCategories(cats);
      } catch (error) {
        console.error(error);
      }
      load({ search: "", category_id: "" }, 1);
    })();
  }, []);

  useEffect(() => {
    setPage(1);
    const timeoutId = window.setTimeout(() => load(q, 1), 250);
    return () => window.clearTimeout(timeoutId);
  }, [q.search, q.category_id]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => load(q, page), 120);
    return () => window.clearTimeout(timeoutId);
  }, [page]);

  const pageButtons = useMemo(() => {
    const maxButtons = 5;
    if (totalPages <= maxButtons) return Array.from({ length: totalPages }, (_, index) => index + 1);

    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + maxButtons - 1);
    start = Math.max(1, end - (maxButtons - 1));

    const buttons = [];
    for (let index = start; index <= end; index += 1) buttons.push(index);
    return buttons;
  }, [page, totalPages]);

  return (
    <div className="space-y-8">
      <section className="glass-panel-strong rounded-[2.5rem] px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_30%)]" />
        <div className="relative z-[1] grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="section-kicker">Curated discovery</div>
            <h1 className="mt-3 font-display text-5xl font-semibold leading-[0.95] text-balance sm:text-6xl">
              A bookstore interface that feels editorial, not mechanical.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[color:var(--muted)] sm:text-base">
              Browse by title, author, publisher, or category, then move into detail pages, checkout, and order flows built to feel polished from the first click.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="stat-chip">
                <LibraryBig className="h-4 w-4 text-[color:var(--accent-deep)]" />
                {new Intl.NumberFormat().format(total || 0)} titles
              </div>
              <div className="stat-chip">
                <Sparkles className="h-4 w-4 text-[color:var(--teal)]" />
                {categories.length || 0} categories
              </div>
              <div className="stat-chip">
                <Search className="h-4 w-4 text-[color:var(--accent)]" />
                Search by ISBN, author, or publisher
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="glass-panel rounded-[2rem] p-5">
              <div className="section-kicker">Storefront feel</div>
              <div className="mt-3 font-display text-2xl font-semibold">Designed for browsing</div>
              <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                Rich cards and stronger hierarchy make the catalog feel curated instead of purely technical.
              </p>
            </div>
            <div className="glass-panel rounded-[2rem] p-5">
              <div className="section-kicker">Smart support</div>
              <div className="mt-3 font-display text-2xl font-semibold">Booky Assistant ready</div>
              <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                Ask for recommendations, checkout help, or admin guidance without leaving the storefront.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="glass-panel rounded-[2.25rem] p-6 sm:p-7">
        <div className="relative z-[1] space-y-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="section-kicker">Search and filter</div>
              <div className="mt-2 font-display text-3xl font-semibold">Find the right title faster</div>
              <p className="mt-2 text-sm text-[color:var(--muted)]">
                Search globally, narrow by category, or tap a quick category chip below.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => load(q, page)}>
                Refresh
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setQ({ search: "", category_id: "" });
                  setPage(1);
                }}
              >
                <RotateCcw className="h-4 w-4" />
                Clear filters
              </Button>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_280px_auto] lg:items-end">
            <div>
              <label className="block">
                <span className="mb-2 block text-[0.72rem] font-extrabold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                  Global search
                </span>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={q.search}
                    onChange={(event) => setQ({ ...q, search: event.target.value })}
                    placeholder="Search by title, ISBN, author, or publisher"
                    className="w-full rounded-[1.3rem] border border-[color:var(--stroke-strong)] bg-white/75 py-3 pl-12 pr-4 text-sm text-[color:var(--text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] outline-none transition-all duration-300 placeholder:text-slate-400 focus:-translate-y-px focus:border-[color:var(--accent)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(199,108,43,0.12)] dark:bg-white/5 dark:shadow-none dark:placeholder:text-slate-500 dark:focus:bg-white/10"
                  />
                </div>
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-[0.72rem] font-extrabold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                Category
              </span>
              <select
                className={selectClassName}
                value={q.category_id}
                onChange={(event) => setQ({ ...q, category_id: event.target.value })}
              >
                <option value="">All categories</option>
                {categories.map((category) => (
                  <option key={category.category_id} value={String(category.category_id)}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <Button
              className="min-w-[140px]"
              onClick={() => {
                setPage(1);
                load(q, 1);
              }}
            >
              Search now
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {featuredCategories.map((category) => (
              <button
                key={category.category_id}
                type="button"
                onClick={() => {
                  setQ((current) => ({
                    ...current,
                    category_id:
                      String(current.category_id) === String(category.category_id)
                        ? ""
                        : String(category.category_id),
                  }));
                  setPage(1);
                }}
                className={`rounded-full border px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] transition-all duration-300 ${
                  String(q.category_id) === String(category.category_id)
                    ? "border-transparent bg-[linear-gradient(135deg,var(--accent),var(--accent-deep))] text-white shadow-[0_16px_30px_rgba(199,108,43,0.22)]"
                    : "border-[color:var(--stroke-strong)] bg-white/50 text-[color:var(--muted)] hover:-translate-y-0.5 hover:bg-white/80 hover:text-[color:var(--text)] dark:bg-white/5 dark:hover:bg-white/10"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-[color:var(--muted)]">
            <span>
              Showing <span className="font-bold text-[color:var(--text)]">{rows.length}</span> books on this page
            </span>
            {activeCategory && <Badge tone="slate">{activeCategory.name}</Badge>}
            {q.search.trim() && <Badge tone="yellow">Search: {q.search.trim()}</Badge>}
          </div>
        </div>
      </section>

      {err && (
        <div className="rounded-[1.6rem] border border-red-200/70 bg-red-100/80 px-5 py-4 text-sm font-semibold text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200">
          {err}
        </div>
      )}

      {rows.length === 0 ? (
        <section className="glass-panel rounded-[2.2rem] px-6 py-12 text-center">
          <div className="section-kicker">No match found</div>
          <div className="mt-3 font-display text-4xl font-semibold">Try a broader search or switch category.</div>
          <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
            We could not find books for the current filter combination, but the catalog is still ready for a wider search.
          </p>
        </section>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
          className="grid gap-5 xl:grid-cols-2"
        >
          {rows.map((book) => (
            <motion.div
              key={book.isbn}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
              }}
            >
              <Link to={`/books/${book.isbn}`} className="block h-full">
                <article className="glass-panel group h-full rounded-[2rem] p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(58,39,18,0.16)]">
                  <div className="relative z-[1] grid gap-4 sm:grid-cols-[190px_1fr]">
                    <BookCover
                      title={book.title}
                      subtitle={(book.authors || []).slice(0, 2).join(", ") || book.publisher}
                      category={book.category}
                      className="h-60 sm:h-full"
                    />

                    <div className="flex flex-col">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone={Number(book.stock_qty) > 0 ? "green" : "red"}>
                          {Number(book.stock_qty) > 0 ? `In stock: ${book.stock_qty}` : "Out of stock"}
                        </Badge>
                        <Badge tone="slate">ISBN {book.isbn}</Badge>
                      </div>

                      <h2 className="mt-4 font-display text-[2rem] font-semibold leading-tight text-[color:var(--text)]">
                        {book.title}
                      </h2>
                      <div className="mt-2 text-sm font-semibold text-[color:var(--text)]">
                        {(book.authors || []).join(", ") || "Author details unavailable"}
                      </div>
                      <div className="mt-1 text-sm text-[color:var(--muted)]">{book.publisher}</div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-[1.35rem] border border-[color:var(--stroke)] bg-white/45 px-4 py-3 dark:bg-white/5">
                          <div className="text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                            Category
                          </div>
                          <div className="mt-2 text-sm font-semibold text-[color:var(--text)]">{book.category}</div>
                        </div>
                        <div className="rounded-[1.35rem] border border-[color:var(--stroke)] bg-white/45 px-4 py-3 dark:bg-white/5">
                          <div className="text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                            Reorder point
                          </div>
                          <div className="mt-2 text-sm font-semibold text-[color:var(--text)]">{book.threshold}</div>
                        </div>
                      </div>

                      <div className="mt-auto flex items-end justify-between gap-4 pt-6">
                        <div>
                          <div className="text-[0.72rem] font-extrabold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                            Price
                          </div>
                          <div className="mt-2 text-3xl font-black text-[color:var(--text)]">
                            {Number(book.selling_price).toFixed(2)}
                            <span className="ml-2 text-base font-semibold text-[color:var(--muted)]">EGP</span>
                          </div>
                        </div>

                        <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--stroke-strong)] bg-white/60 px-4 py-2 text-sm font-semibold text-[color:var(--text)] transition-transform duration-300 group-hover:translate-x-1 dark:bg-white/5">
                          Open details
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}

      <section className="glass-panel rounded-[1.85rem] p-4 sm:p-5">
        <div className="relative z-[1] flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-[color:var(--muted)]">
            Page <span className="font-black text-[color:var(--text)]">{page}</span> of{" "}
            <span className="font-black text-[color:var(--text)]">{totalPages}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page <= 1}>
              Previous
            </Button>

            <div className="flex flex-wrap items-center gap-2">
              {pageButtons.map((buttonPage) => (
                <button
                  key={buttonPage}
                  type="button"
                  onClick={() => setPage(buttonPage)}
                  className={`min-w-[2.8rem] rounded-full px-4 py-2 text-sm font-bold transition-all duration-300 ${
                    buttonPage === page
                      ? "bg-[linear-gradient(135deg,var(--accent),var(--accent-deep))] text-white shadow-[0_14px_28px_rgba(199,108,43,0.24)]"
                      : "border border-[color:var(--stroke-strong)] bg-white/55 text-[color:var(--muted)] hover:bg-white/80 hover:text-[color:var(--text)] dark:bg-white/5 dark:hover:bg-white/10"
                  }`}
                >
                  {buttonPage}
                </button>
              ))}
            </div>

            <Button
              variant="secondary"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
