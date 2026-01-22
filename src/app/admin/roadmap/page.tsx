"use client";

import { useMemo, useState } from "react";
import { Search, Filter } from "lucide-react";
import RoadmapsTable, {
  type Roadmap,
} from "../_components/Roadmap";

const mockRoadmaps: Roadmap[] = [
  {
    id: 1,
    title: "React Development",
    users: 234,
    estimatedHours: 120,
    completion: 67,
    color: "bg-blue-500",
  },
  {
    id: 2,
    title: "Next.js",
    users: 189,
    estimatedHours: 140,
    completion: 58,
    color: "bg-black",
  },
  {
    id: 3,
    title: "Node.js Backend",
    users: 201,
    estimatedHours: 150,
    completion: 54,
    color: "bg-green-500",
  },
];

type CompletionFilter =
  | "all"
  | "below-50"
  | "50-75"
  | "above-75";

export default function RoadmapsPage() {
  const [search, setSearch] = useState("");
  const [completionFilter, setCompletionFilter] =
    useState<CompletionFilter>("all");

  const filteredRoadmaps = useMemo(() => {
    return mockRoadmaps.filter((roadmap) => {
      // 🔍 Search filter
      const matchesSearch = roadmap.title
        .toLowerCase()
        .includes(search.toLowerCase());

      // 🎯 Completion filter
      const matchesCompletion =
        completionFilter === "all"
          ? true
          : completionFilter === "below-50"
          ? roadmap.completion < 50
          : completionFilter === "50-75"
          ? roadmap.completion >= 50 && roadmap.completion <= 75
          : roadmap.completion > 75;

      return matchesSearch && matchesCompletion;
    });
  }, [search, completionFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">
          Roadmaps
        </h1>
        <p className="text-foreground/60">
          Manage all learning roadmaps
        </p>
      </div>

      {/* Filters */}
      <div className="bg-background rounded-2xl border border-border p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search roadmaps..."
              className="w-full bg-grey border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Completion Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-foreground/60" />
            <select
              value={completionFilter}
              onChange={(e) =>
                setCompletionFilter(
                  e.target.value as CompletionFilter
                )
              }
              className="bg-grey border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Completion</option>
              <option value="below-50">Below 50%</option>
              <option value="50-75">50% – 75%</option>
              <option value="above-75">Above 75%</option>
            </select>
          </div>
        </div>
      </div>

      {/* Roadmaps Table */}
      <RoadmapsTable roadmaps={filteredRoadmaps} />
    </div>
  );
}
