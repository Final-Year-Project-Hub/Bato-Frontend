"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  ArrowUp,
  User,
  ChevronDown,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import LogoutModal from "./LogoutModal";
import { useAuth } from "@/app/features/auth/hooks/useAuth";
import { useHealth } from "@/lib/hooks/useHealth";
import { useChat } from "@/lib/hooks/useChat";
import { useRoadmapStream } from "@/lib/hooks/useRoadmapStream";
import { apiFetch } from "@/lib/api";

type ChatMsg = {
  id: string;
  role: "user" | "assistant";
  content: string;
  rawContent?: string;
  createdAt?: number;
  roadmapId?: string;
};

const TITLES = [
  { normal: "Ready to Unlock ", highlight: "New Knowledge?" },
  { normal: "Ready to Learn ", highlight: "Something New?" },
  { normal: "Ask Me Anything, ", highlight: "Anytime!!" },
  { normal: "Level Up Your ", highlight: "Skills Today!!" },
];

export default function ChatInterface({
  initialChatId,
}: {
  initialChatId: string | null;
}) {
  const [currentTitleIndex] = useState(0);

  const router = useRouter();
  const auth = useAuth();
  const { status: healthStatus } = useHealth();
  const { startChat, addMessage, getMessages } = useChat();
  const { startStream, isStreaming } = useRoadmapStream();

  const [openMenu, setOpenMenu] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null,
  );

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const titleIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [typedLength, setTypedLength] = useState(0);
  const roadmapBufRef = useRef("");
  const roadmapModeRef = useRef(false);

  // Track the last loaded chat ID to prevent duplicate fetches
  const lastLoadedChatIdRef = useRef<string | null>(null);

  const { fullText, normalLength } = useMemo(() => {
    const safeIndex =
      currentTitleIndex >= 0 && currentTitleIndex < TITLES.length
        ? currentTitleIndex
        : 0;
    const { normal, highlight } = TITLES[safeIndex];
    return { fullText: normal + highlight, normalLength: normal.length };
  }, [currentTitleIndex]);

  // logout function
  const handleLogout = async () => {
    const toastId = toast("Logging out...", { duration: Infinity });

    try {
      const res = await apiFetch("/auth/logout", {
        method: "POST",
      });
      await fetch("/api/session/clear", { method: "POST" });

      if (res.success) {
        toast.success("Logged out successfully ", {
          id: toastId,
          duration: 2000,
        });

        await auth.refresh();

        setShowLogout(false);
        setOpenMenu(false);

        setTimeout(() => {
          router.push("/login");
        }, 500);
      } else {
        toast.error(res.message || "Logout failed ", {
          id: toastId,
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
      await fetch("/api/session/clear", { method: "POST" });

      await auth.refresh();
      setShowLogout(false);
      setOpenMenu(false);

      setTimeout(() => {
        router.push("/login");
      }, 500);
    }
  };

  useEffect(() => {
    if (titleIntervalRef.current) clearInterval(titleIntervalRef.current);
    setTypedLength(0);

    let i = 0;
    titleIntervalRef.current = setInterval(() => {
      if (i >= fullText.length) {
        clearInterval(titleIntervalRef.current!);
        return;
      }
      i += 1;
      setTypedLength(i);
    }, 50);
    return () => {
      if (titleIntervalRef.current) clearInterval(titleIntervalRef.current);
    };
  }, [fullText]);

  // Auto-scroll effect - smooth scroll during streaming
  useEffect(() => {
    if (bottomRef.current && chatContainerRef.current) {
      const container = chatContainerRef.current;
      const isNearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        150;

      // Auto-scroll if streaming/loading or user is near bottom
      if (loading || isStreaming || isNearBottom) {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages, loading, isStreaming]);

  const toHumanRoadmapLive = (raw: string) => {
    const cleaned = (raw || "").replace(/```json|```/g, "");

    const pick = (re: RegExp) => cleaned.match(re)?.[1];

    const goal = pick(/"goal"\s*:\s*"([^"]*)"/);
    const prof = pick(/"proficiency"\s*:\s*"([^"]*)"/);
    const intent = pick(/"intent"\s*:\s*"([^"]*)"/);

    const lines: string[] = [];

    if (goal) lines.push(`Roadmap: ${goal}`);
    if (intent || prof)
      lines.push([intent, prof].filter(Boolean).join("  |  "));
    if (lines.length) lines.push("");

    //  streaming-friendly: list phases detected so far
    // we detect using phase_number (NOT title format)
    const phaseRe =
      /"phase_number"\s*:\s*(\d+)[\s\S]*?"title"\s*:\s*"([^"]+)"/g;

    const phaseMatches = [...cleaned.matchAll(phaseRe)];

    // Dedup by phase_number (because matches can repeat as stream grows)
    const phaseMap = new Map<number, { num: number; title: string }>();
    for (const m of phaseMatches) {
      const num = Number(m[1]);
      const title = m[2];
      if (!Number.isNaN(num)) phaseMap.set(num, { num, title });
    }

    const phases = [...phaseMap.values()].sort((a, b) => a.num - b.num);

    // Show each phase header (even if topics not complete yet)
    for (const p of phases) {
      lines.push(`## Phase ${p.num}: ${p.title}`);
      lines.push(""); // spacing
    }

    // If nothing yet, show a friendly status
    if (lines.length === 0) return "Generating roadmap...";
    return lines.join("\n").trimEnd();
  };

  const looksLikeRoadmapJson = useCallback((raw: string) => {
    const s = (raw || "").trim();
    if (!s) return false;

    if (s.startsWith("{") || s.startsWith("```json")) return true;
    if (s.includes('"phases"') && s.includes('"title"')) return true;

    return false;
  }, []);

  const extractCompletePhases = (raw: string) => {
    const cleaned = (raw || "").replace(/```json|```/g, "");
    const phases: any[] = [];

    // find each `"phase_number":`
    const re = /"phase_number"\s*:\s*(\d+)/g;
    const hits = [...cleaned.matchAll(re)];

    for (const hit of hits) {
      const idx = hit.index ?? -1;
      if (idx < 0) continue;

      // walk backwards to find the '{' that starts this phase object
      let start = idx;
      while (start >= 0 && cleaned[start] !== "{") start--;
      if (start < 0) continue;

      // brace-balance forward to find the matching '}'
      let depth = 0;
      let inString = false;
      let esc = false;
      let end = -1;

      for (let i = start; i < cleaned.length; i++) {
        const ch = cleaned[i];

        if (esc) {
          esc = false;
          continue;
        }
        if (ch === "\\") {
          esc = true;
          continue;
        }
        if (ch === '"') inString = !inString;

        if (!inString) {
          if (ch === "{") depth++;
          if (ch === "}") {
            depth--;
            if (depth === 0) {
              end = i;
              break;
            }
          }
        }
      }

      // not complete yet
      if (end === -1) continue;

      const phaseStr = cleaned.slice(start, end + 1);
      try {
        const phaseObj = JSON.parse(phaseStr);
        if (phaseObj?.phase_number) phases.push(phaseObj);
      } catch {
        // ignore incomplete/invalid objects
      }
    }

    // dedupe by phase_number
    const map = new Map<number, any>();
    for (const p of phases) map.set(p.phase_number, p);

    return [...map.values()].sort((a, b) => a.phase_number - b.phase_number);
  };

  const formatRoadmapTitles = useCallback((raw: string) => {
    const cleaned = (raw || "").replace(/```json|```/g, "");

    const safeMatch = (re: RegExp) => cleaned.match(re)?.[1];

    const goal = safeMatch(/"goal"\s*:\s*"([^"]*)"/);
    const intent = safeMatch(/"intent"\s*:\s*"([^"]*)"/);
    const prof = safeMatch(/"proficiency"\s*:\s*"([^"]*)"/);
    const total = safeMatch(/"total_estimated_hours"\s*:\s*([0-9.]+)/);

    const lines: string[] = [];

    if (goal) lines.push(`Roadmap: ${goal}`);
    if (intent || prof || total) {
      lines.push(
        [intent, prof, total ? `${total} hrs` : null]
          .filter(Boolean)
          .join("  |  "),
      );
    }
    if (lines.length) lines.push("");

    //  ONLY THIS BLOCK FOR PHASES
    // --- PHASES (realtime) ---
    try {
      // full parse when complete
      const jsonText = cleaned.trim().startsWith("{")
        ? cleaned.trim()
        : cleaned.slice(cleaned.indexOf("{"), cleaned.lastIndexOf("}") + 1);

      const parsed = JSON.parse(jsonText);

      if (Array.isArray(parsed?.phases)) {
        //  full render (final)
        for (const phase of parsed.phases) {
          lines.push(
            `## Phase ${phase.phase_number}: ${phase.title}${phase.estimated_hours ? ` (${phase.estimated_hours} hrs)` : ""}`,
          );
          if (phase.description) lines.push(phase.description);
          lines.push("");

          for (const topic of phase.topics || []) {
            lines.push(
              `- **${topic.title}**${topic.estimated_hours ? ` (${topic.estimated_hours} hrs)` : ""}`,
            );
            if (topic.description) lines.push(`  ${topic.description}`);
            if (topic.doc_link) lines.push(`  ${topic.doc_link}`);
            lines.push("");
          }
        }
        return lines.join("\n").trimEnd();
      }
    } catch {
      // ignore -> fallback below
    }

    //  fallback: partial phases while streaming
    const partialPhases = extractCompletePhases(raw);

    if (partialPhases.length === 0) {
      return lines.length
        ? lines.join("\n").trimEnd()
        : "Generating roadmap...";
    }

    for (const phase of partialPhases) {
      lines.push(
        `## Phase ${phase.phase_number}: ${phase.title}${phase.estimated_hours ? ` (${phase.estimated_hours} hrs)` : ""}`,
      );
      if (phase.description) lines.push(phase.description);
      lines.push("");

      for (const topic of phase.topics || []) {
        lines.push(
          `- **${topic.title}**${topic.estimated_hours ? ` (${topic.estimated_hours} hrs)` : ""}`,
        );
        if (topic.description) lines.push(`  ${topic.description}`);
        if (topic.doc_link) lines.push(`  ${topic.doc_link}`);
        lines.push("");
      }
    }

    //  LIVE: show topics even before phase closes (feels GPT-like)
    const topicTitleRe =
      /"title"\s*:\s*"([^"]+)"\s*,\s*"description"\s*:\s*"([^"]*)"/g;

    const topicMatches = [...cleaned.matchAll(topicTitleRe)].slice(0, 12);

    if (topicMatches.length) {
      lines.push("### Topics appearing…");
      for (const tm of topicMatches) {
        const tTitle = tm[1];

        // skip headers / keys that are not real topics
        if (/^Phase\s*\d+/i.test(tTitle)) continue;
        if (tTitle === goal) continue;

        lines.push(`- ${tTitle}`);
      }
      lines.push("");
    }

    return lines.join("\n").trimEnd();
  }, []);

  // Single effect to handle chat loading based on initialChatId prop
  useEffect(() => {
    // Skip if no chat ID
    if (!initialChatId) {
      // Only reset if we're not currently in a chat session
      // This prevents clearing messages when URL hasn't caught up yet
      if (lastLoadedChatIdRef.current !== null && chatId === null) {
        setMessages([]);
        lastLoadedChatIdRef.current = null;
      }
      return;
    }

    // Skip if this is the chat we're currently working with (just created or already loaded)
    if (initialChatId === chatId) {
      lastLoadedChatIdRef.current = initialChatId;
      return;
    }

    // Skip if already loaded this chat
    if (initialChatId === lastLoadedChatIdRef.current) return;

    // Skip if currently streaming/loading - don't interrupt active work
    if (isStreaming || loading) return;

    let cancelled = false;

    (async () => {
      try {
        const res = await getMessages(initialChatId);
        if (cancelled) return;

        if (res?.success && Array.isArray(res.data)) {
          const mapped: ChatMsg[] = res.data.map((m: any) => {
            const rawContent = m.content ?? "";
            const displayContent =
              m.role === "assistant" && looksLikeRoadmapJson(rawContent)
                ? formatRoadmapTitles(rawContent)
                : rawContent;

            return {
              id: m.id,
              role: m.role,
              content: displayContent,
              roadmapId: m.roadmapId,
              createdAt: m.createdAt
                ? new Date(m.createdAt).getTime()
                : undefined,
            };
          });

          setChatId(initialChatId);
          setMessages(mapped);
          lastLoadedChatIdRef.current = initialChatId;
        }
      } catch (e) {
        console.error(e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    initialChatId,
    getMessages,
    isStreaming,
    loading,
    chatId,
    looksLikeRoadmapJson,
    formatRoadmapTitles,
  ]);

  const uid = () =>
    typeof crypto !== "undefined"
      ? crypto.randomUUID()
      : String(Date.now() + Math.random());

  const sendMessage = async () => {
    if (!message.trim() || loading || isStreaming) return;

    const text = message.trim();
    setMessage("");
    setLoading(true);

    roadmapBufRef.current = "";
    roadmapModeRef.current = false;

    const thinkingId = uid();
    const userTempId = uid();
    const hasAnyTokenRef = { current: false };

    const optimisticUser: ChatMsg = {
      id: userTempId,
      role: "user",
      content: text,
      createdAt: Date.now(),
    };

    setMessages((prev) => [
      ...prev,
      optimisticUser,
      { id: thinkingId, role: "assistant", content: "", createdAt: Date.now() },
    ]);

    setStreamingMessageId(thinkingId);

    const nextHistory = [...messages, optimisticUser].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      let currentChatId = chatId;
      let isNewChat = false;

      if (!currentChatId) {
        const res = await startChat({
          initialMessage: text,
          userId: auth?.user?.id,
        });

        if (!res?.success) throw new Error(res?.message || "Chat failed");

        currentChatId = res.data?.id;
        if (!currentChatId) throw new Error("No chatId returned");

        setChatId(currentChatId);
        lastLoadedChatIdRef.current = currentChatId; // Mark as loaded to prevent re-fetch
        isNewChat = true;
      } else {
        await addMessage(currentChatId, { role: "user", content: text });
      }

      let roadmapId: string | undefined;
      let assistantText = "";
      let rawStreamText = "";

      let finalError: string | null = null;
      let gotAnyOutput = false;

      await startStream({
        message: text,
        chatSessionId: currentChatId,
        conversation_history: nextHistory,
        strictMode: true,
        onRoadmapId: (id) => {
          roadmapId = id;

          setMessages((prev) =>
            prev.map((m) =>
              m.id === thinkingId ? { ...m, roadmapId: id } : m,
            ),
          );
        },

        onRawChunk: (chunk) => {
          console.log("[SSE raw chunk]", chunk);
        },

        onStatus: (s) => {
          if (!hasAnyTokenRef.current) {
            gotAnyOutput = true;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === thinkingId ? { ...m, content: `${s}` } : m,
              ),
            );
          }
        },

        onToken: (t) => {
          gotAnyOutput = true;

          hasAnyTokenRef.current = true;

          rawStreamText += t;

          if (!roadmapModeRef.current) {
            const hint = t.trim();
            if (
              hint.startsWith("{") ||
              hint.startsWith("```json") ||
              hint.includes('"phases"')
            ) {
              roadmapModeRef.current = true;
            }
          }

          if (roadmapModeRef.current) {
            roadmapBufRef.current += t;
            const live = formatRoadmapTitles(roadmapBufRef.current);
            setMessages((prev) =>
              prev.map((m) =>
                m.id === thinkingId ? { ...m, content: live } : m,
              ),
            );
            return;
          }

          assistantText += t;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === thinkingId ? { ...m, content: assistantText } : m,
            ),
          );
        },

        onError: (err) => {
          gotAnyOutput = true;

          setMessages((prev) =>
            prev.map((m) => (m.id === thinkingId ? { ...m, content: err } : m)),
          );
        },
      });

      console.log(rawStreamText);

      const finalRaw = rawStreamText.trim();
      const toSave = finalRaw;

      if (toSave) {
        await addMessage(currentChatId, {
          role: "assistant",
          content: toSave,
          roadmapId,
        });

        // Update URL after everything is saved (won't cause re-fetch due to lastLoadedChatIdRef)
        if (isNewChat) {
          window.history.replaceState(null, "", `/chat/${currentChatId}`);
        }
      } else if (!gotAnyOutput) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === thinkingId
              ? { ...m, content: "No response from AI. Try again." }
              : m,
          ),
        );
      }
    } catch (e: unknown) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === thinkingId
            ? { ...m, content: (e as Error)?.message || "Error" }
            : m,
        ),
      );
    } finally {
      setLoading(false);
      setStreamingMessageId(null);
    }
  };

  const typedText = fullText.slice(0, typedLength);

  const renderChatInput = () => (
    <div className="flex items-center gap-3 w-full max-w-3xl h-14 bg-card rounded-full px-6 border border-border">
      <Image src="/images/bato.png" alt="Bato" width={32} height={32} />
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Ask me a Roadmap"
        className="flex-1 bg-transparent outline-none text-base text-foreground placeholder:text-muted-foreground"
        disabled={loading}
      />
      <button
        onClick={sendMessage}
        disabled={loading || !message.trim()}
        className="bg-primary rounded-full p-2.5 disabled:opacity-60 hover:opacity-90 transition-opacity"
      >
        <ArrowUp size={22} className="text-primary-foreground" />
      </button>
    </div>
  );

  return (
    <main className="h-screen flex-1 relative flex flex-col bg-background p-4 sm:p-6">
      {/* Top Right Menu */}
      <div className="absolute top-4 right-6 z-20 flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${
            healthStatus === "connected"
              ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"
              : healthStatus === "degraded"
                ? "bg-amber-500"
                : healthStatus === "error"
                  ? "bg-red-500"
                  : "bg-gray-300 animate-pulse"
          }`}
        />
        <button
          onClick={() => setOpenMenu((v) => !v)}
          className="flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors"
        >
          <User size={18} />
          <ChevronDown size={14} />
        </button>

        {openMenu && (
          <div className="absolute right-0 mt-30 w-40 bg-popover border border-border rounded-lg shadow-lg">
            <button
              onClick={() => router.push("./dashboard")}
              className="w-full px-4 py-2 flex gap-2 text-sm text-popover-foreground/80 hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <LayoutDashboard size={16} /> Dashboard
            </button>

            <button
              onClick={() => {
                setOpenMenu(false);
                setShowLogout(true);
              }}
              className="w-full px-4 py-2 flex gap-2 text-sm text-popover-foreground/80 hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        )}
      </div>

      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <p className="text-blue text-[20px] text-center">
            <span className="text-blue">
              {typedText.slice(0, normalLength)}
            </span>
            <span className="text-primary">
              {typedText.slice(normalLength)}
            </span>
            {typedLength < fullText.length && (
              <span className="animate-blink">|</span>
            )}
          </p>
          {renderChatInput()}
        </div>
      ) : (
        <>
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto pr-2 pt-10"
          >
            <div className="max-w-3xl mx-auto space-y-3">
              {messages.map((m) => (
                <ChatBubble
                  key={m.id}
                  role={m.role}
                  content={m.content}
                  roadmapId={m.roadmapId}
                  isStreaming={m.id === streamingMessageId}
                />
              ))}
              <div ref={bottomRef} />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center">
            {renderChatInput()}
          </div>
        </>
      )}

      <LogoutModal
        open={showLogout}
        onClose={() => setShowLogout(false)}
        onConfirm={handleLogout}
      />

      <style jsx>{`
        @keyframes blink {
          0%,
          50%,
          100% {
            opacity: 1;
          }
          25%,
          75% {
            opacity: 0;
          }
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
      `}</style>
    </main>
  );
}

function ChatBubble({
  role,
  content,
  roadmapId,
  isStreaming = false,
}: {
  role: "user" | "assistant";
  content: string;
  roadmapId?: string;
  isStreaming?: boolean;
}) {
  const router = useRouter();

  const isUser = role === "user";

  // Check if content is a roadmap
  const isRoadmap =
    content.includes("Roadmap:") || content.includes("## Phase");

  // Parse roadmap into structured data
  const parseRoadmap = (text: string) => {
    const lines = text.split("\n");
    let goal = "";
    let metadata = "";
    const phases: Array<{
      title: string;
      description: string;
      hours: string;
      topics: Array<{ text: string; isSubtopic: boolean }>;
    }> = [];

    let currentPhase: {
      title: string;
      hours: string;
      description: string;
      topics: Array<{ text: string; isSubtopic: boolean }>;
    } | null = null;

    for (const line of lines) {
      if (line.startsWith("Roadmap:")) {
        goal = line.replace("Roadmap:", "").trim();
      } else if (line.includes("|")) {
        metadata = line;
      } else if (line.startsWith("## Phase")) {
        if (currentPhase) phases.push(currentPhase);
        const match = line.match(/## (Phase.*?)(?:\s*\(([^)]+)\))?$/);
        currentPhase = {
          title: match?.[1]?.trim() || line.replace("## ", ""),
          hours: match?.[2] || "",
          description: "",
          topics: [],
        };
      } else if (currentPhase) {
        if (line.startsWith("- **") || line.startsWith("- ")) {
          currentPhase.topics.push({ text: line, isSubtopic: false });
        } else if (line.startsWith("  - ")) {
          currentPhase.topics.push({ text: line, isSubtopic: true });
        } else if (
          line.trim() &&
          !currentPhase.description &&
          !line.startsWith("  ")
        ) {
          currentPhase.description = line.trim();
        }
      }
    }

    if (currentPhase) phases.push(currentPhase);

    return { goal, metadata, phases };
  };

  // Beautiful roadmap rendering (only when streaming is complete)
  const renderBeautifulRoadmap = (text: string, roadmapId?: string) => {
    const { goal, metadata, phases } = parseRoadmap(text);

    return (
      <div className="space-y-6">
        {/* Header */}
        {goal && (
          <div className="bg-primary/10 p-4 rounded-lg border-l-4 border-primary">
            <h2 className="text-xl font-bold text-foreground mb-2">{goal}</h2>
            {metadata && (
              <p className="text-sm text-muted-foreground">{metadata}</p>
            )}
          </div>
        )}

        {/* Phases */}
        <div className="space-y-4">
          {phases.map((phase, idx) => (
            <div
              key={idx}
              className="bg-card/50 rounded-lg p-4 border border-border hover:border-primary/50 transition-colors"
            >
              {/* Phase Header */}
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-primary">
                  {phase.title}
                </h3>
                {phase.hours && (
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                    {phase.hours}
                  </span>
                )}
              </div>

              {/* Phase Description */}
              {phase.description && (
                <p className="text-sm text-foreground/80 mb-3">
                  {phase.description}
                </p>
              )}

              {/* Topics */}
              {phase.topics.length > 0 && (
                <div className="space-y-2 ml-2">
                  {phase.topics.map((topic, topicIdx) => (
                    <div
                      key={topicIdx}
                      className={`text-sm ${
                        topic.isSubtopic
                          ? "ml-6 text-muted-foreground pl-3 border-l-2 border-border"
                          : "text-foreground/80"
                      }`}
                    >
                      {topic.text
                        .replace(/^-\s*\*\*/, "•  ")
                        .replace(/\*\*/g, "")}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA BUTTON */}
        {roadmapId && (
          <div className="pt-4 flex justify-end">
            <button
              onClick={() => {
                console.log("roadmapId click =", roadmapId);
                router.push(
                  `/dashboard/my-roadmaps/${encodeURIComponent(roadmapId)}`,
                );
              }}
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              View Full Roadmap →
            </button>
          </div>
        )}
      </div>
    );
  };

  // Simple format for streaming (real-time updates)
  const formatContentSimple = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      if (line.startsWith("Roadmap:")) {
        return (
          <div key={idx} className="text-lg font-bold mb-2 text-foreground">
            {line}
          </div>
        );
      } else if (line.startsWith("## Phase")) {
        return (
          <div
            key={idx}
            className="text-base font-bold mt-4 mb-2 text-foreground"
          >
            {line.replace("## ", "")}
          </div>
        );
      } else if (line.trim()) {
        return (
          <div key={idx} className="text-sm text-foreground/90">
            {line}
          </div>
        );
      }
      return <div key={idx} className="h-2" />;
    });
  };

  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`rounded-2xl px-4 py-3 leading-relaxed border ${
          isUser
            ? "max-w-[80%] bg-primary text-primary-foreground border-border"
            : isRoadmap && !isStreaming
              ? "w-full bg-card text-card-foreground border-border"
              : "max-w-[80%] bg-card text-card-foreground border-border"
        }`}
      >
        {isUser ? (
          <div className="text-sm whitespace-pre-wrap">{content}</div>
        ) : isRoadmap && !isStreaming ? (
          renderBeautifulRoadmap(content, roadmapId)
        ) : (
          formatContentSimple(content)
        )}
      </div>
    </div>
  );
}
