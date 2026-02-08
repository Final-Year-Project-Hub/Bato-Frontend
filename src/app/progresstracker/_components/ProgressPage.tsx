"use client";

import { useEffect, useState } from "react";
import ProgressHeader from "./ProgressHeader";
import ProgressSidebar from "./ProgressSidebar";
import ModuleContent from "./ModuleContent";
import { RoadmapProgress, RoadmapResponse } from "../types";

/* STATIC SAMPLE DATA */
// const SAMPLE_ROADMAP: RoadmapProgress = {
//   id: "demo",
//   title: "Learning React: From Fundamentals to Full-Stack Applications",
//   totalModules: 7,
//   totalLessons: 42,
//   completedModules: 0,
//   completedLessons: 0,
//   createdAt: "2026-01-28T00:00:00.000Z",
//   updatedAt: "2026-01-28T00:00:00.000Z",
//   modules: [
//     {
//       id: "module-1",
//       title: "React Fundamentals and Core Concepts",
//       completed: false,
//       lessons: [
//         {
//           id: "lesson-1-1",
//           title: "Setting Up Your React Development Environment",
//           completed: false,
//         },
//         {
//           id: "lesson-1-2",
//           title: "Understanding JSX: JavaScript XML",
//           completed: false,
//         },
//         {
//           id: "lesson-1-3",
//           title: "Functional Components and Props",
//           completed: false,
//         },
//         {
//           id: "lesson-1-4",
//           title: "State Management with `useState` Hook",
//           completed: false,
//         },
//         {
//           id: "lesson-1-5",
//           title: "Event Handling in React",
//           completed: false,
//         },
//         {
//           id: "lesson-1-6",
//           title: "Conditional Rendering and List Rendering",
//           completed: false,
//         },
//       ],
//     },
//     {
//       id: "module-2",
//       title: "Component Lifecycle and Side Effects",
//       completed: false,
//       lessons: [
//         {
//           id: "lesson-2-1",
//           title: "The Component Lifecycle Explained",
//           completed: false,
//         },
//         {
//           id: "lesson-2-2",
//           title: "Managing Side Effects with `useEffect` Hook",
//           completed: false,
//         },
//       ],
//     },
//     {
//       id: "module-3",
//       title: "Advanced State Management and Context",
//       completed: false,
//       lessons: [
//         {
//           id: "lesson-3-1",
//           title: "Advanced useState Patterns",
//           completed: false,
//         },
//         {
//           id: "lesson-3-2",
//           title: "Context API for Global State",
//           completed: false,
//         },
//         {
//           id: "lesson-3-3",
//           title: "useReducer Hook",
//           completed: false,
//         },
//       ],
//     },
//     {
//       id: "module-4",
//       title: "React Router and Navigation",
//       completed: false,
//       lessons: [
//         {
//           id: "lesson-4-1",
//           title: "Setting Up React Router",
//           completed: false,
//         },
//         {
//           id: "lesson-4-2",
//           title: "Dynamic Routes and Parameters",
//           completed: false,
//         },
//       ],
//     },
//     {
//       id: "module-5",
//       title: "Forms and User Input",
//       completed: false,
//       lessons: [
//         {
//           id: "lesson-5-1",
//           title: "Controlled Components",
//           completed: false,
//         },
//         { id: "lesson-5-2", title: "Form Validation", completed: false },
//       ],
//     },
//     {
//       id: "module-6",
//       title: "Styling React Applications and UI Libraries",
//       completed: false,
//       lessons: [
//         { id: "lesson-6-1", title: "CSS Modules", completed: false },
//         { id: "lesson-6-2", title: "Styled Components", completed: false },
//         {
//           id: "lesson-6-3",
//           title: "Tailwind CSS with React",
//           completed: false,
//         },
//       ],
//     },
//     {
//       id: "module-7",
//       title: "Testing and Deployment",
//       completed: false,
//       lessons: [
//         {
//           id: "lesson-7-1",
//           title: "Unit Testing with Jest",
//           completed: false,
//         },
//         { id: "lesson-7-2", title: "Integration Testing", completed: false },
//         {
//           id: "lesson-7-3",
//           title: "Deploying React Applications",
//           completed: false,
//         },
//       ],
//     },
//   ],
// };

async function streamLesson({
  phaseNumber,
  topicTitle,
  phaseTitle,
  goal,
  roadmapId,
  signal,
}: {
  phaseNumber: number;
  topicTitle: string;
  phaseTitle: string;
  goal: string;
  roadmapId?: string;
  signal: AbortSignal;
}) {
  let url = `${baseUrl}/api/topic/stream/${phaseNumber}/${encodeURIComponent(
    topicTitle,
  )}?phaseTitle=${encodeURIComponent(phaseTitle)}&goal=${encodeURIComponent(goal)}`;

  if (roadmapId) {
    url += `&roadmapId=${encodeURIComponent(roadmapId)}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "text/event-stream",
    },
    credentials: "include",
    signal,
  });

  if (!response.ok || !response.body) {
    throw new Error("Failed to start lesson stream");
  }

  return response.body;
}

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://bato-backend-a9x8.onrender.com";

export default function ProgressPage({ roadmapId }: { roadmapId: string }) {
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [roadmapData, setRoadmanData] = useState<RoadmapResponse | null>(null);
  let cancelled = false;

  useEffect(() => {
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

        const roadmapData = json?.roadmapData;
        setRoadmanData(roadmapData);
        console.log(roadmapData);

        if (!roadmapData?.phases) {
          console.log("Unexpected roadmap response:", json);
          throw new Error("roadmapData missing or invalid");
        }

        if (!cancelled) setData(roadmapData);
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

  // const [roadmapPata] = useState<RoadmapProgress>(SAMPLE_ROADMAP);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  //   const completionPercentage = Math.round(
  //     (roadmapData.completedModules / roadmapData.totalModules) * 100,
  //   );

  const handleSelectModule = (moduleId: string | null) => {
    setSelectedModule(moduleId);
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
      <ProgressHeader
        title={roadmapData?.goal ?? ""}
        totalModules={totalModules}
        totalLessons={totalLessons}
        // completionPercentage={completionPercentage}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden ">
        {/* Fixed Sidebar */}
        <ProgressSidebar
          modules={roadmapData.phases}
          selectedModule={selectedModule}
          selectedLesson={selectedLesson}
          onSelectModule={handleSelectModule}
          onSelectLesson={(lessonId, moduleId) => {
            setSelectedModule(moduleId);
            setSelectedLesson(lessonId);
          }}
          //   completionPercentage={completionPercentage}
        />

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
                  key={module.phase_number}
                  module={module}
                  moduleIndex={index}
                  selectedLessonId={selectedLesson}
                  onViewLesson={setSelectedLesson}
                />
              ))}
            </div>
          ) : (
            // SHOW ONLY SELECTED MODULE
            <>
              {roadmapData.phases
                .filter((m) => m.title === selectedModule)
                .map((module) => {
                  const actualIndex = roadmapData.phases.findIndex(
                    (m) => m.title === selectedModule,
                  );
                  return (
                    <ModuleContent
                      key={module.title}
                      module={module}
                      moduleIndex={actualIndex}
                      selectedLessonId={selectedLesson}
                      onViewLesson={setSelectedLesson}
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
