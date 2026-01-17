"use client";

import { useState } from "react";
import Image from "next/image";
import {
  PanelLeft,
  ChartLine,
  Waypoints,
  Settings,
  MessageCircle,
  Plus,
} from "lucide-react";
import clsx from "clsx";

const roadmaps = [
  { label: "My Roadmaps", icon: Waypoints },
  { label: "Create Roadmap", icon: Plus },
  { label: "Chat", icon: MessageCircle },
  { label: "Settings", icon: Settings },
];

export default function SideBar({
  collapsed,
  onCollapsedChange,
}: {
  collapsed: boolean;
  onCollapsedChange: (v: boolean) => void;
}) {
  const [openSearch, setOpenSearch] = useState(false);

  return (
    <>
      <aside
        className={clsx(
          "h-screen bg-background border-l border-white/5 flex flex-col transition-all duration-300 ease-in-out",
          collapsed ? "w-16" : "w-75"
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

        {/* Actions */}
        <div className="mt-2 flex flex-col items-center gap-1 px-2">
          <SidebarItem
            icon={<ChartLine size={18} />}
            label="Dashboard"
            collapsed={collapsed}
            onClick={() => setOpenSearch(true)}
          />
        </div>

        {/* Roadmaps */}
        <div className="mt-5 flex flex-col items-center gap-1 px-2">
          {collapsed
            ? roadmaps.map(({ label, icon: Icon }) => (
                <SidebarItem
                  key={label}
                  icon={<Icon size={18} />}
                  label={label}
                  collapsed={true}
                />
              ))
            : roadmaps.map(({ label, icon: Icon }) => (
                <SidebarItem
                  key={label}
                  icon={<Icon size={18} />}
                  label={label}
                  collapsed={false}
                />
              ))}
        </div>

        <div className="flex-1" />
      </aside>
    </>
  );
}

/* Sidebar Item */
function SidebarItem({
  icon,
  label,
  collapsed,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  onClick?: () => void;
}) {
  return (
    <div className="relative group w-full flex justify-center">
      <button
        onClick={onClick}
        className={clsx(
          "flex items-center w-full rounded-md transition hover:bg-grey",
          "text-foregroound text-[14px]",
          collapsed ? "justify-center h-10" : "gap-3 px-3 py-2 justify-start"
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
