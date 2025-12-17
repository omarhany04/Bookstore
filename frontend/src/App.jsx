import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar.jsx";
import Sidebar from "./components/layout/Sidebar.jsx";
import ProtectedRoute from "./components/layout/ProtectedRoute.jsx";

import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";

import BrowseBooks from "./pages/customer/BrowseBooks.jsx";
import BookDetails from "./pages/customer/BookDetails.jsx";
import Cart from "./pages/customer/Cart.jsx";
import Checkout from "./pages/customer/Checkout.jsx";
import PastOrders from "./pages/customer/PastOrders.jsx";
import Profile from "./pages/customer/Profile.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ManageBooks from "./pages/admin/ManageBooks.jsx";
import ReplenishmentOrders from "./pages/admin/ReplenishmentOrders.jsx";
import Reports from "./pages/admin/Reports.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/books" />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Customer */}
          <Route path="/books" element={<BrowseBooks />} />
          <Route path="/books/:isbn" element={<BookDetails />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<PastOrders />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Admin */}
          <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
            <Route
              path="/admin/*"
              element={
                <div className="grid grid-cols-1 gap-6 md:grid-cols-[260px_1fr]">
                  <Sidebar />
                  <div>
                    <Routes>
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="books" element={<ManageBooks />} />
                      <Route path="replenishments" element={<ReplenishmentOrders />} />
                      <Route path="reports" element={<Reports />} />
                      <Route path="*" element={<Navigate to="/admin/dashboard" />} />
                    </Routes>
                  </div>
                </div>
              }
            />
          </Route>

          <Route path="*" element={<div className="p-6">Not found</div>} />
        </Routes>
      </div>
    </div>
  );
}
