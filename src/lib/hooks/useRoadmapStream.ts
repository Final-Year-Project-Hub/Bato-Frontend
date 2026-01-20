"use client";

import { useCallback, useRef, useState } from "react";

type Role = "user" | "assistant";

type StreamArgs = {
  message: string;
  chatSessionId?: string | null;
  conversation_history?: { role: Role; content: string }[];
  strictMode?: boolean;

  onToken: (token: string) => void;
  onRoadmapId?: (roadmapId: string) => void;
  onStatus?: (status: string) => void;
  onError?: (err: string) => void;

  // optional debug
  onRawChunk?: (chunk: string) => void;
};

export function useRoadmapStream() {
  const BACKEND = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const controllerRef = useRef<AbortController | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const abort = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setIsStreaming(false);
  }, []);

  const startStream = useCallback(
    async (args: StreamArgs) => {
      if (isStreaming) return;

      const controller = new AbortController();
      controllerRef.current = controller;
      setIsStreaming(true);

      const handleEventObj = (obj: any) => {
        if (!obj) return;

        if (obj.event === "status" && typeof obj.data === "string") {
          args.onStatus?.(obj.data);
          return;
        }

        if (obj.event === "token" && typeof obj.data === "string") {
          // ✅ ONLY send the actual text
          args.onToken(obj.data);
          return;
        }

        if (obj.event === "error" && typeof obj.data === "string") {
          args.onError?.(obj.data);
          return;
        }

        // roadmap created event shapes
        if (obj.event === "roadmap_created" && typeof obj.data === "string") {
          args.onRoadmapId?.(obj.data);
          return;
        }

        if (typeof obj.roadmapId === "string") {
          args.onRoadmapId?.(obj.roadmapId);
          return;
        }
      };

      try {
        const res = await fetch(`${BACKEND}/api/roadmap/stream`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            message: args.message,
            chatSessionId: args.chatSessionId ?? null,
            conversation_history: args.conversation_history ?? [],
            strictMode: args.strictMode ?? false,
          }),
        });

        if (!res.ok || !res.body) {
          const text = await res.text().catch(() => "");
          throw new Error(text || "Stream failed");
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          args.onRawChunk?.(chunk);

          buffer += chunk;

          // SSE events are separated by blank line
          while (buffer.includes("\n\n")) {
            const idx = buffer.indexOf("\n\n");
            const eventBlock = buffer.slice(0, idx);
            buffer = buffer.slice(idx + 2);

            // collect all data: lines
            const dataLines = eventBlock
              .split("\n")
              .map((l) => l.trimEnd())
              .filter((l) => l.startsWith("data:"))
              .map((l) => l.replace(/^data:\s?/, ""));

            if (!dataLines.length) continue;

            // sometimes backend sends one json per data line
            for (const line of dataLines) {
              const payload = line.trim();
              if (!payload) continue;

              try {
                const obj = JSON.parse(payload);
                handleEventObj(obj);
              } catch {
                // if backend ever sends plain text, treat as token
                args.onToken(payload);
              }
            }
          }
        }
      } catch (e: any) {
        if (e?.name !== "AbortError") {
          args.onError?.(e?.message || "Stream error");
          throw e;
        }
      } finally {
        setIsStreaming(false);
        controllerRef.current = null;
      }
    },
    [BACKEND, isStreaming]
  );

  return { startStream, abort, isStreaming };
}
