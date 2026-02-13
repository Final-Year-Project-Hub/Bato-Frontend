"use client";

import {
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
  BookOpen,
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

import { RoadmapCard } from "./my-roadmaps/_components/RoadmapCard";
import Activity, { ActivityItem } from "./_components/Activity";
import { useRoadmaps } from "@/lib/hooks/useRoadmaps";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/features/auth/hooks/useAuth";

type Stat = {
  id: string;
  label: string;
  value: string | number;
  Icon: React.ElementType;
  iconWrapClass: string;
  iconClass: string;
};

type RawActivityItem = {
  type: string;
  id: string;
  title: string;
  timestamp: string;
  metadata: {
    topicId?: string;
    roadmapId?: string;
    phaseId?: string;
    topicTitle?: string;
    title?: string;
    score?: number;
    result?: string;
    quizId?: string;
    topicContentId?: string;
  };
};

type Roadmap = {
  id: string;
  title: string;
  goal: string;
  proficiency: string;
};

const getIconForTitle = (title: string): LucideIcon => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("react")) return Code2;
  if (lowerTitle.includes("node") || lowerTitle.includes("backend")) return Database;
  if (lowerTitle.includes("python") || lowerTitle.includes("ai")) return Brain;
  if (lowerTitle.includes("mobile")) return Smartphone;
  if (lowerTitle.includes("full stack") || lowerTitle.includes("web")) return Globe;
  if (lowerTitle.includes("machine learning") || lowerTitle.includes("ml")) return Cpu;
  if (lowerTitle.includes("cloud")) return Cloud;
  if (lowerTitle.includes("security") || lowerTitle.includes("cyber")) return Lock;
  if (lowerTitle.includes("data")) return LineChart;
  return Code2;
};

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

const ACTIVITY_STYLES: Record<
  string,
  { Icon: LucideIcon; iconWrapClass: string; iconClass: string; titleClass: string }
> = {
  TOPIC_COMPLETED: {
    Icon: BadgeCheck,
    iconWrapClass: "bg-emerald-100",
    iconClass: "text-emerald-700",
    titleClass: "text-emerald-400",
  },
  QUIZ_ATTEMPTED: {
    Icon: BookOpen,
    iconWrapClass: "bg-purple-100",
    iconClass: "text-purple-700",
    titleClass: "text-purple-400",
  },
  DEFAULT: {
    Icon: AudioWaveform,
    iconWrapClass: "bg-blue-100",
    iconClass: "text-blue-700",
    titleClass: "text-blue-400",
  },
};

function mapActivityItem(item: RawActivityItem, roadmaps: Roadmap[]): ActivityItem {
  const style = ACTIVITY_STYLES[item.type] ?? ACTIVITY_STYLES.DEFAULT;
  const timestamp = new Date(item.timestamp);
  const now = new Date();
  const diffMs = now.getTime() - timestamp.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  let time: string;
  if (diffMins < 1) time = "Just now";
  else if (diffMins < 60) time = `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  else if (diffHours < 24) time = `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  else time = `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  const { roadmapId, topicId, phaseId } = item.metadata;

  let href: string | undefined;

  // TOPIC_COMPLETED → redirect to that specific topic page
  if (item.type === "TOPIC_COMPLETED" && roadmapId && topicId && phaseId) {
    const roadmap = roadmaps.find((r) => r.id === roadmapId);
    const goal = roadmap?.goal ?? roadmap?.title ?? "";
    href = `/progresstracker/${roadmapId}/topic/${topicId}?phaseId=${phaseId}&goal=${encodeURIComponent(goal)}&roadmapId=${roadmapId}`;
  }
  // QUIZ_ATTEMPTED → no link

  return {
    id: item.id,
    title: item.title,
    time,
    href,
    ...style,
  };
}

function TopBox({ stat }: { stat: Stat }) {
  const { label, value, Icon, iconWrapClass, iconClass } = stat;

  return (
    <div className="rounded-xl border border-white/10 bg-background/60 p-6 mt-6 flex items-start justify-between">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-3xl font-semibold text-primary">{value}</p>
      </div>
      <div className={`h-10 w-10 rounded-sm grid place-items-center ${iconWrapClass}`}>
        <Icon className={`h-5 w-5 ${iconClass}`} />
      </div>
    </div>
  );
}

export default function Page() {
  const { roadmaps, loading, error } = useRoadmaps();
  const { user } = useAuth();
  const [quizAttempts, setQuizAttempts] = useState<number>(0);
  const [quizLoading, setQuizLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  useEffect(() => {
    async function fetchQuizAttempts() {
      if (!user?.id) return;
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await fetch(`${baseUrl}/api/quiz/user/${user.id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setQuizAttempts(Array.isArray(data) ? data.length : 0);
        }
      } catch (error) {
        console.error("Failed to fetch quiz attempts:", error);
      } finally {
        setQuizLoading(false);
      }
    }
    fetchQuizAttempts();
  }, [user?.id]);

  // Wait for roadmaps to load first so goal can be matched
  useEffect(() => {
    if (loading || !roadmaps) return;

    async function fetchRecentActivity() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await fetch(`${baseUrl}/api/user/recentActivity`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          const mapped = (data.data as RawActivityItem[]).map((item) =>
            mapActivityItem(item, roadmaps)
          );
          setRecentActivities(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch recent activity:", error);
      } finally {
        setActivitiesLoading(false);
      }
    }

    fetchRecentActivity();
  }, [loading, roadmaps]);

  const activeRoadmaps = roadmaps?.length || 0;

  const STATS: Stat[] = [
    {
      id: "active-roadmaps",
      label: "Active Roadmaps",
      value: loading ? "..." : activeRoadmaps,
      Icon: AudioWaveform,
      iconWrapClass: "bg-blue-100",
      iconClass: "text-blue-600",
    },
    {
      id: "quiz-attempted",
      label: "Quizzes Attempted",
      value: quizLoading ? "..." : quizAttempts,
      Icon: BookOpen,
      iconWrapClass: "bg-purple-100",
      iconClass: "text-purple-600",
    },
  ];

  return (
    <main className="my-container py-8 space-y-4">
      {/* STATS */}
      <div className="grid grid-cols-4 gap-5">
        {STATS.map((stat) => (
          <TopBox key={stat.id} stat={stat} />
        ))}
      </div>

      {/* ROADMAP HEADER + LIST */}
      <div className="space-y-4 pt-6">
        <div className="flex justify-between">
          <p className="text-primary text-2xl font-semibold">Your Roadmaps</p>
          <Link href="/dashboard/my-roadmaps" className="text-sm text-secondary font-medium">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {loading && (
            <p className="text-muted-foreground col-span-full text-center">
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
              const estimatedHours =
                roadmap.proficiency === "beginner" ? 150
                : roadmap.proficiency === "intermediate" ? 100
                : roadmap.proficiency === "advanced" ? 80
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
      </div>

      {/* ACTIVITY */}
      <div className="rounded-2xl border border-white/10 bg-background/60 p-6 mt-10">
        <h2 className="text-xl font-semibold text-primary mb-6">Recent Activity</h2>
        <div className="divide-y divide-white/5">
          {activitiesLoading && (
            <p className="text-muted-foreground text-center">Loading activity...</p>
          )}
          {!activitiesLoading && recentActivities.length === 0 && (
            <p className="text-muted-foreground text-center py-4">No recent activity</p>
          )}
          {recentActivities.map((item) => (
            <Activity key={item.id} item={item} />
          ))}
        </div>
      </div>
    </main>
  );
}