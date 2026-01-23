"use client";

import {
  MoveUp,
  BadgeCheck,
  AudioWaveform,
  Code2,
  Database,
  Brain,
  Smartphone,
  Globe,
  Cpu,
  Cloud,
  Lock,
  LineChart,
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

import { RoadmapCard } from "./my-roadmaps/_components/RoadmapCard";
import Activity, { ActivityItem } from "./_components/Activity";
import { useRoadmaps } from "@/lib/hooks/useRoadmaps";

type Stat = {
  id: string;
  label: string;
  value: string | number;
  delta: string;
  Icon: React.ElementType;
  iconWrapClass: string;
  iconClass: string;
};

// Helper function to get icon based on roadmap title
const getIconForTitle = (title: string): LucideIcon => {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes("react")) return Code2;
  if (lowerTitle.includes("node") || lowerTitle.includes("backend"))
    return Database;
  if (lowerTitle.includes("python") || lowerTitle.includes("ai")) return Brain;
  if (lowerTitle.includes("mobile")) return Smartphone;
  if (lowerTitle.includes("full stack") || lowerTitle.includes("web"))
    return Globe;
  if (lowerTitle.includes("machine learning") || lowerTitle.includes("ml"))
    return Cpu;
  if (lowerTitle.includes("cloud")) return Cloud;
  if (lowerTitle.includes("security") || lowerTitle.includes("cyber"))
    return Lock;
  if (lowerTitle.includes("data")) return LineChart;

  return Code2; // Default
};

// Color gradients
const colorGradients = [
  "bg-gradient-to-br from-blue-500 to-blue-600",
  "bg-gradient-to-br from-green-500 to-green-600",
  "bg-gradient-to-br from-purple-500 to-purple-600",
  "bg-gradient-to-br from-pink-500 to-pink-600",
  "bg-gradient-to-br from-orange-500 to-orange-600",
  "bg-gradient-to-br from-indigo-500 to-indigo-600",
  "bg-gradient-to-br from-cyan-500 to-cyan-600",
  "bg-gradient-to-br from-red-500 to-red-600",
  "bg-gradient-to-br from-teal-500 to-teal-600",
];

function TopBox({ stat }: { stat: Stat }) {
  const { label, value, delta, Icon, iconWrapClass, iconClass } = stat;

  return (
    <div className="rounded-xl border border-white/25 bg-background/60 p-6 mt-10 flex items-start justify-between">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-3xl font-semibold text-primary">{value}</p>
        <div className="flex items-center gap-2 text-sm text-emerald-400">
          <MoveUp className="h-4 w-4" />
          <span>{delta}</span>
        </div>
      </div>

      <div
        className={`h-10 w-10 rounded-sm grid place-items-center ${iconWrapClass}`}
      >
        <Icon className={`h-5 w-5 ${iconClass}`} />
      </div>
    </div>
  );
}

export default function Page() {
  const { roadmaps, loading, error } = useRoadmaps();

  // Calculate stats based on actual data
  const activeRoadmaps = roadmaps?.length || 0;

  const STATS: Stat[] = [
    {
      id: "active-roadmaps",
      label: "Active Roadmaps",
      value: activeRoadmaps,
      delta: "2% increase",
      Icon: AudioWaveform,
      iconWrapClass: "bg-blue-100",
      iconClass: "text-blue-600",
    },
    {
      id: "completed-tasks",
      label: "Completed Tasks",
      value: 28,
      delta: "2% increase",
      Icon: BadgeCheck,
      iconWrapClass: "bg-green-100",
      iconClass: "text-green-600",
    },
  ];

  return (
    <main className="my-container space-y-5 pb-10">

      {/* STATS */}
      <div className="grid grid-cols-4 gap-5">
        {STATS.map((stat) => (
          <TopBox key={stat.id} stat={stat} />
        ))}
      </div>

      {/* ROADMAP HEADER */}
      <div className="flex justify-between">
        <p className="text-primary text-xl font-semibold">Your Roadmaps</p>
        <Link
          href="/dashboard/my-roadmaps"
          className="text-sm text-secondary font-medium"
        >
          View All
        </Link>
      </div>

      {/* ROADMAP LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {loading && (
          <p className="text-muted-foreground col-span-full text-center py-8">
            Loading roadmaps...
          </p>
        )}

        {error && (
          <p className="text-red-500 col-span-full text-center py-8">{error}</p>
        )}

        {!loading && !error && roadmaps && roadmaps.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground mb-4">No roadmaps yet</p>
            <Link
              href="/chat"
              className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
            >
              Create Your First Roadmap
            </Link>
          </div>
        )}

        {!loading &&
          !error &&
          roadmaps &&
          roadmaps.slice(0, 4).map((roadmap, index) => {
            const icon = getIconForTitle(roadmap.title);
            const color = colorGradients[index % colorGradients.length];

            // Calculate estimated hours based on proficiency
            const estimatedHours =
              roadmap.proficiency === "beginner"
                ? 150
                : roadmap.proficiency === "intermediate"
                  ? 100
                  : roadmap.proficiency === "advanced"
                    ? 80
                    : 120;

            return (
              <RoadmapCard
                key={roadmap.id}
                id={roadmap.id}
                title={roadmap.title}
                description={roadmap.goal}
                icon={icon}
                estimatedHours={estimatedHours}
                color={color}
                gradient={color}
                index={index}
              />
            );
          })}
      </div>

      {/* ACTIVITY */}
      <div className="rounded-2xl border border-white/25 bg-background/60 p-6">
        <h2 className="text-xl font-semibold text-primary mb-6">
          Recent Activity
        </h2>

        <div className="space-y-6">
          {RECENT_ACTIVITIES.map((item) => (
            <Activity key={item.id} item={item} />
          ))}
        </div>
      </div>
    </main>
  );
}

const RECENT_ACTIVITIES: ActivityItem[] = [
  {
    id: "completed-hooks",
    title: 'Completed "React Hooks" lesson',
    time: "2 hours ago",
    Icon: BadgeCheck,
    iconWrapClass: "bg-emerald-100",
    iconClass: "text-emerald-700",
    titleClass: "text-emerald-400",
  },
];
