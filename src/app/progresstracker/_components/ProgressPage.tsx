"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ModuleContent from "./ModuleContent";
import type { RoadmapResponse } from "../types";

export default function ProgressPage({ roadmapId }: { roadmapId: string }) {
  const router = useRouter();

  const [roadmapData, setRoadmapData] = useState<RoadmapResponse | null>(null);

  const [selectedModule, setSelectedModule] = useState<string | null>(null); // null = show all
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  const showAllModules = selectedModule === null;

  const handleBackToAll = () => {
    setSelectedModule(null);
    setSelectedLesson(null);
  };

  const handleViewLesson = (phaseId: string, topicId: string) => {
    if (!roadmapData?.goal) {
      console.warn("Roadmap data/goal missing, cannot open lesson page");
      return;
    }

    setSelectedModule(phaseId);
    setSelectedLesson(topicId);

    router.push(
      `/progresstracker/${roadmapId}/topic/${topicId}?phaseId=${encodeURIComponent(
        phaseId,
      )}&goal=${encodeURIComponent(roadmapData.goal)}&roadmapId=${encodeURIComponent(
        roadmapId,
      )}`,
    );
  };

  if (!roadmapData) return null; // replace with your loader

  return (
    <div className="h-screen flex flex-col">
      
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto bg-red-500">
          {/* Top bar */}
          <div className="sticky top-0 z-20 bg-background border-b border-white/10">
            {showAllModules ? (
              <h2 className="text-2xl font-semibold text-white p-6">
                All Modules
              </h2>
            ) : (
              <div className="p-4">
                <button
                  className="text-sm px-3 py-2 rounded border border-white/20"
                  onClick={handleBackToAll}
                >
                  ← All Modules
                </button>
              </div>
            )}
          </div>

          {/* Content */}
          {showAllModules ? (
            roadmapData.phases.map((module, index) => (
              <ModuleContent
                key={module.id}
                module={module}
                moduleIndex={index}
                selectedLessonId={selectedLesson}
                onViewLesson={(topicId) => handleViewLesson(module.id, topicId)}
              />
            ))
          ) : (
            (() => {
              const idx = roadmapData.phases.findIndex((m) => m.id === selectedModule);
              const module = roadmapData.phases[idx];

              if (!module) return null;

              return (
                <ModuleContent
                  key={module.id}
                  module={module}
                  moduleIndex={idx}
                  selectedLessonId={selectedLesson}
                  onViewLesson={(topicId) => handleViewLesson(module.id, topicId)}
                />
              );
            })()
          )}
        </div>
      </div>
    </div>
  );
}
