import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Auth pages
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";

// Feature pages
import Dashboard from "./features/dashboard/pages/Dashboard";
import Products from "./features/products/pages/Products";
import AddProduct from "./features/products/components/AddProduct";
import UpdateProduct from "./features/products/components/UpdateProduct";
import ProductDetails from "./features/products/components/ProductDetails";
import Category from "./features/category/pages/Category";
import CreateCategory from "./features/category/components/CreateCategory";
import UpdateCategory from "./features/category/components/UpdateCategory";
import Orders from "./features/orders/pages/Orders";
import Customers from "./features/customers/pages/Customers";

// Route guards
import AdminRoute from "./components/protected-route/AdminRoute";
import AuthRoute from "./components/protected-route/AuthRoute";

// Layout
import DashboardLayout from "./layouts/DashboardLayout";

// Common components
import ErrorBoundary from "./components/error-boundary/ErrorBoundary";
import NotFound from "./components/not-found/NotFound";

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* ─── Public / Auth routes ─────────────────────────────── */}
          <Route element={<AuthRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* ─── Protected + layout shell ─────────────────────────── */}
          <Route element={<AdminRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/customers" element={<Customers />} />

              <Route path="/products" element={<Products />} />
              <Route path="/products/create" element={<AddProduct />} />
              <Route path="/products/edit/:id" element={<UpdateProduct />} />
              <Route path="/products/:id" element={<ProductDetails />} />

              <Route path="/categories" element={<Category />} />
              <Route path="/categories/create" element={<CreateCategory />} />
              <Route path="/categories/edit/:id" element={<UpdateCategory />} />
            </Route>
          </Route>

          {/* ─── 404 ─────────────────────────────────────────────── */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
