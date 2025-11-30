import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

export default function FarmerDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    lowStock: 0,
    outStock: 0,
    orders: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await API.get("/farmer/products");
      const products = res.data.products || [];

      setStats({
        total: products.length,
        lowStock: products.filter(p => p.quantity < 10 && p.quantity > 0).length,
        outStock: products.filter(p => p.quantity === 0).length,
        orders: 0, // we will fix after adding orders API
      });
    } catch (err) {
      console.error(err);
      alert("Failed to load farmer data");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-green-800 mb-6">Farmer Dashboard</h1>

      {/* ACTION BUTTONS */}
      <div className="flex gap-6 mb-10">
        <Link to="/add-product" className="px-6 py-3 shadow bg-green-600 text-white rounded-lg">
          ➕ Add Product
        </Link>

        <Link to="/my-products" className="px-6 py-3 shadow bg-blue-600 text-white rounded-lg">
          📦 Manage Products
        </Link>

        <Link to="/farmer-orders" className="px-6 py-3 shadow bg-yellow-500 text-white rounded-lg">
          🧾 View Orders
        </Link>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="p-6 bg-green-100 rounded-xl shadow">
          <h2 className="text-xl font-semibold">Total Products</h2>
          <p className="text-3xl mt-2">{stats.total}</p>
        </div>

        <div className="p-6 bg-red-100 rounded-xl shadow">
          <h2 className="text-xl font-semibold">Low Stock</h2>
          <p className="text-3xl mt-2">{stats.lowStock}</p>
        </div>

        <div className="p-6 bg-gray-200 rounded-xl shadow">
          <h2 className="text-xl font-semibold">Out of Stock</h2>
          <p className="text-3xl mt-2">{stats.outStock}</p>
        </div>

        <div className="p-6 bg-blue-100 rounded-xl shadow">
          <h2 className="text-xl font-semibold">Orders</h2>
          <p className="text-3xl mt-2">{stats.orders}</p>
        </div>

      </div>
    </div>
  );
}
