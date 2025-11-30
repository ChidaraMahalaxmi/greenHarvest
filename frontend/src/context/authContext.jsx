// src/context/authContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import API from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // try to restore user from localStorage on load
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) { /* ignore */ }
    }
    setLoading(false);
  }, []);

  const login = ({ token, user }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // convenience to refresh user from /api/auth/me if you have endpoint
  const refresh = async () => {
    try {
      const res = await API.get("/auth/me");
      setUser(res.data.user || res.data);
      localStorage.setItem("user", JSON.stringify(res.data.user || res.data));
    } catch (err) {
      console.warn("refresh failed", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
