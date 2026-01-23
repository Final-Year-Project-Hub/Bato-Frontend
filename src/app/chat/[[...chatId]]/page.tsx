"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import ChatInterface from "../components/ChatInterface";

export default function Page() {
  const params = useParams();
  
  // Handle catch-all route: [[...chatId]] gives us an array or undefined
  const initialChatId = useMemo(() => {
    const chatIdParam = params?.chatId;
    if (Array.isArray(chatIdParam)) {
      return chatIdParam[0] ?? null;
    }
    if (typeof chatIdParam === "string") {
      return chatIdParam;
    }
    return null;
  }, [params?.chatId]);

  return (
    <div className="flex min-h-screen bg-background text-foreground overflow-hidden">
      <ChatInterface initialChatId={initialChatId} />
    </div>
  );
}