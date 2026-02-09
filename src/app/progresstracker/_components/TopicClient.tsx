"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import LessonPage, { LessonResponse } from "./LessonPage";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://bato-backend-a9x8.onrender.com";

async function readStreamToEnd(body: ReadableStream<Uint8Array>) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let full = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    full += decoder.decode(value, { stream: true });
  }

  const cleaned = full
    .split("\n")
    .filter((l) => l.startsWith("data:"))
    .map((l) => l.replace(/^data:\s?/, ""))
    .join("\n")
    .trim();

  return cleaned || full.trim();
}

function stripCodeFences(raw: string) {
  return (raw || "").replace(/```json|```/g, "").trim();
}

function extractJsonBlockSafe(raw: string) {
  const s = stripCodeFences(raw);
  const start = s.indexOf("{");
  if (start === -1) throw new Error("No JSON object found in response");

  let out = "";
  let depth = 0;

  let inString = false;
  let escape = false;

  for (let i = start; i < s.length; i++) {
    const ch = s[i];
    out += ch;

    if (inString) {
      if (escape) escape = false;
      else if (ch === "\\") escape = true;
      else if (ch === '"') inString = false;
      continue;
    }

    if (ch === '"') {
      inString = true;
      continue;
    }

    if (ch === "{") depth++;
    if (ch === "}") {
      depth--;
      if (depth === 0) return out;
    }
  }

  throw new Error("Unterminated JSON object in response");
}

function parseLessonJson(raw: string) {
  const jsonText = extractJsonBlockSafe(raw);
  return JSON.parse(jsonText);
}

export default function TopicClient({
  roadmapId,
  topicId,
}: {
  roadmapId: string;
  topicId: string;
}) {
  const sp = useSearchParams();
  const phaseId = sp.get("phaseId") ?? "";
  const goal = sp.get("goal") ?? "";
  const roadmapIdFromQuery = sp.get("roadmapId") ?? roadmapId;

  const [lesson, setLesson] = useState<LessonResponse | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!phaseId) {
      setErr("Missing phaseId in URL (?phaseId=...)");
      setLoading(false);
      return;
    }
    if (!goal) {
      setErr("Missing goal in URL (?goal=...)");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setErr(null);

        let url =
          `${baseUrl}/api/topic/stream/${encodeURIComponent(
            phaseId,
          )}/${encodeURIComponent(topicId)}` +
          `?goal=${encodeURIComponent(goal)}`;

        if (roadmapIdFromQuery) {
          url += `&roadmapId=${encodeURIComponent(roadmapIdFromQuery)}`;
        }

        const res = await fetch(url, {
          method: "GET",
          headers: { Accept: "text/event-stream" },
          credentials: "include",
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          const msg = await res.text().catch(() => "");
          throw new Error(`${res.status} ${res.statusText} ${msg}`);
        }

        const finalText = await readStreamToEnd(res.body);

        const json = parseLessonJson(finalText) as LessonResponse;

        console.log("lesson parsed:", json);
        setLesson(json);
      } catch (e: any) {
        if (e?.name === "AbortError") return;
        setErr(e?.message || "Failed to load lesson");
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [phaseId, goal, topicId, roadmapIdFromQuery]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (err) return <div className="p-6 text-red-500">{err}</div>;
  if (!lesson) return <div className="p-6">Loading...</div>;

  return (
     <LessonPage
      lesson={lesson}
      currentPhaseId={phaseId}
      currentTopicId={topicId}
      currentTopicTitle={lesson.title} 
    />
  );
}