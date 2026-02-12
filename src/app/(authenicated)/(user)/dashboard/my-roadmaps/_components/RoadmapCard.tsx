"use client";

import { motion } from "framer-motion";
import { Clock, BarChart3, Map } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="group relative bg-background rounded-xl border border-border 
                 overflow-hidden hover:shadow-xl transition-all duration-300
                 flex flex-col"
    >
      {/* Glow */}
      <div
        className={`absolute top-0 right-0 w-40 h-40 ${gradient}
                    opacity-5 blur-3xl group-hover:opacity-10 transition`}
      />

      {/* Card Content */}
      <div className="relative flex flex-col flex-1 p-5 gap-4 ">

        {/* Top Row: Icon + Hours */}
        <div className="flex items-center justify-between">
          <div className={`w-11 h-11 ${color} rounded-lg flex items-center justify-center shadow-md`}>
            <Icon className="w-5 h-5 text-white" />
          </div>

          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">{estimatedHours}h</span>
          </div>
        </div>

        {/* Title + Description */}
        <div className="flex flex-col gap-1.5 flex-1">
          <h3 className="text-sm font-semibold text-foreground line-clamp-1">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() =>
              router.push(`/dashboard/my-roadmaps/${encodeURIComponent(id)}`)
            }
            className="flex-1 flex items-center justify-center gap-1.5 py-2
                       text-xs font-medium rounded-lg border border-border
                       bg-transparent hover:bg-primary hover:text-white
                       hover:border-primary text-foreground/70
                       transition-all duration-200"
          >
            <Map className="w-3.5 h-3.5" />
            Roadmap
          </button>

          <button
            onClick={() => router.push(`/progresstracker/${id}`)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2
                       text-xs font-medium rounded-lg border border-border
                       bg-transparent hover:bg-primary hover:text-white
                       hover:border-primary text-foreground/70
                       transition-all duration-200"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Progress
          </button>
        </div>
      </div>

      {/* Bottom accent */}
      <motion.div
        className={`absolute bottom-0 left-0 right-0 h-0.5 ${color}`}
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.25 }}
      />
    </motion.div>
  );
};