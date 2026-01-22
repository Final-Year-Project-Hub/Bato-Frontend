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
  const [roadmaps, setRoadmaps] = useState<Roadmap[] | null>(null);
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
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to fetch roadmaps");
        return;
      }

      // backend returns array directly
      setRoadmaps(data);
    } catch (err) {
      setError("Error fetching roadmaps");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  return { roadmaps, loading, error, refetch: fetchRoadmaps };
};
