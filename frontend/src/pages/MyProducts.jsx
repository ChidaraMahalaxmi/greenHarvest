import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function MyProducts() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await API.get("/farmer/products");
      setProducts(res.data.products);
    } catch (err) {
      alert("Failed to load products");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await API.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert("Failed to delete");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6 text-green-700">My Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p._id} className="border p-4 rounded-lg shadow-lg">

            {p.image && (
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-40 object-cover rounded mb-3"
              />
            )}

            <h2 className="text-xl font-bold">{p.name}</h2>
            <p className="text-gray-600">{p.category}</p>
            <p>Qty: {p.quantity}</p>
            <p className="text-green-700 font-bold">₹{p.price}</p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => navigate(`/edit-product/${p._id}`)}
                className="bg-blue-600 text-white px-4 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(p._id)}
                className="bg-red-500 text-white px-4 py-1 rounded"
              >
                Delete
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
