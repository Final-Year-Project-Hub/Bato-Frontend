"use client";

import { Mail, Calendar } from "lucide-react";

export type User = {
  id: number;
  name: string;
  email: string;
  roadmaps: number;
  joined: string;
  status: "Verified" | "Not Verified";
};

export default function UsersTable({ users }: { users: User[] }) {
  return (
    <div className="bg-background rounded-2xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-grey border-b border-border">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                User
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                Email
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                Roadmaps
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                Joined
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-border hover:bg-grey/50 transition-colors"
              >
                {/* User */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold">
                        {user.name[0]}
                      </span>
                    </div>
                    <span className="font-medium text-foreground">
                      {user.name}
                    </span>
                  </div>
                </td>

                {/* Email */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-foreground/70">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </div>
                </td>

                {/* Roadmaps */}
                <td className="px-6 py-4 text-foreground">
                  {user.roadmaps}
                </td>

                {/* Joined */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-foreground/70">
                    <Calendar className="w-4 h-4" />
                    {user.joined}
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.status === "Verified"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
              </tr>
            ))}

            {/* Empty state */}
            {users.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-foreground/60"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
