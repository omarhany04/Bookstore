import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { booksApi } from "../../api/books";
import { categoriesApi } from "../../api/categories";

export default function BrowseBooks() {
  // Requirement: One search bar for ISBN, Title, Author, and Publisher
  const [q, setQ] = useState({ 
    search: "", 
    category_id: "" 
  });
  
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [categories, setCategories] = useState([]);

  // Pagination
  const pageSize = 4;
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(Number(total || 0) / pageSize));
  }, [total]);

  // Load function using the consolidated search term
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
    } catch (e) {
      setErr(e.message);
    }
  }

  // Initial load
  useEffect(() => {
    (async () => {
      try {
        const cats = await categoriesApi.list();
        setCategories(cats);
      } catch (e) {
        console.error(e);
      }
      load({ search: "", category_id: "" }, 1);
    })();
  }, []);

  // Live searching: triggers when user types or changes category
  useEffect(() => {
    setPage(1);
    const t = setTimeout(() => {
      load(q, 1);
    }, 300);
    return () => clearTimeout(t);
  }, [q.search, q.category_id]);

  // Page change handler
  useEffect(() => {
    const t = setTimeout(() => {
      load(q, page);
    }, 150);
    return () => clearTimeout(t);
  }, [page]);

  const pageButtons = useMemo(() => {
    const maxBtns = 5;
    const tp = totalPages;
    if (tp <= maxBtns) return Array.from({ length: tp }, (_, i) => i + 1);
    let start = Math.max(1, page - 2);
    let end = Math.min(tp, start + maxBtns - 1);
    start = Math.max(1, end - (maxBtns - 1));
    const arr = [];
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
  }, [page, totalPages]);

  return (
    <div className="space-y-6">
      <Card
        title="Browse Books"
        right={
          <Button variant="secondary" type="button" onClick={() => load(q, page)}>
            Refresh
          </Button>
        }
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          {/* THE SINGLE SEARCH BAR */}
          <div className="flex-1">
            <Input
              label="Global Search"
              value={q.search}
              onChange={(e) => setQ({ ...q, search: e.target.value })}
              placeholder="Search by Title, ISBN, Author, or Publisher..."
            />
          </div>

          <div className="w-full md:w-64">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Category
              </span>
              <select
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm
                           dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                value={q.category_id}
                onChange={(e) => setQ({ ...q, category_id: e.target.value })}
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.category_id} value={String(c.category_id)}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex items-end">
            <Button
              type="button"
              className="w-full h-[42px] px-8"
              onClick={() => {
                setPage(1);
                load(q, 1);
              }}
            >
              Search
            </Button>
          </div>
        </div>

        {err && <div className="mt-3 text-sm text-red-600">{err}</div>}
      </Card>

      {/* Books list */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {rows.map((b) => (
          <Link key={b.isbn} to={`/books/${b.isbn}`}>
            <div
              className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 hover:ring-slate-300
                         dark:bg-slate-900 dark:ring-slate-800 dark:hover:ring-slate-700 h-full flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-base font-extrabold text-slate-900 dark:text-white">{b.title}</div>
                  <div className="text-xs text-slate-500">ISBN: {b.isbn}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    <span className="font-semibold">By:</span> {(b.authors || []).join(", ")}
                  </div>
                  <div className="text-xs italic text-slate-500">
                    {b.publisher}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-black text-slate-900 dark:text-white">
                    {Number(b.selling_price).toFixed(2)} EGP
                  </div>
                  <div className="mt-2">
                    <Badge tone={b.stock_qty > 0 ? "green" : "red"}>
                      {b.stock_qty > 0 ? `In stock: ${b.stock_qty}` : "Out of stock"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* THRESHOLD RESTORED HERE */}
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2">
                <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">{b.category}</span>
                <span className="font-medium">Threshold: <span className="font-bold">{b.threshold}</span></span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-2 flex flex-col items-center justify-center gap-3">
        <div className="text-sm text-slate-500 dark:text-slate-300">
          Page <span className="font-bold text-slate-900 dark:text-white">{page}</span> of{" "}
          <span className="font-bold text-slate-900 dark:text-white">{totalPages}</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="secondary"
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            ← Prev
          </Button>

          <div className="flex items-center gap-1 rounded-2xl bg-white p-1 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
            {pageButtons.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  p === page
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <Button
            variant="secondary"
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Next →
          </Button>
        </div>
      </div>
    </div>
  );
}