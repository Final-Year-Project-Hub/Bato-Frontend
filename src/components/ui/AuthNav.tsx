"use client";

import { useRouter } from "next/navigation";
import { MessageCircleMore } from "lucide-react";
import { Button } from "./button";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/app/features/auth/hooks/useAuth";

export default function AuthNav() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <nav className="shadow-sm relative flex justify-between items-center px-4 py-4 mx-auto bg-background border-b border-b-white/25">
      <div className="my-container w-full h-full flex justify-between items-center z-50">
        <div>
          <p className="text-primary text-2xl font-bold">Dashboard</p>
          <p>Welcome Back, {user?.name|| user?.email }</p>
        </div>

        <div className="flex items-center gap-6">
          {user && (
            <Button onClick={() => router.push("/chat")}>
              <MessageCircleMore /> New Chat
            </Button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
