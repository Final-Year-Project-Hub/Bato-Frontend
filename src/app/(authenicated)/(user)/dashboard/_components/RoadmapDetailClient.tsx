"use client";

import { useEffect, useState } from "react";
import RoadmapDetail from "./RoadmapDetail";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://bato-backend-a9x8.onrender.com";

export default function RoadmapDetailClient({ roadmapId }: { roadmapId: string }) {
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const res = await fetch(`${baseUrl}/api/roadmap/${roadmapId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          const msg = await res.text().catch(() => "");
          throw new Error(`${res.status} ${res.statusText} ${msg}`);
        }

        const json = await res.json();

        const roadmapData = json?.roadmapData;

        if (!roadmapData?.phases) {
          console.log("Unexpected roadmap response:", json);
          throw new Error("roadmapData missing or invalid");
        }

        if (!cancelled) setData(roadmapData);
      } catch (e: any) {
        if (!cancelled) setErr(e?.message || "Failed to load roadmap");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [roadmapId]);

  if (loading) return <div className="text-white/70">Loading roadmap…</div>;
  if (err) return <div className="text-red-400">Error: {err}</div>;
  if (!data) return <div className="text-white/70">No roadmap found.</div>;

  return <RoadmapDetail data={data} />;
}
