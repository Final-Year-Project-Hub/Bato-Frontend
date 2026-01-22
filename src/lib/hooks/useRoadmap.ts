import { useState, useEffect } from "react";
import { getRoadmapById } from "@/lib/api/roadmap";

interface RoadmapDetail {
  id: string;
  userId: string;
  chatSessionId: string;
  title: string;
  goal: string;
  intent: string;
  proficiency: string;
  roadmapData: unknown;
  message: string;
  isSelected: boolean;
  createdAt: string;
  updatedAt: string;
}

export const useRoadmap = (roadmapId: string) => {
  const [roadmap, setRoadmap] = useState<RoadmapDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getRoadmapById(roadmapId);

        if (res.success) {
          setRoadmap(res.data);
        } else {
          setError(res.error || res.message || "Failed to fetch roadmap");
        }
      } catch (err) {
        setError("Error fetching roadmap");
        console.error("Roadmap fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (roadmapId) fetchRoadmap();
  }, [roadmapId]);

  return { roadmap, loading, error };
};
