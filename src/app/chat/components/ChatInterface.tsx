"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { ArrowUp, User, ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import LogoutModal from "./LogoutModal";
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
  const router = useRouter();
  const auth = useAuth();
  const { status: healthStatus } = useHealth();
  const { startChat, addMessage } = useChat();
  const { startStream, isStreaming } = useRoadmapStream();

  const [openMenu, setOpenMenu] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([]);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const titleIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [typedLength, setTypedLength] = useState(0);

  const roadmapBufRef = useRef("");
  const roadmapModeRef = useRef(false);

  const { fullText, normalLength } = useMemo(() => {
    const safeIndex = currentTitleIndex >= 0 && currentTitleIndex < TITLES.length ? currentTitleIndex : 0;
    const { normal, highlight } = TITLES[safeIndex];
    return { fullText: normal + highlight, normalLength: normal.length };
  }, [currentTitleIndex]);

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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, loading]);

  const uid = () =>
    typeof crypto !== "undefined" ? crypto.randomUUID() : String(Date.now() + Math.random());

  const formatRoadmapTitles = (raw: string) => {
    const cleaned = raw.replace(/```json|```/g, "");

    const goal = cleaned.match(/"goal"\s*:\s*"([^"]+)"/)?.[1] ?? "…";

    const phaseTitles = [...cleaned.matchAll(/"title"\s*:\s*"([^"]+)"/g)]
      .map((m) => m[1])
      .filter((t) => /^Phase\s*\d+\s*:/i.test(t));

    const lines: string[] = [];
    lines.push(`Roadmap: ${goal}`);
    lines.push("");

    if (phaseTitles.length === 0) {
      lines.push("Generating phases...");
      return lines.join("\n");
    }

    for (const pt of phaseTitles) {
      const num = pt.match(/^Phase\s*(\d+)/i)?.[1] ?? "";
      const name = pt.replace(/^Phase\s*\d+\s*:\s*/i, "").trim();
      lines.push(`Phase ${num}: ${name}`);
      lines.push("");
    }

    return lines.join("\n").trimEnd();
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

    const nextHistory = [...messages, optimisticUser].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      let currentChatId = chatId;

      if (!currentChatId) {
        const res = await startChat({ initialMessage: text, userId: auth?.user?.id });

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

      await startStream({
        message: text,
        chatSessionId: currentChatId,
        conversation_history: nextHistory,
        strictMode: false,

        onRoadmapId: (id) => {
          roadmapId = id;
        },

        onToken: (t) => {
          if (!roadmapModeRef.current) {
            const hint = t.trim();
            if (hint.startsWith("{") || hint.startsWith("```json") || hint.includes('"phases"')) {
              roadmapModeRef.current = true;
            }
          }

          if (roadmapModeRef.current) {
            roadmapBufRef.current += t;
            const live = formatRoadmapTitles(roadmapBufRef.current);

            setMessages((prev) =>
              prev.map((m) => (m.id === thinkingId ? { ...m, content: live } : m)),
            );
            return;
          }

          assistantText += t;
          setMessages((prev) =>
            prev.map((m) => (m.id === thinkingId ? { ...m, content: assistantText } : m)),
          );
        },

        onError: (err) => {
          setMessages((prev) =>
            prev.map((m) => (m.id === thinkingId ? { ...m, content: err } : m)),
          );
        },
      });

      const finalStored =
        roadmapModeRef.current && roadmapBufRef.current.trim()
          ? roadmapBufRef.current
          : assistantText;

      if (finalStored.trim()) {
        await addMessage(currentChatId, {
          role: "assistant",
          content: finalStored,
          roadmapId,
        });
      } else {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === thinkingId ? { ...m, content: "No response from AI. Try again." } : m,
          ),
        );
      }
    } catch (e: any) {
      setMessages((prev) =>
        prev.map((m) => (m.id === thinkingId ? { ...m, content: e?.message || "Error" } : m)),
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
          onClick={() => setOpenMenu((v) => !v)}
          className="flex items-center gap-2 text-white/80 hover:text-white"
        >
          <User size={18} />
          <ChevronDown size={14} />
        </button>

        {openMenu && (
          <div className="absolute right-0 mt-3 w-40 bg-[#2A2A2A] border border-white/10 rounded-lg shadow-lg">
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
            <span className="text-[#DDDDDD]">{typedText.slice(0, normalLength)}</span>
            <span className="text-[#E96559]">{typedText.slice(normalLength)}</span>
            {typedLength < fullText.length && <span className="animate-blink">|</span>}
          </p>
          {renderChatInput()}
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto pr-2 pt-10">
            <div className="max-w-3xl mx-auto space-y-3">
              {messages.map((m) => (
                <ChatBubble key={m.id} role={m.role} content={m.content} />
              ))}
              <div ref={bottomRef} />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center">{renderChatInput()}</div>
        </>
      )}

      <LogoutModal open={showLogout} onClose={() => setShowLogout(false)} onConfirm={() => {}} />

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

function ChatBubble({ role, content }: { role: "user" | "assistant"; content: string }) {
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
