"use client";

import { useEffect, useState } from "react";

export interface Roadmap {
  id: string;
  title: string;
  goal: string;
  proficiency: string;
  createdAt: string;
  isSelected: boolean;
}

export const useRoadmaps = () => {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoadmaps = async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ BACK TO ORIGINAL: Direct fetch (not apiFetch)
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/roadmap`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const response = await res.json();

      if (!res.ok) {
        setError(response.error || response.message || "Failed to fetch roadmaps");
        return;
      }

      // ✅ FIX: Extract data array from response
      setRoadmaps(response.data || []);
    } catch (err: unknown) {
      console.error("Error fetching roadmaps:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch roadmaps";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  return { roadmaps, loading, error, refetch: fetchRoadmaps };
};