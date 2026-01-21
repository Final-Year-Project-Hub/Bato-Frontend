"use client";

import { Users, Clock, Code, Database, Globe, Smartphone, Cpu, Cloud, Lock, BarChart } from "lucide-react";

const roadmapIcons = {
  "React Development": Code,
  "Node.js Backend": Database,
  "Full Stack Web": Globe,
  "Mobile Development": Smartphone,
  "Python for AI": Cpu,
  "Machine Learning": BarChart,
  "Cloud Computing": Cloud,
  "Cybersecurity": Lock,
  "Data Science": BarChart,
};

const mockRoadmaps = [
  { id: 1, title: "React Development", users: 234, estimatedHours: 120, completion: 67, color: "bg-blue-500" },
  { id: 2, title: "Node.js Backend", users: 189, estimatedHours: 150, completion: 54, color: "bg-green-500" },
  { id: 3, title: "Python for AI", users: 201, estimatedHours: 180, completion: 45, color: "bg-purple-500" },
  { id: 4, title: "Mobile Development", users: 167, estimatedHours: 140, completion: 72, color: "bg-pink-500" },
  { id: 5, title: "Full Stack Web", users: 312, estimatedHours: 200, completion: 58, color: "bg-orange-500" },
  { id: 6, title: "Machine Learning", users: 145, estimatedHours: 220, completion: 41, color: "bg-indigo-500" },
  { id: 7, title: "Cloud Computing", users: 98, estimatedHours: 160, completion: 65, color: "bg-cyan-500" },
  { id: 8, title: "Cybersecurity", users: 176, estimatedHours: 170, completion: 52, color: "bg-red-500" },
  { id: 9, title: "Data Science", users: 221, estimatedHours: 190, completion: 48, color: "bg-teal-500" },
];

export default function RoadmapsTable() {
  return (
    <div className="bg-background rounded-2xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-grey border-b border-border">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Roadmap</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Users Enrolled</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Duration</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Avg Completion</th>
            </tr>
          </thead>
          <tbody>
            {mockRoadmaps.map((roadmap) => {
              const Icon = roadmapIcons[roadmap.title as keyof typeof roadmapIcons] || Code;
              return (
                <tr key={roadmap.id} className="border-b border-border hover:bg-grey/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${roadmap.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-medium text-foreground">{roadmap.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-foreground/70">
                      <Users className="w-4 h-4" />
                      {roadmap.users}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-foreground/70">
                      <Clock className="w-4 h-4" />
                      {roadmap.estimatedHours}h
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-grey rounded-full h-2 max-w-30">
                        <div
                          className={`${roadmap.color} h-2 rounded-full transition-all`}
                          style={{ width: `${roadmap.completion}%` }}
                        />
                      </div>
                      <span className="text-sm text-foreground/70 min-w-10">{roadmap.completion}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}