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

      console.log("🔍 Fetching roadmaps from:", `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/roadmap`);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/roadmap`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("📡 Response status:", res.status);
      console.log("📡 Response ok:", res.ok);

      const response = await res.json();
      console.log("📦 Full API Response:", response);
      console.log("📦 Response.data:", response.data);
      console.log("📦 Response.data type:", typeof response.data);
      console.log("📦 Is array?:", Array.isArray(response.data));

      if (!res.ok) {
        console.error("❌ API Error:", response?.message);
        setError(response?.message || "Failed to fetch roadmaps");
        return;
      }

      // Check different possible response structures
      const roadmapData = response.data || response.roadmaps || response || [];
      console.log("✅ Setting roadmaps:", roadmapData);
      console.log("✅ Roadmap count:", roadmapData.length);

      setRoadmaps(roadmapData);
    } catch (err: unknown) {
      console.error("💥 Error fetching roadmaps:", err);
      setError("Failed to fetch roadmaps");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  // Debug logging whenever roadmaps change
  useEffect(() => {
    console.log(" Roadmaps state updated:", roadmaps);
  }, [roadmaps]);

  return { roadmaps, loading, error, refetch: fetchRoadmaps };
};