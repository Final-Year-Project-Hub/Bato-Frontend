"use client";

import {
  Users,
  Clock,
  Code,
  Database,
  Globe,
  type LucideIcon,
} from "lucide-react";

export type Roadmap = {
  id: number;
  title: string;
  users: number;
  estimatedHours: number;
  completion: number;
  color: string;
};

const roadmapIcons: Record<string, LucideIcon> = {
  "React Development": Code,
  "Next.js": Globe,
  "Node.js Backend": Database,
};

export default function RoadmapsTable({
  roadmaps,
}: {
  roadmaps: Roadmap[];
}) {
  return (
    <div className="bg-background rounded-2xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-grey border-b border-border">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold">
                Roadmap
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold">
                Users Enrolled
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold">
                Duration
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold">
                Avg Completion
              </th>
            </tr>
          </thead>

          <tbody>
            {roadmaps.map((roadmap) => {
              const Icon =
                roadmapIcons[roadmap.title] ?? Code;

              return (
                <tr
                  key={roadmap.id}
                  className="border-b border-border hover:bg-grey/50 transition-colors"
                >
                  {/* Roadmap */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 ${roadmap.color} rounded-lg flex items-center justify-center`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-medium">
                        {roadmap.title}
                      </span>
                    </div>
                  </td>

                  {/* Users */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-foreground/70">
                      <Users className="w-4 h-4" />
                      {roadmap.users}
                    </div>
                  </td>

                  {/* Duration */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-foreground/70">
                      <Clock className="w-4 h-4" />
                      {roadmap.estimatedHours}h
                    </div>
                  </td>

                  {/* Completion */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-grey rounded-full h-2 max-w-32">
                        <div
                          className={`${roadmap.color} h-2 rounded-full`}
                          style={{ width: `${roadmap.completion}%` }}
                        />
                      </div>
                      <span className="text-sm text-foreground/70 min-w-10">
                        {roadmap.completion}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}

            {roadmaps.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-foreground/60"
                >
                  No roadmaps found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
