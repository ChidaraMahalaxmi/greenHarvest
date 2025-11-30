import { useState } from "react";
import API from "../services/api";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/signup", {
        name,
        email,
        password,
        role,
      });

      alert("Signup successful!");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("Signup failed!");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-green-50 p-6">
      <form
        onSubmit={handleSignup}
        className="bg-white p-10 rounded-xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          Signup
        </h2>

        <input
          type="text"
          placeholder="Enter name"
          className="w-full border p-3 rounded-md mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Enter email"
          className="w-full border p-3 rounded-md mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter password"
          className="w-full border p-3 rounded-md mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* ROLE SELECT — updated */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border p-3 rounded-md mb-6"
        >
          <option value="customer">Customer</option>
          <option value="farmer">Farmer</option>
          <option value="agent">Delivery Agent</option>
        </select>

        <button
          type="submit"
          className="w-full bg-green-700 text-white py-3 rounded-md hover:bg-green-800 transition"
        >
          Signup
        </button>
      </form>
    </div>
  );
}
