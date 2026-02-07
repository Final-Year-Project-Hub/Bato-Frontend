"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProgressHeaderProps {
  title: string;
  totalModules: number;
  totalLessons: number;
  completionPercentage?: number;
}

export default function ProgressHeader({
  title,
  totalModules,
  totalLessons,
  
}: ProgressHeaderProps) {
  const router = useRouter();

  return (
    <div className="border-b border-white/10 bg-[#1A1A1A]">
      <div className="py-5 px-4">
        <button
          onClick={() => router.push("/dashboard/my-roadmaps")}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-4"
        >
          <ChevronLeft size={20} />
          <span className="text-sm">Back to My Roadmaps</span>
        </button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-2">{title}</h1>
            <p className="text-sm text-white/60">
              {totalModules} modules • {totalLessons} lessons
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 pb-4">
        <div className="flex items-center gap-3">
        </div>
      </div>
    </div>
  );
}