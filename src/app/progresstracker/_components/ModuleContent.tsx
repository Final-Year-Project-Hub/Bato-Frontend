"use client";

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
          const isSelected = selectedLessonId === lesson.id;

          return (
            <Card
              key={lesson.id}
              className={`p-4 transition-all group ${
                isSelected
                  ? "bg-card border-primary/50 shadow-lg shadow-primary/10"
                  : "bg-card border-border hover:border-primary/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  {/* <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      lesson.completed
                        ? "bg-green-500/20"
                        : isSelected
                        ? "bg-primary/20"
                        : "bg-muted"
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
                        isSelected ? "text-primary" : "text-muted-foreground"
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
                          ? "text-foreground"
                          : "text-foreground/90 group-hover:text-primary"
                      }`}
                    >
                      {lesson.title}
                    </h3>
                  </div>
                </div>
                <Button
                  onClick={() => onViewLesson(lesson.id)}
                  variant="ghost"
                  size="sm"
                  className={`${
                    isSelected
                      ? "text-primary bg-primary/10"
                      : "text-primary hover:bg-primary/10"
                  } hover:text-primary`}
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
