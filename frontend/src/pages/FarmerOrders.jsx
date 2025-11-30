import { useEffect, useState } from "react";
import API from "../services/api";

export default function FarmerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/farmer/orders");
      setOrders(res.data.orders);
      setLoading(false);
    } catch (err) {
      alert("Failed to load orders");
      console.error(err);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await API.patch(`/orders/farmer/${orderId}/status`, { status });
      fetchOrders();
    } catch (err) {
      alert("Failed to update order status");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p className="p-10">Loading orders...</p>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-green-700 mb-6">Farmer Orders</h1>

      {orders.map((o) => (
        <div key={o._id} className="border p-4 rounded-lg shadow mb-4">
          <p><strong>Order:</strong> {o._id}</p>
          <p><strong>Product:</strong> {o.product?.name || "—"}</p>
          <p><strong>Qty:</strong> {o.quantity}</p>
          <p><strong>Status:</strong> {o.status}</p>

          <div className="mt-3 flex gap-3">

            {o.status === "placed" && (
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => updateStatus(o._id, "packed")}
              >
                Mark Packed
              </button>
            )}

            {o.status === "packed" && (
              <button
                className="px-4 py-2 bg-green-600 text-white rounded"
                onClick={() => updateStatus(o._id, "shipped")}
              >
                Mark Shipped
              </button>
            )}

          </div>
        </div>
      ))}
    </div>
  );
}
