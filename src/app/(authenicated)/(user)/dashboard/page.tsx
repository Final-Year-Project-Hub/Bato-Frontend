import {
  MoveUp,
  BadgeCheck,
  AudioWaveform,
  Atom,
  Snowflake,
  Code2,
  Check,
  MessageCircle,
  Star,
} from "lucide-react";
import Link from "next/link";
import RoadmapCard, { Roadmapcard } from "./_components/RoadmapCard"
import Activity, { ActivityItem } from "./_components/Activity";

type Stat = {
  id: string;
  label: string;
  value: string | number;
  delta: string;
  Icon: React.ElementType;
  iconWrapClass: string;
  iconClass: string;
};

const STATS: Stat[] = [
  {
    id: "active-roadmaps",
    label: "Active Roadmaps",
    value: 5,
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
  // {
  //   id: "learning-hours",
  //   label: "Learning Hours",
  //   value: 142,
  //   delta: "2% increase",
  //   Icon: Clock3,
  //   iconWrapClass: "bg-purple-100",
  //   iconClass: "text-purple-600",
  // },
  // {
  //   id: "success-rate",
  //   label: "Success Rate",
  //   value: "94.2%",
  //   delta: "2% increase",
  //   Icon: CheckCircle2,
  //   iconWrapClass: "bg-emerald-950/60",
  //   iconClass: "text-emerald-400",
  // },
];
function TopBox({ stat }: { stat: Stat }) {
  const { label, value, delta, Icon, iconWrapClass, iconClass } = stat;

  return (
    <div className="rounded-xl border border-white/25 bg-background/60 p-6  mt-10 flex items-start justify-between ">
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
  return (
    <main className="my-container space-y-5 pb-10">
      <div className="grid grid-cols-4 gap-5">
        {STATS.map((stat) => (
          <TopBox key={stat.id} stat={stat} />
        ))}
      </div>
      <div className="flex justify-between">
        <p className="text-primary text-xl font-semibold">Your Roadmaps</p>
        <Link href="/dashboard/my-roadmaps" className="text-sm text-secondary font-medium">
          View All
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {ROADMAPS.map((item) => (
          <RoadmapCard key={item.id} item={item} />
        ))}
      </div>

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

const ROADMAPS: Roadmapcard[] = [
  {
    id: "react-dev",
    title: "React Development",
    description: "Master React.js from basics to advanced concepts",
    progress: 65,
    status: "Active",
    Icon: Atom,
    iconWrapClass: "bg-blue-600",
    iconClass: "text-white",
    statusWrapClass: "bg-emerald-100",
    statusTextClass: "text-emerald-800",
  },
  {
    id: "node-backend",
    title: "Node.js Backend",
    description: "Build scalable backend applications with Node.js",
    progress: 40,
    status: "In Progress",
    Icon: Code2,
    iconWrapClass: "bg-green-600",
    iconClass: "text-white",
    statusWrapClass: "bg-amber-100",
    statusTextClass: "text-amber-800",
  },
  {
    id: "python-ai",
    title: "Python for AI",
    description: "Learn Python programming for AI and machine learning",
    progress: 15,
    status: "Planned",
    Icon: Snowflake,
    iconWrapClass: "bg-purple-600",
    iconClass: "text-white",
    statusWrapClass: "bg-blue-100",
    statusTextClass: "text-blue-800",
  },
  {
    id: "react-dev-2",
    title: "React Development",
    description: "Master React.js from basics to advanced concepts",
    progress: 65,
    status: "Active",
    Icon: Atom,
    iconWrapClass: "bg-blue-600",
    iconClass: "text-white",
    statusWrapClass: "bg-emerald-100",
    statusTextClass: "text-emerald-800",
  },
];

const RECENT_ACTIVITIES: ActivityItem[] = [
  {
    id: "completed-hooks",
    title: 'Completed "React Hooks" lesson',
    time: "2 hours ago",
    Icon: Check,
    iconWrapClass: "bg-emerald-100",
    iconClass: "text-emerald-700",
    titleClass: "text-emerald-400",
  },
  {
    id: "asked-question",
    title: "Asked question about state management",
    time: "5 hours ago",
    Icon: MessageCircle,
    iconWrapClass: "bg-blue-100",
    iconClass: "text-blue-700",
    titleClass: "text-emerald-400",
  },
  {
    id: "milestone",
    title: 'Achieved "React Fundamentals" milestone',
    time: "1 day ago",
    Icon: Star,
    iconWrapClass: "bg-purple-100",
    iconClass: "text-purple-700",
    titleClass: "text-emerald-400",
  },
];
