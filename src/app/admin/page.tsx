"use client";

import { Users, Map, DollarSign, Cpu, TrendingUp, FileText } from "lucide-react";
import StatsCard from "./_components/StatsCard";


export default function AdminDashboard() {
 
  const stats = [
    { title: "Total Users", value: "1,234", icon: Users, change: "+12%", color: "bg-blue-500" },
    { title: "Total Roadmaps", value: "89", icon: Map, change: "+8%", color: "bg-purple-500" },
    { title: "Revenue", value: "Rs12,450", icon: DollarSign, change: "+23%", color: "bg-green-500" },
    { title: "LLM Costs", value: "$3,200", icon: Cpu, change: "+5%", color: "bg-orange-500" },
    { title: "Documents", value: "456", icon: FileText, change: "+15%", color: "bg-indigo-500" },
    { title: "Active Users", value: "892", icon: TrendingUp, change: "+18%", color: "bg-pink-500" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Dashboard Overview</h1>
        <p className="text-foreground/60">Monitor your platform key metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

    
    </div>
  );
}