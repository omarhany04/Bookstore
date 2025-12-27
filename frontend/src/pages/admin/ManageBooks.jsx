import { useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import { booksApi } from "../../api/books";
import { apiFetch } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { categoriesApi } from "../../api/categories";

export default function ManageBooks() {
  const { token } = useAuth();
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState("");
  const [categories, setCategories] = useState([]);
  
  // Track if we are editing an existing book
  const [editingIsbn, setEditingIsbn] = useState(null);

  const initialForm = {
    isbn: "",
    title: "",
    publication_year: 2025,
    selling_price: 100,
    category_id: "",
    publisher_id: 1,
    stock_qty: 10,
    threshold: 5,
    authorsText: "",
  };

  const [form, setForm] = useState(initialForm);

  async function load() {
    try {
      const data = await booksApi.list();
      setRows(data);
    } catch (e) {
      setErr(e.message);
    }
  }

  async function loadCategories() {
    try {
      const cats = await categoriesApi.list();
      setCategories(cats);
      if (!form.category_id && cats.length) {
        setForm((f) => ({ ...f, category_id: String(cats[0].category_id) }));
      }
    } catch (e) { console.error(e); }
  }

  useEffect(() => {
    loadCategories();
    load();
  }, []);

  // Open modal for a new book
  const handleAddNew = () => {
    setEditingIsbn(null);
    setForm(initialForm);
    setOpen(true);
  };

  // Open modal for editing
  const handleEdit = (book) => {
    setEditingIsbn(book.isbn);
    setForm({
      isbn: book.isbn,
      title: book.title,
      publication_year: book.publication_year,
      selling_price: book.selling_price,
      category_id: String(book.category_id),
      publisher_id: book.publisher_id || 1,
      stock_qty: book.stock_qty,
      threshold: book.threshold,
      authorsText: (book.authors || []).join(", "),
    });
    setOpen(true);
  };

  async function saveBook() {
    setErr("");
    try {
      const authors = form.authorsText.split(",").map((s) => s.trim()).filter(Boolean);
      const payload = {
        isbn: form.isbn,
        title: form.title,
        publication_year: Number(form.publication_year),
        selling_price: Number(form.selling_price),
        category_id: Number(form.category_id),
        publisher_id: Number(form.publisher_id),
        stock_qty: Number(form.stock_qty),
        threshold: Number(form.threshold),
        authors,
      };

      if (editingIsbn) {
        // CALL UPDATE (PATCH)
        await apiFetch(`/admin/books/${editingIsbn}`, {
          method: "PATCH",
          token,
          body: payload,
        });
      } else {
        // CALL ADD (POST)
        await apiFetch("/admin/books", {
          method: "POST",
          token,
          body: payload,
        });
      }

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
    { key: "stock_qty", header: "Stock" },
    {
      key: "actions",
      header: "Actions",
      render: (book) => (
        <Button variant="secondary" onClick={() => handleEdit(book)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card title="Manage Books" right={<Button onClick={handleAddNew}>Add book</Button>}>
        {err && <div className="mb-3 text-sm text-red-600">{err}</div>}
        <Table columns={columns} rows={rows} keyField="isbn" />
      </Card>

      <Modal open={open} title={editingIsbn ? "Edit Book" : "Add New Book"} onClose={() => setOpen(false)}>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Input 
            label="ISBN" 
            value={form.isbn} 
            disabled={!!editingIsbn} // ISBN usually shouldn't change
            onChange={(e) => setForm({ ...form, isbn: e.target.value })} 
          />
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          {/* ... Keep all other Inputs (price, year, etc.) exactly as you had them ... */}
          
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Category</span>
            <select
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:bg-slate-950"
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            >
              {categories.map((c) => (
                <option key={c.category_id} value={String(c.category_id)}>{c.name}</option>
              ))}
            </select>
          </label>
          
          {/* Include Stock Qty Input only if NOT editing, or use the specialized stock update logic */}
          <Input 
            label="Stock quantity" 
            type="number" 
            value={form.stock_qty} 
            onChange={(e) => setForm({ ...form, stock_qty: e.target.value })} 
          />
        </div>

        <div className="mt-4">
          <Button className="w-full" onClick={saveBook}>
            {editingIsbn ? "Update Book" : "Create Book"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}