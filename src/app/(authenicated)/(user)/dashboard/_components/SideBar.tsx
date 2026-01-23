"use client";

import Image from "next/image";
import {
  PanelLeft,
  ChartLine,
  Waypoints,
  Settings,
  MessageCircle,
  Plus,
  LogOut,
} from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/features/auth/hooks/useAuth";
import { useState } from "react";
import LogoutModal from "@/app/chat/components/LogoutModal";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";

type ViewType = "dashboard" | "settings" | "roadmaps" | "chat";

const menuItems = [
  { label: "My Roadmaps", icon: Waypoints, view: "roadmaps" as ViewType },
  { label: "Chat", icon: MessageCircle, view: "chat" as ViewType },
  { label: "Settings", icon: Settings, view: "settings" as ViewType },
];

export default function SideBar({
  collapsed,
  onCollapsedChange,
  currentView,
  onViewChange,
}: {
  collapsed: boolean;
  onCollapsedChange: (v: boolean) => void;
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}) {
  const [showLogout, setShowLogout] = useState(false);
  const router = useRouter();

  const auth = useAuth();
  console.log("auth user", auth);
  const userId = auth.user?.id;
  const email = auth.user?.email || "";
  const displayName = auth.user?.name || auth.user?.email || "User";
  const initial = (displayName?.trim()?.[0] || "U").toUpperCase();

  const handleLogout = async () => {
    try {
      // backend logout
      await apiFetch("/auth/logout", { method: "POST" });
    } catch (e) {
      console.error("Backend logout failed (continuing):", e);
    }

    try {
      // clear localhost cookies used by middleware
      await fetch("/api/session/clear", { method: "POST" });
    } catch (e) {
      console.error("Local cookie clear failed:", e);
    }

    //  update auth UI state
    await auth.refresh();

    // hard redirect so no cached protected UI remains
    router.replace("/login");
    router.refresh();
  };

  return (
    <aside
      className={clsx(
        "h-screen bg-background border-r border-white/5 flex flex-col transition-all duration-300 overflow-hidden",
        collapsed ? "w-16" : "w-72",
      )}
    >
      {/* Header */}
      <div className="relative flex items-center px-4 py-4 justify-between">
        {!collapsed ? (
          <>
            <Image src="/logo.svg" alt="bato.ai" width={100} height={28} />
            <HoverButton
              onClick={() => onCollapsedChange(true)}
              tooltip="Close sidebar"
            />
          </>
        ) : (
          <HoverButtonCollapsed
            onClick={() => onCollapsedChange(false)}
            tooltip="Open sidebar"
          />
        )}
      </div>

      {/* Dashboard */}
      <div className="mt-2 flex flex-col items-center gap-1 px-2">
        <SidebarItem
          icon={<ChartLine size={18} />}
          label="Dashboard"
          collapsed={collapsed}
          active={currentView === "dashboard"}
          onClick={() => onViewChange("dashboard")}
        />
      </div>

      {/* Menu Items */}
      <div className="mt-2 flex flex-col items-center gap-1 px-2">
        {menuItems.map(({ label, icon: Icon, view }) => (
          <SidebarItem
            key={label}
            icon={<Icon size={18} />}
            label={label}
            collapsed={collapsed}
            active={currentView === view}
            onClick={() => onViewChange(view)}
          />
        ))}
      </div>

      <div className="flex-1" />
      <div className="w-full border-t border-grey px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Left: avatar + info */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Initial circle */}
            <div className="h-9 w-9 rounded-full bg-primary/15 text-primary flex items-center justify-center font-semibold">
              {initial}
            </div>

            {/* Name + email */}
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {auth.user?.name ?? "User"}
              </p>
              <p className="text-xs text-muted-foreground truncate">{email}</p>
            </div>
          </div>

          {/* Right: logout */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLogout(true)}
            className="text-white hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
          </Button>
          <LogoutModal
            open={showLogout}
            onClose={() => setShowLogout(false)}
            onConfirm={async () => {
              setShowLogout(false);
              await handleLogout();
            }}
          />
        </div>
      </div>
    </aside>
  );
}

/* Sidebar Item */
function SidebarItem({
  icon,
  label,
  collapsed,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <div className="relative group w-full flex justify-center">
      <button
        onClick={onClick}
        className={clsx(
          "flex items-center w-full rounded-md transition",
          "text-foreground text-[14px]",
          collapsed ? "justify-center h-10" : "gap-3 px-3 py-2 justify-start",
          active ? "bg-primary/10 text-primary" : "hover:bg-grey",
        )}
      >
        <span>{icon}</span>
        {!collapsed && <span className="truncate">{label}</span>}
      </button>

      {collapsed && (
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition z-50 pointer-events-none">
          <div className="bg-[#2A2A2A] text-white text-xs px-3 py-1.5 rounded-md shadow-lg whitespace-nowrap">
            {label}
          </div>
        </div>
      )}
    </div>
  );
}

/* Hover Buttons */
function HoverButton({
  onClick,
  tooltip,
}: {
  onClick: () => void;
  tooltip: string;
}) {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className="w-10 h-10 flex items-center justify-center text-foreground"
      >
        <PanelLeft size={18} />
        <Tooltip text={tooltip} />
      </button>
    </div>
  );
}

function HoverButtonCollapsed({
  onClick,
  tooltip,
}: {
  onClick: () => void;
  tooltip: string;
}) {
  return (
    <div className="relative group w-10 h-10">
      <button
        onClick={onClick}
        className="w-full h-full flex items-center justify-center"
      >
        <Image src="/images/bato.png" alt="bato.ai" width={28} height={28} />
        <Tooltip text={tooltip} />
      </button>
    </div>
  );
}

function Tooltip({ text }: { text: string }) {
  return (
    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition z-50 pointer-events-none">
      <div className="bg-[#2A2A2A] text-white text-xs px-3 py-1.5 rounded-md shadow-lg whitespace-nowrap">
        {text}
      </div>
    </div>
  );
}
