"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: string;
  email: string;
  name?: string | null;
  role?: string;
  image?: string | null;
} | null;

type AuthContextType = {
  user: User;
  loading: boolean;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

const BACKEND = process.env.NEXT_PUBLIC_API_BASE_URL!;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      setLoading(true);

      // OPTION 1: Try to get cached user ID from localStorage (faster)
      const cachedUserId = localStorage.getItem('userId');
      
      if (cachedUserId) {
        console.log(" Using cached user ID:", cachedUserId);
        
        // Directly fetch full user data
        const userRes = await fetch(`${BACKEND}/api/user/getUserById/${cachedUserId}`, {
          credentials: "include",
        });

        if (userRes.ok) {
          const userData = await userRes.json();
          const finalUserData = userData.data || userData.user || userData;
          
          console.log(" User data loaded (from cache):", finalUserData);
          console.log(" Image URL:", finalUserData?.image);
          
          setUser(finalUserData);
          return;
        } else {
          // If cached ID failed, clear it and fall through to OPTION 2
          console.log(" Cached user ID invalid, fetching from profile...");
          localStorage.removeItem('userId');
        }
      }

      // OPTION 2: Get user ID from /auth/profile first
      console.log(" Getting user from:", `${BACKEND}/auth/profile`);
      
      const profileRes = await fetch(`${BACKEND}/auth/profile`, {
        credentials: "include",
      });

      if (!profileRes.ok) {
        console.log(" Profile fetch failed:", profileRes.status);
        localStorage.removeItem('userId'); // Clear cache on auth failure
        setUser(null);
        return;
      }

      const profileData = await profileRes.json();
      const userId = profileData.user?.id || profileData.data?.id || profileData.id;

      if (!userId) {
        console.log(" No user ID found");
        setUser(null);
        return;
      }

      // Cache the user ID for next time
      localStorage.setItem('userId', userId);
      console.log(" Cached user ID:", userId);

      // Fetch full user data with image
      console.log(" Fetching full user data...");
      const userRes = await fetch(`${BACKEND}/api/user/getUserById/${userId}`, {
        credentials: "include",
      });

      if (!userRes.ok) {
        console.log(" getUserById failed:", userRes.status);
        setUser(null);
        return;
      }

      const userData = await userRes.json();
      const finalUserData = userData.data || userData.user || userData;

      console.log(" User data loaded:", finalUserData);
      console.log(" Image URL:", finalUserData?.image);

      setUser(finalUserData);
    } catch (error) {
      console.error(" Auth refresh error:", error);
      localStorage.removeItem('userId'); // Clear cache on error
      setUser(null);
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