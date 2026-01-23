"use client";

import { useState } from "react";
import { Search, X, SquarePen, MessageCircle } from "lucide-react";

interface SearchChatModalProps {
  open: boolean;
  chats: string[];
  onClose: () => void;
  onSelectChat: (chat: string) => void;
  onNewChat: () => void;
}

export default function SearchChatModal({
  open,
  chats,
  onClose,
  onSelectChat,
  onNewChat,
}: SearchChatModalProps) {
  const [query, setQuery] = useState("");

  if (!open) return null;

  const filteredChats = chats.filter((chat) =>
    chat.toLowerCase().includes(query.toLowerCase())
  );

  const handleClose = () => {
    setQuery("");
    onClose();
  };

  const handleNewChat = () => {
    setQuery("");
    onClose();
    onNewChat();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      {/* 🔲 Modal */}
      <div className="w-full max-w-xl h-[60vh] rounded-2xl bg-[#1E1E1E] shadow-xl flex flex-col">
        {/* 🔍 Search +  Close Row */}
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          {/* 🔍 Search */}
          <div className="flex flex-1 items-center gap-2 rounded-full bg-[#2A2A2A] px-4 py-2">
            <Search size={16} className="text-white/50" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search chats..."
              className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-gray-400"
            />
          </div>

          {/* ❌ Close */}
          <button
            onClick={handleClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* ➕ New Chat */}
        <button
          onClick={handleNewChat}
          className="mx-2 mb-2 flex items-center gap-2 rounded-md px-3 py-2 text-sm text-white/80 hover:bg-white/10"
        >
          <SquarePen size={16} />
          New chat
        </button>

        {/* 📜 Results */}
        <div className="flex-1 overflow-y-auto px-2">
          {filteredChats.length === 0 && (
            <p className="px-3 py-2 text-sm text-white/50">No chats found</p>
          )}

          {filteredChats.map((chat) => (
            <button
              key={chat}
              onClick={() => {
                setQuery("");
                onSelectChat(chat);
                onClose();
              }}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-white hover:bg-white/10"
            >
              <MessageCircle size={16} className="text-white/50 shrink-0" />
              <span className="truncate">{chat}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
