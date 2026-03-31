import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar.jsx";
import Sidebar from "./components/layout/Sidebar.jsx";
import ProtectedRoute from "./components/layout/ProtectedRoute.jsx";
import Footer from "./components/layout/Footer.jsx";
import BookyAssistant from "./components/BookyAssistant.jsx";
import ReadingQuiz from "./pages/quizzes/ReadingQuiz.jsx";

import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import Support from "./pages/support/ContactSupport.jsx";
import HowToBuy from "./pages/support/HowToBuy.jsx";
import Shipping from "./pages/support/Shipping.jsx";
import Privacy from "./pages/support/Privacy.jsx";

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
    <div className="relative flex min-h-screen flex-col overflow-x-clip text-[color:var(--text)]">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 grid-fade opacity-60" />
        <div className="ambient-float absolute left-[-5rem] top-20 h-60 w-60 rounded-full bg-[radial-gradient(circle,rgba(199,108,43,0.24),transparent_65%)]" />
        <div className="ambient-float-delayed absolute right-[-6rem] top-56 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(47,113,116,0.24),transparent_65%)]" />
        <div className="ambient-float absolute bottom-[-8rem] left-1/3 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.18),transparent_65%)]" />
      </div>

      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Navigate to="/books" />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/how-to-buy" element={<HowToBuy />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/support" element={<Support />} />

          <Route path="/quizzes" element={<ReadingQuiz />} />

          <Route path="/books" element={<BrowseBooks />} />
          <Route path="/books/:isbn" element={<BookDetails />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<PastOrders />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
            <Route
              path="/admin/*"
              element={
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[290px_1fr]">
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

          <Route
            path="*"
            element={
              <div className="grid min-h-[50vh] place-items-center">
                <div className="glass-panel-strong max-w-xl rounded-[2.4rem] px-8 py-10 text-center">
                  <div className="section-kicker">Page not found</div>
                  <h1 className="mt-3 font-display text-4xl font-semibold text-balance">
                    This chapter is missing from the shelf.
                  </h1>
                  <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                    The page you tried to open does not exist anymore, or the link is pointing somewhere old.
                  </p>
                </div>
              </div>
            }
          />
        </Routes>
        <BookyAssistant />
      </main>

      <Footer />
    </div>
  );
}
