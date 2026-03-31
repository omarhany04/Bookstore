import { useEffect, useMemo, useState } from "react";
import { ImagePlus, RefreshCcw } from "lucide-react";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import BookCover from "../../components/ui/BookCover";
import { booksApi } from "../../api/books";
import { apiFetch } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { categoriesApi } from "../../api/categories";
import { publishersApi } from "../../api/publishers";

const selectClassName =
  "w-full rounded-[1.3rem] border border-[color:var(--stroke-strong)] bg-white/75 px-4 py-3 text-sm text-[color:var(--text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] outline-none transition-all duration-300 focus:-translate-y-px focus:border-[color:var(--accent)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(199,108,43,0.12)] dark:bg-white/5 dark:shadow-none dark:focus:bg-white/10";

function buildOpenLibraryCoverUrl(isbn) {
  const normalizedIsbn = String(isbn || "").replace(/[^0-9Xx]/g, "").toUpperCase();
  if (!normalizedIsbn) return "";
  return `https://covers.openlibrary.org/b/isbn/${normalizedIsbn}-L.jpg?default=false`;
}

function createInitialForm(categories = [], publishers = []) {
  return {
    isbn: "",
    title: "",
    cover_image_url: "",
    publication_year: new Date().getFullYear(),
    selling_price: 100,
    category_id: categories[0] ? String(categories[0].category_id) : "",
    publisher_id: publishers[0] ? String(publishers[0].publisher_id) : "",
    stock_qty: 10,
    threshold: 5,
    authorsText: "",
  };
}

function parseApiError(message) {
  try {
    const parsed = JSON.parse(message);
    if (Array.isArray(parsed) && parsed[0]?.message) {
      return parsed[0].message;
    }
  } catch {
    return message;
  }

  return message;
}

