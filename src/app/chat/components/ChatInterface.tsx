"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { ArrowUp, User, ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import Image from "next/image";
import LogoutModal from "./LogoutModal";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/features/auth/hooks/useAuth";
import { useHealth } from "@/lib/hooks/useHealth";
import { useChat } from "@/lib/hooks/useChat";
import { useRoadmapStream } from "@/lib/hooks/useRoadmapStream";

type ChatMsg = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: number;
};

const TITLES = [
  { normal: "Ready to Unlock ", highlight: "New Knowledge?" },
  { normal: "Ready to Learn ", highlight: "Something New?" },
  { normal: "Ask Me Anything, ", highlight: "Anytime!!" },
  { normal: "Level Up Your ", highlight: "Skills Today!!" },
];

interface ChatInterfaceProps {
  currentTitleIndex?: number;
}

export default function ChatInterface({ currentTitleIndex = 0 }: ChatInterfaceProps) {
  const [open, setOpen] = useState(false);
  const [typedLength, setTypedLength] = useState(0);
  const [showLogout, setShowLogout] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { startStream, isStreaming } = useRoadmapStream();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // chat state
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([]);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const { status: healthStatus } = useHealth();
  const { startChat, addMessage } = useChat();
  const router = useRouter();
  const auth = useAuth();
  const jsonBufferRef = useRef("");
  const jsonModeRef = useRef(false);
  const renderedRoadmapRef = useRef(false);

  const { fullText, normalLength } = useMemo(() => {
    const safeIndex = currentTitleIndex >= 0 && currentTitleIndex < TITLES.length ? currentTitleIndex : 0;
    const { normal, highlight } = TITLES[safeIndex];
    return { fullText: normal + highlight, normalLength: normal.length };
  }, [currentTitleIndex]);

  // typing effect
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTypedLength(0);
    let i = 0;
    intervalRef.current = setInterval(() => {
      if (i >= fullText.length) {
        clearInterval(intervalRef.current!);
        return;
      }
      i++;
      setTypedLength(i);
    }, 50);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fullText]);

  const typedText = fullText.slice(0, typedLength);

  // auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, loading]);

  const handleLogout = () => {
    setShowLogout(false);
  };

  // small helper for ids
  const uid = () =>
    typeof crypto !== "undefined"
      ? crypto.randomUUID()
      : String(Date.now() + Math.random());

  const sendMessage = async () => {
    if (!message.trim() || loading || isStreaming) return;

    const text = message.trim();
    setMessage("");
    setLoading(true);

    const thinkingId = uid();
    const userTempId = uid();

    // optimistic UI
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

    // IMPORTANT: build history from a local snapshot (prev + this user msg)
    const nextHistory = [...messages, optimisticUser].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      let currentChatId = chatId;

      // 1) Ensure chat exists
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
        // If chat already exists, persist the user message
        await addMessage(currentChatId, { role: "user", content: text });
      }

      // 2) Stream assistant
      let roadmapId: string | undefined;
      let assistantText = "";

      let rawStream = ""; // accumulates EVERYTHING coming from AI
      let humanText = ""; // normal assistant text (if not JSON)
      await startStream({
        message: text,
        chatSessionId: currentChatId,
        conversation_history: nextHistory,
        strictMode: false,

        onRawChunk: (c) => console.log("[SSE raw chunk]", c),

        onRoadmapId: (id) => {
          roadmapId = id;
        },

        onToken: (t) => {
          console.log("[SSE token]", t);

          // t should be plain text ONLY
          assistantText += t;

          setMessages((prev) =>
            prev.map((m) =>
              m.id === thinkingId ? { ...m, content: assistantText } : m,
            ),
          );
        },
        onStatus: (s) => {
          console.log("[SSE status]", s);
          // optional: show status somewhere or ignore
          // console.log("status:", s);
        },

        onError: (err) => {
          console.log("[SSE error]", err);
          setMessages((prev) =>
            prev.map((m) => (m.id === thinkingId ? { ...m, content: err } : m)),
          );
        },
      });

      if (assistantText.trim()) {
        await addMessage(currentChatId, {
          role: "assistant",
          content: assistantText,
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
    } catch (e: any) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === thinkingId ? { ...m, content: e?.message || "Error" } : m,
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  const tryRoadmapTitles = (raw: string) => {
    // handle ```json ... ``` too
    let t = raw.trim();
    t = t
      .replace(/^```json/i, "")
      .replace(/```$/, "")
      .trim();

    // quick reject
    if (!t.startsWith("{")) return null;

    try {
      const obj = JSON.parse(t);

      if (!obj?.phases || !Array.isArray(obj.phases)) return null;

      const lines: string[] = [];

      lines.push(`Roadmap: ${obj.goal ?? "Your goal"}`);
      lines.push("");

      obj.phases.forEach((p: any, i: number) => {
        lines.push(`${p.title ?? "Untitled"}`);

        const topics = Array.isArray(p.topics) ? p.topics : [];
        for (const topic of topics) {
          if (topic?.title) lines.push(`  • ${topic.title}`);
        }

        lines.push("");
      });

      return lines.join("\n").trim();
    } catch {
      return null;
    }
  };

  const roadmapTitlesFromJson = (jsonText: string) => {
    const obj = JSON.parse(jsonText);
    if (!obj?.phases || !Array.isArray(obj.phases)) return null;

    const lines: string[] = [];

    lines.push(`Roadmap: ${obj.goal ?? "Your goal"}`);
    lines.push(""); // blank line

    obj.phases.forEach((p: any, i: number) => {
      lines.push(`Phase ${i + 1}: ${p.title}`);
      const topics = Array.isArray(p.topics) ? p.topics : [];

      topics.forEach((t: any) => {
        if (t?.title) lines.push(`  • ${t.title}`);
      });

      lines.push(""); // blank line between phases
    });

    return lines.join("\n");
  };

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
    <main className="flex-1 relative flex flex-col bg-grey p-4 sm:p-6">
      {/* Top Right Menu */}
      <div className="absolute top-4 right-6 z-20 flex items-center">
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
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 text-white/80 hover:text-white"
        >
          <User size={18} />
          <ChevronDown size={14} />
        </button>

  {open && (
    <div className="absolute right-0 top-full mt-3 w-40 bg-grey border border-border rounded-lg shadow-lg">
      <button
        onClick={() => router.push("./dashboard")}
        className="w-full px-4 py-2 flex gap-2 text-sm text-accent-foreground hover:bg-white/5"
      >
        <LayoutDashboard size={16} /> Dashboard
      </button>

      <button
        onClick={() => {
          setOpen(false);
          setShowLogout(true);
        }}
        className="w-full px-4 py-2 flex gap-2 text-sm text-accent-foreground hover:bg-white/5"
      >
        <LogOut size={16} /> Logout
      </button>
    </div>
  )}
</div>

      {/* Title (show only when no messages yet, like a landing state) */}
      {messages.length === 0 && (
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
          {/* INPUT IN THE CENTER AT FIRST */}
          {renderChatInput()}
        </div>
      )}

      {/* Chat messages area */}
      {messages.length > 0 && (
        <>
          {/* Messages (scrollable) */}
          <div className="flex-1 overflow-y-auto pr-2 pt-10">
            <div className="max-w-3xl mx-auto space-y-3">
              {messages.map((m) => (
                <ChatBubble key={m.id} role={m.role} content={m.content} />
              ))}
              <div ref={bottomRef} />
            </div>
          </div>

          {/* Input (pinned at bottom) */}
          <div className="mt-4 flex items-center justify-center">
            {renderChatInput()}
          </div>
        </>
      )}

      <LogoutModal open={showLogout} onClose={() => setShowLogout(false)} onConfirm={handleLogout} />

      <style jsx>{`
        @keyframes blink {
          0%, 50%, 100% { opacity: 1; }
          25%, 75% { opacity: 0; }
        }
        .animate-blink { animation: blink 1s infinite; }
      `}</style>
    </main>
  );
}

