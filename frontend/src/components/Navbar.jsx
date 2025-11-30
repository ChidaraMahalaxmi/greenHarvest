// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between px-6 py-3 shadow bg-white">
      <Link to="/" className="text-2xl font-bold text-green-700">GreenHarvest</Link>

      <div className="flex gap-6 text-lg">
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/farmers">Farmers</Link>
        <Link to="/crops">Crops</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </div>

      <div className="flex gap-4 items-center">
        {!user ? (
          <>
            <Link to="/signup" className="px-4 py-2 bg-green-600 text-white rounded">Signup</Link>
            <Link to="/login" className="px-4 py-2 bg-gray-100 text-black rounded">Login</Link>
          </>
        ) : (
          <>
            {user.role === "farmer" && (
              <>
                <Link to="/farmer-dashboard" className="px-3 py-1 bg-green-100 rounded">My Dashboard</Link>
                <Link to="/my-products" className="px-3 py-1 bg-blue-100 rounded">My Products</Link>
                <Link to="/farmer-orders" className="px-3 py-1 bg-yellow-100 rounded">Orders</Link>
              </>
            )}

            {user.role === "customer" && (
              <Link to="/customer-dashboard" className="px-3 py-1 bg-green-100 rounded">Customer Dashboard</Link>
            )}

            {user.role === "agent" && (
              <Link to="/agent-dashboard" className="px-3 py-1 bg-green-100 rounded">Agent Dashboard</Link>
            )}

            <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
