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

  // Extract multiple JSON objects from a glued string: "{}{}{}"
  const extractJsonObjects = (input: string) => {
    const out: string[] = [];
    let depth = 0;
    let inString = false;
    let escape = false;
    let start = -1;

    for (let i = 0; i < input.length; i++) {
      const ch = input[i];

      if (inString) {
        if (escape) {
          escape = false;
        } else if (ch === "\\") {
          escape = true;
        } else if (ch === '"') {
          inString = false;
        }
        continue;
      } else {
        if (ch === '"') {
          inString = true;
          continue;
        }
      }

      if (ch === "{") {
        if (depth === 0) start = i;
        depth++;
      } else if (ch === "}") {
        depth--;
        if (depth === 0 && start !== -1) {
          out.push(input.slice(start, i + 1));
          start = -1;
        }
      }
    }

    return out;
  };

  const startStream = useCallback(
    async (args: StreamArgs) => {
      if (isStreaming) return;

      const controller = new AbortController();
      controllerRef.current = controller;
      setIsStreaming(true);

      const emit = (parsed: any) => {
        // normal event format: { event, data }
        if (parsed?.event === "token" && typeof parsed?.data === "string") {
          args.onToken(parsed.data);
          return true;
        }
        if (parsed?.event === "status" && typeof parsed?.data === "string") {
          args.onStatus?.(parsed.data);
          return true;
        }
        if (parsed?.event === "error" && typeof parsed?.data === "string") {
          args.onError?.(parsed.data);
          return true;
        }

        // roadmap created event: {"event":"roadmap_created","data":"uuid"}
        if (
          (parsed?.event === "roadmap_created" || parsed?.event === "roadmapId") &&
          typeof parsed?.data === "string"
        ) {
          args.onRoadmapId?.(parsed.data);
          return true;
        }

        // alternative shapes
        if (typeof parsed?.roadmapId === "string") {
          args.onRoadmapId?.(parsed.roadmapId);
          return true;
        }
        if (typeof parsed?.data?.roadmapId === "string") {
          args.onRoadmapId?.(parsed.data.roadmapId);
          return true;
        }

        return false;
      };

      const handlePayload = (payload: string) => {
        const text = payload.trim();
        if (!text) return;

        // ✅ Try: payload might contain multiple glued JSON objects
        const jsons = extractJsonObjects(text);

        if (jsons.length > 0) {
          // If we successfully got JSON objects, emit them one by one.
          let emittedAnything = false;

          for (const j of jsons) {
            try {
              const parsed = JSON.parse(j);
              const ok = emit(parsed);
              emittedAnything = emittedAnything || ok;

              // If it's NOT one of our stream events, it might be the actual roadmap JSON blob.
              // In that case, pass it to onToken so the UI can summarize it.
              if (!ok) {
                args.onToken(j);
                emittedAnything = true;
              }
            } catch {
              // ignore
            }
          }

          if (emittedAnything) return;
        }

        // ✅ If not JSON (or parsing failed), treat as plain text token
        args.onToken(text);
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

          buffer += decoder.decode(value, { stream: true });

          // ✅ Handle BOTH normal SSE and your broken "data:" style
          // If we see "data:" repeatedly, split by it.
          if (buffer.includes("data:")) {
            const parts = buffer.split("data:");
            buffer = parts.pop() || ""; // keep incomplete tail

            for (const part of parts) {
              handlePayload(part);
            }
            continue;
          }

          // Normal SSE fallback: split events by blank lines
          while (buffer.includes("\n\n")) {
            const idx = buffer.indexOf("\n\n");
            const rawEvent = buffer.slice(0, idx);
            buffer = buffer.slice(idx + 2);

            // collect all data lines
            const dataLines = rawEvent
              .split("\n")
              .map((l) => l.trimEnd())
              .filter((l) => l.startsWith("data:"))
              .map((l) => l.replace(/^data:\s?/, ""));

            if (dataLines.length) handlePayload(dataLines.join("\n"));
            else handlePayload(rawEvent);
          }
        }

        // flush leftover
        if (buffer.trim()) handlePayload(buffer);
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
