"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo, useEffect, useState } from "react";
import ChatInterface from "../components/ChatInterface";
import { useAuth } from "@/app/features/auth/hooks/useAuth";
import { toast } from "sonner";

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const { user, refresh } = useAuth();
  const [isReady, setIsReady] = useState(false);
  
  const initialChatId = useMemo(() => {
    const chatIdParam = params?.chatId;
    if (Array.isArray(chatIdParam)) {
      return chatIdParam[0] ?? null;
    }
    if (typeof chatIdParam === "string") {
      return chatIdParam;
    }
    return null;
  }, [params?.chatId]);

  useEffect(() => {
    const init = async () => {
      if (!user) {
        try {
          await refresh();
          
          // Show welcome only after Google login
          if (sessionStorage.getItem('google_login_flow')) {
            toast.success("Welcome to bato.ai!", {
              description: "You're successfully logged in",
            });
            sessionStorage.removeItem('google_login_flow');
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          
          // Only redirect if not from Google login
          if (!sessionStorage.getItem('google_login_flow')) {
            router.push("/chat");
            return;
          }
        }
      }
      setIsReady(true);
    };

    init();
  }, [user, refresh, router]);

  if (!isReady) {
    return (
      <div className="flex min-h-screen bg-background items-center justify-center">
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
          <p className="text-sm text-muted-foreground">Loading your chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground overflow-hidden">
      <ChatInterface initialChatId={initialChatId} />
    </div>
  );
}