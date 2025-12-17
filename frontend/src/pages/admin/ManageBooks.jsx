import { useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import { booksApi } from "../../api/books";
import { apiFetch } from "../../api/client";
import { useAuth } from "../../context/AuthContext";

export default function ManageBooks() {
  const { token } = useAuth();
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState("");

  const [form, setForm] = useState({
    isbn: "", title: "", publication_year: 2020, selling_price: 100,
    category: "Science", publisher_id: 1, stock_qty: 10, threshold: 5,
    authorsText: ""
  });

  async function load() {
    setErr("");
    try {
      const data = await booksApi.list();
      setRows(data);
    } catch (e) {
      setErr(e.message);
    }
  }

  useEffect(() => { load(); }, []);

  async function addBook() {
    setErr("");
    try {
      const authors = form.authorsText.split(",").map(s => s.trim()).filter(Boolean);
      await apiFetch("/admin/books", {
        method: "POST",
        token,
        body: {
          isbn: form.isbn,
          title: form.title,
          publication_year: Number(form.publication_year),
          selling_price: Number(form.selling_price),
          category: form.category,
          publisher_id: Number(form.publisher_id),
          stock_qty: Number(form.stock_qty),
          threshold: Number(form.threshold),
          authors
        }
      });
      setOpen(false);
      await load();
    } catch (e) {
      setErr(e.message);
    }
  }

  const columns = [
    { key: "title", header: "Title" },
    { key: "isbn", header: "ISBN" },
    { key: "category", header: "Category" },
    { key: "publisher", header: "Publisher" },
    { key: "stock_qty", header: "Stock" },
    { key: "threshold", header: "Threshold" },
  ];

  return (
    <div className="space-y-6">
      <Card
        title="Manage Books"
        right={<Button onClick={() => setOpen(true)}>Add book</Button>}
      >
        {err && <div className="mb-3 text-sm text-red-600">{err}</div>}
        <Table columns={columns} rows={rows} keyField="isbn" />
        <div className="mt-3 text-xs text-slate-500">
          Tip: When checkout reduces stock below threshold, a replenishment order is auto-created by trigger.
        </div>
      </Card>

      <Modal open={open} title="Add New Book" onClose={() => setOpen(false)}>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Input label="ISBN" value={form.isbn} onChange={(e)=>setForm({...form, isbn:e.target.value})} />
          <Input label="Title" value={form.title} onChange={(e)=>setForm({...form, title:e.target.value})} />
          <Input label="Publication year" type="number" value={form.publication_year} onChange={(e)=>setForm({...form, publication_year:e.target.value})} />
          <Input label="Price" type="number" value={form.selling_price} onChange={(e)=>setForm({...form, selling_price:e.target.value})} />
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Category</span>
            <select className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              value={form.category} onChange={(e)=>setForm({...form, category:e.target.value})}>
              {["Science","Art","Religion","History","Geography"].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <Input label="Publisher ID" type="number" value={form.publisher_id} onChange={(e)=>setForm({...form, publisher_id:e.target.value})} />
          <Input label="Stock quantity" type="number" value={form.stock_qty} onChange={(e)=>setForm({...form, stock_qty:e.target.value})} />
          <Input label="Threshold" type="number" value={form.threshold} onChange={(e)=>setForm({...form, threshold:e.target.value})} />
          <div className="md:col-span-2">
            <Input label="Authors (comma-separated)" value={form.authorsText} onChange={(e)=>setForm({...form, authorsText:e.target.value})} placeholder="e.g. Author One, Author Two" />
          </div>
        </div>
        <div className="mt-4">
          <Button className="w-full" onClick={addBook}>Create</Button>
        </div>
      </Modal>
    </div>
  );
}