function ChatBubble({
  role,
  content,
}: {
  role: "user" | "assistant";
  content: string;
}) {
  const isUser = role === "user";
  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed border ${
          isUser
            ? "bg-[#E96559] text-foreground border-white/10"
            : "bg-[#2A2A2A] text-white border-white/10"
        }`}
      >
        {content}
      </div>
    </div>
  );
}

function extractRoadmapLiveSummary(raw: string) {
  // remove ```json fences if present
  const text = raw.replace(/```json|```/g, "").trim();

  // goal
  const goalMatch = text.match(/"goal"\s*:\s*"([^"]+)"/);
  const goal = goalMatch?.[1];

  // phase titles (works even on partial JSON)
  const phaseTitleMatches = [...text.matchAll(/"title"\s*:\s*"([^"]+)"/g)].map(
    (m) => m[1],
  );

  // We only want phase titles + topic titles, but JSON contains MANY "title".
  // Trick: phases are like: "phases":[ { "title":"Phase 1..."
  // We'll detect Phase titles by "Phase" prefix or by position.
  const phaseTitles = phaseTitleMatches.filter((t) =>
    /^Phase\s*\d+\s*:/i.test(t),
  );

  // topics: after phase title, topic titles usually don't start with "Phase"
  const topicTitles = phaseTitleMatches.filter(
    (t) => !/^Phase\s*\d+\s*:/i.test(t),
  );

  // Build summary in readable form
  const lines: string[] = [];
  if (goal) {
    lines.push(`Roadmap: ${goal}`);
    lines.push("");
  } else {
    lines.push(`Roadmap: ...`);
    lines.push("");
  }

  // If we have phase titles, print them
  if (phaseTitles.length) {
    // For each phase, try to attach first 2 topics (optional nice UX)
    // We can't reliably map topics to phases from partial JSON without full parse,
    // so we just list phase titles live.
    phaseTitles.forEach((pt) => {
      const clean = pt.replace(/^Phase\s*\d+:\s*/i, "").trim();
      // keep original numbering from pt
      const numMatch = pt.match(/^Phase\s*(\d+)/i);
      const n = numMatch?.[1] ?? "";
      lines.push(`Phase ${n}: ${clean}`);
    });
  } else {
    lines.push("Generating phases...");
  }

  return lines.join("\n");
}
