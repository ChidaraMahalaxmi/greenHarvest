// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/authContext";

import Home from "./Home";
import Navbar from "./components/Navbar";

// Public pages
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Farmers from "./pages/Farmers";
import Crops from "./pages/Crops";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Dashboards
import CustomerDashboard from "./pages/CustomerDashboard";
import FarmerDashboard from "./pages/FarmerDashboard";
import AgentDashboard from "./pages/AgentDashboard";

// Farmer Tools
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import MyProducts from "./pages/MyProducts";
import FarmerOrders from "./pages/FarmerOrders";

// ----------------------------
// ⭐ Role Protected Route
// ----------------------------
const RoleProtectedRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!user) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  console.log("API URL:", import.meta.env.VITE_API_URL);

  return (
    <Router>
      <Navbar />

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/farmers" element={<Farmers />} />
        <Route path="/crops" element={<Crops />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* CUSTOMER ONLY */}
        <Route
          path="/customer-dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["customer"]}>
              <CustomerDashboard />
            </RoleProtectedRoute>
          }
        />

        {/* FARMER ONLY */}
        <Route
          path="/farmer-dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["farmer"]}>
              <FarmerDashboard />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/add-product"
          element={
            <RoleProtectedRoute allowedRoles={["farmer"]}>
              <AddProduct />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/edit-product/:id"
          element={
            <RoleProtectedRoute allowedRoles={["farmer"]}>
              <EditProduct />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/my-products"
          element={
            <RoleProtectedRoute allowedRoles={["farmer"]}>
              <MyProducts />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/farmer-orders"
          element={
            <RoleProtectedRoute allowedRoles={["farmer"]}>
              <FarmerOrders />
            </RoleProtectedRoute>
          }
        />

        {/* AGENT ONLY */}
        <Route
          path="/agent-dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["agent"]}>
              <AgentDashboard />
            </RoleProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
