"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function TokenBootstrap() {
  const sp = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const accessToken = sp.get("accessToken");
    const refreshToken = sp.get("refreshToken");
    if (!accessToken || !refreshToken) return;

    (async () => {
      await fetch("/api/session/set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken, refreshToken }),
      });

      const next = new URLSearchParams(sp.toString());
      next.delete("accessToken");
      next.delete("refreshToken");

      // go to chat after setting cookies
      router.replace(`/chat${next.toString() ? `?${next.toString()}` : ""}`);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
