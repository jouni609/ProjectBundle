import React, { createContext, useState, useEffect, useContext } from "react";
import type { User, AuthContextType } from "../../api/types";
import { authApi } from "../../api/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const saveAuth = (tokenValue: string | null) => {
    if (tokenValue) {
      localStorage.setItem("authToken", tokenValue);
    } else {
      localStorage.removeItem("authToken");
    }
    setToken(tokenValue);
  };

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    if (res?.token) {
      saveAuth(res.token);
      return true;
    }
    return false;
  };

  const register = async (email: string, password: string) => {
    const res = await authApi.register(email, password);
    if (res?.token) {
      saveAuth(res.token);
      return true;
    }
    return false;
  };

  const logout = () => {
    saveAuth(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export default AuthContext;
