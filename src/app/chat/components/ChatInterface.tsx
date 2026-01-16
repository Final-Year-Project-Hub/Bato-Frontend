"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { ArrowUp, User, ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import Image from "next/image";
import LogoutModal from "./LogoutModal";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";


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
  const router = useRouter();

  const { fullText, normalLength } = useMemo(() => {
    const safeIndex = currentTitleIndex >= 0 && currentTitleIndex < TITLES.length ? currentTitleIndex : 0;
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

  const handleLogout = () => {
    setShowLogout(false);
    // add actual logout logic here
  };

  return (
    <main className="flex-1 relative flex flex-col bg-grey p-4 sm:p-6">
      {/* Top Right Menu */}
      <div className="absolute top-4 right-4 sm:right-6 z-20 flex items-center gap-3">
  {/* Theme toggle on the left */}
  <ThemeToggle />

  {/* User menu */}
  <button
    onClick={() => setOpen(!open)}
    className="flex items-center gap-2 text-popover-foreground hover:opacity-80"
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

      {/* Center */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 sm:gap-6">
        <p className="text-blue text-[18px] sm:text-[20px] text-center px-2 sm:px-0">
          <span>{typedText.slice(0, normalLength)}</span>
          <span className="text-[#E96559]">{typedText.slice(normalLength)}</span>
          {typedLength < fullText.length && <span className="animate-blink">|</span>}
        </p>

        <div className="flex items-center gap-2 sm:gap-3 w-full max-w-150 h-12 sm:h-12.5  rounded-full px-4 sm:px-5 border border-okay">
          {/* ✅ Fixed Next.js Image */}
          <Image
            src="/images/bato.png"
            alt="Bato"
            width={32}
            height={32}
            style={{ objectFit: "contain", width: "32px", height: "32px" }}
          />
          <input
            placeholder="Ask me a Roadmap"
            className="flex-1 bg-transparent outline-none text-sm sm:text-base text-blue placeholder:text-gray"
          />
          <button className="bg-[#E96559] rounded-full p-2 sm:p-2.5 shrink-0">
            <ArrowUp size={20} className="text-grey" />
          </button>
        </div>
      </div>

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
