"use client";

import { useState } from "react";
import ChatSidebar from "./components/ChatSidebar";
import ChatInterface from "./components/ChatInterface";

export default function ChatLayout() {
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);

  const handleNewChat = () => {
    setCurrentTitleIndex((prev) => (prev + 1) % 4); // cycles through 0–3
  };

  return (
    <div className="flex min-h-screen w-full bg-[#1e1e1e] text-white overflow-hidden">
      {/* Sidebar (hidden on small screens) */}
      <div className="hidden md:flex">
        <ChatSidebar onNewChat={handleNewChat} />
      </div>

      {/* Chat Interface */}
      <ChatInterface currentTitleIndex={currentTitleIndex} />
    </div>
  );
}
