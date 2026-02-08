"use client";

import { CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Module, RoadmapPhase } from "../types";

interface ModuleContentProps {
  module: RoadmapPhase;
  moduleIndex: number;
  selectedLessonId: string | null;
  onViewLesson: (lessonId: string) => void;
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

export default function ModuleContent({
  module,
  moduleIndex,
  selectedLessonId,
  onViewLesson,
}: ModuleContentProps) {
  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        {/* {module.completed ? (
          <CheckCircle2 size={28} className="text-green-500 shrink-0" />
        ) : ( */}
        <div className="w-8 h-8 rounded-full bg-[#EC5D44] flex items-center justify-center shrink-0">
          <span className="text-base font-semibold text-white">
            {moduleIndex + 1}
          </span>
        </div>
        {/* )} */}
        <h2 className="text-2xl font-semibold text-white">{module.title}</h2>
      </div>
      <div className="space-y-3">
        {module.topics.map((lesson, index) => {
          const isSelected = selectedLessonId === lesson.title;

          return (
            <Card
              key={lesson.title}
              className={`p-4 transition-all group ${
                isSelected
                  ? "bg-[#2A2A2A] border-[#EC5D44]/50 shadow-lg shadow-[#EC5D44]/10"
                  : "bg-[#2A2A2A] border-white/10 hover:border-[#EC5D44]/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  {/* <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      lesson.completed
                        ? "bg-green-500/20"
                        : isSelected
                        ? "bg-[#EC5D44]/20"
                        : "bg-white/5"
                    }`}
                  > */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      isSelected ? "bg-[#EC5D44]/20" : "bg-white/5"
                    }`}
                  >
                    {/* {lesson.completed ? (
                      <CheckCircle2 size={20} className="text-green-500" />
                    ) : ( */}
                    <span
                      className={`text-sm font-semibold ${
                        isSelected ? "text-[#EC5D44]" : "text-white/60"
                      }`}
                    >
                      {toRoman(index + 1)}
                    </span>
                    {/* )} */}
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`text-base font-medium transition-colors ${
                        isSelected
                          ? "text-white"
                          : "text-white/90 group-hover:text-[#EC5D44]"
                      }`}
                    >
                      {lesson.title}
                    </h3>
                  </div>
                </div>
                <Button
                  onClick={() => onViewLesson(lesson.title)}
                  variant="ghost"
                  size="sm"
                  className={`${
                    isSelected
                      ? "text-[#EC5D44] bg-[#EC5D44]/10"
                      : "text-[#EC5D44] hover:bg-[#EC5D44]/10"
                  } hover:text-[#EC5D44]`}
                >
                  View →
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
