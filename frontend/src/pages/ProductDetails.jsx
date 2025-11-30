import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    API.get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data.product || res.data);
      })
      .catch((err) => console.error("Error:", err));
  }, [id]);

  if (!product) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-10">
      <div className="flex gap-10">

        {/* Product Image */}
        <div className="w-1/3">
          <img
            src={product.image || ""}
            className="rounded-xl shadow-lg w-full object-cover"
            alt={product.name}
          />
        </div>

        {/* Product Info */}
        <div className="w-2/3">
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <p className="text-gray-600 mt-2">{product.category}</p>

          <p className="mt-5 text-lg">{product.description}</p>

          <p className="text-green-700 text-3xl font-bold mt-5">₹{product.price}</p>

          <button className="mt-8 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
