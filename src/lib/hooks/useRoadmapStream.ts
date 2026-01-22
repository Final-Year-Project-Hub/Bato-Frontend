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

        // ✅ same helper style as your working roadmapService
        const extractJsonObjects = (input: string): string[] => {
          const objects: string[] = [];
          let depth = 0;
          let startIndex = 0;
          let inString = false;
          let escape = false;

          for (let i = 0; i < input.length; i++) {
            const char = input[i];

            if (escape) {
              escape = false;
              continue;
            }
            if (char === "\\") {
              escape = true;
              continue;
            }
            if (char === '"') {
              inString = !inString;
            }

            if (!inString) {
              if (char === "{") {
                if (depth === 0) startIndex = i;
                depth++;
              } else if (char === "}") {
                depth--;
                if (depth === 0) {
                  objects.push(input.substring(startIndex, i + 1));
                }
              }
            }
          }

          if (objects.length === 0 && input.trim()) return [input];
          return objects;
        };

        const handleJsonPayload = (jsonStr: string) => {
          // jsonStr may contain one JSON or multiple concatenated JSONs
          const objs = extractJsonObjects(jsonStr);

          for (const obj of objs) {
            try {
              const parsed = JSON.parse(obj);

              if (parsed?.event === "status" && typeof parsed.data === "string") {
                args.onStatus?.(parsed.data);
                continue;
              }

              if (parsed?.event === "token" && typeof parsed.data === "string") {
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
              // ignore bad JSON object
            }
          }
        };

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          // ✅ normalize CRLF like the other fix
          const chunk = decoder.decode(value, { stream: true }).replace(/\r\n/g, "\n");
          args.onRawChunk?.(chunk);

          buffer += chunk;

          // ✅ parse line-by-line like your working roadmapService
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            if (!trimmed.startsWith("data:")) continue;

            const jsonStr = trimmed.replace(/^data:\s?/, "");
            if (!jsonStr) continue;

            handleJsonPayload(jsonStr);
          }
        }

        // ✅ final buffer flush (same style)
        const tail = buffer.trim();
        if (tail && tail.startsWith("data:")) {
          const jsonStr = tail.replace(/^data:\s?/, "");
          if (jsonStr) handleJsonPayload(jsonStr);
        }

        reader.releaseLock();
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
