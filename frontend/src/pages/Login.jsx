import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/authContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();   // ✅ FROM CONTEXT

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", { email, password });

      console.log("LOGIN RESPONSE:", res.data);

      const { token, user } = res.data;

      // ✅ UPDATE GLOBAL AUTH CONTEXT
      login({ token, user });

      // redirect based on role
      if (user.role === "customer") navigate("/customer-dashboard");
      else if (user.role === "farmer") navigate("/farmer-dashboard");
      else if (user.role === "agent") navigate("/agent-dashboard");
      else navigate("/");

    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-green-50 p-6">
      <form
        onSubmit={handleLogin}
        className="bg-white p-10 rounded-xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          Login
        </h2>

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
          className="w-full border p-3 rounded-md mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-green-700 text-white py-3 rounded-md hover:bg-green-800 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
