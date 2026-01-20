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
  onRawChunk?: (raw: string) => void;
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

        const handleData = (dataStr: string) => {
          const s = dataStr.trim();
          if (!s) return;

          // If server sometimes sends multiple JSON objects stuck together:
          // data: {...}\ndata: {...}
          // we already join them below, but just in case:
          const lines = s.split("\n").map((x) => x.trim()).filter(Boolean);

          for (const line of lines) {
            const cleaned = line.startsWith("data:")
              ? line.replace(/^data:\s?/, "")
              : line;

            try {
              const parsed = JSON.parse(cleaned);

              if (parsed?.event === "status" && typeof parsed.data === "string") {
                args.onStatus?.(parsed.data);
                continue;
              }

              if (parsed?.event === "token" && typeof parsed.data === "string") {
                // ✅ IMPORTANT: pass ONLY the token text
                args.onToken(parsed.data);
                continue;
              }

              if (parsed?.event === "error" && typeof parsed.data === "string") {
                args.onError?.(parsed.data);
                continue;
              }

              if (
                parsed?.event === "roadmap_created" &&
                typeof parsed.data === "string"
              ) {
                args.onRoadmapId?.(parsed.data);
                continue;
              }
            } catch {
              // not JSON → ignore
            }
          }
        };

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          args.onRawChunk?.(chunk);

          buffer += chunk;

          // SSE events separated by blank line
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

            if (dataLines.length) {
              handleData(dataLines.join("\n"));
            }
          }
        }

        // flush tail
        if (buffer.trim()) handleData(buffer);
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
    [BACKEND, isStreaming],
  );

  return { startStream, abort, isStreaming };
}
