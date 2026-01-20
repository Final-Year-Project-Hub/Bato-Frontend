"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: string;
  email: string;
  name?: string | null;
} | null;

type AuthContextType = {
  user: User;
  loading: boolean;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

const BACKEND = process.env.NEXT_PUBLIC_API_BASE_URL!; // backend url

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${BACKEND}/auth/profile`, {
        credentials: "include", // sends backend cookies
      });

      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json();

      // adjust if your response is nested
      setUser(data?.data ?? data?.user ?? data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
