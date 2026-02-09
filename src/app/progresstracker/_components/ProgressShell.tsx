"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { RoadmapResponse } from "../types";
import ProgressHeader from "./ProgressHeader";
import ProgressSidebar from "./ProgressSidebar";
import { RoadmapNavigationProvider } from "./RoadmapNavigationContext";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://bato-backend-a9x8.onrender.com";

export default function ProgressShell({
  roadmapId,
  children,
}: {
  roadmapId: string;
  children: React.ReactNode;
}) {
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [roadmapData, setRoadmapData] = useState<RoadmapResponse | null>(null);

  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [progressData, setProgressData] = useState<any>(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    console.log("🔍 Progress useEffect triggered with roadmapId:", roadmapId);
    
    if (!roadmapId) {
      console.log("No roadmapId, skipping progress fetch");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const url = `${baseUrl}/api/roadmap/${roadmapId}/progress`;
        console.log("📡 Fetching progress from:", url);

        const res = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          cache: "no-store",
        });

        console.log("📥 Progress response status:", res.status, res.statusText);

        if (!res.ok) {
          const msg = await res.text().catch(() => "");
          throw new Error(`${res.status} ${res.statusText} ${msg}`);
        }

        const json = await res.json();
        console.log("✅ progress tracker", json);
        
        if (!cancelled) {
          setProgressData(json);
          console.log("💾 progress data stored", json);
        }
      } catch (e: any) {
        if (!cancelled) {
          console.error("❌ progress fetch failed:", e?.message || e);
        }
      }
    })();

    return () => {
      console.log("🧹 Progress useEffect cleanup");
      cancelled = true;
    };
  }, [roadmapId]);

  // keep selection in sync when you are on topic page
  useEffect(() => {
    const phaseId = searchParams.get("phaseId");
    const topicId = pathname.split("/topic/")[1]?.split("?")[0];

    if (phaseId) setSelectedModule(phaseId);
    if (topicId) setSelectedLesson(topicId);
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!roadmapId) return;

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const res = await fetch(`${baseUrl}/api/roadmap/${roadmapId}`, {
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
        const rd = json?.roadmapData;

        if (!rd?.phases) throw new Error("roadmapData missing or invalid");
        if (!cancelled) setRoadmapData(rd);
      } catch (e: any) {
        if (!cancelled) setErr(e?.message || "Failed to load roadmap");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [roadmapId]);

  const totalModules = roadmapData?.phases?.length ?? 0;
  const totalLessons =
    roadmapData?.phases?.reduce((sum, p) => sum + (p.topics?.length ?? 0), 0) ??
    0;
  const completionPercentage = progressData?.completionPercentage;

  const handleViewLesson = (phaseId: string, topicId: string) => {
    setSelectedModule(phaseId);
    setSelectedLesson(topicId);

    const goal = roadmapData?.goal ?? "";
    if (!goal) return;

    router.push(
      `/progresstracker/${roadmapId}/topic/${topicId}?phaseId=${encodeURIComponent(
        phaseId,
      )}&goal=${encodeURIComponent(goal)}&roadmapId=${encodeURIComponent(
        roadmapId,
      )}`,
    );
  };

  const handleSelectModule = (moduleId: string | null) => {
    setSelectedModule(moduleId);
    if (moduleId === null) setSelectedLesson(null);
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (err) return <div className="p-6 text-red-500">{err}</div>;
  if (!roadmapData) return <div className="p-6">No roadmap found.</div>;

  return (
    <RoadmapNavigationProvider roadmapData={roadmapData} roadmapId={roadmapId}>
      <div className="h-screen flex flex-col bg-background">
        <ProgressHeader
          title={roadmapData.goal ?? ""}
          totalModules={totalModules}
          totalLessons={totalLessons}
        />

        <div className="flex flex-1 overflow-hidden">
          <ProgressSidebar
            modules={roadmapData.phases}
            selectedModule={selectedModule}
            selectedLesson={selectedLesson}
            onSelectModule={handleSelectModule}
            completionPercentage={completionPercentage}
            onSelectLesson={(lessonId, moduleId) =>
              handleViewLesson(moduleId, lessonId)
            }
          />

          {/* THIS is where each page renders */}
          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
      </div>
    </RoadmapNavigationProvider>
  );
}