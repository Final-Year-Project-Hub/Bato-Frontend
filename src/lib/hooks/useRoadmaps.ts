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

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/roadmap`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      const response = await res.json();

      if (!res.ok) {
        setError(response?.message || "Failed to fetch roadmaps");
        return;
      }

      //  NORMALIZE ONCE
      const list: Roadmap[] =
        Array.isArray(response) ? response :
        Array.isArray(response.data) ? response.data :
        Array.isArray(response.data?.roadmaps) ? response.data.roadmaps :
        [];

      setRoadmaps(list);
    } catch (err) {
      console.error("Error fetching roadmaps:", err);
      setError("Failed to fetch roadmaps");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  return { roadmaps, loading, error, refetch: fetchRoadmaps };
};
