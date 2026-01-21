"use client";

import { DollarSign, TrendingUp, TrendingDown, Cpu, CreditCard } from "lucide-react";
import RevenueChart from "../_components/RevenueChart";

export default function RevenuePage() {
  const revenueStats = [
    { title: "Total Revenue", value: "$12,450", change: "+23%", positive: true, icon: DollarSign },
    { title: "Monthly Revenue", value: "$4,280", change: "+18%", positive: true, icon: TrendingUp },
    { title: "LLM Costs", value: "$3,200", change: "+5%", positive: false, icon: Cpu },
    { title: "Net Profit", value: "$9,250", change: "+28%", positive: true, icon: CreditCard },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Revenue & Costs</h1>
        <p className="text-foreground/60">Monitor your platforms financial performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {revenueStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-background rounded-2xl border border-border p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${stat.positive ? 'bg-green-500' : 'bg-orange-500'} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${stat.positive ? 'text-green-500' : 'text-orange-500'}`}>
                  {stat.positive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1">{stat.value}</h3>
              <p className="text-sm text-foreground/60">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Revenue Chart */}
      <div className="bg-background rounded-2xl border border-border p-6">
        <h2 className="text-xl font-bold text-foreground mb-6">Revenue Over Time</h2>
        <RevenueChart />
      </div>

      {/* Recent Transactions */}
      <div className="bg-background rounded-2xl border border-border p-6">
        <h2 className="text-xl font-bold text-foreground mb-6">Recent Transactions</h2>
        <div className="space-y-4">
          {[
            { user: "John Doe", amount: "$49", plan: "Pro Plan", date: "2024-01-20" },
            { user: "Jane Smith", amount: "$29", plan: "Basic Plan", date: "2024-01-20" },
            { user: "Bob Johnson", amount: "$99", plan: "Enterprise Plan", date: "2024-01-19" },
            { user: "Alice Brown", amount: "$49", plan: "Pro Plan", date: "2024-01-19" },
          ].map((transaction, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-grey rounded-lg hover:bg-grey/70 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold">{transaction.user[0]}</span>
                </div>
                <div>
                  <div className="font-medium text-foreground">{transaction.user}</div>
                  <div className="text-sm text-foreground/60">{transaction.plan}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-green-500">{transaction.amount}</div>
                <div className="text-sm text-foreground/60">{transaction.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}