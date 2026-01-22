"use client";
import { useState } from "react";

export function useChat() {
  const [loading, setLoading] = useState(false);
  const BACKEND = process.env.NEXT_PUBLIC_API_BASE_URL!;

  const startChat = async (input: {
    initialMessage: string;
    userId?: string;
  }) => {
    setLoading(true);
    try {
      const r = await fetch(`${BACKEND}/api/chats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(input),
      });

      const res = await r.json().catch(() => null);
      if (!r.ok)
        return { success: false, message: res?.message || "Chat failed" };
      return res;
    } finally {
      setLoading(false);
    }
  };

  const addMessage = async (
    chatId: string,
    input: { role: "user" | "assistant"; content: string; roadmapId?: string },
  ) => {
    const r = await fetch(`${BACKEND}/api/chats/${chatId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(input),
    });
    const res = await r.json().catch(() => null);
    if (!r.ok) throw new Error(res?.error || "Failed to add message");
    return res;
  };

  const getMessages = async (chatId: string) => {
    const r = await fetch(`${BACKEND}/api/chats/${chatId}/messages`, {
      credentials: "include",
    });
    const res = await r.json().catch(() => null);
    if (!r.ok) throw new Error(res?.error || "Failed to fetch messages");
    return res; // usually { success: true, data: Message[] }
  };

  const getChats = async (userId: string) => {
    if (!userId) throw new Error("userId is required");

    setLoading(true);
    try {
      const r = await fetch(`${BACKEND}/api/chats?userId=${userId}`, {
        credentials: "include",
      });

      const res = await r.json().catch(() => null);
      if (!r.ok)
        throw new Error(res?.message || res?.error || "Failed to fetch chats");

      return res; // { success: true, data: Chat[] }
    } finally {
      setLoading(false);
    }
  };
  
  return { startChat, addMessage, loading, getMessages, getChats };
}
