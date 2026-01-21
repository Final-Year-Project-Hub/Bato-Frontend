"use client";

import { MoreVertical, Mail, Calendar } from "lucide-react";

const mockUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", roadmaps: 5, joined: "2024-01-15", status: "Active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", roadmaps: 3, joined: "2024-02-20", status: "Active" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", roadmaps: 8, joined: "2024-03-10", status: "Inactive" },
];

export default function UsersTable() {
  return (
    <div className="bg-background rounded-2xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-grey border-b border-border">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">User</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Email</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Roadmaps</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Joined</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Status</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map((user) => (
              <tr key={user.id} className="border-b border-border hover:bg-grey/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold">{user.name[0]}</span>
                    </div>
                    <span className="font-medium text-foreground">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-foreground/70">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </div>
                </td>
                <td className="px-6 py-4 text-foreground">{user.roadmaps}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-foreground/70">
                    <Calendar className="w-4 h-4" />
                    {user.joined}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.status === "Active" 
                      ? "bg-green-500/10 text-green-500" 
                      : "bg-red-500/10 text-red-500"
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="p-2 hover:bg-grey rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}