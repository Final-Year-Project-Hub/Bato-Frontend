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
          credentials: "include", // ✅ THIS is critical
        }
      );

      if (!res.ok) {
        const err = await res.json();
        setError(err?.message || "Unauthorized");
        return;
      }

      const data = await res.json();
      setRoadmaps(data.data ?? data);
    } catch (err) {
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
