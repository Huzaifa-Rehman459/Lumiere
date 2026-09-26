import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./components/AdminLayout/AdminLayout";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Products from "./pages/Products/Products";
import Orders from "./pages/Orders/Orders";
import Customers from "./pages/Customers/Customers";
import Categories from "./pages/Categories/Categories";
import Reviews from "./pages/Reviews/Reviews";
import Coupons from "./pages/Coupons/Coupons";
import Analytics from "./pages/Analytics/Analytics";
import Settings from "./pages/Settings/Settings";
import Admins from "./pages/Admins/Admins";
import { useAdmin } from "./context/AdminContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAdmin();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
      <Route index element={<Dashboard />} />
      <Route path="products" element={<Products />} />
      <Route path="orders" element={<Orders />} />
      <Route path="customers" element={<Customers />} />
      <Route path="categories" element={<Categories />} />
      <Route path="reviews" element={<Reviews />} />
      <Route path="coupons" element={<Coupons />} />
      <Route path="analytics" element={<Analytics />} />
      <Route path="settings" element={<Settings />} />
      <Route path="admins" element={<Admins />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}