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
        setPrev(await reportsApi.previousMonthSales(token));
        setTopC(await reportsApi.topCustomers(token));
        setTopB(await reportsApi.topBooks(token));
      } catch (e) {
        setErr(e.message);
      }
    })();
  }, []);

  async function fetchDay() {
    setErr("");
    try {
      setDaySales(await reportsApi.salesByDay(token, day));
    } catch (e) {
      setErr(e.message);
    }
  }

  async function fetchReplCount() {
    setErr("");
    try {
      setReplCount(await reportsApi.replenishmentCount(token, isbn));
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div className="space-y-6">
      {err && <div className="text-sm text-red-600">{err}</div>}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card title="Sales (previous month)">
          <div className="text-3xl font-black">{prev ? Number(prev.total_sales).toFixed(2) : "—"} EGP</div>
        </Card>

        <Card title="Sales (certain day)">
          <div className="space-y-2">
            <Input label="Date (YYYY-MM-DD)" value={day} onChange={(e)=>setDay(e.target.value)} />
            <Button variant="secondary" onClick={fetchDay}>Get</Button>
            <div className="text-lg font-black">{daySales ? Number(daySales.total_sales).toFixed(2) : "—"} EGP</div>
          </div>
        </Card>

        <Card title="Book replenishments count">
          <div className="space-y-2">
            <Input label="ISBN" value={isbn} onChange={(e)=>setIsbn(e.target.value)} />
            <Button variant="secondary" onClick={fetchReplCount}>Get</Button>
            <div className="text-lg font-black">{replCount ? replCount.times_ordered : "—"}</div>
          </div>
        </Card>
      </div>

      <Card title="Top 5 customers (last 3 months)">
        <Table
          keyField="user_id"
          columns={[
            { key: "username", header: "Customer" },
            { key: "total_spent", header: "Total spent", render: r => Number(r.total_spent).toFixed(2) }
          ]}
          rows={topC}
        />
      </Card>

      <Card title="Top 10 selling books (last 3 months)">
        <Table
          keyField="isbn"
          columns={[
            { key: "book_name_snapshot", header: "Book" },
            { key: "isbn", header: "ISBN" },
            { key: "total_sold", header: "Copies sold" }
          ]}
          rows={topB}
        />
      </Card>
    </div>
  );
}
