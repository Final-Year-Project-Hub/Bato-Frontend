"use client";

import { CheckCheck, CheckCircle2, ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { RoadmapPhase } from "../types";
import { Separator } from "@/components/ui/separator";
import { useProgress } from "./ProgressContext";

interface ProgressSidebarProps {
  modules: RoadmapPhase[];
  selectedModule: string | null;
  selectedLesson: string | null;
  onSelectModule: (moduleId: string | null) => void;
  onSelectLesson: (lessonId: string, moduleId: string) => void;
  completionPercentage?: number;
}

// Helper function to convert number to Roman numerals
const toRoman = (num: number): string => {
  const romanNumerals: [number, string][] = [
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];

  let result = "";
  for (const [value, numeral] of romanNumerals) {
    while (num >= value) {
      result += numeral;
      num -= value;
    }
  }
  return result;
};

export default function ProgressSidebar({
  modules,
  selectedModule,
  selectedLesson,
  onSelectModule,
  onSelectLesson,
}: ProgressSidebarProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(),
  );
  const { progress, isTopicCompleted, isPhaseCompleted } = useProgress();
  const completionPercentage = progress?.completionPercentage ?? 0;

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);

    if (selectedModule === moduleId) {
      newExpanded.delete(moduleId);
      setExpandedModules(newExpanded);
      onSelectModule(null);
    } else {
      if (!newExpanded.has(moduleId)) {
        newExpanded.add(moduleId);
      } else {
        newExpanded.delete(moduleId);
      }
      setExpandedModules(newExpanded);
      onSelectModule(moduleId);
    }
  };

  useEffect(() => {
    if (!selectedModule) return;
    setExpandedModules((prev) => {
      if (prev.has(selectedModule)) return prev;
      const next = new Set(prev);
      next.add(selectedModule);
      return next;
    });
  }, [selectedModule]);

  const handleLessonClick = (lessonId: string, moduleId: string) => {
    if (!expandedModules.has(moduleId)) {
      setExpandedModules(new Set([...expandedModules, moduleId]));
    }
    onSelectLesson(lessonId, moduleId);
  };

  return (
    <div className="w-80 border-r border-border bg-card flex flex-col">
      {/* Fixed Header */}
      <div className="p-4 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-primary">
            {completionPercentage}% Completed
          </span>
        </div>
      </div>

      {/* Scrollable Modules List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {modules.map((module, moduleIndex) => {
            const isExpanded = expandedModules.has(module.id);
            const isModuleSelected = selectedModule === module.id;
            const hasSelectedLesson = module.topics.some(
              (lesson) => lesson.id === selectedLesson,
            );
            const moduleCompleted = isPhaseCompleted(module.id);

            return (
              <div key={module.id}>
                {/* Module Header */}
                <button
                  onClick={() => toggleModule(module.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    isModuleSelected && !hasSelectedLesson
                      ? "bg-primary/20 border border-primary/50"
                      : hasSelectedLesson
                        ? "bg-primary/10 border border-primary/30"
                        : "hover:bg-accent border border-transparent"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Module Number/Check */}
                    <div
                      className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold ${
                        moduleCompleted
                          ? "bg-green-500/20 text-green-500"
                          : isModuleSelected && !hasSelectedLesson
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {moduleCompleted ? (
                        <CheckCheck size={18} className="text-green-500" />
                      ) : (
                        <span>{moduleIndex + 1}</span>
                      )}
                    </div>

                    {/* Module Title */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-semibold ${
                          isModuleSelected && !hasSelectedLesson
                            ? "text-foreground"
                            : hasSelectedLesson
                              ? "text-foreground"
                              : "text-foreground/80"
                        }`}
                      >
                        {module.title}
                      </p>
                    </div>

                    {/* Expand/Collapse Icon */}
                    <div className="shrink-0">
                      {isExpanded ? (
                        <ChevronDown
                          size={18}
                          className={
                            isModuleSelected || hasSelectedLesson
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }
                        />
                      ) : (
                        <ChevronRight
                          size={18}
                          className={
                            isModuleSelected || hasSelectedLesson
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }
                        />
                      )}
                    </div>
                  </div>
                </button>

                {/* Lessons (Collapsible) */}
                {isExpanded && (
                  <div className="ml-10 mt-1 space-y-1">
                    {module.topics.map((lesson, lessonIndex) => {
                      const isLessonSelected = selectedLesson === lesson.id;
                      const lessonCompleted = isTopicCompleted(lesson.id);

                      return (
                        <button
                          key={lesson.id}
                          onClick={() =>
                            handleLessonClick(lesson.id, module.id)
                          }
                          className={`w-full text-left p-2.5 rounded-md transition-all ${
                            isLessonSelected
                              ? "bg-primary/15 border border-primary/40"
                              : "hover:bg-accent border border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {/* Lesson Number/Check */}
                            <div
                              className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
                                lessonCompleted
                                  ? "bg-green-500/20"
                                  : isLessonSelected
                                    ? "bg-primary/30"
                                    : "bg-muted"
                              }`}
                            >
                              {lessonCompleted ? (
                                <CheckCheck
                                  size={14}
                                  className="text-green-500"
                                />
                              ) : (
                                <span
                                  className={`text-xs font-medium ${
                                    isLessonSelected
                                      ? "text-primary"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {toRoman(lessonIndex + 1)}
                                </span>
                              )}
                            </div>

                            {/* Lesson Title */}
                            <p
                              className={`text-sm ${
                                isLessonSelected
                                  ? "text-foreground font-medium"
                                  : "text-foreground/70"
                              }`}
                            >
                              {lesson.title}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
