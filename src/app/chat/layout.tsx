"use client";

import { useState } from "react";
import ChatSidebar from "./components/ChatSidebar";
import ChatInterface from "./components/ChatInterface";

export default function ChatLayout() {
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);

  const handleNewChat = () => {
    setCurrentTitleIndex(prev => (prev + 1) % 4); // cycle through titles
  };

  return (
    <div className="flex h-screen w-screen bg-[#1e1e1e] text-white">
      {/* Sidebar */}
      <ChatSidebar onNewChat={handleNewChat} />

      {/* Chat Interface */}
      <ChatInterface currentTitleIndex={currentTitleIndex} />
    </div>
  );
}
