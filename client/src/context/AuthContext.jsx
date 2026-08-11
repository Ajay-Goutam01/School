import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem("school_admin_token") || null,
  );
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const verifyAdminToken = async () => {
      if (!token) {
        setAdmin(null);
        setAuthLoading(false);
        return;
      }
      try {
        const res = await api.get("/auth/me");
        if (res.data && res.data.success) {
          setAdmin(res.data.data);
        } else {
          logout();
        }
      } catch (err) {
        console.error("Token verification failed:", err.message);
        logout();
      } finally {
        setAuthLoading(false);
      }
    };

    verifyAdminToken();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    if (res.data && res.data.success) {
      const { token: newToken, ...adminData } = res.data.data;
      localStorage.setItem("school_admin_token", newToken);
      setToken(newToken);
      setAdmin(adminData);
      return res.data;
    } else {
      throw new Error(res.data.message || "Login failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("school_admin_token");
    setToken(null);
    setAdmin(null);
  };

  const refreshAdmin = async () => {
    const res = await api.get("/auth/me");
    if (res.data && res.data.success) {
      setAdmin(res.data.data);
    }
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: !!token && !!admin,
        authLoading,
        login,
        refreshAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
