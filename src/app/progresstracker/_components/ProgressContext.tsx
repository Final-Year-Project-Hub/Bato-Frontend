"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type ProgressData = {
  completionPercentage: number;
  completedPhaseIds: string[];
  completedTopicIds: string[];
};

type ProgressContextValue = {
  progress: ProgressData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;

  // helpers for UI checks
  isTopicCompleted: (topicId: string) => boolean;
  isPhaseCompleted: (phaseId: string) => boolean;

  // optional optimistic updater
  markTopicCompletedOptimistic: (topicId: string, phaseId?: string) => void;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://bato-backend-a9x8.onrender.com";

export function ProgressProvider({
  roadmapId,
  children,
  pollMs = 15000, // 15s
}: {
  roadmapId: string;
  children: React.ReactNode;
  pollMs?: number;
}) {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const inFlightRef = useRef(false);

  const refresh = async () => {
    if (!roadmapId) return;
    if (inFlightRef.current) return;

    inFlightRef.current = true;
    try {
      setError(null);

      const res = await fetch(`${baseUrl}/api/roadmap/${roadmapId}/progress`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(`${res.status} ${res.statusText} ${msg}`);
      }

      const json = await res.json();
      const p = json?.progress ?? {};

      // adapt to your API shape here:
      const next: ProgressData = {
        completionPercentage: Number(json?.completionPercentage ?? 0),
        completedPhaseIds: (p?.completedPhaseIds ?? []).map(String),
        completedTopicIds: (p?.completedTopicIds ?? []).map(String),
      };

      setProgress(next);
    } catch (e: any) {
      setError(e?.message || "Failed to fetch progress");
    } finally {
      setLoading(false);
      inFlightRef.current = false;
    }
  };

  // initial fetch
  useEffect(() => {
    setLoading(true);
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roadmapId]);

  // polling
  useEffect(() => {
    if (!roadmapId) return;

    const id = window.setInterval(() => {
      refresh();
    }, pollMs);

    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roadmapId, pollMs]);

  // refresh when tab becomes active (super useful)
  useEffect(() => {
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roadmapId]);
  
  const isTopicCompleted = (topicId: string) =>
    progress?.completedTopicIds.includes(String(topicId)) ?? false;

  const isPhaseCompleted = (phaseId: string) =>
    progress?.completedPhaseIds.includes(String(phaseId)) ?? false;

  const markTopicCompletedOptimistic = (topicId: string, phaseId?: string) => {
    setProgress((prev) => {
      if (!prev) {
        return {
          completionPercentage: 0,
          completedPhaseIds: phaseId ? [phaseId] : [],
          completedTopicIds: [topicId],
        };
      }

      const completedTopicIds = prev.completedTopicIds.includes(topicId)
        ? prev.completedTopicIds
        : [...prev.completedTopicIds, topicId];

      const completedPhaseIds =
        phaseId && !prev.completedPhaseIds.includes(phaseId)
          ? [...prev.completedPhaseIds, phaseId]
          : prev.completedPhaseIds;

      return {
        ...prev,
        completedTopicIds,
        completedPhaseIds,
      };
    });
  };

  const value = useMemo<ProgressContextValue>(
    () => ({
      progress,
      loading,
      error,
      refresh,
      isTopicCompleted,
      isPhaseCompleted,
      markTopicCompletedOptimistic,
    }),
    [progress, loading, error],
  );

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}
