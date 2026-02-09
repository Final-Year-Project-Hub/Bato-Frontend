"use client";

import { useEffect, useRef, useState } from "react";
import ProgressHeader from "./ProgressHeader";
import ProgressSidebar from "./ProgressSidebar";
import ModuleContent from "./ModuleContent";
import { RoadmapResponse } from "../types";
import { useRouter } from "next/navigation";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://bato-backend-a9x8.onrender.com";

export default function ProgressPage({ roadmapId }: { roadmapId: string }) {
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [roadmapData, setRoadmanData] = useState<RoadmapResponse | null>(null);
  const streamControllerRef = useRef<AbortController | null>(null);

  const router = useRouter();
  let cancelled = false;

  const handleViewLesson = (phaseId: string, topicId: string) => {
    setSelectedModule(phaseId);
    setSelectedLesson(topicId);

    const goal = roadmapData?.goal ?? "";
    if (!goal) {
      console.warn("Goal missing, cannot open lesson page");
      return;
    }

    router.push(
      `/progresstracker/${roadmapId}/topic/${topicId}?phaseId=${encodeURIComponent(
        phaseId,
      )}&goal=${encodeURIComponent(roadmapData?.goal ?? "")}&roadmapId=${encodeURIComponent(roadmapId)}`,
    );
  };



  // const [roadmapPata] = useState<RoadmapProgress>(SAMPLE_ROADMAP);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  const handleSelectModule = (moduleId: string | null) => {
    setSelectedModule(moduleId);
    console.log("selected module", moduleId);
    if (moduleId === null) {
      setSelectedLesson(null);
    }
  };

  const totalModules = roadmapData?.phases.length ?? 0;
  const totalLessons =
    roadmapData?.phases?.reduce((sum, phase) => sum + phase.topics.length, 0) ??
    0;
  if (!roadmapData) return null; // or a loader

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden ">
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          {selectedModule === null ? (
            // SHOW ALL MODULES
            <div>
              {/* <h2 className="text-2xl font-semibold text-white p-6 sticky top-0 bg-background z-10 border-b border-white/10">
                All Modules
              </h2> */}
              {roadmapData.phases.map((module, index) => (
                <ModuleContent
                  key={module.id}
                  module={module}
                  moduleIndex={index}
                  selectedLessonId={selectedLesson}
                  onViewLesson={(topicId) =>
                    handleViewLesson(module.id, topicId)
                  }
                />
              ))}
            </div>
          ) : (
            // SHOW ONLY SELECTED MODULE
            <>
              {roadmapData.phases
                .filter((m) => m.id === selectedModule)
                .map((module) => {
                  const actualIndex = roadmapData.phases.findIndex(
                    (m) => m.id === selectedModule,
                  );
                  return (
                    <ModuleContent
                      key={module.id}
                      module={module}
                      moduleIndex={actualIndex}
                      selectedLessonId={selectedLesson}
                      onViewLesson={(topicId) =>
                        handleViewLesson(module.id, topicId)
                      }
                    />
                  );
                })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