export default function ManageBooks() {
  const { token } = useAuth();
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState("");
  const [categories, setCategories] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [editingIsbn, setEditingIsbn] = useState(null);
  const [form, setForm] = useState(createInitialForm());

  const previewImageUrl = useMemo(
    () => form.cover_image_url.trim() || buildOpenLibraryCoverUrl(form.isbn),
    [form.cover_image_url, form.isbn]
  );

  async function loadBooks() {
    try {
      const data = await booksApi.list();
      setRows(Array.isArray(data) ? data : []);
    } catch (error) {
      setErr(error.message);
    }
  }

  async function loadReferenceData() {
    try {
      const [categoryRows, publisherRows] = await Promise.all([
        categoriesApi.list(),
        publishersApi.list(),
      ]);

      setCategories(categoryRows);
      setPublishers(publisherRows);

      setForm((current) => ({
        ...current,
        category_id:
          current.category_id || (categoryRows[0] ? String(categoryRows[0].category_id) : ""),
        publisher_id:
          current.publisher_id || (publisherRows[0] ? String(publisherRows[0].publisher_id) : ""),
      }));
    } catch (error) {
      console.error("Failed to load book form reference data", error);
    }
  }

  useEffect(() => {
    loadReferenceData();
    loadBooks();
  }, []);

  function handleAddNew() {
    setErr("");
    setEditingIsbn(null);
    setForm(createInitialForm(categories, publishers));
    setOpen(true);
  }

  function handleEdit(book) {
    setErr("");
    setEditingIsbn(book.isbn);
    setForm({
      isbn: book.isbn,
      title: book.title,
      cover_image_url: book.cover_image_url || "",
      publication_year: book.publication_year,
      selling_price: book.selling_price,
      category_id: String(book.category_id),
      publisher_id: String(book.publisher_id),
      stock_qty: book.stock_qty,
      threshold: book.threshold,
      authorsText: (book.authors || []).join(", "),
    });
    setOpen(true);
  }

  async function saveBook() {
    setErr("");

    if (!form.category_id || !form.publisher_id) {
      setErr("Choose both a category and a publisher before saving.");
      return;
    }

    try {
      const authors = form.authorsText
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);

      const payload = {
        isbn: form.isbn.trim(),
        title: form.title.trim(),
        cover_image_url: form.cover_image_url.trim() || buildOpenLibraryCoverUrl(form.isbn),
        publication_year: Number(form.publication_year),
        selling_price: Number(form.selling_price),
        category_id: Number(form.category_id),
        publisher_id: Number(form.publisher_id),
        stock_qty: Number(form.stock_qty),
        threshold: Number(form.threshold),
        authors,
      };

      if (editingIsbn) {
        await apiFetch(`/admin/books/${editingIsbn}`, {
          method: "PATCH",
          token,
          body: payload,
        });
      } else {
        await apiFetch("/admin/books", {
          method: "POST",
          token,
          body: payload,
        });
      }

      setOpen(false);
      await loadBooks();
    } catch (error) {
      setErr(parseApiError(error.message));
    }
  }

  const columns = [
    {
      key: "cover",
      header: "Cover",
      render: (book) => (
        <BookCover
          title={book.title}
          subtitle={(book.authors || []).slice(0, 2).join(", ") || book.publisher}
          category={book.category}
          imageUrl={book.cover_image_url}
          className="h-28 w-20 rounded-[1.25rem]"
        />
      ),
    },
    {
      key: "title",
      header: "Book",
      render: (book) => (
        <div className="space-y-1">
          <div className="font-semibold text-[color:var(--text)]">{book.title}</div>
          <div className="text-xs text-[color:var(--muted)]">{(book.authors || []).join(", ") || "Author pending"}</div>
        </div>
      ),
    },
    { key: "isbn", header: "ISBN" },
    { key: "category", header: "Category" },
    { key: "publisher", header: "Publisher" },
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
      <Card
        title="Manage Books"
        subtitle="Books now store their cover image URLs in the database, so every change you make here flows straight to the storefront."
        right={<Button onClick={handleAddNew}>Add book</Button>}
      >
        {err && <div className="mb-3 text-sm font-bold text-red-600">{err}</div>}
        <Table columns={columns} rows={rows} keyField="isbn" emptyMessage="No books found in the current catalog." />
      </Card>

      <Modal open={open} title={editingIsbn ? "Edit Book" : "Add New Book"} onClose={() => setOpen(false)}>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[240px_1fr]">
          <BookCover
            title={form.title || "Untitled Book"}
            subtitle={form.authorsText || "Author preview"}
            category={
              categories.find((category) => String(category.category_id) === String(form.category_id))?.name ||
              "Catalog preview"
            }
            imageUrl={previewImageUrl}
            className="h-[22rem] w-full"
          />

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Input
                label="ISBN"
                value={form.isbn}
                disabled={Boolean(editingIsbn)}
                onChange={(event) => setForm((current) => ({ ...current, isbn: event.target.value }))}
              />
              <Input
                label="Title"
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              />
              <Input
                label="Publication Year"
                type="number"
                value={form.publication_year}
                onChange={(event) => setForm((current) => ({ ...current, publication_year: event.target.value }))}
              />
              <Input
                label="Selling Price"
                type="number"
                value={form.selling_price}
                onChange={(event) => setForm((current) => ({ ...current, selling_price: event.target.value }))}
              />

              <label className="block">
                <span className="mb-2 block text-[0.72rem] font-extrabold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                  Category
                </span>
                <select
                  className={selectClassName}
                  value={form.category_id}
                  onChange={(event) => setForm((current) => ({ ...current, category_id: event.target.value }))}
                >
                  {categories.map((category) => (
                    <option key={category.category_id} value={String(category.category_id)}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-[0.72rem] font-extrabold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                  Publisher
                </span>
                <select
                  className={selectClassName}
                  value={form.publisher_id}
                  onChange={(event) => setForm((current) => ({ ...current, publisher_id: event.target.value }))}
                >
                  {publishers.map((publisher) => (
                    <option key={publisher.publisher_id} value={String(publisher.publisher_id)}>
                      {publisher.name}
                    </option>
                  ))}
                </select>
              </label>

              <Input
                label="Stock quantity"
                type="number"
                value={form.stock_qty}
                onChange={(event) => setForm((current) => ({ ...current, stock_qty: event.target.value }))}
              />
              <Input
                label="Threshold"
                type="number"
                value={form.threshold}
                onChange={(event) => setForm((current) => ({ ...current, threshold: event.target.value }))}
              />

              <div className="md:col-span-2">
                <Input
                  label="Authors (comma-separated)"
                  value={form.authorsText}
                  placeholder="Author 1, Author 2"
                  onChange={(event) => setForm((current) => ({ ...current, authorsText: event.target.value }))}
                />
              </div>

              <div className="md:col-span-2 space-y-3 rounded-[1.6rem] border border-[color:var(--stroke)] bg-white/45 p-4 dark:bg-white/5">
                <Input
                  label="Cover image URL"
                  value={form.cover_image_url}
                  placeholder="Paste a direct cover image URL or generate one from ISBN"
                  onChange={(event) => setForm((current) => ({ ...current, cover_image_url: event.target.value }))}
                />

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        cover_image_url: buildOpenLibraryCoverUrl(current.isbn),
                      }))
                    }
                    disabled={!form.isbn.trim()}
                  >
                    <ImagePlus className="h-4 w-4" />
                    Fill from ISBN
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        cover_image_url: "",
                      }))
                    }
                  >
                    <RefreshCcw className="h-4 w-4" />
                    Use generated fallback
                  </Button>
                </div>

                <p className="text-sm leading-6 text-[color:var(--muted)]">
                  Booky can auto-generate Open Library cover URLs from the ISBN. If a real image is unavailable, the storefront falls back to the custom Booky cover art automatically.
                </p>
              </div>
            </div>

            <Button className="w-full" onClick={saveBook}>
              {editingIsbn ? "Update Book" : "Create Book"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
