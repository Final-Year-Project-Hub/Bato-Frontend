"use client";

import { useState } from "react";
import ChatSidebar from "./components/ChatSidebar";
import ChatInterface from "./components/ChatInterface";

export default function Page() {
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);

  const handleNewChat = () => {
    setCurrentTitleIndex((prev) => (prev + 1) % 4); // cycles through TITLES
  };

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground overflow-hidden">
      {/* Sidebar (hidden on small screens) */}
      <div className="hidden sm:flex">
        <ChatSidebar onNewChat={handleNewChat} />
      </div>

      {/* Chat Interface */}
      <ChatInterface currentTitleIndex={currentTitleIndex} />
    </div>
  );
}
