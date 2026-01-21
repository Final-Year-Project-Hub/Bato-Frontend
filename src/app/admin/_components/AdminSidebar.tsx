"use client";


import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Map,
  FileText,
  DollarSign,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import clsx from "clsx";

const menuItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/admin" },
  { label: "Users", icon: Users, href: "/admin/users" },
  { label: "Roadmaps", icon: Map, href: "/admin/roadmap" },
  { label: "Documents", icon: FileText, href: "/admin/documents" },
  { label: "Revenue", icon: DollarSign, href: "/admin/revenue" },
  { label: "Settings", icon: Settings, href: "/admin/settings" },
];

export default function AdminSidebar({
  collapsed,
  onCollapsedChange,
}: {
  collapsed: boolean;
  onCollapsedChange: (v: boolean) => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={clsx(
        "h-screen bg-background border-r border-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <h2 className="text-lg font-bold text-foreground">Admin Panel</h2>
        )}
        <button
          onClick={() => onCollapsedChange(!collapsed)}
          className="p-2 hover:bg-grey rounded-lg transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="p-2 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-3 rounded-lg transition-all",
                collapsed ? "justify-center" : "",
                isActive
                  ? "bg-primary text-white"
                  : "text-foreground/70 hover:bg-grey hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}