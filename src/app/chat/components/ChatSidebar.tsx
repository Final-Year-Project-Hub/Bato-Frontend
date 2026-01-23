"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  SquarePen,
  Search,
  GitBranch,
  PanelLeft,
  MessageSquare,
  LogOut,
} from "lucide-react";
import clsx from "clsx";
import SearchChatModal from "./SearchChatModal";
import { useRouter, usePathname } from "next/navigation";
import { useChat } from "@/lib/hooks/useChat";
import { useAuth } from "@/app/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/button";
import LogoutModal from "./LogoutModal";
import { apiFetch } from "@/lib/api";

const roadmaps = [
  "React Roadmap",
  "Next Roadmap",
  "Python Roadmap",
  "Network Programming Roadmap",
];

type ChatItem = {
  id: string;
  title: string;
  updatedAt?: string;
};

export default function ChatSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [showLogout, setShowLogout] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const auth = useAuth();
  const userId = auth.user?.id;
  const email = auth.user?.email || "";
  const displayName = auth.user?.name || auth.user?.email || "User";
  const initial = (displayName?.trim()?.[0] || "U").toUpperCase();

  const { getChats } = useChat();
  const [isLoadingChats, setIsLoadingChats] = useState(false);

  // Get current chat ID from pathname
  const currentChatId = useMemo(() => {
    const match = pathname?.match(/\/chat\/([^/]+)/);
    return match?.[1] ?? null;
  }, [pathname]);

  const handleNewChat = useCallback(() => {
    router.push("/chat");
  }, [router]);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    (async () => {
      try {
        setIsLoadingChats(true);

        const res = await getChats(userId);

        if (cancelled) return;

        if (res?.success && Array.isArray(res.data)) {
          const mapped: ChatItem[] = res.data.map((c: any) => ({
            id: c.id,
            title: c.title || c.lastMessage || c.preview || "New chat",
            updatedAt: c.updatedAt,
          }));
          setChats(mapped);
        }
      } catch (e) {
        if (!cancelled) console.error("Failed to load chats:", e);
      } finally {
        if (!cancelled) setIsLoadingChats(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, getChats]);

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

  const chatTitles = useMemo(() => chats.map((c) => c.title), [chats]);

  const onSelectChatTitle = useCallback(
    (title: string) => {
      const found = chats.find((c) => c.title === title);
      if (found) router.push(`/chat/${found.id}`);
    },
    [chats, router],
  );

  return (
    <>
      <aside
        className={clsx(
          "h-screen bg-background/10 border-r border-border flex flex-col transition-all duration-300 overflow-hidden",
          collapsed ? "w-16" : "w-75",
        )}
      >
        {/* Header */}
        <div className="relative flex items-center px-4 py-4 justify-between">
          {!collapsed ? (
            <>
              <Image
                src="/logo.svg"
                alt="bato.ai"
                width={100}
                height={28}
                style={{ objectFit: "contain" }}
              />
              <HoverButton
                onClick={() => setCollapsed(true)}
                tooltip="Close sidebar"
              />
            </>
          ) : (
            <HoverButtonCollapsed
              onClick={() => setCollapsed(false)}
              tooltip="Open sidebar"
            />
          )}
        </div>

        {/* Actions */}
        <div className="mt-2 flex flex-col items-center gap-1 px-2">
          <SidebarItem
            icon={<SquarePen size={18} />}
            label="New Chat"
            collapsed={collapsed}
            onClick={handleNewChat}
          />
          <SidebarItem
            icon={<Search size={18} />}
            label="Search Chat"
            collapsed={collapsed}
            onClick={() => setOpenSearch(true)}
          />
          <SidebarItem
            icon={<GitBranch size={18} />}
            label="Roadmaps"
            collapsed={collapsed}
            onClick={() => router.push("/dashboard/my-roadmaps")}
          />
        </div>

        {/* Chats title */}
        {!collapsed && (
          <p className="mt-6 px-4 text-foreground text-[14px] font-medium">
            Chats
          </p>
        )}

        {/* Scrollable chats area */}
        <div className="mt-2 px-2 flex-1 min-h-0 overflow-y-auto">
          {collapsed ? (
            <SidebarItem
              icon={<MessageSquare size={18} />}
              label="Chats"
              collapsed
            />
          ) : (
            <>
              {isLoadingChats && (
                <div className="px-3 py-2 text-xs text-muted-foreground">
                  Loading...
                </div>
              )}

              {!isLoadingChats && chats.length === 0 && (
                <div className="px-3 py-2 text-xs text-muted-foreground">
                  No chats yet
                </div>
              )}

              <div className="space-y-1 pb-2">
                {chats.map((c) => (
                  <SidebarLinkItem
                    key={c.id}
                    icon={<MessageSquare size={18} />}
                    label={c.title}
                    href={`/chat/${c.id}`}
                    isActive={currentChatId === c.id}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/*  Roadmaps pinned at bottom */}
        {/* <div className="border-t border-border pt-3 pb-4">
          {!collapsed && (
            <p className="px-4 text-foreground text-[14px] font-medium transition-colors">
              Roadmaps
            </p>
          )}

          <div className="mt-2 flex flex-col items-center gap-1 px-2">
            {collapsed ? (
              <SidebarItem
                icon={<GitBranch size={18} />}
                label="Roadmaps"
                collapsed
              />
            ) : (
              roadmaps.map((item, i) => (
                <SidebarItem
                  key={i}
                  icon={<GitBranch size={18} />}
                  label={item}
                  collapsed={false}
                />
              ))
            )}
          </div>
        </div> */}

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
                <p className="text-xs text-muted-foreground truncate">
                  {email}
                </p>
              </div>
            </div>

            {/* Right: logout */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLogout(true)}
              className="text-white hover:text-foreground"
            >
              <LogOut className="h-4 w-4 mr-2" />
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
      <SearchChatModal
        open={openSearch}
        chats={chatTitles}
        onClose={() => setOpenSearch(false)}
        onSelectChat={onSelectChatTitle}
        onNewChat={handleNewChat}
      />
    </>
  );
}

/* --- Link-based sidebar item for chats (prevents full page reload) --- */

function SidebarLinkItem({
  icon,
  label,
  href,
  isActive,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
}) {
  return (
    <div className="relative group w-full flex justify-center">
      <Link
        href={href}
        prefetch={true}
        className={clsx(
          "flex items-center w-full rounded-md transition-colors",
          "text-foreground text-[14px]",
          "gap-3 px-3 py-2 justify-start",
          isActive ? "bg-muted" : "hover:bg-muted/50",
        )}
      >
        <span>{icon}</span>
        <span className="truncate">{label}</span>
      </Link>
    </div>
  );
}

/* --- components below unchanged --- */

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
          "flex items-center w-full rounded-md transition-colors hover:bg-muted/50",
          "text-foreground text-[14px]",
          collapsed ? "justify-center h-10" : "gap-3 px-3 py-2 justify-start",
        )}
      >
        <span>{icon}</span>
        {!collapsed && <span className="truncate">{label}</span>}
      </button>

      {collapsed && (
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition z-50 pointer-events-none">
          <div className="bg-muted text-foreground text-xs px-3 py-1.5 rounded-md shadow-lg whitespace-nowrap">
            {label}
          </div>
        </div>
      )}
    </div>
  );
}

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
        className="w-10 h-10 flex items-center justify-center text-foreground transition-colors"
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
        <Image
          src="/images/bato.png"
          alt="bato.ai"
          width={28}
          height={28}
          style={{ objectFit: "contain" }}
        />
        <Tooltip text={tooltip} />
      </button>
    </div>
  );
}

function Tooltip({ text }: { text: string }) {
  return (
    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition z-50 pointer-events-none">
      <div className="bg-muted text-foreground text-xs px-3 py-1.5 rounded-md shadow-lg whitespace-nowrap">
        {text}
      </div>
    </div>
  );
}
