"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Map,
  FileText,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import clsx from "clsx";
import { useState } from "react";

import LogoutModal from "../../chat/components/LogoutModal";

const menuItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/admin" },
  { label: "Users", icon: Users, href: "/admin/users" },
  { label: "Roadmaps", icon: Map, href: "/admin/roadmap" },
  { label: "Documents", icon: FileText, href: "/admin/documents" },
  { label: "Revenue", icon: DollarSign, href: "/admin/revenue" },
];

export default function AdminSidebar({
  collapsed,
  onCollapsedChange,
}: {
  collapsed: boolean;
  onCollapsedChange: (v: boolean) => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <>
      <aside
        className={clsx(
          "h-screen bg-background border-r border-border transition-all duration-300 flex flex-col",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!collapsed && (
            <h2 className="text-lg font-bold text-foreground">
              Admin Panel
            </h2>
          )}
          <button
            onClick={() => onCollapsedChange(!collapsed)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Menu */}
        <nav className="p-2 space-y-1 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 px-3 py-3 rounded-lg transition-all",
                  collapsed && "justify-center",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && (
                  <span className="text-sm font-medium">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Logout */}
          <button
            onClick={() => setLogoutOpen(true)}
            className={clsx(
              "flex w-full items-center gap-3 px-3 py-3 rounded-lg transition-all",
              collapsed && "justify-center",
              "text-foreground/70 hover:bg-muted hover:text-foreground"
            )}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && (
              <span className="text-sm font-medium">
                Logout
              </span>
            )}
          </button>
        </nav>
      </aside>

      {/* Logout Modal */}
      <LogoutModal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={() => {
          // clear auth here later (token / cookie)
          setLogoutOpen(false);
          router.push("/login");
        }}
      />
    </>
  );
}
