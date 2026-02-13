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
  Trash,
  Loader2,
} from "lucide-react";
import clsx from "clsx";
import SearchChatModal from "./SearchChatModal";
import { useRouter, usePathname } from "next/navigation";
import { useChat } from "@/lib/hooks/useChat";
import { useAuth } from "@/app/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/button";
import LogoutModal from "./LogoutModal";
import { apiFetch } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

type ChatItem = {
  id: string;
  title: string;
  updatedAt?: string;
};

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ChatSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [showLogout, setShowLogout] = useState(false);

  // delete dialog state
  const [deleteChatId, setDeleteChatId] = useState<string | null>(null);
  const [deleteChatTitle, setDeleteChatTitle] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const auth = useAuth();
  const userId = auth.user?.id;
  const email = auth.user?.email || "";
  const displayName = auth.user?.name || auth.user?.email || "User";
  const initial = (displayName?.trim()?.[0] || "U").toUpperCase();
  const userImage = auth.user?.image;
  const avatarSrc = userImage?.trim() ? userImage : undefined;

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
        toast.error("Failed to load chats. Please try again.");
      } finally {
        if (!cancelled) setIsLoadingChats(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, getChats]);

  const handleLogout = async () => {
    toast.loading("Logging out...");

    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch {
      toast.error("Error Logging Out.");
    }

    try {
      await fetch("/api/session/clear", { method: "POST" });
    } catch {
      toast.error("Error Logging Out.");
    }

    await auth.refresh();

    toast.dismiss();
    toast.success("Logged out successfully");

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

  // open confirm dialog from item
  const onRequestDelete = useCallback(
    (id: string) => {
      const found = chats.find((c) => c.id === id);
      setDeleteChatId(id);
      setDeleteChatTitle(found?.title || "this chat");
    },
    [chats],
  );

  const closeDeleteDialog = useCallback(() => {
    if (isDeleting) return;
    setDeleteChatId(null);
    setDeleteChatTitle("");
  }, [isDeleting]);

  // confirm delete -> call API + update UI + redirect if active
  const confirmDelete = useCallback(async () => {
    if (!deleteChatId) return;

    const toastId = toast.loading("Deleting chat...");

    try {
      setIsDeleting(true);

      if (!baseUrl) throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");

      const res = await fetch(`${baseUrl}/api/chats/${deleteChatId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || `Delete failed (${res.status})`);
      }

      setChats((prev) => prev.filter((c) => c.id !== deleteChatId));

      // if you deleted the chat you're currently viewing
      if (currentChatId === deleteChatId) {
        router.push("/chat");
      }

      toast.success("Chat deleted", { id: toastId });
      setDeleteChatId(null);
      setDeleteChatTitle("");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to delete chat", { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  }, [deleteChatId, currentChatId, router]);

  return (
    <>
      <aside
        className={clsx(
          "h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 overflow-hidden",
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
          <p className="mt-6 px-4 text-sidebar-foreground text-[14px] font-medium">
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
                <div className="px-3 py-2 text-xs text-sidebar-foreground/60">
                  Loading...
                </div>
              )}

              {!isLoadingChats && chats.length === 0 && (
                <div className="px-3 py-2 text-xs text-sidebar-foreground/60">
                  No chats yet
                </div>
              )}

              <div className="space-y-1 pb-2">
                {chats.map((c) => (
                  <SidebarLinkItem
                    key={c.id}
                    id={c.id}
                    icon={<MessageSquare size={18} />}
                    label={c.title}
                    href={`/chat/${c.id}`}
                    isActive={currentChatId === c.id}
                    onDelete={onRequestDelete}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* User Profile Section */}
        <div className="w-full border-t border-sidebar-border px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Left: avatar + info - clickable to go to settings */}
            <button
              onClick={() => router.push("/dashboard/settings")}
              className="flex items-center gap-3 min-w-0 hover:bg-sidebar-accent/50 rounded-md px-2 py-1.5 transition-colors flex-1"
            >
              <Avatar className="h-9 w-9 shrink-0">
                {avatarSrc ? (
                  <AvatarImage
                    src={userImage || ""}
                    alt={displayName}
                    className="object-cover"
                  />
                ) : null}
                <AvatarFallback className="bg-primary/15 text-primary font-semibold">
                  {initial}
                </AvatarFallback>
              </Avatar>

              {!collapsed && (
                <div className="min-w-0 text-left flex-1">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">
                    {auth.user?.name ?? "User"}
                  </p>
                  <p className="text-xs text-sidebar-foreground/60 truncate">
                    {email}
                  </p>
                </div>
              )}
            </button>

            {!collapsed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLogout(true)}
                className="text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent shrink-0"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            )}

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
        chatIds={chats.map((c) => c.id)}
        onClose={() => setOpenSearch(false)}
        onSelectChat={onSelectChatTitle}
        onNewChat={handleNewChat}
      />

      {/* Delete confirm dialog */}
      <Dialog
        open={!!deleteChatId}
        onOpenChange={(open) => !open && closeDeleteDialog()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete chat?</DialogTitle>
            <DialogDescription>
              This will permanently delete{" "}
              <span className="font-semibold">{deleteChatTitle}</span>. This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-4 sm:gap-0">
            <Button
              variant="outline"
              onClick={closeDeleteDialog}
              disabled={isDeleting}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="gap-2 ml-2"
            >
              {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* --- Link-based sidebar item for chats --- */

function SidebarLinkItem({
  id,
  icon,
  label,
  href,
  isActive,
  onDelete,
}: {
  id: string;
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="relative group w-full flex justify-between">
      <Link
        href={href}
        prefetch={true}
        className={clsx(
          "flex items-center w-full rounded-l-md transition-colors",
          "text-sidebar-foreground text-[14px]",
          "gap-3 px-3 py-2 justify-start",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
        )}
      >
        <span>{icon}</span>
        <span className="truncate">{label}</span>
      </Link>

      <button
        onClick={(e) => {
          e.preventDefault(); 
          e.stopPropagation();
          onDelete(id);
        }}
        aria-label="Delete chat"
        className={clsx(
          "transition-colors cursor-pointer",
          "text-sidebar-foreground pr-2 rounded-r-md text-[14px]",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "group-hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
        )}
      >
        <Trash className="w-4 h-4" />
      </button>
    </div>
  );
}

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
          "flex items-center w-full rounded-md transition-colors",
          "text-sidebar-foreground text-[14px]",
          "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
          collapsed ? "justify-center h-10" : "gap-3 px-3 py-2 justify-start",
        )}
      >
        <span>{icon}</span>
        {!collapsed && <span className="truncate">{label}</span>}
      </button>

      {collapsed && (
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition z-50 pointer-events-none">
          <div className="bg-popover text-popover-foreground text-xs px-3 py-1.5 rounded-md shadow-lg whitespace-nowrap border border-border">
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
        className="w-10 h-10 flex items-center justify-center text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors"
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
      <div className="bg-popover text-popover-foreground text-xs px-3 py-1.5 rounded-md shadow-lg whitespace-nowrap border border-border">
        {text}
      </div>
    </div>
  );
}
