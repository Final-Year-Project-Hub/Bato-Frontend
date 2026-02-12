"use client";

import { Users, Map, DollarSign, Cpu, BadgeQuestionMark, FileText } from "lucide-react";
import StatsCard from "./_components/StatsCard";
import { useEffect, useState } from "react";

interface DashboardStats {
  totalUsers: number;
  totalRoadmaps: number;
  revenue: number;
  llmCosts: number;
  totalDocuments: number;
  quizzesAttempted: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalRoadmaps: 0,
    revenue: 0,
    llmCosts: 0,
    totalDocuments: 0,
    quizzesAttempted: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        
        // Fetch users data (includes roadmaps info)
        const usersResponse = await fetch(`${baseUrl}/api/user/getAllUsers`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        let totalUsers = 0;
        let totalRoadmaps = 0;

        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          if (usersData?.data && Array.isArray(usersData.data)) {
            totalUsers = usersData.data.length;
            
            // Count total roadmaps from all users
            totalRoadmaps = usersData.data.reduce((count: number, user: any) => {
              return count + (user.roadmaps?.length || 0);
            }, 0);
          }
        }

        // Fetch quiz attempts
        const quizResponse = await fetch(`${baseUrl}/api/quiz/quizAttempts`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        let quizCount = 0;
        if (quizResponse.ok) {
          const quizData = await quizResponse.json();
          quizCount = Array.isArray(quizData) ? quizData.length : 0;
        }

        setStats({
          totalUsers: totalUsers,
          totalRoadmaps: totalRoadmaps,
          revenue: 12450, // TODO: Add revenue API
          llmCosts: 3200, // TODO: Add LLM costs API
          totalDocuments: 3, // TODO: Add documents API
          quizzesAttempted: quizCount,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardStats();
  }, []);

  const statsCards = [
    { 
      title: "Total Users", 
      value: loading ? "..." : stats.totalUsers.toLocaleString(), 
      icon: Users, 
      color: "bg-blue-500" 
    },
    { 
      title: "Total Roadmaps", 
      value: loading ? "..." : stats.totalRoadmaps.toString(), 
      icon: Map, 
      color: "bg-purple-500" 
    },
    { 
      title: "Revenue", 
      value: loading ? "..." : `Rs${stats.revenue.toLocaleString()}`, 
      icon: DollarSign, 
      color: "bg-green-500" 
    },
    { 
      title: "LLM Costs", 
      value: loading ? "..." : `$${stats.llmCosts.toLocaleString()}`, 
      icon: Cpu, 
      color: "bg-orange-500" 
    },
    { 
      title: "Documents", 
      value: loading ? "..." : stats.totalDocuments.toString(), 
      icon: FileText, 
      color: "bg-indigo-500" 
    },
    { 
      title: "Quizzes Attempted", 
      value: loading ? "..." : stats.quizzesAttempted.toString(), 
      icon: BadgeQuestionMark, 
      color: "bg-pink-500" 
    },
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
        {statsCards.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
}