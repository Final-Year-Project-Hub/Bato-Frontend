"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  ArrowUp,
  User,
  ChevronDown,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
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
  createdAt?: number;
  roadmapId?: string;
};

const TITLES = [
  { normal: "Ready to Unlock ", highlight: "New Knowledge?" },
  { normal: "Ready to Learn ", highlight: "Something New?" },
  { normal: "Ask Me Anything, ", highlight: "Anytime!!" },
  { normal: "Level Up Your ", highlight: "Skills Today!!" },
];

export default function ChatInterface() {
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

  const params = useParams<{ chatId?: string }>();

  useEffect(() => {
    const idFromRoute = params?.chatId;
    if (!idFromRoute || typeof idFromRoute !== "string") return;

    // don't overwrite UI while you're streaming a reply
    if (isStreaming || loading) return;

    let cancelled = false;

    (async () => {
      try {
        const res = await getMessages(idFromRoute);
        if (cancelled) return;

        if (res?.success && Array.isArray(res.data)) {
          const mapped: ChatMsg[] = res.data.map((m: ChatMsg & { content: string }) => {
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

          setChatId(idFromRoute);
          setMessages(mapped);
        }
      } catch (e) {
        console.error(e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [params?.chatId, getMessages, isStreaming, loading]);

  const uid = () =>
    typeof crypto !== "undefined"
      ? crypto.randomUUID()
      : String(Date.now() + Math.random());

  const formatRoadmapTitles = (raw: string) => {
    const cleaned = (raw || "").replace(/```json|```/g, "");

    const safeMatch = (re: RegExp) => cleaned.match(re)?.[1];

    const goal = safeMatch(/"goal"\s*:\s*"([^"]*)"/);
    const intent = safeMatch(/"intent"\s*:\s*"([^"]*)"/);
    const prof = safeMatch(/"proficiency"\s*:\s*"([^"]*)"/);
    const total = safeMatch(/"total_estimated_hours"\s*:\s*([0-9.]+)/);

    const lines: string[] = [];

    // Header (shows as soon as fields exist)
    if (goal) lines.push(`Roadmap: ${goal}`);
    if (intent || prof || total) {
      lines.push(
        [
          intent ? `${intent}` : null,
          prof ? `${prof}` : null,
          total ? `${total} hrs` : null,
        ]
          .filter(Boolean)
          .join("  |  "),
      );
    }
    if (lines.length) lines.push("");

    // --- PHASES ---
    const phaseTitleRe = /"title"\s*:\s*"(Phase\s*\d+\s*:[^"]*)"/g;

    const phaseStarts: Array<{ idx: number; title: string }> = [];
    for (const m of cleaned.matchAll(phaseTitleRe)) {
      if (typeof m.index === "number")
        phaseStarts.push({ idx: m.index, title: m[1] });
    }

    if (phaseStarts.length === 0) {
      if (!lines.length) return "Generating roadmap...";
      return lines.join("\n").trimEnd();
    }

    const getSlice = (start: number, end?: number) =>
      cleaned.slice(start, end ?? cleaned.length);

    for (let i = 0; i < phaseStarts.length; i++) {
      const start = phaseStarts[i].idx;
      const end = phaseStarts[i + 1]?.idx; // until next phase begins
      const block = getSlice(start, end);

      const title = phaseStarts[i].title;

      const pDesc = block.match(/"description"\s*:\s*"([^"]*)"/)?.[1];
      const pHrs = block.match(/"estimated_hours"\s*:\s*([0-9.]+)/)?.[1];

      lines.push(`## ${title}${pHrs ? ` (${pHrs} hrs)` : ""}`);
      if (pDesc) lines.push(pDesc);
      lines.push("");

      // --- TOPICS inside this phase ---
      const topicRe =
        /"topics"\s*:\s*\[[\s\S]*?\{\s*"title"\s*:\s*"([^"]+)"[\s\S]*?"description"\s*:\s*"([^"]*)"(?:[\s\S]*?"estimated_hours"\s*:\s*([0-9.]+))?(?:[\s\S]*?"doc_link"\s*:\s*"([^"]*)")?/g;

      const topicMatches = [...block.matchAll(topicRe)];

      for (const tm of topicMatches) {
        const tTitle = tm[1];
        const tDesc = tm[2];
        const tHrs = tm[3];
        const tLink = tm[4];

        // skip if this is actually another phase title accidentally
        if (/^Phase\s*\d+\s*:/i.test(tTitle)) continue;

        lines.push(`- **${tTitle}**${tHrs ? ` (${tHrs} hrs)` : ""}`);
        if (tDesc) lines.push(`  ${tDesc}`);
        if (tLink) lines.push(`  ${tLink}`);

        // --- SUBTOPICS inside this topic ---
        const afterTitleIdx = block.indexOf(`"title": "${tTitle}"`);
        const topicWindow =
          afterTitleIdx >= 0
            ? block.slice(afterTitleIdx, afterTitleIdx + 2000)
            : "";

        const subRe =
          /"subtopics"\s*:\s*\[[\s\S]*?\{\s*"title"\s*:\s*"([^"]+)"[\s\S]*?"description"\s*:\s*"([^"]*)"(?:[\s\S]*?"estimated_hours"\s*:\s*([0-9.]+))?(?:[\s\S]*?"doc_link"\s*:\s*"([^"]*)")?/g;

        const subMatches = [...topicWindow.matchAll(subRe)];
        for (const sm of subMatches) {
          const sTitle = sm[1];
          const sDesc = sm[2];
          const sHrs = sm[3];
          const sLink = sm[4];

          lines.push(`  - ${sTitle}${sHrs ? ` (${sHrs} hrs)` : ""}`);
          if (sDesc) lines.push(`    ${sDesc}`);
          if (sLink) lines.push(`    ${sLink}`);
        }

        lines.push("");
      }
    }

    return lines.join("\n").trimEnd();
  };

  const looksLikeRoadmapJson = (raw: string) => {
    const s = (raw || "").trim();
    if (!s) return false;

    if (s.startsWith("{") || s.startsWith("```json")) return true;
    if (s.includes('"phases"') && s.includes('"title"')) return true;

    return false;
  };

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

      if (!currentChatId) {
        const res = await startChat({
          initialMessage: text,
          userId: auth?.user?.id,
        });

        if (!res?.success) throw new Error(res?.message || "Chat failed");

        currentChatId = res.data?.id;
        if (!currentChatId) throw new Error("No chatId returned");

        setChatId(currentChatId);
        router.replace(`/chat/${currentChatId}`);
      } else {
        await addMessage(currentChatId, { role: "user", content: text });
      }

      let roadmapId: string | undefined;
      let assistantText = "";
      let rawStreamText = "";

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

        onStatus: (s) => {
          if (!hasAnyTokenRef.current) {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === thinkingId ? { ...m, content: `${s}` } : m,
              ),
            );
          }
        },

        onToken: (t) => {
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
          setMessages((prev) =>
            prev.map((m) =>
              m.id === thinkingId ? { ...m, content: err } : m,
            ),
          );
        },
      });

      const finalRaw = rawStreamText.trim();
      const toSave = finalRaw;

      if (toSave) {
        await addMessage(currentChatId, {
          role: "assistant",
          content: toSave,
          roadmapId,
        });
      } else {
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
    }
  };

  const typedText = fullText.slice(0, typedLength);

  const renderChatInput = () => (
    <div className="flex items-center gap-3 w-full max-w-3xl h-14 bg-[#2A2A2A] rounded-full px-6 border border-white/10">
      <Image src="/images/bato.png" alt="Bato" width={32} height={32} />
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Ask me a Roadmap"
        className="flex-1 bg-transparent outline-none text-base text-white placeholder:text-gray-400"
        disabled={loading}
      />
      <button
        onClick={sendMessage}
        disabled={loading || !message.trim()}
        className="bg-[#E96559] rounded-full p-2.5 disabled:opacity-60"
      >
        <ArrowUp size={22} className="text-[#282828]" />
      </button>
    </div>
  );

  return (
    <main className="h-screen flex-1 relative flex flex-col bg-grey p-4 sm:p-6">
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
          className="flex items-center gap-2 text-white/80 hover:text-white"
        >
          <User size={18} />
          <ChevronDown size={14} />
        </button>

        {openMenu && (
          <div className="absolute right-0 mt-10 w-40 bg-[#2A2A2A] border border-white/10 rounded-lg shadow-lg">
            <button
              onClick={() => router.push("./dashboard")}
              className="w-full px-4 py-2 flex gap-2 text-sm text-white/80 hover:bg-white/5"
            >
              <LayoutDashboard size={16} /> Dashboard
            </button>

            <button
              onClick={() => {
                setOpenMenu(false);
                setShowLogout(true);
              }}
              className="w-full px-4 py-2 flex gap-2 text-sm text-white/80 hover:bg-white/5"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        )}
      </div>

      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <p className="text-[#DDDDDD] text-[20px] text-center">
            <span className="text-[#DDDDDD]">
              {typedText.slice(0, normalLength)}
            </span>
            <span className="text-[#E96559]">
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
          <div className="bg-linear-to-r from-[#E96559]/20 to-transparent p-4 rounded-lg border-l-4 border-[#E96559]">
            <h2 className="text-xl font-bold text-white mb-2">{goal}</h2>
            {metadata && <p className="text-sm text-white/70">{metadata}</p>}
          </div>
        )}

        {/* Phases */}
        <div className="space-y-4">
          {phases.map((phase, idx) => (
            <div
              key={idx}
              className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-[#E96559]/50 transition-colors"
            >
              {/* Phase Header */}
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-[#E96559]">
                  {phase.title}
                </h3>
                {phase.hours && (
                  <span className="text-xs bg-[#E96559]/20 text-[#E96559] px-2 py-1 rounded-full">
                    {phase.hours}
                  </span>
                )}
              </div>

              {/* Phase Description */}
              {phase.description && (
                <p className="text-sm text-white/80 mb-3">
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
                          ? "ml-6 text-white/60 pl-3 border-l-2 border-white/20"
                          : "text-white/80"
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
        <div className="pt-4 flex justify-end">
          <button
            onClick={() => router.push(`/dashboard/roadmap/${roadmapId}`)}
            className="bg-[#E96559] hover:bg-[#E96559]/90 text-white px-5 py-2 rounded-lg text-sm font-semibold transition"
          >
            View Full Roadmap →
          </button>
        </div>
      </div>
    );
  };

  // Simple format for streaming (real-time updates)
  const formatContentSimple = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      if (line.startsWith("Roadmap:")) {
        return (
          <div key={idx} className="text-lg font-bold mb-2">
            {line}
          </div>
        );
      } else if (line.startsWith("## Phase")) {
        return (
          <div key={idx} className="text-base font-bold mt-4 mb-2">
            {line.replace("## ", "")}
          </div>
        );
      } else if (line.trim()) {
        return (
          <div key={idx} className="text-sm">
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
            ? "max-w-[80%] bg-[#E96559] text-foreground border-white/10"
            : isRoadmap && !isStreaming
              ? "w-full bg-[#2A2A2A] text-white border-white/10"
              : "max-w-[80%] bg-[#2A2A2A] text-white border-white/10"
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
