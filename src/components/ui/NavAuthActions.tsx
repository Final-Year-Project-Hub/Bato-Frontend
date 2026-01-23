"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SquarePen } from "lucide-react";

export default function NavAuthActions() {
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        setIsAuthed(res.ok);
      } catch {
        setIsAuthed(false);
      }
    };
    check();
  }, []);

  // Prevent flicker
  if (isAuthed === null) return null;

  if (isAuthed) {
    return (
      <Button
        className="px-3 py-3 font-semibold flex items-center gap-2"
        onClick={() => router.push("/chat")}
      >
        <SquarePen size={16} />
        New Chat
      </Button>
    );
  }

  return (
    <div className="flex gap-6 items-center">
      <Link href="/login" className="text-foreground hover:text-primary">
        Login
      </Link>
      <Link href="/signup">
        <Button className="px-2 py-3 font-semibold">Sign Up</Button>
      </Link>
    </div>
  );
}
