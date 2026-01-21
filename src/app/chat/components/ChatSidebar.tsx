"use client";

import { useState } from "react";
import Image from "next/image";
import { SquarePen, Search, GitBranch, PanelLeft } from "lucide-react";
import clsx from "clsx";
import SearchChatModal from "./SearchChatModal";


const roadmaps = [
  "React Roadmap",
  "Next Roadmap",
  "Python Roadmap",
  "Network Programming Roadmap",
];

//  Mock chat history (replace later with real data)
const chatHistory = [
  "React roadmap for beginners",
  "Next.js app router explanation",
  "Python backend roadmap",
  "Networking basics",
];

interface ChatSidebarProps { 
  onNewChat: () => void;
}

export default function ChatSidebar({ onNewChat }: ChatSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);

  return (
    <>
      <aside className={clsx(
        "h-screen bg-background border-r border-border flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-75"
      )}>
        {/* Header */}
        <div className="relative flex items-center px-4 py-4 justify-between">
          {!collapsed ? (
            <>
              <Image src="/logo.svg" alt="bato.ai" width={100} height={28} style={{ objectFit: "contain" }} />
              <HoverButton onClick={() => setCollapsed(true)} tooltip="Close sidebar" />
            </>
          ) : (
            <HoverButtonCollapsed onClick={() => setCollapsed(false)} tooltip="Open sidebar" />
          )}
        </div>

        {/* Actions */}
        <div className="mt-2 flex flex-col items-center gap-1 px-2">
          <SidebarItem icon={<SquarePen size={18}/>} label="New Chat" collapsed={collapsed} onClick={onNewChat} />
          <SidebarItem icon={<Search size={18}/>} label="Search Chat" collapsed={collapsed} onClick={() => setOpenSearch(true)} />
        </div>

        {/* Roadmaps */}
        {!collapsed && <p className="mt-6 px-4 text-foreground text-[14px] font-medium transition-colors">Roadmaps</p>}
        <div className="mt-2 flex flex-col items-center gap-1 px-2">
          {collapsed ? (
            <SidebarItem icon={<GitBranch size={18}/>} label="Roadmaps" collapsed />
          ) : (
            roadmaps.map((item,i) => <SidebarItem key={i} icon={<GitBranch size={18}/>} label={item} collapsed={false} />)
          )}
        </div>
        <div className="flex-1" />
      </aside>

      {/* Search Modal */}
      <SearchChatModal
        open={openSearch}
        chats={chatHistory}
        onClose={() => setOpenSearch(false)}
        onSelectChat={(chat) => console.log("Selected:", chat)}
        onNewChat={onNewChat}
      />
    </>
  );
}

function SidebarItem({ icon, label, collapsed, onClick }: { icon: React.ReactNode; label: string; collapsed: boolean; onClick?: () => void }) {
  return (
    <div className="relative group w-full flex justify-center">
      <button onClick={onClick} className={clsx(
        "flex items-center w-full rounded-md transition-colors hover:bg-muted/50",
        "text-foreground text-[14px]",
        collapsed ? "justify-center h-10" : "gap-3 px-3 py-2 justify-start"
      )}>
        <span>{icon}</span>
        {!collapsed && <span className="truncate">{label}</span>}
      </button>

      {collapsed && (
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition z-50 pointer-events-none">
          <div className="bg-muted text-foreground text-xs px-3 py-1.5 rounded-md shadow-lg whitespace-nowrap">{label}</div>
        </div>
      )}
    </div>
  );
}

function HoverButton({ onClick, tooltip }: { onClick: () => void; tooltip: string }) {
  return (
    <div className="relative group">
      <button onClick={onClick} className="w-10 h-10 flex items-center justify-center text-foreground transition-colors">
        <PanelLeft size={18} />
        <Tooltip text={tooltip} />
      </button>
    </div>
  );
}

function HoverButtonCollapsed({ onClick, tooltip }: { onClick: () => void; tooltip: string }) {
  return (
    <div className="relative group w-10 h-10">
      <button onClick={onClick} className="w-full h-full flex items-center justify-center">
        <Image src="/images/bato.png" alt="bato.ai" width={28} height={28} style={{ objectFit: "contain" }} />
        <Tooltip text={tooltip} />
      </button>
    </div>
  );
}

function Tooltip({ text }: { text: string }) {
  return (
    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition z-50 pointer-events-none">
      <div className="bg-muted text-foreground text-xs px-3 py-1.5 rounded-md shadow-lg whitespace-nowrap">{text}</div>
    </div>
  );
}
