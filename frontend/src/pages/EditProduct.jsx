// src/pages/EditProduct.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

export default function EditProduct() {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get(`/products/${id}`);
        setForm({
          name: res.data.name || "",
          category: res.data.category || "",
          description: res.data.description || "",
          price: res.data.price || 0,
          quantity: res.data.quantity || 0,
          image: res.data.image || "",
        });
      } catch (err) {
        alert("Failed to load product");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/products/${id}`, form);
      alert("Updated");
      nav("/my-products");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  if (loading || !form) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <form onSubmit={submit} className="space-y-4 bg-white p-6 rounded shadow">
        <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        <input value={form.category} onChange={e => setForm({...form, category: e.target.value})} required />
        <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} />
        <div className="grid grid-cols-2 gap-3">
          <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
          <input type="number" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} required />
        </div>
        <input value={form.image} onChange={e => setForm({...form, image: e.target.value})} placeholder="image url or base64" />
        <div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
        </div>
      </form>
    </div>
  );
}
