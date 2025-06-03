// app/context/AuthContext.tsx
"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import api from "@/utils/api";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      api
        .get("/user/profile")
        .then((res: { data: { user: User } }) => setUser(res.data.user))
        .catch(() => logout());
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
    setUser(res.data.user);
    router.push("/");
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    const res = await api.post("/auth/register", {
      username,
      email,
      password,
    });
    localStorage.setItem("token", res.data.token);
    api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
    setUser(res.data.user);
    router.push("/");
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
