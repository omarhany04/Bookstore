import { useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Table from "../../components/ui/Table";
import { useAuth } from "../../context/AuthContext";
import { reportsApi } from "../../api/reports";

export default function Reports() {
  const { token } = useAuth();
  const [prev, setPrev] = useState(null);
  const [day, setDay] = useState("");
  const [daySales, setDaySales] = useState(null);
  const [topC, setTopC] = useState([]);
  const [topB, setTopB] = useState([]);
  const [isbn, setIsbn] = useState("");
  const [replCount, setReplCount] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [prevData, topCustomersData, topBooksData] = await Promise.all([
          reportsApi.previousMonthSales(token),
          reportsApi.topCustomers(token),
          reportsApi.topBooks(token),
        ]);
        setPrev(prevData);
        setTopC(topCustomersData);
        setTopB(topBooksData);
      } catch (error) {
        setErr(error.message);
      }
    })();
  }, [token]);

  async function fetchDay() {
    setErr("");
    try {
      setDaySales(await reportsApi.salesByDay(token, day));
    } catch (error) {
      setErr(error.message);
    }
  }

  async function fetchReplCount() {
    setErr("");
    try {
      setReplCount(await reportsApi.replenishmentCount(token, isbn));
    } catch (error) {
      setErr(error.message);
    }
  }

  return (
    <div className="space-y-6">
      <section className="glass-panel-strong rounded-[2.4rem] px-6 py-8 sm:px-8">
        <div className="relative z-[1]">
          <div className="section-kicker">Reporting</div>
          <h1 className="mt-3 font-display text-5xl font-semibold leading-[0.96] text-balance">
            Decision-ready numbers with a more polished reporting surface.
          </h1>
          <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
            Inspect sales, best performers, and replenishment patterns without leaving the admin workspace.
          </p>
        </div>
      </section>

      {err && (
        <div className="rounded-[1.6rem] border border-red-200/70 bg-red-100/80 px-5 py-4 text-sm font-semibold text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200">
          {err}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="glass-panel rounded-[2rem] p-5">
          <div className="relative z-[1] text-[0.72rem] font-extrabold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            Previous month sales
          </div>
          <div className="mt-3 font-display text-4xl font-semibold text-[color:var(--text)]">
            {prev ? Number(prev.total_sales).toFixed(2) : "—"} EGP
          </div>
        </div>
        <div className="glass-panel rounded-[2rem] p-5">
          <div className="relative z-[1] text-[0.72rem] font-extrabold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            Sales on a chosen day
          </div>
          <div className="mt-4 space-y-3">
            <Input label="Date (YYYY-MM-DD)" value={day} onChange={(event) => setDay(event.target.value)} />
            <Button variant="secondary" onClick={fetchDay}>
              Get value
            </Button>
            <div className="text-lg font-black text-[color:var(--text)]">
              {daySales ? Number(daySales.total_sales).toFixed(2) : "—"} EGP
            </div>
          </div>
        </div>
        <div className="glass-panel rounded-[2rem] p-5">
          <div className="relative z-[1] text-[0.72rem] font-extrabold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            Replenishment count by ISBN
          </div>
          <div className="mt-4 space-y-3">
            <Input label="ISBN" value={isbn} onChange={(event) => setIsbn(event.target.value)} />
            <Button variant="secondary" onClick={fetchReplCount}>
              Get value
            </Button>
            <div className="text-lg font-black text-[color:var(--text)]">{replCount ? replCount.times_ordered : "—"}</div>
          </div>
        </div>
      </div>

      <Card title="Top 5 customers" subtitle="Highest spenders across the last 3 months.">
        <Table
          keyField="user_id"
          emptyMessage="No customer report data yet."
          columns={[
            { key: "username", header: "Customer" },
            { key: "total_spent", header: "Total spent", render: (row) => Number(row.total_spent).toFixed(2) },
          ]}
          rows={topC}
        />
      </Card>

      <Card title="Top 10 selling books" subtitle="Best-selling titles across the last 3 months.">
        <Table
          keyField="isbn"
          emptyMessage="No book report data yet."
          columns={[
            { key: "book_name_snapshot", header: "Book" },
            { key: "isbn", header: "ISBN" },
            { key: "total_sold", header: "Copies sold" },
          ]}
          rows={topB}
        />
      </Card>
    </div>
  );
}
