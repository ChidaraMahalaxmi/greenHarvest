import { useEffect, useState } from "react";
import API from "../services/api";
import { useCart } from "../context/cartContext";


export default function Products() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();


  useEffect(() => {
    API.get("/products")
      .then((res) => {
        console.log("Products fetched:", res.data);

        // Backend returns { count, products: [...] }
        if (Array.isArray(res.data.products)) {
          setProducts(res.data.products);
        } else {
          console.error("Unexpected backend format:", res.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Available Products</h1>

      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {products.map((p) => (
            <div key={p._id} className="bg-white rounded-xl shadow-md border hover:shadow-xl transition p-5 cursor-pointer"
     onClick={() => window.location.href = `/products/${p._id}`}>
    
    {p.image ? (
      <img
        src={p.image}
        alt={p.name}
        className="w-full h-40 object-cover rounded-md"
      />
    ) : (
      <div className="w-full h-40 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
        No Image
      </div>
    )}

    <h2 className="text-xl font-bold mt-3">{p.name}</h2>
    <p className="text-gray-600">{p.category}</p>

    <p className="text-sm text-gray-500 mt-1">Qty: {p.quantity}</p>

    <p className="text-green-700 font-bold text-lg mt-2">₹{p.price}</p>

    <button
  className="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 w-full"
  onClick={() => addToCart(p)}
>
  Add to Cart
</button>

</div>


          ))}
        </div>
      )}
    </div>
    
  );
}
