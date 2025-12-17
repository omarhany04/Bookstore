import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { booksApi } from "../../api/books";

export default function BrowseBooks() {
  const [q, setQ] = useState({ title: "", category: "" });
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");

  async function load() {
    setErr("");
    try {
      const data = await booksApi.list({
        title: q.title || undefined,
        category: q.category || undefined
      });
      setRows(data);
    } catch (e) {
      setErr(e.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const categories = ["", "Science", "Art", "Religion", "History", "Geography"];

  return (
    <div className="space-y-6">
      <Card
        title="Browse books"
        right={
          <Button variant="secondary" onClick={load}>
            Refresh
          </Button>
        }
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Input
            label="Search by title"
            value={q.title}
            onChange={(e) => setQ({ ...q, title: e.target.value })}
            placeholder="e.g. Algorithms"
          />

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Category
            </span>

            <select
              className="
                w-full rounded-xl border border-slate-200
                bg-white text-slate-900
                px-3 py-2 text-sm
                dark:border-slate-800
                dark:bg-slate-950
                dark:text-slate-100
              "
              value={q.category}
              onChange={(e) => setQ({ ...q, category: e.target.value })}
            >
              {categories.map((c) => (
                <option
                  key={c}
                  value={c}
                  className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100"
                >
                  {c || "All"}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-end">
            <Button className="w-full" onClick={load}>
              Search
            </Button>
          </div>
        </div>

        {err && <div className="mt-3 text-sm text-red-600">{err}</div>}
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {rows.map((b) => (
          <Link key={b.isbn} to={`/books/${b.isbn}`}>
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 hover:ring-slate-300 dark:bg-slate-900 dark:ring-slate-800 dark:hover:ring-slate-700">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-base font-extrabold">{b.title}</div>

                  <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    ISBN: {b.isbn} • {b.publisher}
                  </div>

                  <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    Authors: {(b.authors || []).join(", ")}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-black">
                    {Number(b.selling_price).toFixed(2)} EGP
                  </div>

                  <div className="mt-2">
                    <Badge tone={b.stock_qty > 0 ? "green" : "red"}>
                      {b.stock_qty > 0 ? `In stock: ${b.stock_qty}` : "Out of stock"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{b.category}</span>
                <span>Threshold: {b.threshold}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
