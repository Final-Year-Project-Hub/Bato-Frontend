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

      //  FIX: Your backend returns array directly, NOT { data: [...] }
      let roadmapsData: Roadmap[] = [];
      
      if (Array.isArray(response)) {
        // Backend returns array directly
        roadmapsData = response;
      } else if (response.data && Array.isArray(response.data)) {
        // Fallback: if it returns { data: [...] }
        roadmapsData = response.data;
      } else {
        console.error("Unexpected response format:", response);
        setError("Unexpected response format from server");
        return;
      }

      setRoadmaps(roadmapsData);
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