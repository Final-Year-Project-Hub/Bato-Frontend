"use client";

import { useState } from "react";
import ChatSidebar from "./components/ChatSidebar";
import ChatInterface from "./components/ChatInterface";

export default function Page() {
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);

  const handleNewChat = () => {
    setCurrentTitleIndex(prev => (prev + 1) % 4); // cycle through titles
  };

  return (
    <div className="flex h-screen">
      <ChatSidebar onNewChat={handleNewChat} />
      <ChatInterface currentTitleIndex={currentTitleIndex} />
    </div>
  );
}
