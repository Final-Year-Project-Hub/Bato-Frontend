"use client";

import { motion } from "framer-motion";
import RoadmapGrid from "./_components/RoadmapGrid"
import { Map, TrendingUp, Sparkles } from "lucide-react";
import { useRoadmaps } from "@/lib/hooks/useRoadmaps";

export default function RoadmapsPage() {
  const { roadmaps, loading } = useRoadmaps();

  //  SAFETY CHECK
  const safeRoadmaps = roadmaps || [];

  // Calculate total hours (estimate based on proficiency)
  const totalHours = safeRoadmaps.reduce((sum, roadmap) => {
    const hours =
      roadmap.proficiency === "beginner"
        ? 150
        : roadmap.proficiency === "intermediate"
          ? 100
          : roadmap.proficiency === "advanced"
            ? 80
            : 120;
    return sum + hours;
  }, 0);

  return (
    <div className="min-h-screen bg-grey text-foreground font-sans">
      <div className="my-container py-10">
        {/* Header Section */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-background text-secondary px-6 py-3 rounded-full text-sm font-semibold mb-6 border border-secondary/20 shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            Start Your Journey
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-6"
          >
            <div className="flex items-center gap-3 bg-background px-6 py-4 rounded-2xl border border-border shadow-sm">
              <div className="w-12 h-12 bg-linear-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
                <Map className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-foreground">
                  {loading ? "..." : safeRoadmaps.length}
                </div>
                <div className="text-xs text-foreground/60">Roadmaps</div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-background px-6 py-4 rounded-2xl border border-border shadow-sm">
              <div className="w-12 h-12 bg-linear-to-br from-secondary to-secondary/80 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-foreground">
                  {loading ? "..." : `${totalHours.toLocaleString()}+`}
                </div>
                <div className="text-xs text-foreground/60">Total Hours</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* All Roadmaps Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 flex items-center justify-between"
        >
          <div className="ml-5">
            <h2 className="text-2xl font-bold text-primary">
              All Roadmaps
            </h2>
            <p className="text-sm text-chart-2 mt-1">
              Explore structured learning paths tailored for you
            </p>
          </div>
        </motion.div>

        {/* Roadmaps Grid */}
        <RoadmapGrid  />
      </div>
    </div>
  );
}
