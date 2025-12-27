import { Routes, Route } from "react-router-dom";
/* Layouts */
import MainLayout from "./components/ui/MainLayout";

/* Public Pages */
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";
import PageNotFound from "./pages/PageNotFound";
import Products from "./pages/ProductsCard";

/* Context Providers */
import { DataProvider } from "./context/DataContext";
import { FilterProvider } from "./context/FilterContext";
import ErrorBoundary from "./components/ErrorBoundary";

/* Admin Layout & Pages */
import Layout from "./components/Layout";
import Overview from "./pages/Overview";
import SalesAnalytics from "./pages/SalesAnalytics";
import Orders from "./pages/Orders";
import Returns from "./pages/Returns";

import AdminProducts from "./pages/Products";

import Revenue from "./pages/Revenue";
import Customers from "./pages/Customers";
import Reports from "./pages/Reports";


/* Layouts */
// import AdminLayout from "./admin/AdminLayout"; // If you have a separate layout

/* User Dashboard */
import UserDashboard from "./dashboards/UserDashboard";

import { CartProvider } from "./context/CartContext.jsx";

function App() {
  return (
    <Routes>

      {/* ===== PUBLIC ROUTES WITH NAVBAR + FOOTER ===== */}
      <Route element={
        <DataProvider>
          <CartProvider>
            <MainLayout />
          </CartProvider>
        </DataProvider>
      }>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard" element={<UserDashboard />} /> {/* User Dashboard Route */}
        <Route path="/productscard" element={<Products />} />
      </Route>


      {/* <Route path="/adminlayout" element={<AdminLayout />} /> */}

      {/* ===== AUTH ROUTES (NO NAVBAR) ===== */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/reset" element={<ResetPassword />} />

      {/* ===== ADMIN ROUTES ===== */}
      <Route path="/admin/*" element={
        <ErrorBoundary>
          <DataProvider>
            <FilterProvider>
              <Layout>
                <Routes>
                  <Route index element={<Overview />} />
                  <Route path="analytics" element={<SalesAnalytics />} />
                  <Route path="revenue" element={<Revenue />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="returns" element={<Returns />} />
                  <Route path="customers" element={<Customers />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="settings" element={<div>Settings Page (Coming Soon)</div>} />
                </Routes>
              </Layout>
            </FilterProvider>
          </DataProvider>
        </ErrorBoundary>
      } />

    </Routes>
  );
}

export default App;
