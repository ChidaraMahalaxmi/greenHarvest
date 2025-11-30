// src/pages/AddProduct.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    quantity: "",
    imageUrl: "",
    imageFile: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const nav = useNavigate();

  const handleFile = (e) => {
    const file = e.target.files[0];
    setForm((f) => ({ ...f, imageFile: file }));
  };

  const toBase64 = (file) => new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let image = form.imageUrl || "";

      if (!image && form.imageFile) {
        image = await toBase64(form.imageFile);
      }

      const payload = {
        name: form.name,
        category: form.category,
        description: form.description,
        price: Number(form.price),
        quantity: Number(form.quantity),
        image,
      };

      await API.post("/products", payload);
      alert("Product added");
      nav("/my-products");
    } catch (err) {
      console.error(err);
      alert("Add product failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      <form onSubmit={submit} className="space-y-4 bg-white p-6 rounded shadow">
        <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
          placeholder="Product name" className="w-full border p-2 rounded" required />

        <input value={form.category} onChange={e => setForm({...form, category: e.target.value})}
          placeholder="Category" className="w-full border p-2 rounded" required />

        <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
          placeholder="Description" className="w-full border p-2 rounded" rows={4} />

        <div className="grid grid-cols-2 gap-3">
          <input value={form.price} onChange={e => setForm({...form, price: e.target.value})}
            placeholder="Price" type="number" className="border p-2 rounded" required />
          <input value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})}
            placeholder="Quantity" type="number" className="border p-2 rounded" required />
        </div>

        <div>
          <label className="block text-sm font-medium">Image URL (optional)</label>
          <input value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})}
            placeholder="https://..." className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Or choose file (optional)</label>
          <input type="file" accept="image/*" onChange={handleFile} />
        </div>

        <div className="flex gap-3">
          <button disabled={submitting} className="px-4 py-2 bg-green-700 text-white rounded">
            {submitting ? "Adding..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
