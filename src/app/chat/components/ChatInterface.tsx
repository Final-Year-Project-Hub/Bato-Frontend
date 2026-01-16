"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  ArrowUp,
  User,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
} from "lucide-react";
import Image from "next/image";
import LogoutModal from "./LogoutModal";
import { useRouter } from "next/navigation";

const TITLES = [
  { normal: "Ready to Unlock ", highlight: "New Knowledge?" },
  { normal: "Ready to Learn ", highlight: "Something New?" },
  { normal: "Ask Me Anything, ", highlight: "Anytime!!" },
  { normal: "Level Up Your ", highlight: "Skills Today!!" },
];

interface ChatInterfaceProps {
  currentTitleIndex?: number;
}

export default function ChatInterface({
  currentTitleIndex = 0,
}: ChatInterfaceProps) {
  const [open, setOpen] = useState(false);
  const [typedLength, setTypedLength] = useState(0);
  const [showLogout, setShowLogout] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const { fullText, normalLength } = useMemo(() => {
    const safeIndex =
      currentTitleIndex >= 0 && currentTitleIndex < TITLES.length
        ? currentTitleIndex
        : 0;
    const { normal, highlight } = TITLES[safeIndex];
    return { fullText: normal + highlight, normalLength: normal.length };
  }, [currentTitleIndex]);

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

  return (
  <main className="relative flex flex-col h-full min-h-dvh bg-[#232323]">



      {/* ===== Mobile Sidebar Button ===== */}
     <button
  onClick={() => window.dispatchEvent(new Event("open-sidebar"))}
  className="md:hidden fixed top-4 left-4 z-50 text-white"
>
  <Menu size={22} />
</button>


      {/* ===== Top Right Menu ===== */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 text-white/80 hover:text-white"
        >
          <User size={18} />
          <ChevronDown size={14} />
        </button>

        {open && (
          <div className="absolute right-0 mt-3 w-40 bg-[#2A2A2A] border border-white/10 rounded-lg shadow-lg">
            <button
              onClick={() => router.push("./dashboard")}
              className="w-full px-4 py-2 flex gap-2 text-sm text-white/80 hover:bg-white/5"
            >
              <LayoutDashboard size={16} /> Dashboard
            </button>
            <button
              onClick={() => {
                setOpen(false);
                setShowLogout(true);
              }}
              className="w-full px-4 py-2 flex gap-2 text-sm text-white/80 hover:bg-white/5"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        )}
      </div>

      {/* ===== Center ===== */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-2">
        <p className="text-[#DDDDDD] text-[18px] sm:text-[20px] text-center">
          <span>{typedText.slice(0, normalLength)}</span>
          <span className="text-[#E96559]">
            {typedText.slice(normalLength)}
          </span>
          {typedLength < fullText.length && (
            <span className="animate-blink">|</span>
          )}
        </p>

        <div className="flex items-center gap-3 w-full max-w-150 sm:max-w-175 md:max-w-200 h-12 bg-[#2A2A2A] rounded-full px-4 border border-white/10">
          <Image
            src="/images/bato.png"
            alt="Bato"
            width={32}
            height={32}
          />
          <input
            placeholder="Ask me a Roadmap"
            className="flex-1 bg-transparent outline-none text-sm sm:text-base text-white placeholder:text-gray-400"
          />
          <button className="bg-[#E96559] rounded-full p-2">
            <ArrowUp size={18} className="text-[#282828]" />
          </button>
        </div>
      </div>

      <LogoutModal
        open={showLogout}
        onClose={() => setShowLogout(false)}
        onConfirm={() => setShowLogout(false)}
      />

      <style jsx>{`
        @keyframes blink {
          0%, 50%, 100% { opacity: 1; }
          25%, 75% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
      `}</style>
    </main>
  );
}
