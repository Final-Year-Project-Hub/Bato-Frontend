"use client";
import { useState, useCallback, useRef } from "react";

export function useChat() {
  const [loading, setLoading] = useState(false);
  const BACKEND = process.env.NEXT_PUBLIC_API_BASE_URL!;
  
  // Use ref to store BACKEND so it doesn't cause re-renders
  const backendRef = useRef(BACKEND);
  backendRef.current = BACKEND;

  const startChat = useCallback(async (input: {
    initialMessage: string;
    userId?: string;
  }) => {
    setLoading(true);
    try {
      const r = await fetch(`${backendRef.current}/api/chats`, {
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
  }, []);

  const addMessage = useCallback(async (
    chatId: string,
    input: { role: "user" | "assistant"; content: string; roadmapId?: string },
  ) => {
    const r = await fetch(`${backendRef.current}/api/chats/${chatId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(input),
    });
    const res = await r.json().catch(() => null);
    if (!r.ok) throw new Error(res?.error || "Failed to add message");
    return res;
  }, []);

  const getMessages = useCallback(async (chatId: string) => {
    const r = await fetch(`${backendRef.current}/api/chats/${chatId}/messages`, {
      credentials: "include",
    });
    const res = await r.json().catch(() => null);
    if (!r.ok) throw new Error(res?.error || "Failed to fetch messages");
    return res; // usually { success: true, data: Message[] }
  }, []);

  const getChats = useCallback(async (userId: string) => {
    if (!userId) throw new Error("userId is required");

    setLoading(true);
    try {
      const r = await fetch(`${backendRef.current}/api/chats?userId=${userId}`, {
        credentials: "include",
      });

      const res = await r.json().catch(() => null);
      if (!r.ok)
        throw new Error(res?.message || res?.error || "Failed to fetch chats");

      return res; // { success: true, data: Chat[] }
    } finally {
      setLoading(false);
    }
  }, []);
  
  return { startChat, addMessage, loading, getMessages, getChats };
}