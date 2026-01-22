"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Clock, ArrowRight, BarChart3, Map } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface RoadmapCardProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  estimatedHours: number;
  color: string;
  gradient: string;
  index: number;
}

export const RoadmapCard = ({
  id,
  title,
  description,
  icon: Icon,
  estimatedHours,
  color,
  gradient,
  index,
}: RoadmapCardProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      whileHover={{ y: -6, scale: 1.015 }}
      onMouseLeave={() => setOpen(false)}
      className="group relative bg-background rounded-3xl border border-border overflow-visible hover:shadow-2xl transition"
    >
      {/* Glow */}
      <div
        className={`absolute top-0 right-0 w-40 h-40 ${gradient}
                    opacity-5 blur-3xl group-hover:opacity-15 transition`}
      />

      {/* Arrow + Dropdown */}
      <div className="absolute top-4 right-4 z-30">
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            setOpen((prev) => !prev);
          }}
          className="w-9 h-9 rounded-full bg-grey flex items-center justify-center
                     opacity-0 group-hover:opacity-100
                     hover:bg-primary hover:text-white transition"
        >
          <motion.div
            whileHover={{ rotate: 90, x: 2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        </motion.button>

        {/* Dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.96 }}
              transition={{ duration: 0.12 }}
              className="absolute right-0 mt-2 w-44 bg-background border border-border
                         rounded-lg shadow-xl z-50 overflow-hidden"
            >
              {/* 🚀 Use router.push here */}
              <button
                onClick={() => router.push(`/dashboard/roadmap/${id}`)}
                className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm hover:bg-grey transition"
              >
                <Map className="w-4 h-4 text-primary" />
                View Full Roadmap
              </button>

              <div className="h-px bg-border" />

              <button
                onClick={() => router.push(`/dashboard/my-roadmaps/tracker?roadmap=${id}`)}
                className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm hover:bg-grey transition"
              >
                <BarChart3 className="w-4 h-4 text-primary" />
                Progress Tracker
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card Content */}
      <div className="relative p-8">
        <div
          className={`w-20 h-20 ${color} rounded-2xl flex items-center justify-center mb-6 shadow-xl`}
        >
          <Icon className="w-10 h-10 text-white" />
        </div>

        <h3 className="text-2xl font-bold mb-3">{title}</h3>

        <p className="text-sm text-foreground/70 mb-6 min-h-12">
          {description}
        </p>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-grey px-4 py-2 rounded-xl border border-border">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold">{estimatedHours}h</span>
          </div>
          <span className="text-xs text-foreground/50">estimated</span>
        </div>

        <motion.div
          className={`absolute bottom-0 left-0 right-0 h-1.5 ${color}`}
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.25 }}
        />
      </div>
    </motion.div>
  );
};
