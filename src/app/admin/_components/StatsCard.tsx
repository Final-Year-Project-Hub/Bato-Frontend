"use client";

import { motion } from "framer-motion";
import { LucideIcon} from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;

  color: string;
}

export default function StatsCard({ title, value, icon: Icon,  color }: StatsCardProps) {
 

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-background rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
       
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-1">{value}</h3>
      <p className="text-sm text-foreground/60">{title}</p>
    </motion.div>
  );
}