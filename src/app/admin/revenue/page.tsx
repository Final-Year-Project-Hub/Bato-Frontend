

import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Cpu,
  
} from "lucide-react";
import RevenueChart from "../_components/RevenueChart";

export default function RevenuePage() {
  const revenueStats = [
    {
      title: "Total Revenue",
      value: "$12,450",
      change: "+23%",
      positive: true,
      icon: DollarSign,
    },
    {
      title: "Monthly Revenue",
      value: "$4,280",
      change: "+18%",
      positive: true,
      icon: TrendingUp,
    },
  ];

  const costStats = [
    {
      title: "LLM Costs",
      value: "$3,200",
      change: "+5%",
      positive: false,
      icon: Cpu,
    },
    {
      title: "Infrastructure Costs",
      value: "$1,450",
      change: "+3%",
      positive: false,
      icon: TrendingDown,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">
          Revenue & Costs
        </h1>
        <p className="text-foreground/60">
          Monitor your platform’s financial performance
        </p>
      </div>

      {/* ===== Revenue Stats ===== */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Revenue
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {revenueStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-background rounded-2xl border border-border p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium text-green-500">
                    <TrendingUp className="w-4 h-4" />
                    {stat.change}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm text-foreground/60">
                  {stat.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== Cost Stats ===== */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Costs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {costStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-background rounded-2xl border border-border p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium text-orange-500">
                    <TrendingDown className="w-4 h-4" />
                    {stat.change}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm text-foreground/60">
                  {stat.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== Chart ===== */}
      <div className="bg-background rounded-2xl border border-border p-6">
        <h2 className="text-xl font-bold text-foreground mb-6">
          Revenue vs Costs Over Time
        </h2>
        <RevenueChart />
      </div>
    </div>
  );
}
