"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import UsersTable, { User } from "../_components/UsersTable";

const mockUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    roadmaps: 5,
    joined: "2024-01-15",
    status: "Verified",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    roadmaps: 3,
    joined: "2024-02-20",
    status: "Verified",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    roadmaps: 8,
    joined: "2024-03-10",
    status: "Not Verified",
  },
];

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Verified" | "Not Verified"
  >("All");

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Users</h1>
        <p className="text-foreground/60">Manage all platform users</p>
      </div>

      {/* Filters */}
      <div className="bg-background rounded-2xl border border-border p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-grey border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as typeof statusFilter)
            }
            className="bg-grey border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="All">All Users</option>
            <option value="Verified">Verified</option>
            <option value="Not Verified">Not Verified</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <UsersTable users={filteredUsers} />
    </div>
  );
}
