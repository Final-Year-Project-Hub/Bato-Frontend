"use client";

import { CheckCircle2, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { RoadmapPhase } from "../types";

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
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
  ];
  
  let result = '';
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
  completionPercentage,
}: ProgressSidebarProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

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

  const handleLessonClick = (lessonId: string, moduleId: string) => {
    if (!expandedModules.has(moduleId)) {
      setExpandedModules(new Set([...expandedModules, moduleId]));
    }
    onSelectLesson(lessonId, moduleId);
  };

  return (
    <div className="w-80 border-r border-white/10 bg-[#1A1A1A] flex flex-col ">
      {/* Fixed Header */}
      <div className="p-4  border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#EC5D44]">
            {completionPercentage}% Completed
          </span>
        </div>
      </div>

      {/* Scrollable Modules List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {modules.map((module, moduleIndex) => {
            const isExpanded = expandedModules.has(module.title);
            const isModuleSelected = selectedModule === module.title;
            const hasSelectedLesson = module.topics.some(
              (lesson) => lesson.title === selectedLesson
            );

            return (
              <div key={module.phase_number}>
                {/* Module Header */}
                <button
                  onClick={() => toggleModule(module.title)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    isModuleSelected && !hasSelectedLesson
                      ? "bg-[#EC5D44]/20 border border-[#EC5D44]/50"
                      : hasSelectedLesson
                      ? "bg-[#EC5D44]/10 border border-[#EC5D44]/30"
                      : "hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Module Number/Check */}
                    {/* <div
                      className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold ${
                        module.completed
                          ? "bg-green-500/20 text-green-500"
                          : isModuleSelected && !hasSelectedLesson
                          ? "bg-[#EC5D44] text-white"
                          : "bg-white/10 text-white/60"
                      }`}
                    >
                      {module.completed ? (
                        <CheckCircle2 size={18} className="text-green-500" />
                      ) : (
                        <span>{moduleIndex + 1}</span>
                      )}
                    </div> */}

                    {/* Module Title */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-semibold ${
                          isModuleSelected && !hasSelectedLesson
                            ? "text-white"
                            : hasSelectedLesson
                            ? "text-white"
                            : "text-white/80"
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
                              ? "text-white"
                              : "text-white/60"
                          }
                        />
                      ) : (
                        <ChevronRight
                          size={18}
                          className={
                            isModuleSelected || hasSelectedLesson
                              ? "text-white"
                              : "text-white/60"
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
                      const isLessonSelected = selectedLesson === lesson.title;

                      return (
                        <button
                          key={lesson.title}
                          onClick={() => handleLessonClick(lesson.title, module.title)}
                          className={`w-full text-left p-2.5 rounded-md transition-all ${
                            isLessonSelected
                              ? "bg-[#EC5D44]/15 border border-[#EC5D44]/40"
                              : "hover:bg-white/5 border border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {/* Lesson Number/Check */}
                            {/* <div
                              className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                                lesson.completed
                                  ? "bg-green-500/20"
                                  : isLessonSelected
                                  ? "bg-[#EC5D44]/30"
                                  : "bg-white/5"
                              }`}
                            >
                              {lesson.completed ? (
                                <CheckCircle2
                                  size={14}
                                  className="text-green-500"
                                />
                              ) : (
                                <span
                                  className={`text-xs font-medium ${
                                    isLessonSelected
                                      ? "text-[#EC5D44]"
                                      : "text-white/50"
                                  }`}
                                >
                                  {toRoman(lessonIndex + 1)}
                                </span>
                              )}
                            </div> */}

                            {/* Lesson Title */}
                            <p
                              className={`text-sm ${
                                isLessonSelected
                                  ? "text-white font-medium"
                                  : "text-white/70"
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